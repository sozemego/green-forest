import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimationClip,
  AnimationMixer,
  Object3D,
  Quaternion,
  QuaternionKeyframeTrack,
  TextureLoader,
  Vector3,
  VectorKeyframeTrack
} from "three";
import { useFrame } from "react-three-fiber";
import { DELTA } from "../Constants";

export function FellTreeWorkAnimation() {
  let x = 0.0;
  let y = 0.15;

  let texture = useMemo(
    () => new TextureLoader().load("textures/axe_iron.png"),
    []
  );

  let positionKeyFrame = useMemo(() => {
    return new VectorKeyframeTrack(
      ".position",
      [0, 0.5, 0.65, 0.85, 1],
      [0, 0, 0, -0.05, 0, 0, 0.05, 0, 0, 0.055, 0, 0, 0, 0, 0]
    );
  }, []);

  let rotationKeyframe = useMemo(() => {
    let axis = new Vector3(0, 0, 1);
    let qInitial = new Quaternion().setFromAxisAngle(axis, 0);
    let qFinal = new Quaternion().setFromAxisAngle(axis, Math.PI / 4);
    return new QuaternionKeyframeTrack(
      ".quaternion",
      [0, 0.5, 1],
      [
        qInitial.x,
        qInitial.y,
        qInitial.z,
        qInitial.w,
        qFinal.x,
        qFinal.y,
        qFinal.z,
        qFinal.w,
        qInitial.x,
        qInitial.y,
        qInitial.z,
        qInitial.w
      ]
    );
  }, []);

  let positionAnimationClip = useMemo(() => {
    return new AnimationClip("position", 1, [positionKeyFrame]);
  }, []);

  let rotationAnimationClip = useMemo(() => {
    return new AnimationClip("rotation", 1, [rotationKeyframe]);
  }, []);

  let mesh = useRef<Object3D>();
  let [mixer, setMixer] = useState();
  useEffect(() => {
    let mixer = new AnimationMixer(mesh.current!);
    let positionClipAction = mixer.clipAction(positionAnimationClip);
    positionClipAction.play();
    let rotationClipAction = mixer.clipAction(rotationAnimationClip);
    rotationClipAction.play();
    setMixer(mixer);
  }, []);

  useFrame(() => {
    if (!mixer) {
      return;
    }
    mixer.update(DELTA);
  });

  return (
    <group position={[x, y, 0.5]}>
      <mesh ref={mesh}>
        <planeBufferGeometry args={[0.35, 0.35, 1]} attach={"geometry"} />
        <meshBasicMaterial
          attach={"material"}
          opacity={1}
          transparent={true}
          map={texture}
          alphaTest={0.75}
        />
      </mesh>
    </group>
  );
}
