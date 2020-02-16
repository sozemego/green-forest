import { assign, interpret, Interpreter, Machine, spawn } from "xstate";
import { popMachine } from "./PopMachine";
import { Pop } from "./Pop";

export let POPULATION_STATE = {
  IDLE: "IDLE"
} as const;

export let POPULATION_ACTION = {
  ADD_POP: "ADD_POP"
};

interface PopulationSchema {
  states: {
    [POPULATION_STATE.IDLE]: {};
  };
}

interface PopulationContext {
  pops: Pop[];
}

type PopulationAddPopAction = {
  type: typeof POPULATION_ACTION.ADD_POP;
  pop: PopData;
};

type PopulationAction = PopulationAddPopAction;

let machine = Machine<PopulationContext, PopulationSchema, PopulationAction>(
  {
    id: "population",
    initial: POPULATION_STATE.IDLE,
    context: {
      pops: []
    },
    states: {
      [POPULATION_STATE.IDLE]: {
        on: {
          [POPULATION_ACTION.ADD_POP]: {
            actions: "addPop"
          }
        }
      }
    }
  },
  {
    actions: {
      addPop: assign((context, event) => {
        let pops = [...context.pops];
        let nextId = `${pops.length + 1}`;
        let data = {
          id: nextId,
          target: null,
          ...event.pop
        };
        return {
          pops: [
            ...pops,
            new Pop(
              nextId,
              spawn(popMachine.withContext(data), `pop-${nextId}`)
            )
          ]
        };
      })
    }
  }
);

export type PopulationActor = Interpreter<
  PopulationContext,
  PopulationSchema,
  PopulationAction
>;

export let populationService: PopulationActor = interpret(machine).start();

export function addPops(pops: PopData[]) {
  pops.forEach(addPop);
}

export function addPop(pop: PopData) {
  populationService.send({ type: POPULATION_ACTION.ADD_POP, pop });
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
