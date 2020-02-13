import { assign, interpret, Machine } from "xstate";

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
          pops: [...pops, { id: nextId, ...event.data }]
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
  { x: 45.5, y: 50.5, textureName: "textures/hauler.png", type: "hauler" },
  { x: 52.5, y: 50.5, textureName: "textures/hauler.png", type: "hauler" },
  { x: 55.5, y: 50.5, textureName: "textures/hauler.png", type: "hauler" }
];
