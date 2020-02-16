import { assign, Interpreter, Machine, sendParent } from "xstate";
import { GAME_ACTION } from "../GameMachine";

export let RESOURCE_STATE = {
  IDLE: "IDLE",
  DEAD: "DEAD"
} as const;

export let RESOURCE_ACTION = {
  MODIFY_RESOURCES: "MODIFY_RESOURCES"
} as const;

export interface ResourceContext {
  id: string;
  x: number;
  y: number;
  textureName: string;
  type: string;
  resources: Record<string, number>;
}

export type ResourceActor = Interpreter<
  ResourceContext,
  ResourceSchema,
  ResourceAction
>;

export interface ResourceSchema {
  states: {
    [RESOURCE_STATE.IDLE]: {};
    [RESOURCE_STATE.DEAD]: {};
  };
}

export type ModifyResourcesAction = {
  type: typeof RESOURCE_ACTION.MODIFY_RESOURCES;
  resource: string;
  change: number;
};

export type ResourceAction = ModifyResourcesAction;

export let resourceMachine = Machine<
  ResourceContext,
  ResourceSchema,
  ResourceAction
>({
  id: "resource",
  initial: RESOURCE_STATE.IDLE,
  context: {
    id: "initial",
    x: 0,
    y: 0,
    textureName: "textureName",
    type: "type",
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
              let { resource, change } = event;
              resources[resource] += change;
              return resources;
            }
          }),
          target: RESOURCE_STATE.IDLE
        }
      }
    },
    [RESOURCE_STATE.DEAD]: {
      type: "final" as "final",
      entry: sendParent((context: ResourceContext, event: any) => ({
        type: GAME_ACTION.REMOVE_RESOURCE,
        data: context.id
      }))
    }
  }
});
