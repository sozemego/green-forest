import React, { useEffect } from "react";
import { Canvas } from "react-three-fiber";
import { Tiles } from "./Tiles";
import { Camera } from "./Camera";
import { BuildingsComponent } from "./building/BuildingsComponent";
import { Resources } from "./resource/Resources";
import { PopulationComponent } from "./population/PopulationComponent";
import { GameUIContainer } from "./ui/GameUIContainer";
import {
  GAME_ACTION,
  gameService,
  initialPops,
  addPops,
  startResources,
  initialResources,
  initialBuildings,
  startBuildings
} from "./GameMachine";
import { SelectedObjectRectangle } from "./SelectedObjectRectangle";

export function Game() {
  useEffect(() => {
    gameService.start();
    gameService.send({ type: GAME_ACTION.START });

    startBuildings(initialBuildings);
    startResources(initialResources);
    addPops(initialPops);
  }, []);
  return (
    <GameUIContainer>
      <Canvas
        style={{ backgroundColor: "black" }}
        camera={{ position: [50, 50, 50], fov: 25, near: 0.1, far: 10000 }}
      >
        <ambientLight />
        <Camera />
        <Tiles />
        <Resources />
        <BuildingsComponent />
        <PopulationComponent />
        <SelectedObjectRectangle />
      </Canvas>
    </GameUIContainer>
  );
}
