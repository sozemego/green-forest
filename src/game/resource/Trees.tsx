import React, { useMemo, useRef, useState } from "react";
import { TextureLoader } from "three";
import { useFrame } from "react-three-fiber";
import { cloneUniforms } from "three/src/renderers/shaders/UniformsUtils";
import { WindShader } from "../shaders/WindShader";
import { Resource } from "./Resource";
import { ResourceData } from "./ResourceMachine";

export function Trees({ trees }: TreesProps) {
  let groups = useMemo(() => {
    let groups = [];
    for (let i = 0; i < trees.length; i++) {
      let tree = trees[i];
      let { x, y, textureName, resources } = tree;
      let group: GroupProps = {
        id: tree.id,
        x,
        y: y + 0.25,
        trees: [],
        resources
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
      {groups.map(group => {
        return <TreeGroup group={group} key={group.id} />;
      })}
    </>
  );
}

export interface TreesProps {
  trees: Resource[];
}

function TreeGroup({ group }: TreeGroupProps) {
  let { resources } = group;

  let [opacity, setOpacity] = useState(1);
  useFrame(() => {
    let keys = Object.keys(resources);
    if (keys.length > 0) {
      let key = keys[0];
      let resource = resources[key];
      let newOpacity = resource.count / resource.max;
      if (opacity !== newOpacity) {
        setOpacity(newOpacity);
      }
    }
  });
  return (
    <group position={[group.x, group.y, 0.1]} renderOrder={1}>
      {group.trees.map((tree, index) => (
        <Tree tree={tree} key={index} opacity={opacity} />
      ))}
    </group>
  );
}

interface GroupProps {
  id: string;
  x: number;
  y: number;
  trees: TreeInGroupProp[];
  resources: Record<string, ResourceData>;
}

interface TreeInGroupProp {
  x: number;
  y: number;
  textureName: string;
}

export interface TreeGroupProps {
  group: GroupProps;
}

export interface TreeProps {
  tree: TreeInGroupProp;
  opacity: number;
}

function Tree({ tree, opacity }: TreeProps) {
  let mesh = useRef();
  let shader = WindShader;
  let uniforms = React.useMemo(() => cloneUniforms(shader.uniforms), []);
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
    uniforms["opacity"] = {
      type: "f",
      value: opacity
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
        transparent={true}
        needsUpdate={true}
      />
    </mesh>
  );
}
