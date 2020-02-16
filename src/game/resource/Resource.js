import { RESOURCE_ACTION, RESOURCE_STATE } from "./ResourcesMachine";
import { getCurrentState } from "../stateUtil";

export class Resource {
  constructor(id, service) {
    this.id = id;
    this.service = service;
  }

  modifyResources(resource, change) {
    this.service.send({
      type: RESOURCE_ACTION.MODIFY_RESOURCES,
      data: { resource, change }
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

  get resources() {
    return this._context.resources;
  }

  get isDead() {
    return getCurrentState(this.service.state.value) === RESOURCE_STATE.DEAD;
  }

  get _context() {
    return this.service.state.context;
  }
}
