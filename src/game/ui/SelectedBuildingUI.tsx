import React from "react";
import { Building } from "../building/Building";

export function SelectedBuildingUI({ building }: SelectedBuildingUIProps) {
  return <div>BUILDING</div>;
}

export interface SelectedBuildingUIProps {
  building: Building;
}
