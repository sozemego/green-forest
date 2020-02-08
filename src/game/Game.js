import React from "react";
import { Canvas } from "react-three-fiber";

export function Game() {
  return (
    <Canvas style={{ backgroundColor: "black" }}>
      <ambientLight />
    </Canvas>
  );
}
