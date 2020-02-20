import { assign, interpret, Interpreter, Machine, spawn } from "xstate";
import { Pop } from "./population/Pop";
import { Building } from "./building/Building";
import { Resource } from "./resource/Resource";
import { buildingMachine } from "./building/BuildingMachine";
import { resourceMachine } from "./resource/ResourceMachine";
import { popMachine } from "./population/PopMachine";
import { GameService } from "./GameService";

export let GAME_STATE = {
  NOT_STARTED: "NOT_STARTED",
  LOADING: "LOADING",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED"
} as const;

export let GAME_ACTION = {
  ADD_BUILDING: "ADD_BUILDING",
  ADD_RESOURCE: "ADD_RESOURCE",
  REMOVE_RESOURCE: "REMOVE_RESOURCE",
  ADD_POP: "ADD_POP",
  SELECT_OBJECT: "SELECT_OBJECT",
  LOAD: "LOAD",
  START: "START",
  PAUSE: "PAUSE"
};

interface GameSchema {
  states: {
    [GAME_STATE.NOT_STARTED]: {};
    [GAME_STATE.LOADING]: {};
    [GAME_STATE.PLAYING]: {};
    [GAME_STATE.PAUSED]: {};
  };
}

export interface GameContext {
  resources: Resource[];
  buildings: Building[];
  population: Pop[];
  selectedObject: any | null;
}

type GameStartAction = {
  type: typeof GAME_ACTION.START;
};

type GameLoadAction = {
  type: typeof GAME_ACTION.LOAD;
};

type GameAddBuildingAction = {
  type: typeof GAME_ACTION.ADD_BUILDING;
  building: BuildingData;
};

type GameAddResourceAction = {
  type: typeof GAME_ACTION.ADD_RESOURCE;
  resource: ResourceData;
};

type GameRemoveResourceAction = {
  type: typeof GAME_ACTION.REMOVE_RESOURCE;
  id: string;
};

type GamePopulationAddPopAction = {
  type: typeof GAME_ACTION.ADD_POP;
  pop: PopData;
};

type GameSelectObjectAction = {
  type: typeof GAME_ACTION.SELECT_OBJECT;
  object: any | null;
};

type GameAction =
  | GameStartAction
  | GameLoadAction
  | GameAddBuildingAction
  | GameAddResourceAction
  | GameRemoveResourceAction
  | GamePopulationAddPopAction
  | GameSelectObjectAction;

let gameMachine = Machine<GameContext, GameSchema, GameAction>({
  id: "game",
  initial: GAME_STATE.NOT_STARTED,
  context: {
    buildings: [],
    population: [],
    resources: [],
    selectedObject: null
  },
  states: {
    [GAME_STATE.NOT_STARTED]: {
      on: {
        [GAME_ACTION.LOAD]: {
          target: GAME_STATE.LOADING
        },
        [GAME_ACTION.START]: {
          target: GAME_STATE.PLAYING
        }
      }
    },
    [GAME_STATE.LOADING]: {},
    [GAME_STATE.PLAYING]: {
      on: {
        [GAME_ACTION.PAUSE]: {
          target: GAME_STATE.PAUSED
        }
      }
    },
    [GAME_STATE.PAUSED]: {
      on: {
        [GAME_ACTION.START]: {
          target: GAME_STATE.PLAYING
        }
      }
    }
  },
  on: {
    [GAME_ACTION.ADD_BUILDING]: {
      actions: assign<GameContext, GameAddBuildingAction>({
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
    },
    [GAME_ACTION.ADD_RESOURCE]: {
      actions: assign<GameContext, GameAddResourceAction>((context, event) => {
        let { resources } = context;
        let nextId = `${resources.length + 1}`;
        return {
          resources: [
            ...resources,
            new Resource(
              nextId,
              spawn(
                resourceMachine.withContext({
                  id: nextId,
                  ...event.resource
                }),
                nextId
              )
            )
          ]
        };
      })
    },
    [GAME_ACTION.REMOVE_RESOURCE]: {
      actions: assign({
        resources: (context, event: GameRemoveResourceAction) => {
          let resources = [...context.resources];
          let index = resources.findIndex(resource => resource.id === event.id);
          if (index > -1) {
            resources.splice(index, 1);
          }
          return resources;
        }
      })
    },
    [GAME_ACTION.ADD_POP]: {
      actions: assign<GameContext, GamePopulationAddPopAction>(
        (context, event) => {
          let population = [...context.population];
          let nextId = `${population.length + 1}`;
          let data = {
            id: nextId,
            target: null,
            ...event.pop
          };
          return {
            population: [
              ...population,
              new Pop(
                nextId,
                spawn(popMachine.withContext(data), `pop-${nextId}`)
              )
            ]
          };
        }
      )
    },
    [GAME_ACTION.SELECT_OBJECT]: {
      actions: assign<GameContext, GameSelectObjectAction>({
        selectedObject: (
          context: GameContext,
          event: GameSelectObjectAction
        ) => {
          return event.object;
        }
      })
    }
  }
});

export type GameActor = Interpreter<GameContext, GameSchema, GameAction>;

export let gameService: GameActor = interpret(gameMachine).start();

export type BuildingData = Pick<
  Building,
  "x" | "y" | "textureName" | "jobs" | "name"
>;

export function startBuildings(buildings: BuildingData[]) {
  buildings.forEach(building => {
    gameService.send({ type: GAME_ACTION.ADD_BUILDING, building });
  });
}

export let initialBuildings: BuildingData[] = [
  {
    name: "Castle",
    x: 50,
    y: 50,
    textureName: "textures/castle_large.png",
    jobs: []
  },
  {
    name: "Lumberjack",
    x: 47,
    y: 52,
    textureName: "textures/lumberjack.png",
    jobs: [
      {
        type: "gatherer",
        resource: "wood",
        worker: null,
        range: 5
      }
    ]
  }
];

export function addPops(pops: PopData[]) {
  pops.forEach(addPop);
}

export function addPop(pop: PopData) {
  gameService.send({ type: GAME_ACTION.ADD_POP, pop });
  let service = new GameService(gameService);
  service.selectedObject = service.population[service.population.length - 1];
}

export type PopData = Pick<Pop, "x" | "y" | "textureName" | "job">;

export let initialPops: PopData[] = [
  {
    x: 54.5,
    y: 48.0,
    textureName: "textures/hauler.png",
    job: null
  }
];

export function startResources(resources: ResourceData[]) {
  if (!resources) {
    resources = [];
  }

  for (let resource of resources) {
    gameService.send({
      type: GAME_ACTION.ADD_RESOURCE,
      resource: { ...resource }
    });
  }
}

export type ResourceData = Pick<
  Resource,
  "x" | "y" | "textureName" | "type" | "resources"
>;

export let initialResources: ResourceData[] = [
  {
    x: 5,
    y: 15,
    textureName: "textures/tree.png",
    type: "tree",
    resources: { wood: { max: 5, count: 5 } }
  },
  {
    x: 50,
    y: 45,
    textureName: "textures/tree.png",
    type: "tree",
    resources: { wood: { max: 5, count: 5 } }
  },
  {
    x: 51,
    y: 42,
    textureName: "textures/tree.png",
    type: "tree",
    resources: { wood: { max: 5, count: 5 } }
  },
  {
    x: 48,
    y: 55,
    textureName: "textures/tree_1.png",
    type: "tree",
    resources: { wood: { max: 5, count: 5 } }
  },
  {
    x: 49,
    y: 49,
    textureName: "textures/tree.png",
    type: "tree",
    resources: { wood: { max: 5, count: 5 } }
  },
  {
    x: 50,
    y: 55,
    textureName: "textures/tree_1.png",
    type: "tree",
    resources: { wood: { max: 5, count: 5 } }
  },
  {
    x: 49,
    y: 45,
    textureName: "textures/tree_1.png",
    type: "tree",
    resources: { wood: { max: 5, count: 5 } }
  },
  {
    x: 40,
    y: 40,
    textureName: "textures/tree_1.png",
    type: "tree",
    resources: { wood: { max: 5, count: 5 } }
  },
  {
    x: 25,
    y: 25,
    textureName: "textures/stone.png",
    type: "stone",
    resources: {}
  },
  {
    x: 38,
    y: 58,
    textureName: "textures/stone.png",
    type: "stone",
    resources: {}
  },
  {
    x: 55,
    y: 40,
    textureName: "textures/stone.png",
    type: "stone",
    resources: {}
  },
  {
    x: 56,
    y: 45,
    textureName: "textures/stone.png",
    type: "stone",
    resources: {}
  },
  {
    x: 40,
    y: 40,
    textureName: "textures/stone.png",
    type: "stone",
    resources: {}
  },
  {
    x: 48,
    y: 45,
    textureName: "textures/stone.png",
    type: "stone",
    resources: {}
  },
  {
    x: 52,
    y: 52,
    textureName: "textures/iron.png",
    type: "iron",
    resources: {}
  },
  {
    x: 55,
    y: 50,
    textureName: "textures/iron.png",
    type: "iron",
    resources: {}
  },
  {
    x: 68,
    y: 45,
    textureName: "textures/iron.png",
    type: "iron",
    resources: {}
  },
  {
    x: 68,
    y: 52,
    textureName: "textures/iron.png",
    type: "iron",
    resources: {}
  },
  {
    x: 45,
    y: 49,
    textureName: "textures/iron.png",
    type: "iron",
    resources: {}
  }
];
