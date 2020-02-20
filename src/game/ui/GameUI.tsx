import React from "react";
import { SelectedObjectUI } from "./SelectedObjectUI";

export function GameUI() {
  return (
    <div style={{ pointerEvents: "all", width: "auto" }}>
      <SelectedObjectUI />
    </div>
  );
}
