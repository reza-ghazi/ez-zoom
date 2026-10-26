# Changelog

## 1.2.0 — 2026-10-26

- Renamed to **EZ Zoom – Webpage Magnifier & Mouse Loupe** and rewrote the short description and store copy so people searching for a magnifier can find the extension.
- One-time rating card in the settings popup, shown after 15 zooms; **Rate** and **No thanks** both dismiss it for good. The count is kept in `chrome.storage.local`, is never synced and never leaves the device.
- **Sharper zoom:** zoomed pages are re-rendered at full resolution once the zoom animation ends, and in hover mode whenever the pointer rests. Previously text and graphics stayed blurry at high zoom.
- Privacy policy and permissions docs describe the local count.
- Demo recording of the real extension (`npm run demo`) for the README and the store promo video.
- Small promo tile redrawn edge to edge (the old one had a light frame).

## 1.1.1 — 2026-09-02

Store listing and support update. Extension code is unchanged from 1.1.0.

- Renamed to **EZ Zoom – Mouse Magnifier** and rewrote the manifest description.
- Clarified the privacy policy: settings may be synchronized by Chrome Sync; public contact address.
- Added a support guide, GitHub issue forms and Chrome Web Store listing copy.
- Replaced the store screenshots with five accurate 1280 × 800 images.

## 1.1.0 — 2026-08-21

First public release on the Chrome Web Store.

- Hold-key zoom: hold Ctrl (configurable) to magnify at the pointer; optional magnifier-style follow.
- Area zoom: hold the key and drag a rectangle to fit it to the viewport.
- Keyboard step zoom anchored at the pointer (Alt+Shift+Up / Down / X, remappable).
- Settings popup: hold key, hover zoom, zoom step, maximum zoom, animation speed.
- Safeguards so normal shortcuts (Ctrl+C, Ctrl+T, …) pass through; Esc cancels a hold zoom.
