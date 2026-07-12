const SVGNS = "http://www.w3.org/2000/svg";

export const ZONE_KINDS = ["ステージ", "控室", "搬入口", "通路", "その他"];

const ZONE_KIND_COLORS = {
  "ステージ": { fill: "#fed7aa", stroke: "#c2410c" },
  "控室": { fill: "#e5e7eb", stroke: "#4b5563" },
  "搬入口": { fill: "#bfdbfe", stroke: "#1e40af" },
  "通路": { fill: "#f3f4f6", stroke: "#9ca3af" },
  "その他": { fill: "#f3f4f6", stroke: "#6b7280" }
};

export function getZoneKindColor(kind) {
  return ZONE_KIND_COLORS[kind] || ZONE_KIND_COLORS["その他"];
}

export function renderZone(container, zone, isSelected) {
  const color = getZoneKindColor(zone.kind);
  const g = document.createElementNS(SVGNS, "g");
  g.setAttribute("data-zone-id", zone.id);
  g.setAttribute("transform", `translate(${zone.x}, ${zone.y}) rotate(${zone.rotation || 0})`);
  g.style.cursor = "move";

  const rect = document.createElementNS(SVGNS, "rect");
  rect.setAttribute("x", String(-zone.width / 2));
  rect.setAttribute("y", String(-zone.height / 2));
  rect.setAttribute("width", String(zone.width));
  rect.setAttribute("height", String(zone.height));
  rect.setAttribute("fill", color.fill);
  rect.setAttribute("fill-opacity", "0.5");
  rect.setAttribute("stroke", isSelected ? "#ff0000" : color.stroke);
  rect.setAttribute("stroke-width", isSelected ? "3" : "1.5");
  if (zone.kind === "通路") {
    rect.setAttribute("stroke-dasharray", "12,8");
  }
  g.appendChild(rect);

  const text = document.createElementNS(SVGNS, "text");
  text.setAttribute("x", "0");
  text.setAttribute("y", "0");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("font-size", "180");
  text.setAttribute("fill", color.stroke);
  text.style.pointerEvents = "none";
  text.textContent = zone.label ? zone.label : zone.kind;
  g.appendChild(text);

  container.appendChild(g);
}
