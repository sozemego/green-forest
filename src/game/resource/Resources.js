import React, { useMemo } from "react";
import { useService } from "@xstate/react/lib";
import { resourceService } from "./ResourcesMachine";
import { Trees } from "./Trees";
import { Rocks } from "./Rocks";

export function Resources() {
  let [state] = useService(resourceService);
  let resources = state.context.resources;

  let rocks = useMemo(
    () => resources.filter(({ type }) => type === "stone" || type === "iron"),
    [resources]
  );

  let trees = useMemo(
    () => resources.filter(resource => resource.type === "tree"),
    [resources]
  );

  return (
    <>
      <Rocks rocks={rocks} />
      <Trees trees={trees} />
    </>
  );
}
