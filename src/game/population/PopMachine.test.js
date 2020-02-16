import { POP_ACTION, popMachine } from "./PopMachine";
import { interpret } from "xstate";

const service = interpret(popMachine).onTransition(state => {
  console.log("State", state.value);
  console.log("nextEvents", state.nextEvents);
});
// .start();

describe("lol", () => {
  it("should run", () => {
    // service.send("LOL");
    // service.send({ type: POP_ACTION.ASSIGN_JOB, data: "lol" });
  });
});
