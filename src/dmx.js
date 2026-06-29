import { FIXTURE_LIBRARY, getFullLibrary } from "./fixtures.js";

const SVGNS = "http://www.w3.org/2000/svg";

/**
 * DMXアドレスのパース
 * @param {string|number} dmxStr 
 * @param {string} [customUniverse]
 * @returns {{universe: string, address: number|null}}
 */
export function parseDmx(dmxStr, customUniverse) {
  const customUni = customUniverse !== undefined && customUniverse !== null ? String(customUniverse).trim() : "";

  if (dmxStr === null || dmxStr === undefined) {
    return { universe: customUni || "未割当", address: null };
  }
  const str = String(dmxStr).trim();
  if (str === "") {
    return { universe: customUni || "未割当", address: null };
  }

  // "1/001", "A-120", "U2_50", "B 005" のような形式をパース
  const match = str.match(/^([a-zA-Z0-9]+)[\/\-_\s]([0-9]+)$/);
  if (match) {
    return { universe: customUni || match[1], address: parseInt(match[2], 10) };
  }

  // 数値のみ
  const addr = parseInt(str, 10);
  if (!isNaN(addr)) {
    return { universe: customUni || "1", address: addr };
  }

  // その他パースできないもの
  return { universe: customUni || "その他", address: null };
}

/**
 * fixturesからDMXツリーを構築
 * @param {Array} fixtures 
 * @returns {Object}
 */
export function buildDmxTree(fixtures) {
  const tree = {};

  // DMX系統の対象（Lightingカテゴリ、またはdmxアドレスに入力があるもの、またはuniverseに入力があるもの）
  const targets = fixtures.filter(f => f.category === "lighting" || (f.dmx && String(f.dmx).trim() !== "") || (f.universe && String(f.universe).trim() !== ""));

  for (const f of targets) {
    const { universe } = parseDmx(f.dmx, f.universe);

    // 調光器（dimmer）または回路（circuit）を決定
    let groupName = "直/直結";
    if (f.dimmer && String(f.dimmer).trim() !== "") {
      groupName = `Dim: ${f.dimmer.trim()}`;
    } else if (f.circuit && String(f.circuit).trim() !== "") {
      groupName = `Circ: ${f.circuit.trim()}`;
    }

    if (!tree[universe]) {
      tree[universe] = {};
    }
    if (!tree[universe][groupName]) {
      tree[universe][groupName] = [];
    }
    tree[universe][groupName].push(f);
  }

  return tree;
}

/**
 * 系統図ノードの座標・階層リンク計算
 * @param {Object} tree 
 * @returns {{nodes: Array, links: Array, height: number}}
 */
export function layoutDmxTree(tree) {
  const xConsole = 80;
  const xUniverse = 240;
  const xDimmer = 440;
  const xFixture = 660;

  const nodes = [];
  const links = [];

  let currentY = 50;
  const ySpacing = 55; // 縦の間隔を広げ視認性を確保

  const universeKeys = Object.keys(tree).sort((a, b) => a.localeCompare(b, "ja"));
  const universeNodes = [];

  for (const uKey of universeKeys) {
    const dimmerNodes = [];
    const dimmerGroups = tree[uKey];
    const dimmerKeys = Object.keys(dimmerGroups).sort((a, b) => a.localeCompare(b, "ja"));

    for (const dKey of dimmerKeys) {
      const fixtures = dimmerGroups[dKey];
      // 灯体はCh番号（0は末尾）でソート
      fixtures.sort((a, b) => {
        const chKey = ch => ch > 0 ? ch : Number.MAX_SAFE_INTEGER;
        return chKey(a.ch) - chKey(b.ch);
      });

      const fixtureNodes = [];
      for (const f of fixtures) {
        const fNode = {
          id: f.id,
          type: "fixture",
          label: f.ch ? `Ch ${f.ch} (${f.type})` : f.type,
          fixture: f,
          x: xFixture,
          y: currentY
        };
        nodes.push(fNode);
        fixtureNodes.push(fNode);
        currentY += ySpacing;
      }

      // 調光器のYはそれに属する灯体の平均値
      const dimmerY = fixtureNodes.reduce((sum, n) => sum + n.y, 0) / fixtureNodes.length;
      const dNode = {
        id: `dimmer-${uKey}-${dKey}`,
        type: "dimmer",
        label: dKey,
        x: xDimmer,
        y: dimmerY
      };
      nodes.push(dNode);
      dimmerNodes.push(dNode);

      // 調光器 -> 灯体へのリンク
      for (const fn of fixtureNodes) {
        links.push({ from: dNode.id, to: fn.id, type: "dimmer-fixture" });
      }
    }

    // ユニバースのYはそれに属する調光器の平均値
    const universeY = dimmerNodes.reduce((sum, n) => sum + n.y, 0) / dimmerNodes.length;
    const uNode = {
      id: `universe-${uKey}`,
      type: "universe",
      label: `Uni ${uKey}`,
      x: xUniverse,
      y: universeY
    };
    nodes.push(uNode);
    universeNodes.push(uNode);

    // ユニバース -> 調光器へのリンク
    for (const dn of dimmerNodes) {
      links.push({ from: uNode.id, to: dn.id, type: "universe-dimmer" });
    }
  }

  // 卓のYはすべてのユニバースの平均値
  let consoleY = 300;
  if (universeNodes.length > 0) {
    consoleY = universeNodes.reduce((sum, n) => sum + n.y, 0) / universeNodes.length;
  }

  const cNode = {
    id: "console",
    type: "console",
    label: "DMX Console",
    x: xConsole,
    y: consoleY
  };
  nodes.push(cNode);

  // 卓 -> ユニバースへのリンク
  for (const un of universeNodes) {
    links.push({ from: cNode.id, to: un.id, type: "console-universe" });
  }

  return { nodes, links, height: Math.max(600, currentY) };
}

/**
 * DMX系統図をSVGキャンバスに描画
 * @param {SVGElement} parent 
 * @param {Array} fixtures 
 * @param {string|null} selectedId 
 */
export function renderDmxDiagram(parent, fixtures, selectedId, library = FIXTURE_LIBRARY) {
  parent.innerHTML = "";

  const tree = buildDmxTree(fixtures);
  const { nodes, links, height } = layoutDmxTree(tree);

  parent.setAttribute("height", String(height));
  parent.setAttribute("width", "820");

  // SVGフィルター（影効果）の設定
  const defs = document.createElementNS(SVGNS, "defs");
  const filter = document.createElementNS(SVGNS, "filter");
  filter.setAttribute("id", "node-shadow");
  filter.setAttribute("x", "-20%"); filter.setAttribute("y", "-20%");
  filter.setAttribute("width", "140%"); filter.setAttribute("height", "140%");
  const shadow = document.createElementNS(SVGNS, "feDropShadow");
  shadow.setAttribute("dx", "0"); shadow.setAttribute("dy", "1");
  shadow.setAttribute("stdDeviation", "2");
  shadow.setAttribute("flood-opacity", "0.08");
  filter.appendChild(shadow);
  defs.appendChild(filter);
  parent.appendChild(defs);

  // 選択された灯体に関連するアクティブパスの検出
  const activeNodes = new Set();
  const activeLinks = new Set();

  if (selectedId) {
    const selNode = nodes.find(n => n.id === selectedId);
    if (selNode && selNode.type === "fixture") {
      activeNodes.add(selectedId);
      
      // 灯体 -> 調光器
      const dfLink = links.find(l => l.to === selectedId && l.type === "dimmer-fixture");
      if (dfLink) {
        activeLinks.add(dfLink);
        activeNodes.add(dfLink.from);

        // 調光器 -> ユニバース
        const udLink = links.find(l => l.to === dfLink.from && l.type === "universe-dimmer");
        if (udLink) {
          activeLinks.add(udLink);
          activeNodes.add(udLink.from);

          // ユニバース -> 卓
          const cuLink = links.find(l => l.to === udLink.from && l.type === "console-universe");
          if (cuLink) {
            activeLinks.add(cuLink);
            activeNodes.add(cuLink.from);
          }
        }
      }
    }
  }

  // 1. 接続線（三次ベジェ曲線）の描画
  for (const l of links) {
    const fromNode = nodes.find(n => n.id === l.from);
    const toNode = nodes.find(n => n.id === l.to);
    if (!fromNode || !toNode) continue;

    const path = document.createElementNS(SVGNS, "path");
    const isActive = activeLinks.has(l);

    const x1 = fromNode.x; const y1 = fromNode.y;
    const x2 = toNode.x; const y2 = toNode.y;
    const dx = x2 - x1;
    const cx1 = x1 + dx * 0.45; const cy1 = y1;
    const cx2 = x2 - dx * 0.45; const cy2 = y2;

    path.setAttribute("d", `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", isActive ? "#2563eb" : "#cbd5e1");
    path.setAttribute("stroke-width", isActive ? "3" : "1.5");
    parent.appendChild(path);
  }

  // 2. 各ノードの描画
  for (const n of nodes) {
    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("transform", `translate(${n.x},${n.y})`);
    
    const isActive = activeNodes.has(n.id);

    if (n.type === "console") {
      // 卓ノード
      const rect = document.createElementNS(SVGNS, "rect");
      rect.setAttribute("x", "-55"); rect.setAttribute("y", "-18");
      rect.setAttribute("width", "110"); rect.setAttribute("height", "36");
      rect.setAttribute("rx", "6");
      rect.setAttribute("fill", "#1e293b");
      rect.setAttribute("stroke", isActive ? "#3b82f6" : "#475569");
      rect.setAttribute("stroke-width", isActive ? "2.5" : "1.5");
      rect.setAttribute("filter", "url(#node-shadow)");
      g.appendChild(rect);

      const txt = document.createElementNS(SVGNS, "text");
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("dy", "4.5");
      txt.setAttribute("fill", "#ffffff");
      txt.setAttribute("font-size", "10");
      txt.setAttribute("font-weight", "bold");
      txt.textContent = n.label;
      g.appendChild(txt);

    } else if (n.type === "universe") {
      // ユニバースノード（青丸）
      const circle = document.createElementNS(SVGNS, "circle");
      circle.setAttribute("r", "20");
      circle.setAttribute("fill", "#2563eb");
      circle.setAttribute("stroke", isActive ? "#3b82f6" : "#60a5fa");
      circle.setAttribute("stroke-width", isActive ? "3" : "1.5");
      circle.setAttribute("filter", "url(#node-shadow)");
      g.appendChild(circle);

      const txt = document.createElementNS(SVGNS, "text");
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("dy", "3.5");
      txt.setAttribute("fill", "#ffffff");
      txt.setAttribute("font-size", "10");
      txt.setAttribute("font-weight", "bold");
      txt.textContent = n.label;
      g.appendChild(txt);

    } else if (n.type === "dimmer") {
      // 調光器/回路ノード
      const rect = document.createElementNS(SVGNS, "rect");
      rect.setAttribute("x", "-55"); rect.setAttribute("y", "-14");
      rect.setAttribute("width", "110"); rect.setAttribute("height", "28");
      rect.setAttribute("rx", "4");

      const isDimmer = n.label.startsWith("Dim:");
      rect.setAttribute("fill", isDimmer ? "#d97706" : "#475569");
      rect.setAttribute("stroke", isActive ? "#ef4444" : (isDimmer ? "#b45309" : "#334155"));
      rect.setAttribute("stroke-width", isActive ? "2.5" : "1");
      rect.setAttribute("filter", "url(#node-shadow)");
      g.appendChild(rect);

      const txt = document.createElementNS(SVGNS, "text");
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("dy", "3.5");
      txt.setAttribute("fill", "#ffffff");
      txt.setAttribute("font-size", "10");
      txt.setAttribute("font-weight", "600");
      txt.textContent = n.label;
      g.appendChild(txt);

    } else if (n.type === "fixture") {
      // 灯体ノード（クリック可能、Ch番号＋機材名、右端にアドレス）
      g.dataset.id = n.id;
      g.style.cursor = "pointer";

      const isSelected = n.id === selectedId;
      const rect = document.createElementNS(SVGNS, "rect");
      rect.setAttribute("x", "-80"); rect.setAttribute("y", "-15");
      rect.setAttribute("width", "160"); rect.setAttribute("height", "30");
      rect.setAttribute("rx", "4");
      rect.setAttribute("fill", isSelected ? "#eff6ff" : "#ffffff");
      rect.setAttribute("stroke", isSelected ? "#2563eb" : "#cbd5e1");
      rect.setAttribute("stroke-width", isSelected ? "2.5" : "1");
      rect.setAttribute("filter", "url(#node-shadow)");
      g.appendChild(rect);

      // 小さな丸カテゴリカラー
      const circle = document.createElementNS(SVGNS, "circle");
      circle.setAttribute("cx", "-68"); circle.setAttribute("cy", "0");
      circle.setAttribute("r", "5");
      const libItem = library.find(l => l.type === n.fixture.type);
      circle.setAttribute("fill", libItem ? libItem.color : "#475569");
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "1");
      g.appendChild(circle);

      // 灯体Ch + 機材名テキスト
      const txt = document.createElementNS(SVGNS, "text");
      txt.setAttribute("x", "-55"); txt.setAttribute("dy", "3.5");
      txt.setAttribute("fill", "#1e293b");
      txt.setAttribute("font-size", "10");
      txt.setAttribute("font-weight", isSelected ? "bold" : "normal");
      txt.textContent = n.label;
      g.appendChild(txt);

      // 右端のDMXアドレス
      const extraTxt = document.createElementNS(SVGNS, "text");
      extraTxt.setAttribute("x", "72");
      extraTxt.setAttribute("text-anchor", "end");
      extraTxt.setAttribute("dy", "3.5");
      extraTxt.setAttribute("fill", "#64748b");
      extraTxt.setAttribute("font-size", "8.5");
      extraTxt.setAttribute("font-weight", "500");

      let dmxDisplay = "";
      if (n.fixture.dmx) {
        const hasSeparator = String(n.fixture.dmx).trim().match(/^([a-zA-Z0-9]+)[\/\-_\s]([0-9]+)$/);
        if (n.fixture.universe && !hasSeparator) {
          dmxDisplay = `@${n.fixture.universe}/${n.fixture.dmx}`;
        } else {
          dmxDisplay = `@${n.fixture.dmx}`;
        }
      } else if (n.fixture.universe) {
        dmxDisplay = `@${n.fixture.universe}/-`;
      }
      extraTxt.textContent = dmxDisplay;
      g.appendChild(extraTxt);
    }

    parent.appendChild(g);
  }
}
