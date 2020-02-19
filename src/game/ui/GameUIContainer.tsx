import React, { ReactChild, ReactChildren } from "react";
import { GameUI } from "./GameUI";

export function GameUIContainer({ children }: GameUIProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        pointerEvents: "none"
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "all"
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%"
        }}
      >
        <GameUI />
      </div>
    </div>
  );
}

export interface GameUIProps {
  children: ReactChild | ReactChild[] | ReactChildren | null;
}
