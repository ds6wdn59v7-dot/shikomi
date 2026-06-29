export const FIXTURE_LIBRARY = [
  // 舞台 (stage) - defaultWidth, defaultDepth, defaultHeight（実寸ミリメートル）
  { type: "トラス", label: "トラス", color: "#8c8c8c", shape: "truss", category: "stage", defaultWidth: 2000, defaultDepth: 300, defaultHeight: 300, model: "", url: "" },
  { type: "ステージ", label: "ステージ", color: "#595959", shape: "rect_bordered", category: "stage", defaultWidth: 1800, defaultDepth: 900, defaultHeight: 300, model: "", url: "" },
  { type: "バトン", label: "バトン", color: "#b3b3b3", shape: "baton", category: "stage", defaultWidth: 6000, defaultDepth: 80, defaultHeight: 80, model: "", url: "" },
  { type: "幕", label: "幕", color: "#8b0000", shape: "curtain", category: "stage", model: "", url: "" },
  { type: "背景幕", label: "背景幕", color: "#4a4a4a", shape: "backdrop", category: "stage", defaultWidth: 8000, defaultDepth: 100, defaultHeight: 4000, model: "", url: "" },
  { type: "所作台", label: "所作台", color: "#6b4226", shape: "riser", category: "stage", defaultWidth: 3600, defaultDepth: 1800, defaultHeight: 400, model: "", url: "" },
  { type: "階段", label: "階段", color: "#7a7a7a", shape: "stairs", category: "stage", model: "", url: "" },
  { type: "演台", label: "演台", color: "#5c4033", shape: "podium", category: "stage", model: "", url: "" },
  { type: "テーブル", label: "テーブル", color: "#8b6914", shape: "table", category: "stage", model: "", url: "" },
  { type: "椅子", label: "椅子", color: "#a0522d", shape: "chair", category: "stage", model: "", url: "" },
  { type: "マイクスタンド", label: "マイクスタンド", color: "#555555", shape: "mic_stand", category: "stage", model: "", url: "" },
  { type: "譜面台", label: "譜面台", color: "#333333", shape: "music_stand", category: "stage", model: "", url: "" },
  { type: "花道", label: "花道", color: "#704214", shape: "hanamichi", category: "stage", defaultWidth: 9000, defaultDepth: 1800, defaultHeight: 300, model: "", url: "" },
  { type: "鳥居", label: "鳥居", color: "#cc3333", shape: "torii", category: "stage", model: "", url: "" },
  { type: "ドラムセット", label: "ドラムセット", color: "#4a4a6a", shape: "drum_set", category: "stage", defaultWidth: 1500, defaultDepth: 1200, defaultHeight: 1200, model: "", url: "" },
  { type: "人", label: "人", color: "#e08060", shape: "person", category: "stage", defaultWidth: 500, defaultDepth: 500, defaultHeight: 1700, model: "", url: "" },
  { type: "看板", label: "看板", color: "#4f46e5", shape: "image", category: "stage", defaultWidth: 1800, defaultDepth: 100, defaultHeight: 1800, model: "", url: "" },

  // 音響 (sound)
  { type: "ELX200-15", label: "ELX200-15", color: "#1f6aa5", shape: "speaker_elx200_15", category: "sound", kind: "スピーカー", defaultWidth: 423, defaultDepth: 384, defaultHeight: 710, beamAngle: 90, watt: 300, model: "ELX200-15", url: "https://products.electrovoice.com/na/en/elx200-15" },
  { type: "ELX200-12", label: "ELX200-12", color: "#2d8cd5", shape: "speaker_elx200_12", category: "sound", kind: "スピーカー", defaultWidth: 363, defaultDepth: 344, defaultHeight: 629, beamAngle: 90, watt: 250, model: "ELX200-12", url: "https://products.electrovoice.com/na/en/elx200-12" },
  { type: "Titan 8A MKII", label: "Titan 8A MKII", color: "#4fa3e3", shape: "speaker_titan_8a", category: "sound", kind: "スピーカー", defaultWidth: 266, defaultDepth: 221, defaultHeight: 396, beamAngle: 90, watt: 180, model: "Titan 8A MKII", url: "https://www.wharfedalepro.com/product/titan-8a-mkii/" },
  { type: "JBL EON612", label: "JBL EON612", color: "#2d8cd5", shape: "speaker_eon612", category: "sound", kind: "スピーカー", defaultWidth: 380, defaultDepth: 316, defaultHeight: 664, beamAngle: 100, watt: 500, model: "EON612", url: "https://jblpro.com/en-US/products/eon612" },
  { type: "メインSP", label: "メインSP", color: "#1f6aa5", shape: "speaker", category: "sound", kind: "スピーカー", model: "", url: "" },
  { type: "モニターSP", label: "モニターSP", color: "#2d8cd5", shape: "monitor", category: "sound", kind: "スピーカー", model: "", url: "" },
  { type: "マイク", label: "マイク", color: "#4fa3e3", shape: "mic", category: "sound", kind: "マイク", model: "", url: "" },
  { type: "ミキサー", label: "ミキサー", color: "#124d77", shape: "console", category: "sound", kind: "ミキサー", model: "", url: "" },
  { type: "LiveTrak L-20R", label: "LiveTrak L-20R", color: "#124d77", shape: "console_l20r", category: "sound", kind: "ミキサー", defaultWidth: 438, defaultDepth: 158, defaultHeight: 152, beamAngle: 0, watt: 24, model: "LiveTrak L-20R", url: "https://zoomcorp.com/en/us/digital-mixer-multi-track-recorders/digital-mixer-recorder/livetrak-l-20r/" },
  { type: "ELX200-18SP", label: "ELX200-18SP", color: "#1a4d8c", shape: "subwoofer_elx200_18sp", category: "sound", kind: "スピーカー", defaultWidth: 507, defaultDepth: 574, defaultHeight: 600, beamAngle: 360, watt: 180, model: "ELX200-18SP", url: "https://products.electrovoice.com/na/en/elx200-18sp" },
  { type: "サブウーファー", label: "サブウーファー", color: "#1a4d8c", shape: "subwoofer", category: "sound", kind: "スピーカー", model: "", url: "" },
  { type: "ラインアレイ", label: "ラインアレイ", color: "#1e5fad", shape: "line_array", category: "sound", kind: "スピーカー", model: "", url: "" },
  { type: "アンプ", label: "アンプ", color: "#3574b8", shape: "amp", category: "sound", kind: "アンプ", model: "", url: "" },
  { type: "DIボックス", label: "DIボックス", color: "#5a9bd5", shape: "di_box", category: "sound", kind: "周辺機器", model: "", url: "" },
  { type: "ワイヤレス受信機", label: "ワイヤレス受信機", color: "#7ab8e8", shape: "wireless_rx", category: "sound", kind: "マイク", model: "", url: "" },
  { type: "ステージボックス", label: "ステージボックス", color: "#0f3d6b", shape: "stage_box", category: "sound", kind: "周辺機器", model: "", url: "" },
  { type: "インイヤーモニター", label: "インイヤーモニター", color: "#4a90c4", shape: "in_ear", category: "sound", kind: "周辺機器", model: "", url: "" },
  { type: "ディレイSP", label: "ディレイSP", color: "#2980b9", shape: "delay_sp", category: "sound", kind: "スピーカー", model: "", url: "" },
  { type: "iP500", label: "iP500", color: "#108888", shape: "speaker_ip500", category: "sound", kind: "スピーカー", defaultWidth: 320, defaultDepth: 400, defaultHeight: 2006, beamAngle: 100, watt: 80, model: "iP500", url: "https://manuzoid.jp/manuals/oXPjP-Turbosound%20iP500%20%E3%82%AF%E3%82%A4%E3%83%83%E3%82%AF%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%88%E3%82%AC%E3%82%A4%E3%83%89" },

  // 照明 (lighting)
  { type: "PAR", label: "PAR", color: "#e6a817", shape: "circle", category: "lighting", kind: "PAR", beamAngle: 30, watt: 500, model: "", url: "" },
  { type: "スポット", label: "スポット", color: "#f3c246", shape: "circle_spot", category: "lighting", kind: "PAR", beamAngle: 15, watt: 500, model: "", url: "" },
  { type: "ムービング", label: "ムービング", color: "#7f77dd", shape: "diamond", category: "lighting", kind: "ムービング", beamAngle: 20, watt: 300, model: "", url: "" },
  { type: "ホリゾント", label: "ホリゾント", color: "#e3655b", shape: "rect_horiz", category: "lighting", kind: "バーライト", watt: 300, model: "", url: "" },
  { type: "照明卓", label: "照明卓", color: "#6366f1", shape: "console", category: "lighting", kind: "制御", watt: 50, model: "", url: "" },
  { type: "LEDバー", label: "LEDバー", color: "#d4a017", shape: "led_bar", category: "lighting", kind: "バーライト", beamAngle: 45, watt: 100, model: "", url: "" },
  { type: "スリムPAR", label: "スリムPAR", color: "#f59e0b", shape: "slim_par", category: "lighting", kind: "PAR", defaultWidth: 193, defaultDepth: 89, defaultHeight: 180, beamAngle: 25, channels: 7, watt: 36, model: "Mega 64 Profile Plus", url: "https://www.adj.com/products/mega-64-profile-plus" },
  { type: "LiteParPro", label: "LiteParPro", color: "#3b82f6", shape: "liteparpro", category: "lighting", kind: "PAR", defaultWidth: 304, defaultDepth: 177, defaultHeight: 321, beamAngle: 10, channels: 11, watt: 110, model: "LiteParPro 12QX", url: "https://e-spec.jp/manual/ekpro/ekp_lpp12qx_mnl.pdf" },
  { type: "SIXBAR 1000", label: "SIXBAR 1000", color: "#10b981", shape: "sixbar1000", category: "lighting", kind: "バーライト", defaultWidth: 900, defaultDepth: 206, defaultHeight: 155, beamAngle: 30, channels: 11, watt: 145, model: "SIXBAR 1000", url: "https://www.elationlighting.com/products/sixbar-1000" },
  { type: "LED Zoom Wash 1915", label: "LED Zoom Wash 1915", color: "#a78bfa", shape: "moving_wash_1915", category: "lighting", kind: "ムービング", defaultWidth: 300, defaultDepth: 185, defaultHeight: 345, beamAngle: 30, channels: 16, watt: 450, model: "LED Zoom Wash 1915", url: "", needsVerify: true },
  { type: "120W Mini Moving", label: "120W Mini Moving", color: "#eab308", shape: "mini_moving_120", category: "lighting", kind: "ムービング", defaultWidth: 230, defaultDepth: 160, defaultHeight: 270, beamAngle: 15, channels: 12, watt: 150, model: "120W Mini Moving", url: "", needsVerify: true },
  { type: "200W LED Strobe", label: "200W LED Strobe", color: "#ff007f", shape: "led_strobe_200", category: "lighting", kind: "バーライト", defaultWidth: 400, defaultDepth: 100, defaultHeight: 150, beamAngle: 60, channels: 16, watt: 200, model: "200W LED Strobe", url: "", needsVerify: true },
  { type: "300W COB Zoom Par", label: "300W COB Zoom Par", color: "#ff7700", shape: "cob_zoom_par_300", category: "lighting", kind: "PAR", defaultWidth: 280, defaultDepth: 300, defaultHeight: 380, beamAngle: 30, channels: 8, watt: 300, model: "300W COB Zoom Par", url: "", needsVerify: true },
  { type: "スモークマシン", label: "スモークマシン", color: "#6b7280", shape: "smoke_machine", category: "lighting", kind: "スモーク", watt: 1000, model: "", url: "" },
  { type: "噴射スモーク", label: "噴射スモーク", color: "#9ca3af", shape: "smoke_jet", category: "lighting", kind: "スモーク", watt: 1200, model: "", url: "" },

  // 映像 (video)
  { type: "LED Vision P3.91", label: "LED Vision P3.91", color: "#1d9e75", shape: "led_panel_500_1000", category: "video", kind: "スクリーン", defaultWidth: 500, defaultDepth: 80, defaultHeight: 1000, watt: 600, model: "LED Vision P3.91", url: "", needsVerify: true },
  { type: "スクリーン", label: "スクリーン", color: "#1d9e75", shape: "image", category: "video", kind: "スクリーン", defaultWidth: 2400, defaultDepth: 100, defaultHeight: 1800, model: "", url: "" },
  { type: "プロジェクター", label: "プロジェクター", color: "#27c493", shape: "projector", category: "video", kind: "スクリーン", model: "", url: "" },
  { type: "カメラ", label: "カメラ", color: "#0d4a36", shape: "camera", category: "video", kind: "カメラ", model: "", url: "" },
  { type: "スイッチャー", label: "スイッチャー", color: "#1a7a5a", shape: "switcher", category: "video", kind: "スイッチャー", model: "", url: "" },
  { type: "三脚", label: "三脚", color: "#3a3a3a", shape: "tripod", category: "video", kind: "周辺機器", model: "", url: "" }
];

const SVGNS = "http://www.w3.org/2000/svg";

export function getFullLibrary(customItems = []) {
  let overrides = {};
  try {
    const data = localStorage.getItem("shikomi-builtin-overrides");
    if (data) overrides = JSON.parse(data);
  } catch (e) {
    console.error("Failed to load builtin overrides", e);
  }

  const builtInWithOverrides = FIXTURE_LIBRARY.map(item => {
    const override = overrides[item.type];
    const merged = override ? { ...item, ...override } : { ...item };
    merged.originalType = item.type;
    return merged;
  }).filter(item => !item.deleted);

  const processedCustom = customItems.map(item => ({
    ...item,
    originalType: item.originalType || item.type
  }));

  return builtInWithOverrides.concat(processedCustom);
}

export function renderFixture(parent, fixture, isSelected, pxPerMm, library = FIXTURE_LIBRARY, iconScale = 1) {
  const def = library.find(d => d.type === fixture.type || d.originalType === fixture.type) || library.find(d => d.category === "lighting");
  const g = document.createElementNS(SVGNS, "g");
  // iconScale: viewBoxが大きい場合に固定サイズアイコンを拡大する係数
  g.setAttribute("transform", `translate(${fixture.x},${fixture.y}) rotate(${fixture.rotation}) scale(${iconScale})`);
  g.dataset.id = fixture.id;

  const strokeColor = isSelected ? "#ff0000" : "#222222";
  const strokeWidth = isSelected ? "2.5" : "1.5";

  // 縮尺の取得（未設定の場合は viewBox スケールに合わせる）
  const defaultPxPerMm = iconScale > 1 ? 1 : 0.02;
  const scale = pxPerMm > 0 ? pxPerMm : defaultPxPerMm;

  // 舞台美術カテゴリ（長尺物）か指向性機材かで3D回転投影モデルを分岐
  const isStageArt = fixture.category === "stage" || def.category === "stage" ||
    ["truss", "baton", "curtain", "backdrop", "riser", "hanamichi"].includes(def.shape || "");

  // 実寸サイズ (mm) の決定（平面描画には幅wと奥行きdを使用）
  let wMm = fixture.widthMm > 0 ? fixture.widthMm : (def.defaultWidth || 0);
  const dMm = fixture.depthMm > 0 ? fixture.depthMm : (def.defaultDepth || 0);

  if (isStageArt) {
    // 平面図上の回転は rotate(rotation) で表現されるため、
    // サイズ補正にはヨー角の影響を排除し、チルトとロールによる起立効果のみを使用する
    const pitchRad = (fixture.pitch || 0) * Math.PI / 180;
    const rollRad = (fixture.roll || 0) * Math.PI / 180;

    const Wx_prime = Math.sin(pitchRad) * Math.sin(rollRad);
    const Wy_prime = Math.cos(rollRad);
    const Ltop_prime = Math.sqrt(Wx_prime * Wx_prime + Wy_prime * Wy_prime);

    wMm = wMm * Ltop_prime + dMm * (1 - Ltop_prime);
  }

  // ピクセルサイズ換算 (iconScaleを補正して実寸描画を維持)
  const wPx = wMm * scale / iconScale;
  const hPx = dMm * scale / iconScale;

  if (def.shape === "truss") {
    // トラス：バッテンが動的リピートされる矩形
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", def.color);
    rect.setAttribute("stroke-width", "2");
    g.appendChild(rect);

    // 奥行 (hPx) を基準として格子状のXマークを繰り返す
    const divisions = Math.max(1, Math.round(wPx / hPx));
    const divWidth = wPx / divisions;
    let d = "";
    for (let i = 0; i < divisions; i++) {
      const xStart = -wPx / 2 + i * divWidth;
      const xEnd = xStart + divWidth;
      const yTop = -hPx / 2;
      const yBottom = hPx / 2;
      d += `M ${xStart} ${yTop} L ${xEnd} ${yBottom} M ${xStart} ${yBottom} L ${xEnd} ${yTop} `;
      if (i < divisions - 1) {
        d += `M ${xEnd} ${yTop} L ${xEnd} ${yBottom} `;
      }
    }

    const path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", def.color);
    path.setAttribute("stroke-width", "1");
    g.appendChild(path);

    // 選択枠（サイズ可変に対応）
    if (isSelected) {
      const selectBorder = document.createElementNS(SVGNS, "rect");
      selectBorder.setAttribute("x", String(-wPx / 2 - 2)); selectBorder.setAttribute("y", String(-hPx / 2 - 2));
      selectBorder.setAttribute("width", String(wPx + 4)); selectBorder.setAttribute("height", String(hPx + 4));
      selectBorder.setAttribute("fill", "none");
      selectBorder.setAttribute("stroke", strokeColor);
      selectBorder.setAttribute("stroke-width", "1.5");
      g.appendChild(selectBorder);
    }

  } else if (def.shape === "rect_bordered") {
    // ステージ：実寸サイズの太枠矩形
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

  } else if (def.shape === "baton") {
    // バトン：実寸細長矩形
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", isSelected ? "2" : "1");
    g.appendChild(rect);

  } else if (def.shape === "speaker") {
    // スピーカー（音響：固定サイズ）
    const path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", "M -8 -12 L 8 -12 L 5 12 L -5 12 Z");
    path.setAttribute("fill", def.color);
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", strokeWidth);
    g.appendChild(path);

  } else if (def.shape === "monitor") {
    // モニターSP（音響：固定サイズ）
    const path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", "M -12 -6 L 12 -6 L 8 8 L -8 8 Z");
    path.setAttribute("fill", def.color);
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", strokeWidth);
    g.appendChild(path);

  } else if (def.shape === "mic") {
    // マイク（音響：固定サイズ）
    const circle = document.createElementNS(SVGNS, "circle");
    circle.setAttribute("r", "6");
    circle.setAttribute("fill", def.color);
    circle.setAttribute("stroke", strokeColor);
    circle.setAttribute("stroke-width", strokeWidth);
    g.appendChild(circle);

    const line = document.createElementNS(SVGNS, "line");
    line.setAttribute("x1", "0"); line.setAttribute("y1", "6");
    line.setAttribute("x2", "0"); line.setAttribute("y2", "14");
    line.setAttribute("stroke", strokeColor);
    line.setAttribute("stroke-width", isSelected ? "2.5" : "1.5");
    g.appendChild(line);

  } else if (def.shape === "console") {
    // ミキサー卓（音響：固定サイズ）
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-15"); rect.setAttribute("y", "-12");
    rect.setAttribute("width", "30"); rect.setAttribute("height", "24");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    const path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", "M -8 -6 L -8 6 M 0 -6 L 0 6 M 8 -6 L 8 6");
    path.setAttribute("stroke", "#ffffff");
    path.setAttribute("stroke-width", "1");
    g.appendChild(path);

  } else if (def.shape === "circle_spot") {
    // スポット（照明：固定サイズ二重円）
    const circle1 = document.createElementNS(SVGNS, "circle");
    circle1.setAttribute("r", "10");
    circle1.setAttribute("fill", def.color);
    circle1.setAttribute("stroke", strokeColor);
    circle1.setAttribute("stroke-width", strokeWidth);
    g.appendChild(circle1);

    const circle2 = document.createElementNS(SVGNS, "circle");
    circle2.setAttribute("r", "6");
    circle2.setAttribute("fill", "none");
    circle2.setAttribute("stroke", "#ffffff");
    circle2.setAttribute("stroke-width", "1");
    g.appendChild(circle2);

  } else if (def.shape === "diamond") {
    // ムービング（照明：固定サイズひし形）
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-8"); rect.setAttribute("y", "-8");
    rect.setAttribute("width", "16"); rect.setAttribute("height", "16");
    rect.setAttribute("transform", "rotate(45)");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

  } else if (def.shape === "rect_horiz") {
    // ホリゾント（照明：固定サイズ矩形）
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-15"); rect.setAttribute("y", "-6");
    rect.setAttribute("width", "30"); rect.setAttribute("height", "12");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

  } else if (def.shape === "screen") {
    // スクリーン（映像：固定サイズ）
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-25"); rect.setAttribute("y", "-6");
    rect.setAttribute("width", "50"); rect.setAttribute("height", "12");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    const inner = document.createElementNS(SVGNS, "rect");
    inner.setAttribute("x", "-21"); inner.setAttribute("y", "-3");
    inner.setAttribute("width", "42"); inner.setAttribute("height", "6");
    inner.setAttribute("fill", "#ffffff");
    g.appendChild(inner);
  } else if (def.shape === "led_panel_500_1000") {
    // LED Panel 500x1000 (平面シンボル: 実寸比率 500x80 ベース)
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("rx", "1"); rect.setAttribute("ry", "1");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    // 前面（発光面）を象徴する、高密度な点線の横線
    const emitLine = document.createElementNS(SVGNS, "line");
    emitLine.setAttribute("x1", String(-wPx / 2 + 2));
    emitLine.setAttribute("y1", String(-hPx / 2 + 2.5));
    emitLine.setAttribute("x2", String(wPx / 2 - 2));
    emitLine.setAttribute("y2", String(-hPx / 2 + 2.5));
    emitLine.setAttribute("stroke", "#ffffff");
    emitLine.setAttribute("stroke-width", "0.8");
    emitLine.setAttribute("stroke-dasharray", "1.5,1.5");
    g.appendChild(emitLine);

    // 背面側のモジュール境界線
    for (let i = -1; i <= 1; i++) {
      if (i === 0) continue;
      const divider = document.createElementNS(SVGNS, "line");
      divider.setAttribute("x1", String(i * wPx * 0.25));
      divider.setAttribute("y1", String(-hPx / 2));
      divider.setAttribute("x2", String(i * wPx * 0.25));
      divider.setAttribute("y2", String(hPx / 2));
      divider.setAttribute("stroke", strokeColor);
      divider.setAttribute("stroke-width", "0.5");
      g.appendChild(divider);
    }

  } else if (def.shape === "image") {
    // 画像オブジェクト（看板・スクリーン）：実寸サイズの長方形に、
    // 画像があればその画像を描画するが、平面図は真上から見た図なので、
    // 通常の長方形（枠付き、および状態インジケータ）として描く。
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    // 平面図でも画像が貼り付けられていることがわかるように中央にアイコンを描く
    const text = document.createElementNS(SVGNS, "text");
    text.setAttribute("x", "0");
    text.setAttribute("y", "2");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#ffffff");
    text.setAttribute("font-size", "7px");
    text.textContent = fixture.imageSrc ? "📷" : "IMG";
    g.appendChild(text);

  } else if (def.shape === "projector") {
    // プロジェクター（映像：固定サイズ）
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-12"); rect.setAttribute("y", "-10");
    rect.setAttribute("width", "24"); rect.setAttribute("height", "20");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    const lens = document.createElementNS(SVGNS, "polygon");
    lens.setAttribute("points", "12,-4 17,-6 17,6 12,4");
    lens.setAttribute("fill", def.color);
    lens.setAttribute("stroke", strokeColor);
    lens.setAttribute("stroke-width", "1");
    g.appendChild(lens);

  } else if (def.shape === "camera") {
    // カメラ（映像：固定サイズ）
    const body = document.createElementNS(SVGNS, "rect");
    body.setAttribute("x", "-10"); body.setAttribute("y", "-4");
    body.setAttribute("width", "20"); body.setAttribute("height", "10");
    body.setAttribute("fill", def.color);
    body.setAttribute("stroke", strokeColor);
    body.setAttribute("stroke-width", strokeWidth);
    g.appendChild(body);

    const lens = document.createElementNS(SVGNS, "polygon");
    lens.setAttribute("points", "10,-2 14,-4 14,4 10,2");
    lens.setAttribute("fill", def.color);
    lens.setAttribute("stroke", strokeColor);
    lens.setAttribute("stroke-width", "1");
    g.appendChild(lens);

    const tape1 = document.createElementNS(SVGNS, "circle");
    tape1.setAttribute("cx", "-4"); tape1.setAttribute("cy", "-7");
    tape1.setAttribute("r", "3");
    tape1.setAttribute("fill", def.color);
    tape1.setAttribute("stroke", strokeColor);
    tape1.setAttribute("stroke-width", "1");
    g.appendChild(tape1);

    const tape2 = document.createElementNS(SVGNS, "circle");
    tape2.setAttribute("cx", "4"); tape2.setAttribute("cy", "-7");
    tape2.setAttribute("r", "3");
    tape2.setAttribute("fill", def.color);
    tape2.setAttribute("stroke", strokeColor);
    tape2.setAttribute("stroke-width", "1");
    g.appendChild(tape2);

  } else if (def.shape === "led_bar") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-20"); rect.setAttribute("y", "-5");
    rect.setAttribute("width", "40"); rect.setAttribute("height", "10");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);
    for (let i = -15; i <= 15; i += 6) {
      const dot = document.createElementNS(SVGNS, "circle");
      dot.setAttribute("cx", String(i)); dot.setAttribute("cy", "0");
      dot.setAttribute("r", "1.5");
      dot.setAttribute("fill", "#ffffff");
      g.appendChild(dot);
    }

  } else if (def.shape === "slim_par") {
    // スリムPAR（平面シンボル：アスペクト比維持の角丸四角形 + アームおよび内側の円）
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("rx", "2"); rect.setAttribute("ry", "2");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    // アーム（背後のブラケットを表現する線）
    const arm = document.createElementNS(SVGNS, "path");
    arm.setAttribute("d", `M ${-wPx/2 - 2} 0 L ${wPx/2 + 2} 0`);
    arm.setAttribute("stroke", strokeColor);
    arm.setAttribute("stroke-width", String(Math.max(1, strokeWidth - 0.5)));
    g.appendChild(arm);

    // LEDレンズを象徴する中央の円
    const circle = document.createElementNS(SVGNS, "circle");
    circle.setAttribute("r", String(Math.min(wPx, hPx) * 0.35));
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#ffffff");
    circle.setAttribute("stroke-width", "1");
    g.appendChild(circle);

  } else if (def.shape === "liteparpro") {
    // LiteParPro (平面シンボル: 実寸比率304x177の角丸矩形 + 側面の大型ブラケット + 中央の大きな出射円)
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("rx", "3"); rect.setAttribute("ry", "3");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    // ダブルブラケットアーム（左右の厚みあるブラケット線）
    const arm = document.createElementNS(SVGNS, "path");
    arm.setAttribute("d", `M ${-wPx/2 - 3} ${-hPx*0.2} L ${-wPx/2 - 3} ${hPx*0.2} M ${wPx/2 + 3} ${-hPx*0.2} L ${wPx/2 + 3} ${hPx*0.2}`);
    arm.setAttribute("stroke", strokeColor);
    arm.setAttribute("stroke-width", String(Math.max(1.5, strokeWidth)));
    g.appendChild(arm);

    // 中央の発光面（二重の同心円）
    const circleOut = document.createElementNS(SVGNS, "circle");
    circleOut.setAttribute("r", String(Math.min(wPx, hPx) * 0.38));
    circleOut.setAttribute("fill", "none");
    circleOut.setAttribute("stroke", "#ffffff");
    circleOut.setAttribute("stroke-width", "1");
    g.appendChild(circleOut);

    const circleIn = document.createElementNS(SVGNS, "circle");
    circleIn.setAttribute("r", String(Math.min(wPx, hPx) * 0.22));
    circleIn.setAttribute("fill", "none");
    circleIn.setAttribute("stroke", "#ffffff");
    circleIn.setAttribute("stroke-width", "0.8");
    g.appendChild(circleIn);

  } else if (def.shape === "sixbar1000") {
    // SIXBAR 1000 (平面シンボル: 実寸比率900x206のスリムな横長長方形 + 左右のアーム脚 + 12個の等間隔レンズ円)
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("rx", "2"); rect.setAttribute("ry", "2");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    // 左右のブラケット（脚）
    const legs = document.createElementNS(SVGNS, "path");
    legs.setAttribute("d", `M ${-wPx/2} ${-hPx*0.4} L ${-wPx/2 - 4} ${-hPx*0.4} L ${-wPx/2 - 4} ${hPx*0.4} L ${-wPx/2} ${hPx*0.4} M ${wPx/2} ${-hPx*0.4} L ${wPx/2 + 4} ${-hPx*0.4} L ${wPx/2 + 4} ${hPx*0.4} L ${wPx/2} ${hPx*0.4}`);
    legs.setAttribute("stroke", strokeColor);
    legs.setAttribute("stroke-width", String(Math.max(1.0, strokeWidth)));
    legs.setAttribute("fill", "none");
    g.appendChild(legs);

    // 12個の等間隔LEDレンズ
    const step = wPx / 13;
    const lensRadius = Math.min(wPx, hPx) * 0.16;
    for (let idx = 1; idx <= 12; idx++) {
      const cx = -wPx / 2 + step * idx;
      const lens = document.createElementNS(SVGNS, "circle");
      lens.setAttribute("cx", String(cx));
      lens.setAttribute("cy", "0");
      lens.setAttribute("r", String(lensRadius));
      lens.setAttribute("fill", "none");
      lens.setAttribute("stroke", "#ffffff");
      lens.setAttribute("stroke-width", "0.8");
      g.appendChild(lens);
    }

  } else if (def.shape === "moving_wash_1915") {
    // 19x15W LED zoom moving wash light (平面シンボル: 実寸比率300x185ベース)
    // ベース（土台）
    const base = document.createElementNS(SVGNS, "rect");
    base.setAttribute("x", String(-wPx / 2));
    base.setAttribute("y", String(-hPx / 2));
    base.setAttribute("width", String(wPx));
    base.setAttribute("height", String(hPx));
    base.setAttribute("rx", "6");
    base.setAttribute("ry", "6");
    base.setAttribute("fill", "#2b2d42");
    base.setAttribute("stroke", strokeColor);
    base.setAttribute("stroke-width", strokeWidth);
    g.appendChild(base);

    // ヨーク（アームブラケット）
    const yoke = document.createElementNS(SVGNS, "path");
    const yW = wPx * 0.8;
    const yH = hPx * 0.5;
    yoke.setAttribute("d", `M ${-yW/2} ${-yH/2} L ${-yW/2} ${yH/2} A ${yW/2} ${yH/2} 0 0 0 ${yW/2} ${yH/2} L ${yW/2} ${-yH/2}`);
    yoke.setAttribute("fill", "none");
    yoke.setAttribute("stroke", strokeColor);
    yoke.setAttribute("stroke-width", String(Math.max(1.8, strokeWidth)));
    g.appendChild(yoke);

    // ヘッド（中央の大型円）
    const headRadius = Math.min(wPx, hPx) * 0.42;
    const head = document.createElementNS(SVGNS, "circle");
    head.setAttribute("cx", "0");
    head.setAttribute("cy", "0");
    head.setAttribute("r", String(headRadius));
    head.setAttribute("fill", def.color);
    head.setAttribute("stroke", strokeColor);
    head.setAttribute("stroke-width", strokeWidth);
    g.appendChild(head);

    // 19個のLEDアレイ
    const lensRadius = headRadius * 0.12;
    
    // 1. 中心 (0, 0)
    const cLens = document.createElementNS(SVGNS, "circle");
    cLens.setAttribute("cx", "0");
    cLens.setAttribute("cy", "0");
    cLens.setAttribute("r", String(lensRadius));
    cLens.setAttribute("fill", "#ffffff");
    cLens.setAttribute("opacity", "0.95");
    cLens.setAttribute("stroke", strokeColor);
    cLens.setAttribute("stroke-width", "0.5");
    g.appendChild(cLens);

    // 2. 内輪 (6個, 半径 = headRadius * 0.42)
    const r1 = headRadius * 0.42;
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 * Math.PI) / 180;
      const lx = r1 * Math.cos(angle);
      const ly = r1 * Math.sin(angle);
      const lens = document.createElementNS(SVGNS, "circle");
      lens.setAttribute("cx", String(lx));
      lens.setAttribute("cy", String(ly));
      lens.setAttribute("r", String(lensRadius));
      lens.setAttribute("fill", "#ffffff");
      lens.setAttribute("opacity", "0.95");
      lens.setAttribute("stroke", strokeColor);
      lens.setAttribute("stroke-width", "0.5");
      g.appendChild(lens);
    }

    // 3. 外輪 (12個, 半径 = headRadius * 0.78)
    const r2 = headRadius * 0.78;
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const lx = r2 * Math.cos(angle);
      const ly = r2 * Math.sin(angle);
      const lens = document.createElementNS(SVGNS, "circle");
      lens.setAttribute("cx", String(lx));
      lens.setAttribute("cy", String(ly));
      lens.setAttribute("r", String(lensRadius));
      lens.setAttribute("fill", "#ffffff");
      lens.setAttribute("opacity", "0.95");
      lens.setAttribute("stroke", strokeColor);
      lens.setAttribute("stroke-width", "0.5");
      g.appendChild(lens);
    }

  } else if (def.shape === "mini_moving_120") {
    // 120W Mini LED Moving Head (平面シンボル: 実寸比率 230x160 ベース)
    // ベース（土台）
    const base = document.createElementNS(SVGNS, "rect");
    base.setAttribute("x", String(-wPx / 2));
    base.setAttribute("y", String(-hPx / 2));
    base.setAttribute("width", String(wPx));
    base.setAttribute("height", String(hPx));
    base.setAttribute("rx", "4");
    base.setAttribute("ry", "4");
    base.setAttribute("fill", "#1e293b"); // ダークグレー
    base.setAttribute("stroke", strokeColor);
    base.setAttribute("stroke-width", strokeWidth);
    g.appendChild(base);

    // ヨーク（アームブラケット）
    const yoke = document.createElementNS(SVGNS, "path");
    const yW = wPx * 0.76;
    const yH = hPx * 0.45;
    yoke.setAttribute("d", `M ${-yW/2} ${-yH/2} L ${-yW/2} ${yH/2} A ${yW/2} ${yH/2} 0 0 0 ${yW/2} ${yH/2} L ${yW/2} ${-yH/2}`);
    yoke.setAttribute("fill", "none");
    yoke.setAttribute("stroke", strokeColor);
    yoke.setAttribute("stroke-width", String(Math.max(1.5, strokeWidth)));
    g.appendChild(yoke);

    // ヘッド（中央の丸型可動部）
    const headRadius = Math.min(wPx, hPx) * 0.45;
    const head = document.createElementNS(SVGNS, "circle");
    head.setAttribute("cx", "0");
    head.setAttribute("cy", "0");
    head.setAttribute("r", String(headRadius));
    head.setAttribute("fill", def.color);
    head.setAttribute("stroke", strokeColor);
    head.setAttribute("stroke-width", strokeWidth);
    g.appendChild(head);

    // 大型レンズ（スポット・ビームの出射レンズを表現）
    const lens = document.createElementNS(SVGNS, "circle");
    lens.setAttribute("cx", "0");
    lens.setAttribute("cy", "0");
    lens.setAttribute("r", String(headRadius * 0.55));
    lens.setAttribute("fill", "#ffffff");
    lens.setAttribute("opacity", "0.9");
    lens.setAttribute("stroke", strokeColor);
    lens.setAttribute("stroke-width", "0.8");
    g.appendChild(lens);

    // レンズ内の十字でスポット感を出す
    const cross = document.createElementNS(SVGNS, "path");
    const len = headRadius * 0.4;
    cross.setAttribute("d", `M ${-len} 0 L ${len} 0 M 0 ${-len} L 0 ${len}`);
    cross.setAttribute("stroke", strokeColor);
    cross.setAttribute("stroke-width", "0.6");
    g.appendChild(cross);

  } else if (def.shape === "led_strobe_200") {
    // 200W RGBW LED Strobe Light (平面シンボル: 実寸比率 400x100 ベース)
    // 本体外枠
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2));
    rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx));
    rect.setAttribute("height", String(hPx));
    rect.setAttribute("rx", "2");
    rect.setAttribute("ry", "2");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    // 左右の取付ブラケット
    const bracket = document.createElementNS(SVGNS, "path");
    bracket.setAttribute("d", `M ${-wPx/2} ${-hPx*0.3} L ${-wPx/2 - 3} ${-hPx*0.3} L ${-wPx/2 - 3} ${hPx*0.3} L ${-wPx/2} ${hPx*0.3} M ${wPx/2} ${-hPx*0.3} L ${wPx/2 + 3} ${-hPx*0.3} L ${wPx/2 + 3} ${hPx*0.3} L ${wPx/2} ${hPx*0.3}`);
    bracket.setAttribute("stroke", strokeColor);
    bracket.setAttribute("stroke-width", "1");
    bracket.setAttribute("fill", "none");
    g.appendChild(bracket);

    // セグメントを象徴するインナーグリッド (3本の並行破線)
    const line1 = document.createElementNS(SVGNS, "line");
    line1.setAttribute("x1", String(-wPx * 0.45)); line1.setAttribute("y1", String(-hPx * 0.2));
    line1.setAttribute("x2", String(wPx * 0.45)); line1.setAttribute("y2", String(-hPx * 0.2));
    line1.setAttribute("stroke", "#ffffff");
    line1.setAttribute("stroke-width", "1");
    line1.setAttribute("stroke-dasharray", "4,2");
    g.appendChild(line1);

    const line2 = document.createElementNS(SVGNS, "line");
    line2.setAttribute("x1", String(-wPx * 0.45)); line2.setAttribute("y1", "0");
    line2.setAttribute("x2", String(wPx * 0.45)); line2.setAttribute("y2", "0");
    line2.setAttribute("stroke", "#ffffff");
    line2.setAttribute("stroke-width", "1.2");
    line2.setAttribute("stroke-dasharray", "6,3");
    g.appendChild(line2);

    const line3 = document.createElementNS(SVGNS, "line");
    line3.setAttribute("x1", String(-wPx * 0.45)); line3.setAttribute("y1", String(hPx * 0.2));
    line3.setAttribute("x2", String(wPx * 0.45)); line3.setAttribute("y2", String(hPx * 0.2));
    line3.setAttribute("stroke", "#ffffff");
    line3.setAttribute("stroke-width", "1");
    line3.setAttribute("stroke-dasharray", "4,2");
    g.appendChild(line3);

  } else if (def.shape === "cob_zoom_par_300") {
    // 300W COB Zoom Par (平面シンボル: 実寸比率 280x300 ベース)
    // 外枠（角丸長方形、パーライトの筒体を表現）
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2));
    rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx));
    rect.setAttribute("height", String(hPx));
    rect.setAttribute("rx", "6");
    rect.setAttribute("ry", "6");
    rect.setAttribute("fill", "#27272a"); // チャコールグレー
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    // アームブラケット
    const bracket = document.createElementNS(SVGNS, "path");
    bracket.setAttribute("d", `M ${-wPx/2 - 2} 0 L ${-wPx/2 - 2} ${hPx/4} L ${wPx/2 + 2} ${hPx/4} L ${wPx/2 + 2} 0`);
    bracket.setAttribute("fill", "none");
    bracket.setAttribute("stroke", strokeColor);
    bracket.setAttribute("stroke-width", "1.2");
    g.appendChild(bracket);

    // フロントレンズコーン（前方に向かう照射面）
    const frontLens = document.createElementNS(SVGNS, "circle");
    frontLens.setAttribute("cx", "0");
    frontLens.setAttribute("cy", String(-hPx * 0.15));
    frontLens.setAttribute("r", String(wPx * 0.42));
    frontLens.setAttribute("fill", def.color);
    frontLens.setAttribute("stroke", strokeColor);
    frontLens.setAttribute("stroke-width", strokeWidth);
    g.appendChild(frontLens);

    // COB LED の巨大な単一発光素子（黄色の同心円でCOBらしさを強調）
    const cobCenter = document.createElementNS(SVGNS, "circle");
    cobCenter.setAttribute("cx", "0");
    cobCenter.setAttribute("cy", String(-hPx * 0.15));
    cobCenter.setAttribute("r", String(wPx * 0.22));
    cobCenter.setAttribute("fill", "#fbbf24"); // 鮮やかな黄色 (COBチップカラー)
    cobCenter.setAttribute("stroke", strokeColor);
    cobCenter.setAttribute("stroke-width", "0.6");
    g.appendChild(cobCenter);

    // COB発光素子のディテール（中心の小さなサークル）
    const cobCore = document.createElementNS(SVGNS, "circle");
    cobCore.setAttribute("cx", "0");
    cobCore.setAttribute("cy", String(-hPx * 0.15));
    cobCore.setAttribute("r", String(wPx * 0.08));
    cobCore.setAttribute("fill", "#f59e0b"); // オレンジ寄りの黄色
    g.appendChild(cobCore);

    // 背面の放熱フィン（ヒートシンク）を象徴するスリット
    for (let i = 0; i < 3; i++) {
      const slit = document.createElementNS(SVGNS, "line");
      const y = hPx * 0.22 + i * 5;
      slit.setAttribute("x1", String(-wPx * 0.25));
      slit.setAttribute("y1", String(y));
      slit.setAttribute("x2", String(wPx * 0.25));
      slit.setAttribute("y2", String(y));
      slit.setAttribute("stroke", strokeColor);
      slit.setAttribute("stroke-width", "0.8");
      g.appendChild(slit);
    }

  } else if (def.shape === "smoke_machine") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-12"); rect.setAttribute("y", "-6");
    rect.setAttribute("width", "24"); rect.setAttribute("height", "14");
    rect.setAttribute("rx", "2");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);
    const smoke = document.createElementNS(SVGNS, "path");
    smoke.setAttribute("d", "M -4 -6 Q -2 -14 0 -10 Q 2 -6 4 -12 Q 6 -18 8 -10");
    smoke.setAttribute("fill", "none");
    smoke.setAttribute("stroke", "#cccccc");
    smoke.setAttribute("stroke-width", "1.5");
    g.appendChild(smoke);

  } else if (def.shape === "smoke_jet") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-5"); rect.setAttribute("y", "-4");
    rect.setAttribute("width", "10"); rect.setAttribute("height", "12");
    rect.setAttribute("rx", "1");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);
    const jet = document.createElementNS(SVGNS, "path");
    jet.setAttribute("d", "M -2 -4 L 0 -16 L 2 -4");
    jet.setAttribute("fill", "none");
    jet.setAttribute("stroke", "#cccccc");
    jet.setAttribute("stroke-width", "1.5");
    g.appendChild(jet);

  } else if (def.shape === "console_l20r") {
    // LiveTrak L-20R (平面シンボル: 実寸比率 438x158 ラックマウントミキサー)
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2));
    rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx));
    rect.setAttribute("height", String(hPx));
    rect.setAttribute("rx", "1");
    rect.setAttribute("ry", "1");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    // 左右のラックマウント用フランジ (耳)
    for (const x of [-wPx / 2, wPx / 2]) {
      const ear = document.createElementNS(SVGNS, "rect");
      ear.setAttribute("x", String(x === -wPx / 2 ? -wPx / 2 - 3 : wPx / 2));
      ear.setAttribute("y", String(-hPx * 0.4));
      ear.setAttribute("width", "3");
      ear.setAttribute("height", String(hPx * 0.8));
      ear.setAttribute("fill", "#64748b");
      ear.setAttribute("stroke", strokeColor);
      ear.setAttribute("stroke-width", "0.5");
      g.appendChild(ear);
    }

    // フロント面を示す白線 (前面 -hPx/2 + 2)
    const gr = document.createElementNS(SVGNS, "line");
    gr.setAttribute("x1", String(-wPx / 2 + 2));
    gr.setAttribute("y1", String(-hPx / 2 + 2));
    gr.setAttribute("x2", String(wPx / 2 - 2));
    gr.setAttribute("y2", String(-hPx / 2 + 2));
    gr.setAttribute("stroke", "#ffffff");
    gr.setAttribute("stroke-width", "0.8");
    gr.setAttribute("opacity", "0.8");
    g.appendChild(gr);

    // 多数の入力端子 (XLR/TRSコンボジャック) の配置 (前面側に 8個 x 2列)
    for (let i = 0; i < 8; i++) {
      const x = -wPx * 0.4 + (wPx * 0.8 * i) / 7;
      for (const y of [-hPx * 0.25, -hPx * 0.05]) {
        const jack = document.createElementNS(SVGNS, "circle");
        jack.setAttribute("cx", String(x));
        jack.setAttribute("cy", String(y));
        jack.setAttribute("r", String(Math.min(wPx, hPx) * 0.04));
        jack.setAttribute("fill", "#0f172a");
        jack.setAttribute("stroke", strokeColor);
        jack.setAttribute("stroke-width", "0.5");
        g.appendChild(jack);
      }
    }

    // 右側の出力セクション、フェーダーエリアを示す矩形
    const sect = document.createElementNS(SVGNS, "rect");
    sect.setAttribute("x", String(wPx * 0.16));
    sect.setAttribute("y", String(-hPx * 0.3));
    sect.setAttribute("width", String(wPx * 0.3));
    sect.setAttribute("height", String(hPx * 0.6));
    sect.setAttribute("rx", "1");
    sect.setAttribute("fill", "#0f172a");
    sect.setAttribute("stroke", strokeColor);
    sect.setAttribute("stroke-width", "0.5");
    g.appendChild(sect);

  } else if (def.shape === "speaker_eon612") {
    // JBL EON612 (平面シンボル: 実寸比率 380x316 ウェッジキャビネット)
    const poly = document.createElementNS(SVGNS, "polygon");
    const points = [
      [-wPx / 2, -hPx / 2],
      [wPx / 2, -hPx / 2],
      [wPx * 0.22, hPx / 2],
      [-wPx * 0.22, hPx / 2]
    ].map(p => p.join(",")).join(" ");
    poly.setAttribute("points", points);
    poly.setAttribute("fill", def.color);
    poly.setAttribute("stroke", strokeColor);
    poly.setAttribute("stroke-width", strokeWidth);
    g.appendChild(poly);

    // フロントグリル面を示す二重線 (前面より少し下がったところ)
    const gr = document.createElementNS(SVGNS, "line");
    gr.setAttribute("x1", String(-wPx / 2 + 1.5));
    gr.setAttribute("y1", String(-hPx / 2 + 2));
    gr.setAttribute("x2", String(wPx / 2 - 1.5));
    gr.setAttribute("y2", String(-hPx / 2 + 2));
    gr.setAttribute("stroke", "#ffffff");
    gr.setAttribute("stroke-width", "0.8");
    gr.setAttribute("opacity", "0.8");
    g.appendChild(gr);

    // JBLの特徴的なオレンジロゴバッジ (前面中央下部)
    const logoBg = document.createElementNS(SVGNS, "rect");
    logoBg.setAttribute("x", "-2.5");
    logoBg.setAttribute("y", String(-hPx / 2 + 0.5));
    logoBg.setAttribute("width", "5");
    logoBg.setAttribute("height", "3");
    logoBg.setAttribute("fill", "#ff5500");
    g.appendChild(logoBg);

    // 天面・左右のキャリングハンドル
    // 左右ハンドル
    for (const xSign of [-1, 1]) {
      const handle = document.createElementNS(SVGNS, "rect");
      handle.setAttribute("x", String(xSign === -1 ? -wPx / 2 + 2 : wPx / 2 - 5));
      handle.setAttribute("y", String(-hPx * 0.1));
      handle.setAttribute("width", "3");
      handle.setAttribute("height", String(hPx * 0.35));
      handle.setAttribute("rx", "1");
      handle.setAttribute("fill", "none");
      handle.setAttribute("stroke", strokeColor);
      handle.setAttribute("stroke-width", "0.5");
      g.appendChild(handle);
    }
    // 天面ハンドル (中央やや後方)
    const topHandle = document.createElementNS(SVGNS, "rect");
    topHandle.setAttribute("x", String(-wPx * 0.16));
    topHandle.setAttribute("y", String(hPx * 0.1));
    topHandle.setAttribute("width", String(wPx * 0.32));
    topHandle.setAttribute("height", String(hPx * 0.12));
    topHandle.setAttribute("rx", "1");
    topHandle.setAttribute("fill", "none");
    topHandle.setAttribute("stroke", strokeColor);
    topHandle.setAttribute("stroke-width", "0.6");
    g.appendChild(topHandle);

  } else if (def.shape === "speaker_titan_8a") {
    // Titan 8A MKII (平面シンボル: 実寸比率 266x221 有機的流線型キャビネット)
    const cabinet = document.createElementNS(SVGNS, "path");
    const d = `M ${-wPx / 2} ${-hPx * 0.25} 
               Q 0 ${-hPx / 2} ${wPx / 2} ${-hPx * 0.25} 
               L ${wPx * 0.36} ${hPx / 2} 
               Q 0 ${hPx * 0.44} ${-wPx * 0.36} ${hPx / 2} Z`;
    cabinet.setAttribute("d", d);
    cabinet.setAttribute("fill", def.color);
    cabinet.setAttribute("stroke", strokeColor);
    cabinet.setAttribute("stroke-width", strokeWidth);
    g.appendChild(cabinet);

    // フロントグリル面（前面より少し下がったところのカーブ）
    const gr = document.createElementNS(SVGNS, "path");
    const gd = `M ${-wPx / 2 + 1.5} ${-hPx * 0.25 + 2} Q 0 ${-hPx / 2 + 2} ${wPx / 2 - 1.5} ${-hPx * 0.25 + 2}`;
    gr.setAttribute("d", gd);
    gr.setAttribute("fill", "none");
    gr.setAttribute("stroke", "#ffffff");
    gr.setAttribute("stroke-width", "0.8");
    gr.setAttribute("opacity", "0.8");
    g.appendChild(gr);

    // グリル中央の縦のデザインリブ
    const rib = document.createElementNS(SVGNS, "line");
    rib.setAttribute("x1", "0");
    rib.setAttribute("y1", String(-hPx / 2 + 2));
    rib.setAttribute("x2", "0");
    rib.setAttribute("y2", String(-hPx * 0.25 + 2));
    rib.setAttribute("stroke", "#ffffff");
    rib.setAttribute("stroke-width", "1");
    g.appendChild(rib);

    // トップハンドル（天面中央の円形ポケットハンドル）
    const handle = document.createElementNS(SVGNS, "circle");
    handle.setAttribute("cx", "0");
    handle.setAttribute("cy", String(hPx * 0.05));
    handle.setAttribute("r", String(Math.min(wPx, hPx) * 0.12));
    handle.setAttribute("fill", "none");
    handle.setAttribute("stroke", strokeColor);
    handle.setAttribute("stroke-width", "0.6");
    g.appendChild(handle);

    const handleInner = document.createElementNS(SVGNS, "line");
    handleInner.setAttribute("x1", String(-wPx * 0.06));
    handleInner.setAttribute("y1", String(hPx * 0.05));
    handleInner.setAttribute("x2", String(wPx * 0.06));
    handleInner.setAttribute("y2", String(hPx * 0.05));
    handleInner.setAttribute("stroke", strokeColor);
    handleInner.setAttribute("stroke-width", "1");
    g.appendChild(handleInner);

  } else if (def.shape === "speaker_elx200_12") {
    // ELX200-12 (平面シンボル: 実寸比率 363x344 台形キャビネット)
    const poly = document.createElementNS(SVGNS, "polygon");
    const points = [
      [-wPx / 2, -hPx / 2],
      [wPx / 2, -hPx / 2],
      [wPx * 0.28, hPx / 2],
      [-wPx * 0.28, hPx / 2]
    ].map(p => p.join(",")).join(" ");
    poly.setAttribute("points", points);
    poly.setAttribute("fill", def.color);
    poly.setAttribute("stroke", strokeColor);
    poly.setAttribute("stroke-width", strokeWidth);
    g.appendChild(poly);

    // フロントグリル面を示す二重線
    const gr = document.createElementNS(SVGNS, "line");
    gr.setAttribute("x1", String(-wPx / 2 + 1));
    gr.setAttribute("y1", String(-hPx / 2 + 2));
    gr.setAttribute("x2", String(wPx / 2 - 1));
    gr.setAttribute("y2", String(-hPx / 2 + 2));
    gr.setAttribute("stroke", "#ffffff");
    gr.setAttribute("stroke-width", "0.8");
    gr.setAttribute("opacity", "0.8");
    g.appendChild(gr);

    // トップハンドル（天面中央のインセットポケット）
    const handle = document.createElementNS(SVGNS, "rect");
    handle.setAttribute("x", String(-wPx * 0.15));
    handle.setAttribute("y", String(-hPx * 0.1));
    handle.setAttribute("width", String(wPx * 0.3));
    handle.setAttribute("height", String(hPx * 0.25));
    handle.setAttribute("rx", "1");
    handle.setAttribute("fill", "none");
    handle.setAttribute("stroke", strokeColor);
    handle.setAttribute("stroke-width", "0.6");
    g.appendChild(handle);

    const slit = document.createElementNS(SVGNS, "line");
    slit.setAttribute("x1", String(-wPx * 0.1));
    slit.setAttribute("y1", "0");
    slit.setAttribute("x2", String(wPx * 0.1));
    slit.setAttribute("y2", "0");
    slit.setAttribute("stroke", strokeColor);
    slit.setAttribute("stroke-width", "1");
    g.appendChild(slit);

    // EVロゴマーク (V字エンブレム)
    const logo = document.createElementNS(SVGNS, "path");
    logo.setAttribute("d", "M -3 -10 L 0 -5 L 3 -10");
    logo.setAttribute("fill", "none");
    logo.setAttribute("stroke", "#ffffff");
    logo.setAttribute("stroke-width", "1");
    g.appendChild(logo);

  } else if (def.shape === "speaker_elx200_15") {
    // ELX200-15 (平面シンボル: 実寸比率 423x384 台形キャビネット)
    const poly = document.createElementNS(SVGNS, "polygon");
    const points = [
      [-wPx / 2, -hPx / 2],
      [wPx / 2, -hPx / 2],
      [wPx * 0.28, hPx / 2],
      [-wPx * 0.28, hPx / 2]
    ].map(p => p.join(",")).join(" ");
    poly.setAttribute("points", points);
    poly.setAttribute("fill", def.color);
    poly.setAttribute("stroke", strokeColor);
    poly.setAttribute("stroke-width", strokeWidth);
    g.appendChild(poly);

    // フロントグリル面を示す二重線 (前面より少し下がったところ)
    const gr = document.createElementNS(SVGNS, "line");
    gr.setAttribute("x1", String(-wPx / 2 + 1));
    gr.setAttribute("y1", String(-hPx / 2 + 2));
    gr.setAttribute("x2", String(wPx / 2 - 1));
    gr.setAttribute("y2", String(-hPx / 2 + 2));
    gr.setAttribute("stroke", "#ffffff");
    gr.setAttribute("stroke-width", "0.8");
    gr.setAttribute("opacity", "0.8");
    g.appendChild(gr);

    // トップハンドル（天面中央のインセットポケット）
    const handle = document.createElementNS(SVGNS, "rect");
    handle.setAttribute("x", String(-wPx * 0.15));
    handle.setAttribute("y", String(-hPx * 0.1));
    handle.setAttribute("width", String(wPx * 0.3));
    handle.setAttribute("height", String(hPx * 0.25));
    handle.setAttribute("rx", "1");
    handle.setAttribute("fill", "none");
    handle.setAttribute("stroke", strokeColor);
    handle.setAttribute("stroke-width", "0.6");
    g.appendChild(handle);

    // ハンドル内のスリット
    const slit = document.createElementNS(SVGNS, "line");
    slit.setAttribute("x1", String(-wPx * 0.1));
    slit.setAttribute("y1", "0");
    slit.setAttribute("x2", String(wPx * 0.1));
    slit.setAttribute("y2", "0");
    slit.setAttribute("stroke", strokeColor);
    slit.setAttribute("stroke-width", "1");
    g.appendChild(slit);

    // EVのシンボルマークを象徴する「V」マーク (フロントグリル中央部)
    const logo = document.createElementNS(SVGNS, "path");
    logo.setAttribute("d", "M -3 -12 L 0 -7 L 3 -12");
    logo.setAttribute("fill", "none");
    logo.setAttribute("stroke", "#ffffff");
    logo.setAttribute("stroke-width", "1");
    g.appendChild(logo);

  } else if (def.shape === "speaker_ip500") {
    // Turbosound iP500 (平面シンボル: 実寸比率 320x400 のサブウーファーベースと後方の細長いコラムスピーカー)
    // 1. サブウーファーベース (角が少し丸い長方形)
    const base = document.createElementNS(SVGNS, "rect");
    base.setAttribute("x", String(-wPx / 2));
    base.setAttribute("y", String(-hPx / 2));
    base.setAttribute("width", String(wPx));
    base.setAttribute("height", String(hPx));
    base.setAttribute("rx", String(wPx * 0.1));
    base.setAttribute("ry", String(wPx * 0.1));
    base.setAttribute("fill", def.color);
    base.setAttribute("stroke", strokeColor);
    base.setAttribute("stroke-width", strokeWidth);
    g.appendChild(base);

    // ベースのフロントグリルライン (前面は上側)
    const gr = document.createElementNS(SVGNS, "line");
    gr.setAttribute("x1", String(-wPx / 2 + 3));
    gr.setAttribute("y1", String(-hPx / 2 + 4));
    gr.setAttribute("x2", String(wPx / 2 - 3));
    gr.setAttribute("y2", String(-hPx / 2 + 4));
    gr.setAttribute("stroke", "#ffffff");
    gr.setAttribute("stroke-width", "1");
    gr.setAttribute("opacity", "0.8");
    g.appendChild(gr);

    // 2. コラムスピーカー（ベース後方に設置される柱。幅は約35%、奥行は約25%）
    const colW = wPx * 0.35;
    const colH = hPx * 0.25;
    const colX = -colW / 2;
    const colY = hPx * 0.15; // ベースの中央より後方（下側）に配置

    const column = document.createElementNS(SVGNS, "rect");
    column.setAttribute("x", String(colX));
    column.setAttribute("y", String(colY));
    column.setAttribute("width", String(colW));
    column.setAttribute("height", String(colH));
    column.setAttribute("rx", "1");
    column.setAttribute("ry", "1");
    column.setAttribute("fill", "#0f172a");
    column.setAttribute("stroke", strokeColor);
    column.setAttribute("stroke-width", "0.8");
    g.appendChild(column);

    // コラムのフロントグリル感（グリルネット方向を示す線。コラム内での前面は上側）
    const colGr = document.createElementNS(SVGNS, "line");
    colGr.setAttribute("x1", String(colX + 1));
    colGr.setAttribute("y1", String(colY + 2));
    colGr.setAttribute("x2", String(colX + colW - 1));
    colGr.setAttribute("y2", String(colY + 2));
    colGr.setAttribute("stroke", "#ffffff");
    colGr.setAttribute("stroke-width", "0.6");
    colGr.setAttribute("opacity", "0.6");
    g.appendChild(colGr);

  } else if (def.shape === "subwoofer_elx200_18sp") {
    // ELX200-18SP (平面シンボル: 実寸比率 507x574 ほぼ正方形の木製サブウーファー)
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2));
    rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx));
    rect.setAttribute("height", String(hPx));
    rect.setAttribute("rx", "2");
    rect.setAttribute("ry", "2");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

    // フロントグリル面を示す二重線 (前面より少し下がったところ)
    const gr = document.createElementNS(SVGNS, "line");
    gr.setAttribute("x1", String(-wPx / 2 + 1));
    gr.setAttribute("y1", String(-hPx / 2 + 2));
    gr.setAttribute("x2", String(wPx / 2 - 1));
    gr.setAttribute("y2", String(-hPx / 2 + 2));
    gr.setAttribute("stroke", "#ffffff");
    gr.setAttribute("stroke-width", "0.8");
    gr.setAttribute("opacity", "0.8");
    g.appendChild(gr);

    // 天面中央の M20 ポールマウントソケット
    const socketOuter = document.createElementNS(SVGNS, "circle");
    socketOuter.setAttribute("cx", "0");
    socketOuter.setAttribute("cy", "0");
    socketOuter.setAttribute("r", String(Math.min(wPx, hPx) * 0.08));
    socketOuter.setAttribute("fill", "none");
    socketOuter.setAttribute("stroke", strokeColor);
    socketOuter.setAttribute("stroke-width", "0.8");
    g.appendChild(socketOuter);

    const socketInner = document.createElementNS(SVGNS, "circle");
    socketInner.setAttribute("cx", "0");
    socketInner.setAttribute("cy", "0");
    socketInner.setAttribute("r", String(Math.min(wPx, hPx) * 0.04));
    socketInner.setAttribute("fill", "#000000");
    g.appendChild(socketInner);

    // 天面・背面側のキャリーハンドル
    for (const y of [-hPx * 0.28, hPx * 0.28]) {
      const handle = document.createElementNS(SVGNS, "rect");
      handle.setAttribute("x", String(-wPx * 0.16));
      handle.setAttribute("y", String(y - hPx * 0.06));
      handle.setAttribute("width", String(wPx * 0.32));
      handle.setAttribute("height", String(hPx * 0.12));
      handle.setAttribute("rx", "1");
      handle.setAttribute("fill", "none");
      handle.setAttribute("stroke", strokeColor);
      handle.setAttribute("stroke-width", "0.6");
      g.appendChild(handle);

      const slit = document.createElementNS(SVGNS, "line");
      slit.setAttribute("x1", String(-wPx * 0.1));
      slit.setAttribute("y1", String(y));
      slit.setAttribute("x2", String(wPx * 0.1));
      slit.setAttribute("y2", String(y));
      slit.setAttribute("stroke", strokeColor);
      slit.setAttribute("stroke-width", "0.8");
      g.appendChild(slit);
    }

  } else if (def.shape === "subwoofer") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-11"); rect.setAttribute("y", "-11");
    rect.setAttribute("width", "22"); rect.setAttribute("height", "22");
    rect.setAttribute("rx", "3");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);
    const inner = document.createElementNS(SVGNS, "circle");
    inner.setAttribute("r", "6");
    inner.setAttribute("fill", "none");
    inner.setAttribute("stroke", "#ffffff");
    inner.setAttribute("stroke-width", "1.5");
    g.appendChild(inner);

  } else if (def.shape === "line_array") {
    for (let i = -1; i <= 1; i++) {
      const rect = document.createElementNS(SVGNS, "rect");
      rect.setAttribute("x", "-10"); rect.setAttribute("y", String(i * 8 - 3));
      rect.setAttribute("width", "20"); rect.setAttribute("height", "6");
      rect.setAttribute("fill", def.color);
      rect.setAttribute("stroke", strokeColor);
      rect.setAttribute("stroke-width", "1");
      g.appendChild(rect);
    }

  } else if (def.shape === "amp") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-14"); rect.setAttribute("y", "-8");
    rect.setAttribute("width", "28"); rect.setAttribute("height", "16");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);
    const slits = document.createElementNS(SVGNS, "path");
    slits.setAttribute("d", "M -8 -4 L 8 -4 M -8 0 L 8 0 M -8 4 L 8 4");
    slits.setAttribute("stroke", "#ffffff");
    slits.setAttribute("stroke-width", "0.8");
    g.appendChild(slits);

  } else if (def.shape === "di_box") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-7"); rect.setAttribute("y", "-5");
    rect.setAttribute("width", "14"); rect.setAttribute("height", "10");
    rect.setAttribute("rx", "1");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

  } else if (def.shape === "wireless_rx") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-12"); rect.setAttribute("y", "-6");
    rect.setAttribute("width", "24"); rect.setAttribute("height", "12");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);
    const ant = document.createElementNS(SVGNS, "line");
    ant.setAttribute("x1", "6"); ant.setAttribute("y1", "-6");
    ant.setAttribute("x2", "10"); ant.setAttribute("y2", "-14");
    ant.setAttribute("stroke", strokeColor);
    ant.setAttribute("stroke-width", "1.5");
    g.appendChild(ant);

  } else if (def.shape === "stage_box") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-12"); rect.setAttribute("y", "-8");
    rect.setAttribute("width", "24"); rect.setAttribute("height", "16");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);
    for (let row = -1; row <= 1; row += 2) {
      for (let col = -2; col <= 2; col++) {
        const dot = document.createElementNS(SVGNS, "circle");
        dot.setAttribute("cx", String(col * 4)); dot.setAttribute("cy", String(row * 3));
        dot.setAttribute("r", "1");
        dot.setAttribute("fill", "#ffffff");
        g.appendChild(dot);
      }
    }

  } else if (def.shape === "in_ear") {
    const circle = document.createElementNS(SVGNS, "circle");
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", def.color);
    circle.setAttribute("stroke", strokeColor);
    circle.setAttribute("stroke-width", strokeWidth);
    g.appendChild(circle);
    const cable = document.createElementNS(SVGNS, "path");
    cable.setAttribute("d", "M 0 5 Q 8 10 4 16");
    cable.setAttribute("fill", "none");
    cable.setAttribute("stroke", strokeColor);
    cable.setAttribute("stroke-width", "1.2");
    g.appendChild(cable);

  } else if (def.shape === "delay_sp") {
    const path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", "M -6 -9 L 6 -9 L 4 9 L -4 9 Z");
    path.setAttribute("fill", def.color);
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", strokeWidth);
    g.appendChild(path);

  } else if (def.shape === "curtain") {
    const body = document.createElementNS(SVGNS, "rect");
    body.setAttribute("x", "-14"); body.setAttribute("y", "-4");
    body.setAttribute("width", "28"); body.setAttribute("height", "16");
    body.setAttribute("fill", def.color);
    body.setAttribute("stroke", strokeColor);
    body.setAttribute("stroke-width", strokeWidth);
    g.appendChild(body);
    const wave = document.createElementNS(SVGNS, "path");
    wave.setAttribute("d", "M -14 -4 Q -10 -10 -7 -4 Q -3 -10 0 -4 Q 3 -10 7 -4 Q 10 -10 14 -4");
    wave.setAttribute("fill", def.color);
    wave.setAttribute("stroke", strokeColor);
    wave.setAttribute("stroke-width", "1");
    g.appendChild(wave);

  } else if (def.shape === "backdrop") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);
    const bar = document.createElementNS(SVGNS, "line");
    bar.setAttribute("x1", String(-wPx / 2)); bar.setAttribute("y1", String(-hPx / 2));
    bar.setAttribute("x2", String(wPx / 2)); bar.setAttribute("y2", String(-hPx / 2));
    bar.setAttribute("stroke", "#333333");
    bar.setAttribute("stroke-width", "3");
    g.appendChild(bar);

  } else if (def.shape === "riser") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);
    const step = document.createElementNS(SVGNS, "line");
    step.setAttribute("x1", String(-wPx / 2)); step.setAttribute("y1", "0");
    step.setAttribute("x2", String(wPx / 2)); step.setAttribute("y2", "0");
    step.setAttribute("stroke", strokeColor);
    step.setAttribute("stroke-width", "1");
    step.setAttribute("stroke-dasharray", "4,3");
    g.appendChild(step);

  } else if (def.shape === "stairs") {
    const path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", "M -10 10 L -10 4 L -4 4 L -4 -2 L 2 -2 L 2 -8 L 10 -8 L 10 10 Z");
    path.setAttribute("fill", def.color);
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", strokeWidth);
    g.appendChild(path);

  } else if (def.shape === "podium") {
    const path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", "M -6 -10 L 6 -10 L 10 10 L -10 10 Z");
    path.setAttribute("fill", def.color);
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", strokeWidth);
    g.appendChild(path);

  } else if (def.shape === "table") {
    const top = document.createElementNS(SVGNS, "rect");
    top.setAttribute("x", "-16"); top.setAttribute("y", "-6");
    top.setAttribute("width", "32"); top.setAttribute("height", "12");
    top.setAttribute("fill", def.color);
    top.setAttribute("stroke", strokeColor);
    top.setAttribute("stroke-width", strokeWidth);
    g.appendChild(top);

  } else if (def.shape === "chair") {
    const seat = document.createElementNS(SVGNS, "rect");
    seat.setAttribute("x", "-5"); seat.setAttribute("y", "-2");
    seat.setAttribute("width", "10"); seat.setAttribute("height", "8");
    seat.setAttribute("fill", def.color);
    seat.setAttribute("stroke", strokeColor);
    seat.setAttribute("stroke-width", strokeWidth);
    g.appendChild(seat);
    const back = document.createElementNS(SVGNS, "line");
    back.setAttribute("x1", "-5"); back.setAttribute("y1", "-2");
    back.setAttribute("x2", "-5"); back.setAttribute("y2", "-8");
    back.setAttribute("stroke", strokeColor);
    back.setAttribute("stroke-width", "2");
    g.appendChild(back);

  } else if (def.shape === "mic_stand") {
    const pole = document.createElementNS(SVGNS, "line");
    pole.setAttribute("x1", "0"); pole.setAttribute("y1", "12");
    pole.setAttribute("x2", "0"); pole.setAttribute("y2", "-6");
    pole.setAttribute("stroke", def.color);
    pole.setAttribute("stroke-width", "2");
    g.appendChild(pole);
    const head = document.createElementNS(SVGNS, "circle");
    head.setAttribute("cy", "-8");
    head.setAttribute("r", "3");
    head.setAttribute("fill", def.color);
    head.setAttribute("stroke", strokeColor);
    head.setAttribute("stroke-width", "1");
    g.appendChild(head);
    const base = document.createElementNS(SVGNS, "path");
    base.setAttribute("d", "M -6 12 L 6 12");
    base.setAttribute("stroke", def.color);
    base.setAttribute("stroke-width", "2");
    g.appendChild(base);

  } else if (def.shape === "music_stand") {
    const pole = document.createElementNS(SVGNS, "line");
    pole.setAttribute("x1", "0"); pole.setAttribute("y1", "10");
    pole.setAttribute("x2", "0"); pole.setAttribute("y2", "-4");
    pole.setAttribute("stroke", def.color);
    pole.setAttribute("stroke-width", "1.5");
    g.appendChild(pole);
    const board = document.createElementNS(SVGNS, "rect");
    board.setAttribute("x", "-7"); board.setAttribute("y", "-12");
    board.setAttribute("width", "14"); board.setAttribute("height", "9");
    board.setAttribute("fill", def.color);
    board.setAttribute("stroke", strokeColor);
    board.setAttribute("stroke-width", "1");
    g.appendChild(board);

  } else if (def.shape === "hanamichi") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", String(-wPx / 2)); rect.setAttribute("y", String(-hPx / 2));
    rect.setAttribute("width", String(wPx)); rect.setAttribute("height", String(hPx));
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);

  } else if (def.shape === "torii") {
    const path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", "M -12 -10 L 12 -10 M -14 -8 L 14 -8 M -10 -8 L -10 10 M 10 -8 L 10 10 M -8 -4 L 8 -4");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", def.color);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    g.appendChild(path);

  } else if (def.shape === "switcher") {
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-15"); rect.setAttribute("y", "-10");
    rect.setAttribute("width", "30"); rect.setAttribute("height", "20");
    rect.setAttribute("fill", def.color);
    rect.setAttribute("stroke", strokeColor);
    rect.setAttribute("stroke-width", strokeWidth);
    g.appendChild(rect);
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        const btn = document.createElementNS(SVGNS, "rect");
        btn.setAttribute("x", String(col * 7 - 2)); btn.setAttribute("y", String(row * 5 - 2));
        btn.setAttribute("width", "4"); btn.setAttribute("height", "4");
        btn.setAttribute("rx", "1");
        btn.setAttribute("fill", "#ffffff");
        btn.setAttribute("opacity", "0.6");
        g.appendChild(btn);
      }
    }

  } else if (def.shape === "tripod") {
    const head = document.createElementNS(SVGNS, "rect");
    head.setAttribute("x", "-4"); head.setAttribute("y", "-10");
    head.setAttribute("width", "8"); head.setAttribute("height", "6");
    head.setAttribute("fill", def.color);
    head.setAttribute("stroke", strokeColor);
    head.setAttribute("stroke-width", "1");
    g.appendChild(head);
    const legs = document.createElementNS(SVGNS, "path");
    legs.setAttribute("d", "M 0 -4 L 0 4 M 0 4 L -8 12 M 0 4 L 8 12 M 0 4 L 0 12");
    legs.setAttribute("stroke", def.color);
    legs.setAttribute("stroke-width", "1.5");
    g.appendChild(legs);

  } else if (def.shape === "drum_set") {
    // ドラムセット（平面図：上から見た配置）
    // キック (後方中央)
    const kick = document.createElementNS(SVGNS, "circle");
    kick.setAttribute("cx", "0"); kick.setAttribute("cy", "-6");
    kick.setAttribute("r", "10");
    kick.setAttribute("fill", def.color);
    kick.setAttribute("stroke", strokeColor);
    kick.setAttribute("stroke-width", "1");
    g.appendChild(kick);
    // スネア (前方中央)
    const snare = document.createElementNS(SVGNS, "circle");
    snare.setAttribute("cx", "0"); snare.setAttribute("cy", "8");
    snare.setAttribute("r", "5.5");
    snare.setAttribute("fill", "#7a7a9a");
    snare.setAttribute("stroke", strokeColor);
    snare.setAttribute("stroke-width", "1");
    g.appendChild(snare);
    // ハイタム・ロータム (キックの左右上)
    for (const cx of [-8, 8]) {
      const tom = document.createElementNS(SVGNS, "circle");
      tom.setAttribute("cx", String(cx)); tom.setAttribute("cy", "-12");
      tom.setAttribute("r", "4.5");
      tom.setAttribute("fill", "#5a5a7a");
      tom.setAttribute("stroke", strokeColor);
      tom.setAttribute("stroke-width", "0.8");
      g.appendChild(tom);
    }
    // フロアタム (右前)
    const floor = document.createElementNS(SVGNS, "circle");
    floor.setAttribute("cx", "12"); floor.setAttribute("cy", "2");
    floor.setAttribute("r", "5");
    floor.setAttribute("fill", "#5a5a7a");
    floor.setAttribute("stroke", strokeColor);
    floor.setAttribute("stroke-width", "0.8");
    g.appendChild(floor);
    // ハイハット (左前)
    const hh = document.createElementNS(SVGNS, "circle");
    hh.setAttribute("cx", "-12"); hh.setAttribute("cy", "4");
    hh.setAttribute("r", "4");
    hh.setAttribute("fill", "none");
    hh.setAttribute("stroke", "#aaa");
    hh.setAttribute("stroke-width", "1.5");
    g.appendChild(hh);

  } else if (def.shape === "person") {
    // 人（平面図：上から見た人のシルエット）
    // 頭
    const head = document.createElementNS(SVGNS, "circle");
    head.setAttribute("cx", "0"); head.setAttribute("cy", "-4");
    head.setAttribute("r", "5");
    head.setAttribute("fill", def.color);
    head.setAttribute("stroke", strokeColor);
    head.setAttribute("stroke-width", strokeWidth);
    g.appendChild(head);
    // 肩・胴体
    const body = document.createElementNS(SVGNS, "ellipse");
    body.setAttribute("cx", "0"); body.setAttribute("cy", "6");
    body.setAttribute("rx", "7"); body.setAttribute("ry", "5");
    body.setAttribute("fill", "#c06040");
    body.setAttribute("stroke", strokeColor);
    body.setAttribute("stroke-width", "1");
    g.appendChild(body);

  } else {
    // デフォルト（circle）
    const circle = document.createElementNS(SVGNS, "circle");
    circle.setAttribute("r", "10");
    circle.setAttribute("fill", def.color);
    circle.setAttribute("stroke", strokeColor);
    circle.setAttribute("stroke-width", strokeWidth);
    g.appendChild(circle);
  }

  // チャンネル番号表示（chがある場合のみ）
  if (fixture.ch) {
    const label = document.createElementNS(SVGNS, "text");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dy", "3.5");
    label.setAttribute("font-size", "9");
    label.setAttribute("font-weight", "bold");
    label.setAttribute("fill", "#ffffff");
    if (def.color === "#b3b3b3" || def.color === "#8c8c8c" || def.color === "#f3c246") {
      label.setAttribute("fill", "#000000");
    }
    label.textContent = String(fixture.ch);
    g.appendChild(label);
  }

  parent.appendChild(g);
}
