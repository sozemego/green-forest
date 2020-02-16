import {
  RESOURCE_ACTION,
  RESOURCE_STATE,
  ResourceActor
} from "./ResourceMachine";
import { getCurrentState } from "../stateUtil";

export class Resource {
  readonly id: string;
  readonly service: ResourceActor;

  constructor(id: string, service: ResourceActor) {
    this.id = id;
    this.service = service;
  }

  modifyResources(resource: string, change: number) {
    this.service.send({
      type: RESOURCE_ACTION.MODIFY_RESOURCES,
      resource,
      change
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

  private get _context() {
    return this.service.state.context;
  }
}
