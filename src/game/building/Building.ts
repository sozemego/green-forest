import { BUILDING_ACTION, BuildingActor } from "./BuildingMachine";
import { Pop } from "../population/Pop";

export class Building {
  readonly id: string;
  readonly service: BuildingActor;

  constructor(id: string, service: BuildingActor) {
    this.id = id;
    this.service = service;
  }

  assignPopToJob(pop: Pop, jobIndex: number) {
    this.service.send({
      type: BUILDING_ACTION.ASSIGN_POP_TO_JOB,
      pop,
      jobIndex
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

  get jobs() {
    return this._context.jobs;
  }

  get _context() {
    return this.service.state.context;
  }
}
