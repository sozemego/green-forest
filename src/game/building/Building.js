export class Building {
  constructor(id, service) {
    this.id = id;
    this.service = service;
  }

  get x() {
    return this._context.x;
  }

  get y() {
    return this._context.y;
  }

  get textureName() {
    return this._context.textureName;
  }

  get _context() {
    return this.service.state.context;
  }
}
