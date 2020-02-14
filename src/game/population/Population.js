import React, { useMemo, useRef } from "react";
import { useService } from "@xstate/react/lib";
import { populationService } from "./PopulationMachine";
import { TextureLoader, Vector2 } from "three";
import { useFrame } from "react-three-fiber";
import {
  POP_ACTION,
  POP_STATE,
  POP_WORKING_ACTION,
  POP_WORKING_STATE
} from "./PopMachine";
import { getCurrentState } from "../stateUtil";
import { getResources } from "../resource/selectors";
import { resourceService } from "../resource/ResourcesMachine";
import { DELTA } from "../Constants";

export function Population() {
  let [state] = useService(populationService);
  let pops = state.context.pops;
  return (
    <>
      {pops.map(pop => (
        <Pop pop={pop} key={pop.id} />
      ))}
    </>
  );
}

function updateWorker(pop) {
  let { ref } = pop;
  let state = getCurrentState(ref.state.value);

  if (state === POP_STATE.IDLE) {
    return ref.send(POP_ACTION.START_WORKING);
  }

  if (state === `WORKING.${POP_WORKING_STATE.IDLE}`) {
    return ref.send(POP_WORKING_ACTION.START_SEARCHING);
  }

  if (state === `WORKING.${POP_WORKING_STATE.SEARCHING}`) {
    let resources = getResources(resourceService);
    if (resources.length === 0) {
      return ref.send(POP_ACTION.REST);
    }
    let target = resources[0];
    return ref.send({ type: POP_WORKING_ACTION.GO_TO_TARGET, data: target });
  }

  if (state === `${POP_STATE.WORKING}.${POP_WORKING_STATE.GOING_TO_TARGET}`) {
    let { x, y, target } = ref.state.context;
    let angle = new Vector2(target.x, target.y).sub(new Vector2(x, y)).angle();
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let distance = new Vector2(target.x, target.y).distanceTo(
      new Vector2(x, y)
    );
    if (distance > 0.5) {
      ref.send({
        type: POP_ACTION.MOVE,
        data: { x: cos * DELTA * 5, y: sin * DELTA * 5 }
      });
    }
  }
}

function updateHauler(pop) {}

export function Pop({ pop }) {
  let { ref } = pop;
  let [state] = useService(ref);
  let { x, y, textureName, type } = state.context;

  let mesh = useRef();

  let texture = useMemo(() => new TextureLoader().load(textureName), [
    textureName
  ]);

  useFrame(state => {
    if (type === "hauler") {
      updateHauler(pop);
    }
    if (type === "worker") {
      updateWorker(pop);
    }
  });

  return (
    <mesh
      position={[x, y, 0.01]}
      ref={mesh}
      rotation={[0, 0, 0]}
      renderOrder={5}
    >
      <planeBufferGeometry args={[1, 1, 1]} attach={"geometry"} />
      <meshBasicMaterial
        attach={"material"}
        map={texture}
        opacity={1}
        transparent={true}
        alphaTest={0.5}
      />
    </mesh>
  );
}
