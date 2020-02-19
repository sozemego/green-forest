import React from "react";
import { useGameService } from "../useGameService";
import { Pop } from "../population/Pop";
import { SelectedPopUI } from "./SelectedPopUI";
import { Resource } from "../resource/Resource";
import { SelectedResourceUI } from "./SelectedResourceUI";
import { Building } from "../building/Building";
import { SelectedBuildingUI } from "./SelectedBuildingUI";

export function SelectedObjectUI() {
  let gameService = useGameService();

  let { selectedObject } = gameService;

  return (
    <div>
      {selectedObject instanceof Pop ? (
        <SelectedPopUI pop={selectedObject} />
      ) : null}
      {selectedObject instanceof Resource ? (
        <SelectedResourceUI resource={selectedObject} />
      ) : null}
      {selectedObject instanceof Building ? (
        <SelectedBuildingUI building={selectedObject} />
      ) : null}
    </div>
  );
}
