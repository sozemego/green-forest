import { assign, Interpreter, Machine } from "xstate";
import { HasPosition } from "../util";
import { Building } from "../building/Building";

let POP_STATE = {
  IDLE: "IDLE",
  JOB: "JOB"
} as const;

let POP_ACTION = {
  ASSIGN_JOB: "ASSIGN_JOB",
  REST: "REST",
  MOVE: "MOVE"
} as const;

let POP_JOB_STATE = {
  IDLE: "IDLE",
  SEARCHING: "SEARCHING",
  GOING_TO_TARGET: "GOING_TO_TARGET",
  WORKING: "WORKING"
} as const;

let POP_JOB_ACTION = {
  START_SEARCHING: "START_SEARCHING",
  TARGET_FOUND: "TARGET_FOUND",
  ARRIVED_AT_TARGET: "ARRIVED_AT_TARGET",
  WORK_PROGRESS: "WORK_PROGRESS"
};

interface PopJobSchema {
  states: {
    [POP_JOB_STATE.IDLE]: {};
    [POP_JOB_STATE.GOING_TO_TARGET]: {};
    [POP_JOB_STATE.SEARCHING]: {};
    [POP_JOB_STATE.WORKING]: {};
  };
}

let jobMachine = {
  initial: POP_JOB_STATE.IDLE,
  states: {
    [POP_JOB_STATE.IDLE]: {
      on: {
        [POP_JOB_ACTION.START_SEARCHING]: {
          target: POP_JOB_STATE.SEARCHING
        }
      }
    },
    [POP_JOB_STATE.SEARCHING]: {
      on: {
        [POP_JOB_ACTION.TARGET_FOUND]: {
          target: POP_JOB_STATE.GOING_TO_TARGET
        }
      }
    },
    [POP_JOB_STATE.GOING_TO_TARGET]: {
      entry: assign<PopContext, PopJobGoToTarget>({
        target: (context, event: PopJobGoToTarget) => event.target
      }),
      on: {
        [POP_JOB_ACTION.ARRIVED_AT_TARGET]: {
          target: POP_JOB_STATE.WORKING
        }
      }
    },
    [POP_JOB_STATE.WORKING]: {
      on: {
        [POP_JOB_ACTION.WORK_PROGRESS]: {
          actions: assign<PopContext, PopJobWorkProgress>({
            job: (context: PopContext, event: PopJobWorkProgress) => {
              let { job } = context;
              if (job) {
                job.progress = event.progress;
              }
              return job;
            }
          })
        }
      }
    }
  }
};

interface PopSchema {
  states: {
    [POP_STATE.IDLE]: {};
    [POP_STATE.JOB]: PopJobSchema;
  };
}

export interface PopJob {
  building: Building;
  jobIndex: number;
  progress: number;
}

interface PopContext {
  id: string;
  x: number;
  y: number;
  textureName: string;
  job: PopJob | null;
  target: HasPosition | null;
}

type PopAssignJobAction = { type: typeof POP_ACTION.ASSIGN_JOB; job: any };
type PopMoveAction = { type: typeof POP_ACTION.MOVE; x: number; y: number };
type PopJobStartSearchingAction = {
  type: typeof POP_JOB_ACTION.START_SEARCHING;
};
type PopJobGoToTarget = {
  type: typeof POP_JOB_ACTION.START_SEARCHING;
  target: HasPosition;
};
type PopJobWorkProgress = {
  type: typeof POP_JOB_ACTION.WORK_PROGRESS;
  progress: number;
};

type PopAction =
  | PopAssignJobAction
  | PopMoveAction
  | PopJobStartSearchingAction
  | PopJobGoToTarget
  | PopJobWorkProgress;

export type PopActor = Interpreter<PopContext, PopSchema, PopAction>;

let popMachine = Machine<PopContext, PopSchema, PopAction>({
  id: "pop",
  initial: POP_STATE.IDLE,
  context: {
    id: "init",
    x: 0,
    y: 0,
    textureName: "init.png",
    job: null,
    target: null
  },
  states: {
    [POP_STATE.IDLE]: {
      entry: assign({
        job: (ctx, event) => null,
        target: (ctx, event) => null
      }),
      on: {
        [POP_ACTION.ASSIGN_JOB]: {
          actions: assign<PopContext, PopAssignJobAction>({
            job: (ctx: PopContext, e: PopAssignJobAction) => e.job
          }),
          target: POP_STATE.JOB
        }
      }
    },
    [POP_STATE.JOB]: jobMachine
  },
  on: {
    [POP_ACTION.REST]: POP_STATE.IDLE,
    [POP_ACTION.MOVE]: {
      actions: assign((context: PopContext, event: PopMoveAction) => {
        return {
          x: context.x + event.x,
          y: context.y + event.y
        };
      })
    }
  }
});

export { POP_STATE, POP_ACTION, POP_JOB_ACTION, POP_JOB_STATE, popMachine };
