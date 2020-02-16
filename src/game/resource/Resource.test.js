import { resourceService, startResources } from "./ResourcesMachine";

startResources([
  {
    x: 5,
    y: 15,
    textureName: "textures/tree.png",
    type: "tree",
    resources: { wood: 5 }
  }
]);

describe("lol", () => {
  it("what", () => {
    let resource = resourceService.state.context.resources[0];
    resource.modifyResources("wood", -5);
    console.log(resource.service.state.value);
    console.log(resourceService.state.context.resources.length);
  });
});
