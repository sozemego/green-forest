import { assign, interpret, Machine, sendParent, spawn } from "xstate";
import { Resource } from "./Resource";

export let RESOURCES_STATE = {
  IDLE: "IDLE"
};

export let RESOURCES_ACTION = {
  ADD_RESOURCE: "ADD_RESOURCE",
  REMOVE_RESOURCE: "REMOVE_RESOURCE"
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
          },
          [RESOURCES_ACTION.REMOVE_RESOURCE]: {
            actions: "removeResource"
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
          resources: [
            ...resources,
            new Resource(
              nextId,
              spawn(
                resourceMachine.withContext({ id: nextId, ...event.data }),
                nextId
              )
            )
          ]
        };
      }),
      removeResource: assign((context, event) => {
        let id = event.data;
        let resources = [...context.resources];
        let index = resources.findIndex(resource => resource.id === id);
        if (index > -1) {
          resources.splice(index, 1);
        }
        return {
          resources
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

export let RESOURCE_STATE = {
  IDLE: "IDLE",
  DEAD: "DEAD"
};

export let RESOURCE_ACTION = {
  MODIFY_RESOURCES: "MODIFY_RESOURCES"
};

export let resourceMachine = Machine({
  id: "resource",
  initial: RESOURCE_STATE.IDLE,
  context: {
    id: null,
    x: 0,
    y: 0,
    textureName: null,
    type: null,
    resources: {}
  },
  states: {
    [RESOURCE_STATE.IDLE]: {
      on: {
        "": {
          target: RESOURCE_STATE.DEAD,
          cond: (context, event) => {
            if (!context.resources) {
              return false;
            }
            let allZero = true;
            Object.keys(context.resources).forEach(resource => {
              if (context.resources[resource] > 0) {
                allZero = false;
              }
            });
            return allZero;
          }
        },
        [RESOURCE_ACTION.MODIFY_RESOURCES]: {
          actions: assign({
            resources: (context, event) => {
              let resources = { ...context.resources };
              let { resource, change } = event.data;
              resources[resource] += change;
              return resources;
            }
          }),
          target: RESOURCE_STATE.IDLE
        }
      }
    },
    [RESOURCE_STATE.DEAD]: {
      type: "final",
      entry: sendParent((context, event) => ({
        type: RESOURCES_ACTION.REMOVE_RESOURCE,
        data: context.id
      }))
    }
  }
});

export let initialResources = [
  {
    x: 5,
    y: 15,
    textureName: "textures/tree.png",
    type: "tree",
    resources: { wood: 5 }
  },
  {
    x: 50,
    y: 45,
    textureName: "textures/tree.png",
    type: "tree",
    resources: { wood: 6 }
  },
  {
    x: 51,
    y: 42,
    textureName: "textures/tree.png",
    type: "tree",
    resources: { wood: 5 }
  },
  {
    x: 48,
    y: 55,
    textureName: "textures/tree_1.png",
    type: "tree",
    resources: { wood: 10 }
  },
  {
    x: 49,
    y: 49,
    textureName: "textures/tree.png",
    type: "tree",
    resources: { wood: 5 }
  },
  {
    x: 50,
    y: 55,
    textureName: "textures/tree_1.png",
    type: "tree",
    resources: { wood: 5 }
  },
  {
    x: 49,
    y: 45,
    textureName: "textures/tree_1.png",
    type: "tree",
    resources: { wood: 5 }
  },
  {
    x: 40,
    y: 40,
    textureName: "textures/tree_1.png",
    type: "tree",
    resources: { wood: 5 }
  },
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
