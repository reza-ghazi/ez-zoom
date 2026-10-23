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

// ---------- One-time rating card ----------
// Shown after REVIEW_THRESHOLD zooms (counted locally by content.js); either button hides it for good.
const REVIEW_THRESHOLD = 15; // keep in sync with content.js
const REVIEW_URL = "https://chromewebstore.google.com/detail/ez-zoom/njbbgpolfnghieffmiicbfcmapdakpdl/reviews";

chrome.storage.local.get({ usageCount: 0, reviewCardDone: false }, ({ usageCount, reviewCardDone }) => {
  $("reviewCard").hidden = reviewCardDone || usageCount < REVIEW_THRESHOLD;
});

function closeReviewCard() {
  chrome.storage.local.set({ reviewCardDone: true });
  $("reviewCard").hidden = true;
}
$("rateReview").addEventListener("click", () => {
  closeReviewCard();
  chrome.tabs.create({ url: REVIEW_URL });
});
$("dismissReview").addEventListener("click", closeReviewCard);
