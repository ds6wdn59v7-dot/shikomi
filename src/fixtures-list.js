import { FIXTURE_LIBRARY } from "./fixtures.js";

const CATEGORY_NAMES = {
  stage: "舞台",
  sound: "音響",
  lighting: "照明",
  video: "映像"
};

const CATEGORY_COLORS = {
  stage: "#595959",
  sound: "#1f6aa5",
  lighting: "#e6a817",
  video: "#1d9e75"
};

// HTMLエスケープヘルパー
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 全機材（標準＋カスタム）をマージして取得するヘルパー
function getMergedFixtures(customItems) {
  // 標準機材
  const builtIn = FIXTURE_LIBRARY.map(item => ({
    type: item.type,
    label: item.label,
    category: item.category,
    width: item.defaultWidth || 0,
    depth: item.defaultDepth || 0,
    height: item.defaultHeight || 0,
    watt: item.watt || 0,
    beamAngle: item.beamAngle || 0,
    isCustom: false,
    kind: item.kind || "",
    model: item.model || "",
    url: item.url || ""
  }));

  // カスタム機材
  const custom = (customItems || []).map(item => ({
    type: item.type,
    label: item.label || item.type,
    category: item.category,
    width: item.widthMm || item.defaultWidth || 0,
    depth: item.depthMm || item.defaultDepth || 0,
    height: item.heightMm || item.defaultHeight || 0,
    watt: item.watt || 0,
    beamAngle: item.beamAngle || 0,
    isCustom: true,
    kind: item.kind || "",
    model: item.model || "",
    url: item.url || ""
  }));

  // 「舞台」カテゴリは登録機材スペック一覧には載せない（造作物でありスペック管理対象外）
  return [...builtIn, ...custom].filter(item => item.category !== "stage");
}

// ファイルダウンロード用ヘルパー
function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// モーダルを開くメイン関数
export function openFixturesListModal(customItems, builtInLibrary) {
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const allFixtures = getMergedFixtures(customItems);
  let activeFilter = "all"; // 'all' | 'stage' | 'sound' | 'lighting' | 'video'

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });

  const dialog = document.createElement("div");
  dialog.className = "modal-dialog";
  dialog.style.cssText = "max-height: 90vh; overflow: hidden; width: 680px; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column;";
  overlay.appendChild(dialog);

  function renderModal() {
    dialog.innerHTML = "";

    // 1. ヘッダー
    const header = document.createElement("h2");
    header.style.cssText = "margin-top: 0; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;";
    header.textContent = "登録機材スペック一覧";

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => overlay.remove());
    header.appendChild(closeBtn);
    dialog.appendChild(header);

    // 2. 説明文
    const desc = document.createElement("p");
    desc.style.cssText = "font-size: 11px; color: #6b7280; margin: 0 0 12px 0;";
    desc.textContent = "エディタに定義されている標準機材および登録されたマイ機材の一覧です。他AIへのインプット用データの書き出しや、A4仕様書としての印刷に対応しています。";
    dialog.appendChild(desc);

    // 3. アクションツールバー (ダウンロード・印刷)
    const actionToolbar = document.createElement("div");
    actionToolbar.style.cssText = "display: flex; gap: 8px; margin-bottom: 16px; justify-content: flex-end;";

    const btnMarkdown = document.createElement("button");
    btnMarkdown.textContent = "📝 Markdown保存";
    btnMarkdown.style.cssText = "padding: 5px 10px; font-size: 11px; border-radius: 4px; border: 1px solid #10b981; background-color: #10b981; color: #fff; cursor: pointer;";
    btnMarkdown.addEventListener("click", () => downloadMarkdown(allFixtures));
    actionToolbar.appendChild(btnMarkdown);

    const btnJSON = document.createElement("button");
    btnJSON.textContent = "💾 JSON保存";
    btnJSON.style.cssText = "padding: 5px 10px; font-size: 11px; border-radius: 4px; border: 1px solid #3b82f6; background-color: #3b82f6; color: #fff; cursor: pointer;";
    btnJSON.addEventListener("click", () => downloadJSON(allFixtures));
    actionToolbar.appendChild(btnJSON);

    const btnPrint = document.createElement("button");
    btnPrint.textContent = "📄 仕様書PDF (A4)";
    btnPrint.style.cssText = "padding: 5px 10px; font-size: 11px; border-radius: 4px; border: 1px solid #4f46e5; background-color: #4f46e5; color: #fff; cursor: pointer;";
    btnPrint.addEventListener("click", () => printFixtures(allFixtures));
    actionToolbar.appendChild(btnPrint);

    dialog.appendChild(actionToolbar);

    // 4. カテゴリ選択タブ
    const filterContainer = document.createElement("div");
    filterContainer.style.cssText = "display: flex; gap: 4px; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;";
    
    const filterOptions = [
      { key: "all", label: "すべて" },
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

    // 5. テーブル部 (スクロール対応)
    const tableContainer = document.createElement("div");
    tableContainer.style.cssText = "flex: 1; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 6px; background-color: #fff;";

    const table = document.createElement("table");
    table.style.cssText = "width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;";
    
    // Thead
    const thead = document.createElement("thead");
    thead.style.cssText = "position: sticky; top: 0; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; z-index: 10;";
    thead.innerHTML = `
      <tr>
        <th style="padding: 10px; border-bottom: 1px solid #e5e7eb; width: 60px;">カテゴリ</th>
        <th style="padding: 10px; border-bottom: 1px solid #e5e7eb; width: 80px;">種別</th>
        <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">機材名</th>
        <th style="padding: 10px; border-bottom: 1px solid #e5e7eb; width: 100px;">型番</th>
        <th style="padding: 10px; border-bottom: 1px solid #e5e7eb; width: 150px;">寸法 (W×D×H mm)</th>
        <th style="padding: 10px; border-bottom: 1px solid #e5e7eb; width: 70px;">消費電力</th>
      </tr>
    `;
    table.appendChild(thead);

    // Tbody
    const tbody = document.createElement("tbody");
    const filtered = allFixtures.filter(item => activeFilter === "all" || item.category === activeFilter);

    if (filtered.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="6" style="padding: 20px; text-align: center; color: #9ca3af;">登録されている機材はありません</td>`;
      tbody.appendChild(row);
    } else {
      filtered.forEach(item => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid #f3f4f6";

        const sizeStr = item.width || item.depth || item.height
          ? `${item.width} × ${item.depth} × ${item.height}`
          : "-";
        
        const catColor = CATEGORY_COLORS[item.category] || "#6b7280";
        const catName = CATEGORY_NAMES[item.category] || item.category;
        const kindName = item.kind ? escapeHtml(item.kind) : "-";
        const labelName = escapeHtml(item.label);

        const modelHtml = item.model
          ? (item.url && (item.url.startsWith("http://") || item.url.startsWith("https://"))
              ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: underline;">${escapeHtml(item.model)}</a>`
              : escapeHtml(item.model))
          : "-";

        row.innerHTML = `
          <td style="padding: 8px 10px;">
            <span style="display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: bold; color: #fff; background-color: ${catColor};">
              ${catName}
            </span>
          </td>
          <td style="padding: 8px 10px;">${kindName}</td>
          <td style="padding: 8px 10px; font-weight: 600;">${labelName}</td>
          <td style="padding: 8px 10px;">${modelHtml}</td>
          <td style="padding: 8px 10px; font-family: monospace;">${sizeStr}</td>
          <td style="padding: 8px 10px;">${item.watt ? `${item.watt} W` : "-"}</td>
        `;
        tbody.appendChild(row);
      });
    }

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    dialog.appendChild(tableContainer);
  }

  renderModal();
  document.body.appendChild(overlay);
}

// Markdownの書き出しと保存
function downloadMarkdown(fixtures) {
  let md = "# 仕込み図エディタ (shikomi) 機材スペック仕様書\n\n";
  md += `出力日時: ${new Date().toLocaleString()}\n\n`;
  md += "本ドキュメントは仕込み図エディタに登録されている標準機材およびカスタム機材（マイ機材）の一覧です。他のAIエージェントへのインプット資料や、印刷・共有用として参照できます。\n\n";

  // カテゴリごとに整理
  const categories = ["stage", "sound", "lighting", "video"];
  categories.forEach(cat => {
    const list = fixtures.filter(f => f.category === cat);
    if (list.length === 0) return;

    md += `## ${CATEGORY_NAMES[cat]} 機材一覧 (${list.length} 件)\n\n`;
    md += "| 種別 | 機材名 | 型番 | 寸法 (幅×奥行×高さ mm) | 消費電力 (W) | 形状コード |\n";
    md += "| :--- | :--- | :--- | :--- | :---: | :---: |\n";

    list.forEach(item => {
      const sizeStr = item.width || item.depth || item.height
        ? `${item.width} × ${item.depth} × ${item.height}`
        : "-";
      const kindStr = item.kind || "-";
      const wattStr = item.watt ? `${item.watt} W` : "-";
      const modelStr = item.model
        ? (item.url && (item.url.startsWith("http://") || item.url.startsWith("https://"))
            ? `[${item.model}](${item.url})`
            : item.model)
        : "-";

      // 形状コードを特定するため、ライブラリ定義を逆引き
      const shapeCode = item.type === item.label ? item.type.toLowerCase().replace(/[^a-z0-9]/g, "_") : "-";

      md += `| ${kindStr} | ${item.label} | ${modelStr} | ${sizeStr} | ${wattStr} | \`${shapeCode}\` |\n`;
    });
    md += "\n";
  });

  const filename = `shikomi_fixtures_spec_${Date.now()}.md`;
  triggerDownload(md, filename, "text/markdown;charset=utf-8");
}

// JSONの書き出しと保存
function downloadJSON(fixtures) {
  const jsonStr = JSON.stringify(fixtures, null, 2);
  const filename = `shikomi_fixtures_spec_${Date.now()}.json`;
  triggerDownload(jsonStr, filename, "application/json;charset=utf-8");
}

// クリーン印刷画面の立ち上げ
function printFixtures(fixtures) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("ポップアップブロックが有効になっている可能性があります。ブロックを解除してください。");
    return;
  }

  // テーブルの行を組み立て
  let tbodyHtml = "";
  fixtures.forEach(item => {
    const sizeStr = item.width || item.depth || item.height
      ? `${item.width} × ${item.depth} × ${item.height}`
      : "-";
    const catName = CATEGORY_NAMES[item.category] || item.category;
    const kindStr = item.kind ? escapeHtml(item.kind) : "-";
    const wattStr = item.watt ? `${item.watt} W` : "-";
    const modelHtml = item.model
      ? (item.url && (item.url.startsWith("http://") || item.url.startsWith("https://"))
          ? `${escapeHtml(item.model)}<br><span style="font-size:8px;color:#6b7280;word-break:break-all;">${escapeHtml(item.url)}</span>`
          : escapeHtml(item.model))
      : "-";

    tbodyHtml += `
      <tr>
        <td><span class="badge badge-${item.category}">${catName}</span></td>
        <td>${kindStr}</td>
        <td style="font-weight:bold;">${escapeHtml(item.label)}</td>
        <td>${modelHtml}</td>
        <td>${sizeStr}</td>
        <td>${wattStr}</td>
      </tr>
    `;
  });

  // ドキュメントを構築して書き込み
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>仕込み図エディタ - 機材スペック一覧</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1f2937;
      margin: 30px;
      line-height: 1.5;
    }
    h1 {
      font-size: 22px;
      border-bottom: 2px solid #1f2937;
      padding-bottom: 10px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    h1 span.subtitle {
      font-size: 11px;
      color: #6b7280;
      font-weight: normal;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      page-break-inside: auto;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px 12px;
      font-size: 11px;
      text-align: left;
    }
    th {
      background-color: #f9fafb;
      font-weight: bold;
      color: #374151;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 9px;
      font-weight: bold;
      color: #fff;
    }
    .badge-stage { background-color: #595959; }
    .badge-sound { background-color: #1f6aa5; }
    .badge-lighting { background-color: #e6a817; }
    .badge-video { background-color: #1d9e75; }
    @media print {
      body { margin: 0; }
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
    }
  </style>
</head>
<body>
  <h1>
    <span>仕込み図エディタ - 機材スペック仕様書</span>
    <span class="subtitle">出力日時: ${new Date().toLocaleString()}</span>
  </h1>
  <table>
    <thead>
      <tr>
        <th style="width: 80px;">カテゴリ</th>
        <th style="width: 80px;">種別</th>
        <th>機材名</th>
        <th style="width: 120px;">型番</th>
        <th style="width: 160px;">寸法 (幅×奥行×高さ mm)</th>
        <th style="width: 90px;">消費電力</th>
      </tr>
    </thead>
    <tbody>
      ${tbodyHtml}
    </tbody>
  </table>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    }
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
