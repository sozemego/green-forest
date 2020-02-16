import { Vector2 } from "three";

export function calculateDistance(from: HasPosition, to: HasPosition): number {
  return new Vector2(from.x, from.y).distanceTo(new Vector2(to.x, to.y));
}

export interface HasPosition {
  x: number;
  y: number;
}
