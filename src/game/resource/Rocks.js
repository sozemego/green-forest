import React, { useMemo, useRef } from "react";
import { TextureLoader } from "three";

export function Rocks({ rocks }) {
  return (
    <>
      {rocks.map(rock => (
        <Rock rock={rock} key={rock.id} />
      ))}
    </>
  );
}

export function Rock({ rock }) {
  let { x, y, textureName } = rock;
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
