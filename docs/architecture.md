# Architecture

EZ Zoom is a plain Manifest V3 extension: no build step, no dependencies, no framework. The files in `src/` are exactly what ships.

| File | Role |
|---|---|
| `src/manifest.json` | Name, version, permissions (`storage` only), keyboard commands, content-script registration |
| `src/background.js` | Service worker. Relays `chrome.commands` (keyboard shortcuts) to the active tab's content script |
| `src/content.js` | All zoom behavior. Runs on every page at `document_start`, top frame only |
| `src/popup.html`, `src/popup.js` | Settings UI. Writes to `chrome.storage.sync`; content scripts pick up changes live |
| `src/icons/` | Toolbar and store icons (16, 32, 48, 128) |

## How zoom works

The content script applies a CSS transform to `<body>`:

```
transform-origin: 0 0;
transform: translate(tx, ty) scale(s);
```

`zoomTo(newScale, mx, my)` keeps the document point under the pointer fixed while the scale changes, then `clampT()` limits the translation so the zoomed page always covers the viewport (no blank gaps). The zoom badge and the selection rectangle are attached to `<html>`, not `<body>`, so they are not themselves transformed.

## Three zoom modes

1. **Keyboard step zoom** — `background.js` receives the command and sends `{type: "ezzoom-command", command}` to the tab. The view stays fixed between presses.
2. **Hold and hover** — pressing the configured modifier starts a 150 ms timer (`HOLD_DELAY`) so quick shortcuts like Ctrl+C never trigger a zoom. With *follow* on, a `requestAnimationFrame` loop eases scale and pan toward the pointer (exponential smoothing, ~90 ms time constant). Releasing the key restores the zoom state saved when the session began.
3. **Area zoom** — mousedown with the modifier held starts a rectangle. On mouseup it is converted to document coordinates (accounting for any zoom already applied) and fitted to the viewport. Drags smaller than 12 px (`RECT_MIN`) fall back to hover zoom. The click after a drag is swallowed so Ctrl+click doesn't open a link.

Safeguards: pressing any other key with the modifier suppresses zoom until release; Esc cancels; window blur, tab hide and back/forward-cache restores all reset state.

## Settings

Stored in `chrome.storage.sync`. Defaults are duplicated in `content.js` and `popup.js` and must be kept in sync:

| Key | Default | Range in popup |
|---|---|---|
| `step` | 1.5 | 1.1–3 |
| `maxZoom` | 8 | 2–20 |
| `duration` | 280 ms | 0–800 |
| `holdEnabled` | true | |
| `modifier` | `"Control"` | Control, Alt, Shift, Meta |
| `hoverZoom` | 2 | 1.2–6 |
| `follow` | true | |

`chrome.storage.local` (never synced) holds two more keys: `usageCount`, incremented by `countUse()` in `content.js` on each hover zoom, area zoom and zoom-in shortcut and capped at `REVIEW_THRESHOLD` (15), and `reviewCardDone`. The popup shows a one-time rating card when the count reaches the threshold; either of its buttons sets `reviewCardDone`. `REVIEW_THRESHOLD` is defined in both `content.js` and `popup.js`.

## Limits

Chrome does not run extensions on `chrome://` pages, the Chrome Web Store or (by default) local files. Pages open before install or update need a reload. Sites with their own transforms on `<body>`, fullscreen layers or canvas rendering may behave differently.
