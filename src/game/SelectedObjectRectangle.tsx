import { useGameService } from "./useGameService";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimationLoader, AnimationMixer, Geometry, Shape } from "three";
import { HasPosition, HasWidth } from "./util";
import { useFrame } from "react-three-fiber";
import { DELTA } from "./Constants";

export function SelectedObjectRectangle() {
  let gameService = useGameService();

  let { selectedObject } = gameService;

  return selectedObject && <Rectangle selectedObject={selectedObject} />;
}

function Rectangle({ selectedObject }: RectangleProps) {
  let { x, y, width, height } = selectedObject;
  let shape = useMemo(() => {
    let shape = new Shape();
    shape.moveTo(-width / 2, -height / 2);
    shape.lineTo(-width / 2, height / 2);
    shape.lineTo(width / 2, height / 2);
    shape.lineTo(width / 2, -height / 2);
    shape.lineTo(-width / 2, -height / 2);
    return shape;
  }, [width, height]);

  let line = useRef();

  let geometry = useMemo(
    () => new Geometry().setFromPoints(shape.getPoints()),
    [shape]
  );

  let [animationClip, setAnimationClip] = useState();

  useEffect(() => {
    new AnimationLoader().load("animations/selectedRectangle.json", result =>
      setAnimationClip(result[0])
    );
  }, []);

  let [mixer, setMixer] = useState();

  useEffect(() => {
    if (!animationClip) {
      return;
    }
    let mixer = new AnimationMixer(line.current!);
    let clipAction = mixer.clipAction(animationClip);
    clipAction.play();
    setMixer(mixer);
  }, [animationClip]);

  useFrame(() => {
    if (!mixer) {
      return;
    }
    mixer.update(DELTA);
  });

  return (
    <lineLoop position={[x, y, 0.1]} ref={line}>
      <primitive object={geometry} attach={"geometry"} />
      <lineBasicMaterial attach={"material"} linewidth={1.25} color={"gold"} />
    </lineLoop>
  );
}

interface RectangleProps {
  selectedObject: HasPosition & HasWidth;
}
