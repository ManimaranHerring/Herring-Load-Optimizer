import React, { useState } from "react";
import Containers from "./components/Containers.jsx";
import Shipments from "./components/Shipments.jsx";
import Optimize from "./components/Optimize.jsx";

export default function App() {
  const [tab, setTab] = useState("containers");

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h2>Container Optimization Demo</h2>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setTab("containers")} disabled={tab === "containers"}>
          Containers
        </button>{" "}
        <button onClick={() => setTab("shipments")} disabled={tab === "shipments"}>
          Shipments
        </button>{" "}
        <button onClick={() => setTab("opt")} disabled={tab === "opt"}>
          Optimize
        </button>
      </div>
      {tab === "containers" && <Containers />}
      {tab === "shipments" && <Shipments />}
      {tab === "opt" && <Optimize />}
    </div>
  );
}
