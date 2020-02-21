import { useGameService } from "./useGameService";
import React, { useMemo } from "react";
import { Geometry, Shape } from "three";
import { HasPosition, HasWidth } from "./util";

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

  let geometry = useMemo(
    () => new Geometry().setFromPoints(shape.getPoints()),
    [shape]
  );

  return (
    <lineLoop position={[x, y, 0.5]}>
      <primitive object={geometry} attach={"geometry"} />
      <lineBasicMaterial attach={"material"} linewidth={1.25} color={"gold"} />
    </lineLoop>
  );
}

interface RectangleProps {
  selectedObject: HasPosition & HasWidth;
}
