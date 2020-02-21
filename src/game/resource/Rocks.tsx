import React, { useMemo, useRef } from "react";
import { TextureLoader } from "three";
import { Resource } from "./Resource";
import { useGameService } from "../useGameService";

export function Rocks({ rocks }: RocksProps) {
  return (
    <>
      {rocks.map(rock => (
        <Rock rock={rock} key={rock.id} />
      ))}
    </>
  );
}

export interface RocksProps {
  rocks: Resource[];
}

export function Rock({ rock }: RockProps) {
  let gameService = useGameService();
  let { x, y, width, height, textureName } = rock;
  let texture = useMemo(() => new TextureLoader().load(textureName), [
    textureName
  ]);
  let mesh = useRef();
  return (
    <mesh
      position={[x, y, 0.01]}
      ref={mesh}
      rotation={[0, 0, 0]}
      renderOrder={5}
      onClick={() => (gameService.selectedObject = rock)}
    >
      <planeBufferGeometry args={[width, height, 1]} attach={"geometry"} />
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

export interface RockProps {
  rock: Resource;
}
