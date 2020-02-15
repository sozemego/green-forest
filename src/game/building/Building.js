import { BUILDING_ACTIONS } from "./BuildingMachine";

export class Building {
  constructor(id, service) {
    this.id = id;
    this.service = service;
  }

  assignPopToJob(pop, job) {
    this.service.send({
      type: BUILDING_ACTIONS.ASSIGN_POP_TO_JOB,
      data: { pop, job }
    });
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

  get type() {
    return this._context.type;
  }

  get jobs() {
    return this._context.jobs;
  }

  get _context() {
    return this.service.state.context;
  }
}
