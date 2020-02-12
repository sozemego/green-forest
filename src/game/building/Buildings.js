import React, { useEffect, useMemo, useRef } from "react";
import { TextureLoader } from "three";
import { useFrame } from "react-three-fiber";
import { useService } from "@xstate/react/lib";
import {
  BUILDINGS_ACTIONS,
  buildingsService,
  buildingsState
} from "./BuildingsMachine";
import { getBuildingData } from "./selectors";

export function Buildings() {
  let [state, send] = useService(buildingsService);
  let buildings = state.context.buildings;

  useEffect(() => {
    buildingsState.buildings.forEach(building => {
      send({ type: BUILDINGS_ACTIONS.BUILDING_CREATED, data: building });
    });
  }, [send]);

  return (
    <>
      {buildings.map((building, index) => (
        <Building building={building} key={index} />
      ))}
    </>
  );
}

export function Building({ building }) {
  let [state] = useService(building.ref);
  let { x, y, textureName } = getBuildingData(state);

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
      position={[x, y, 0.5]}
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
