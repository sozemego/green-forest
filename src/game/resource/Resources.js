import React, { useMemo } from "react";
import { useService } from "@xstate/react/lib";
import { resourceService } from "./ResourcesMachine";
import { Trees } from "../Trees";

export function Resources() {
  let [state] = useService(resourceService);
  let resources = state.context.resources;

  let trees = useMemo(
    () => resources.filter(resource => resource.type === "tree"),
    [resources]
  );

  return (
    <>
      <Trees trees={trees} />
    </>
  );
}
