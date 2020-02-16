import { GameActor } from "../GameMachine";

export function getResources(service: GameActor) {
  return service.state.context.resources;
}
