import React, { useEffect, useMemo } from "react";
import { useFrame } from "react-three-fiber";

export function Camera() {
  let keys = useMemo(() => new Set(), []);
  useEffect(() => {
    window.addEventListener("keydown", event => keys.add(event.key));
    window.addEventListener("keyup", event => keys.delete(event.key));
  }, []);

  useFrame(({ camera }) => {
    if (keys.has("e")) {
      camera.position.z -= 1;
    }
    if (keys.has("q")) {
      camera.position.z += 1;
    }
    if (keys.has("a")) {
      camera.position.x -= 1;
    }
    if (keys.has("d")) {
      camera.position.x += 1;
    }
    if (keys.has("w")) {
      camera.position.y += 1;
    }
    if (keys.has("s")) {
      camera.position.y -= 1;
    }
    if (keys.has("z")) {
      camera.rotateX(1 / 60);
    }
    if (keys.has("x")) {
      camera.rotateX(-1 / 60);
    }
    if (keys.has("c")) {
      camera.rotateY(1 / 60);
    }
    if (keys.has("v")) {
      camera.rotateY(-1 / 60);
    }
    if (keys.has("b")) {
      camera.rotateZ(1 / 60);
    }
    if (keys.has("n")) {
      camera.rotateZ(-1 / 60);
    }
    if (camera.position.z < 1) {
      camera.position.z = 1;
    }
  });

  return <></>;
}
