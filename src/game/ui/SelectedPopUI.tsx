import React from "react";
import { Pop } from "../population/Pop";
import { useService } from "@xstate/react/lib";
import { PopJob } from "../population/PopMachine";
import { Job } from "../building/BuildingMachine";

export function SelectedPopUI({ pop }: SelectedPopUIProps) {
  let { x, y, textureName, job, target, state, service } = pop;
  useService(service);

  let targetX = target?.x;
  let targetY = target?.y;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "rgb(25,17,24)"
        }}
      >
        <img
          src={textureName}
          alt={`Pop texture`}
          style={{ width: "64px", height: "64px" }}
        />
      </div>
      <div>{state}</div>
      <hr />
      <div>
        Position: {x.toFixed(2)}, {y.toFixed(2)}
      </div>
      <hr />
      {target && (
        <div>
          Target position: {targetX}, {targetY}
        </div>
      )}
      <div>
        {job ? (
          <PopJobComponent job={job} jobData={pop.jobData} />
        ) : (
          <div>No job</div>
        )}
      </div>
    </div>
  );
}

export interface SelectedPopUIProps {
  pop: Pop;
}

function PopJobComponent({ job, jobData }: PopJobComponentProps) {
  let { progress } = job;
  let { resource, type } = jobData;

  return (
    <div>
      <div>Progress: {progress.toFixed(2)}</div>
      <div>
        {type} | {resource}
      </div>
    </div>
  );
}

interface PopJobComponentProps {
  job: PopJob;
  jobData: Job;
}
