import React, { useEffect, useMemo, useRef, useState } from "react";
import { Color, Object3D, VertexColors } from "three";
import { useFrame } from "react-three-fiber";

export function World() {
  let sizeX = 100;
  let sizeY = 100;

  let [hovered, setHovered] = useState();
  let previousHovered = useRef();
  useEffect(() => void (previousHovered.current = hovered), [hovered]);

  let _color = useMemo(() => new Color(), []);
  let colors = useMemo(() => {
    let c = [];
    for (let i = 0; i < sizeX * sizeY; i++) {
      c.push(Color.NAMES["darkgreen"]);
    }
    return c;
  }, []);

  let colorArray = useMemo(() => {
    let arr = new Float32Array(sizeX * sizeY * 3);
    for (let i = 0; i < sizeX * sizeY; i++) {
      _color.set(colors[i]);
      _color.toArray(arr, i * 3);
    }
    return arr;
  }, []);

  let mesh = useRef();
  let attribute = useRef();
  let _object = useMemo(() => new Object3D(), []);
  useFrame(state => {
    let id = 0;
    for (let x = 0; x < sizeX; x++) {
      for (let y = 0; y < sizeY; y++) {
        let currentHovered = hovered === id;
        _object.position.set(x, y, 0);
        if (hovered !== previousHovered.current) {
          _color.set(currentHovered ? "white" : colors[id]);
          _color.toArray(colorArray, id * 3);
          attribute.current.needsUpdate = true;
        }
        _object.updateMatrix();
        mesh.current.setMatrixAt(id++, _object.matrix);
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, sizeX * sizeY]}
      onPointerMove={e => setHovered(e.instanceId)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 0.1]}>
        <instancedBufferAttribute
          ref={attribute}
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </boxBufferGeometry>
      <meshStandardMaterial attach="material" vertexColors={VertexColors} />
    </instancedMesh>
  );
}
