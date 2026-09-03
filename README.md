# EZ Zoom – Mouse Magnifier

<img src="icons/icon128.png" width="96" align="right" alt="EZ Zoom icon">

**Precision zoom exactly where you point.**

EZ Zoom is a lightweight Chrome extension that provides smooth, pointer-centered webpage magnification. Hold a key to use the pointer like a magnifying glass, drag a rectangle to fit a selected area to the viewport, or use keyboard shortcuts for precise step-by-step zooming.

EZ Zoom has no analytics, advertising, tracking, or direct connections to developer-controlled or third-party servers.

## Features

### 🔍 Hold a key and hover

Hold Ctrl by default and move the pointer to magnify the area beneath it. Release the key to return to the previous zoom level.

### ▭ Hold a key and drag a rectangle

Select any area of the page while holding the configured key. EZ Zoom fits the selected region to the viewport and returns when the key is released.

### ⌨️ Keyboard shortcuts

Apply pointer-anchored step zoom. The view remains fixed until the next zoom action.

| Action | Default shortcut |
|---|---|
| Zoom in | `Alt + Shift + Up` |
| Zoom out | `Alt + Shift + Down` |
| Reset | `Alt + Shift + X` |

Shortcuts can be changed at `chrome://extensions/shortcuts`.

## Settings

Click the toolbar icon to configure:

- **Hold key** — Ctrl, Alt, Shift, or Cmd/Win
- **Hover zoom level** — 1.2× to 6×
- **Follow pointer while held** — magnifier-style movement or a fixed view
- **Zoom amount per shortcut** — 1.1× to 3×
- **Maximum zoom** — up to 20×
- **Animation smoothness** — instant to extra smooth

## Install

### Chrome Web Store

[Install EZ Zoom from the Chrome Web Store](https://chromewebstore.google.com/detail/ez-zoom/njbbgpolfnghieffmiicbfcmapdakpdl)

### From source

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the repository folder.

## How it works

EZ Zoom applies a GPU-accelerated CSS transform to the page body, anchored at the mouse position, with smooth easing. Hold-key gestures include safeguards so normal browser shortcuts such as `Ctrl+C` and `Ctrl+T` are not intentionally intercepted: a short hold delay, cancellation when another key is pressed, and an Escape-key exit.

Chrome does not permit extensions to operate on protected pages such as `chrome://` pages or the Chrome Web Store.

## Privacy

EZ Zoom collects no user data. Preferences are stored using Chrome's `chrome.storage.sync` API and may be synchronized by Chrome when Chrome Sync is enabled. See the [Privacy Policy](PRIVACY.md).

## Support

Read the [support and troubleshooting guide](SUPPORT.md), [report a bug](https://github.com/reza-ghazi/ez-zoom/issues/new?template=bug_report.yml), or [request a feature](https://github.com/reza-ghazi/ez-zoom/issues/new?template=feature_request.yml).

For privacy questions or private correspondence, email [contact@brightarcadia.com](mailto:contact@brightarcadia.com).

## License

[MIT](LICENSE)
