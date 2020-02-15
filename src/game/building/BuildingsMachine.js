import { assign, interpret, Machine, spawn } from "xstate";
import { buildingMachine } from "./BuildingMachine";
import { Building } from "./Building";

export const BUILDINGS_ACTIONS = {
  LOAD: "LOAD",
  BUILDING_CREATED: "BUILDING_CREATED"
};

export const BUILDINGS_STATE = {
  INITIAL: "INITIAL",
  LOADING: "LOADING",
  LOADED: "LOADED"
};

let buildingsMachine = Machine({
  id: "buildings",
  initial: BUILDINGS_STATE.INITIAL,
  context: {
    buildings: []
  },
  states: {
    [BUILDINGS_STATE.INITIAL]: {
      on: {
        [BUILDINGS_ACTIONS.BUILDING_CREATED]: {
          actions: assign({
            buildings: (context, event) => {
              let buildings = [...context.buildings];
              let nextId = buildings.length + 1;
              let building = {
                ...event.data,
                id: nextId
              };
              return [
                ...buildings,
                new Building(
                  nextId,
                  spawn(buildingMachine.withContext(building), nextId)
                )
              ];
            }
          })
        }
      }
    }
  }
});

export let buildingsService = interpret(buildingsMachine).start();

export let initialBuildingsState = {
  buildings: [
    {
      x: 50,
      y: 50,
      textureName: "textures/castle_large.png",
      type: "castle"
    },
    {
      x: 47,
      y: 52,
      textureName: "textures/lumberjack.png",
      type: "lumberjack",
      jobs: [{ type: "lumberjack", worker: null }]
    }
  ]
};
