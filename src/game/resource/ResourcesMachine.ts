import { assign, interpret, Interpreter, Machine, spawn } from "xstate";
import { Resource } from "./Resource";
import { resourceMachine } from "./ResourceMachine";

export let RESOURCES_STATE = {
  IDLE: "IDLE"
} as const;

export let RESOURCES_ACTION = {
  ADD_RESOURCE: "ADD_RESOURCE",
  REMOVE_RESOURCE: "REMOVE_RESOURCE"
} as const;

export interface ResourcesContext {
  resources: Resource[];
}

interface ResourcesSchema {
  states: {
    [RESOURCES_STATE.IDLE]: {};
  };
}

export type AddResourceAction = {
  type: typeof RESOURCES_ACTION.ADD_RESOURCE;
  resource: ResourceData;
};
export type RemoveResourceAction = {
  type: typeof RESOURCES_ACTION.REMOVE_RESOURCE;
  id: string;
};

export type ResourcesAction = AddResourceAction | RemoveResourceAction;

let resourcesMachine = Machine<
  ResourcesContext,
  ResourcesSchema,
  ResourcesAction
>({
  id: "resources",
  initial: RESOURCES_STATE.IDLE,
  context: {
    resources: []
  },
  states: {
    [RESOURCES_STATE.IDLE]: {
      on: {
        [RESOURCES_ACTION.ADD_RESOURCE]: {
          actions: assign((context, event) => {
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
        [RESOURCES_ACTION.REMOVE_RESOURCE]: {
          actions: assign((context, event) => {
            let { id } = event;
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
    }
  }
});

export type ResourcesActor = Interpreter<
  ResourcesContext,
  ResourcesSchema,
  ResourcesAction
>;

export let resourceService: ResourcesActor = interpret(
  resourcesMachine
).start();

export function startResources(resources: ResourceData[]) {
  if (!resources) {
    resources = [];
  }

  for (let resource of resources) {
    resourceService.send({
      type: RESOURCES_ACTION.ADD_RESOURCE,
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
