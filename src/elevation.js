const SVGNS = "http://www.w3.org/2000/svg";

/**
 * 立面図用の機材形状を描画する
 * hw = 半幅(SVG), hh = 半高(SVG)
 */
function renderElevationShape(g, shape, hw, hh, fill, stroke, sw, color, viewType, fixture = null) {
  const SVGNS_L = "http://www.w3.org/2000/svg";
  const el = (tag) => document.createElementNS(SVGNS_L, tag);

  // --- 舞台カテゴリ ---
  if (shape === "truss") {
    // トラス: 格子模様の矩形
    const rect = el("rect");
    rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
    rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
    rect.setAttribute("fill", "none"); rect.setAttribute("stroke", color); rect.setAttribute("stroke-width", sw);
    g.appendChild(rect);
    const d = `M ${-hw} ${-hh} L ${hw} ${hh} M ${-hw} ${hh} L ${hw} ${-hh}`;
    const path = el("path");
    path.setAttribute("d", d); path.setAttribute("stroke", color); path.setAttribute("stroke-width", "0.6");
    g.appendChild(path);

  } else if (shape === "rect_bordered" || shape === "hanamichi") {
    // ステージ / 花道: 塗り矩形
    const rect = el("rect");
    rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
    rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
    rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
    g.appendChild(rect);

  } else if (shape === "baton") {
    // バトン: 細い矩形
    const rect = el("rect");
    rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
    rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
    rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", "0.8");
    g.appendChild(rect);

  } else if (shape === "curtain") {
    // 幕: 正面=波型上端の矩形、側面=薄い矩形
    const rect = el("rect");
    rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
    rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
    rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
    g.appendChild(rect);
    if (viewType === "front") {
      const wave = el("path");
      const n = Math.max(3, Math.round(hw / 4));
      let d = `M ${-hw} ${-hh}`;
      for (let i = 0; i < n; i++) {
        const x1 = -hw + (i + 0.5) * (hw * 2 / n);
        const x2 = -hw + (i + 1) * (hw * 2 / n);
        d += ` Q ${x1} ${-hh - 4} ${x2} ${-hh}`;
      }
      wave.setAttribute("d", d); wave.setAttribute("fill", "none");
      wave.setAttribute("stroke", stroke); wave.setAttribute("stroke-width", "0.8");
      g.appendChild(wave);
    }

  } else if (shape === "backdrop") {
    // 背景幕: 矩形 + 上部の吊りバー
    const rect = el("rect");
    rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
    rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
    rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
    g.appendChild(rect);
    const bar = el("line");
    bar.setAttribute("x1", String(-hw)); bar.setAttribute("y1", String(-hh));
    bar.setAttribute("x2", String(hw)); bar.setAttribute("y2", String(-hh));
    bar.setAttribute("stroke", "#333"); bar.setAttribute("stroke-width", "2");
    g.appendChild(bar);

  } else if (shape === "riser") {
    // 所作台: 矩形 + 段の破線
    const rect = el("rect");
    rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
    rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
    rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
    g.appendChild(rect);

  } else if (shape === "stairs") {
    // 階段: 正面=矩形、側面=階段形
    if (viewType === "side") {
      const path = el("path");
      const steps = 3;
      const sw2 = hw * 2 / steps;
      const sh = hh * 2 / steps;
      let d = `M ${-hw} ${hh}`;
      for (let i = 0; i < steps; i++) {
        d += ` L ${-hw + i * sw2} ${hh - (i + 1) * sh} L ${-hw + (i + 1) * sw2} ${hh - (i + 1) * sh}`;
      }
      d += ` L ${hw} ${hh} Z`;
      path.setAttribute("d", d); path.setAttribute("fill", color); path.setAttribute("stroke", stroke); path.setAttribute("stroke-width", sw);
      g.appendChild(path);
    } else {
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);
    }

  } else if (shape === "podium") {
    // 演台: 正面=台形、側面=矩形
    if (viewType === "front") {
      const path = el("path");
      const top = hw * 0.6;
      path.setAttribute("d", `M ${-top} ${-hh} L ${top} ${-hh} L ${hw} ${hh} L ${-hw} ${hh} Z`);
      path.setAttribute("fill", color); path.setAttribute("stroke", stroke); path.setAttribute("stroke-width", sw);
      g.appendChild(path);
    } else {
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);
    }

  } else if (shape === "table") {
    // テーブル: 天板 + 脚
    const top = el("rect");
    top.setAttribute("x", String(-hw)); top.setAttribute("y", String(-hh));
    top.setAttribute("width", String(hw * 2)); top.setAttribute("height", String(hh * 0.3));
    top.setAttribute("fill", color); top.setAttribute("stroke", stroke); top.setAttribute("stroke-width", sw);
    g.appendChild(top);
    for (const lx of [-hw + 1, hw - 1]) {
      const leg = el("line");
      leg.setAttribute("x1", String(lx)); leg.setAttribute("y1", String(-hh + hh * 0.3));
      leg.setAttribute("x2", String(lx)); leg.setAttribute("y2", String(hh));
      leg.setAttribute("stroke", color); leg.setAttribute("stroke-width", "1.2");
      g.appendChild(leg);
    }

  } else if (shape === "chair") {
    // 椅子: 正面=背もたれ+座面+脚、側面=L字型
    if (viewType === "side") {
      const path = el("path");
      path.setAttribute("d", `M ${-hw} ${-hh} L ${-hw} ${hh * 0.2} L ${hw} ${hh * 0.2} L ${hw} ${hh} M ${-hw} ${hh * 0.2} L ${-hw} ${hh}`);
      path.setAttribute("fill", "none"); path.setAttribute("stroke", color); path.setAttribute("stroke-width", "1.5");
      g.appendChild(path);
      const seat = el("rect");
      seat.setAttribute("x", String(-hw)); seat.setAttribute("y", String(hh * 0.05));
      seat.setAttribute("width", String(hw * 2)); seat.setAttribute("height", String(hh * 0.25));
      seat.setAttribute("fill", color); seat.setAttribute("stroke", stroke); seat.setAttribute("stroke-width", "0.8");
      g.appendChild(seat);
    } else {
      const back = el("rect");
      back.setAttribute("x", String(-hw)); back.setAttribute("y", String(-hh));
      back.setAttribute("width", String(hw * 2)); back.setAttribute("height", String(hh * 0.5));
      back.setAttribute("fill", color); back.setAttribute("stroke", stroke); back.setAttribute("stroke-width", sw);
      g.appendChild(back);
      const seat = el("rect");
      seat.setAttribute("x", String(-hw)); seat.setAttribute("y", String(hh * 0.05));
      seat.setAttribute("width", String(hw * 2)); seat.setAttribute("height", String(hh * 0.25));
      seat.setAttribute("fill", color); seat.setAttribute("stroke", stroke); seat.setAttribute("stroke-width", "0.8");
      g.appendChild(seat);
      for (const lx of [-hw + 1, hw - 1]) {
        const leg = el("line");
        leg.setAttribute("x1", String(lx)); leg.setAttribute("y1", String(hh * 0.3));
        leg.setAttribute("x2", String(lx)); leg.setAttribute("y2", String(hh));
        leg.setAttribute("stroke", color); leg.setAttribute("stroke-width", "1");
        g.appendChild(leg);
      }
    }

  } else if (shape === "mic_stand") {
    // マイクスタンド: ポール + ヘッド + ベース
    const pole = el("line");
    pole.setAttribute("x1", "0"); pole.setAttribute("y1", String(hh));
    pole.setAttribute("x2", "0"); pole.setAttribute("y2", String(-hh + 3));
    pole.setAttribute("stroke", color); pole.setAttribute("stroke-width", "1.2");
    g.appendChild(pole);
    const head = el("circle");
    head.setAttribute("cx", "0"); head.setAttribute("cy", String(-hh + 1));
    head.setAttribute("r", "2.5");
    head.setAttribute("fill", color); head.setAttribute("stroke", stroke); head.setAttribute("stroke-width", "0.8");
    g.appendChild(head);
    const base = el("line");
    base.setAttribute("x1", String(-hw * 0.6)); base.setAttribute("y1", String(hh));
    base.setAttribute("x2", String(hw * 0.6)); base.setAttribute("y2", String(hh));
    base.setAttribute("stroke", color); base.setAttribute("stroke-width", "1.5");
    g.appendChild(base);

  } else if (shape === "music_stand") {
    // 譜面台: ポール + 譜面板
    const pole = el("line");
    pole.setAttribute("x1", "0"); pole.setAttribute("y1", String(hh));
    pole.setAttribute("x2", "0"); pole.setAttribute("y2", String(-hh * 0.3));
    pole.setAttribute("stroke", color); pole.setAttribute("stroke-width", "1");
    g.appendChild(pole);
    const board = el("rect");
    board.setAttribute("x", String(-hw * 0.7)); board.setAttribute("y", String(-hh));
    board.setAttribute("width", String(hw * 1.4)); board.setAttribute("height", String(hh * 0.7));
    board.setAttribute("fill", color); board.setAttribute("stroke", stroke); board.setAttribute("stroke-width", "0.8");
    g.appendChild(board);
    const base = el("path");
    base.setAttribute("d", `M 0 ${hh} L ${-hw * 0.5} ${hh} M 0 ${hh} L ${hw * 0.5} ${hh}`);
    base.setAttribute("stroke", color); base.setAttribute("stroke-width", "1");
    g.appendChild(base);

  } else if (shape === "torii") {
    // 鳥居: 正面=鳥居形、側面=柱2本
    if (viewType === "front") {
      const path = el("path");
      const pw = hw * 0.8;
      path.setAttribute("d",
        `M ${-pw} ${hh} L ${-pw} ${-hh + 4} M ${pw} ${hh} L ${pw} ${-hh + 4}` +
        ` M ${-hw} ${-hh + 4} L ${hw} ${-hh + 4}` +
        ` M ${-hw} ${-hh} L ${hw} ${-hh}` +
        ` M ${-pw} ${-hh * 0.2} L ${pw} ${-hh * 0.2}`
      );
      path.setAttribute("fill", "none"); path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", "1.8"); path.setAttribute("stroke-linecap", "round");
      g.appendChild(path);
    } else {
      for (const lx of [-hw * 0.3, hw * 0.3]) {
        const pillar = el("line");
        pillar.setAttribute("x1", String(lx)); pillar.setAttribute("y1", String(hh));
        pillar.setAttribute("x2", String(lx)); pillar.setAttribute("y2", String(-hh));
        pillar.setAttribute("stroke", color); pillar.setAttribute("stroke-width", "2");
        g.appendChild(pillar);
      }
    }

  } else if (shape === "drum_set") {
    // ドラムセット: 正面=キック+シンバル+タム、側面=キック横+スネア
    if (viewType === "front") {
      // キック (中央下)
      const kick = el("ellipse");
      kick.setAttribute("cx", "0"); kick.setAttribute("cy", String(hh * 0.3));
      kick.setAttribute("rx", String(hw * 0.5)); kick.setAttribute("ry", String(hh * 0.55));
      kick.setAttribute("fill", color); kick.setAttribute("stroke", stroke); kick.setAttribute("stroke-width", sw);
      g.appendChild(kick);
      // スネア (左下)
      const snare = el("ellipse");
      snare.setAttribute("cx", String(-hw * 0.55)); snare.setAttribute("cy", String(hh * 0.3));
      snare.setAttribute("rx", String(hw * 0.3)); snare.setAttribute("ry", String(hh * 0.15));
      snare.setAttribute("fill", "#7a7a9a"); snare.setAttribute("stroke", stroke); snare.setAttribute("stroke-width", "0.8");
      g.appendChild(snare);
      // タム (上)
      for (const cx of [-hw * 0.2, hw * 0.2]) {
        const tom = el("ellipse");
        tom.setAttribute("cx", String(cx)); tom.setAttribute("cy", String(-hh * 0.3));
        tom.setAttribute("rx", String(hw * 0.2)); tom.setAttribute("ry", String(hh * 0.1));
        tom.setAttribute("fill", "#5a5a7a"); tom.setAttribute("stroke", stroke); tom.setAttribute("stroke-width", "0.6");
        g.appendChild(tom);
      }
      // シンバル
      const cym = el("line");
      cym.setAttribute("x1", String(hw * 0.5)); cym.setAttribute("y1", String(-hh * 0.7));
      cym.setAttribute("x2", String(hw * 0.9)); cym.setAttribute("y2", String(-hh * 0.6));
      cym.setAttribute("stroke", "#aaa"); cym.setAttribute("stroke-width", "1.5");
      g.appendChild(cym);
    } else {
      // 側面: キック円 + スネア
      const kick = el("circle");
      kick.setAttribute("cx", "0"); kick.setAttribute("cy", String(hh * 0.3));
      kick.setAttribute("r", String(Math.min(hw, hh) * 0.55));
      kick.setAttribute("fill", color); kick.setAttribute("stroke", stroke); kick.setAttribute("stroke-width", sw);
      g.appendChild(kick);
      const snare = el("rect");
      snare.setAttribute("x", String(-hw * 0.6)); snare.setAttribute("y", String(hh * 0.1));
      snare.setAttribute("width", String(hw * 0.35)); snare.setAttribute("height", String(hh * 0.25));
      snare.setAttribute("fill", "#7a7a9a"); snare.setAttribute("stroke", stroke); snare.setAttribute("stroke-width", "0.6");
      g.appendChild(snare);
    }

  } else if (shape === "person") {
    // 人: 正面=頭+胴体+脚、側面=横向きシルエット
    const headR = Math.min(hw, hh) * 0.18;
    const headY = -hh + headR + 1;
    const head = el("circle");
    head.setAttribute("cx", "0"); head.setAttribute("cy", String(headY));
    head.setAttribute("r", String(headR));
    head.setAttribute("fill", color); head.setAttribute("stroke", stroke); head.setAttribute("stroke-width", "0.8");
    g.appendChild(head);
    // 胴体
    const bodyTop = headY + headR + 1;
    const bodyBot = hh * 0.15;
    const body = el("rect");
    body.setAttribute("x", String(-hw * 0.35)); body.setAttribute("y", String(bodyTop));
    body.setAttribute("width", String(hw * 0.7)); body.setAttribute("height", String(bodyBot - bodyTop));
    body.setAttribute("rx", "2");
    body.setAttribute("fill", "#c06040"); body.setAttribute("stroke", stroke); body.setAttribute("stroke-width", "0.6");
    g.appendChild(body);
    // 脚
    const legs = el("path");
    legs.setAttribute("d", `M ${-hw * 0.2} ${bodyBot} L ${-hw * 0.25} ${hh} M ${hw * 0.2} ${bodyBot} L ${hw * 0.25} ${hh}`);
    legs.setAttribute("stroke", color); legs.setAttribute("stroke-width", "1.5");
    g.appendChild(legs);
    if (viewType === "front") {
      // 腕
      const arms = el("path");
      arms.setAttribute("d", `M ${-hw * 0.35} ${bodyTop + 2} L ${-hw * 0.6} ${bodyBot - 2} M ${hw * 0.35} ${bodyTop + 2} L ${hw * 0.6} ${bodyBot - 2}`);
      arms.setAttribute("stroke", color); arms.setAttribute("stroke-width", "1.2");
      g.appendChild(arms);
    }

  } else if (shape === "slim_par") {
    // スリムPARの正面・側面立面図描画
    // hw, hh は実寸をスケール変換した半幅・半高
    const rect = el("rect");
    rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
    rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
    rect.setAttribute("rx", "3"); rect.setAttribute("ry", "3");
    rect.setAttribute("fill", fill);
    rect.setAttribute("stroke", stroke);
    rect.setAttribute("stroke-width", sw);
    g.appendChild(rect);

    if (viewType === "front") {
      // 正面図：左右のアーム（ブラケット）と調整ノブ
      const bracket = el("path");
      bracket.setAttribute("d", `M ${-hw - 2} ${-hh * 0.2} L ${-hw - 2} ${hh + 3} L ${hw + 2} ${hh + 3} L ${hw + 2} ${-hh * 0.2}`);
      bracket.setAttribute("fill", "none");
      bracket.setAttribute("stroke", stroke);
      bracket.setAttribute("stroke-width", "1.2");
      g.appendChild(bracket);

      // 調整つまみ（ノブ）
      const knobL = el("line");
      knobL.setAttribute("x1", String(-hw - 4)); knobL.setAttribute("y1", "0");
      knobL.setAttribute("x2", String(-hw)); knobL.setAttribute("y2", "0");
      knobL.setAttribute("stroke", stroke); knobL.setAttribute("stroke-width", "2");
      g.appendChild(knobL);

      const knobR = el("line");
      knobR.setAttribute("x1", String(hw)); knobR.setAttribute("y1", "0");
      knobR.setAttribute("x2", String(hw + 4)); knobR.setAttribute("y2", "0");
      knobR.setAttribute("stroke", stroke); knobR.setAttribute("stroke-width", "2");
      g.appendChild(knobR);

      // 内側のLED素子（12個）を象徴する丸
      const r_led = Math.min(hw, hh) * 0.18;
      const ledCoords = [
        {x: -hw*0.5, y: -hh*0.5}, {x: 0, y: -hh*0.6}, {x: hw*0.5, y: -hh*0.5},
        {x: -hw*0.6, y: 0}, {x: -hw*0.2, y: -hh*0.1}, {x: hw*0.2, y: -hh*0.1}, {x: hw*0.6, y: 0},
        {x: -hw*0.5, y: hh*0.5}, {x: 0, y: hh*0.4}, {x: hw*0.5, y: hh*0.5}
      ];
      for (const pt of ledCoords) {
        const led = el("circle");
        led.setAttribute("cx", String(pt.x)); led.setAttribute("cy", String(pt.y));
        led.setAttribute("r", String(r_led));
        led.setAttribute("fill", "#ffffff");
        led.setAttribute("opacity", "0.85");
        g.appendChild(led);
      }
    } else {
      // 側面図：斜めに支えるWアーム（ブラケット）
      const bracket = el("path");
      bracket.setAttribute("d", `M 0 0 L ${-hw - 4} ${hh + 4} L ${hw + 4} ${hh + 4} L 0 0`);
      bracket.setAttribute("fill", "none");
      bracket.setAttribute("stroke", stroke);
      bracket.setAttribute("stroke-width", "1.2");
      g.appendChild(bracket);

      // 側面でのノブ
      const knob = el("circle");
      knob.setAttribute("cx", "0"); knob.setAttribute("cy", "0");
      knob.setAttribute("r", "2.5");
      knob.setAttribute("fill", stroke);
      g.appendChild(knob);
    }

  } else if (shape === "moving_wash_1915") {
    // Moving Wash 1915 の正面・側面立面図描画
    if (viewType === "front") {
      // 正面図
      // ベース（土台）
      const base = el("rect");
      base.setAttribute("x", String(-hw));
      base.setAttribute("y", String(hh * 0.5));
      base.setAttribute("width", String(hw * 2));
      base.setAttribute("height", String(hh * 0.5));
      base.setAttribute("rx", "3");
      base.setAttribute("fill", "#2b2d42");
      base.setAttribute("stroke", stroke);
      base.setAttribute("stroke-width", sw);
      g.appendChild(base);

      // ヨーク（U字アーム）
      const yoke = el("path");
      yoke.setAttribute("d", `M ${-hw * 0.75} ${hh * 0.5} L ${-hw * 0.75} 0 A ${hw * 0.75} ${hh * 0.5} 0 0 0 ${hw * 0.75} 0 L ${hw * 0.75} ${hh * 0.5}`);
      yoke.setAttribute("fill", "none");
      yoke.setAttribute("stroke", stroke);
      yoke.setAttribute("stroke-width", String(Math.max(1.8, Number(sw))));
      g.appendChild(yoke);

      // ヘッド（本体）
      const head = el("circle");
      head.setAttribute("cx", "0");
      head.setAttribute("cy", "0");
      head.setAttribute("r", String(Math.min(hw, hh) * 0.65));
      head.setAttribute("fill", fill);
      head.setAttribute("stroke", stroke);
      head.setAttribute("stroke-width", sw);
      g.appendChild(head);

      // LEDレンズ（同心円）
      const lens = el("circle");
      lens.setAttribute("cx", "0");
      lens.setAttribute("cy", "0");
      lens.setAttribute("r", String(Math.min(hw, hh) * 0.5));
      lens.setAttribute("fill", "none");
      lens.setAttribute("stroke", stroke);
      lens.setAttribute("stroke-width", "0.8");
      g.appendChild(lens);
      
      const lensInner = el("circle");
      lensInner.setAttribute("cx", "0");
      lensInner.setAttribute("cy", "0");
      lensInner.setAttribute("r", String(Math.min(hw, hh) * 0.28));
      lensInner.setAttribute("fill", "none");
      lensInner.setAttribute("stroke", stroke);
      lensInner.setAttribute("stroke-width", "0.6");
      g.appendChild(lensInner);

    } else {
      // 側面図
      // ベース（土台）
      const base = el("rect");
      base.setAttribute("x", String(-hw * 0.7));
      base.setAttribute("y", String(hh * 0.5));
      base.setAttribute("width", String(hw * 1.4));
      base.setAttribute("height", String(hh * 0.5));
      base.setAttribute("rx", "3");
      base.setAttribute("fill", "#2b2d42");
      base.setAttribute("stroke", stroke);
      base.setAttribute("stroke-width", sw);
      g.appendChild(base);

      // ヨーク（アーム）
      const yoke = el("rect");
      yoke.setAttribute("x", String(-hw * 0.18));
      yoke.setAttribute("y", String(-hh * 0.1));
      yoke.setAttribute("width", String(hw * 0.36));
      yoke.setAttribute("height", String(hh * 0.6));
      yoke.setAttribute("fill", "#2b2d42");
      yoke.setAttribute("stroke", stroke);
      yoke.setAttribute("stroke-width", sw);
      g.appendChild(yoke);

      // ヘッド（側面から見た丸角楕円）
      const head = el("ellipse");
      head.setAttribute("cx", "0");
      head.setAttribute("cy", "0");
      head.setAttribute("rx", String(hw * 0.5));
      head.setAttribute("ry", String(hh * 0.65));
      head.setAttribute("fill", fill);
      head.setAttribute("stroke", stroke);
      head.setAttribute("stroke-width", sw);
      g.appendChild(head);
    }

  } else if (shape === "mini_moving_120") {
    // 120W Mini LED Moving Head (正面・側面立面図描画: 実寸230x160x270mm)
    if (viewType === "front") {
      // 正面図
      // ベース（土台）
      const base = el("rect");
      base.setAttribute("x", String(-hw));
      base.setAttribute("y", String(hh * 0.5));
      base.setAttribute("width", String(hw * 2));
      base.setAttribute("height", String(hh * 0.5));
      base.setAttribute("rx", "3");
      base.setAttribute("fill", "#1e293b"); // ダークグレー
      base.setAttribute("stroke", stroke);
      base.setAttribute("stroke-width", sw);
      g.appendChild(base);

      // ヨーク（U字アーム）
      const yoke = el("path");
      const yW = hw * 0.75;
      const yH = hh * 0.45;
      yoke.setAttribute("d", `M ${-yW} ${hh * 0.5} L ${-yW} 0 A ${yW} ${yH} 0 0 0 ${yW} 0 L ${yW} ${hh * 0.5}`);
      yoke.setAttribute("fill", "none");
      yoke.setAttribute("stroke", stroke);
      yoke.setAttribute("stroke-width", String(Math.max(1.5, Number(sw))));
      g.appendChild(yoke);

      // ヘッド（本体）
      const head = el("circle");
      head.setAttribute("cx", "0");
      head.setAttribute("cy", "0");
      head.setAttribute("r", String(Math.min(hw, hh) * 0.65));
      head.setAttribute("fill", fill);
      head.setAttribute("stroke", stroke);
      head.setAttribute("stroke-width", sw);
      g.appendChild(head);

      // 大型単一レンズ
      const lens = el("circle");
      lens.setAttribute("cx", "0");
      lens.setAttribute("cy", "0");
      lens.setAttribute("r", String(Math.min(hw, hh) * 0.45));
      lens.setAttribute("fill", "#ffffff");
      lens.setAttribute("opacity", "0.9");
      lens.setAttribute("stroke", stroke);
      lens.setAttribute("stroke-width", "0.8");
      g.appendChild(lens);

      const cross = el("path");
      const len = Math.min(hw, hh) * 0.3;
      cross.setAttribute("d", `M ${-len} 0 L ${len} 0 M 0 ${-len} L 0 ${len}`);
      cross.setAttribute("stroke", stroke);
      cross.setAttribute("stroke-width", "0.6");
      g.appendChild(cross);

    } else {
      // 側面図
      // ベース（土台）
      const base = el("rect");
      base.setAttribute("x", String(-hw * 0.7));
      base.setAttribute("y", String(hh * 0.5));
      base.setAttribute("width", String(hw * 1.4));
      base.setAttribute("height", String(hh * 0.5));
      base.setAttribute("rx", "3");
      base.setAttribute("fill", "#1e293b");
      base.setAttribute("stroke", stroke);
      base.setAttribute("stroke-width", sw);
      g.appendChild(base);

      // ヨーク（アーム）
      const yoke = el("rect");
      yoke.setAttribute("x", String(-hw * 0.2));
      yoke.setAttribute("y", String(-hh * 0.1));
      yoke.setAttribute("width", String(hw * 0.4));
      yoke.setAttribute("height", String(hh * 0.6));
      yoke.setAttribute("fill", "#1e293b");
      yoke.setAttribute("stroke", stroke);
      yoke.setAttribute("stroke-width", sw);
      g.appendChild(yoke);

      // ヘッド（側面から見た丸角楕円）
      const head = el("ellipse");
      head.setAttribute("cx", "0");
      head.setAttribute("cy", "0");
      head.setAttribute("rx", String(hw * 0.55));
      head.setAttribute("ry", String(hh * 0.65));
      head.setAttribute("fill", fill);
      head.setAttribute("stroke", stroke);
      head.setAttribute("stroke-width", sw);
      g.appendChild(head);

      // レンズ側面の出っ張り
      const lensNose = el("path");
      lensNose.setAttribute("d", `M ${-hw * 0.45} ${-hh * 0.2} L ${-hw * 0.6} ${-hh * 0.2} L ${-hw * 0.6} ${hh * 0.2} L ${-hw * 0.45} ${hh * 0.2}`);
      lensNose.setAttribute("fill", "#ffffff");
      lensNose.setAttribute("opacity", "0.9");
      lensNose.setAttribute("stroke", stroke);
      lensNose.setAttribute("stroke-width", "0.8");
      g.appendChild(lensNose);
    }

  } else if (shape === "led_strobe_200") {
    // 200W RGBW LED Strobe Light (正面・側面立面図描画: 実寸 400x100x150mm)
    if (viewType === "front") {
      // 正面図：大型の横長ストロボパネル
      // 本体
      const rect = el("rect");
      rect.setAttribute("x", String(-hw));
      rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2));
      rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("rx", "3");
      rect.setAttribute("fill", fill);
      rect.setAttribute("stroke", stroke);
      rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // 左右の頑丈なアングルブラケット（脚）
      const legs = el("path");
      legs.setAttribute("d", `M ${-hw} ${hh * 0.4} L ${-hw - 6} ${hh * 0.4} L ${-hw - 6} ${hh} M ${hw} ${hh * 0.4} L ${hw + 6} ${hh * 0.4} L ${hw + 6} ${hh}`);
      legs.setAttribute("fill", "none");
      legs.setAttribute("stroke", stroke);
      legs.setAttribute("stroke-width", String(Math.max(1.5, Number(sw))));
      g.appendChild(legs);

      // フロント発光面のグリッド格子 (3x6のセグメント表現)
      const rows = 3;
      const cols = 6;
      const cellW = (hw * 2) / cols;
      const cellH = (hh * 2) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const grid = el("rect");
          grid.setAttribute("x", String(-hw + c * cellW + 1.5));
          grid.setAttribute("y", String(-hh + r * cellH + 1.5));
          grid.setAttribute("width", String(cellW - 3));
          grid.setAttribute("height", String(cellH - 3));
          grid.setAttribute("fill", "none");
          grid.setAttribute("stroke", "#ffffff");
          grid.setAttribute("stroke-width", "0.6");
          grid.setAttribute("opacity", "0.85");
          g.appendChild(grid);
        }
      }

    } else {
      // 側面図：厚みD100mm x 高さH150mm の直方体
      // 本体
      const rect = el("rect");
      rect.setAttribute("x", String(-hw));
      rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2));
      rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("fill", fill);
      rect.setAttribute("stroke", stroke);
      rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // 斜めブラケット脚
      const bracket = el("path");
      bracket.setAttribute("d", `M 0 0 L ${-hw - 5} ${hh} L ${hw + 5} ${hh}`);
      bracket.setAttribute("fill", "none");
      bracket.setAttribute("stroke", stroke);
      bracket.setAttribute("stroke-width", String(Math.max(1.2, Number(sw))));
      g.appendChild(bracket);

      const knob = el("circle");
      knob.setAttribute("cx", "0");
      knob.setAttribute("cy", "0");
      knob.setAttribute("r", "3");
      knob.setAttribute("fill", stroke);
      g.appendChild(knob);
    }

  } else if (shape === "cob_zoom_par_300") {
    // 300W COB Zoom Par (正面・側面立面図描画: 実寸 280x300x380mm)
    // 高さはアームを含めて380、本体部分は約280x280mm
    if (viewType === "front") {
      // 正面図：丸型のパーライト発光面と、アームスタンド脚
      // アームブラケット（ダブルアームスタンド）
      const arm = el("path");
      arm.setAttribute("d", `M ${-hw - 4} 0 L ${-hw - 4} ${hh} L ${hw + 4} ${hh} L ${hw + 4} 0`);
      arm.setAttribute("fill", "none");
      arm.setAttribute("stroke", stroke);
      arm.setAttribute("stroke-width", String(Math.max(1.5, Number(sw))));
      g.appendChild(arm);

      // アーム調整ノブ（左右）
      const knobL = el("circle");
      knobL.setAttribute("cx", String(-hw - 4)); knobL.setAttribute("cy", "0");
      knobL.setAttribute("r", "5"); knobL.setAttribute("fill", stroke);
      g.appendChild(knobL);
      const knobR = el("circle");
      knobR.setAttribute("cx", String(hw + 4)); knobR.setAttribute("cy", "0");
      knobR.setAttribute("r", "5"); knobR.setAttribute("fill", stroke);
      g.appendChild(knobR);

      // 本体筒体（角丸四角形）
      const body = el("rect");
      const bodyH = hh * 1.5;
      body.setAttribute("x", String(-hw));
      body.setAttribute("y", String(-bodyH / 2));
      body.setAttribute("width", String(hw * 2));
      body.setAttribute("height", String(bodyH));
      body.setAttribute("rx", "12");
      body.setAttribute("fill", fill);
      body.setAttribute("stroke", stroke);
      body.setAttribute("stroke-width", sw);
      g.appendChild(body);

      // 正面発光レンズ
      const lens = el("circle");
      lens.setAttribute("cx", "0");
      lens.setAttribute("cy", "0");
      lens.setAttribute("r", String(hw * 0.75));
      lens.setAttribute("fill", "#27272a");
      lens.setAttribute("stroke", stroke);
      lens.setAttribute("stroke-width", "0.8");
      g.appendChild(lens);

      // COBの黄色発光素子（黄色の同心円）
      const cob = el("circle");
      cob.setAttribute("cx", "0");
      cob.setAttribute("cy", "0");
      cob.setAttribute("r", String(hw * 0.4));
      cob.setAttribute("fill", "#fbbf24"); // COBチップイエロー
      cob.setAttribute("stroke", stroke);
      cob.setAttribute("stroke-width", "0.6");
      g.appendChild(cob);

      const cobCore = el("circle");
      cobCore.setAttribute("cx", "0");
      cobCore.setAttribute("cy", "0");
      cobCore.setAttribute("r", String(hw * 0.15));
      cobCore.setAttribute("fill", "#f59e0b");
      g.appendChild(cobCore);

    } else {
      // 側面図：奥行D300mm x 高さH380mm。筒体が斜めアーム脚で支えられている
      // ダブルアーム脚（床置きアングル）
      const arm = el("path");
      arm.setAttribute("d", `M 0 0 L ${-hw * 0.6} ${hh} L ${hw * 0.6} ${hh} Z M 0 0 L 0 ${hh}`);
      arm.setAttribute("fill", "none");
      arm.setAttribute("stroke", stroke);
      arm.setAttribute("stroke-width", String(Math.max(1.5, Number(sw))));
      g.appendChild(arm);

      // アーム調整ノブ
      const knob = el("circle");
      knob.setAttribute("cx", "0");
      knob.setAttribute("cy", "0");
      knob.setAttribute("r", "6");
      knob.setAttribute("fill", stroke);
      g.appendChild(knob);

      // 本体筒体（側面の横向きパー缶）
      const body = el("path");
      const w = hw * 2;
      const h = hh * 1.5;
      body.setAttribute("d", `M ${-w/2} ${-h/2} L ${w/2 - 20} ${-h/2} L ${w/2} ${-h/2 + 10} L ${w/2} ${h/2 - 10} L ${w/2 - 20} ${h/2} L ${-w/2} ${h/2} Z`);
      body.setAttribute("fill", fill);
      body.setAttribute("stroke", stroke);
      body.setAttribute("stroke-width", sw);
      g.appendChild(body);

      // 前方レンズ（右向きと仮定、または傾きに応じて回転）
      const lens = el("path");
      lens.setAttribute("d", `M ${w/2} ${-h/2 + 10} L ${w/2 + 6} ${-h/2 + 15} L ${w/2 + 6} ${h/2 - 15} L ${w/2} ${h/2 - 10} Z`);
      lens.setAttribute("fill", "#fbbf24");
      lens.setAttribute("stroke", stroke);
      lens.setAttribute("stroke-width", "0.8");
      g.appendChild(lens);

      // 背面の冷却用大型ファンベント
      const fan = el("rect");
      fan.setAttribute("x", String(-w/2 - 3));
      fan.setAttribute("y", String(-h/3));
      fan.setAttribute("width", "3");
      fan.setAttribute("height", String((h/3)*2));
      fan.setAttribute("fill", stroke);
      g.appendChild(fan);
    }

  } else if (shape === "liteparpro") {
    // LiteParPro の正面・側面立面図描画
    // IP65準拠の頑丈なファンレス四角形デザイン
    const rect = el("rect");
    rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
    rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
    rect.setAttribute("rx", "4"); rect.setAttribute("ry", "4");
    rect.setAttribute("fill", fill);
    rect.setAttribute("stroke", stroke);
    rect.setAttribute("stroke-width", sw);
    g.appendChild(rect);

    if (viewType === "front") {
      // 正面図：がっしりしたダブルアーム（ブラケット）と調整ノブ
      const bracket = el("path");
      bracket.setAttribute("d", `M ${-hw - 3} ${-hh * 0.3} L ${-hw - 3} ${hh + 4} L ${hw + 3} ${hh + 4} L ${hw + 3} ${-hh * 0.3}`);
      bracket.setAttribute("fill", "none");
      bracket.setAttribute("stroke", stroke);
      bracket.setAttribute("stroke-width", "1.5");
      g.appendChild(bracket);

      // 大きめの調整ノブ
      for (const cx of [-hw - 5, hw + 5]) {
        const knob = el("circle");
        knob.setAttribute("cx", String(cx)); knob.setAttribute("cy", "0");
        knob.setAttribute("r", "3.5");
        knob.setAttribute("fill", stroke);
        g.appendChild(knob);
      }

      // 中央の大型レンズ（同心円）
      const lensOut = el("circle");
      lensOut.setAttribute("cx", "0"); lensOut.setAttribute("cy", "0");
      lensOut.setAttribute("r", String(Math.min(hw, hh) * 0.7));
      lensOut.setAttribute("fill", "none");
      lensOut.setAttribute("stroke", stroke);
      lensOut.setAttribute("stroke-width", "0.8");
      g.appendChild(lensOut);

      // LED 4-in-1 発光面（4分割クロスマーク）
      const cross = el("path");
      const r_cross = Math.min(hw, hh) * 0.7;
      cross.setAttribute("d", `M ${-r_cross} 0 L ${r_cross} 0 M 0 ${-r_cross} L 0 ${r_cross}`);
      cross.setAttribute("stroke", stroke);
      cross.setAttribute("stroke-width", "0.5");
      cross.setAttribute("stroke-dasharray", "1,1");
      g.appendChild(cross);

    } else {
      // 側面図：斜めアーム
      const bracket = el("path");
      bracket.setAttribute("d", `M 0 0 L ${-hw - 6} ${hh + 5} L ${hw + 6} ${hh + 5} L 0 0`);
      bracket.setAttribute("fill", "none");
      bracket.setAttribute("stroke", stroke);
      bracket.setAttribute("stroke-width", "1.5");
      g.appendChild(bracket);

      const knob = el("circle");
      knob.setAttribute("cx", "0"); knob.setAttribute("cy", "0");
      knob.setAttribute("r", "3.5");
      knob.setAttribute("fill", stroke);
      g.appendChild(knob);

      // 背面のヒートシンク（ファンレス放熱フィン）を示すストライプ
      const fins = el("path");
      let d = "";
      const step = hw * 0.4;
      for (let x = -hw + step; x < hw; x += step) {
        d += `M ${x} ${-hh + 3} L ${x} ${hh - 3} `;
      }
      fins.setAttribute("d", d);
      fins.setAttribute("stroke", stroke);
      fins.setAttribute("stroke-width", "0.6");
      g.appendChild(fins);
    }

  } else if (shape === "sixbar1000") {
    // SIXBAR 1000 の正面・側面立面図描画
    // スリムで堅牢なアルミダイキャストのLEDバー
    const rect = el("rect");
    rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
    rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
    rect.setAttribute("rx", "2"); rect.setAttribute("ry", "2");
    rect.setAttribute("fill", fill);
    rect.setAttribute("stroke", stroke);
    rect.setAttribute("stroke-width", sw);
    g.appendChild(rect);

    if (viewType === "front") {
      // 正面図：左右2箇所のマウントスタンド脚（ブラケット）
      const legs = el("path");
      const leftLegX = -hw + hw * 0.25;
      const rightLegX = hw - hw * 0.25;
      legs.setAttribute("d", `M ${leftLegX - 10} ${hh} L ${leftLegX - 10} ${hh + 6} L ${leftLegX + 10} ${hh + 6} L ${leftLegX + 10} ${hh} M ${rightLegX - 10} ${hh} L ${rightLegX - 10} ${hh + 6} L ${rightLegX + 10} ${hh + 6} L ${rightLegX + 10} ${hh}`);
      legs.setAttribute("fill", "none");
      legs.setAttribute("stroke", stroke);
      legs.setAttribute("stroke-width", "1.2");
      g.appendChild(legs);

      // 横一列に並んだ12個のLEDレンズ
      const step = (hw * 2) / 13;
      const r_lens = hh * 0.45;
      for (let idx = 1; idx <= 12; idx++) {
        const cx = -hw + step * idx;
        const lens = el("circle");
        lens.setAttribute("cx", String(cx));
        lens.setAttribute("cy", "0");
        lens.setAttribute("r", String(r_lens));
        lens.setAttribute("fill", "none");
        lens.setAttribute("stroke", stroke);
        lens.setAttribute("stroke-width", "0.6");
        g.appendChild(lens);

        const inner = el("circle");
        inner.setAttribute("cx", String(cx));
        inner.setAttribute("cy", "0");
        inner.setAttribute("r", String(r_lens * 0.5));
        inner.setAttribute("fill", "none");
        inner.setAttribute("stroke", stroke);
        inner.setAttribute("stroke-width", "0.4");
        g.appendChild(inner);
      }
    } else {
      // 側面図：逆T字のマウントブラケット
      const bracket = el("path");
      bracket.setAttribute("d", `M 0 0 L ${-hw * 0.4} ${hh + 8} L ${hw * 0.4} ${hh + 8} L 0 0`);
      bracket.setAttribute("fill", "none");
      bracket.setAttribute("stroke", stroke);
      bracket.setAttribute("stroke-width", "1.2");
      g.appendChild(bracket);

      const knob = el("circle");
      knob.setAttribute("cx", "0"); knob.setAttribute("cy", "0");
      knob.setAttribute("r", "2.5");
      knob.setAttribute("fill", stroke);
      g.appendChild(knob);

      // 前面側（右側とする）を示す出射レンズのカバーライン
      const lensCover = el("path");
      lensCover.setAttribute("d", `M ${hw - 2} ${-hh + 4} L ${hw - 2} ${hh - 4}`);
      lensCover.setAttribute("stroke", stroke);
      lensCover.setAttribute("stroke-width", "1.5");
      g.appendChild(lensCover);
    }

  } else if (shape === "led_panel_500_1000") {
    // LED Panel 500x1000 の立面描画
    if (viewType === "front") {
      // 正面図: 縦長の大きなパネル + モジュール分割線 + ピクセルグリッド
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // ベゼル内枠線
      const innerRect = el("rect");
      innerRect.setAttribute("x", String(-hw + 1)); innerRect.setAttribute("y", String(-hh + 1));
      innerRect.setAttribute("width", String(hw * 2 - 2)); innerRect.setAttribute("height", String(hh * 2 - 2));
      innerRect.setAttribute("fill", "none"); innerRect.setAttribute("stroke", "#ffffff"); innerRect.setAttribute("stroke-width", "0.5"); innerRect.setAttribute("opacity", "0.5");
      g.appendChild(innerRect);

      // モジュール境界線 (2列 x 4行)
      const centerX = 0;
      const vLine = el("line");
      vLine.setAttribute("x1", String(centerX)); vLine.setAttribute("y1", String(-hh));
      vLine.setAttribute("x2", String(centerX)); vLine.setAttribute("y2", String(hh));
      vLine.setAttribute("stroke", stroke); vLine.setAttribute("stroke-width", "0.5");
      g.appendChild(vLine);

      for (let i = 1; i <= 3; i++) {
        const y = -hh + (hh * 2 / 4) * i;
        const hLine = el("line");
        hLine.setAttribute("x1", String(-hw)); hLine.setAttribute("y1", String(y));
        hLine.setAttribute("x2", String(hw)); hLine.setAttribute("y2", String(y));
        hLine.setAttribute("stroke", stroke); hLine.setAttribute("stroke-width", "0.5");
        g.appendChild(hLine);
      }

      // ピクセルを象徴する小さな点々をいくつかのモジュール中心に配置
      for (let row = 0; row < 4; row++) {
        const y = -hh + (hh * 2 / 4) * (row + 0.5);
        for (const col of [-0.5, 0.5]) {
          const x = centerX + hw * col;
          const pixel = el("circle");
          pixel.setAttribute("cx", String(x)); pixel.setAttribute("cy", String(y));
          pixel.setAttribute("r", String(Math.min(hw, hh) * 0.1));
          pixel.setAttribute("fill", "#ffffff"); pixel.setAttribute("opacity", "0.35");
          g.appendChild(pixel);
        }
      }
    } else {
      // 側面図: 極薄の縦長長方形 + 背面の薄型ボックス
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // 背面制御ボックスの膨らみ (左側を背面とする)
      const box = el("rect");
      box.setAttribute("x", String(-hw - hw * 0.4)); box.setAttribute("y", String(-hh * 0.8));
      box.setAttribute("width", String(hw * 0.4)); box.setAttribute("height", String(hh * 1.6));
      box.setAttribute("fill", "#374151"); box.setAttribute("stroke", stroke); box.setAttribute("stroke-width", "0.5");
      g.appendChild(box);

      // 上下のジョイントロック金具
      for (const ySign of [-1, 1]) {
        const joint = el("rect");
        joint.setAttribute("x", String(-hw - 1)); joint.setAttribute("y", String(hh * 0.85 * ySign - 2));
        joint.setAttribute("width", "3"); joint.setAttribute("height", "4");
        joint.setAttribute("fill", stroke);
        g.appendChild(joint);
      }
    }

  } else if (shape === "speaker_eon612") {
    // JBL EON612 の立面描画
    if (viewType === "front") {
      // 正面図: キャビネット + ウェーブガイドホーン + 12"ウーファー + オレンジJBLバッジ
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("rx", "3"); rect.setAttribute("ry", "3");
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // グリル枠 (少し内側)
      const gr = el("rect");
      gr.setAttribute("x", String(-hw + 3)); gr.setAttribute("y", String(-hh + 4));
      gr.setAttribute("width", String(hw * 2 - 6)); gr.setAttribute("height", String(hh * 2 - 8));
      gr.setAttribute("rx", "2"); gr.setAttribute("ry", "2");
      gr.setAttribute("fill", "#1e293b"); gr.setAttribute("stroke", stroke); gr.setAttribute("stroke-width", "0.5");
      g.appendChild(gr);

      // 上部：JBL Image Control Waveguide (ホーン)
      const horn = el("ellipse");
      horn.setAttribute("cx", "0"); horn.setAttribute("cy", String(-hh * 0.42));
      horn.setAttribute("rx", String(hw * 0.72)); horn.setAttribute("ry", String(hh * 0.28));
      horn.setAttribute("fill", "#0f172a"); horn.setAttribute("stroke", "#475569"); horn.setAttribute("stroke-width", "0.5");
      g.appendChild(horn);

      const driver = el("circle");
      driver.setAttribute("cx", "0"); driver.setAttribute("cy", String(-hh * 0.42));
      driver.setAttribute("r", String(Math.min(hw, hh) * 0.08));
      driver.setAttribute("fill", "#ffffff"); driver.setAttribute("opacity", "0.8");
      g.appendChild(driver);

      // 下部：12インチウーファーコーン
      const wooferOuter = el("circle");
      wooferOuter.setAttribute("cx", "0"); wooferOuter.setAttribute("cy", String(hh * 0.3));
      wooferOuter.setAttribute("r", String(hw * 0.7));
      wooferOuter.setAttribute("fill", "#0f172a"); wooferOuter.setAttribute("stroke", "#334155"); wooferOuter.setAttribute("stroke-width", "0.8");
      g.appendChild(wooferOuter);

      const wooferInner = el("circle");
      wooferInner.setAttribute("cx", "0"); wooferInner.setAttribute("cy", String(hh * 0.3));
      wooferInner.setAttribute("r", String(hw * 0.24));
      wooferInner.setAttribute("fill", "#1e293b"); wooferInner.setAttribute("stroke", "#475569"); wooferInner.setAttribute("stroke-width", "0.5");
      g.appendChild(wooferInner);

      // グリルネットの縦ラインスリット表現
      for (const x of [-hw * 0.5, hw * 0.5]) {
        const line = el("line");
        line.setAttribute("x1", String(x)); line.setAttribute("y1", String(-hh + 8));
        line.setAttribute("x2", String(x)); line.setAttribute("y2", String(hh - 8));
        line.setAttribute("stroke", "#64748b"); line.setAttribute("stroke-width", "0.3"); line.setAttribute("stroke-dasharray", "1,2"); line.setAttribute("opacity", "0.4");
        g.appendChild(line);
      }

      // 下部中央のJBLオレンジロゴバッジ
      const badge = el("rect");
      badge.setAttribute("x", "-5"); badge.setAttribute("y", String(hh - 18));
      badge.setAttribute("width", "10"); badge.setAttribute("height", "6");
      badge.setAttribute("fill", "#ff5500"); badge.setAttribute("stroke", "#ffffff"); badge.setAttribute("stroke-width", "0.6");
      g.appendChild(badge);

    } else {
      // 側面図: ウェッジアングルを持つ後面テーパー多角形 + 特徴的な縦長ハンドル
      const poly = el("polygon");
      const sPoints = [
        [-hw * 0.6, -hh],
        [hw, -hh],
        [hw, hh],
        [-hw * 0.6, hh],
        [-hw, hh * 0.65],
        [-hw, -hh * 0.65]
      ].map(p => p.join(",")).join(" ");
      poly.setAttribute("points", sPoints);
      poly.setAttribute("fill", color); poly.setAttribute("stroke", stroke); poly.setAttribute("stroke-width", sw);
      g.appendChild(poly);

      // 前面グリルライン (右端)
      const fLine = el("line");
      fLine.setAttribute("x1", String(hw - 2)); fLine.setAttribute("y1", String(-hh + 2));
      fLine.setAttribute("x2", String(hw - 2)); fLine.setAttribute("y2", String(hh - 2));
      fLine.setAttribute("stroke", "#ffffff"); fLine.setAttribute("stroke-width", "0.8"); fLine.setAttribute("opacity", "0.5");
      g.appendChild(fLine);

      // EONシリーズの特徴的な大型縦型サイドハンドル
      const handle = el("rect");
      handle.setAttribute("x", "-5"); handle.setAttribute("y", String(-hh * 0.3));
      handle.setAttribute("width", "10"); handle.setAttribute("height", String(hh * 0.6));
      handle.setAttribute("rx", "3"); handle.setAttribute("ry", "3");
      handle.setAttribute("fill", "#0f172a"); handle.setAttribute("stroke", stroke); handle.setAttribute("stroke-width", "0.5");
      g.appendChild(handle);

      const handleBar = el("line");
      handleBar.setAttribute("x1", "0"); handleBar.setAttribute("y1", String(-hh * 0.22));
      handleBar.setAttribute("x2", "0"); handleBar.setAttribute("y2", String(hh * 0.22));
      handleBar.setAttribute("stroke", "#475569"); handleBar.setAttribute("stroke-width", "2");
      g.appendChild(handleBar);
    }

  } else if (shape === "console_l20r") {
    // LiveTrak L-20R の立面描画
    if (viewType === "front") {
      // 正面図: 19インチラックマウント筐体 + 16個のXLRコンボ端子 + 出力部
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("rx", "1"); rect.setAttribute("ry", "1");
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // 左右のラックマウントフランジ (耳) とネジ穴
      for (const xSign of [-1, 1]) {
        const xOffset = xSign === -1 ? -hw : hw - 10;
        const ear = el("rect");
        ear.setAttribute("x", String(xOffset)); ear.setAttribute("y", String(-hh));
        ear.setAttribute("width", "10"); ear.setAttribute("height", String(hh * 2));
        ear.setAttribute("fill", "#475569"); ear.setAttribute("stroke", stroke); ear.setAttribute("stroke-width", "0.5");
        g.appendChild(ear);

        // ネジ穴 2箇所
        for (const yOffset of [-hh * 0.5, hh * 0.5]) {
          const hole = el("circle");
          hole.setAttribute("cx", String(xOffset + 5)); hole.setAttribute("cy", String(yOffset));
          hole.setAttribute("r", "1.5");
          hole.setAttribute("fill", "#0f172a");
          g.appendChild(hole);
        }
      }

      // インプット端子エリアの枠 (左側)
      const inpArea = el("rect");
      inpArea.setAttribute("x", String(-hw + 14)); inpArea.setAttribute("y", String(-hh + 8));
      inpArea.setAttribute("width", String(hw * 1.2)); inpArea.setAttribute("height", String(hh * 2 - 16));
      inpArea.setAttribute("fill", "#0f172a"); inpArea.setAttribute("stroke", stroke); inpArea.setAttribute("stroke-width", "0.5");
      g.appendChild(inpArea);

      // XLR/TRSコンボ端子 (8x2 = 16箇所) の精密描画
      const cols = 8;
      const rows = 2;
      const wInp = hw * 1.2;
      for (let r = 0; r < rows; r++) {
        const y = -hh + 20 + (r * (hh * 2 - 40)) / (rows - 1);
        for (let c = 0; c < cols; c++) {
          const x = -hw + 24 + (c * (wInp - 20)) / (cols - 1);

          // XLRアウターリング
          const ring = el("circle");
          ring.setAttribute("cx", String(x)); ring.setAttribute("cy", String(y));
          ring.setAttribute("r", "4.5");
          ring.setAttribute("fill", "#1e293b"); ring.setAttribute("stroke", "#475569"); ring.setAttribute("stroke-width", "0.5");
          g.appendChild(ring);

          // インナーTRS穴
          const hole = el("circle");
          hole.setAttribute("cx", String(x)); hole.setAttribute("cy", String(y));
          hole.setAttribute("r", "1.5");
          hole.setAttribute("fill", "#000000");
          g.appendChild(hole);

          // XLRピン(3点ドット)
          for (let deg = 0; deg < 360; deg += 120) {
            const rad = ((deg + 90) * Math.PI) / 180;
            const dot = el("circle");
            dot.setAttribute("cx", String(x + Math.cos(rad) * 2.8));
            dot.setAttribute("cy", String(y + Math.sin(rad) * 2.8));
            dot.setAttribute("r", "0.4");
            dot.setAttribute("fill", "#ffffff");
            g.appendChild(dot);
          }
        }
      }

      // 右側：操作パネル・液晶・マスター出力
      // 液晶ディスプレイ
      const lcd = el("rect");
      lcd.setAttribute("x", String(hw * 0.45)); lcd.setAttribute("y", String(-hh + 12));
      lcd.setAttribute("width", "20"); lcd.setAttribute("height", "15");
      lcd.setAttribute("fill", "#0284c7"); lcd.setAttribute("stroke", stroke); lcd.setAttribute("stroke-width", "0.5");
      g.appendChild(lcd);

      // モニターアウト TRS 端子 (6系統)
      for (let i = 0; i < 6; i++) {
        const x = hw * 0.45 + (i % 3) * 12;
        const y = hh * 0.1 + Math.floor(i / 3) * 16;
        const jack = el("circle");
        jack.setAttribute("cx", String(x)); jack.setAttribute("cy", String(y));
        jack.setAttribute("r", "3");
        jack.setAttribute("fill", "#0f172a"); jack.setAttribute("stroke", "#ef4444"); jack.setAttribute("stroke-width", "1");
        g.appendChild(jack);
      }

      // Bluetoothドングル (BTA-1) コネクタ部
      const bta = el("rect");
      bta.setAttribute("x", String(hw * 0.8)); bta.setAttribute("y", String(-hh + 12));
      bta.setAttribute("width", "6"); bta.setAttribute("height", "10");
      bta.setAttribute("fill", "#1e3a8a"); bta.setAttribute("stroke", stroke); bta.setAttribute("stroke-width", "0.5");
      g.appendChild(bta);

    } else {
      // 側面図: フラットなラックマウント奥行 + L字ラック耳断面
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // 左端のラック耳の厚みとネジ止めイメージ
      const ear = el("rect");
      ear.setAttribute("x", String(-hw)); ear.setAttribute("y", String(-hh));
      ear.setAttribute("width", "4"); ear.setAttribute("height", String(hh * 2));
      ear.setAttribute("fill", "#475569"); ear.setAttribute("stroke", stroke); ear.setAttribute("stroke-width", "0.5");
      g.appendChild(ear);

      // 側面の排気スリットライン
      for (let y = -hh * 0.5; y <= hh * 0.5; y += 8) {
        const slit = el("line");
        slit.setAttribute("x1", String(-hw * 0.3)); slit.setAttribute("y1", String(y));
        slit.setAttribute("x2", String(hw * 0.5)); slit.setAttribute("y2", String(y));
        slit.setAttribute("stroke", stroke); slit.setAttribute("stroke-width", "0.8"); slit.setAttribute("opacity", "0.6");
        g.appendChild(slit);
      }
    }

  } else if (shape === "speaker_titan_8a") {
    // Titan 8A MKII の立面描画
    if (viewType === "front") {
      // 正面図: 樽型キャビネット + 楕円ホーン + 8インチウーファー
      const cabinet = el("path");
      const d = `M ${-hw * 0.9} ${-hh} 
                 Q 0 ${-hh * 1.03} ${hw * 0.9} ${-hh} 
                 Q ${hw * 1.05} 0 ${hw * 0.92} ${hh * 0.96} 
                 Q 0 ${hh * 1.02} ${-hw * 0.92} ${hh * 0.96} 
                 Q ${-hw * 1.05} 0 ${-hw * 0.9} ${-hh} Z`;
      cabinet.setAttribute("d", d);
      cabinet.setAttribute("fill", color); cabinet.setAttribute("stroke", stroke); cabinet.setAttribute("stroke-width", sw);
      g.appendChild(cabinet);

      // フロントグリル枠線 (少し内側)
      const gr = el("path");
      const gd = `M ${-hw * 0.8} ${-hh + 4} 
                  Q 0 ${-hh * 0.95 + 4} ${hw * 0.8} ${-hh + 4} 
                  L ${hw * 0.82} ${hh - 4} 
                  Q 0 ${hh * 0.95 - 4} ${-hw * 0.82} ${hh - 4} Z`;
      gr.setAttribute("d", gd);
      gr.setAttribute("fill", "#1e293b"); gr.setAttribute("stroke", stroke); gr.setAttribute("stroke-width", "0.5");
      g.appendChild(gr);

      // 上部：楕円形ホーンツイーター
      const horn = el("ellipse");
      horn.setAttribute("cx", "0"); horn.setAttribute("cy", String(-hh * 0.4));
      horn.setAttribute("rx", String(hw * 0.6)); horn.setAttribute("ry", String(hh * 0.25));
      horn.setAttribute("fill", "#0f172a"); horn.setAttribute("stroke", "#475569"); horn.setAttribute("stroke-width", "0.5");
      g.appendChild(horn);

      const driver = el("circle");
      driver.setAttribute("cx", "0"); driver.setAttribute("cy", String(-hh * 0.4));
      driver.setAttribute("r", String(Math.min(hw, hh) * 0.09));
      driver.setAttribute("fill", "#ffffff"); driver.setAttribute("opacity", "0.75");
      g.appendChild(driver);

      // 下部：8インチウーファー (同心円)
      const wooferOuter = el("circle");
      wooferOuter.setAttribute("cx", "0"); wooferOuter.setAttribute("cy", String(hh * 0.32));
      wooferOuter.setAttribute("r", String(hw * 0.65));
      wooferOuter.setAttribute("fill", "#0f172a"); wooferOuter.setAttribute("stroke", "#334155"); wooferOuter.setAttribute("stroke-width", "0.8");
      g.appendChild(wooferOuter);

      const wooferInner = el("circle");
      wooferInner.setAttribute("cx", "0"); wooferInner.setAttribute("cy", String(hh * 0.32));
      wooferInner.setAttribute("r", String(hw * 0.22));
      wooferInner.setAttribute("fill", "#1e293b"); wooferInner.setAttribute("stroke", "#475569"); wooferInner.setAttribute("stroke-width", "0.5");
      g.appendChild(wooferInner);

      // グリルネットのセンター縦リブ
      const rib = el("line");
      rib.setAttribute("x1", "0"); rib.setAttribute("y1", String(-hh + 4));
      rib.setAttribute("x2", "0"); rib.setAttribute("y2", String(hh - 4));
      rib.setAttribute("stroke", "#ffffff"); rib.setAttribute("stroke-width", "0.6"); rib.setAttribute("opacity", "0.5");
      g.appendChild(rib);

      // 下部のWマークバッジ
      const logo = el("circle");
      logo.setAttribute("cx", "0"); logo.setAttribute("cy", String(hh - 12));
      logo.setAttribute("r", "4");
      logo.setAttribute("fill", "#0f172a"); logo.setAttribute("stroke", stroke); logo.setAttribute("stroke-width", "0.5");
      g.appendChild(logo);

      const wLogo = el("path");
      wLogo.setAttribute("d", `M -1.8 ${hh - 14} L -0.8 ${hh - 10} L 0 ${hh - 13} L 0.8 ${hh - 10} L 1.8 ${hh - 14}`);
      wLogo.setAttribute("fill", "none"); wLogo.setAttribute("stroke", "#ffffff"); wLogo.setAttribute("stroke-width", "0.6");
      g.appendChild(wLogo);

    } else {
      // 側面図: 後ろに向かって丸くテーパーしつつ、ウェッジモニターアングルを持つ有機的な多角形
      const poly = el("polygon");
      const sPoints = [
        [-hw * 0.7, -hh],
        [hw, -hh],
        [hw, hh],
        [-hw * 0.7, hh],
        [-hw, hh * 0.55],
        [-hw, -hh * 0.55]
      ].map(p => p.join(",")).join(" ");
      poly.setAttribute("points", sPoints);
      poly.setAttribute("fill", color); poly.setAttribute("stroke", stroke); poly.setAttribute("stroke-width", sw);
      g.appendChild(poly);

      // 前面グリルライン (右端)
      const fLine = el("line");
      fLine.setAttribute("x1", String(hw - 2)); fLine.setAttribute("y1", String(-hh + 2));
      fLine.setAttribute("x2", String(hw - 2)); fLine.setAttribute("y2", String(hh - 2));
      fLine.setAttribute("stroke", "#ffffff"); fLine.setAttribute("stroke-width", "0.8"); fLine.setAttribute("opacity", "0.5");
      g.appendChild(fLine);

      // 側面ハンドル (有機的な長円形)
      const handle = el("rect");
      handle.setAttribute("x", String(-hw * 0.2)); handle.setAttribute("y", "-14");
      handle.setAttribute("width", String(hw * 0.45)); handle.setAttribute("height", "28");
      handle.setAttribute("rx", "6"); handle.setAttribute("ry", "6");
      handle.setAttribute("fill", "#0f172a"); handle.setAttribute("stroke", stroke); handle.setAttribute("stroke-width", "0.5");
      g.appendChild(handle);

      const handleBar = el("line");
      handleBar.setAttribute("x1", "0"); handleBar.setAttribute("y1", "-9");
      handleBar.setAttribute("x2", "0"); handleBar.setAttribute("y2", "9");
      handleBar.setAttribute("stroke", "#475569"); handleBar.setAttribute("stroke-width", "1.5");
      g.appendChild(handleBar);
    }

  } else if (shape === "speaker_elx200_12") {
    // ELX200-12 の立面描画
    if (viewType === "front") {
      // 正面図: フロントグリル + ホーンツイーター + 12インチウーファー + ロゴ
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("rx", "2"); rect.setAttribute("ry", "2");
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // グリル枠
      const gr = el("rect");
      gr.setAttribute("x", String(-hw + 2)); gr.setAttribute("y", String(-hh + 2));
      gr.setAttribute("width", String(hw * 2 - 4)); gr.setAttribute("height", String(hh * 2 - 4));
      gr.setAttribute("rx", "1"); gr.setAttribute("ry", "1");
      gr.setAttribute("fill", "#1e293b"); gr.setAttribute("stroke", stroke); gr.setAttribute("stroke-width", "0.5");
      g.appendChild(gr);

      // 上部ホーン（ツイーター）のホーン形状
      const horn = el("polygon");
      const hPoints = [
        [-hw * 0.6, -hh * 0.6],
        [hw * 0.6, -hh * 0.6],
        [hw * 0.3, -hh * 0.25],
        [-hw * 0.3, -hh * 0.25]
      ].map(p => p.join(",")).join(" ");
      horn.setAttribute("points", hPoints);
      horn.setAttribute("fill", "#0f172a"); horn.setAttribute("stroke", "#475569"); horn.setAttribute("stroke-width", "0.5");
      g.appendChild(horn);

      // ホーンの中央ドライバー
      const driver = el("circle");
      driver.setAttribute("cx", "0"); driver.setAttribute("cy", String(-hh * 0.43));
      driver.setAttribute("r", String(Math.min(hw, hh) * 0.08));
      driver.setAttribute("fill", "#ffffff"); driver.setAttribute("opacity", "0.8");
      g.appendChild(driver);

      // 下部 12インチ ウーファー（同心円）
      const wooferOuter = el("circle");
      wooferOuter.setAttribute("cx", "0"); wooferOuter.setAttribute("cy", String(hh * 0.35));
      wooferOuter.setAttribute("r", String(hw * 0.68));
      wooferOuter.setAttribute("fill", "#0f172a"); wooferOuter.setAttribute("stroke", "#334155"); wooferOuter.setAttribute("stroke-width", "0.8");
      g.appendChild(wooferOuter);

      const wooferInner = el("circle");
      wooferInner.setAttribute("cx", "0"); wooferInner.setAttribute("cy", String(hh * 0.35));
      wooferInner.setAttribute("r", String(hw * 0.24));
      wooferInner.setAttribute("fill", "#1e293b"); wooferInner.setAttribute("stroke", "#475569"); wooferInner.setAttribute("stroke-width", "0.5");
      g.appendChild(wooferInner);

      // フロントグリル表面のメッシュ感を表現する数本の縦破線
      for (let x = -hw * 0.8; x <= hw * 0.8; x += hw * 0.4) {
        if (Math.abs(x) < 0.1) continue;
        const mesh = el("line");
        mesh.setAttribute("x1", String(x)); mesh.setAttribute("y1", String(-hh + 4));
        mesh.setAttribute("x2", String(x)); mesh.setAttribute("y2", String(hh - 4));
        mesh.setAttribute("stroke", "#64748b"); mesh.setAttribute("stroke-width", "0.3"); mesh.setAttribute("stroke-dasharray", "1,2"); mesh.setAttribute("opacity", "0.4");
        g.appendChild(mesh);
      }

      // 下部のEVロゴバッジ (四角いバッジの中に白いV字)
      const badge = el("rect");
      badge.setAttribute("x", "-4"); badge.setAttribute("y", String(hh - 12));
      badge.setAttribute("width", "8"); badge.setAttribute("height", "8");
      badge.setAttribute("fill", "#0f172a"); badge.setAttribute("stroke", stroke); badge.setAttribute("stroke-width", "0.5");
      g.appendChild(badge);

      const vLogo = el("path");
      vLogo.setAttribute("d", `M -2 ${hh - 10} L 0 ${hh - 6} L 2 ${hh - 10}`);
      vLogo.setAttribute("fill", "none"); vLogo.setAttribute("stroke", "#ffffff"); vLogo.setAttribute("stroke-width", "0.8");
      g.appendChild(vLogo);

    } else {
      // 側面図: 斜めカットのある多角形（ウェッジ形状）
      // 前面が右 (hw)、背面が左 (-hw) と想定
      const poly = el("polygon");
      const sPoints = [
        [-hw * 0.4, -hh],
        [hw, -hh],
        [hw, hh],
        [-hw * 0.4, hh],
        [-hw, hh * 0.4],
        [-hw, -hh * 0.4]
      ].map(p => p.join(",")).join(" ");
      poly.setAttribute("points", sPoints);
      poly.setAttribute("fill", color); poly.setAttribute("stroke", stroke); poly.setAttribute("stroke-width", sw);
      g.appendChild(poly);

      // フロントグリル枠線（右側の前面）
      const fLine = el("line");
      fLine.setAttribute("x1", String(hw - 2)); fLine.setAttribute("y1", String(-hh + 2));
      fLine.setAttribute("x2", String(hw - 2)); fLine.setAttribute("y2", String(hh - 2));
      fLine.setAttribute("stroke", "#ffffff"); fLine.setAttribute("stroke-width", "0.8"); fLine.setAttribute("opacity", "0.5");
      g.appendChild(fLine);

      // 側面凹型ハンドル
      const handle = el("rect");
      handle.setAttribute("x", String(-hw * 0.2)); handle.setAttribute("y", "-12");
      handle.setAttribute("width", String(hw * 0.5)); handle.setAttribute("height", "24");
      handle.setAttribute("rx", "1"); handle.setAttribute("ry", "1");
      handle.setAttribute("fill", "#0f172a"); handle.setAttribute("stroke", stroke); handle.setAttribute("stroke-width", "0.5");
      g.appendChild(handle);

      const handleBar = el("line");
      handleBar.setAttribute("x1", String(hw * 0.05)); handleBar.setAttribute("y1", "-8");
      handleBar.setAttribute("x2", String(hw * 0.05)); handleBar.setAttribute("y2", "8");
      handleBar.setAttribute("stroke", "#475569"); handleBar.setAttribute("stroke-width", "1.5");
      g.appendChild(handleBar);
    }

  } else if (shape === "speaker_ip500") {
    // Turbosound iP500 の立面描画 (ベース高 460mm = 全高の23%、コラム細長)
    if (viewType === "front") {
      // 正面図: サブウーファーベースと、細いコラムアレイ
      // 1. サブウーファーベース
      const base = el("rect");
      base.setAttribute("x", String(-hw));
      base.setAttribute("y", String(hh * 0.54));
      base.setAttribute("width", String(hw * 2));
      base.setAttribute("height", String(hh * 0.46));
      base.setAttribute("rx", "3");
      base.setAttribute("ry", "3");
      base.setAttribute("fill", color);
      base.setAttribute("stroke", stroke);
      base.setAttribute("stroke-width", sw);
      g.appendChild(base);

      // ベースのフロントグリル
      const baseGr = el("rect");
      baseGr.setAttribute("x", String(-hw + 3));
      baseGr.setAttribute("y", String(hh * 0.54 + 4));
      baseGr.setAttribute("width", String(hw * 2 - 6));
      baseGr.setAttribute("height", String(hh * 0.46 - 8));
      baseGr.setAttribute("fill", "#0f172a");
      baseGr.setAttribute("stroke", stroke);
      baseGr.setAttribute("stroke-width", "0.5");
      g.appendChild(baseGr);

      // 2. コラムスピーカー柱 (幅はベースの約35%)
      const colW = hw * 0.35;
      const colX = -colW / 2;
      const column = el("rect");
      column.setAttribute("x", String(colX));
      column.setAttribute("y", String(-hh));
      column.setAttribute("width", String(colW));
      column.setAttribute("height", String(hh * 1.54));
      column.setAttribute("fill", color);
      column.setAttribute("stroke", stroke);
      column.setAttribute("stroke-width", sw);
      g.appendChild(column);

      // コラムのグリルネット (前面全体)
      const colGr = el("rect");
      colGr.setAttribute("x", String(colX + 1.5));
      colGr.setAttribute("y", String(-hh + 2));
      colGr.setAttribute("width", String(colW - 3));
      colGr.setAttribute("height", String(hh * 1.54 - 4));
      colGr.setAttribute("fill", "#1e293b");
      colGr.setAttribute("stroke", stroke);
      colGr.setAttribute("stroke-width", "0.3");
      g.appendChild(colGr);

      // コラムの分割線 (中央の接続部)
      const divider = el("line");
      divider.setAttribute("x1", String(colX));
      divider.setAttribute("y1", String(-hh * 0.2));
      divider.setAttribute("x2", String(colX + colW));
      divider.setAttribute("y2", String(-hh * 0.2));
      divider.setAttribute("stroke", stroke);
      divider.setAttribute("stroke-width", "0.8");
      g.appendChild(divider);

      // コラム内の6つの2インチスピーカーユニット (上部に並る)
      const startY = -hh * 0.95;
      const stepY = hh * 0.12;
      for (let i = 0; i < 6; i++) {
        const yPos = startY + i * stepY;
        // ウーファーコーン
        const spOuter = el("circle");
        spOuter.setAttribute("cx", "0");
        spOuter.setAttribute("cy", String(yPos));
        spOuter.setAttribute("r", String(colW * 0.35));
        spOuter.setAttribute("fill", "#0f172a");
        spOuter.setAttribute("stroke", "#475569");
        spOuter.setAttribute("stroke-width", "0.5");
        g.appendChild(spOuter);

        const spInner = el("circle");
        spInner.setAttribute("cx", "0");
        spInner.setAttribute("cy", String(yPos));
        spInner.setAttribute("r", String(colW * 0.15));
        spInner.setAttribute("fill", "#ffffff");
        spInner.setAttribute("opacity", "0.7");
        g.appendChild(spInner);
      }

    } else {
      // 側面図: 前面が右 (hw)、背面が左 (-hw)
      // 1. サブウーファーベース
      const base = el("rect");
      base.setAttribute("x", String(-hw));
      base.setAttribute("y", String(hh * 0.54));
      base.setAttribute("width", String(hw * 2));
      base.setAttribute("height", String(hh * 0.46));
      base.setAttribute("rx", "3");
      base.setAttribute("ry", "3");
      base.setAttribute("fill", color);
      base.setAttribute("stroke", stroke);
      base.setAttribute("stroke-width", sw);
      g.appendChild(base);

      // ベースのフロントグリル (右端の前面)
      const baseGr = el("rect");
      baseGr.setAttribute("x", String(hw - 4));
      baseGr.setAttribute("y", String(hh * 0.54 + 4));
      baseGr.setAttribute("width", "3");
      baseGr.setAttribute("height", String(hh * 0.46 - 8));
      baseGr.setAttribute("fill", "#0f172a");
      g.appendChild(baseGr);

      // 背面アンプパネル部 (左端の背面)
      const ampPanel = el("rect");
      ampPanel.setAttribute("x", String(-hw + 1));
      ampPanel.setAttribute("y", String(hh * 0.6));
      ampPanel.setAttribute("width", "4");
      ampPanel.setAttribute("height", String(hh * 0.3));
      ampPanel.setAttribute("fill", "#0f172a");
      g.appendChild(ampPanel);

      // 2. コラムスピーカー柱 (奥行はベースの約25%、やや後方(左寄り)に設置)
      const colD = hw * 0.5;
      const colX = -hw * 0.4; // 後方(左)寄りに配置

      const column = el("rect");
      column.setAttribute("x", String(colX));
      column.setAttribute("y", String(-hh));
      column.setAttribute("width", String(colD));
      column.setAttribute("height", String(hh * 1.54));
      column.setAttribute("fill", color);
      column.setAttribute("stroke", stroke);
      column.setAttribute("stroke-width", sw);
      g.appendChild(column);

      // コラムのグリルネット (右端の前面)
      const colGr = el("rect");
      colGr.setAttribute("x", String(colX + colD - 3));
      colGr.setAttribute("y", String(-hh + 2));
      colGr.setAttribute("width", "2");
      colGr.setAttribute("height", String(hh * 1.54 - 4));
      colGr.setAttribute("fill", "#1e293b");
      g.appendChild(colGr);

      // コラムの接続線
      const divider = el("line");
      divider.setAttribute("x1", String(colX));
      divider.setAttribute("y1", String(-hh * 0.2));
      divider.setAttribute("x2", String(colX + colD));
      divider.setAttribute("y2", String(-hh * 0.2));
      divider.setAttribute("stroke", stroke);
      divider.setAttribute("stroke-width", "0.8");
      g.appendChild(divider);
    }

  } else if (shape === "speaker_elx200_15") {
    // ELX200-15 の立面描画
    if (viewType === "front") {
      // 正面図: フロントグリル + ホーンツイーター + ウーファー + ロゴ
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("rx", "2"); rect.setAttribute("ry", "2");
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // グリル枠
      const gr = el("rect");
      gr.setAttribute("x", String(-hw + 2)); gr.setAttribute("y", String(-hh + 2));
      gr.setAttribute("width", String(hw * 2 - 4)); gr.setAttribute("height", String(hh * 2 - 4));
      gr.setAttribute("rx", "1"); gr.setAttribute("ry", "1");
      gr.setAttribute("fill", "#1e293b"); gr.setAttribute("stroke", stroke); gr.setAttribute("stroke-width", "0.5");
      g.appendChild(gr);

      // 上部ホーン（ツイーター）のホーン形状
      const horn = el("polygon");
      const hPoints = [
        [-hw * 0.6, -hh * 0.6],
        [hw * 0.6, -hh * 0.6],
        [hw * 0.3, -hh * 0.25],
        [-hw * 0.3, -hh * 0.25]
      ].map(p => p.join(",")).join(" ");
      horn.setAttribute("points", hPoints);
      horn.setAttribute("fill", "#0f172a"); horn.setAttribute("stroke", "#475569"); horn.setAttribute("stroke-width", "0.5");
      g.appendChild(horn);

      // ホーンの中央ドライバー
      const driver = el("circle");
      driver.setAttribute("cx", "0"); driver.setAttribute("cy", String(-hh * 0.43));
      driver.setAttribute("r", String(Math.min(hw, hh) * 0.08));
      driver.setAttribute("fill", "#ffffff"); driver.setAttribute("opacity", "0.8");
      g.appendChild(driver);

      // 下部 15インチ ウーファー（同心円）
      const wooferOuter = el("circle");
      wooferOuter.setAttribute("cx", "0"); wooferOuter.setAttribute("cy", String(hh * 0.35));
      wooferOuter.setAttribute("r", String(hw * 0.72));
      wooferOuter.setAttribute("fill", "#0f172a"); wooferOuter.setAttribute("stroke", "#334155"); wooferOuter.setAttribute("stroke-width", "0.8");
      g.appendChild(wooferOuter);

      const wooferInner = el("circle");
      wooferInner.setAttribute("cx", "0"); wooferInner.setAttribute("cy", String(hh * 0.35));
      wooferInner.setAttribute("r", String(hw * 0.25));
      wooferInner.setAttribute("fill", "#1e293b"); wooferInner.setAttribute("stroke", "#475569"); wooferInner.setAttribute("stroke-width", "0.5");
      g.appendChild(wooferInner);

      // フロントグリル表面のメッシュ感を表現する数本の縦破線
      for (let x = -hw * 0.8; x <= hw * 0.8; x += hw * 0.4) {
        if (Math.abs(x) < 0.1) continue;
        const mesh = el("line");
        mesh.setAttribute("x1", String(x)); mesh.setAttribute("y1", String(-hh + 4));
        mesh.setAttribute("x2", String(x)); mesh.setAttribute("y2", String(hh - 4));
        mesh.setAttribute("stroke", "#64748b"); mesh.setAttribute("stroke-width", "0.3"); mesh.setAttribute("stroke-dasharray", "1,2"); mesh.setAttribute("opacity", "0.4");
        g.appendChild(mesh);
      }

      // 下部のEVロゴバッジ (四角いバッジの中に白いV字)
      const badge = el("rect");
      badge.setAttribute("x", "-4"); badge.setAttribute("y", String(hh - 12));
      badge.setAttribute("width", "8"); badge.setAttribute("height", "8");
      badge.setAttribute("fill", "#0f172a"); badge.setAttribute("stroke", stroke); badge.setAttribute("stroke-width", "0.5");
      g.appendChild(badge);

      const vLogo = el("path");
      vLogo.setAttribute("d", `M -2 ${hh - 10} L 0 ${hh - 6} L 2 ${hh - 10}`);
      vLogo.setAttribute("fill", "none"); vLogo.setAttribute("stroke", "#ffffff"); vLogo.setAttribute("stroke-width", "0.8");
      g.appendChild(vLogo);

    } else {
      // 側面図: 斜めカットのある多角形（ウェッジ形状）
      // 前面が右 (hw)、背面が左 (-hw) と想定
      const poly = el("polygon");
      const sPoints = [
        [-hw * 0.4, -hh],
        [hw, -hh],
        [hw, hh],
        [-hw * 0.4, hh],
        [-hw, hh * 0.4],
        [-hw, -hh * 0.4]
      ].map(p => p.join(",")).join(" ");
      poly.setAttribute("points", sPoints);
      poly.setAttribute("fill", color); poly.setAttribute("stroke", stroke); poly.setAttribute("stroke-width", sw);
      g.appendChild(poly);

      // フロントグリル枠線（右側の前面）
      const fLine = el("line");
      fLine.setAttribute("x1", String(hw - 2)); fLine.setAttribute("y1", String(-hh + 2));
      fLine.setAttribute("x2", String(hw - 2)); fLine.setAttribute("y2", String(hh - 2));
      fLine.setAttribute("stroke", "#ffffff"); fLine.setAttribute("stroke-width", "0.8"); fLine.setAttribute("opacity", "0.5");
      g.appendChild(fLine);

      // 側面凹型ハンドル
      const handle = el("rect");
      handle.setAttribute("x", String(-hw * 0.2)); handle.setAttribute("y", "-12");
      handle.setAttribute("width", String(hw * 0.5)); handle.setAttribute("height", "24");
      handle.setAttribute("rx", "1"); handle.setAttribute("ry", "1");
      handle.setAttribute("fill", "#0f172a"); handle.setAttribute("stroke", stroke); handle.setAttribute("stroke-width", "0.5");
      g.appendChild(handle);

      const handleBar = el("line");
      handleBar.setAttribute("x1", String(hw * 0.05)); handleBar.setAttribute("y1", "-8");
      handleBar.setAttribute("x2", String(hw * 0.05)); handleBar.setAttribute("y2", "8");
      handleBar.setAttribute("stroke", "#475569"); handleBar.setAttribute("stroke-width", "1.5");
      g.appendChild(handleBar);
    }

  } else if (shape === "subwoofer_elx200_18sp") {
    // ELX200-18SP の立面描画
    if (viewType === "front") {
      // 正面図: 正方形に近い大きなグリル + 18インチウーファー + ロゴ
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("rx", "3"); rect.setAttribute("ry", "3");
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // グリル枠
      const gr = el("rect");
      gr.setAttribute("x", String(-hw + 2)); gr.setAttribute("y", String(-hh + 2));
      gr.setAttribute("width", String(hw * 2 - 4)); gr.setAttribute("height", String(hh * 2 - 4));
      gr.setAttribute("rx", "2"); gr.setAttribute("ry", "2");
      gr.setAttribute("fill", "#1e293b"); gr.setAttribute("stroke", stroke); gr.setAttribute("stroke-width", "0.5");
      g.appendChild(gr);

      // 超大型 18インチ ウーファーコーン
      const wooferOuter = el("circle");
      wooferOuter.setAttribute("cx", "0"); wooferOuter.setAttribute("cy", "0");
      wooferOuter.setAttribute("r", String(hw * 0.82));
      wooferOuter.setAttribute("fill", "#0f172a"); wooferOuter.setAttribute("stroke", "#334155"); wooferOuter.setAttribute("stroke-width", "1");
      g.appendChild(wooferOuter);

      const wooferInner = el("circle");
      wooferInner.setAttribute("cx", "0"); wooferInner.setAttribute("cy", "0");
      wooferInner.setAttribute("r", String(hw * 0.28));
      wooferInner.setAttribute("fill", "#1e293b"); wooferInner.setAttribute("stroke", "#475569"); wooferInner.setAttribute("stroke-width", "0.6");
      g.appendChild(wooferInner);

      // フロントグリルのメッシュ破線
      for (let x = -hw * 0.8; x <= hw * 0.8; x += hw * 0.4) {
        if (Math.abs(x) < 0.1) continue;
        const mesh = el("line");
        mesh.setAttribute("x1", String(x)); mesh.setAttribute("y1", String(-hh + 4));
        mesh.setAttribute("x2", String(x)); mesh.setAttribute("y2", String(hh - 4));
        mesh.setAttribute("stroke", "#64748b"); mesh.setAttribute("stroke-width", "0.3"); mesh.setAttribute("stroke-dasharray", "1,2"); mesh.setAttribute("opacity", "0.4");
        g.appendChild(mesh);
      }

      // 中央上部のEVロゴバッジ
      const badge = el("rect");
      badge.setAttribute("x", "-4"); badge.setAttribute("y", String(-hh + 12));
      badge.setAttribute("width", "8"); badge.setAttribute("height", "8");
      badge.setAttribute("fill", "#0f172a"); badge.setAttribute("stroke", stroke); badge.setAttribute("stroke-width", "0.5");
      g.appendChild(badge);

      const vLogo = el("path");
      vLogo.setAttribute("d", `M -2 ${-hh + 14} L 0 ${-hh + 18} L 2 ${-hh + 14}`);
      vLogo.setAttribute("fill", "none"); vLogo.setAttribute("stroke", "#ffffff"); vLogo.setAttribute("stroke-width", "0.8");
      g.appendChild(vLogo);

    } else {
      // 側面図: ほぼ正方形の側面 + サイドハンドル
      const rect = el("rect");
      rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("rx", "2"); rect.setAttribute("ry", "2");
      rect.setAttribute("fill", color); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      // フロントグリル枠線（右側の前面）
      const fLine = el("line");
      fLine.setAttribute("x1", String(hw - 2)); fLine.setAttribute("y1", String(-hh + 2));
      fLine.setAttribute("x2", String(hw - 2)); fLine.setAttribute("y2", String(hh - 2));
      fLine.setAttribute("stroke", "#ffffff"); fLine.setAttribute("stroke-width", "0.8"); fLine.setAttribute("opacity", "0.5");
      g.appendChild(fLine);

      // ゴム足（下部）
      for (const x of [-hw * 0.6, hw * 0.6]) {
        const foot = el("rect");
        foot.setAttribute("x", String(x - 4)); foot.setAttribute("y", String(hh));
        foot.setAttribute("width", "8"); foot.setAttribute("height", "3");
        foot.setAttribute("fill", stroke);
        g.appendChild(foot);
      }

      // 側面凹型ハンドル
      const handle = el("rect");
      handle.setAttribute("x", "-12"); handle.setAttribute("y", "-16");
      handle.setAttribute("width", "24"); handle.setAttribute("height", "32");
      handle.setAttribute("rx", "2"); handle.setAttribute("ry", "2");
      handle.setAttribute("fill", "#0f172a"); handle.setAttribute("stroke", stroke); handle.setAttribute("stroke-width", "0.5");
      g.appendChild(handle);

      const handleBar = el("line");
      handleBar.setAttribute("x1", "0"); handleBar.setAttribute("y1", "-10");
      handleBar.setAttribute("x2", "0"); handleBar.setAttribute("y2", "10");
      handleBar.setAttribute("stroke", "#475569"); handleBar.setAttribute("stroke-width", "1.5");
      g.appendChild(handleBar);
    }

  } else if (shape === "image") {
    // 画像オブジェクト（看板・スクリーン）の立面描画
    if (fixture && fixture.imageSrc) {
      const img = el("image");
      img.setAttribute("href", fixture.imageSrc);
      img.setAttribute("x", String(-hw));
      img.setAttribute("y", String(-hh));
      img.setAttribute("width", String(hw * 2));
      img.setAttribute("height", String(hh * 2));
      img.setAttribute("preserveAspectRatio", "none");
      g.appendChild(img);

      const border = el("rect");
      border.setAttribute("x", String(-hw));
      border.setAttribute("y", String(-hh));
      border.setAttribute("width", String(hw * 2));
      border.setAttribute("height", String(hh * 2));
      border.setAttribute("fill", "none");
      border.setAttribute("stroke", stroke);
      border.setAttribute("stroke-width", sw);
      g.appendChild(border);
    } else {
      const rect = el("rect");
      rect.setAttribute("x", String(-hw));
      rect.setAttribute("y", String(-hh));
      rect.setAttribute("width", String(hw * 2));
      rect.setAttribute("height", String(hh * 2));
      rect.setAttribute("fill", "#e2e8f0");
      rect.setAttribute("stroke", stroke);
      rect.setAttribute("stroke-width", sw);
      g.appendChild(rect);

      const text = el("text");
      text.setAttribute("x", "0");
      text.setAttribute("y", "3");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#64748b");
      text.setAttribute("font-size", "7");
      text.textContent = "画像なし";
      g.appendChild(text);
    }

  } else {
    // デフォルト: 角丸矩形 + カテゴリ色ドット
    const rect = el("rect");
    rect.setAttribute("x", String(-hw)); rect.setAttribute("y", String(-hh));
    rect.setAttribute("width", String(hw * 2)); rect.setAttribute("height", String(hh * 2));
    rect.setAttribute("rx", "2"); rect.setAttribute("ry", "2");
    rect.setAttribute("fill", fill); rect.setAttribute("stroke", stroke); rect.setAttribute("stroke-width", sw);
    g.appendChild(rect);
    const dot = el("circle");
    dot.setAttribute("cx", "0"); dot.setAttribute("cy", String(-hh + 5));
    dot.setAttribute("r", "3.5");
    dot.setAttribute("fill", color); dot.setAttribute("stroke", "#fff"); dot.setAttribute("stroke-width", "0.5");
    g.appendChild(dot);
  }
}

/**
 * 正面立面図・側面断面図を描画する
 * @param {SVGElement} parent 
 * @param {Array} fixtures 
 * @param {string|null} selectedId 
 * @param {string} viewType "front" | "side"
 * @param {Function} onSelect 
 * @param {Array} [library] 
 */
export function renderElevation(parent, fixtures, selectedId, viewType, onSelect, library = [], bgImage = null, showBeam = true) {
  parent.innerHTML = "";

  const W = 1000;
  const H = 700;
  if (parent.tagName && parent.tagName.toLowerCase() === "svg") {
    parent.setAttribute("viewBox", `0 0 ${W} ${H}`);
    parent.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }

  // 背景画像の描画（存在する場合）
  if (bgImage) {
    const bgImg = document.createElementNS("http://www.w3.org/2000/svg", "image");
    bgImg.setAttribute("href", bgImage);
    bgImg.setAttribute("x", "0");
    bgImg.setAttribute("y", "0");
    bgImg.setAttribute("width", String(W));
    bgImg.setAttribute("height", String(H));
    bgImg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    bgImg.setAttribute("opacity", "0.6");
    parent.appendChild(bgImg);
  }

  // スケール: 1mmあたり0.08px (12.5m x 8.75m の空間に相当)
  const s = 0.08;
  const floorY = 600; // 床面 Z=0 のY座標
  // 正面図: 中心が0m（左右対称）、側面図: 左端が0m
  const centerX = W / 2; // 500
  const originX = viewType === "front" ? centerX : 100;

  // 1. 高さ補助線 (1m間隔)
  for (let zMeter = 1; zMeter <= 6; zMeter++) {
    const zMm = zMeter * 1000;
    const y = floorY - zMm * s;

    const line = document.createElementNS(SVGNS, "line");
    line.setAttribute("x1", "50"); line.setAttribute("y1", String(y));
    line.setAttribute("x2", String(W - 50)); line.setAttribute("y2", String(y));
    line.setAttribute("class", "elevation-grid-line");
    parent.appendChild(line);

    const label = document.createElementNS(SVGNS, "text");
    label.setAttribute("x", "45");
    label.setAttribute("y", String(y + 3));
    label.setAttribute("text-anchor", "end");
    label.setAttribute("class", "elevation-text");
    label.textContent = `${zMeter}.0m`;
    parent.appendChild(label);
  }

  // 2. 横軸目盛り (1m間隔)
  if (viewType === "front") {
    // 正面図: 中心0m、左右±5m
    for (let meter = -5; meter <= 5; meter++) {
      const xMm = meter * 1000;
      const x = centerX + xMm * s;

      const line = document.createElementNS(SVGNS, "line");
      line.setAttribute("x1", String(x)); line.setAttribute("y1", "80");
      line.setAttribute("x2", String(x)); line.setAttribute("y2", String(floorY));
      line.setAttribute("class", "elevation-grid-line");
      if (meter === 0) line.setAttribute("class", "elevation-center-line");
      parent.appendChild(line);

      const label = document.createElementNS(SVGNS, "text");
      label.setAttribute("x", String(x));
      label.setAttribute("y", String(floorY + 15));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "elevation-text");
      label.textContent = `${meter}m`;
      parent.appendChild(label);
    }
  } else {
    // 側面図: 0mから10m
    for (let meter = 0; meter <= 10; meter++) {
      const xMm = meter * 1000;
      const x = originX + xMm * s;

      const line = document.createElementNS(SVGNS, "line");
      line.setAttribute("x1", String(x)); line.setAttribute("y1", "80");
      line.setAttribute("x2", String(x)); line.setAttribute("y2", String(floorY));
      line.setAttribute("class", "elevation-grid-line");
      parent.appendChild(line);

      const label = document.createElementNS(SVGNS, "text");
      label.setAttribute("x", String(x));
      label.setAttribute("y", String(floorY + 15));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "elevation-text");
      label.textContent = `${meter}m`;
      parent.appendChild(label);
    }
  }

  // 3. 床面 (Z=0)
  const floor = document.createElementNS(SVGNS, "line");
  floor.setAttribute("x1", "50"); floor.setAttribute("y1", String(floorY));
  floor.setAttribute("x2", String(W - 50)); floor.setAttribute("y2", String(floorY));
  floor.setAttribute("class", "elevation-floor-line");
  parent.appendChild(floor);

  // 4. 設置限界壁（側面図: Y=0 の左壁）
  if (viewType === "side") {
    const wall = document.createElementNS(SVGNS, "line");
    wall.setAttribute("x1", String(originX)); wall.setAttribute("y1", "80");
    wall.setAttribute("x2", String(originX)); wall.setAttribute("y2", String(floorY));
    wall.setAttribute("class", "elevation-floor-line");
    parent.appendChild(wall);
  }

  // 4. 各機材の描画（奥行き方向でソート: 奥の機材を先に描画し手前を上に重ねる）
  const sorted = [...fixtures].sort((a, b) => {
    if (viewType === "front") return (a.y || 0) - (b.y || 0);
    return (a.x || 0) - (b.x || 0);
  });
  sorted.forEach(f => {
    // 表示座標の計算
    // 正面図: 横軸 X, 縦軸 Z
    // 側面図: 横軸 Y, 縦軸 Z
    const coordX = viewType === "front" ? f.x : f.y;
    const coordZ = f.z || 0;

    const x_svg = originX + coordX * s;
    const y_svg = floorY - coordZ * s;

    // 図面範囲外の機材もクリップせずに描画できるようにする
    const isSelected = f.id === selectedId;

    // 機材サイズ (指定がない場合はデフォルト 400mm x 400mm)
    const libItem = library.find(l => l.type === f.type);
    const w = f.widthMm || libItem?.defaultWidth || 400;
    const d = f.depthMm || libItem?.defaultDepth || 400;
    const h_orig = f.heightMm || libItem?.defaultHeight || 400;

    // 舞台美術カテゴリ（長尺物）か指向性機材かで3D回転投影モデルを分岐
    const isStageArt = f.category === "stage" || libItem?.category === "stage" ||
      ["truss", "baton", "curtain", "backdrop", "riser", "hanamichi"].includes(libItem?.shape || "");

    const yawRad = (f.rotation || 0) * Math.PI / 180;
    const tiltRad = (f.pitch || 0) * Math.PI / 180;
    const rollRad = (f.roll || 0) * Math.PI / 180;

    let w_orig = w;
    let bodyRotation = 0;

    let projAngle = 0;
    if (isStageArt) {
      // --- 舞台美術の回転モデル (Z-Y-X オイラー角 & 合成ベクトル射影) ---

      // 左右方向ベクトル Ux, Uy, Uz (初期状態の長手方向はX軸)
      const Ux = Math.cos(yawRad) * Math.cos(rollRad) - Math.sin(yawRad) * Math.sin(tiltRad) * Math.sin(rollRad);
      const Uy = Math.sin(yawRad) * Math.cos(rollRad) + Math.cos(yawRad) * Math.sin(tiltRad) * Math.sin(rollRad);
      const Uz = -Math.cos(tiltRad) * Math.sin(rollRad);

      // 前後方向ベクトル Vx, Vy, Vz (初期状態の奥行き方向はY軸)
      const Vx = -Math.sin(yawRad) * Math.cos(tiltRad);
      const Vy = Math.cos(yawRad) * Math.cos(tiltRad);
      const Vz = Math.sin(tiltRad);

      if (viewType === "side") {
        // 側面図 (Y-Z面投影: 横軸は3DのY軸, 縦軸は3DのZ軸)
        const Lside = Math.sqrt(Math.max(0, Uy * Uy + Uz * Uz));
        w_orig = w * Lside + d * (1 - Lside);

        const blendSide = Math.min(1.0, (w * Lside) / 100.0);
        const Vsy = blendSide * Uy + (1 - blendSide) * Vy;
        const Vsz = blendSide * Uz + (1 - blendSide) * Vz;
        bodyRotation = Math.atan2(-Vsz, Vsy) * 180 / Math.PI;
      } else {
        // 正面図 (X-Z面投影: 横軸は3DのX軸, 縦軸は3DのZ軸)
        const Lfront = Math.sqrt(Math.max(0, Ux * Ux + Uz * Uz));
        w_orig = w * Lfront + d * (1 - Lfront);

        const blendFront = Math.min(1.0, (w * Lfront) / 100.0);
        const Vfx = blendFront * Ux + (1 - blendFront) * Vx;
        const Vfz = blendFront * Uz + (1 - blendFront) * Vz;
        bodyRotation = Math.atan2(-Vfz, Vfx) * 180 / Math.PI;
      }
    } else {
      // --- 指向性機器の回転モデル ---
      w_orig = viewType === "front"
        ? (w * Math.abs(Math.cos(yawRad)) + d * Math.abs(Math.sin(yawRad)))
        : (w * Math.abs(Math.sin(yawRad)) + d * Math.abs(Math.cos(yawRad)));

      // 初期状態で真下(0, 0, -1)を向いているビーム方向ベクトルの回転後
      const bx = -Math.cos(yawRad) * Math.sin(rollRad) - Math.sin(yawRad) * Math.sin(tiltRad) * Math.cos(rollRad);
      const by = -Math.sin(yawRad) * Math.sin(rollRad) + Math.cos(yawRad) * Math.sin(tiltRad) * Math.cos(rollRad);
      const bz = -Math.cos(tiltRad) * Math.cos(rollRad);

      // ビュー面への射影角度 (SVG座標: 真下=0°)
      if (viewType === "side") {
        projAngle = Math.atan2(by, -bz) * 180 / Math.PI;
        bodyRotation = projAngle;
      } else {
        projAngle = Math.atan2(bx, -bz) * 180 / Math.PI;
        bodyRotation = projAngle;
      }
    }

    const w_svg = w_orig * s;
    const h_svg = h_orig * s;

    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("transform", `translate(${x_svg}, ${y_svg - h_svg / 2}) rotate(${bodyRotation})`);
    g.setAttribute("class", "elevation-fixture");
    g.dataset.id = f.id;
    g.style.cursor = "pointer";
    g.style.pointerEvents = "all";

    // 機材形状の描画
    const shape = libItem?.shape || "default";
    const fillColor = isSelected ? "#eff6ff" : "#ffffff";
    const strokeColor = isSelected ? "#2563eb" : "#475569";
    const sw = isSelected ? "2.5" : "1.2";
    const color = libItem?.color || "#64748b";
    const hw = w_svg / 2;
    const hh = h_svg / 2;

    renderElevationShape(g, shape, hw, hh, fillColor, strokeColor, sw, color, viewType, f);

    // テキスト (Ch番号など)
    const labelTxt = document.createElementNS(SVGNS, "text");
    labelTxt.setAttribute("x", "0");
    labelTxt.setAttribute("y", String(hh + 8));
    labelTxt.setAttribute("text-anchor", "middle");
    labelTxt.setAttribute("font-size", "7");
    labelTxt.setAttribute("fill", "#0f172a");
    labelTxt.setAttribute("font-weight", isSelected ? "bold" : "500");
    labelTxt.textContent = f.ch ? `Ch${f.ch}` : f.type;
    g.appendChild(labelTxt);

    parent.appendChild(g);

    // 照射角ビームコーンの描画（照明カテゴリかつ beamAngle > 0 の場合）
    const beamAngle = f.beamAngle || 0;
    if (showBeam && beamAngle > 0 && (f.category === "lighting" || libItem?.category === "lighting")) {
      const beamLen = 3000 * s;
      const halfAngleRad = (beamAngle / 2) * Math.PI / 180;
      const projRad = bodyRotation * Math.PI / 180;

      // ビーム左端・右端の方向
      const leftRad = projRad - halfAngleRad;
      const rightRad = projRad + halfAngleRad;

      const lx = beamLen * Math.sin(leftRad);
      const ly = beamLen * Math.cos(leftRad);
      const rx = beamLen * Math.sin(rightRad);
      const ry = beamLen * Math.cos(rightRad);

      const beam = document.createElementNS(SVGNS, "polygon");
      const bx = x_svg;
      const by = y_svg - h_svg / 2;
      beam.setAttribute("points",
        `${bx},${by} ${bx + lx},${by + ly} ${bx + rx},${by + ry}`
      );
      beam.setAttribute("fill", (libItem?.color || "#e6a817") + "20");
      beam.setAttribute("stroke", (libItem?.color || "#e6a817") + "60");
      beam.setAttribute("stroke-width", "0.8");
      beam.setAttribute("stroke-dasharray", "4,3");
      beam.style.pointerEvents = "none";
      parent.appendChild(beam);
    }
  });
}
