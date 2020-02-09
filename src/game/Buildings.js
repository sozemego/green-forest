import React, { useMemo, useRef } from "react";
import { MeshBasicMaterial, TextureLoader } from "three";
import { WindShader } from "./shaders/WindShader";
import { useFrame } from "react-three-fiber";

export function Buildings() {
  let centerTexture = useMemo(
    () => new TextureLoader().load("textures/castle_large.png"),
    []
  );
  let buildings = useMemo(() => {
    let x = 50;
    let y = 50;
    let center = {
      x,
      y,
      texture: centerTexture
    };
    return [center];
  }, []);

  return (
    <>
      {buildings.map((building, index) => (
        <Building building={building} key={index} />
      ))}
    </>
  );
}

export function Building({ building }) {
  let { x, y, texture } = building;
  let mesh = useRef();
  let time = useRef(0);
  useFrame((state, delta) => {
    time.current += delta;
    if (time.current >= 1) {
      time.current = 0;
    }
  });

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
