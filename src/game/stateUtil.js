export function getCurrentState(state) {
  if (typeof state === "string") {
    return state;
  }

  if (typeof state !== "object") {
    return null;
  }

  let keys = Object.keys(state);
  return keys[0] + "." + getCurrentState(state[keys[0]]);
}
