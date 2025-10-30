export function runSimpleOptimization({ shipment, items, containers }) {
  if (!containers.length) {
    return { error: "No containers defined" };
  }
  const container = containers[0]; // MVP: pick first

  // container space
  const Cx = container.length_mm;
  const Cy = container.width_mm;
  const Cz = container.height_mm;

  // expand items by qty
  const expanded = [];
  items.forEach((it) => {
    for (let i = 0; i < (it.qty || 1); i++) {
      expanded.push(it);
    }
  });

  // sort big to small
  expanded.sort((a, b) => {
    const va = a.length_mm * a.width_mm * a.height_mm;
    const vb = b.length_mm * b.width_mm * b.height_mm;
    return vb - va;
  });

  const placed = [];
  let cursorX = 0;
  let cursorY = 0;
  let layerZ = 0;
  let rowMaxHeight = 0;

  for (const it of expanded) {
    const w = it.width_mm;
    const l = it.length_mm;
    const h = it.height_mm;

    // new row?
    if (cursorX + l > Cx) {
      cursorX = 0;
      cursorY += rowMaxHeight;
      rowMaxHeight = 0;
    }

    // new layer?
    if (cursorY + w > Cy) {
      cursorY = 0;
      layerZ += h;
    }

    if (layerZ + h > Cz) {
      // can't place more in this simple demo
      break;
    }

    placed.push({
      shipment_item_id: it.id,
      x: cursorX,
      y: cursorY,
      z: layerZ,
      rotation: "LWH",
      level: layerZ / (h || 1)
    });

    cursorX += l;
    rowMaxHeight = Math.max(rowMaxHeight, w);
  }

  const usedVol = placed.reduce((acc, p) => {
    const it = expanded.find((i) => i.id === p.shipment_item_id);
    return acc + it.length_mm * it.width_mm * it.height_mm;
  }, 0);
  const contVol = Cx * Cy * Cz;
  const utilization = contVol ? (usedVol / contVol) * 100 : 0;

  return {
    container_used: container.code,
    utilization: Math.round(utilization * 100) / 100,
    placed
  };
}
