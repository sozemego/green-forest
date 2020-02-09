import React from "react";
import { Canvas } from "react-three-fiber";
import { Tiles } from "./Tiles";
import { Camera } from "./Camera";
import { Trees } from "./Trees";

export function Game() {
  return (
    <Canvas
      style={{ backgroundColor: "black" }}
      camera={{ position: [50, 50, 25] }}
    >
      <ambientLight />
      <Camera />
      <Tiles />
      <Trees />
      {/*<Effects />*/}
    </Canvas>
  );
}
