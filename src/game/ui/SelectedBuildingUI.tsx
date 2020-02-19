import React from "react";
import { Building } from "../building/Building";
import Text from "antd/es/typography/Text";

export function SelectedBuildingUI({ building }: SelectedBuildingUIProps) {
  let { x, y, name, textureName, jobs } = building;

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
          alt={`${name} texture`}
          style={{ width: "64px", height: "64px" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Text type={"secondary"} style={{ margin: "auto" }}>
          {name}
        </Text>
      </div>
      <hr />
      <div>
        Position: {x}, {y}
      </div>
      <hr />
      {jobs.map((job, index) => {
        let { type, range, resource, worker } = job;
        return (
          <div key={index} style={{ display: "flex", flexDirection: "column" }}>
            <div>Type: {type}</div>
            <div>Range: {range}</div>
            <div>Resource: {resource}</div>
            {worker && (
              <div>
                <img
                  src={worker?.textureName}
                  style={{ width: "48px", height: "48px" }}
                />
              </div>
            )}
            <hr />
          </div>
        );
      })}
    </div>
  );
}

export interface SelectedBuildingUIProps {
  building: Building;
}
