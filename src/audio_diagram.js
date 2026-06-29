import { FIXTURE_LIBRARY, getFullLibrary } from "./fixtures.js";

const SVGNS = "http://www.w3.org/2000/svg";

/**
 * 音響・配信系統図の描画
 * @param {SVGElement} parent 
 * @param {Array} fixtures 
 * @param {Array} connections 
 * @param {string|null} selectedId 
 * @param {string|null} selectedConnId 
 * @param {Function} onSelect 
 */
export function renderAudioDiagram(parent, fixtures, connections, selectedId, selectedConnId, library = FIXTURE_LIBRARY, onSelect) {
  parent.innerHTML = "";

  // 1. 対象機材の抽出（音響・映像カテゴリ）
  const targets = fixtures.filter(f => f.category === "sound" || f.category === "video");
  if (targets.length === 0) {
    // 対象機材がない場合の案内表示
    parent.setAttribute("height", "200");
    const text = document.createElementNS(SVGNS, "text");
    text.setAttribute("x", "400"); text.setAttribute("y", "100");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#64748b");
    text.setAttribute("font-size", "14");
    text.textContent = "音響または映像機材を配置図に配置すると、ここに系統図が表示されます。";
    parent.appendChild(text);
    return;
  }

  // 2. 接続情報の整理（存在する機材から、存在する機材または外部出力先への接続のみ有効にする）
  const activeConns = connections.filter(c => 
    targets.some(t => t.id === c.from) && 
    (targets.some(t => t.id === c.to) || String(c.to).startsWith("ext:"))
  );

  // 外部出力ノード（仮想機材オブジェクト）の作成
  const extTargets = [];
  const addedExts = new Set();
  for (const c of activeConns) {
    if (c.to.startsWith("ext:") && !addedExts.has(c.to)) {
      addedExts.add(c.to);
      const name = c.to.substring(4);
      extTargets.push({
        id: c.to,
        type: name,
        category: "external",
        ch: 0,
        purpose: "外部出力"
      });
    }
  }

  // targets と extTargets を合わせたものを描画ノードの候補とする
  const allNodes = [...targets, ...extTargets];

  // 各ノードの入力・出力数のカウント
  const inDegree = {};
  const outDegree = {};
  for (const t of allNodes) {
    inDegree[t.id] = 0;
    outDegree[t.id] = 0;
  }
  for (const c of activeConns) {
    if (outDegree[c.from] !== undefined) outDegree[c.from]++;
    if (inDegree[c.to] !== undefined) inDegree[c.to]++;
  }

  // 3. 3列自動分類（入力、卓、出力）
  const inputNodes = [];
  const processNodes = [];
  const outputNodes = [];

  for (const f of allNodes) {
    if (f.category === "external") {
      // 外部ノードは必ず「出力（右列）」に分類
      outputNodes.push(f);
      continue;
    }

    const def = library.find(l => l.type === f.type);
    const shape = def ? def.shape : "";

    // 卓・ミキサー系、あるいは中継になっているものは中央列
    if (f.type === "ミキサー" || shape === "console" || (inDegree[f.id] > 0 && outDegree[f.id] > 0)) {
      processNodes.push(f);
    } 
    // 送り出し（入力）系
    else if (outDegree[f.id] > 0 && inDegree[f.id] === 0) {
      inputNodes.push(f);
    } 
    // 受け取り（出力）系
    else if (inDegree[f.id] > 0 && outDegree[f.id] === 0) {
      outputNodes.push(f);
    } 
    // 孤立ノード：機材タイプで推測
    else {
      if (f.type === "マイク" || f.type === "カメラ" || f.type === "カメラ卓") {
        inputNodes.push(f);
      } else if (f.type === "メインSP" || f.type === "モニターSP" || f.type === "スクリーン" || f.type === "プロジェクター") {
        outputNodes.push(f);
      } else {
        // その他はデフォルト入力列
        inputNodes.push(f);
      }
    }
  }

  // 各列内でのソート（Ch順、またはタイプ名順、外部は末尾）
  const sortFunc = (a, b) => {
    if (a.category === "external" && b.category !== "external") return 1;
    if (a.category !== "external" && b.category === "external") return -1;
    const chKey = ch => ch > 0 ? ch : Number.MAX_SAFE_INTEGER;
    if (a.ch !== b.ch) return chKey(a.ch) - chKey(b.ch);
    return a.type.localeCompare(b.type, "ja");
  };
  inputNodes.sort(sortFunc);
  processNodes.sort(sortFunc);
  outputNodes.sort(sortFunc);

  // 4. 座標割り当て
  const xInput = 120;
  const xProcess = 400;
  const xOutput = 680;
  const ySpacing = 60;
  const yStart = 60;

  const nodeCoords = {}; // id -> {x, y}

  const maxLen = Math.max(inputNodes.length, processNodes.length, outputNodes.length);
  const height = Math.max(500, yStart + maxLen * ySpacing + 40);
  parent.setAttribute("height", String(height));
  parent.setAttribute("width", "820");

  // SVGフィルター（影効果）
  const defs = document.createElementNS(SVGNS, "defs");
  const filter = document.createElementNS(SVGNS, "filter");
  filter.setAttribute("id", "audio-node-shadow");
  filter.setAttribute("x", "-20%"); filter.setAttribute("y", "-20%");
  filter.setAttribute("width", "140%"); filter.setAttribute("height", "140%");
  const shadow = document.createElementNS(SVGNS, "feDropShadow");
  shadow.setAttribute("dx", "0"); shadow.setAttribute("dy", "1");
  shadow.setAttribute("stdDeviation", "2");
  shadow.setAttribute("flood-opacity", "0.08");
  filter.appendChild(shadow);
  defs.appendChild(filter);
  parent.appendChild(defs);

  // Y座標の中心化（要素数が少ない列は中央寄せにする）
  const assignY = (nodes, x) => {
    const colHeight = nodes.length * ySpacing;
    const offset = (height - colHeight) / 2;
    nodes.forEach((n, idx) => {
      const y = offset + idx * ySpacing + ySpacing / 2;
      nodeCoords[n.id] = { x, y, fixture: n };
    });
  };

  assignY(inputNodes, xInput);
  assignY(processNodes, xProcess);
  assignY(outputNodes, xOutput);

  // 5. 接続線の描画
  activeConns.forEach(c => {
    const fromPt = nodeCoords[c.from];
    const toPt = nodeCoords[c.to];
    if (!fromPt || !toPt) return;

    const isConnSelected = c.id === selectedConnId;
    const x1 = fromPt.x; const y1 = fromPt.y;
    const x2 = toPt.x; const y2 = toPt.y;
    const dx = x2 - x1;

    // 滑らかな三次ベジェ曲線
    const cx1 = x1 + dx * 0.45; const cy1 = y1;
    const cx2 = x2 - dx * 0.45; const cy2 = y2;
    const dPath = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

    // クリック判定用の太い透明線
    const clickPath = document.createElementNS(SVGNS, "path");
    clickPath.setAttribute("d", dPath);
    clickPath.setAttribute("fill", "none");
    clickPath.setAttribute("stroke", "transparent");
    clickPath.setAttribute("stroke-width", "10");
    clickPath.style.cursor = "pointer";
    clickPath.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelect("connection", c.id);
    });
    parent.appendChild(clickPath);

    // 実際の描画線
    const path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", dPath);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", isConnSelected ? "#2563eb" : "#94a3b8");
    path.setAttribute("stroke-width", isConnSelected ? "3.5" : "1.8");
    path.style.pointerEvents = "none";
    parent.appendChild(path);

    // 接続ラベルの描画
    if (c.label && String(c.label).trim() !== "") {
      const mx = 0.125 * x1 + 0.375 * cx1 + 0.375 * cx2 + 0.125 * x2;
      const my = 0.125 * y1 + 0.375 * cy1 + 0.375 * cy2 + 0.125 * y2;

      const labelGroup = document.createElementNS(SVGNS, "g");
      labelGroup.setAttribute("transform", `translate(${mx}, ${my})`);
      labelGroup.style.cursor = "pointer";
      labelGroup.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelect("connection", c.id);
      });

      const rect = document.createElementNS(SVGNS, "rect");
      rect.setAttribute("fill", "#ffffff");
      rect.setAttribute("stroke", isConnSelected ? "#2563eb" : "#cbd5e1");
      rect.setAttribute("stroke-width", "1");
      rect.setAttribute("rx", "3");
      rect.setAttribute("ry", "3");

      const txt = document.createElementNS(SVGNS, "text");
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("dy", "3.5");
      txt.setAttribute("fill", isConnSelected ? "#2563eb" : "#475569");
      txt.setAttribute("font-size", "8");
      txt.setAttribute("font-weight", "600");
      txt.textContent = c.label;

      labelGroup.appendChild(rect);
      labelGroup.appendChild(txt);
      parent.appendChild(labelGroup);

      setTimeout(() => {
        try {
          const bbox = txt.getBBox();
          rect.setAttribute("x", String(bbox.x - 4));
          rect.setAttribute("y", String(bbox.y - 2));
          rect.setAttribute("width", String(bbox.width + 8));
          rect.setAttribute("height", String(bbox.height + 4));
        } catch (err) {
          rect.setAttribute("x", "-25");
          rect.setAttribute("y", "-7");
          rect.setAttribute("width", "50");
          rect.setAttribute("height", "14");
        }
      }, 0);
    }
  });

  // 6. 各ノードの描画
  Object.keys(nodeCoords).forEach(id => {
    const pt = nodeCoords[id];
    const f = pt.fixture;
    const isSelected = f.id === selectedId;

    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
    g.style.cursor = "pointer";
    g.dataset.id = f.id;

    g.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelect("fixture", f.id);
    });

    // 背景角丸バッジ
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("x", "-65"); rect.setAttribute("y", "-16");
    rect.setAttribute("width", "130"); rect.setAttribute("height", "32");
    rect.setAttribute("rx", "5");

    if (f.category === "external") {
      rect.setAttribute("fill", isSelected ? "#eff6ff" : "#f8fafc");
      rect.setAttribute("stroke", isSelected ? "#2563eb" : "#94a3b8");
      rect.setAttribute("stroke-width", isSelected ? "2.5" : "1.2");
      rect.setAttribute("stroke-dasharray", "4,4");
    } else {
      rect.setAttribute("fill", isSelected ? "#eff6ff" : "#ffffff");
      rect.setAttribute("stroke", isSelected ? "#2563eb" : "#cbd5e1");
      rect.setAttribute("stroke-width", isSelected ? "2.5" : "1");
    }
    rect.setAttribute("filter", "url(#audio-node-shadow)");
    g.appendChild(rect);

    // カテゴリ色ドット
    const circle = document.createElementNS(SVGNS, "circle");
    circle.setAttribute("cx", "-52"); circle.setAttribute("cy", "0");
    circle.setAttribute("r", "5");
    if (f.category === "external") {
      circle.setAttribute("fill", "#94a3b8");
    } else {
      const libItem = library.find(l => l.type === f.type);
      circle.setAttribute("fill", libItem ? libItem.color : "#475569");
    }
    circle.setAttribute("stroke", "#ffffff");
    circle.setAttribute("stroke-width", "1");
    g.appendChild(circle);

    // テキスト表示
    const txt = document.createElementNS(SVGNS, "text");
    txt.setAttribute("x", "-40"); txt.setAttribute("dy", "3.5");
    txt.setAttribute("fill", f.category === "external" ? "#475569" : "#1e293b");
    txt.setAttribute("font-size", "10");
    txt.setAttribute("font-weight", isSelected ? "bold" : "500");
    txt.textContent = f.ch ? `Ch ${f.ch} (${f.type})` : f.type;
    g.appendChild(txt);

    // メモや用途の小さなテキスト表示
    if (f.purpose && String(f.purpose).trim() !== "") {
      const subTxt = document.createElementNS(SVGNS, "text");
      subTxt.setAttribute("x", "-40"); subTxt.setAttribute("y", "23");
      subTxt.setAttribute("fill", "#64748b");
      subTxt.setAttribute("font-size", "7.5");
      subTxt.textContent = f.purpose;
      g.appendChild(subTxt);
    }

    // 入力ポート（左端、全ノードに表示）
    const inPort = document.createElementNS(SVGNS, "circle");
    inPort.setAttribute("class", "audio-port port-in");
    inPort.setAttribute("cx", "-65"); inPort.setAttribute("cy", "0");
    inPort.setAttribute("r", "5.5");
    inPort.setAttribute("fill", "#3b82f6");
    inPort.setAttribute("stroke", "#ffffff");
    inPort.setAttribute("stroke-width", "1.5");
    inPort.dataset.portType = "in";
    inPort.dataset.id = f.id;
    g.appendChild(inPort);

    // 出力ポート（右端、外部出力ノードには非表示）
    if (f.category !== "external") {
      const outPort = document.createElementNS(SVGNS, "circle");
      outPort.setAttribute("class", "audio-port port-out");
      outPort.setAttribute("cx", "65"); outPort.setAttribute("cy", "0");
      outPort.setAttribute("r", "5.5");
      outPort.setAttribute("fill", "#10b981");
      outPort.setAttribute("stroke", "#ffffff");
      outPort.setAttribute("stroke-width", "1.5");
      outPort.dataset.portType = "out";
      outPort.dataset.id = f.id;
      g.appendChild(outPort);
    }

    parent.appendChild(g);
  });
}
