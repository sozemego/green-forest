import { assign, Machine } from "xstate";

let POP_STATE = {
  IDLE: "IDLE",
  JOB: "JOB"
};

let POP_ACTION = {
  ASSIGN_JOB: "ASSIGN_JOB",
  REST: "REST",
  MOVE: "MOVE"
};

let POP_JOB_STATE = {
  IDLE: "IDLE",
  SEARCHING: "SEARCHING",
  GOING_TO_TARGET: "GOING_TO_TARGET",
  WORKING: "WORKING"
};

let POP_JOB_ACTION = {
  START_SEARCHING: "START_SEARCHING",
  TARGET_FOUND: "TARGET_FOUND",
  ARRIVED_AT_TARGET: "ARRIVED_AT_TARGET",
  WORK_PROGRESS: "WORK_PROGRESS"
};

let workingStates = {
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
      entry: assign({
        target: (context, event) => event.data
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
          actions: assign({
            job: (context, event) => {
              let { job } = context;
              job.progress = event.data;
              return job;
            }
          })
        }
      }
    }
  }
};

let popMachine = Machine({
  id: "pop",
  initial: POP_STATE.IDLE,
  context: {
    x: 0,
    y: 0,
    textureName: null,
    job: null
  },
  states: {
    [POP_STATE.IDLE]: {
      on: {
        [POP_ACTION.ASSIGN_JOB]: {
          actions: assign({ job: (context, event) => event.data }),
          target: POP_STATE.JOB
        }
      }
    },
    [POP_STATE.JOB]: {
      ...workingStates
    }
  },
  on: {
    [POP_ACTION.REST]: POP_STATE.IDLE,
    [POP_ACTION.MOVE]: {
      actions: assign((context, event) => {
        return {
          x: context.x + event.data.x,
          y: context.y + event.data.y
        };
      })
    }
  }
});

export { POP_STATE, POP_ACTION, POP_JOB_ACTION, POP_JOB_STATE, popMachine };
