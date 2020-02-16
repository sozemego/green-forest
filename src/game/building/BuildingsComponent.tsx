import React, { useEffect, useMemo, useRef } from "react";
import { TextureLoader } from "three";
import { useFrame } from "react-three-fiber";
import { useService } from "@xstate/react/lib";
import {
  BUILDINGS_ACTION,
  buildingsService,
  initialBuildings
} from "./BuildingsMachine";
import { Building } from "./Building";

export function BuildingsComponent() {
  let [state, send] = useService(buildingsService);
  let buildings = state.context.buildings;

  useEffect(() => {
    initialBuildings.forEach(building => {
      send({ type: BUILDINGS_ACTION.BUILDING_CREATED, building });
    });
  }, [send]);

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
