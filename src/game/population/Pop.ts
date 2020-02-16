import { Vector2 } from "three";
import { getCurrentState } from "../stateUtil";
import {
  POP_ACTION,
  POP_STATE,
  POP_JOB_ACTION,
  POP_JOB_STATE,
  PopActor
} from "./PopMachine";
import { getResources } from "../resource/selectors";
import { calculateDistance, HasPosition } from "../util";
import { Resource } from "../resource/Resource";
import { Building } from "../building/Building";
import { gameService } from "../GameMachine";
import { Job } from "../building/BuildingMachine";

export class Pop {
  readonly id: string;
  readonly service: PopActor;

  constructor(id: string, service: PopActor) {
    this.id = id;
    this.service = service;
  }

  update(delta: number) {
    let job = this.job;

    if (!job) {
      // return;
    }

    this.updateWorker(delta);
  }

  updateWorker(delta: number) {
    let state = this.state;

    if (state === POP_STATE.IDLE) {
      let allBuildings = gameService.state.context.buildings;
      //this search is very wonky
      let lumberjack = allBuildings
        .filter(building => building.jobs && building.jobs.length)
        .filter(building => building.jobs[0].type === "gatherer")[0];
      return this.assignJob(lumberjack, 0);
    }

    if (state === `${POP_STATE.JOB}.${POP_JOB_STATE.IDLE}`) {
      return this.startSearching();
    }

    if (state === `${POP_STATE.JOB}.${POP_JOB_STATE.SEARCHING}`) {
      if (this.job === null) {
        return this.rest();
      }
      let resources = getResources(gameService);
      let { building, jobIndex } = this.job;
      let job = building.jobs[jobIndex];

      resources = resources.filter(resource => {
        let { resources } = resource;
        if (!resources) {
          return false;
        }
        let count = resources[job.resource!]?.count || 0;
        return count > 0;
      });
      resources = this.sortByDistance(resources, job.range, building);

      if (resources.length === 0) {
        return this.rest();
      }
      let target = resources[0];
      return this.goToTarget(target);
    }

    if (state === `${POP_STATE.JOB}.${POP_JOB_STATE.GOING_TO_TARGET}`) {
      let { x, y, target } = this;
      target = target as HasPosition;
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
      if (this.job === null) {
        return this.rest();
      }
      let { progress } = this.job;
      let { jobData, target } = this;
      if (progress < 1) {
        this.workProgress(progress + delta);
      } else {
        if (target instanceof Resource) {
          target.modifyResources(jobData.resource!, -1);
        }
        this.rest();
      }
    }
  }

  assignJob(building: Building, jobIndex: number) {
    this.service.send({
      type: POP_ACTION.ASSIGN_JOB,
      job: { building, jobIndex, progress: 0 }
    });
    building.assignPopToJob(this, jobIndex);
  }

  startSearching() {
    this.service.send(POP_JOB_ACTION.START_SEARCHING);
  }

  rest() {
    this.service.send(POP_ACTION.REST);
  }

  goToTarget(target: HasPosition) {
    return this.service.send({
      type: POP_JOB_ACTION.TARGET_FOUND,
      target
    });
  }

  move(x: number, y: number) {
    this.service.send({
      type: POP_ACTION.MOVE,
      x,
      y
    });
  }

  arriveAtTarget() {
    this.service.send(POP_JOB_ACTION.ARRIVED_AT_TARGET);
  }

  workProgress(progress: number) {
    this.service.send({ type: POP_JOB_ACTION.WORK_PROGRESS, progress });
  }

  sortByDistance(resources: Resource[], range: number, building: Building) {
    let copy = [...resources];
    copy = copy.filter(resource => {
      let distance = calculateDistance(building, {
        x: resource.x,
        y: resource.y
      });
      return distance < range;
    });
    copy.sort((a, b) => {
      let distanceFromA = calculateDistance(building, { x: a.x, y: a.y });
      let distanceFromB = calculateDistance(building, { x: b.x, y: b.y });
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

  get textureName() {
    return this._context.textureName;
  }

  get target() {
    return this._context.target;
  }

  get job() {
    return this._context.job;
  }

  get jobData(): Job {
    if (this.job === null) {
      throw new Error("Job cannot be null when getting jobData");
    }
    let { jobIndex, building } = this.job;
    return building.jobs[jobIndex];
  }

  get _context() {
    return this.service.state.context;
  }

  get state() {
    return getCurrentState(this.service.state.value);
  }
}
