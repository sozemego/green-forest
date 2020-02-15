import { Vector2 } from "three";
import { getCurrentState } from "../stateUtil";
import {
  POP_ACTION,
  POP_STATE,
  POP_WORKING_ACTION,
  POP_WORKING_STATE
} from "./PopMachine";

export class Pop {
  constructor(id, service) {
    this.id = id;
    this.service = service;
  }

  update(delta) {
    let type = this.type;

    if (type === "worker") {
      this.updateWorker(delta);
    }
    if (type === "hauler") {
      this.updateHauler(delta);
    }
  }

  updateWorker(delta) {
    let state = this.state;

    if (state === POP_STATE.IDLE) {
      return this.startWorking();
    }

    if (state === `${POP_STATE.WORKING}.${POP_WORKING_STATE.IDLE}`) {
      return this.startSearching();
    }

    if (state === `${POP_STATE.WORKING}.${POP_WORKING_STATE.SEARCHING}`) {
      // let resources = getResources(resourceService);
      // if (resources.length === 0) {
      //   return this.rest();
      // }
      // let target = resources[0];
      // return this.goToTarget(target);
    }

    if (state === `${POP_STATE.WORKING}.${POP_WORKING_STATE.GOING_TO_TARGET}`) {
      let { x, y, target } = this;
      let angle = new Vector2(target.x, target.y)
        .sub(new Vector2(x, y))
        .angle();
      let cos = Math.cos(angle);
      let sin = Math.sin(angle);
      let distance = new Vector2(target.x, target.y).distanceTo(
        new Vector2(x, y)
      );
      if (distance > 0.5) {
        this.move(cos * delta * 5, sin * delta * 5);
      }
    }
  }

  updateHauler(delta) {}

  startWorking() {
    this.service.send(POP_ACTION.START_WORKING);
  }

  startSearching() {
    this.service.send(POP_WORKING_ACTION.START_SEARCHING);
  }

  rest() {
    this.service.send(POP_ACTION.REST);
  }

  goToTarget(target) {
    return this.service.send({
      type: POP_WORKING_ACTION.GO_TO_TARGET,
      data: target
    });
  }

  move(x, y) {
    this.service.send({
      type: POP_ACTION.MOVE,
      data: { x, y }
    });
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

  get _context() {
    return this.service.state.context;
  }

  get state() {
    return getCurrentState(this.service.state.value);
  }
}
