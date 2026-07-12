import { ZONE_KINDS } from "./zones.js";

const POS  = [
  { key: "x", label: "X",    type: "number", step: "1"   },
  { key: "y", label: "Y",    type: "number", step: "1"   },
  { key: "z", label: "Z mm", type: "number", step: "100" },
];
const ROT  = [
  { key: "rotation", label: "Yaw°",  type: "number", step: "15" },
  { key: "pitch",    label: "Tilt°", type: "number", step: "15" },
  { key: "roll",     label: "Roll°", type: "number", step: "15" },
];
const SIZE = [
  { key: "widthMm",  label: "W mm", type: "number", step: "100" },
  { key: "depthMm",  label: "D mm", type: "number", step: "100" },
  { key: "heightMm", label: "H mm", type: "number", step: "100" },
];

const PROP_GROUPS = {
  lighting: [
    { label: "位置", cols: 3, fields: POS },
    { label: "向き", cols: 3, fields: ROT },
    { label: "照射角", cols: 1, fields: [
      { key: "beamAngle", label: "照射角 (°)", type: "number", step: "5" },
    ]},
    { label: "DMX", cols: 2, fields: [
      { key: "ch",       label: "灯体No.",   type: "number", step: "any" },
      { key: "universe", label: "Univ", type: "select", options: ["", "1", "2", "3", "4", "5", "6", "7", "8"] },
      { key: "dmx",      label: "DMX",  type: "text" },
      { key: "mode",     label: "ch数",  type: "number", step: "1" },
    ]},
    { label: "電源", cols: 1, fields: [
      { key: "watt",    label: "W",   type: "number", step: "any" },
    ]},
    { label: "色 / 用途", cols: 2, fields: [
      { key: "color",   label: "色",   type: "text" },
      { key: "purpose", label: "用途", type: "text" },
    ]},
    { label: "サイズ", cols: 3, fields: SIZE },
    { label: "メモ",   cols: 1, fields: [
      { key: "note", label: "メモ", type: "text" },
    ]},
  ],
  stage: [
    { label: "位置", cols: 3, fields: POS },
    { label: "向き", cols: 3, fields: ROT },
    { label: "サイズ", cols: 3, fields: SIZE },
    { label: "その他", cols: 2, fields: [
      { key: "ch",      label: "灯体No.",   type: "number", step: "any" },
      { key: "purpose", label: "用途", type: "text" },
    ]},
    { label: "メモ", cols: 1, fields: [
      { key: "note", label: "メモ", type: "text" },
    ]},
  ],
  sound: [
    { label: "位置", cols: 3, fields: POS },
    { label: "向き", cols: 3, fields: ROT },
    { label: "設備", cols: 2, fields: [
      { key: "ch",   label: "灯体No.", type: "number", step: "any" },
      { key: "watt", label: "W",  type: "number", step: "any" },
    ]},
    { label: "用途", cols: 1, fields: [
      { key: "purpose", label: "用途", type: "text" },
    ]},
    { label: "メモ", cols: 1, fields: [
      { key: "note", label: "メモ", type: "text" },
    ]},
  ],
  video: [
    { label: "位置", cols: 3, fields: POS },
    { label: "向き", cols: 3, fields: ROT },
    { label: "設備", cols: 2, fields: [
      { key: "ch",   label: "灯体No.", type: "number", step: "any" },
      { key: "watt", label: "W",  type: "number", step: "any" },
    ]},
    { label: "用途", cols: 1, fields: [
      { key: "purpose", label: "用途", type: "text" },
    ]},
    { label: "メモ", cols: 1, fields: [
      { key: "note", label: "メモ", type: "text" },
    ]},
  ],
};

const ROT_KEYS = new Set(["rotation", "pitch", "roll"]);

export function renderProperties(container, fixture, onChange, allFixtures = [], connections = [], onConnectionChange = null) {
  container.innerHTML = "<div class='hint'>属性パネル</div>";
  if (!fixture) {
    const emptyMsg = document.createElement("div");
    emptyMsg.style.cssText = "padding: 10px 0; color: #666; font-size: 12px; text-align: center;";
    emptyMsg.textContent = "図面上の機材を選択してください";
    container.appendChild(emptyMsg);
    return;
  }

  const category = fixture.category || "lighting";
  const groups = PROP_GROUPS[category] || PROP_GROUPS.lighting;

  const typeHeader = document.createElement("div");
  typeHeader.style.cssText = "font-weight: bold; font-size: 13px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #ddd;";
  typeHeader.textContent = `${fixture.type} (${getCategoryLabel(category)})`;
  container.appendChild(typeHeader);

  function makeInput(field) {
    if (field.type === "select") {
      const select = document.createElement("select");
      select.className = "prop-input";
      select.addEventListener("keydown", e => e.stopPropagation());
      
      const options = field.options || [];
      for (const optVal of options) {
        const opt = document.createElement("option");
        opt.value = optVal;
        opt.textContent = optVal === "" ? "未設定" : optVal;
        if (String(fixture[field.key]) === String(optVal)) {
          opt.selected = true;
        }
        select.appendChild(opt);
      }
      
      select.addEventListener("change", () => {
        onChange(field.key, select.value);
      });
      return select;
    }

    const input = document.createElement("input");
    input.type = field.type;
    if (field.type === "number") input.step = field.step || "any";
    input.value = fixture[field.key] !== undefined ? fixture[field.key] : "";
    input.className = "prop-input";
    
    input.addEventListener("keydown", e => e.stopPropagation());
    // 入力中は再描画せず、確定時(フォーカスアウト / Enter / スピナー操作)のみ反映する
    input.addEventListener("change", () => {
      if (ROT_KEYS.has(field.key)) {
        const val = Number(input.value);
        if (!isNaN(val)) {
          const norm = (val % 360 + 360) % 360;
          input.value = String(norm);
          onChange(field.key, norm);
        }
        return;
      }
      onChange(field.key, field.type === "number" ? Number(input.value) : input.value);
    });
    setupInputAutoSelect(input);
    return input;
  }

  for (const group of groups) {
    const groupEl = document.createElement("div");
    groupEl.className = "prop-group";

    const groupLabel = document.createElement("div");
    groupLabel.className = "prop-group-label";
    groupLabel.textContent = group.label;
    groupEl.appendChild(groupLabel);

    if (group.cols === 1) {
      groupEl.appendChild(makeInput(group.fields[0]));
    } else {
      const row = document.createElement("div");
      row.className = `prop-row prop-row-${group.cols}`;
      for (const field of group.fields) {
        const cell = document.createElement("div");
        cell.className = "prop-cell";
        const cellLabel = document.createElement("div");
        cellLabel.className = "prop-cell-label";
        cellLabel.textContent = field.label;
        cell.appendChild(cellLabel);
        cell.appendChild(makeInput(field));
        row.appendChild(cell);
      }
      groupEl.appendChild(row);
    }

    container.appendChild(groupEl);
  }

  // 看板・スクリーンなど画像オブジェクト用のアップロードコントロールを追加
  if (fixture.type === "看板" || fixture.type === "スクリーン") {
    const imgGroup = document.createElement("div");
    imgGroup.className = "prop-group";
    
    const imgLabel = document.createElement("div");
    imgLabel.className = "prop-group-label";
    imgLabel.textContent = "画像オブジェクト設定";
    imgGroup.appendChild(imgLabel);

    const btnWrapper = document.createElement("div");
    btnWrapper.style.cssText = "display: flex; flex-direction: column; gap: 6px; margin-top: 4px;";

    if (fixture.imageSrc) {
      const preview = document.createElement("img");
      preview.src = fixture.imageSrc;
      preview.style.cssText = "max-width: 100%; max-height: 80px; object-fit: contain; border: 1px solid #ccc; border-radius: 4px;";
      btnWrapper.appendChild(preview);
    }

    const selectBtn = document.createElement("button");
    selectBtn.textContent = fixture.imageSrc ? "画像を変更..." : "画像を読み込む...";
    selectBtn.style.cssText = "padding: 6px; font-size: 11px; cursor: pointer; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; width: 100%;";
    selectBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/png,image/jpeg";
      input.onchange = () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          onChange("imageSrc", e.target.result);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
    btnWrapper.appendChild(selectBtn);

    if (fixture.imageSrc) {
      const clearBtn = document.createElement("button");
      clearBtn.textContent = "画像をクリア";
      clearBtn.style.cssText = "padding: 6px; font-size: 11px; cursor: pointer; border: 1px solid #ef4444; border-radius: 6px; background-color: #fef2f2; color: #b91c1c; width: 100%;";
      clearBtn.addEventListener("click", () => {
        if (confirm("画像を削除しますか？")) {
          onChange("imageSrc", null);
        }
      });
      btnWrapper.appendChild(clearBtn);
    }

    imgGroup.appendChild(btnWrapper);
    container.appendChild(imgGroup);
  }

  if ((category === "sound" || category === "video") && onConnectionChange) {
    renderConnectionManager(container, fixture, allFixtures, connections, onConnectionChange);
  }
}

function getCategoryLabel(category) {
  switch (category) {
    case "stage": return "舞台";
    case "sound": return "音響";
    case "lighting": return "照明";
    case "video": return "映像";
    default: return "その他";
  }
}

export function renderConnectionProperties(container, connection, fixtures, onConnectionChange) {
  container.innerHTML = "<div class='hint'>属性パネル</div>";
  if (!connection) return;

  const fromFixture = fixtures.find(f => f.id === connection.from);
  let toName = "不明";
  if (connection.to.startsWith("ext:")) {
    toName = connection.to.substring(4) + " (外部出力)";
  } else {
    const toFixture = fixtures.find(f => f.id === connection.to);
    toName = toFixture ? `[${getCategoryLabel(toFixture.category)}] ${toFixture.type}${toFixture.ch ? ` (Ch ${toFixture.ch})` : ""}` : "不明";
  }

  const header = document.createElement("div");
  header.style.cssText = "font-weight: bold; font-size: 14px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #ddd;";
  header.textContent = "回線接続 (シグナル)";
  container.appendChild(header);

  // 接続元・接続先の情報
  const info = document.createElement("div");
  info.style.cssText = "font-size: 12px; color: #475569; margin-bottom: 15px; line-height: 1.5;";
  info.innerHTML = `<strong>接続元:</strong> ${fromFixture ? `${fromFixture.type}${fromFixture.ch ? ` (Ch ${fromFixture.ch})` : ""}` : "不明"}<br/>` +
                   `<strong>接続先:</strong> ${toName}`;
  container.appendChild(info);

  // 回線ラベル入力
  const labelWrap = document.createElement("label");
  labelWrap.style.cssText = "display:block;margin:10px 0;font-size:12px";
  labelWrap.textContent = "回線名 (接続ラベル)";

  const input = document.createElement("input");
  input.type = "text";
  input.value = connection.label || "";
  input.style.cssText = "display:block;width:100%;margin-top:4px;padding:4px;font-size:12px;border:1px solid #ccc;border-radius:4px;";
  input.addEventListener("keydown", e => e.stopPropagation());
  input.addEventListener("input", () => {
    onConnectionChange("update_label", { connectionId: connection.id, label: input.value });
  });
  setupInputAutoSelect(input);
  labelWrap.appendChild(input);
  container.appendChild(labelWrap);

  // 接続削除ボタン
  const delBtn = document.createElement("button");
  delBtn.textContent = "接続を解除";
  delBtn.style.cssText = "width:100%;margin-top:15px;padding:6px;font-size:12px;background-color:#ef4444;color:#ffffff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;";
  delBtn.addEventListener("click", () => {
    if (confirm("この接続を解除しますか？")) {
      onConnectionChange("delete", { connectionId: connection.id });
    }
  });
  container.appendChild(delBtn);
}

function renderConnectionManager(container, fixture, allFixtures, connections, onConnectionChange) {
  if (!onConnectionChange) return;

  const title = document.createElement("div");
  title.style.cssText = "font-weight: bold; font-size: 13px; margin-top: 20px; padding-top: 10px; border-top: 1px dashed #ccc; color: #1e293b;";
  title.textContent = "シグナル接続 (出力先)";
  container.appendChild(title);

  // 現在接続されている出力先リスト
  const myOutputs = connections.filter(c => c.from === fixture.id);
  const listWrap = document.createElement("div");
  listWrap.style.cssText = "margin: 8px 0; font-size: 11px;";

  if (myOutputs.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText = "color: #94a3b8; font-style: italic;";
    empty.textContent = "接続先の出力はありません";
    listWrap.appendChild(empty);
  } else {
    myOutputs.forEach(c => {
      let name = "不明";
      if (c.to.startsWith("ext:")) {
        name = c.to.substring(4) + " (外部)";
      } else {
        const toFix = allFixtures.find(f => f.id === c.to);
        name = toFix ? `[${getCategoryLabel(toFix.category)}] ${toFix.type}${toFix.ch ? ` (Ch ${toFix.ch})` : ""}` : "不明";
      }

      const row = document.createElement("div");
      row.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 4px; border-bottom: 1px solid #f1f5f9;";

      const infoText = document.createElement("span");
      infoText.textContent = c.label ? `➔ ${name} [${c.label}]` : `➔ ${name}`;

      const delLink = document.createElement("span");
      delLink.style.cssText = "color: #ef4444; cursor: pointer; font-weight: bold; font-size: 10px; margin-left: 8px;";
      delLink.textContent = "解除";
      delLink.addEventListener("click", () => {
        onConnectionChange("delete", { connectionId: c.id });
      });

      row.appendChild(infoText);
      row.appendChild(delLink);
      listWrap.appendChild(row);
    });
  }
  container.appendChild(listWrap);

  // 新規接続追加フォーム
  const formWrap = document.createElement("div");
  formWrap.style.cssText = "margin-top: 12px; padding: 8px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;";

  const selectLabel = document.createElement("div");
  selectLabel.style.cssText = "font-size: 10px; color: #64748b; font-weight: 600; margin-bottom: 4px;";
  selectLabel.textContent = "新規接続先:";
  formWrap.appendChild(selectLabel);

  const select = document.createElement("select");
  select.style.cssText = "width: 100%; font-size: 11px; padding: 3px; border: 1px solid #cbd5e1; border-radius: 3px;";

  const optDefault = document.createElement("option");
  optDefault.value = "";
  optDefault.textContent = "-- 選択してください --";
  select.appendChild(optDefault);

  // 接続可能候補（自分以外の、音響または映像機材）
  const candidates = allFixtures.filter(f => 
    f.id !== fixture.id &&
    (f.category === "sound" || f.category === "video")
  );

  // カテゴリ順にソート
  candidates.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category, "ja");
    const chKey = ch => ch > 0 ? ch : Number.MAX_SAFE_INTEGER;
    return chKey(a.ch) - chKey(b.ch);
  });

  candidates.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = `[${getCategoryLabel(f.category)}] ${f.ch ? `Ch ${f.ch} (${f.type})` : f.type}`;
    select.appendChild(opt);
  });

  // 「その他（外部出力先）」を追加
  const optExternal = document.createElement("option");
  optExternal.value = "__custom_external__";
  optExternal.textContent = "[その他 (任意の外部出力先)]";
  select.appendChild(optExternal);

  formWrap.appendChild(select);

  // 外部出力先の手動入力テキストボックス (初期は非表示)
  const extNameWrap = document.createElement("div");
  extNameWrap.style.cssText = "display: none; margin-top: 6px;";

  const extNameLabel = document.createElement("div");
  extNameLabel.style.cssText = "font-size: 10px; color: #64748b; font-weight: 600; margin-bottom: 4px;";
  extNameLabel.textContent = "宛先名:";
  extNameWrap.appendChild(extNameLabel);

  const extNameInput = document.createElement("input");
  extNameInput.type = "text";
  extNameInput.placeholder = "YouTube配信, 録音デッキ等";
  extNameInput.style.cssText = "width: 100%; font-size: 11px; padding: 3px; border: 1px solid #cbd5e1; border-radius: 3px;";
  extNameInput.addEventListener("keydown", e => e.stopPropagation());
  setupInputAutoSelect(extNameInput);
  extNameWrap.appendChild(extNameInput);
  formWrap.appendChild(extNameWrap);

  // ドロップダウン切り替え時のトグル表示
  select.addEventListener("change", () => {
    if (select.value === "__custom_external__") {
      extNameWrap.style.display = "block";
    } else {
      extNameWrap.style.display = "none";
    }
  });

  // 回線名入力
  const nameLabel = document.createElement("div");
  nameLabel.style.cssText = "font-size: 10px; color: #64748b; font-weight: 600; margin: 6px 0 4px 0;";
  nameLabel.textContent = "回線名 (ラベル):";
  formWrap.appendChild(nameLabel);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Ch 1, Lch など";
  nameInput.style.cssText = "width: 100%; font-size: 11px; padding: 3px; border: 1px solid #cbd5e1; border-radius: 3px;";
  nameInput.addEventListener("keydown", e => e.stopPropagation());
  setupInputAutoSelect(nameInput);
  formWrap.appendChild(nameInput);

  // 追加ボタン
  const addBtn = document.createElement("button");
  addBtn.textContent = "接続を追加";
  addBtn.style.cssText = "width: 100%; margin-top: 8px; padding: 4px; font-size: 11px; background-color: #2563eb; color: #ffffff; border: none; border-radius: 3px; cursor: pointer; font-weight: 600;";
  addBtn.addEventListener("click", () => {
    const targetId = select.value;
    if (!targetId) {
      alert("接続先を選択してください");
      return;
    }
    if (targetId === "__custom_external__") {
      const extName = extNameInput.value.trim();
      if (!extName) {
        alert("宛先名を入力してください");
        return;
      }
      onConnectionChange("add", { to: `ext:${extName}`, label: nameInput.value });
    } else {
      onConnectionChange("add", { to: targetId, label: nameInput.value });
    }
  });
  formWrap.appendChild(addBtn);

  container.appendChild(formWrap);
}

export function renderProjectProperties(container, project, onChange) {
  container.innerHTML = "<div class='hint'>プロジェクト設定</div>";

  const meta = project.meta;

  const fields = [
    { key: "name", label: "図面名 (イベント名)", type: "text", val: meta.name },
    { key: "venue", label: "会場名", type: "text", val: meta.venue },
    { key: "eventDate", label: "開催日", type: "text", val: meta.eventDate },
    { key: "author", label: "作成者", type: "text", val: meta.author || "" },
    { key: "plotWidth", label: "図面の幅 (m)", type: "number", val: (meta.plotWidth || 10000) / 1000, step: "1" },
    { key: "plotHeight", label: "図面の奥行き (m)", type: "number", val: (meta.plotHeight || 8000) / 1000, step: "1" }
  ];

  for (const f of fields) {
    const wrap = document.createElement("label");
    wrap.style.cssText = "display:block;margin:10px 0;font-size:12px";
    wrap.textContent = f.label;

    const input = document.createElement("input");
    input.type = f.type;
    input.value = f.val;
    if (f.type === "number") {
      input.step = f.step || "any";
      input.min = "1";
    }
    input.style.cssText = "display:block;width:100%;margin-top:4px;padding:4px;font-size:12px;border:1px solid #ccc;border-radius:4px;";
    input.addEventListener("keydown", e => e.stopPropagation());
    // 入力中は再描画せず、確定時(フォーカスアウト / Enter / スピナー操作)のみ反映する
    if (f.type === "number") {
      input.addEventListener("change", () => {
        const num = Math.max(1, Number(input.value) || 1);
        input.value = num;
        meta[f.key] = num * 1000;
        onChange(f.key, num * 1000);
      });
    } else {
      input.addEventListener("change", () => {
        meta[f.key] = input.value;
        onChange(f.key, input.value);
      });
    }
    setupInputAutoSelect(input);

    wrap.appendChild(input);
    container.appendChild(wrap);
  }

  // 用紙サイズ (A4 / A3)
  const sizeWrap = document.createElement("label");
  sizeWrap.style.cssText = "display:block;margin:10px 0;font-size:12px";
  sizeWrap.textContent = "用紙サイズ (横向き)";

  const sizeSelect = document.createElement("select");
  sizeSelect.style.cssText = "display:block;width:100%;margin-top:4px;padding:4px;font-size:12px;border:1px solid #ccc;border-radius:4px;";
  for (const size of ["A4", "A3"]) {
    const opt = document.createElement("option");
    opt.value = size;
    opt.textContent = `${size} (横)`;
    if (meta.paperSize === size) opt.selected = true;
    sizeSelect.appendChild(opt);
  }
  sizeSelect.addEventListener("change", () => {
    meta.paperSize = sizeSelect.value;
    onChange("paperSize", sizeSelect.value);
  });
  sizeWrap.appendChild(sizeSelect);
  container.appendChild(sizeWrap);

  // 図面枠表示チェックボックス
  const borderWrap = document.createElement("label");
  borderWrap.style.cssText = "display:flex;align-items:center;gap:6px;margin:12px 0;font-size:12px;cursor:pointer;";
  
  const borderCheckbox = document.createElement("input");
  borderCheckbox.type = "checkbox";
  borderCheckbox.checked = !!meta.showBorder;
  borderCheckbox.style.cssText = "cursor:pointer;";
  borderCheckbox.addEventListener("change", () => {
    meta.showBorder = borderCheckbox.checked;
    onChange("showBorder", borderCheckbox.checked);
  });

  borderWrap.appendChild(borderCheckbox);
  borderWrap.appendChild(document.createTextNode("図面枠・表題欄を表示する"));
  container.appendChild(borderWrap);
}

function setupInputAutoSelect(input) {
  input.addEventListener("focus", () => {
    setTimeout(() => {
      input.select();
    }, 0);
  });
}

export function renderZoneProperties(container, zone, onChange) {
  container.innerHTML = "<div class='hint'>属性パネル（建物区画）</div>";

  const header = document.createElement("div");
  header.style.cssText = "font-weight: bold; font-size: 13px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #ddd;";
  header.textContent = `区画: ${zone.label || zone.kind}`;
  container.appendChild(header);

  function makeRow(labelText, inputEl) {
    const group = document.createElement("div");
    group.className = "prop-group";
    const label = document.createElement("div");
    label.className = "prop-group-label";
    label.textContent = labelText;
    group.appendChild(label);
    group.appendChild(inputEl);
    container.appendChild(group);
  }

  const kindSelect = document.createElement("select");
  kindSelect.className = "prop-input";
  kindSelect.addEventListener("keydown", e => e.stopPropagation());
  for (const kind of ZONE_KINDS) {
    const opt = document.createElement("option");
    opt.value = kind;
    opt.textContent = kind;
    if (zone.kind === kind) opt.selected = true;
    kindSelect.appendChild(opt);
  }
  kindSelect.addEventListener("change", () => onChange("kind", kindSelect.value));
  makeRow("種別", kindSelect);

  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.className = "prop-input";
  labelInput.value = zone.label || "";
  labelInput.addEventListener("keydown", e => e.stopPropagation());
  labelInput.addEventListener("change", () => onChange("label", labelInput.value));
  makeRow("ラベル", labelInput);

  const numRow = document.createElement("div");
  numRow.className = "prop-row prop-row-2";
  for (const [key, label] of [["x", "位置X(mm)"], ["y", "位置Y(mm)"]]) {
    const cell = document.createElement("div");
    cell.className = "prop-cell";
    const cellLabel = document.createElement("div");
    cellLabel.className = "prop-cell-label";
    cellLabel.textContent = label;
    cell.appendChild(cellLabel);
    const input = document.createElement("input");
    input.type = "number";
    input.className = "prop-input";
    input.value = zone[key];
    input.addEventListener("keydown", e => e.stopPropagation());
    input.addEventListener("change", () => onChange(key, Number(input.value)));
    cell.appendChild(input);
    numRow.appendChild(cell);
  }
  const numGroup = document.createElement("div");
  numGroup.className = "prop-group";
  const numGroupLabel = document.createElement("div");
  numGroupLabel.className = "prop-group-label";
  numGroupLabel.textContent = "位置";
  numGroup.appendChild(numGroupLabel);
  numGroup.appendChild(numRow);
  container.appendChild(numGroup);

  const sizeRow = document.createElement("div");
  sizeRow.className = "prop-row prop-row-2";
  for (const [key, label] of [["width", "幅(mm)"], ["height", "奥行き(mm)"]]) {
    const cell = document.createElement("div");
    cell.className = "prop-cell";
    const cellLabel = document.createElement("div");
    cellLabel.className = "prop-cell-label";
    cellLabel.textContent = label;
    cell.appendChild(cellLabel);
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.className = "prop-input";
    input.value = zone[key];
    input.addEventListener("keydown", e => e.stopPropagation());
    input.addEventListener("change", () => {
      const v = Math.max(1, Number(input.value));
      input.value = String(v);
      onChange(key, v);
    });
    cell.appendChild(input);
    sizeRow.appendChild(cell);
  }
  const sizeGroup = document.createElement("div");
  sizeGroup.className = "prop-group";
  const sizeGroupLabel = document.createElement("div");
  sizeGroupLabel.className = "prop-group-label";
  sizeGroupLabel.textContent = "寸法";
  sizeGroup.appendChild(sizeGroupLabel);
  sizeGroup.appendChild(sizeRow);
  container.appendChild(sizeGroup);

  const rotInput = document.createElement("input");
  rotInput.type = "number";
  rotInput.className = "prop-input";
  rotInput.value = zone.rotation;
  rotInput.addEventListener("keydown", e => e.stopPropagation());
  rotInput.addEventListener("change", () => {
    const norm = ((Number(rotInput.value) % 360) + 360) % 360;
    rotInput.value = String(norm);
    onChange("rotation", norm);
  });
  makeRow("回転(度)", rotInput);
}

