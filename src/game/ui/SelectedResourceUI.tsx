import React from "react";
import { Resource } from "../resource/Resource";
import { useService } from "@xstate/react/lib";

export function SelectedResourceUI({ resource }: SelectedResourceUIProps) {
  let { resources, textureName, service } = resource;
  useService(service);

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
      {Object.keys(resources).map(resource => {
        let data = resources[resource];
        let { max, count } = data;

        return (
          <div key={resource}>
            <span>{resource}</span>
            <span style={{ marginLeft: "4px" }}>
              {count}/{max}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export interface SelectedResourceUIProps {
  resource: Resource;
}
