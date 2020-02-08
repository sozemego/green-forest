import React, { useMemo, useRef } from "react";
import {
  Mesh,
  Object3D,
  PlaneBufferGeometry,
  ShaderMaterial,
  TextureLoader
} from "three";
import { cloneUniforms } from "three/src/renderers/shaders/UniformsUtils";
import { WindShader } from "./WindShader";
import { useFrame } from "react-three-fiber";

export function Trees() {
  let sizeX = 100;
  let sizeY = 100;

  let texture = useMemo(
    () => new TextureLoader().load("textures/tree.png"),
    []
  );

  let texture1 = useMemo(
    () => new TextureLoader().load("textures/tree_1.png"),
    []
  );

  let groups = useMemo(() => {
    let treeDensity = 0.025;
    let groups = [];
    for (let x = 0; x < sizeX; x++) {
      for (let y = 0; y < sizeY; y++) {
        if (Math.random() >= treeDensity) {
          continue;
        }
        let group = {
          x,
          y,
          trees: []
        };
        let positions = [
          [-0.25, -0.25],
          [0.25, -0.25],
          [0, 0],
          [-0.25, 0.25],
          [0.25, 0.25]
        ];
        for (let i = 0; i < 5; i++) {
          group.trees.push({
            x: positions[i][0],
            y: positions[i][1],
            texture: Math.random() < 0.5 ? texture : texture1
          });
        }
        groups.push(group);
      }
    }
    return groups;
  }, []);

  return (
    <>
      {groups.map((group, index) => {
        return <TreeGroup group={group} key={index} />;
      })}
    </>
  );
}

function TreeGroup({ group }) {
  return (
    <group position={[group.x, group.y, 0.0]}>
      {group.trees.map((tree, index) => (
        <Tree tree={tree} key={index} />
      ))}
    </group>
  );
}

function Tree({ tree }) {
  let mesh = useRef();
  let shader = WindShader;
  let uniforms = cloneUniforms(shader.uniforms);
  let time = useRef(0);
  uniforms["texture1"] = {
    type: "t",
    value: tree.texture
  };

  useFrame((state, delta) => {
    time.current += delta;
    if (time.current >= 1) {
      time.current = 0;
    }
    uniforms["time"] = {
      type: "f",
      value: time.current
    };
  });

  return (
    <mesh position={[tree.x, tree.y, 0.5]} ref={mesh} rotation={[1, 0, 0]}>
      <planeBufferGeometry args={[1, 1, 1]} attach={"geometry"} />
      <shaderMaterial
        args={{
          uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader
        }}
        attach={"material"}
        map={tree.texture}
        opacity={1}
        transparent={true}
        needsUpdate={true}
      />
    </mesh>
  );
}
