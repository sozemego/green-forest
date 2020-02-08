import React from "react";
import { Canvas } from "react-three-fiber";
import { World } from "./World";
import { Camera } from "./Camera";

export function Game() {
  return (
    <Canvas
      style={{ backgroundColor: "black" }}
      camera={{ position: [50, 50, 25] }}
    >
      <ambientLight />
      <Camera />
      <World />
      {/*<Effects />*/}
    </Canvas>
  );
}
