import { assign, interpret, Machine } from "xstate";

export let RESOURCES_STATE = {
  IDLE: "IDLE"
};

export let RESOURCES_ACTION = {
  ADD_RESOURCE: "ADD_RESOURCE"
};

let resourcesMachine = Machine(
  {
    id: "resources",
    initial: RESOURCES_STATE.IDLE,
    context: {
      resources: []
    },
    states: {
      [RESOURCES_STATE.IDLE]: {
        on: {
          [RESOURCES_ACTION.ADD_RESOURCE]: {
            actions: "addResource"
          }
        }
      }
    }
  },
  {
    actions: {
      addResource: assign((context, event) => {
        let { resources } = context;
        let nextId = resources.length + 1;
        return {
          resources: [...resources, { id: nextId, ...event.data }]
        };
      })
    }
  }
);

export let resourceService = interpret(resourcesMachine).start();

export function startResources(resources) {
  if (!resources) {
    resources = [];
  }

  for (let resource of resources) {
    resourceService.send({
      type: RESOURCES_ACTION.ADD_RESOURCE,
      data: { ...resource }
    });
  }
}

export let initialResources = [
  { x: 5, y: 15, textureName: "textures/tree.png", type: "tree" },
  { x: 50, y: 45, textureName: "textures/tree.png", type: "tree" },
  { x: 51, y: 42, textureName: "textures/tree.png", type: "tree" },
  { x: 48, y: 55, textureName: "textures/tree_1.png", type: "tree" },
  { x: 49, y: 49, textureName: "textures/tree.png", type: "tree" },
  { x: 50, y: 55, textureName: "textures/tree_1.png", type: "tree" },
  { x: 49, y: 45, textureName: "textures/tree_1.png", type: "tree" },
  { x: 40, y: 40, textureName: "textures/tree_1.png", type: "tree" },
  { x: 25, y: 25, textureName: "textures/stone.png", type: "stone" },
  { x: 38, y: 58, textureName: "textures/stone.png", type: "stone" },
  { x: 55, y: 40, textureName: "textures/stone.png", type: "stone" },
  { x: 56, y: 45, textureName: "textures/stone.png", type: "stone" },
  { x: 40, y: 40, textureName: "textures/stone.png", type: "stone" },
  { x: 48, y: 45, textureName: "textures/stone.png", type: "stone" },
  { x: 52, y: 52, textureName: "textures/iron.png", type: "iron" },
  { x: 55, y: 50, textureName: "textures/iron.png", type: "iron" },
  { x: 68, y: 45, textureName: "textures/iron.png", type: "iron" },
  { x: 68, y: 52, textureName: "textures/iron.png", type: "iron" },
  { x: 45, y: 49, textureName: "textures/iron.png", type: "iron" }
];
