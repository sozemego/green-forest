import React, { useMemo, useRef } from "react";
import { Color, Object3D, TextureLoader, VertexColors } from "three";
import { useFrame } from "react-three-fiber";

export function Tiles() {
  let sizeX = 100;
  let sizeY = 100;

  let textures = useMemo(() => {
    let loader = new TextureLoader();
    return [
      "textures/dirt.png",
      "textures/cactus_top.png",
      "textures/leaves.png"
    ].map(t => loader.load(t));
  }, []);

  let tileMap = useMemo(() => {
    let tiles = {};
    let types = ["d", "c", "l"];
    types.forEach(t => (tiles[t] = []));
    let id = 0;
    for (let x = 0; x < sizeX; x++) {
      for (let y = 0; y < sizeY; y++) {
        let type = types[Math.floor(Math.random() * types.length)];
        let texture = textures[type === "d" ? 0 : type === "c" ? 1 : 2];
        let key = `${x}:${y}`;
        let tile = {
          id: id++,
          key,
          x,
          y,
          texture
        };
        tiles[type].push(tile);
      }
    }
    return tiles;
  }, []);

  return (
    <>
      {Object.keys(tileMap).map(type => {
        let tiles = tileMap[type];
        return <TileLayer tiles={tiles} key={type} />;
      })}
    </>
  );
}

function TileLayer({ tiles }) {
  let mesh = useRef();
  let attribute = useRef();
  let texture = tiles[0].texture;

  let _color = useMemo(() => new Color(), []);
  let colors = useMemo(() => {
    let c = [];
    for (let i = 0; i < 100 * 100; i++) {
      c.push("white");
    }
    return c;
  }, []);

  let colorArray = useMemo(() => {
    let arr = new Float32Array(tiles.length * 3);
    for (let i = 0; i < 100 * 100; i++) {
      _color.set(colors[i]);
      _color.toArray(arr, i * 3);
    }
    return arr;
  }, []);

  let _object = useMemo(() => new Object3D(), []);

  useFrame(state => {
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      let { x, y } = tile;
      _object.position.set(x, y, 0);
      _object.updateMatrix();
      mesh.current.setMatrixAt(i, _object.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, tiles.length]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 0.01]}>
        <instancedBufferAttribute
          ref={attribute}
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </boxBufferGeometry>
      <meshStandardMaterial
        attach="material"
        vertexColors={VertexColors}
        map={texture}
      />
    </instancedMesh>
  );
}
