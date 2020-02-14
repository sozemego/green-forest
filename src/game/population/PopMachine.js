import { assign, Machine } from "xstate";

export let POP_STATE = {
  IDLE: "IDLE",
  WORKING: "WORKING"
};

export let POP_ACTION = {
  START_WORKING: "START_WORKING",
  REST: "REST",
  MOVE: "MOVE"
};

export let POP_WORKING_STATE = {
  IDLE: "IDLE",
  SEARCHING: "SEARCHING",
  GOING_TO_TARGET: "GOING_TO_TARGET"
};

export let POP_WORKING_ACTION = {
  START_SEARCHING: "START_SEARCHING",
  GO_TO_TARGET: "GO_TO_TARGET"
};

export let workingStates = {
  initial: POP_WORKING_STATE.IDLE,
  states: {
    [POP_WORKING_STATE.IDLE]: {
      on: {
        [POP_WORKING_ACTION.START_SEARCHING]: {
          target: POP_WORKING_STATE.SEARCHING
        }
      }
    },
    [POP_WORKING_STATE.SEARCHING]: {
      actions: assign({ searching: true })
    },
    [POP_WORKING_STATE.GOING_TO_TARGET]: {
      entry: assign({
        target: (context, event) => event.data
      })
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
    },
    [POP_WORKING_ACTION.GO_TO_TARGET]: {
      target: [`${POP_STATE.WORKING}.${POP_WORKING_STATE.GOING_TO_TARGET}`]
    }
  }
};

export let popMachine = Machine({
  id: "pop",
  initial: POP_STATE.IDLE,
  context: {
    x: 0,
    y: 0
  },
  states: {
    [POP_STATE.IDLE]: {
      on: {
        [POP_ACTION.START_WORKING]: {
          target: POP_STATE.WORKING
        }
      }
    },
    [POP_STATE.WORKING]: {
      ...workingStates
    }
  }
});
