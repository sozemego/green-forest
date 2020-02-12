import { assign, interpret, Machine } from "xstate";

export let RESOURCES_STATE = {
  IDLE: "IDLE"
};

export let RESOURCES_ACTION = {
  ADD_TREE: "ADD_TREE"
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
          [RESOURCES_ACTION.ADD_TREE]: {
            actions: "addTree"
          }
        }
      }
    }
  },
  {
    actions: {
      addTree: assign((context, event) => {
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
      type: RESOURCES_ACTION.ADD_TREE,
      data: { ...resource }
    });
  }
}

export let initialResources = [
  { x: 5, y: 15, textureName: "textures/tree.png", type: "tree" },
  { x: 50, y: 45, textureName: "textures/tree.png", type: "tree" },
  { x: 51, y: 42, textureName: "textures/tree.png", type: "tree" },
  { x: 48, y: 55, textureName: "textures/tree.png", type: "tree" },
  { x: 49, y: 49, textureName: "textures/tree.png", type: "tree" },
  { x: 50, y: 55, textureName: "textures/tree.png", type: "tree" },
  { x: 49, y: 45, textureName: "textures/tree.png", type: "tree" },
  { x: 40, y: 40, textureName: "textures/tree.png", type: "tree" }
];
