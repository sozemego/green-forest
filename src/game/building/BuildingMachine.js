import { Machine } from "xstate";

const BUILDING_STATE = {
  IDLE: "IDLE"
};

export const BUILDING_ACTIONS = {};

export let buildingMachine = Machine(
  {
    id: "building",
    initial: BUILDING_STATE.IDLE,
    context: {
      x: null,
      y: null,
      texture: null
    },
    states: {
      [BUILDING_STATE.IDLE]: {}
    }
  },
  {
    actions: {}
  }
);
