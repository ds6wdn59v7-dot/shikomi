const DEFAULT_FIXTURE = {
  category: "lighting",
  type: "PAR", x: 0, y: 0, rotation: 0,
  ch: 0, universe: "", dmx: "", mode: 1, color: "",
  purpose: "", circuit: "", watt: 0, note: "",
  widthMm: 0, depthMm: 0, heightMm: 0,
  z: 0, pitch: 0, roll: 0, beamAngle: 0,
  imageSrc: null,
  kind: "",
  model: "",
  url: ""
};

const DEFAULT_ZONE = {
  kind: "その他",   // "ステージ" | "控室" | "搬入口" | "通路" | "その他"
  label: "",
  x: 0, y: 0,        // 中心点(mm)
  width: 2000,
  height: 2000,
  rotation: 0
};

export function createZone(partial = {}) {
  return { id: crypto.randomUUID(), ...DEFAULT_ZONE, ...partial };
}

export function createFixture(partial = {}) {
  const merged = { id: crypto.randomUUID(), ...DEFAULT_FIXTURE, ...partial };
  if (merged.category === "lighting" && (merged.universe === undefined || merged.universe === "")) {
    merged.universe = "1";
  }
  return merged;
}

export function createProject() {
  return {
    meta: { 
      name: "", 
      venue: "", 
      eventDate: "", 
      author: "",
      paperSize: "A4",
      showBorder: false,
      plotWidth: 10000,
      plotHeight: 8000,
      scale: { pxPerMm: 0 } 
    },
    background: { image: null, width: 0, height: 0, opacity: 1 },
    backgroundFront: { image: null, opacity: 1 },
    backgroundSide: { image: null, opacity: 1 },
    fixtures: [],
    connections: [],
    zones: [],
    fixtureLibrary: []
  };
}

export function serialize(project) {
  return JSON.stringify(project);
}

export function deserialize(text) {
  const raw = JSON.parse(text);
  const base = createProject();

  // 縮尺の移行 (m -> mm)
  let pxPerMm = base.meta.scale.pxPerMm;
  if (raw?.meta?.scale?.pxPerMm !== undefined) {
    pxPerMm = raw.meta.scale.pxPerMm;
  } else if (raw?.meta?.scale?.pxPerMeter !== undefined) {
    pxPerMm = raw.meta.scale.pxPerMeter / 1000;
  }

  // 機材リストの移行 (m -> mm)
  const fixtures = Array.isArray(raw?.fixtures)
    ? raw.fixtures.map(f => {
        const item = { ...DEFAULT_FIXTURE, id: f.id ?? crypto.randomUUID(), ...f };
        if (item.category === "lighting" && (item.universe === undefined || item.universe === "")) {
          item.universe = "1";
        }

        // 旧サイズ属性の移行 (m -> mm)
        if (f.widthMeter !== undefined && f.widthMm === undefined) {
          item.widthMm = Math.round(f.widthMeter * 1000);
          delete item.widthMeter;
        }
        if (f.depthMeter !== undefined && f.depthMm === undefined) {
          item.depthMm = Math.round(f.depthMeter * 1000);
          delete item.depthMeter;
        }
        if (f.heightMeter !== undefined && f.heightMm === undefined) {
          item.heightMm = Math.round(f.heightMeter * 1000);
          delete item.heightMeter;
        }

        return item;
      })
    : base.fixtures;

  const zones = Array.isArray(raw?.zones)
    ? raw.zones.map(z => ({ ...DEFAULT_ZONE, id: z.id ?? crypto.randomUUID(), ...z }))
    : base.zones;

  return {
    meta: {
      name: raw?.meta?.name ?? base.meta.name,
      venue: raw?.meta?.venue ?? base.meta.venue,
      eventDate: raw?.meta?.eventDate ?? base.meta.eventDate,
      author: raw?.meta?.author ?? base.meta.author,
      paperSize: raw?.meta?.paperSize ?? base.meta.paperSize,
      showBorder: raw?.meta?.showBorder ?? base.meta.showBorder,
      plotWidth: raw?.meta?.plotWidth ?? base.meta.plotWidth,
      plotHeight: raw?.meta?.plotHeight ?? base.meta.plotHeight,
      scale: { pxPerMm }
    },
    background: {
      image: raw?.background?.image ?? base.background.image,
      width: raw?.background?.width ?? base.background.width,
      height: raw?.background?.height ?? base.background.height,
      opacity: raw?.background?.opacity ?? base.background.opacity
    },
    backgroundFront: {
      image: raw?.backgroundFront?.image ?? base.backgroundFront.image,
      opacity: raw?.backgroundFront?.opacity ?? base.backgroundFront.opacity
    },
    backgroundSide: {
      image: raw?.backgroundSide?.image ?? base.backgroundSide.image,
      opacity: raw?.backgroundSide?.opacity ?? base.backgroundSide.opacity
    },
    fixtures,
    connections: Array.isArray(raw?.connections) ? raw.connections : base.connections,
    zones,
    fixtureLibrary: Array.isArray(raw?.fixtureLibrary) ? raw.fixtureLibrary : base.fixtureLibrary
  };
}
