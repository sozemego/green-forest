import React, { useMemo, useRef } from "react";
import { TextureLoader } from "three";
import { cloneUniforms } from "three/src/renderers/shaders/UniformsUtils";
import { WindShader } from "./shaders/WindShader";
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
      for (let y = sizeY - 1; y >= 0; y--) {
        if (Math.random() >= treeDensity) {
          continue;
        }
        let group = {
          x,
          y: y + 0.25,
          trees: [],
          texture: Math.random() < 0.5 ? texture : texture1
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
            y: positions[i][1]
          });
        }
        groups.push(group);
      }
    }
    return groups;
  }, [sizeX, sizeY, texture, texture1]);

  return (
    <>
      {groups.map((group, index) => {
        return <TreeGroup group={group} key={index} />;
      })}
    </>
  );
}

function TreeGroup({ group }) {
  // let mesh = useRef();
  // let uniforms = cloneUniforms(WindShader.uniforms);
  // let time = useRef(0);
  // uniforms["texture1"] = {
  //   type: "t",
  //   value: group.texture
  // };
  //
  // useFrame((state, delta) => {
  //   time.current += delta;
  //   if (time.current >= 1) {
  //     time.current = 0;
  //   }
  //   uniforms["time"] = {
  //     type: "f",
  //     value: time.current
  //   };
  // });
  //
  // let attribute = useRef();
  // let colorArray = useMemo(() => {
  //   let color = new Color("white");
  //   let array = new Float32Array(group.trees.length * 3);
  //   for (let i = 0; i < group.trees.length; i++) {
  //     color.toArray(array, i * 3);
  //   }
  //   return array;
  // }, []);
  //
  // let _object = useMemo(() => new Object3D(), []);
  // useFrame(state => {
  //   let { trees, x, y } = group;
  //   for (let i = 0; i < trees.length; i++) {
  //     let tree = trees[i];
  //     _object.position.set(x, y, 15);
  //     _object.updateMatrix();
  //     mesh.current.setMatrixAt(i, _object.matrix);
  //   }
  //   mesh.current.instanceMatrix.needsUpdate = true;
  // });

  // return (
  //   <instancedMesh args={[null, null, 5]} ref={mesh}>
  //     <planeBufferGeometry args={[1, 1, 1]} attach={"geometry"}>
  //       <instancedBufferAttribute
  //         ref={attribute}
  //         attachObject={["attributes", "color"]}
  //         args={[colorArray, 3]}
  //       />
  //     </planeBufferGeometry>
  //     {/*<shaderMaterial*/}
  //     {/*  args={{*/}
  //     {/*    uniforms,*/}
  //     {/*    vertexShader: WindShader.vertexShader,*/}
  //     {/*    fragmentShader: WindShader.fragmentShader*/}
  //     {/*  }}*/}
  //     {/*  attach={"material"}*/}
  //     {/*  opacity={1}*/}
  //     {/*  transparent={true}*/}
  //     {/*  needsUpdate={true}*/}
  //     {/*/>*/}
  //     <meshStandardMaterial
  //       attach="material"
  //       vertexColors={VertexColors}
  //       map={group.texture}
  //       opacity={1}
  //       transparent={true}
  //     />
  //   </instancedMesh>
  // );
  return (
    <group position={[group.x, group.y, 0.1]} renderOrder={1}>
      {group.trees.map((tree, index) => (
        <Tree tree={tree} key={index} texture={group.texture} />
      ))}
    </group>
  );
}

function Tree({ tree, texture }) {
  let mesh = useRef();
  let shader = WindShader;
  let uniforms = cloneUniforms(shader.uniforms);
  let time = useRef(0);
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
        args={{
          uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader
        }}
        attach={"material"}
        opacity={1}
        transparent={true}
        needsUpdate={true}
      />
    </mesh>
  );
}
