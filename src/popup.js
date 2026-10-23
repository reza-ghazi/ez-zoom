// EZ Zoom - settings popup

const DEFAULTS = {
  step: 1.5,
  maxZoom: 8,
  duration: 280,
  holdEnabled: true,
  modifier: "Control",
  hoverZoom: 2,
  follow: true
};

const $ = (id) => document.getElementById(id);
const stepEl = $("step");
const maxZoomEl = $("maxZoom");
const durationEl = $("duration");
const holdEnabledEl = $("holdEnabled");
const modifierEl = $("modifier");
const hoverZoomEl = $("hoverZoom");
const followEl = $("follow");
const savedEl = $("saved");

function render() {
  $("stepVal").textContent = parseFloat(stepEl.value).toFixed(1) + "\u00d7";
  $("maxZoomVal").textContent = parseInt(maxZoomEl.value, 10) + "\u00d7";
  $("durationVal").textContent = parseInt(durationEl.value, 10) + "ms";
  $("hoverZoomVal").textContent = parseFloat(hoverZoomEl.value).toFixed(1) + "\u00d7";
  $("holdGroup").classList.toggle("dim", !holdEnabledEl.checked);
}

let saveTimer = null;
function save() {
  render();
  const data = {
    step: parseFloat(stepEl.value),
    maxZoom: parseInt(maxZoomEl.value, 10),
    duration: parseInt(durationEl.value, 10),
    holdEnabled: holdEnabledEl.checked,
    modifier: modifierEl.value,
    hoverZoom: parseFloat(hoverZoomEl.value),
    follow: followEl.checked
  };
  chrome.storage.sync.set(data, () => {
    savedEl.classList.add("show");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => savedEl.classList.remove("show"), 1200);
  });
}

chrome.storage.sync.get(DEFAULTS, (items) => {
  stepEl.value = items.step;
  maxZoomEl.value = items.maxZoom;
  durationEl.value = items.duration;
  holdEnabledEl.checked = items.holdEnabled;
  modifierEl.value = items.modifier;
  hoverZoomEl.value = items.hoverZoom;
  followEl.checked = items.follow;
  render();
});

for (const el of [stepEl, maxZoomEl, durationEl, hoverZoomEl]) {
  el.addEventListener("input", save);
}
for (const el of [holdEnabledEl, modifierEl, followEl]) {
  el.addEventListener("change", save);
}

$("editShortcuts").addEventListener("click", () => {
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});
