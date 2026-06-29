const SVGNS = "http://www.w3.org/2000/svg";

/**
 * 用紙枠・表題欄・凡例を描画する
 * @param {SVGElement} parent 
 * @param {Object} project 
 * @param {string} viewType "plot" | "dmx" | "audio"
 * @param {number} [fitScale] フィット時のスケール倍率（縮尺計算用）
 * @param {Array} [library] 機材定義ライブラリ
 */
export function renderBorder(parent, project, viewType, fitScale = 1, library = []) {
  const meta = project.meta;
  const paper = meta.paperSize || "A4";
  
  // A4 / A3 用紙サイズのアスペクト比に合わせて外周座標を想定 (1189 x 841)
  const W = 1189;
  const H = 841;
  const margin = 25;

  const borderGroup = document.createElementNS(SVGNS, "g");
  borderGroup.setAttribute("id", "drawing-border-group");
  borderGroup.style.pointerEvents = "none"; // マウスイベントを邪魔しない

  // 1. 外枠（薄いグレーの用紙境界線）
  const outer = document.createElementNS(SVGNS, "rect");
  outer.setAttribute("x", "0");
  outer.setAttribute("y", "0");
  outer.setAttribute("width", String(W));
  outer.setAttribute("height", String(H));
  outer.setAttribute("fill", "none");
  outer.setAttribute("stroke", "#e2e8f0");
  outer.setAttribute("stroke-width", "1");
  borderGroup.appendChild(outer);

  // 2. 内枠（しっかりした黒〜濃いグレーの境界線）
  const inner = document.createElementNS(SVGNS, "rect");
  inner.setAttribute("x", String(margin));
  inner.setAttribute("y", String(margin));
  inner.setAttribute("width", String(W - margin * 2));
  inner.setAttribute("height", String(H - margin * 2));
  inner.setAttribute("fill", "none");
  inner.setAttribute("stroke", "#1e293b");
  inner.setAttribute("stroke-width", "1.5");
  borderGroup.appendChild(inner);

  // 内枠の二重線効果（少し外側にもう一本細い線）
  const inner2 = document.createElementNS(SVGNS, "rect");
  inner2.setAttribute("x", String(margin - 4));
  inner2.setAttribute("y", String(margin - 4));
  inner2.setAttribute("width", String(W - (margin - 4) * 2));
  inner2.setAttribute("height", String(H - (margin - 4) * 2));
  inner2.setAttribute("fill", "none");
  inner2.setAttribute("stroke", "#cbd5e1");
  inner2.setAttribute("stroke-width", "0.5");
  borderGroup.appendChild(inner2);

  // 3. コーナーグリッドマーク（CAD風の短い目盛り線）
  // 縦横に目印を引いてプロっぽい仕上げにする
  const gridDivsX = 8;
  const gridDivsY = 6;
  const innerW = W - margin * 2;
  const innerH = H - margin * 2;

  // X軸の目盛りとアルファベット (A, B, C...)
  for (let i = 1; i < gridDivsX; i++) {
    const x = margin + (innerW / gridDivsX) * i;
    // 上辺
    const lineTop = document.createElementNS(SVGNS, "line");
    lineTop.setAttribute("x1", String(x)); y1: lineTop.setAttribute("y1", String(margin));
    lineTop.setAttribute("x2", String(x)); y2: lineTop.setAttribute("y2", String(margin + 5));
    lineTop.setAttribute("stroke", "#475569");
    lineTop.setAttribute("stroke-width", "0.8");
    borderGroup.appendChild(lineTop);

    // 下辺
    const lineBottom = document.createElementNS(SVGNS, "line");
    lineBottom.setAttribute("x1", String(x)); y1: lineBottom.setAttribute("y1", String(H - margin));
    lineBottom.setAttribute("x2", String(x)); y2: lineBottom.setAttribute("y2", String(H - margin - 5));
    lineBottom.setAttribute("stroke", "#475569");
    lineBottom.setAttribute("stroke-width", "0.8");
    borderGroup.appendChild(lineBottom);
  }

  // Y軸の目盛りと数字 (1, 2, 3...)
  for (let i = 1; i < gridDivsY; i++) {
    const y = margin + (innerH / gridDivsY) * i;
    // 左辺
    const lineLeft = document.createElementNS(SVGNS, "line");
    lineLeft.setAttribute("x1", String(margin)); lineLeft.setAttribute("y1", String(y));
    lineLeft.setAttribute("x2", String(margin + 5)); lineLeft.setAttribute("y2", String(y));
    lineLeft.setAttribute("stroke", "#475569");
    lineLeft.setAttribute("stroke-width", "0.8");
    borderGroup.appendChild(lineLeft);

    // 右辺
    const lineRight = document.createElementNS(SVGNS, "line");
    lineRight.setAttribute("x1", String(W - margin)); lineRight.setAttribute("y1", String(y));
    lineRight.setAttribute("x2", String(W - margin - 5)); lineRight.setAttribute("y2", String(y));
    lineRight.setAttribute("stroke", "#475569");
    lineRight.setAttribute("stroke-width", "0.8");
    borderGroup.appendChild(lineRight);
  }

  // 4. 表題欄 (Title block)
  // 右下に配置。幅 260px, 高さ 90px
  const tbW = 260;
  const tbH = 90;
  const tbX = W - margin - tbW;
  const tbY = H - margin - tbH;

  const tb = document.createElementNS(SVGNS, "g");
  tb.setAttribute("transform", `translate(${tbX}, ${tbY})`);

  // 表題欄背景
  const tbBg = document.createElementNS(SVGNS, "rect");
  tbBg.setAttribute("x", "0");
  tbBg.setAttribute("y", "0");
  tbBg.setAttribute("width", String(tbW));
  tbBg.setAttribute("height", String(tbH));
  tbBg.setAttribute("fill", "#ffffff");
  tbBg.setAttribute("stroke", "#1e293b");
  tbBg.setAttribute("stroke-width", "1.5");
  tb.appendChild(tbBg);

  // 表題欄の枠組み線 (グリッドレイアウト)
  const lines = [
    // 横線
    [0, 25, tbW, 25], // タイトル下
    [0, 47, tbW, 47], // 会場・日時下
    [0, 69, tbW, 69], // 作成者下
    // 縦線分割
    [170, 25, 170, tbH], // 縮尺・用紙ブロックの境界
    [170, 47, tbW, 47],
    [170, 69, tbW, 69]
  ];
  for (const [x1, y1, x2, y2] of lines) {
    const l = document.createElementNS(SVGNS, "line");
    l.setAttribute("x1", String(x1)); l.setAttribute("y1", String(y1));
    l.setAttribute("x2", String(x2)); l.setAttribute("y2", String(y2));
    l.setAttribute("stroke", "#475569");
    l.setAttribute("stroke-width", "0.8");
    tb.appendChild(l);
  }

  // テキスト描画ヘルパー
  const addText = (text, x, y, size, weight = "normal", anchor = "start", fill = "#0f172a") => {
    const t = document.createElementNS(SVGNS, "text");
    t.setAttribute("x", String(x));
    t.setAttribute("y", String(y));
    t.setAttribute("font-size", String(size));
    t.setAttribute("font-weight", weight);
    t.setAttribute("text-anchor", anchor);
    t.setAttribute("fill", fill);
    t.textContent = text;
    tb.appendChild(t);
  };

  // メタデータからテキストを用意
  const drawTitle = meta.name ? String(meta.name).trim() : "未定義のプロジェクト";
  let viewTitle = "仕込み配置図 / LIGHTING & AUDIO PLOT";
  if (viewType === "dmx") {
    viewTitle = "DMX系統図 (照明) / DMX SCHEMATIC";
  } else if (viewType === "audio") {
    viewTitle = "音響・映像系統図 / AUDIO & VIDEO SCHEMATIC";
  }

  // --- 表題欄のテキストデータ流し込み ---
  // 行1: 図面名 (メインタイトル)
  addText(drawTitle, 10, 16, 11, "bold");

  // 行2: 会場名
  addText("VENUE:", 10, 36, 7, "600", "start", "#64748b");
  addText(meta.venue || "---", 48, 36, 9, "500");

  // 行3: 開催日 / 日付
  addText("DATE:", 10, 58, 7, "600", "start", "#64748b");
  addText(meta.eventDate || "---", 48, 58, 9, "500");

  // 行4: 作成者
  addText("AUTHOR:", 10, 80, 7, "600", "start", "#64748b");
  addText(meta.author || "---", 52, 80, 9, "500");

  // 右列: 図面種別
  addText("DRAWING TITLE", 178, 34, 6, "600", "start", "#64748b");
  addText(viewType === "plot" ? "PLOT" : (viewType === "dmx" ? "DMX SCHEMATIC" : "AUDIO SCHEMATIC"), 178, 43, 8, "bold", "start", "#1e3a8a");

  // 縮尺 (SCALE) の計算
  let scaleStr = "Non Scale";
  if (viewType === "plot" && meta.scale && meta.scale.pxPerMm) {
    // 印刷時 (1189px = 297mm) と現実寸法の比率を逆算
    // 1px(SVG) = 297mm/1189px = 0.25mm(印刷物)
    // 最終的な描画物での現実の1mmが、印刷物上で何mmになるかを計算する
    // scaleStr = 1 / (pxPerMm * fitScale * 4.003) 
    const svgPxPerMm = meta.scale.pxPerMm * fitScale;
    if (svgPxPerMm > 0) {
      const scaleDenom = 4.003 / svgPxPerMm;
      // 代表的な建築・設備図面の縮尺に最も近い値に綺麗に丸める
      const commonScales = [10, 20, 30, 50, 100, 150, 200, 300, 500, 1000];
      let bestDenom = Math.round(scaleDenom);
      let minDiff = Infinity;
      for (const cs of commonScales) {
        const diff = Math.abs(scaleDenom - cs);
        if (diff < minDiff && diff < cs * 0.25) { // 25%以内の誤差なら代表的縮尺に丸める
          minDiff = diff;
          bestDenom = cs;
        }
      }
      scaleStr = `1 : ${bestDenom}`;
    }
  }

  // 右下ブロック: 縮尺 & 用紙
  addText("SCALE", 178, 56, 6, "600", "start", "#64748b");
  addText(scaleStr, 178, 65, 8, "600");

  addText("SIZE", 178, 77, 6, "600", "start", "#64748b");
  addText(`${paper} (L)`, 178, 86, 8, "600");

  borderGroup.appendChild(tb);

  // 5. 凡例 (Legend)
  // 左下に配置。幅 180px。高さは表示するアイテム数に応じて可変にする。
  // 表示対象のユニークな機材タイプ (type) を抽出
  let filteredFixtures = project.fixtures;
  if (viewType === "dmx") {
    // DMX系統図に表示される機材のみ
    filteredFixtures = project.fixtures.filter(f => f.category === "lighting" || f.dmx || f.universe);
  } else if (viewType === "audio") {
    // 音響映像系統図に表示される機材のみ
    filteredFixtures = project.fixtures.filter(f => f.category === "sound" || f.category === "video");
  }

  const uniqueTypes = [];
  const addedTypes = new Set();
  for (const f of filteredFixtures) {
    if (!addedTypes.has(f.type)) {
      addedTypes.add(f.type);
      uniqueTypes.push({ type: f.type, category: f.category });
    }
  }

  if (uniqueTypes.length > 0) {
    // 凡例のレイアウト
    const legW = 180;
    const itemH = 15;
    const legH = 20 + uniqueTypes.length * itemH;
    const legX = margin;
    const legY = H - margin - legH - 5; // 表題欄と被らないよう配置

    const leg = document.createElementNS(SVGNS, "g");
    leg.setAttribute("transform", `translate(${legX}, ${legY})`);

    // 凡例背景
    const legBg = document.createElementNS(SVGNS, "rect");
    legBg.setAttribute("x", "0");
    legBg.setAttribute("y", "0");
    legBg.setAttribute("width", String(legW));
    legBg.setAttribute("height", String(legH));
    legBg.setAttribute("fill", "#ffffff");
    legBg.setAttribute("stroke", "#475569");
    legBg.setAttribute("stroke-width", "1");
    leg.appendChild(legBg);

    // 凡例タイトル
    const legTitle = document.createElementNS(SVGNS, "text");
    legTitle.setAttribute("x", "8");
    legTitle.setAttribute("y", "13");
    legTitle.setAttribute("font-size", "7.5");
    legTitle.setAttribute("font-weight", "bold");
    legTitle.setAttribute("fill", "#475569");
    legTitle.textContent = "LEGEND / 凡例";
    leg.appendChild(legTitle);

    // 各凡例アイテム
    uniqueTypes.forEach((item, idx) => {
      const y = 26 + idx * itemH;
      
      // カテゴリカラーの丸印
      const dot = document.createElementNS(SVGNS, "circle");
      dot.setAttribute("cx", "14");
      dot.setAttribute("cy", String(y - 3.5));
      dot.setAttribute("r", "4");

      // ライブラリからカラーを引く
      const libItem = library.find(l => l.type === item.type);
      dot.setAttribute("fill", libItem ? libItem.color : "#475569");
      dot.setAttribute("stroke", "#ffffff");
      dot.setAttribute("stroke-width", "0.8");
      leg.appendChild(dot);

      // テキスト
      const txt = document.createElementNS(SVGNS, "text");
      txt.setAttribute("x", "24");
      txt.setAttribute("y", String(y));
      txt.setAttribute("font-size", "8");
      txt.setAttribute("font-weight", "500");
      txt.setAttribute("fill", "#334155");
      txt.textContent = item.type;
      leg.appendChild(txt);
    });

    borderGroup.appendChild(leg);
  }

  parent.appendChild(borderGroup);
}
