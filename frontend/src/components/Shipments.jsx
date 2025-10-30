import React, { useEffect, useState } from "react";

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [shipmentForm, setShipmentForm] = useState({
    customer_name: "",
    origin: "",
    destination: ""
  });
  const [itemForm, setItemForm] = useState({
    sku: "",
    length_mm: 400,
    width_mm: 300,
    height_mm: 300,
    weight_kg: 10,
    qty: 1
  });

  const loadShipments = async () => {
    const res = await fetch("/api/shipments");
    const data = await res.json();
    setShipments(data);
  };

  const loadItems = async (id) => {
    const res = await fetch(`/api/shipments/${id}/items`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const createShipment = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shipmentForm)
    });
    await loadShipments();
    setShipmentForm({ customer_name: "", origin: "", destination: "" });
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!selected) return;
    await fetch(`/api/shipments/${selected}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemForm)
    });
    await loadItems(selected);
  };

  return (
    <div>
      <h3>Shipments</h3>

      <form onSubmit={createShipment}>
        <input
          placeholder="Customer"
          value={shipmentForm.customer_name}
          onChange={(e) => setShipmentForm({ ...shipmentForm, customer_name: e.target.value })}
        />
        <input
          placeholder="Origin"
          value={shipmentForm.origin}
          onChange={(e) => setShipmentForm({ ...shipmentForm, origin: e.target.value })}
        />
        <input
          placeholder="Destination"
          value={shipmentForm.destination}
          onChange={(e) => setShipmentForm({ ...shipmentForm, destination: e.target.value })}
        />
        <button type="submit">Create Shipment</button>
      </form>

      <ul>
        {shipments.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => {
                setSelected(s.id);
                loadItems(s.id);
              }}
            >
              #{s.id} - {s.customer_name} ({s.origin} → {s.destination})
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Items for shipment #{selected}</h4>
          <form onSubmit={addItem}>
            <input
              placeholder="SKU"
              value={itemForm.sku}
              onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })}
            />
            <input
              type="number"
              placeholder="L"
              value={itemForm.length_mm}
              onChange={(e) => setItemForm({ ...itemForm, length_mm: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="W"
              value={itemForm.width_mm}
              onChange={(e) => setItemForm({ ...itemForm, width_mm: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="H"
              value={itemForm.height_mm}
              onChange={(e) => setItemForm({ ...itemForm, height_mm: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Weight"
              value={itemForm.weight_kg}
              onChange={(e) => setItemForm({ ...itemForm, weight_kg: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Qty"
              value={itemForm.qty}
              onChange={(e) => setItemForm({ ...itemForm, qty: Number(e.target.value) })}
            />
            <button type="submit">Add Item</button>
          </form>

          <table border="1" cellPadding="4" style={{ marginTop: "0.5rem" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>SKU</th>
                <th>L×W×H</th>
                <th>Weight</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  <td>{it.sku}</td>
                  <td>
                    {it.length_mm}×{it.width_mm}×{it.height_mm}
                  </td>
                  <td>{it.weight_kg}</td>
                  <td>{it.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
