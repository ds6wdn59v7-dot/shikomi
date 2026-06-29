import { createProject, createFixture, serialize, deserialize } from "./model.js";
import { loadImageFile, loadPdfFirstPage } from "./background.js";
import { pxPerMmFromCalibration } from "./scale.js";
import { FIXTURE_LIBRARY, getFullLibrary, renderFixture } from "./fixtures.js";
import { renderProperties, renderConnectionProperties, renderProjectProperties } from "./properties.js";
import { buildPatchRows, powerSummary } from "./patch.js";
import { downloadJson, readJsonFile, autosave, loadAutosave } from "./storage.js";
import { loadCustomLibrary, openCustomLibraryModal } from "./custom-library.js";
import { openFixturesListModal } from "./fixtures-list.js";
import { renderDmxDiagram } from "./dmx.js";
import { renderAudioDiagram } from "./audio_diagram.js";
import { renderBorder } from "./border.js";
import { renderElevation } from "./elevation.js";

// アプリのグローバル状態
const state = {
  project: createProject(),
  selectedId: null,
  selectedConnectionId: null,
  activeCategory: "stage",
  visibleLayers: ["stage", "sound", "lighting", "video"],
  lockedLayers: [],
  patchSortBy: "ch",
  patchSortDesc: false,
  currentView: "plot", // ビュー管理 ("plot" | "dmx" | "audio")
  plotLayout: "split", // 配置図レイアウト ("top" | "front" | "side" | "split")
  customLibrary: [], // カスタム機材定義（localStorageから読込）
  dragStartId: null,
  dragStartCoords: null,
  showBeam: false,
  clipboard: null
};

const svg = document.getElementById("canvas");
const svgFront = document.getElementById("canvas-front");
const svgSide = document.getElementById("canvas-side");
const SVGNS = "http://www.w3.org/2000/svg";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Undo履歴管理
const undoStack = [];
const MAX_UNDO_LIMIT = 50;
const UNDO_THROTTLE_MS = 1200; // 1.2秒以内の連続変更は同一変更セッションとしてマージ
let lastSaveTime = 0;

export function saveHistory() {
  const now = Date.now();
  if (now - lastSaveTime < UNDO_THROTTLE_MS && undoStack.length > 0) {
    // 連続的な入力変更中は、新しくスタックを積まず、変更前の状態を維持する
    return;
  }
  if (undoStack.length >= MAX_UNDO_LIMIT) {
    undoStack.shift();
  }
  undoStack.push(serialize(state.project));
  lastSaveTime = now;
}

export function undo() {
  if (undoStack.length === 0) return;
  const previousStateStr = undoStack.pop();
  try {
    state.project = deserialize(previousStateStr);
    if (state.selectedId) {
      const exists = state.project.fixtures.some(f => f.id === state.selectedId);
      if (!exists) state.selectedId = null;
    }
    lastSaveTime = 0; // 次回のアクションで確実に保存されるようにクリア
    render();
  } catch (err) {
    console.error("Undo failed:", err);
  }
}

export function getState() { return state; }

// カテゴリラベル（日本語表示用）
function getCategoryLabel(category) {
  switch (category) {
    case "stage": return "舞台";
    case "sound": return "音響";
    case "lighting": return "照明";
    case "video": return "映像";
    default: return "その他";
  }
}

// 左サイドバーの機材パレット描画
function renderPalette() {
  const el = document.getElementById("palette-list");
  el.innerHTML = "";

  const builtIn = FIXTURE_LIBRARY.filter(def => def.category === state.activeCategory);
  const custom = (state.customLibrary || []).filter(def => def.category === state.activeCategory);

  if (builtIn.length === 0 && custom.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText = "color:#888; font-size:12px; text-align:center;";
    empty.textContent = "機材がありません";
    el.appendChild(empty);
    return;
  }

  function addPaletteButton(def) {
    const b = document.createElement("button");
    b.className = "palette-item-btn";
    b.draggable = true;
    const dot = document.createElement("span");
    dot.className = "color-dot";
    dot.style.backgroundColor = def.color;
    b.appendChild(dot);
    const label = document.createElement("span");
    label.textContent = def.label;
    b.appendChild(label);
    b.addEventListener("dragstart", e => {
      e.dataTransfer.setData("type", def.type);
      e.dataTransfer.setData("category", def.category);
    });
    el.appendChild(b);
  }

  for (const def of builtIn) {
    addPaletteButton(def);
  }

  if (custom.length > 0) {
    const sep = document.createElement("hr");
    sep.className = "palette-separator";
    el.appendChild(sep);
    const sepLabel = document.createElement("div");
    sepLabel.className = "palette-separator-label";
    sepLabel.textContent = "カスタム";
    el.appendChild(sepLabel);
    for (const def of custom) {
      addPaletteButton(def);
    }
  }
}

function getCanvasTransform() {
  const meta = state.project.meta;
  if (state.currentView === "plot" && meta.showBorder) {
    const bg = state.project.background;
    const pW = meta.plotWidth || 10000;
    const pH = meta.plotHeight || 8000;
    const vw = pW + 2500;
    const vh = pH + 750;
    const W_orig = (bg.image && bg.width) ? bg.width : vw;
    const H_orig = (bg.image && bg.height) ? bg.height : vh;
    const W = 1189;
    const H = 841;
    const margin = 25;
    const max_w = W - margin * 2 - 10;
    const max_h = H - margin * 2 - 100;
    const s = Math.min(max_w / W_orig, max_h / H_orig);
    
    // 背景画像がない場合、コンテンツのX座標は -vw/2 から始まるため、
    // 平行移動 dx はその分を補正する必要がある。
    const vbX = bg.image ? 0 : -W_orig / 2;
    const dx = margin + (max_w - W_orig * s) / 2 - vbX * s;
    const dy = margin + (max_h - H_orig * s) / 2;
    return { s, dx, dy };
  }
  return { s: 1, dx: 0, dy: 0 };
}

function getElevationTransform(viewType) {
  const showBorder = state.plotLayout === viewType && !!state.project.meta.showBorder;
  if (showBorder) {
    const W_orig = 1000, H_orig = 700;
    const W = 1189, H = 841;
    const margin = 25;
    const max_w = W - margin * 2 - 10;
    const max_h = H - margin * 2 - 100;
    const s = Math.min(max_w / W_orig, max_h / H_orig);
    const dx = margin + (max_w - W_orig * s) / 2;
    const dy = margin + (max_h - H_orig * s) / 2;
    return { s, dx, dy };
  }
  return { s: 1, dx: 0, dy: 0 };
}

function getContentBounds() {
  const bg = state.project.background;
  if (bg.image && bg.width && bg.height) {
    return { minX: 0, minY: 0, maxX: bg.width, maxY: bg.height };
  }
  const meta = state.project.meta;
  const pW = meta.plotWidth || 10000;
  const pH = meta.plotHeight || 8000;
  const vw = pW + 2500;
  const vh = pH + 750;
  return { minX: -vw / 2, minY: 0, maxX: vw / 2, maxY: vh };
}

function clampToBounds(x, y) {
  const b = getContentBounds();
  return {
    x: Math.max(b.minX, Math.min(b.maxX, x)),
    y: Math.max(b.minY, Math.min(b.maxY, y))
  };
}

function clampFixturePosition(fixture) {
  const b = getContentBounds();
  const lib = getFullLibrary(state.customLibrary || []);
  const def = lib.find(d => d.type === fixture.type) || lib.find(d => d.category === "lighting");

  let wMm = fixture.widthMm > 0 ? fixture.widthMm : (def?.defaultWidth || 0);
  let dMm = fixture.depthMm > 0 ? fixture.depthMm : (def?.defaultDepth || 0);

  const isStageArt = fixture.category === "stage" || def?.category === "stage" ||
    ["truss", "baton", "curtain", "backdrop", "riser", "hanamichi"].includes(def?.shape || "");

  if (isStageArt) {
    const pitchRad = (fixture.pitch || 0) * Math.PI / 180;
    const rollRad = (fixture.roll || 0) * Math.PI / 180;
    const Wx_prime = Math.sin(pitchRad) * Math.sin(rollRad);
    const Wy_prime = Math.cos(rollRad);
    const Ltop_prime = Math.sqrt(Wx_prime * Wx_prime + Wy_prime * Wy_prime);
    wMm = wMm * Ltop_prime + dMm * (1 - Ltop_prime);
  }

  const rotRad = (fixture.rotation || 0) * Math.PI / 180;
  const xHalf = (wMm * Math.abs(Math.cos(rotRad)) + dMm * Math.abs(Math.sin(rotRad))) / 2;
  const yHalf = (wMm * Math.abs(Math.sin(rotRad)) + dMm * Math.abs(Math.cos(rotRad))) / 2;

  fixture.x = Math.max(b.minX + xHalf, Math.min(b.maxX - xHalf, fixture.x));
  fixture.y = Math.max(b.minY + yHalf, Math.min(b.maxY - yHalf, fixture.y));
  fixture.z = Math.max(0, fixture.z);
}

function getSvgVbParams(svgElement, rectWidth) {
  const vbAttr = svgElement.getAttribute("viewBox");
  if (!vbAttr) return { scale: 1, x: 0, y: 0 };
  const parts = vbAttr.split(/\s+/).map(Number);
  if (parts.length === 4 && !isNaN(parts[2]) && parts[2] > 0) {
    return {
      scale: parts[2] / rectWidth,
      x: parts[0],
      y: parts[1]
    };
  }
  return { scale: 1, x: 0, y: 0 };
}

function screenToLogical(screenX, screenY) {
  const { s, dx, dy } = getCanvasTransform();
  const rect = svg.getBoundingClientRect();
  const vb = getSvgVbParams(svg, rect.width);
  return {
    x: (screenX * vb.scale + vb.x - dx) / s,
    y: (screenY * vb.scale + vb.y - dy) / s
  };
}

// 平面図ビームオーバーレイ描画
function renderBeamOverlay(container, fixtures, library) {
  for (const f of fixtures) {
    const beamAngle = f.beamAngle || 0;
    if (beamAngle <= 0) continue;
    const libItem = library.find(l => l.type === f.type || l.originalType === f.type);
    const cat = f.category || libItem?.category || "";
    if (cat !== "lighting" && cat !== "sound") continue;

    const z = f.z || 0;
    const yawRad = (f.rotation || 0) * Math.PI / 180;
    const tiltRad = (f.pitch || 0) * Math.PI / 180;
    const rollRad = (f.roll || 0) * Math.PI / 180;
    const halfBeam = (beamAngle / 2) * Math.PI / 180;
    const color = libItem?.color || "#e6a817";

    // 3D方向ベクトルの計算 (真下 (0, 0, -1) に対する回転)
    const vx = -Math.cos(yawRad) * Math.sin(rollRad) - Math.sin(yawRad) * Math.sin(tiltRad) * Math.cos(rollRad);
    const vy = -Math.sin(yawRad) * Math.sin(rollRad) + Math.cos(yawRad) * Math.sin(tiltRad) * Math.cos(rollRad);
    const vz = -Math.cos(tiltRad) * Math.cos(rollRad);

    if (Math.abs(vz) > 0.999) {
      // ほぼ真下照射: 足元に円を描画
      const r = z * Math.tan(halfBeam);
      if (r < 10) continue;
      const circle = document.createElementNS(SVGNS, "circle");
      circle.setAttribute("cx", String(f.x));
      circle.setAttribute("cy", String(f.y));
      circle.setAttribute("r", String(r));
      circle.setAttribute("fill", color);
      circle.setAttribute("fill-opacity", "0.12");
      circle.setAttribute("stroke", color);
      circle.setAttribute("stroke-opacity", "0.3");
      circle.setAttribute("stroke-width", "1");
      circle.style.pointerEvents = "none";
      container.appendChild(circle);
    } else {
      // チルトあり: 照射方向にコーンを描画
      let hitX, hitY;
      let beamPathLen;

      if (vz < -0.05) {
        // 下向きのビーム: 床 (Z=0) との交点を求める
        const t = -z / vz;
        hitX = f.x + vx * t;
        hitY = f.y + vy * t;
        beamPathLen = t;
      } else {
        // 水平または上向きのビーム: 床に当たらないため、仮の長さ (3000mm) で上空に伸ばす
        const beamLen = 3000;
        hitX = f.x + vx * beamLen;
        hitY = f.y + vy * beamLen;
        beamPathLen = beamLen;
      }

      // 到達点での広がり半径
      const spreadAtFloor = beamPathLen * Math.tan(halfBeam);

      // 平面図上の進行方向ベクトル (vx, vy) を正規化
      const lenXY = Math.sqrt(vx * vx + vy * vy);
      const dx = vx / lenXY;
      const dy = vy / lenXY;

      // 直交ベクトル
      const nx = -dy;
      const ny = dx;

      // コーンの3点: 機材位置、左端、右端
      const p1x = f.x, p1y = f.y;
      const p2x = hitX + nx * spreadAtFloor;
      const p2y = hitY + ny * spreadAtFloor;
      const p3x = hitX - nx * spreadAtFloor;
      const p3y = hitY - ny * spreadAtFloor;

      const polygon = document.createElementNS(SVGNS, "polygon");
      polygon.setAttribute("points", `${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`);
      polygon.setAttribute("fill", color);
      polygon.setAttribute("fill-opacity", "0.10");
      polygon.setAttribute("stroke", color);
      polygon.setAttribute("stroke-opacity", "0.25");
      polygon.setAttribute("stroke-width", "1");
      polygon.setAttribute("stroke-dasharray", "8,4");
      polygon.style.pointerEvents = "none";
      container.appendChild(polygon);

      // 照射先の楕円フットプリント（下向き照射かつ床に当たる場合のみ描画）
      if (vz < -0.05) {
        const ellipse = document.createElementNS(SVGNS, "ellipse");
        ellipse.setAttribute("cx", String(hitX));
        ellipse.setAttribute("cy", String(hitY));
        ellipse.setAttribute("rx", String(spreadAtFloor));
        ellipse.setAttribute("ry", String(spreadAtFloor * 0.6));
        ellipse.setAttribute("transform", `rotate(${f.rotation || 0}, ${hitX}, ${hitY})`);
        ellipse.setAttribute("fill", color);
        ellipse.setAttribute("fill-opacity", "0.08");
        ellipse.setAttribute("stroke", color);
        ellipse.setAttribute("stroke-opacity", "0.2");
        ellipse.setAttribute("stroke-width", "0.8");
        ellipse.style.pointerEvents = "none";
        container.appendChild(ellipse);
      }
    }
  }
}

// 画面全体の再描画
export function render(opts = {}) {
  const bg = state.project.background;
  const meta = state.project.meta;
  const pW = meta.plotWidth || 10000;
  const pH = meta.plotHeight || 8000;
  let vw = pW + 2500;
  let vh = pH + 750;
  if (bg.image && bg.width && bg.height) { vw = bg.width; vh = bg.height; }

  if (state.currentView === "dmx") {
    // --- DMX系統図ビューの描画 ---
    // 表示中のレイヤの機材のみで系統図を生成
    const filtered = state.project.fixtures.filter(f => state.visibleLayers.includes(f.category || "lighting"));
    renderDmxDiagram(svg, filtered, state.selectedId, getFullLibrary(state.customLibrary || []));

    // 図面枠・自動フィットの適用
    if (state.project.meta.showBorder) {
      const H_orig = Number(svg.getAttribute("height")) || 600;
      const W_orig = 820;
      const W = 1189;
      const H = 841;
      const margin = 25;
      const max_w = W - margin * 2 - 10;
      const max_h = H - margin * 2 - 100;
      const s = Math.min(max_w / W_orig, max_h / H_orig);
      const dx = margin + (max_w - W_orig * s) / 2;
      const dy = margin + (max_h - H_orig * s) / 2;

      const children = Array.from(svg.childNodes);
      const wrapperG = document.createElementNS(SVGNS, "g");
      wrapperG.setAttribute("id", "diagram-content");
      wrapperG.setAttribute("transform", `translate(${dx}, ${dy}) scale(${s})`);
      for (const child of children) {
        wrapperG.appendChild(child);
      }
      svg.appendChild(wrapperG);

      svg.setAttribute("width", "1189");
      svg.setAttribute("height", "841");
      svg.setAttribute("viewBox", "0 0 1189 841");
      renderBorder(svg, state.project, "dmx", s, getFullLibrary(state.customLibrary || []));
    } else {
      // 図面枠なしでも viewBox を設定し、SVG全体をコンテナ幅に縮小フィットさせる。
      // viewBox が無いと CSS の max-width:100% は要素のボックスだけを縮め、
      // 内部座標は 1:1 ピクセルのまま描画されるため、出力列など右側のノードが
      // キャンバス外（右パネルの裏）にはみ出してクリップされてしまう。
      const vbW = svg.getAttribute("width") || "820";
      const vbH = svg.getAttribute("height") || "500";
      svg.setAttribute("viewBox", `0 0 ${vbW} ${vbH}`);
      svg.style.aspectRatio = `${vbW} / ${vbH}`;
    }

    // 左サイドバーのカテゴリタブと機材リストを非表示（レイヤ切り替えのみ残す）
    document.querySelector(".tab-section").style.display = "none";
    document.getElementById("palette-list").style.display = "none";
  } else if (state.currentView === "audio") {
    // --- 音響・配信系統図ビューの描画 ---
    // 表示中のレイヤの機材のみで系統図を生成
    const filtered = state.project.fixtures.filter(f => state.visibleLayers.includes(f.category || "sound"));
    renderAudioDiagram(svg, filtered, state.project.connections, state.selectedId, state.selectedConnectionId, getFullLibrary(state.customLibrary || []), (type, id) => {
      if (type === "fixture") {
        state.selectedId = id;
        state.selectedConnectionId = null;
      } else if (type === "connection") {
        state.selectedId = null;
        state.selectedConnectionId = id;
      }
      render();
    });

    // 図面枠・自動フィットの適用
    if (state.project.meta.showBorder) {
      const H_orig = Number(svg.getAttribute("height")) || 600;
      const W_orig = 820;
      const W = 1189;
      const H = 841;
      const margin = 25;
      const max_w = W - margin * 2 - 10;
      const max_h = H - margin * 2 - 100;
      const s = Math.min(max_w / W_orig, max_h / H_orig);
      const dx = margin + (max_w - W_orig * s) / 2;
      const dy = margin + (max_h - H_orig * s) / 2;

      const children = Array.from(svg.childNodes);
      const wrapperG = document.createElementNS(SVGNS, "g");
      wrapperG.setAttribute("id", "diagram-content");
      wrapperG.setAttribute("transform", `translate(${dx}, ${dy}) scale(${s})`);
      for (const child of children) {
        wrapperG.appendChild(child);
      }
      svg.appendChild(wrapperG);

      svg.setAttribute("width", "1189");
      svg.setAttribute("height", "841");
      svg.setAttribute("viewBox", "0 0 1189 841");
      renderBorder(svg, state.project, "audio", s, getFullLibrary(state.customLibrary || []));
    } else {
      // 図面枠なしでも viewBox を設定し、SVG全体をコンテナ幅に縮小フィットさせる。
      // viewBox が無いと CSS の max-width:100% は要素のボックスだけを縮め、
      // 内部座標は 1:1 ピクセルのまま描画されるため、出力列など右側のノードが
      // キャンバス外（右パネルの裏）にはみ出してクリップされてしまう。
      const vbW = svg.getAttribute("width") || "820";
      const vbH = svg.getAttribute("height") || "500";
      svg.setAttribute("viewBox", `0 0 ${vbW} ${vbH}`);
      svg.style.aspectRatio = `${vbW} / ${vbH}`;
    }

    // 左サイドバーのカテゴリタブと機材リストを非表示
    document.querySelector(".tab-section").style.display = "none";
    document.getElementById("palette-list").style.display = "none";
  } else {
    // --- 通常の配置図ビューの描画 ---
    if (!opts.dragView || opts.dragView === "plot") svg.innerHTML = "";
    if (!opts.dragView || opts.dragView === "front") svgFront.innerHTML = "";
    if (!opts.dragView || opts.dragView === "side") svgSide.innerHTML = "";

    const library = getFullLibrary(state.customLibrary || []);
    const filteredPlot = state.project.fixtures.filter(f => state.visibleLayers.includes(f.category || "lighting"));

    // 1. 平面図 (Top) の描画
    if ((state.plotLayout === "top" || state.plotLayout === "split") && (!opts.dragView || opts.dragView === "plot")) {
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      // 3面分割表示のときは図面枠を一時的に非表示にする
      const showBorder = state.plotLayout === "top" && !!state.project.meta.showBorder;
      let container = svg;
      let s = 1, dx = 0, dy = 0;
      const vbY = bg.image ? 0 : -500;

      if (showBorder) {
        svg.setAttribute("width", "1189");
        svg.setAttribute("height", "841");
        svg.setAttribute("viewBox", "0 0 1189 841");
        svg.style.aspectRatio = "1189 / 841";
        
        const contentG = document.createElementNS(SVGNS, "g");
        contentG.setAttribute("id", "plot-content");
        const trans = getCanvasTransform();
        s = trans.s; dx = trans.dx; dy = trans.dy;
        contentG.setAttribute("transform", `translate(${dx}, ${dy}) scale(${s})`);
        svg.appendChild(contentG);
        container = contentG;
      } else {
        svg.setAttribute("width", String(vw));
        svg.setAttribute("height", String(vh));
        const vbX = bg.image ? 0 : -vw / 2;
        svg.setAttribute("viewBox", `${vbX} ${vbY} ${vw} ${vh}`);
        svg.style.aspectRatio = `${vw} / ${vh}`;
      }

      // 1-1. 基準線グリッド（背景画像がない場合のみ）
      if (!bg.image) {
        const gridG = document.createElementNS(SVGNS, "g");
        gridG.setAttribute("class", "plan-grid");
        
        const halfW = pW / 2;
        const mMin = -Math.floor(halfW / 1000);
        const mMax = Math.ceil(halfW / 1000);
        for (let m = mMin; m <= mMax; m++) {
          const x = m * 1000;
          const line = document.createElementNS(SVGNS, "line");
          line.setAttribute("x1", String(x)); line.setAttribute("y1", "0");
          line.setAttribute("x2", String(x)); line.setAttribute("y2", String(vh));
          line.setAttribute("class", m === 0 ? "plan-center-line" : "plan-grid-line");
          gridG.appendChild(line);
          const label = document.createElementNS(SVGNS, "text");
          label.setAttribute("x", String(x)); label.setAttribute("y", String(vbY + vh - 150));
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("class", "plan-grid-text");
          label.textContent = `${m}m`;
          gridG.appendChild(label);
        }
        const yMax = Math.ceil(pH / 1000);
        for (let m = 0; m <= yMax; m++) {
          const y = m * 1000;
          const line = document.createElementNS(SVGNS, "line");
          line.setAttribute("x1", String(-vw / 2)); line.setAttribute("y1", String(y));
          line.setAttribute("x2", String(vw / 2)); line.setAttribute("y2", String(y));
          line.setAttribute("class", m === 0 ? "plan-wall-line" : "plan-grid-line");
          gridG.appendChild(line);
          const label = document.createElementNS(SVGNS, "text");
          label.setAttribute("x", String(-vw / 2 + 200)); label.setAttribute("y", String(y + 250));
          label.setAttribute("text-anchor", "end");
          label.setAttribute("class", "plan-grid-text");
          label.textContent = `${m}m`;
          gridG.appendChild(label);
        }
        container.appendChild(gridG);
      }

      // 1-2. 背景画像の描画
      if (bg.image) {
        const img = document.createElementNS(SVGNS, "image");
        img.setAttribute("href", bg.image);
        img.setAttribute("x", "0"); img.setAttribute("y", "0");
        if (bg.width) img.setAttribute("width", String(bg.width));
        if (bg.height) img.setAttribute("height", String(bg.height));
        img.setAttribute("opacity", String(bg.opacity));
        container.appendChild(img);

        const wl = document.createElementNS(SVGNS, "line");
        wl.setAttribute("x1", "0"); wl.setAttribute("y1", "0");
        wl.setAttribute("x2", String(bg.width || vw)); wl.setAttribute("y2", "0");
        wl.setAttribute("class", "plan-wall-line");
        wl.style.pointerEvents = "none";
        container.appendChild(wl);
      }

      // 1-3. 機材の描画
      const sortedPlot = [...filteredPlot].sort((a, b) => (a.z || 0) - (b.z || 0));
      const iconScale = vw / 1000;
      for (const f of sortedPlot) {
        renderFixture(container, f, f.id === state.selectedId, state.project.meta.scale.pxPerMm, library, iconScale);
      }

      // 1-4. ビーム表示
      if (state.showBeam) {
        renderBeamOverlay(container, sortedPlot, library);
      }

      // 1-5. 接続線の描画
      for (const conn of state.project.connections) {
        const f1 = state.project.fixtures.find(f => f.id === conn.from);
        const f2 = state.project.fixtures.find(f => f.id === conn.to);
        if (f1 && f2 && state.visibleLayers.includes(f1.category || "lighting") && state.visibleLayers.includes(f2.category || "lighting")) {
          drawConnectionLine(container, f1, f2, conn.id === state.selectedConnectionId, conn.type || "power");
        }
      }

      if (showBorder) {
        renderBorder(svg, state.project, "plot", s, library);
      }
    }

    const handleElevationSelect = (type, id) => {
      if (type === "fixture") {
        state.selectedId = id;
        state.selectedConnectionId = null;
      }
      render();
    };

    // 2. 正面図 (Front) の描画
    if ((state.plotLayout === "front" || state.plotLayout === "split") && (!opts.dragView || opts.dragView === "front")) {
      svgFront.setAttribute("preserveAspectRatio", "xMidYMid meet");
      const showBorder = state.plotLayout === "front" && !!state.project.meta.showBorder;
      let container = svgFront;
      const bgFront = state.project.backgroundFront?.image || null;

      if (showBorder) {
        svgFront.setAttribute("width", "1189");
        svgFront.setAttribute("height", "841");
        svgFront.setAttribute("viewBox", "0 0 1189 841");
        svgFront.style.aspectRatio = "1189 / 841";

        const W_orig = 1000, H_orig = 700;
        const W = 1189, H = 841;
        const margin = 25;
        const max_w = W - margin * 2 - 10;
        const max_h = H - margin * 2 - 100;
        const s = Math.min(max_w / W_orig, max_h / H_orig);
        const dx = margin + (max_w - W_orig * s) / 2;
        const dy = margin + (max_h - H_orig * s) / 2;

        const contentG = document.createElementNS(SVGNS, "g");
        contentG.setAttribute("transform", `translate(${dx}, ${dy}) scale(${s})`);
        svgFront.appendChild(contentG);
        container = contentG;

        renderElevation(container, filteredPlot, state.selectedId, "front", handleElevationSelect, library, bgFront, state.showBeam);
        renderBorder(svgFront, state.project, "plot", s, library);
      } else {
        svgFront.setAttribute("width", "1000");
        svgFront.setAttribute("height", "700");
        svgFront.setAttribute("viewBox", "0 0 1000 700");
        svgFront.style.aspectRatio = "1000 / 700";
        renderElevation(svgFront, filteredPlot, state.selectedId, "front", handleElevationSelect, library, bgFront, state.showBeam);
      }
    }

    // 3. 右側面図 (Side) の描画
    if ((state.plotLayout === "side" || state.plotLayout === "split") && (!opts.dragView || opts.dragView === "side")) {
      svgSide.setAttribute("preserveAspectRatio", "xMidYMid meet");
      const showBorder = state.plotLayout === "side" && !!state.project.meta.showBorder;
      let container = svgSide;
      const bgSide = state.project.backgroundSide?.image || null;

      if (showBorder) {
        svgSide.setAttribute("width", "1189");
        svgSide.setAttribute("height", "841");
        svgSide.setAttribute("viewBox", "0 0 1189 841");
        svgSide.style.aspectRatio = "1189 / 841";

        const W_orig = 1000, H_orig = 700;
        const W = 1189, H = 841;
        const margin = 25;
        const max_w = W - margin * 2 - 10;
        const max_h = H - margin * 2 - 100;
        const s = Math.min(max_w / W_orig, max_h / H_orig);
        const dx = margin + (max_w - W_orig * s) / 2;
        const dy = margin + (max_h - H_orig * s) / 2;

        const contentG = document.createElementNS(SVGNS, "g");
        contentG.setAttribute("transform", `translate(${dx}, ${dy}) scale(${s})`);
        svgSide.appendChild(contentG);
        container = contentG;

        renderElevation(container, filteredPlot, state.selectedId, "side", handleElevationSelect, library, bgSide, state.showBeam);
        renderBorder(svgSide, state.project, "plot", s, library);
      } else {
        svgSide.setAttribute("width", "1000");
        svgSide.setAttribute("height", "700");
        svgSide.setAttribute("viewBox", "0 0 1000 700");
        svgSide.style.aspectRatio = "1000 / 700";
        renderElevation(svgSide, filteredPlot, state.selectedId, "side", handleElevationSelect, library, bgSide, state.showBeam);
      }
    }

    // 左サイドバーのカテゴリタブと機材リストを表示
    document.querySelector(".tab-section").style.display = "flex";
    document.getElementById("palette-list").style.display = "block";
  }

  // 3. 属性パネルの描画（共通。ドラッグ中はスキップ）
  if (!opts.skipProperties && !opts.dragView) {
    if (state.selectedConnectionId) {
      const selConn = state.project.connections.find(c => c.id === state.selectedConnectionId) || null;
      renderConnectionProperties(document.getElementById("properties"), selConn, state.project.fixtures, (action, data) => {
        handleConnectionChange(action, data);
      });
    } else {
      const sel = state.project.fixtures.find(f => f.id === state.selectedId) || null;
      if (sel) {
        renderProperties(document.getElementById("properties"), sel, (key, value) => {
          saveHistory();
          sel[key] = value;
          clampFixturePosition(sel);
          render({ skipProperties: true });
        }, state.project.fixtures, state.project.connections, (action, data) => {
          handleConnectionChange(action, data);
        });
      } else {
        renderProjectProperties(document.getElementById("properties"), state.project, (key, value) => {
          saveHistory();
          // 図面サイズ(幅/奥行き)は平面図にのみ影響。属性パネルを作り直さず(=入力欄が消えずスピナーが効く)、
          // 他ビュー・パッチ表もスキップして軽量化。それ以外の項目は属性パネルを保持しつつ通常描画。
          if (key === "plotWidth" || key === "plotHeight") {
            render({ dragView: "plot" });
          } else {
            render({ skipProperties: true });
          }
          autosave(serialize(state.project));
        });
      }
    }
  }

  // 4. パッチ表と電源集計の描画（共通。ドラッグ中はスキップ）
  if (!opts.dragView) {
  const patchEl = document.getElementById("patch");
  const rows = buildPatchRows(state.project.fixtures, state.patchSortBy, state.patchSortDesc);
  const sum = powerSummary(state.project.fixtures);

  const getSortClass = (field) => {
    if (state.patchSortBy !== field) return "";
    return state.patchSortDesc ? "class='sort-desc'" : "class='sort-asc'";
  };

  const head = `<tr>
    <th data-sort="category" ${getSortClass("category")}>カテゴリ</th>
    <th data-sort="ch" ${getSortClass("ch")}>灯体No.</th>
    <th data-sort="type" ${getSortClass("type")}>機材</th>
    <th data-sort="purpose" ${getSortClass("purpose")}>用途</th>
    <th data-sort="dmx" ${getSortClass("dmx")}>DMX</th>
    <th data-sort="mode" ${getSortClass("mode")}>ch数</th>
    <th data-sort="color" ${getSortClass("color")}>色</th>
    <th data-sort="watt" ${getSortClass("watt")}>W</th>
    <th></th>
  </tr>`;

  const body = rows.map(r => {
    const isRowVisible = state.visibleLayers.includes(r.category);
    const isSelected = r.id === state.selectedId;
    const cls = `patch-row${isSelected ? " selected" : ""}${isRowVisible ? "" : " dimmed"}`;
    const titleAttr = isRowVisible ? "" : "title='このレイヤは非表示です'";
    return `<tr data-id="${r.id}" class="${cls}" ${titleAttr}>
      <td><span class="badge badge-${r.category}">${getCategoryLabel(r.category)}</span></td>
      <td>${r.ch || ""}</td>
      <td>${esc(r.type)}</td>
      <td>${esc(r.purpose)}</td>
      <td>${esc(r.dmx)}</td>
      <td>${r.mode || 1}</td>
      <td>${esc(r.color)}</td>
      <td>${r.watt || 0}</td>
      <td><button class="patch-del" data-id="${r.id}" title="この機材を削除">×</button></td>
    </tr>`;
  }).join("");

  patchEl.innerHTML =
    `<div class="patch-header-summary">
      <div class="hint">パッチ表（自動生成）</div>
      <div class="patch-summary-text" style="display: flex; gap: 16px; font-size: 12px; color: #4b5563; flex-wrap: wrap; align-items: center;">
        <span>音響: <strong style="color:#1d4ed8;">${sum.soundWatt}W</strong> (約${sum.soundAmps}A)</span>
        <span>照明: <strong style="color:#b45309;">${sum.lightingWatt}W</strong> (約${sum.lightingAmps}A)</span>
        <span>映像: <strong style="color:#047857;">${sum.videoWatt}W</strong> (約${sum.videoAmps}A)</span>
        <span style="font-weight: bold; color: #111827; border-left: 1px solid #d1d5db; padding-left: 16px; margin-left: 4px;">
          合計: <strong style="color:#111827;">${sum.totalWatt}W</strong> (約${sum.totalAmps}A)
        </span>
      </div>
    </div>
    <table>${head}${body}</table>`;
  }

  // レイアウト表示切り替え
  const splitContainer = document.getElementById("split-container");
  const layoutToggle = document.getElementById("layout-toggle-container");
  if (state.currentView === "plot") {
    layoutToggle.style.display = "flex";
    if (state.plotLayout === "split") {
      splitContainer.className = "layout-split";
    } else if (state.plotLayout === "front") {
      splitContainer.className = "layout-front-only";
    } else if (state.plotLayout === "side") {
      splitContainer.className = "layout-side-only";
    } else {
      splitContainer.className = "layout-top-only";
    }
  } else {
    layoutToggle.style.display = "none";
    splitContainer.className = "layout-top-only";
  }

  // 背景ボタン（btn-bg）のテキストと色のトグル切り替え
  const btnBg = document.getElementById("btn-bg");
  if (btnBg) {
    let hasBg = false;
    if (state.currentView === "plot") {
      if (state.plotLayout === "front") {
        hasBg = !!state.project.backgroundFront?.image;
      } else if (state.plotLayout === "side") {
        hasBg = !!state.project.backgroundSide?.image;
      } else {
        hasBg = !!state.project.background?.image;
      }
    } else {
      hasBg = !!state.project.background?.image;
    }

    if (hasBg) {
      btnBg.textContent = "背景削除";
      btnBg.style.backgroundColor = "#fee2e2";
      btnBg.style.color = "#991b1b";
      btnBg.style.borderColor = "#fca5a5";
    } else {
      btnBg.textContent = "背景読込";
      btnBg.style.backgroundColor = "";
      btnBg.style.color = "";
      btnBg.style.borderColor = "";
    }
  }

  if (!opts.dragView) autosave(serialize(state.project));
}

// 接続操作のハンドリング
function handleConnectionChange(action, data) {
  saveHistory();
  if (action === "add") {
    const newConn = {
      id: crypto.randomUUID(),
      from: data.from || state.selectedId,
      to: data.to,
      label: data.label || ""
    };
    state.project.connections.push(newConn);
    state.selectedConnectionId = null; // 接続線の選択はせず、元機材の選択を維持
    render();
  } else if (action === "delete") {
    const idx = state.project.connections.findIndex(c => c.id === data.connectionId);
    if (idx >= 0) {
      state.project.connections.splice(idx, 1);
      state.selectedConnectionId = null;
      render();
    }
  } else if (action === "update_label") {
    const conn = state.project.connections.find(c => c.id === data.connectionId);
    if (conn) {
      conn.label = data.label;
      render({ skipProperties: true });
    }
  }
}

// --- イベント登録 ---

// ビュー切り替えイベント
document.getElementById("btn-view-plot").addEventListener("click", () => {
  document.getElementById("btn-view-plot").classList.add("active");
  document.getElementById("btn-view-dmx").classList.remove("active");
  document.getElementById("btn-view-audio").classList.remove("active");
  state.currentView = "plot";
  state.selectedId = null;
  state.selectedConnectionId = null;
  render();
});

document.getElementById("btn-view-dmx").addEventListener("click", () => {
  document.getElementById("btn-view-plot").classList.remove("active");
  document.getElementById("btn-view-dmx").classList.add("active");
  document.getElementById("btn-view-audio").classList.remove("active");
  state.currentView = "dmx";
  state.selectedId = null;
  state.selectedConnectionId = null;
  render();
});

document.getElementById("btn-view-audio").addEventListener("click", () => {
  document.getElementById("btn-view-plot").classList.remove("active");
  document.getElementById("btn-view-dmx").classList.remove("active");
  document.getElementById("btn-view-audio").classList.add("active");
  state.currentView = "audio";
  state.selectedId = null;
  state.selectedConnectionId = null;
  render();
});

// 画面分割切り替えトグル
const layoutBtns = {
  top: document.getElementById("btn-layout-top"),
  front: document.getElementById("btn-layout-front"),
  side: document.getElementById("btn-layout-side"),
  split: document.getElementById("btn-layout-split")
};

function updateLayoutButtons(activeKey) {
  for (const [key, btn] of Object.entries(layoutBtns)) {
    if (btn) {
      if (key === activeKey) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
  }
}

if (layoutBtns.top) {
  layoutBtns.top.addEventListener("click", () => {
    state.plotLayout = "top";
    updateLayoutButtons("top");
    render();
  });
}
if (layoutBtns.front) {
  layoutBtns.front.addEventListener("click", () => {
    state.plotLayout = "front";
    updateLayoutButtons("front");
    render();
  });
}
if (layoutBtns.side) {
  layoutBtns.side.addEventListener("click", () => {
    state.plotLayout = "side";
    updateLayoutButtons("side");
    render();
  });
}
if (layoutBtns.split) {
  layoutBtns.split.addEventListener("click", () => {
    state.plotLayout = "split";
    updateLayoutButtons("split");
    render();
  });
}

// 保存・開く・新規
document.getElementById("btn-save").addEventListener("click", () => {
  downloadJson(serialize(state.project), (state.project.meta.name || "plot") + ".json");
});

document.getElementById("btn-open").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file"; input.accept = "application/json,.json";
  input.onchange = async () => {
    if (input.files[0]) {
      state.project = deserialize(await readJsonFile(input.files[0]));
      undoStack.length = 0;
      lastSaveTime = 0;
      state.selectedId = null;
      render();
    }
  };
  input.click();
});

document.getElementById("btn-new").addEventListener("click", () => {
  if (confirm("現在の図面を破棄して新規作成しますか？")) {
    state.project = createProject();
    undoStack.length = 0;
    lastSaveTime = 0;
    state.selectedId = null;
    calibPts = null;
    render();
  }
});

// 背景画像読込・削除
document.getElementById("btn-bg").addEventListener("click", () => {
  let hasBg = false;
  let bgTarget = "top";
  if (state.currentView === "plot") {
    if (state.plotLayout === "front") {
      hasBg = !!state.project.backgroundFront?.image;
      bgTarget = "front";
    } else if (state.plotLayout === "side") {
      hasBg = !!state.project.backgroundSide?.image;
      bgTarget = "side";
    } else {
      hasBg = !!state.project.background?.image;
      bgTarget = "top";
    }
  } else {
    hasBg = !!state.project.background?.image;
    bgTarget = "top";
  }

  if (hasBg) {
    if (confirm("背景画像を削除しますか？")) {
      saveHistory();
      if (bgTarget === "front") {
        state.project.backgroundFront.image = null;
      } else if (bgTarget === "side") {
        state.project.backgroundSide.image = null;
      } else {
        state.project.background.image = null;
      }
      render();
    }
  } else {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,application/pdf,.pdf";
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const bg = file.type === "application/pdf"
        ? await loadPdfFirstPage(file)
        : await loadImageFile(file);

      saveHistory();
      if (bgTarget === "front") {
        state.project.backgroundFront = state.project.backgroundFront || { image: null, opacity: 1 };
        state.project.backgroundFront.image = bg.image;
      } else if (bgTarget === "side") {
        state.project.backgroundSide = state.project.backgroundSide || { image: null, opacity: 1 };
        state.project.backgroundSide.image = bg.image;
      } else {
        state.project.background.image = bg.image;
        state.project.background.width = bg.width;
        state.project.background.height = bg.height;
      }
      render();
    };
    input.click();
  }
});

// 縮尺合わせ
let calibPts = null;
document.getElementById("btn-scale").addEventListener("click", () => {
  if (state.currentView === "dmx") {
    alert("縮尺合わせは「配置図」ビューで行ってください");
    return;
  }
  calibPts = [];
  alert("図面上で既知の距離の端から端を2点クリックしてください");
});

// キャンバスクリック (縮尺合わせと選択解除)
svg.addEventListener("click", (e) => {
  if (state.currentView !== "plot") return; // 配置図ビュー以外では縮尺合わせのクリックを無視

  if (calibPts) {
    const r = svg.getBoundingClientRect();
    calibPts.push({ x: e.clientX - r.left, y: e.clientY - r.top });
    if (calibPts.length === 2) {
      const dx = calibPts[1].x - calibPts[0].x, dy = calibPts[1].y - calibPts[0].y;
      const px = Math.hypot(dx, dy);
      const mm = parseFloat(prompt("その2点間の実際の距離は何ミリメートル？(例: 10mなら10000)", "10000"));
      if (!(mm > 0)) {
        alert("有効な距離（正の数）を入力してください。較正を中止しました。");
        calibPts = null;
        return;
      }
      state.project.meta.scale.pxPerMm = pxPerMmFromCalibration(px, mm);
      alert(`縮尺を設定: 1mmあたり ${state.project.meta.scale.pxPerMm.toFixed(4)}px`);
      calibPts = null;
    }
  } else {
    // 機材以外の部分をクリックしたら選択解除
    const g = e.target.closest("g[data-id]");
    if (!g) {
      state.selectedId = null;
      state.selectedConnectionId = null;
      render();
    }
  }
});

// パレットタブ切り替え
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.activeCategory = btn.dataset.tab;
    renderPalette();
  });
});

// レイヤ表示切り替え
function updateVisibleLayers() {
  state.visibleLayers = [];
  for (const cat of ["stage", "sound", "lighting", "video"]) {
    if (document.getElementById(`layer-${cat}`).checked) {
      state.visibleLayers.push(cat);
    }
  }
  // 選択中の機材が非表示レイヤのものなら選択解除
  if (state.selectedId) {
    const f = state.project.fixtures.find(x => x.id === state.selectedId);
    if (f && !state.visibleLayers.includes(f.category || "lighting")) {
      state.selectedId = null;
    }
  }
  render();
}

["stage", "sound", "lighting", "video"].forEach(cat => {
  document.getElementById(`layer-${cat}`).addEventListener("change", updateVisibleLayers);
});

// レイヤロック切り替え
function toggleLayerLock(cat) {
  const idx = state.lockedLayers.indexOf(cat);
  const btn = document.getElementById(`lock-${cat}`);
  if (idx >= 0) {
    // ロック解除
    state.lockedLayers.splice(idx, 1);
    if (btn) {
      btn.innerText = "🔓";
      btn.title = `${cat}レイヤをロック`;
      btn.classList.remove("locked");
    }
  } else {
    // ロック
    state.lockedLayers.push(cat);
    if (btn) {
      btn.innerText = "🔒";
      btn.title = `${cat}レイヤをロック解除`;
      btn.classList.add("locked");
    }
    // ロックされたレイヤに属する現在選択中の機材がある場合、選択解除
    if (state.selectedId) {
      const f = state.project.fixtures.find(x => x.id === state.selectedId);
      if (f && (f.category || "lighting") === cat) {
        state.selectedId = null;
        state.selectedConnectionId = null;
      }
    }
  }
  render();
}

["stage", "sound", "lighting", "video"].forEach(cat => {
  document.getElementById(`lock-${cat}`).addEventListener("click", () => toggleLayerLock(cat));
});

// ビーム表示トグル
document.getElementById("toggle-beam").addEventListener("change", (e) => {
  state.showBeam = e.target.checked;
  render();
});

// ドラッグ＆ドロップ配置
svg.addEventListener("dragover", e => e.preventDefault());
svg.addEventListener("drop", e => {
  if (state.currentView !== "plot") return; // 配置図ビュー以外ではドラッグ追加不可

  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  const category = e.dataTransfer.getData("category") || "lighting";
  if (!type) return;
  if (state.lockedLayers.includes(category)) return; // ロックされたレイヤには配置不可
  const r = svg.getBoundingClientRect();
  
  // ライブラリからデフォルトサイズを取得して設定
  const def = getFullLibrary(state.customLibrary || []).find(d => d.type === type);
  const raw = screenToLogical(e.clientX - r.left, e.clientY - r.top);
  const { x, y } = clampToBounds(raw.x, raw.y);
  saveHistory();
  const newItem = createFixture({
    type,
    category,
    x,
    y,
    widthMm: def?.defaultWidth || 0,
    depthMm: def?.defaultDepth || 0,
    heightMm: def?.defaultHeight || 0,
    beamAngle: def?.beamAngle || 0,
    watt: def?.watt || 0,
    mode: def?.channels || 1
  });
  clampFixturePosition(newItem);
  state.project.fixtures.push(newItem);
  state.selectedId = newItem.id;
  render();
});

// 正面図でのドラッグ＆ドロップ配置
svgFront.addEventListener("dragover", e => e.preventDefault());
svgFront.addEventListener("drop", e => {
  if (state.currentView !== "plot") return;
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  const category = e.dataTransfer.getData("category") || "lighting";
  if (!type) return;
  if (state.lockedLayers.includes(category)) return; // ロックされたレイヤには配置不可

  const r = svgFront.getBoundingClientRect();
  const mx = e.clientX - r.left;
  const my = e.clientY - r.top;

  const showBorder = state.plotLayout === "front" && !!state.project.meta.showBorder;
  let s = 1, dx = 0, dy = 0;
  if (showBorder) {
    const t = getElevationTransform("front");
    s = t.s; dx = t.dx; dy = t.dy;
  }
  const lx = (mx - dx) / s;
  const ly = (my - dy) / s;

  const s_model = 0.08;
  const centerX = 500;
  const floorY = 600;
  const x = (lx - centerX) / s_model;
  const z = (floorY - ly) / s_model;
  const y = (state.project.meta.plotHeight || 8000) / 2; // 奥行きの中心

  const def = getFullLibrary(state.customLibrary || []).find(d => d.type === type);
  saveHistory();
  const newItem = createFixture({
    type,
    category,
    x,
    y,
    z: Math.max(0, z),
    widthMm: def?.defaultWidth || 0,
    depthMm: def?.defaultDepth || 0,
    heightMm: def?.defaultHeight || 0,
    beamAngle: def?.beamAngle || 0,
    watt: def?.watt || 0,
    mode: def?.channels || 1
  });
  clampFixturePosition(newItem);
  state.project.fixtures.push(newItem);
  state.selectedId = newItem.id;
  render();
});

// 側面図でのドラッグ＆ドロップ配置
svgSide.addEventListener("dragover", e => e.preventDefault());
svgSide.addEventListener("drop", e => {
  if (state.currentView !== "plot") return;
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  const category = e.dataTransfer.getData("category") || "lighting";
  if (!type) return;
  if (state.lockedLayers.includes(category)) return; // ロックされたレイヤには配置不可

  const r = svgSide.getBoundingClientRect();
  const mx = e.clientX - r.left;
  const my = e.clientY - r.top;

  const showBorder = state.plotLayout === "side" && !!state.project.meta.showBorder;
  let s = 1, dx = 0, dy = 0;
  if (showBorder) {
    const t = getElevationTransform("side");
    s = t.s; dx = t.dx; dy = t.dy;
  }
  const lx = (mx - dx) / s;
  const ly = (my - dy) / s;

  const s_model = 0.08;
  const originX = 100;
  const floorY = 600;
  const y = (lx - originX) / s_model;
  const z = (floorY - ly) / s_model;
  const x = 0; // 幅の中心

  const def = getFullLibrary(state.customLibrary || []).find(d => d.type === type);
  saveHistory();
  const newItem = createFixture({
    type,
    category,
    x,
    y,
    z: Math.max(0, z),
    widthMm: def?.defaultWidth || 0,
    depthMm: def?.defaultDepth || 0,
    heightMm: def?.defaultHeight || 0,
    beamAngle: def?.beamAngle || 0,
    watt: def?.watt || 0,
    mode: def?.channels || 1
  });
  clampFixturePosition(newItem);
  state.project.fixtures.push(newItem);
  state.selectedId = newItem.id;
  render();
});

// 機材ドラッグ移動・クリック選択、およびポート結線ドラッグ
let dragging = null;
// ドラッグ中は requestAnimationFrame で 1フレーム1回に集約し、操作中ビューのみ描画
let _dragRafId = null;
let _dragPendingView = null;
function scheduleDragRender(viewType) {
  _dragPendingView = viewType;
  if (_dragRafId !== null) return;
  _dragRafId = requestAnimationFrame(() => {
    _dragRafId = null;
    render({ dragView: _dragPendingView });
  });
}
svg.addEventListener("mousedown", e => {
  // 1. ポート（出力ポート）クリックの判定
  const port = e.target.closest("circle.port-out");
  if (port) {
    const parentG = port.closest("g[data-id]");
    if (parentG) {
      const parentFixture = state.project.fixtures.find(x => x.id === parentG.dataset.id);
      if (parentFixture && state.lockedLayers.includes(parentFixture.category || "lighting")) {
        return; // ロックされたレイヤからは結線開始不可
      }
    }
    e.stopPropagation();
    e.preventDefault();
    state.dragStartId = port.dataset.id;
    document.body.classList.add("dragging-connection");

    // ポートのSVG相対座標を計算
    const r = svg.getBoundingClientRect();
    const portBBox = port.getBoundingClientRect();
    state.dragStartCoords = {
      x: (portBBox.left + portBBox.width / 2) - r.left,
      y: (portBBox.top + portBBox.height / 2) - r.top
    };
    return;
  }

  // 2. 機材のクリック選択・ドラッグ移動判定
  const g = e.target.closest("g[data-id]");
  if (!g) return;
  const id = g.dataset.id;
  const f = state.project.fixtures.find(x => x.id === id);
  
  // 非表示またはロックされたレイヤの機材は選択・移動不可
  const cat = f.category || "lighting";
  if (!state.visibleLayers.includes(cat) || state.lockedLayers.includes(cat)) return;

  state.selectedId = id;
  state.selectedConnectionId = null;

  if (state.currentView === "plot") {
    // 配置図ビューのときのみドラッグ移動を有効化
    const r = svg.getBoundingClientRect();
    const { x: mouseX, y: mouseY } = screenToLogical(e.clientX - r.left, e.clientY - r.top);
    saveHistory();
    dragging = { f, startX: f.x, startY: f.y, offX: mouseX - f.x, offY: mouseY - f.y };
  }
  render();
});

svgFront.addEventListener("mousedown", e => {
  const g = e.target.closest("g[data-id]");
  if (!g) {
    state.selectedId = null;
    state.selectedConnectionId = null;
    render();
    return;
  }
  const id = g.dataset.id;
  const f = state.project.fixtures.find(x => x.id === id);
  
  const cat = f.category || "lighting";
  if (!state.visibleLayers.includes(cat) || state.lockedLayers.includes(cat)) return;

  state.selectedId = id;
  state.selectedConnectionId = null;

  if (state.currentView === "plot" && (state.plotLayout === "split" || state.plotLayout === "front")) {
    const r = svgFront.getBoundingClientRect();
    const trans = getElevationTransform("front");
    const vb = getSvgVbParams(svgFront, r.width);
    const mouseX_svg = (e.clientX - r.left) * vb.scale;
    const mouseY_svg = (e.clientY - r.top) * vb.scale;

    const contentX = (mouseX_svg - trans.dx) / trans.s;
    const contentY = (mouseY_svg - trans.dy) / trans.s;

    const s_model = 0.08;
    const centerX = 500;
    const floorY = 600;
    const logicalX = (contentX - centerX) / s_model;
    const logicalZ = (floorY - contentY) / s_model;

    saveHistory();
    dragging = {
      f,
      viewType: "front",
      startX: f.x,
      startZ: f.z || 0,
      offX: logicalX - f.x,
      offZ: logicalZ - (f.z || 0)
    };
  }
  render();
});

svgSide.addEventListener("mousedown", e => {
  const g = e.target.closest("g[data-id]");
  if (!g) {
    state.selectedId = null;
    state.selectedConnectionId = null;
    render();
    return;
  }
  const id = g.dataset.id;
  const f = state.project.fixtures.find(x => x.id === id);
  
  const cat = f.category || "lighting";
  if (!state.visibleLayers.includes(cat) || state.lockedLayers.includes(cat)) return;

  state.selectedId = id;
  state.selectedConnectionId = null;

  if (state.currentView === "plot" && (state.plotLayout === "split" || state.plotLayout === "side")) {
    const r = svgSide.getBoundingClientRect();
    const trans = getElevationTransform("side");
    const vb = getSvgVbParams(svgSide, r.width);
    const mouseX_svg = (e.clientX - r.left) * vb.scale;
    const mouseY_svg = (e.clientY - r.top) * vb.scale;

    const contentX = (mouseX_svg - trans.dx) / trans.s;
    const contentY = (mouseY_svg - trans.dy) / trans.s;

    const s_model = 0.08;
    const originX = 100;
    const floorY = 600;
    const logicalY = (contentX - originX) / s_model;
    const logicalZ = (floorY - contentY) / s_model;

    saveHistory();
    dragging = {
      f,
      viewType: "side",
      startY: f.y,
      startZ: f.z || 0,
      offY: logicalY - f.y,
      offZ: logicalZ - (f.z || 0)
    };
  }
  render();
});

window.addEventListener("mousemove", e => {
  if (dragging) {
    if (dragging.viewType === "front") {
      const r = svgFront.getBoundingClientRect();
      const trans = getElevationTransform("front");
      const vb = getSvgVbParams(svgFront, r.width);
      const mouseX_svg = (e.clientX - r.left) * vb.scale;
      const mouseY_svg = (e.clientY - r.top) * vb.scale;

      const contentX = (mouseX_svg - trans.dx) / trans.s;
      const contentY = (mouseY_svg - trans.dy) / trans.s;

      const s_model = 0.08;
      const centerX = 500;
      const floorY = 600;
      const logicalX = (contentX - centerX) / s_model;
      const logicalZ = (floorY - contentY) / s_model;

      let targetX = logicalX - dragging.offX;
      let targetZ = logicalZ - dragging.offZ;

      if (e.shiftKey) {
        const dx = targetX - dragging.startX;
        const dz = targetZ - dragging.startZ;
        if (Math.abs(dx) > Math.abs(dz)) {
          targetZ = dragging.startZ;
        } else {
          targetX = dragging.startX;
        }
      }

      const clampedFront = clampToBounds(targetX, dragging.f.y);
      dragging.f.x = clampedFront.x;
      dragging.f.z = Math.max(0, targetZ);
      clampFixturePosition(dragging.f);
      scheduleDragRender("front");
    } else if (dragging.viewType === "side") {
      const r = svgSide.getBoundingClientRect();
      const trans = getElevationTransform("side");
      const vb = getSvgVbParams(svgSide, r.width);
      const mouseX_svg = (e.clientX - r.left) * vb.scale;
      const mouseY_svg = (e.clientY - r.top) * vb.scale;

      const contentX = (mouseX_svg - trans.dx) / trans.s;
      const contentY = (mouseY_svg - trans.dy) / trans.s;

      const s_model = 0.08;
      const originX = 100;
      const floorY = 600;
      const logicalY = (contentX - originX) / s_model;
      const logicalZ = (floorY - contentY) / s_model;

      let targetY = logicalY - dragging.offY;
      let targetZ = logicalZ - dragging.offZ;

      if (e.shiftKey) {
        const dy = targetY - dragging.startY;
        const dz = targetZ - dragging.startZ;
        if (Math.abs(dy) > Math.abs(dz)) {
          targetZ = dragging.startZ;
        } else {
          targetY = dragging.startY;
        }
      }

      const clampedSide = clampToBounds(dragging.f.x, targetY);
      dragging.f.y = clampedSide.y;
      dragging.f.z = Math.max(0, targetZ);
      clampFixturePosition(dragging.f);
      scheduleDragRender("side");
    } else {
      const r = svg.getBoundingClientRect();
      const { x: mouseX, y: mouseY } = screenToLogical(e.clientX - r.left, e.clientY - r.top);
      
      let targetX = mouseX - dragging.offX;
      let targetY = mouseY - dragging.offY;

      if (e.shiftKey) {
        const dx = targetX - dragging.startX;
        const dy = targetY - dragging.startY;
        if (Math.abs(dx) > Math.abs(dy)) {
          targetY = dragging.startY;
        } else {
          targetX = dragging.startX;
        }
      }

      const clamped = clampToBounds(targetX, targetY);
      dragging.f.x = clamped.x;
      dragging.f.y = clamped.y;
      clampFixturePosition(dragging.f);
      scheduleDragRender("plot");
    }
  } else if (state.dragStartId && state.dragStartCoords) {
    // ドラッグ結線中の仮線描画
    const r = svg.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;

    let tempG = svg.getElementById("temp-drag-line-wrap");
    if (!tempG) {
      tempG = document.createElementNS(SVGNS, "g");
      tempG.setAttribute("id", "temp-drag-line-wrap");
      svg.appendChild(tempG);
    }
    tempG.innerHTML = "";

    const line = document.createElementNS(SVGNS, "line");
    line.setAttribute("x1", String(state.dragStartCoords.x));
    line.setAttribute("y1", String(state.dragStartCoords.y));
    line.setAttribute("x2", String(mx));
    line.setAttribute("y2", String(my));
    line.setAttribute("stroke", "#ef4444");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-dasharray", "4,4");
    line.style.pointerEvents = "none";
    tempG.appendChild(line);
  }
});

window.addEventListener("mouseup", e => {
  const wasDragging = dragging;
  dragging = null;
  // ドラッグ確定: 保留中のフレーム描画を取り消し、全ビュー＋パッチ表＋保存をフル再描画
  if (wasDragging) {
    if (_dragRafId !== null) { cancelAnimationFrame(_dragRafId); _dragRafId = null; }
    render();
  }

  if (state.dragStartId) {
    // 仮線を消去
    const tempG = svg.getElementById("temp-drag-line-wrap");
    if (tempG) tempG.remove();

    // ドロップ先ターゲットの判定
    const inPort = e.target.closest("circle.port-in");
    const targetNode = e.target.closest("g[data-id]");
    let toId = null;

    if (inPort) {
      toId = inPort.dataset.id;
    } else if (targetNode) {
      toId = targetNode.dataset.id;
    }

    if (toId && toId !== state.dragStartId) {
      // 接続先または接続元の機材のカテゴリがロックされている場合はキャンセル
      const fromFixture = state.project.fixtures.find(f => f.id === state.dragStartId);
      const toFixture = state.project.fixtures.find(f => f.id === toId) || (toId.startsWith("ext:") ? { category: "sound" } : null); // 外部出力は音響扱い
      
      const fromCat = fromFixture ? (fromFixture.category || "lighting") : null;
      const toCat = toFixture ? (toFixture.category || "lighting") : null;
      
      if ((fromCat && state.lockedLayers.includes(fromCat)) || (toCat && state.lockedLayers.includes(toCat))) {
        state.dragStartId = null;
        state.dragStartCoords = null;
        document.body.classList.remove("dragging-connection");
        return;
      }

      // 結線成立
      const label = prompt("回線名（ラベル）を入力してください（例: Ch 1 / 空欄も可）:");
      if (label !== null) {
        handleConnectionChange("add", { from: state.dragStartId, to: toId, label: label });
      }
    }

    state.dragStartId = null;
    state.dragStartCoords = null;
    document.body.classList.remove("dragging-connection");
  }
});

// キーボードショートカット（IME対策: keyCode も併用）
function getShortcutKey(e) {
  if (e.key !== "Process" && e.key !== "Unidentified") return e.key;
  // IMEオン時は keyCode からキーを復元
  const map = { 89: "y", 84: "t", 82: "r", 68: "d", 8: "Backspace", 46: "Delete" };
  const base = map[e.keyCode];
  if (!base) return null;
  return e.shiftKey ? base.toUpperCase() : base;
}

window.addEventListener("keydown", e => {
  if (e.target && e.target.matches && e.target.matches("input, textarea")) return;
  if (e.isComposing) return;

  // Command + Z または Ctrl + Z で Undo
  const isUndo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z";
  if (isUndo) {
    e.preventDefault();
    undo();
    return;
  }

  // Command + C または Ctrl + C で Copy
  const isCopy = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c";
  if (isCopy) {
    if (state.selectedId && !String(state.selectedId).startsWith("ext:")) {
      const f = state.project.fixtures.find(x => x.id === state.selectedId);
      if (f && state.visibleLayers.includes(f.category || "lighting")) {
        state.clipboard = JSON.stringify(f);
        e.preventDefault();
      }
    }
    return;
  }

  // Command + V または Ctrl + V で Paste
  const isPaste = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "v";
  if (isPaste) {
    if (state.clipboard && state.currentView === "plot") {
      try {
        const orig = JSON.parse(state.clipboard);
        if (state.lockedLayers.includes(orig.category || "lighting")) {
          e.preventDefault();
          return; // ロックされたレイヤへのペーストは不可
        }
        e.preventDefault();
        saveHistory();
        const { id, ...rest } = orig;
        const copy = createFixture({
          ...rest,
          x: orig.x + 200,
          y: orig.y + 200
        });
        clampFixturePosition(copy);
        state.project.fixtures.push(copy);
        state.selectedId = copy.id;
        state.selectedConnectionId = null;
        render();
      } catch (err) {
        console.error("Paste failed:", err);
      }
    }
    return;
  }

  // 表示レイヤ・ビーム表示のトグルショートカット
  const lowerKey = e.key.toLowerCase();
  if (["s", "a", "l", "v", "b"].includes(lowerKey)) {
    if (!e.metaKey && !e.ctrlKey && !e.altKey) {
      if (lowerKey === "s") {
        const cb = document.getElementById("layer-stage");
        if (cb) { cb.checked = !cb.checked; updateVisibleLayers(); e.preventDefault(); }
      } else if (lowerKey === "a") {
        const cb = document.getElementById("layer-sound");
        if (cb) { cb.checked = !cb.checked; updateVisibleLayers(); e.preventDefault(); }
      } else if (lowerKey === "l") {
        const cb = document.getElementById("layer-lighting");
        if (cb) { cb.checked = !cb.checked; updateVisibleLayers(); e.preventDefault(); }
      } else if (lowerKey === "v") {
        const cb = document.getElementById("layer-video");
        if (cb) { cb.checked = !cb.checked; updateVisibleLayers(); e.preventDefault(); }
      } else if (lowerKey === "b") {
        const cb = document.getElementById("toggle-beam");
        if (cb) { cb.checked = !cb.checked; state.showBeam = cb.checked; render(); e.preventDefault(); }
      }
      return;
    }
  }

  const key = getShortcutKey(e);
  if (!key) return;

  // 編集操作（削除、回転、複製）の前に履歴を保存
  if (["Delete", "Backspace", "y", "Y", "t", "T", "r", "R", "d"].includes(key)) {
    saveHistory();
  }

  // 接続線または外部出力ノードが選択されていて、Delete/Backspaceが押された場合の処理
  if (key === "Delete" || key === "Backspace") {
    if (state.selectedConnectionId) {
      const idx = state.project.connections.findIndex(c => c.id === state.selectedConnectionId);
      if (idx >= 0) {
        const conn = state.project.connections[idx];
        const fromFixture = state.project.fixtures.find(f => f.id === conn.from);
        const toFixture = state.project.fixtures.find(f => f.id === conn.to) || (conn.to.startsWith("ext:") ? { category: "sound" } : null);
        const fromCat = fromFixture ? (fromFixture.category || "lighting") : null;
        const toCat = toFixture ? (toFixture.category || "lighting") : null;
        if ((fromCat && state.lockedLayers.includes(fromCat)) || (toCat && state.lockedLayers.includes(toCat))) {
          return; // ロックされたレイヤの接続線は削除不可
        }
        state.project.connections.splice(idx, 1);
        state.selectedConnectionId = null;
        render();
      }
      return;
    } else if (state.selectedId && String(state.selectedId).startsWith("ext:")) {
      state.project.connections = state.project.connections.filter(c => c.to !== state.selectedId);
      state.selectedId = null;
      render();
      return;
    }
  }

  // 以下は図面上の機材 (fixtures) 選択時の処理
  if (!state.selectedId) return;

  const list = state.project.fixtures;
  const i = list.findIndex(x => x.id === state.selectedId);
  if (i < 0) return;

  const cat = list[i].category || "lighting";
  if (!state.visibleLayers.includes(cat) || state.lockedLayers.includes(cat)) return;

  if (key === "y") {
    list[i].rotation = (list[i].rotation + 15) % 360;
    e.preventDefault();
    render();
  } else if (key === "Y") {
    list[i].rotation = (list[i].rotation - 15 + 360) % 360;
    e.preventDefault();
    render();
  } else if (key === "t") {
    list[i].pitch = ((list[i].pitch || 0) + 15) % 360;
    e.preventDefault();
    render();
  } else if (key === "T") {
    list[i].pitch = ((list[i].pitch || 0) - 15 + 360) % 360;
    e.preventDefault();
    render();
  } else if (key === "r") {
    list[i].roll = ((list[i].roll || 0) + 15) % 360;
    e.preventDefault();
    render();
  } else if (key === "R") {
    list[i].roll = ((list[i].roll || 0) - 15 + 360) % 360;
    e.preventDefault();
    render();
  } else if (key === "d") {
    if (state.currentView !== "plot") return;
    const { id, ...rest } = list[i];
    const copy = createFixture({ ...rest, x: list[i].x + 20, y: list[i].y + 20 });
    list.push(copy);
    state.selectedId = copy.id;
    e.preventDefault();
    render();
  } else if (key === "Delete" || key === "Backspace") {
    state.project.connections = state.project.connections.filter(c => c.from !== state.selectedId && c.to !== state.selectedId);
    list.splice(i, 1);
    state.selectedId = null;
    render();
  }
});

// SVGをImageオブジェクトに非同期でロード
function svgToImage(svgElement) {
  return new Promise((resolve, reject) => {
    try {
      const cloned = svgElement.cloneNode(true);

      // styles.css の定義を埋め込むための style 要素を作成
      const styleEl = document.createElementNS("http://www.w3.org/2000/svg", "style");
      let stylesText = "";
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            stylesText += rule.cssText + "\n";
          }
        } catch (e) {
          // クロスオリジンなど取得不可の場合は無視
        }
      }
      styleEl.textContent = stylesText;
      cloned.insertBefore(styleEl, cloned.firstChild);

      const svgString = new XMLSerializer().serializeToString(cloned);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

// ファイルのダウンロード処理
function downloadFile(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// 画像・PDFの書き出し処理
document.getElementById("btn-export").addEventListener("click", async () => {
  const btn = document.getElementById("btn-export");
  const origText = btn.textContent;
  btn.textContent = "書き出し中...";
  btn.disabled = true;

  try {
    const format = document.getElementById("export-format").value;
    const filename = (state.project.meta.name || "plot") + "_" + Date.now();

    // 1. 対象のSVGを決定・ロード
    let canvas = document.createElement("canvas");
    const scale = 2; // 2倍の解像度で書き出し

    if (state.currentView === "plot" && state.plotLayout === "split") {
      // 3面分割ビューの合成
      const [imgTop, imgFront, imgSide] = await Promise.all([
        svgToImage(svg),
        svgToImage(svgFront),
        svgToImage(svgSide)
      ]);

      canvas.width = 2000 * scale;
      canvas.height = 1400 * scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // それぞれ描画
      ctx.drawImage(imgTop, 0, 0, 1000 * scale, 700 * scale);
      ctx.drawImage(imgFront, 0, 700 * scale, 1000 * scale, 700 * scale);
      ctx.drawImage(imgSide, 1000 * scale, 700 * scale, 1000 * scale, 700 * scale);

      // グレーの境界仕切り線
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(1000 * scale, 0);
      ctx.lineTo(1000 * scale, 1400 * scale);
      ctx.moveTo(0, 700 * scale);
      ctx.lineTo(2000 * scale, 700 * scale);
      ctx.stroke();

    } else {
      // 単一ビュー（平面図のみ、正面のみ、側面のみ、DMX系統図、音響・映像系統図）
      let targetSvg = svg;
      if (state.currentView === "plot") {
        if (state.plotLayout === "front") targetSvg = svgFront;
        if (state.plotLayout === "side") targetSvg = svgSide;
      }

      const img = await svgToImage(targetSvg);
      const viewBox = targetSvg.viewBox.baseVal;
      const w = viewBox.width || targetSvg.width.baseVal.value || 1189;
      const h = viewBox.height || targetSvg.height.baseVal.value || 841;

      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // 2. 指定形式での出力
    if (format === "png") {
      const dataUrl = canvas.toDataURL("image/png");
      downloadFile(dataUrl, filename + ".png");
    } else if (format === "jpeg") {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      downloadFile(dataUrl, filename + ".jpg");
    } else if (format === "pdf") {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("PDFライブラリがロードされていません。インターネット接続を確認してください。");
        return;
      }
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
      pdf.save(filename + ".pdf");
    }

  } catch (err) {
    console.error("Export failed:", err);
    alert("書き出しに失敗しました: " + err.message);
  } finally {
    btn.textContent = origText;
    btn.disabled = false;
  }
});

// パッチ表: 指定IDの機材を選択
function selectFixtureById(id) {
  state.selectedId = id;
  render();
}

// パッチ表: 指定IDの機材を削除（ロックされたレイヤは不可、Undo可能）
function deleteFixtureById(id) {
  const list = state.project.fixtures;
  const i = list.findIndex(f => f.id === id);
  if (i < 0) return;
  const cat = list[i].category || "lighting";
  if (state.lockedLayers.includes(cat)) {
    alert("このレイヤはロックされているため削除できません。");
    return;
  }
  saveHistory();
  state.project.connections = state.project.connections.filter(c => c.from !== id && c.to !== id);
  list.splice(i, 1);
  if (state.selectedId === id) state.selectedId = null;
  render();
}

// パッチ表: ヘッダでソート / 行クリックで選択 / ×ボタンで削除
document.getElementById("patch").addEventListener("click", e => {
  // ×ボタン: 削除
  const del = e.target.closest(".patch-del");
  if (del) {
    e.stopPropagation();
    deleteFixtureById(del.dataset.id);
    return;
  }
  // ヘッダ: ソート
  const th = e.target.closest("th[data-sort]");
  if (th) {
    const sortBy = th.dataset.sort;
    if (state.patchSortBy === sortBy) {
      state.patchSortDesc = !state.patchSortDesc;
    } else {
      state.patchSortBy = sortBy;
      state.patchSortDesc = false;
    }
    render();
    return;
  }
  // 行: 機材を選択
  const tr = e.target.closest("tr[data-id]");
  if (tr) {
    selectFixtureById(tr.dataset.id);
  }
});

// 機材管理モーダル
document.getElementById("btn-library").addEventListener("click", () => {
  openCustomLibraryModal(state.customLibrary, FIXTURE_LIBRARY, state.project.fixtures, (newItems) => {
    state.customLibrary = newItems;
    renderPalette();
    render();
  });
});

// 機材スペックリストモーダル
document.getElementById("btn-fixtures-list").addEventListener("click", () => {
  openFixturesListModal(state.customLibrary, FIXTURE_LIBRARY);
});

// 自動保存の読み込み
const saved = loadAutosave();
if (saved) {
  try {
    state.project = deserialize(saved);
  } catch (err) {
    console.error("Autosave load failed:", err);
  }
}

// カスタムライブラリの読み込み
state.customLibrary = loadCustomLibrary();

// 左右パネルの表示トグル制御
const btnTogglePalette = document.getElementById("btn-toggle-palette");
const btnToggleProperties = document.getElementById("btn-toggle-properties");
const mainArea = document.getElementById("main");

function setPaletteVisible(visible) {
  if (visible) {
    mainArea.classList.remove("hide-palette");
    btnTogglePalette.classList.add("active");
  } else {
    mainArea.classList.add("hide-palette");
    btnTogglePalette.classList.remove("active");
  }
}

function setPropertiesVisible(visible) {
  if (visible) {
    mainArea.classList.remove("hide-properties");
    btnToggleProperties.classList.add("active");
  } else {
    mainArea.classList.add("hide-properties");
    btnToggleProperties.classList.remove("active");
  }
}

btnTogglePalette.addEventListener("click", () => {
  const isHidden = mainArea.classList.contains("hide-palette");
  setPaletteVisible(isHidden);
});

btnToggleProperties.addEventListener("click", () => {
  const isHidden = mainArea.classList.contains("hide-properties");
  setPropertiesVisible(isHidden);
});

// ウィンドウ幅が極端に狭い場合（モバイル・タブレットなど仮想幅が 768px 未満の場合）のみ、初期状態で自動的にサイドバーを折りたたむ
if (window.innerWidth < 768) {
  setPaletteVisible(false);
  setPropertiesVisible(false);
}

// 初期描画
renderPalette();
render();
