# EZ Zoom

<img src="icons/icon128.png" width="96" align="right" alt="EZ Zoom icon">

**Smoothly zoom in on any spot on a web page — hold Ctrl, point, zoom.**

EZ Zoom is a lightweight Chrome extension that magnifies exactly what you're looking at, right at your mouse pointer. No data collection, no tracking, no network requests — everything runs locally.

## Features

### 🔍 Hold Ctrl + hover
Hold the Ctrl key and the page smoothly zooms in at your pointer. By default the view follows your mouse like a magnifying glass. **Release Ctrl → zooms back out.**

### ▭ Hold Ctrl + drag a rectangle
Select any area of the page while holding Ctrl and it zooms to fit exactly that rectangle. **Release Ctrl → zooms back out.**

### ⌨️ Keyboard shortcuts
Step-zoom anchored at your pointer. While zoomed this way the view stays **frozen** — moving the mouse never pans the page — until you choose to zoom again.

| Action   | Default shortcut  |
|----------|-------------------|
| Zoom in  | `Alt + Shift + ↑` |
| Zoom out | `Alt + Shift + ↓` |
| Reset    | `Alt + Shift + X` |

Remap any of them at `chrome://extensions/shortcuts`.

## Settings

Click the toolbar icon to configure:

- **Hold key** — Ctrl, Alt, Shift, or Cmd/Win
- **Hover zoom level** — 1.2× to 6×
- **Follow pointer while held** — magnifier-style follow, or freeze at the first spot
- **Zoom amount per press** — 1.1× to 3×
- **Maximum zoom** — up to 20×
- **Animation smoothness** — instant to extra smooth

## Install

### From the Chrome Web Store
*(link coming soon — pending review)*

### From source (developer mode)
1. Clone or download this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select this folder

## How it works

EZ Zoom applies a GPU-accelerated CSS transform to the page body, anchored at the mouse position, with smooth easing. Modifier-key gestures include safeguards so normal browser shortcuts (`Ctrl+C`, `Ctrl+T`, …) are never hijacked: a short hold delay, automatic cancellation when another key is pressed, and `Esc` to bail out.

## Privacy

EZ Zoom collects **no data whatsoever**. See [PRIVACY.md](PRIVACY.md).

## Bugs & feature requests

Please open an [issue](../../issues).

## License

[MIT](LICENSE)
