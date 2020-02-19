import React, { useMemo, useRef } from "react";
import { TextureLoader } from "three";
import { useFrame } from "react-three-fiber";
import { useService } from "@xstate/react/lib";
import { Building } from "./Building";
import { useGameService } from "../useGameService";

export function BuildingsComponent() {
  let gameService = useGameService();
  let { buildings } = gameService;

  return (
    <>
      {buildings.map((building, index) => (
        <BuildingComponent building={building} key={index} />
      ))}
    </>
  );
}

export function BuildingComponent({ building }: BuildingComponentProps) {
  useService(building.service);
  let gameService = useGameService();
  let { x, y, textureName } = building;

  let mesh = useRef();
  let time = useRef(0);
  useFrame((state, delta) => {
    time.current += delta;
    if (time.current >= 1) {
      time.current = 0;
    }
  });

  let texture = useMemo(() => new TextureLoader().load(textureName), [
    textureName
  ]);

  return (
    <mesh
      position={[x, y, 0.01]}
      ref={mesh}
      rotation={[0, 0, 0]}
      renderOrder={5}
      onClick={e => {
        e.stopPropagation();
        gameService.selectedObject = building;
      }}
    >
      <planeBufferGeometry args={[1, 1, 1]} attach={"geometry"} />
      <meshBasicMaterial
        attach={"material"}
        map={texture}
        opacity={1}
        transparent={true}
        alphaTest={0.5}
      />
    </mesh>
  );
}

export interface BuildingComponentProps {
  building: Building;
}
