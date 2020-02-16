import { assign, Machine } from "xstate";

const BUILDING_STATE = {
  IDLE: "IDLE"
};

const BUILDING_ACTIONS = {
  ASSIGN_POP_TO_JOB: "ASSIGN_POP_TO_JOB"
};

let buildingMachine = Machine({
  id: "building",
  initial: BUILDING_STATE.IDLE,
  context: {
    x: null,
    y: null,
    texture: null,
    type: null,
    jobs: []
  },
  states: {
    [BUILDING_STATE.IDLE]: {}
  },
  on: {
    [BUILDING_ACTIONS.ASSIGN_POP_TO_JOB]: {
      actions: assign({
        jobs: (context, event) => {
          let { pop, jobIndex } = event.data;
          let jobs = [...context.jobs];
          let job = jobs[jobIndex];
          job.worker = pop;
          return jobs;
        }
      })
    }
  }
});

export { BUILDING_STATE, BUILDING_ACTIONS, buildingMachine };
