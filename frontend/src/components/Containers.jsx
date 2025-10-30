import React, { useEffect, useState } from "react";

export default function Containers() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    code: "",
    length_mm: 1200,
    width_mm: 800,
    height_mm: 1200,
    max_weight_kg: 1000
  });

  const load = async () => {
    const res = await fetch("/api/containers");
    const data = await res.json();
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await fetch("/api/containers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    await load();
  };

  return (
    <div>
      <h3>Containers</h3>
      <form onSubmit={submit} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <input
          type="number"
          placeholder="length"
          value={form.length_mm}
          onChange={(e) => setForm({ ...form, length_mm: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="width"
          value={form.width_mm}
          onChange={(e) => setForm({ ...form, width_mm: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="height"
          value={form.height_mm}
          onChange={(e) => setForm({ ...form, height_mm: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="max weight"
          value={form.max_weight_kg}
          onChange={(e) => setForm({ ...form, max_weight_kg: Number(e.target.value) })}
        />
        <button type="submit">Add</button>
      </form>

      <table border="1" cellPadding="4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>L×W×H (mm)</th>
            <th>Max weight</th>
          </tr>
        </thead>
        <tbody>
          {list.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.code}</td>
              <td>
                {c.length_mm} × {c.width_mm} × {c.height_mm}
              </td>
              <td>{c.max_weight_kg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
