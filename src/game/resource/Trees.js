import React, { useMemo, useRef } from "react";
import { TextureLoader } from "three";
import { useFrame } from "react-three-fiber";
import { cloneUniforms } from "three/src/renderers/shaders/UniformsUtils";
import { WindShader } from "../shaders/WindShader";

export function Trees({ trees }) {
  let groups = useMemo(() => {
    let groups = [];
    for (let i = 0; i < trees.length; i++) {
      let tree = trees[i];
      let { x, y, textureName } = tree;
      let group = {
        id: tree.id,
        x,
        y: y + 0.25,
        trees: []
      };
      let positions = [
        [-0.25, 0.25],
        [0.25, 0.25],
        [0, 0],
        [-0.25, -0.25],
        [0.25, -0.25]
      ];
      for (let i = 0; i < 5; i++) {
        group.trees.push({
          x: positions[i][0],
          y: positions[i][1],
          textureName
        });
      }
      groups.push(group);
    }

    return groups;
  }, [trees]);

  return (
    <>
      {groups.map((group, index) => {
        return <TreeGroup group={group} key={group.id} />;
      })}
    </>
  );
}

function TreeGroup({ group }) {
  return (
    <group position={[group.x, group.y, 0.1]} renderOrder={1}>
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
  let texture = useMemo(() => new TextureLoader().load(tree.textureName), [
    tree.textureName
  ]);
  uniforms["texture1"] = {
    type: "t",
    value: texture
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
    <mesh position={[tree.x, tree.y, 0.0]} ref={mesh} rotation={[0, 0, 0]}>
      <planeBufferGeometry args={[1, 1, 1]} attach={"geometry"} />
      <shaderMaterial
        args={[
          {
            uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
          }
        ]}
        attach={"material"}
        opacity={1}
        transparent={true}
        needsUpdate={true}
      />
    </mesh>
  );
}
