import { Vector2 } from "three";
import { getCurrentState } from "../stateUtil";
import {
  POP_ACTION,
  POP_STATE,
  POP_JOB_ACTION,
  POP_JOB_STATE
} from "./PopMachine";
import { getResources } from "../resource/selectors";
import { resourceService } from "../resource/ResourcesMachine";
import { buildingsService } from "../building/BuildingsMachine";
import { calculateDistance } from "../util";

export class Pop {
  constructor(id, service) {
    this.id = id;
    this.service = service;
  }

  update(delta) {
    let job = this.job;

    if (!job) {
      // return;
    }

    this.updateWorker(delta);
  }

  updateWorker(delta) {
    let state = this.state;

    console.log(state);

    if (state === POP_STATE.IDLE) {
      let allBuildings = buildingsService.state.context.buildings;
      let lumberjack = allBuildings.filter(
        building => building.type === "lumberjack"
      )[0];
      return this.assignJob(lumberjack, "lumberjack");
    }

    if (state === `${POP_STATE.JOB}.${POP_JOB_STATE.IDLE}`) {
      return this.startSearching();
    }

    if (state === `${POP_STATE.JOB}.${POP_JOB_STATE.SEARCHING}`) {
      let resources = getResources(resourceService);
      let job = this.job;
      if (job.job === "lumberjack") {
        resources = resources.filter(resource => resource.type === "tree");
      }
      if (resources.length === 0) {
        return this.rest();
      }
      resources = this.sortByDistance(resources);
      let target = resources[0];
      return this.goToTarget(target);
    }

    if (state === `${POP_STATE.JOB}.${POP_JOB_STATE.GOING_TO_TARGET}`) {
      let { x, y, target } = this;
      let angle = new Vector2(target.x, target.y)
        .sub(new Vector2(x, y))
        .angle();
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);
      let distance = calculateDistance({ x, y }, { x: target.x, y: target.y });
      if (distance > 0.5) {
        this.move(cos * delta * 5, sin * delta * 5);
      } else {
        this.arriveAtTarget();
      }
    }

    if (state === `${POP_STATE.JOB}.${POP_JOB_STATE.WORKING}`) {
      let { progress } = this.job;
      if (progress < 5) {
        this.workProgress(progress + delta);
      } else {
        this.rest();
      }
    }
  }

  assignJob(building, job) {
    this.service.send({
      type: POP_ACTION.ASSIGN_JOB,
      data: { building, job, progress: 0 }
    });
    building.assignPopToJob(this, job);
  }

  startSearching() {
    this.service.send(POP_JOB_ACTION.START_SEARCHING);
  }

  rest() {
    this.service.send(POP_ACTION.REST);
  }

  goToTarget(target) {
    return this.service.send({
      type: POP_JOB_ACTION.TARGET_FOUND,
      data: target
    });
  }

  move(x, y) {
    this.service.send({
      type: POP_ACTION.MOVE,
      data: { x, y }
    });
  }

  arriveAtTarget() {
    this.service.send(POP_JOB_ACTION.ARRIVED_AT_TARGET);
  }

  workProgress(progress) {
    this.service.send({ type: POP_JOB_ACTION.WORK_PROGRESS, data: progress });
  }

  sortByDistance(resources) {
    let copy = [...resources];
    copy.sort((a, b) => {
      let distanceFromA = calculateDistance(this, { x: a.x, y: a.y });
      let distanceFromB = calculateDistance(this, { x: b.x, y: b.y });
      return distanceFromA - distanceFromB;
    });
    return copy;
  }

  get x() {
    return this._context.x;
  }

  get y() {
    return this._context.y;
  }

  get type() {
    return this._context.type;
  }

  get textureName() {
    return this._context.textureName;
  }

  get target() {
    return this._context.target;
  }

  get job() {
    return this._context.job;
  }

  get _context() {
    return this.service.state.context;
  }

  get state() {
    return getCurrentState(this.service.state.value);
  }
}
