# Chrome Web Store Listing — EZ Zoom

Metadata and copy for **EZ Zoom – Webpage Magnifier & Mouse Loupe** (item ID `njbbgpolfnghieffmiicbfcmapdakpdl`). Published version: **1.2.0** (live 2026-10-26). Update this file whenever the dashboard listing changes so it stays the source of truth.

## Package metadata

The following values come from `src/manifest.json` and appear in Chrome and the Chrome Web Store.

**Name**

```text
EZ Zoom – Webpage Magnifier & Mouse Loupe
```

**Summary** — 131 characters (max 132)

```text
Magnify any part of a webpage at your mouse cursor: hover loupe, drag-to-zoom and keyboard shortcuts. Smooth, private, no tracking.
```

## Store listing fields

**Category**

```text
Accessibility
```

**Language**

```text
English
```

**Detailed description**

```text
A webpage magnifier for Chrome that zooms exactly where your mouse points — without changing Chrome's page zoom or breaking the page layout.

EZ Zoom works like a loupe for the web. Hold a key to magnify the area under your cursor, drag a rectangle to zoom into one region, or use keyboard shortcuts for precise step zoom. Release the key and the page returns to normal.

THREE WAYS TO ZOOM

- Hover zoom: hold Ctrl (or a key you choose) and move the mouse. The magnified view follows your cursor like a magnifying glass.
- Drag-to-zoom: hold the key and drag around any region — a chart, a diagram, a block of small text — to fit it to the window.
- Keyboard zoom: zoom in and out around the mouse pointer with shortcuts you can remap.

WHO IT'S FOR

- Reading small fonts and fine print without enlarging the whole page
- Low vision and accessibility: magnify one spot of a web page instead of the entire screen
- Web designers, front-end developers and QA: inspect icons, typography and alignment without triggering responsive breakpoints
- Presenters and teachers: zoom into code, spreadsheets or buttons while screen sharing
- Looking closely at photos, maps and diagrams

FULLY CUSTOMIZABLE

- Choose Ctrl, Alt, Shift, or Cmd/Win as the activation key.
- Hover magnification from 1.2× to 6×; maximum zoom up to 20×.
- Shortcut zoom steps from 1.1× to 3×.
- Animation from instant to extra smooth.
- Follow the pointer, or freeze the magnified view in place.

PRIVATE BY DESIGN

EZ Zoom does not collect browsing data, page content, keystrokes, or personal information. It contains no analytics, advertising, telemetry, or tracking and makes no network requests. Preferences are stored with Chrome's settings storage and may be synchronized by Chrome Sync.

Chrome does not allow extensions to run on protected pages such as chrome:// pages or the Chrome Web Store.
```

## Public URLs

**Homepage**

```text
https://github.com/reza-ghazi/ez-zoom
```

**Support URL**

```text
https://github.com/reza-ghazi/ez-zoom/issues
```

**Privacy-policy URL**

```text
https://github.com/reza-ghazi/ez-zoom/blob/main/PRIVACY.md
```

**Chrome Web Store listing**

```text
https://chromewebstore.google.com/detail/ez-zoom/njbbgpolfnghieffmiicbfcmapdakpdl
```

**Contact email**

```text
contact@brightarcadia.com
```

## Privacy-practices explanations

**Single purpose**

```text
EZ Zoom provides user-controlled magnification of webpage content at the mouse pointer through hold-key, rectangular-selection, and keyboard-shortcut zoom modes.
```

**Storage permission**

```text
The storage permission is used only to save the user's zoom preferences (zoom level, maximum zoom, animation duration, activation key, pointer-follow setting), which Chrome may synchronize when Chrome Sync is enabled, and a local count of zoom uses (capped at 15) that decides when to show a one-time, dismissible rating suggestion in the popup. Nothing is transmitted.
```

**Broad host access / content scripts**

```text
EZ Zoom must run its content script on webpages selected by the user so it can apply the visual zoom transformation and detect the mouse position and modifier-key state used for zoom gestures. Page content, browsing history, and keystrokes are not collected, stored, or transmitted.
```

**Remote code**

```text
EZ Zoom does not use remote code. All executable code is included in the extension package.
```

**Data use**

Select the dashboard options indicating that no user data is collected or transmitted. Confirm that the declarations match the current source code before each release.

## Graphic assets

All screenshots are 1280 × 800 and show the extension's real behavior. Upload them in this order.

| Position | File | Caption shown in image |
|---|---|---|
| Icon | `src/icons/icon128.png` | — |
| 1 | `store/screenshots/1-hold-key-magnification.png` | Precision zoom exactly where you point |
| 2 | `store/screenshots/2-rectangle-selection.png` | Select a region and fit it to the screen |
| 3 | `store/screenshots/3-keyboard-shortcuts.png` | Zoom in, zoom out, or reset instantly |
| 4 | `store/screenshots/4-settings-popup.png` | Tune magnification to your workflow |
| 5 | `store/screenshots/5-privacy.png` | Magnification without tracking |
| Small promo tile | `store/promo-small-440x280.png` | — |
| Marquee | `store/promo-marquee-1400x560.png` | — |

Screenshots must not show private information, misleading composites, excessive text, browser-store branding, or features the extension does not provide. If the popup or behavior changes, regenerate the affected images.

## Promo video

The store accepts a YouTube link in **Store listing → Global promo video**. Upload `release/ez-zoom-demo.mp4` (made by `npm run demo`, ~30 s, no audio) to YouTube as *Public* or *Unlisted*, then paste the link there.

Current video (public, uploaded 2026-10-22, on the Bright Arcadia channel): https://www.youtube.com/watch?v=DBvJx63QC9U

The same recording is in the README as `store/demo/ez-zoom-demo.gif`. Re-record after any visible behavior or popup change.

## Test instructions (dashboard → Access)

None needed: EZ Zoom has no login or setup. Leave credentials empty.

## Publishing a new version

Follow [docs/release-checklist.md](../docs/release-checklist.md).
