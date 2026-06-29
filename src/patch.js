export function buildPatchRows(fixtures, sortBy = "ch", sortDesc = false) {
  const mapped = fixtures.map(f => ({
    id: f.id,
    category: f.category || "lighting",
    ch: f.ch || 0,
    type: f.type,
    dmx: f.dmx || "",
    dimmer: f.dimmer || "",
    mode: f.mode !== undefined ? f.mode : 1,
    color: f.color || "",
    purpose: f.purpose || "",
    circuit: f.circuit || "",
    watt: f.watt || 0
  }));

  mapped.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    // ch特別ルール（0は末尾）
    if (sortBy === "ch") {
      const chKey = ch => ch > 0 ? ch : Number.MAX_SAFE_INTEGER;
      valA = chKey(a.ch);
      valB = chKey(b.ch);
    }

    if (typeof valA === "string" && typeof valB === "string") {
      const cmp = valA.localeCompare(valB, "ja");
      return sortDesc ? -cmp : cmp;
    }

    if (valA < valB) return sortDesc ? 1 : -1;
    if (valA > valB) return sortDesc ? -1 : 1;
    return 0;
  });

  return mapped;
}

export function powerSummary(fixtures) {
  const round1 = n => Math.round(n * 10) / 10;
  
  let soundWatt = 0;
  let lightingWatt = 0;
  let videoWatt = 0;
  let totalWatt = 0;

  for (const f of fixtures) {
    const w = Number(f.watt) || 0;
    totalWatt += w;
    const cat = f.category || "lighting";
    if (cat === "sound") {
      soundWatt += w;
    } else if (cat === "lighting") {
      lightingWatt += w;
    } else if (cat === "video") {
      videoWatt += w;
    }
  }

  return {
    totalWatt,
    totalAmps: round1(totalWatt / 100),
    soundWatt,
    soundAmps: round1(soundWatt / 100),
    lightingWatt,
    lightingAmps: round1(lightingWatt / 100),
    videoWatt,
    videoAmps: round1(videoWatt / 100)
  };
}
