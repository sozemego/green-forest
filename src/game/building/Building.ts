import { Interpreter } from "xstate";
import { BUILDING_ACTIONS } from "./BuildingMachine";
import { Pop } from "../population/Pop";

export class Building {

  readonly id: string;
  readonly service: Interpreter<BuildingContext>;

  constructor(id: string, service: Interpreter<BuildingContext>) {
    this.id = id;
    this.service = service;
  }

  assignPopToJob(pop: Pop, jobIndex: number) {
    this.service.send({
      type: BUILDING_ACTIONS.ASSIGN_POP_TO_JOB,
      data: { pop, jobIndex }
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

  get _context(): BuildingContext {
    return this.service.state.context;
  }
}

export interface BuildingContext {
  x: number;
  y: number;
  textureName: string;
  type: string;
  jobs: any;
}
