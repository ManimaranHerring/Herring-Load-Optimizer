import React, { useEffect, useState } from "react";

export default function Optimize() {
  const [shipments, setShipments] = useState([]);
  const [containers, setContainers] = useState([]);
  const [shipmentId, setShipmentId] = useState("");
  const [allowed, setAllowed] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const s = await (await fetch("/api/shipments")).json();
      setShipments(s);
      const c = await (await fetch("/api/containers")).json();
      setContainers(c);
    })();
  }, []);

  const toggleAllowed = (code) => {
    if (allowed.includes(code)) {
      setAllowed(allowed.filter((a) => a !== code));
    } else {
      setAllowed([...allowed, code]);
    }
  };

  const run = async () => {
    if (!shipmentId) return;
    const res = await fetch("/api/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipment_id: Number(shipmentId),
        allowed_container_types: allowed
      })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h3>Run Optimization</h3>

      <div>
        <label>Shipment: </label>
        <select value={shipmentId} onChange={(e) => setShipmentId(e.target.value)}>
          <option value="">-- choose --</option>
          {shipments.map((s) => (
            <option key={s.id} value={s.id}>
              #{s.id} {s.customer_name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <p>Allowed containers:</p>
        {containers.map((c) => (
          <label key={c.id} style={{ marginRight: "1rem" }}>
            <input
              type="checkbox"
              checked={allowed.includes(c.code)}
              onChange={() => toggleAllowed(c.code)}
            />{" "}
            {c.code}
          </label>
        ))}
      </div>

      <button style={{ marginTop: "1rem" }} onClick={run}>
        Optimize
      </button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Result</h4>
          <p>
            Plan ID: {result.plan_id} | Container: {result.container} | Utilization:{" "}
            {result.utilization}%
          </p>

          <div
            style={{
              border: "1px solid #ddd",
              padding: "0.5rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap"
            }}
          >
            {result.items?.map((it, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #333",
                  padding: "0.25rem",
                  fontSize: "0.75rem",
                  minWidth: "120px"
                }}
              >
                Item #{it.shipment_item_id}
                <br />
                x:{it.x} y:{it.y} z:{it.z}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
