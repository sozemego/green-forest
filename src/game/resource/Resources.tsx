import React, { useMemo } from "react";
import { Trees } from "./Trees";
import { Rocks } from "./Rocks";
import { useGameService } from "../useGameService";

export function Resources() {
  let gameService = useGameService();
  let { resources } = gameService;

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
