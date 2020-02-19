import React, { useMemo, useRef } from "react";
import { useService } from "@xstate/react/lib";
import { TextureLoader } from "three";
import { useFrame } from "react-three-fiber";
import { DELTA } from "../Constants";
import { Pop } from "./Pop";
import { FellTreeWorkAnimation } from "./FellTreeWorkAnimation";
import { POP_JOB_STATE, POP_STATE } from "./PopMachine";
import { useGameService } from "../useGameService";

export function PopulationComponent() {
  let gameService = useGameService();
  let { population } = gameService;

  return (
    <>
      {population.map(pop => (
        <PopComponent pop={pop} key={pop.id} />
      ))}
    </>
  );
}

export function PopComponent({ pop }: PopProps) {
  useService(pop.service);
  let gameService = useGameService();
  let { x, y, textureName, job, state } = pop;

  let mesh = useRef();

  let texture = useMemo(() => new TextureLoader().load(textureName), [
    textureName
  ]);

  let progressBarTexture = useMemo(
    () => new TextureLoader().load("textures/progress_bar.png"),
    []
  );

  useFrame(state => {
    pop.update(DELTA);
  });

  let jobProgress = Math.max(0.0001, job ? job.progress : 1);

  return (
    <group position={[x, y, 0.01]}>
      <mesh
        position={[0, 0, 0]}
        ref={mesh}
        rotation={[0, 0, 0]}
        renderOrder={5}
        onClick={e => {
          e.stopPropagation();
          gameService.selectedObject = pop;
        }}
      >
        <planeBufferGeometry args={[1, 1, 1]} attach={"geometry"} />
        <meshBasicMaterial
          attach={"material"}
          map={texture}
          opacity={1}
          transparent={true}
          // alphaTest={0.75}
        />
      </mesh>
      <mesh
        position={[0, -0.25, 0]}
        renderOrder={6}
        scale={[jobProgress * 0.25, 0.1, 1]}
        visible={!!job}
      >
        <planeBufferGeometry args={[1, 1, 1]} attach={"geometry"} />
        <meshBasicMaterial
          attach={"material"}
          map={progressBarTexture}
          opacity={1}
          transparent={true}
          // alphaTest={0.75}
        />
      </mesh>
      {job && state === `${POP_STATE.JOB}.${POP_JOB_STATE.WORKING}` && (
        <FellTreeWorkAnimation />
      )}
    </group>
  );
}

export interface PopProps {
  pop: Pop;
}
