import React, { useEffect } from "react";
import { Canvas } from "react-three-fiber";
import { Tiles } from "./Tiles";
import { Camera } from "./Camera";
import { Buildings } from "./building/Buildings";
import { initialResources, startResources } from "./resource/ResourcesMachine";
import { Resources } from "./resource/Resources";

export function Game() {
  useEffect(() => {
    startResources(initialResources);
  }, []);
  return (
    <Canvas
      style={{ backgroundColor: "black" }}
      camera={{ position: [50, 50, 50], fov: 25, near: 0.1, far: 10000 }}
    >
      <ambientLight />
      <Camera />
      <Tiles />
      <Resources />
      <Buildings />
      {/*<Effects />*/}
    </Canvas>
  );
}
