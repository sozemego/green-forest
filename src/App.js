import React from "react";
import { Game } from "./game/Game";

function App() {
  return (
    <div>
      <header style={{ textAlign: "center" }}>Green forest</header>
      <hr />
      <div style={{ height: "100vh" }}>
        <Game />
      </div>
    </div>
  );
}

export default App;
