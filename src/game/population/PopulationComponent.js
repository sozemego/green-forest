import React, { useMemo, useRef } from "react";
import { useService } from "@xstate/react/lib";
import { populationService } from "./PopulationMachine";
import { TextureLoader } from "three";
import { useFrame } from "react-three-fiber";
import { DELTA } from "../Constants";

export function PopulationComponent() {
  let [state] = useService(populationService);
  let pops = state.context.pops;
  return (
    <>
      {pops.map(pop => (
        <PopComponent pop={pop} key={pop.id} />
      ))}
    </>
  );
}

export function PopComponent({ pop }) {
  useService(pop.service);
  let { x, y, textureName } = pop;

  let mesh = useRef();

  let texture = useMemo(() => new TextureLoader().load(textureName), [
    textureName
  ]);

  useFrame(state => {
    pop.update(DELTA);
  });

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
