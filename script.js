// ===== 日付ユーティリティ =====
function getDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDateWithWeekday(date) {
  const w = ["日","月","火","水","木","金","土"][date.getDay()];
  return `${getDateString(date)}（${w}）`;
}

// ===== 要素 =====
const today = new Date();
const todayStr = getDateString(today);

const dateEl = document.getElementById("date");
const statusEl = document.getElementById("status");

const todayView = document.getElementById("today-view");
const historyView = document.getElementById("history-view");

const tabToday = document.getElementById("tab-today");
const tabHistory = document.getElementById("tab-history");

const historyDateInput = document.getElementById("history-date");
const historyEdit = document.getElementById("history-edit");
const historyList = document.getElementById("history-list");

dateEl.textContent = getDateWithWeekday(today);

// ===== タブ切り替え =====
tabToday.onclick = () => {
  todayView.style.display = "block";
  historyView.style.display = "none";
};

tabHistory.onclick = () => {
  todayView.style.display = "none";
  historyView.style.display = "block";
  renderAllHistory();
};

// ===== 今日のチェック =====
const checkboxes = document.querySelectorAll("#today-view input[type='checkbox']");

checkboxes.forEach(cb => {
  const key = `medicine_${todayStr}_${cb.dataset.time}`;
  if (localStorage.getItem(key) === "done") cb.checked = true;

  cb.addEventListener("change", () => {
    cb.checked
      ? localStorage.setItem(key, "done")
      : localStorage.removeItem(key);
    updateStatus();
  });
});

function updateStatus() {
  if ([...checkboxes].every(cb => cb.checked)) {
    statusEl.textContent = "✔ 今日の薬はすべて記録済み";
    statusEl.className = "done";
  } else {
    statusEl.textContent = "";
    statusEl.className = "";
  }
}

// ===== 過去日の編集 =====
historyDateInput.addEventListener("change", () => {
  const dateStr = historyDateInput.value;
  if (!dateStr) return;

  historyEdit.innerHTML = "";

  ["morning","noon","evening"].forEach(time => {
    const key = `medicine_${dateStr}_${time}`;
    const checked = localStorage.getItem(key) === "done";

    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = checked;

    cb.onchange = () => {
      cb.checked
        ? localStorage.setItem(key, "done")
        : localStorage.removeItem(key);
      renderAllHistory();
    };

    label.appendChild(cb);
    label.append(` ${time === "morning" ? "朝" : time === "noon" ? "昼" : "夕"}`);
    historyEdit.appendChild(label);
    historyEdit.appendChild(document.createElement("br"));
  });
});

// ===== 全履歴表示 =====
function renderAllHistory() {
  historyList.innerHTML = "";

  const dates = new Set();

  Object.keys(localStorage).forEach(key => {
    const m = key.match(/^medicine_(\d{4}-\d{2}-\d{2})_/);
    if (m) dates.add(m[1]);
  });

  [...dates].sort().reverse().forEach(dateStr => {
    const d = new Date(dateStr);
    const text =
      `朝${localStorage.getItem(`medicine_${dateStr}_morning`) ? "✔" : "－"} ` +
      `昼${localStorage.getItem(`medicine_${dateStr}_noon`) ? "✔" : "－"} ` +
      `夕${localStorage.getItem(`medicine_${dateStr}_evening`) ? "✔" : "－"}`;

    const row = document.createElement("div");
    row.className = "history-row";
    row.textContent = `${getDateWithWeekday(d)}　${text}`;
    historyList.appendChild(row);
  });
}

updateStatus();
