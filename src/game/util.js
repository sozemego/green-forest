import { Vector2 } from "three";

export function calculateDistance(from, to) {
  return new Vector2(from.x, from.y).distanceTo(new Vector2(to.x, to.y));
}
