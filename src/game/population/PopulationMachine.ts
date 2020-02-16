import { assign, interpret, Machine, spawn } from "xstate";
import { popMachine } from "./PopMachine";
import { Pop } from "./Pop";

export let POPULATION_STATE = {
  IDLE: "IDLE"
};

export let POPULATION_ACTION = {
  ADD_POP: "ADD_POP"
};

let machine = Machine(
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
        let nextId = pops.length + 1;
        return {
          pops: [
            ...pops,
            new Pop(
              nextId,
              spawn(popMachine.withContext(event.data), `pop-${nextId}`)
            )
          ]
        };
      })
    }
  }
);

export let populationService = interpret(machine).start();

export function addPops(pops) {
  pops.forEach(addPop);
}

export function addPop(pop) {
  populationService.send({ type: POPULATION_ACTION.ADD_POP, data: { ...pop } });
}

export let initialPops = [
  {
    x: 54.5,
    y: 48.0,
    textureName: "textures/hauler.png",
    job: null
  }
];
