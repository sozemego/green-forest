import React from "react";
import { Canvas } from "react-three-fiber";
import { Tiles } from "./Tiles";
import { Camera } from "./Camera";
import { Trees } from "./Trees";
import { Buildings } from "./Buildings";

export function Game() {
  return (
    <Canvas
      style={{ backgroundColor: "black" }}
      camera={{ position: [50, 50, 50], fov: 25, near: 0.1, far: 10000 }}
    >
      <ambientLight />
      <Camera />
      <Tiles />
      <Trees />
      <Buildings />
      {/*<Effects />*/}
    </Canvas>
  );
}
