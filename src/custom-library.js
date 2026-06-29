import { renderFixture } from "./fixtures.js";

export const STORAGE_KEY = "shikomi-custom-library";
export const OVERRIDES_KEY = "shikomi-builtin-overrides";

const VALID_CATEGORIES = ["stage", "sound", "lighting", "video"];

function getKindSuggestions(category, customItems, builtInLibrary) {
  const kinds = new Set();
  if (Array.isArray(builtInLibrary)) {
    builtInLibrary.forEach(item => {
      if (item.category === category && item.kind) {
        kinds.add(item.kind);
      }
    });
  }
  if (Array.isArray(customItems)) {
    customItems.forEach(item => {
      if (item.category === category && item.kind) {
        kinds.add(item.kind);
      }
    });
  }
  return Array.from(kinds);
}

export const ALL_SHAPES = [
  "circle", "diamond",
  "truss", "rect_bordered", "baton", "curtain", "backdrop", "riser", "stairs",
  "podium", "table", "chair", "mic_stand", "music_stand", "hanamichi", "torii",
  "speaker", "monitor", "mic", "console", "subwoofer", "line_array", "amp",
  "di_box", "wireless_rx", "stage_box", "in_ear", "delay_sp",
  "circle_spot", "rect_horiz", "led_bar", "smoke_machine", "smoke_jet",
  "screen", "projector", "camera", "switcher", "tripod", "sixbar1000", "liteparpro", "slim_par", "moving_wash_1915", "mini_moving_120", "led_strobe_200", "cob_zoom_par_300", "led_panel_500_1000", "speaker_elx200_15", "subwoofer_elx200_18sp", "speaker_elx200_12", "speaker_titan_8a", "console_l20r", "speaker_eon612", "speaker_ip500"
];

export function loadCustomLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomLibrary(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function loadBuiltinOverrides() {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveBuiltinOverrides(overrides) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
}

export function validateCustomItem(item, existingCustom, builtInLibrary, editingId = null) {
  if (!item.type || String(item.type).trim() === "") {
    return { valid: false, error: "機材名を入力してください" };
  }

  const name = String(item.type).trim();
  const isBuiltinEdit = String(editingId).startsWith("builtin-");
  const originalType = isBuiltinEdit ? editingId.substring("builtin-".length) : null;

  // 組み込み機材との名前衝突チェック
  const builtInConflict = builtInLibrary.some(b => {
    if (isBuiltinEdit && b.type === originalType) return false;
    return b.type === name || b.label === name;
  });
  if (builtInConflict) {
    return { valid: false, error: `「${name}」は組み込み機材と名前が重複しています` };
  }

  // カスタム機材との名前衝突チェック
  const customConflict = existingCustom.some(c => {
    if (!isBuiltinEdit && c.id === editingId) return false;
    return c.type === name;
  });
  if (customConflict) {
    return { valid: false, error: `「${name}」は既に登録済みのカスタム機材と名前が重複しています` };
  }

  if (!VALID_CATEGORIES.includes(item.category)) {
    return { valid: false, error: "有効なカテゴリを選択してください" };
  }

  return { valid: true, error: null };
}

export function addCustomItem(items, newItem, builtInLibrary) {
  const validation = validateCustomItem(newItem, items, builtInLibrary);
  if (!validation.valid) {
    return { items, error: validation.error };
  }

  const entry = {
    id: crypto.randomUUID(),
    type: String(newItem.type).trim(),
    label: String(newItem.type).trim(),
    color: newItem.color || "#666666",
    shape: newItem.shape || "circle",
    category: newItem.category,
    defaultWidth: Number(newItem.defaultWidth) || 0,
    defaultDepth: Number(newItem.defaultDepth) || 0,
    defaultHeight: Number(newItem.defaultHeight) || 0,
    watt: Number(newItem.watt) || 0,
    beamAngle: Number(newItem.beamAngle) || 0,
    channels: Number(newItem.channels) || 1,
    kind: String(newItem.kind || "").trim(),
    model: String(newItem.model || "").trim(),
    url: String(newItem.url || "").trim()
  };

  return { items: [...items, entry], error: null };
}

export function updateCustomItem(items, id, updates, builtInLibrary) {
  const idx = items.findIndex(i => i.id === id);
  if (idx < 0) {
    return { items, error: "対象のカスタム機材が見つかりません" };
  }

  const merged = { ...items[idx], ...updates };
  if (updates.type !== undefined) {
    merged.type = String(updates.type).trim();
    merged.label = merged.type;
  }

  const validation = validateCustomItem(merged, items, builtInLibrary, id);
  if (!validation.valid) {
    return { items, error: validation.error };
  }

  const newItems = [...items];
  newItems[idx] = merged;
  return { items: newItems, error: null };
}

export function deleteCustomItem(items, id, fixtures) {
  const target = items.find(i => i.id === id);
  if (!target) {
    return { items, error: "対象のカスタム機材が見つかりません" };
  }

  const inUse = fixtures.some(f => f.type === target.type);
  if (inUse) {
    return { items, error: `「${target.type}」は配置図で使用中のため削除できません` };
  }

  return { items: items.filter(i => i.id !== id), error: null };
}

const CAT_LABELS = { stage: "舞台", sound: "音響", lighting: "照明", video: "映像" };
const SVGNS = "http://www.w3.org/2000/svg";

export function openCustomLibraryModal(customItems, builtInLibrary, fixtures, onUpdate) {
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  let items = [...customItems];
  let editingId = null;
  let activeFilter = "all"; // 'all' | 'stage' | 'sound' | 'lighting' | 'video'

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });

  const dialog = document.createElement("div");
  dialog.className = "modal-dialog";
  dialog.style.cssText = "max-height: 90vh; overflow-y: auto; width: 520px; padding: 20px; box-sizing: border-box;";
  overlay.appendChild(dialog);

  function renderModal() {
    dialog.innerHTML = "";

    const header = document.createElement("h2");
    header.textContent = "マイ機材ライブラリ";
    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => overlay.remove());
    header.appendChild(closeBtn);
    dialog.appendChild(header);

    // カテゴリ選択スイッチ（タブ風フィルタ）の作成
    const filterContainer = document.createElement("div");
    filterContainer.style.cssText = "display: flex; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;";
    
    const filterOptions = [
      { key: "all", label: "すべて" },
      { key: "stage", label: "舞台" },
      { key: "sound", label: "音響" },
      { key: "lighting", label: "照明" },
      { key: "video", label: "映像" }
    ];

    filterOptions.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt.label;
      btn.style.cssText = `
        padding: 4px 12px;
        font-size: 12px;
        border-radius: 4px;
        border: 1px solid ${activeFilter === opt.key ? "#2563eb" : "#d1d5db"};
        background-color: ${activeFilter === opt.key ? "#2563eb" : "#fff"};
        color: ${activeFilter === opt.key ? "#fff" : "#374151"};
        cursor: pointer;
        transition: all 0.15s ease;
      `;
      btn.addEventListener("click", () => {
        activeFilter = opt.key;
        renderModal();
      });
      filterContainer.appendChild(btn);
    });
    dialog.appendChild(filterContainer);

    const addBtn = document.createElement("button");
    addBtn.textContent = "＋ 新規カスタム機材を登録";
    addBtn.style.cssText = "margin-bottom: 16px; background-color: #10b981; color: #fff; border-color: #10b981;";
    addBtn.addEventListener("click", () => { editingId = null; renderForm(); });
    dialog.appendChild(addBtn);

    // --- カスタム機材セクション ---
    const customTitle = document.createElement("h3");
    customTitle.textContent = "マイカスタム機材";
    customTitle.style.cssText = "font-size: 13px; font-weight: bold; margin: 12px 0 6px 0; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px;";
    dialog.appendChild(customTitle);

    const customList = document.createElement("div");
    customList.style.cssText = "margin-bottom: 16px;";
    dialog.appendChild(customList);

    // フィルタ適用
    const filteredCustom = items.filter(item => activeFilter === "all" || item.category === activeFilter);

    if (filteredCustom.length === 0) {
      const empty = document.createElement("div");
      empty.style.cssText = "color: #9ca3af; font-size: 12px; text-align: center; padding: 10px;";
      empty.textContent = "該当するカスタム機材はありません";
      customList.appendChild(empty);
    } else {
      filteredCustom.forEach(item => {
        const row = document.createElement("div");
        row.className = "modal-list-item";

        const info = document.createElement("div");
        info.className = "item-info";
        const dot = document.createElement("span");
        dot.className = "color-dot";
        dot.style.backgroundColor = item.color;
        info.appendChild(dot);
        const name = document.createElement("span");
        name.textContent = `${item.type} (${CAT_LABELS[item.category] || item.category})`;
        info.appendChild(name);
        row.appendChild(info);

        const actions = document.createElement("div");
        actions.className = "item-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "編集";
        editBtn.addEventListener("click", () => { editingId = item.id; renderForm(item, false); });
        actions.appendChild(editBtn);

        const delBtn = document.createElement("button");
        delBtn.textContent = "削除";
        delBtn.style.cssText = "background-color: #ef4444; color: #fff; border-color: #ef4444; margin-left: 4px;";
        delBtn.addEventListener("click", () => {
          const result = deleteCustomItem(items, item.id, fixtures);
          if (result.error) {
            alert(result.error);
          } else {
            items = result.items;
            saveCustomLibrary(items);
            onUpdate(items);
            renderModal();
          }
        });
        actions.appendChild(delBtn);

        row.appendChild(actions);
        customList.appendChild(row);
      });
    }

    // --- 標準機材セクション ---
    const builtinTitle = document.createElement("h3");
    builtinTitle.textContent = "標準機材の初期値カスタマイズ / 削除";
    builtinTitle.style.cssText = "font-size: 13px; font-weight: bold; margin: 20px 0 6px 0; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px;";
    dialog.appendChild(builtinTitle);

    const builtinContainer = document.createElement("div");
    builtinContainer.style.cssText = "max-height: 220px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 4px; padding: 4px; background-color: #f9fafb;";
    
    const overrides = loadBuiltinOverrides();

    // マージされた最新の状態を取得（削除フラグがあるものも含めて一覧に表示する）
    const activeBuiltin = builtInLibrary.map(b => {
      const over = overrides[b.type];
      return over ? { ...b, ...over } : { ...b };
    });

    // フィルタ適用
    const filteredBuiltin = activeBuiltin.filter(item => activeFilter === "all" || item.category === activeFilter);

    if (filteredBuiltin.length === 0) {
      const empty = document.createElement("div");
      empty.style.cssText = "color: #9ca3af; font-size: 12px; text-align: center; padding: 10px;";
      empty.textContent = "該当する標準機材はありません";
      builtinContainer.appendChild(empty);
    } else {
      filteredBuiltin.forEach(item => {
        const row = document.createElement("div");
        row.className = "modal-list-item";
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; border-bottom: 1px solid #f3f4f6;";

        const info = document.createElement("div");
        info.className = "item-info";
        info.style.cssText = "display: flex; align-items: center; gap: 6px;";
        
        const dot = document.createElement("span");
        dot.className = "color-dot";
        dot.style.backgroundColor = item.color;
        if (item.deleted) dot.style.backgroundColor = "#d1d5db";
        info.appendChild(dot);

        const name = document.createElement("span");
        const hasOverride = !!overrides[item.originalType || item.type];
        const isDeleted = item.deleted;

        name.textContent = `${item.type} (${CAT_LABELS[item.category] || item.category})${isDeleted ? " (❌削除済)" : (hasOverride ? " ⭐️調整済" : "")}`;
        if (isDeleted) {
          name.style.color = "#9ca3af";
          name.style.textDecoration = "line-through";
        } else if (hasOverride) {
          name.style.fontWeight = "bold";
          name.style.color = "#2563eb";
        }
        info.appendChild(name);
        row.appendChild(info);

        const actions = document.createElement("div");
        actions.className = "item-actions";

        if (isDeleted) {
          // 復元ボタン
          const restoreBtn = document.createElement("button");
          restoreBtn.textContent = "復元";
          restoreBtn.style.cssText = "background-color: #10b981; color: #fff; border-color: #10b981;";
          restoreBtn.addEventListener("click", () => {
            const ovs = loadBuiltinOverrides();
            if (ovs[item.originalType]) {
              delete ovs[item.originalType].deleted;
              // 他のカスタマイズ値が何もない場合はオブジェクトごと削除する
              if (Object.keys(ovs[item.originalType]).length === 0) {
                delete ovs[item.originalType];
              }
            }
            saveBuiltinOverrides(ovs);
            onUpdate(items);
            renderModal();
          });
          actions.appendChild(restoreBtn);
        } else {
          // 通常の標準機材編集・削除ボタン
          const editBtn = document.createElement("button");
          editBtn.textContent = "編集";
          editBtn.addEventListener("click", () => {
            editingId = `builtin-${item.originalType || item.type}`;
            renderForm(item, true);
          });
          actions.appendChild(editBtn);

          const delBtn = document.createElement("button");
          delBtn.textContent = "削除";
          delBtn.style.cssText = "background-color: #ef4444; color: #fff; border-color: #ef4444; margin-left: 4px;";
          delBtn.addEventListener("click", () => {
            // 図面で使用中かチェック
            const keyToCheck = item.originalType || item.type;
            const inUse = fixtures.some(f => f.type === item.type || f.type === keyToCheck);
            if (inUse) {
              alert(`「${item.type}」は配置図で使用中のため削除できません`);
              return;
            }
            
            if (confirm(`標準機材「${item.type}」をパレットおよびリストから削除しますか？`)) {
              const ovs = loadBuiltinOverrides();
              if (!ovs[keyToCheck]) ovs[keyToCheck] = {};
              ovs[keyToCheck].deleted = true;
              saveBuiltinOverrides(ovs);
              onUpdate(items);
              renderModal();
            }
          });
          actions.appendChild(delBtn);

          if (hasOverride) {
            const resetBtn = document.createElement("button");
            resetBtn.textContent = "リセット";
            resetBtn.style.cssText = "background-color: #6b7280; color: #fff; border-color: #6b7280; margin-left: 4px;";
            resetBtn.addEventListener("click", () => {
              const ovs = loadBuiltinOverrides();
              delete ovs[keyToCheck];
              saveBuiltinOverrides(ovs);
              onUpdate(items); // 親ライブラリ更新
              renderModal();
            });
            actions.appendChild(resetBtn);
          }
        }

        row.appendChild(actions);
        builtinContainer.appendChild(row);
      });
    }
    dialog.appendChild(builtinContainer);
  }

  function renderForm(existingItem = null, isBuiltin = false) {
    const oldForm = dialog.querySelector(".modal-form");
    if (oldForm) oldForm.remove();

    const form = document.createElement("div");
    form.className = "modal-form";
    form.style.cssText = "margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;";

    const formTitle = document.createElement("div");
    formTitle.style.cssText = "font-weight: 600; font-size: 13px; margin-bottom: 12px; color: #1e3a8a;";
    formTitle.textContent = isBuiltin 
      ? `【標準】${existingItem.type} の全項目を編集` 
      : (existingItem ? "カスタム機材を編集" : "新規カスタム機材を登録");
    form.appendChild(formTitle);

    // 機材名
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "機材名";
    form.appendChild(nameLabel);
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = existingItem ? existingItem.type : "";
    nameInput.addEventListener("keydown", e => e.stopPropagation());
    form.appendChild(nameInput);

    // カテゴリ
    const catLabel = document.createElement("label");
    catLabel.textContent = "カテゴリ";
    form.appendChild(catLabel);
    const catSelect = document.createElement("select");
    [["stage", "舞台"], ["sound", "音響"], ["lighting", "照明"], ["video", "映像"]].forEach(([val, text]) => {
      const opt = document.createElement("option");
      opt.value = val; opt.textContent = text;
      if (existingItem && existingItem.category === val) opt.selected = true;
      catSelect.appendChild(opt);
    });
    form.appendChild(catSelect);

    // 種別
    const kindLabel = document.createElement("label");
    kindLabel.textContent = "種別";
    form.appendChild(kindLabel);
    const kindInput = document.createElement("input");
    kindInput.type = "text";
    kindInput.setAttribute("list", "custom-kind-suggestions");
    kindInput.value = existingItem ? (existingItem.kind || "") : "";
    kindInput.addEventListener("keydown", e => e.stopPropagation());
    form.appendChild(kindInput);

    const kindDatalist = document.createElement("datalist");
    kindDatalist.id = "custom-kind-suggestions";
    form.appendChild(kindDatalist);

    function updateKindSuggestions() {
      kindDatalist.innerHTML = "";
      const suggestions = getKindSuggestions(catSelect.value, items, builtInLibrary);
      suggestions.forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        kindDatalist.appendChild(opt);
      });
    }
    catSelect.addEventListener("change", updateKindSuggestions);
    updateKindSuggestions();

    // 型番
    const modelLabel = document.createElement("label");
    modelLabel.textContent = "型番";
    form.appendChild(modelLabel);
    const modelInput = document.createElement("input");
    modelInput.type = "text";
    modelInput.value = existingItem ? (existingItem.model || "") : "";
    modelInput.addEventListener("keydown", e => e.stopPropagation());
    form.appendChild(modelInput);

    // 参考URL
    const urlLabel = document.createElement("label");
    urlLabel.textContent = "参考URL";
    form.appendChild(urlLabel);
    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.value = existingItem ? (existingItem.url || "") : "";
    urlInput.addEventListener("keydown", e => e.stopPropagation());
    form.appendChild(urlInput);

    // カラー
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "テーマカラー";
    form.appendChild(colorLabel);
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = existingItem ? existingItem.color : "#666666";
    form.appendChild(colorInput);

    // 形状
    const shapeLabel = document.createElement("label");
    shapeLabel.textContent = "形状";
    form.appendChild(shapeLabel);
    const shapeSelect = document.createElement("select");
    ALL_SHAPES.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s; opt.textContent = s;
      if (existingItem && existingItem.shape === s) opt.selected = true;
      shapeSelect.appendChild(opt);
    });
    form.appendChild(shapeSelect);

    // 形状プレビュー
    const previewBox = document.createElement("div");
    previewBox.className = "shape-preview-box";
    previewBox.style.cssText = "margin: 10px 0;";
    form.appendChild(previewBox);

    function updatePreview() {
      previewBox.innerHTML = "";
      const svgEl = document.createElementNS(SVGNS, "svg");
      svgEl.setAttribute("width", "80");
      svgEl.setAttribute("height", "60");
      svgEl.setAttribute("viewBox", "-30 -25 60 50");
      const fakeDef = { type: "__preview__", color: colorInput.value, shape: shapeSelect.value, category: catSelect.value };
      const fakeFixture = { id: "preview", type: "__preview__", x: 0, y: 0, rotation: 0, ch: 0, widthMm: 0, depthMm: 0, heightMm: 0 };
      renderFixture(svgEl, fakeFixture, false, 0, [fakeDef]);
      previewBox.appendChild(svgEl);
    }
    shapeSelect.addEventListener("change", updatePreview);
    colorInput.addEventListener("input", updatePreview);
    updatePreview();

    // 幅・奥行
    const sizeRow = document.createElement("div");
    sizeRow.className = "form-row";

    const wLabel = document.createElement("label");
    wLabel.textContent = "デフォルト幅 (mm)";
    const wInput = document.createElement("input");
    wInput.type = "number"; wInput.value = existingItem ? (existingItem.defaultWidth || 0) : 0;
    wInput.addEventListener("keydown", e => e.stopPropagation());

    const dLabel = document.createElement("label");
    dLabel.textContent = "デフォルト奥行 (mm)";
    const dInput = document.createElement("input");
    dInput.type = "number"; dInput.value = existingItem ? (existingItem.defaultDepth || 0) : 0;
    dInput.addEventListener("keydown", e => e.stopPropagation());

    const wWrap = document.createElement("div");
    wWrap.appendChild(wLabel); wWrap.appendChild(wInput);
    const dWrap = document.createElement("div");
    dWrap.appendChild(dLabel); dWrap.appendChild(dInput);
    sizeRow.appendChild(wWrap); sizeRow.appendChild(dWrap);
    form.appendChild(sizeRow);

    // 高さ・消費電力
    const sizeRow2 = document.createElement("div");
    sizeRow2.className = "form-row";

    const hLabel = document.createElement("label");
    hLabel.textContent = "デフォルト高さ (mm)";
    const hInput = document.createElement("input");
    hInput.type = "number"; hInput.value = existingItem ? (existingItem.defaultHeight || 0) : 0;
    hInput.addEventListener("keydown", e => e.stopPropagation());

    const wattLabel = document.createElement("label");
    wattLabel.textContent = "初期消費電力 (W)";
    const wattInput = document.createElement("input");
    wattInput.type = "number"; wattInput.value = existingItem ? (existingItem.watt || 0) : 0;
    wattInput.addEventListener("keydown", e => e.stopPropagation());

    const hWrap = document.createElement("div");
    hWrap.appendChild(hLabel); hWrap.appendChild(hInput);
    const wattWrap = document.createElement("div");
    wattWrap.appendChild(wattLabel); wattWrap.appendChild(wattInput);
    sizeRow2.appendChild(hWrap); sizeRow2.appendChild(wattWrap);
    form.appendChild(sizeRow2);

    // ビーム角・ch数 (照明機材など用)
    const sizeRow3 = document.createElement("div");
    sizeRow3.className = "form-row";

    const beamLabel = document.createElement("label");
    beamLabel.textContent = "初期照射角 (°)";
    const beamInput = document.createElement("input");
    beamInput.type = "number"; beamInput.value = existingItem ? (existingItem.beamAngle || 0) : 0;
    beamInput.addEventListener("keydown", e => e.stopPropagation());

    const chsLabel = document.createElement("label");
    chsLabel.textContent = "初期ch数";
    const chsInput = document.createElement("input");
    chsInput.type = "number"; chsInput.value = existingItem ? (existingItem.channels || 1) : 1;
    chsInput.addEventListener("keydown", e => e.stopPropagation());

    const beamWrap = document.createElement("div");
    beamWrap.appendChild(beamLabel); beamWrap.appendChild(beamInput);
    const chsWrap = document.createElement("div");
    chsWrap.appendChild(chsLabel); chsWrap.appendChild(chsInput);
    sizeRow3.appendChild(beamWrap); sizeRow3.appendChild(chsWrap);
    form.appendChild(sizeRow3);

    const btnRow = document.createElement("div");
    btnRow.className = "form-actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "キャンセル";
    cancelBtn.addEventListener("click", () => form.remove());
    btnRow.appendChild(cancelBtn);

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "保存";
    saveBtn.style.cssText = "background-color: #2563eb; color: #fff; border-color: #2563eb;";
    saveBtn.addEventListener("click", () => {
      const typeVal = nameInput.value.trim();
      const catVal = catSelect.value;
      const colorVal = colorInput.value;
      const shapeVal = shapeSelect.value;
      const wattVal = Number(wattInput.value) || 0;
      const wVal = Number(wInput.value) || 0;
      const dVal = Number(dInput.value) || 0;
      const hVal = Number(hInput.value) || 0;
      const beamVal = Number(beamInput.value) || 0;
      const chsVal = Number(chsInput.value) || 1;
      const kindVal = kindInput.value.trim();
      const modelVal = modelInput.value.trim();
      const urlVal = urlInput.value.trim();

      // 重複チェック用の仮オブジェクト
      const tempItem = { type: typeVal, category: catVal };
      const validation = validateCustomItem(tempItem, items, builtInLibrary, editingId);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      if (isBuiltin) {
        // 標準機材のオーバーライド保存 (キーは既存 of originalType を用いる)
        const key = existingItem.originalType || existingItem.type;
        const ovs = loadBuiltinOverrides();
        ovs[key] = {
          type: typeVal,
          label: typeVal,
          category: catVal,
          color: colorVal,
          shape: shapeVal,
          defaultWidth: wVal,
          defaultDepth: dVal,
          defaultHeight: hVal,
          watt: wattVal,
          beamAngle: beamVal,
          channels: chsVal,
          kind: kindVal,
          model: modelVal,
          url: urlVal
        };
        saveBuiltinOverrides(ovs);
        onUpdate(items); // ライブラリマージの通知
        renderModal();
      } else {
        // カスタム機材の保存
        const data = {
          type: typeVal,
          color: colorVal,
          shape: shapeVal,
          category: catVal,
          defaultWidth: wVal,
          defaultDepth: dVal,
          defaultHeight: hVal,
          watt: wattVal,
          beamAngle: beamVal,
          channels: chsVal,
          kind: kindVal,
          model: modelVal,
          url: urlVal
        };

        let result;
        if (editingId) {
          result = updateCustomItem(items, editingId, data, builtInLibrary);
        } else {
          result = addCustomItem(items, data, builtInLibrary);
        }

        if (result.error) {
          alert(result.error);
          return;
        }

        items = result.items;
        editingId = null;
        saveCustomLibrary(items);
        onUpdate(items);
        renderModal();
      }
    });
    btnRow.appendChild(saveBtn);

    form.appendChild(btnRow);
    dialog.appendChild(form);
  }

  renderModal();
  document.body.appendChild(overlay);
}
