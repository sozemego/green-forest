import { useService } from "@xstate/react/lib";
import { gameService } from "./GameMachine";
import { GameService } from "./GameService";

let service: GameService | null = null;

export function useGameService() {
  useService(gameService);

  if (service === null) {
    service = new GameService(gameService);
  }

  return service;
}
