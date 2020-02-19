import { GAME_ACTION, GameActor } from "./GameMachine";

export class GameService {
  private readonly actor: GameActor;

  constructor(actor: GameActor) {
    this.actor = actor;
  }

  get population() {
    return this._context.population;
  }

  get selectedObject() {
    return this._context.selectedObject;
  }

  set selectedObject(object: any | null) {
    this.actor.send({ type: GAME_ACTION.SELECT_OBJECT, object });
  }

  get buildings() {
    return this._context.buildings;
  }

  get resources() {
    return this._context.resources;
  }

  get _context() {
    return this.actor.state.context;
  }
}
