import { assign, Interpreter, Machine } from "xstate";
import { Pop } from "../population/Pop";

const BUILDING_STATE = {
  IDLE: "IDLE"
} as const;

const BUILDING_ACTION = {
  ASSIGN_POP_TO_JOB: "ASSIGN_POP_TO_JOB"
};

interface BuildingSchema {
  states: {
    [BUILDING_STATE.IDLE]: {};
  };
}

export interface Job {
  type: string;
  worker: Pop | null;
  resource: string | null;
  range: number;
}

interface BuildingContext {
  name: string;
  x: number;
  y: number;
  textureName: string;
  jobs: Job[];
}

export type BuildingAssignPopToJobAction = {
  type: typeof BUILDING_ACTION.ASSIGN_POP_TO_JOB;
  pop: Pop;
  jobIndex: number;
};

export type BuildingAction = BuildingAssignPopToJobAction;

export type BuildingActor = Interpreter<
  BuildingContext,
  BuildingSchema,
  BuildingAction
>;

let buildingMachine = Machine<BuildingContext, BuildingSchema, BuildingAction>({
  id: "building",
  initial: BUILDING_STATE.IDLE,
  context: {
    name: "init",
    x: 0,
    y: 0,
    textureName: "init",
    jobs: []
  },
  states: {
    [BUILDING_STATE.IDLE]: {}
  },
  on: {
    [BUILDING_ACTION.ASSIGN_POP_TO_JOB]: {
      actions: assign({
        jobs: (context, event) => {
          let { pop, jobIndex } = event;
          let jobs = [...context.jobs];
          let job = jobs[jobIndex];
          job.worker = pop;
          return jobs;
        }
      })
    }
  }
});

export { BUILDING_STATE, BUILDING_ACTION, buildingMachine };
