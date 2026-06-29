const KEY = "lpa.autosave";

export function downloadJson(text, filename) {
  const blob = new Blob([text], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsText(file);
  });
}

let _autosaveTimer = null;
export function autosave(text) {
  clearTimeout(_autosaveTimer);
  _autosaveTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, text);
    } catch (e) {
      // 容量超過などは無視（明示的なJSON保存で永続化可能）
    }
  }, 400);
}

export function loadAutosave() {
  return localStorage.getItem(KEY);
}
