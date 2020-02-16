import { assign, interpret, Machine, spawn } from "xstate";
import { buildingMachine } from "./BuildingMachine";
import { Building } from "./Building";

export const BUILDINGS_STATE = {
  INITIAL: "INITIAL",
  LOADING: "LOADING",
  LOADED: "LOADED"
} as const;

export const BUILDINGS_ACTION = {
  LOAD: "LOAD",
  BUILDING_CREATED: "BUILDING_CREATED"
};

interface BuildingsSchema {
  states: {
    [BUILDINGS_STATE.INITIAL]: {};
  };
}

interface BuildingsContext {
  buildings: Building[];
}

type BuildingsBuildingCreatedAction = {
  type: typeof BUILDINGS_ACTION.BUILDING_CREATED;
  building: BuildingData;
};

type BuildingsAction = BuildingsBuildingCreatedAction;

let buildingsMachine = Machine<
  BuildingsContext,
  BuildingsSchema,
  BuildingsAction
>({
  id: "buildings",
  initial: BUILDINGS_STATE.INITIAL,
  context: {
    buildings: []
  },
  states: {
    [BUILDINGS_STATE.INITIAL]: {
      on: {
        [BUILDINGS_ACTION.BUILDING_CREATED]: {
          actions: assign({
            buildings: (context, event) => {
              let buildings = [...context.buildings];
              let nextId = `${buildings.length + 1}`;
              let building = {
                ...event.building,
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

export type BuildingData = Pick<Building, "x" | "y" | "textureName" | "jobs">;

export let initialBuildings: BuildingData[] = [
  {
    x: 50,
    y: 50,
    textureName: "textures/castle_large.png",
    jobs: []
  },
  {
    x: 47,
    y: 52,
    textureName: "textures/lumberjack.png",
    jobs: [{ type: "gatherer", resource: "wood", worker: null, range: 5 }]
  }
];
