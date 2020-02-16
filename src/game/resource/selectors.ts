import { ResourcesActor } from "./ResourcesMachine";

export function getResources(service: ResourcesActor) {
  return service.state.context.resources;
}
