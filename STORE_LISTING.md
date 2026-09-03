# Chrome Web Store Listing — EZ Zoom

This document contains the approved metadata and copy for **EZ Zoom – Mouse Magnifier**, version **1.1.1**.

## Package metadata

The following values come from `manifest.json` and appear in Chrome and the Chrome Web Store.

**Name**

```text
EZ Zoom – Mouse Magnifier
```

**Summary** — 121 characters

```text
Magnify any part of a webpage at your mouse pointer. Hold a key, drag an area, or use shortcuts for smooth, private zoom.
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
Magnify exactly what you want—without changing Chrome's normal page-zoom setting.

EZ Zoom – Mouse Magnifier provides smooth, pointer-centered magnification for webpages. Hold a key to temporarily magnify the area beneath your mouse, drag a rectangle to fit a selected region to the viewport, or use keyboard shortcuts for precise step-by-step zooming.

THREE WAYS TO ZOOM

- Hold and hover: Hold Ctrl by default and move the pointer like a magnifying glass. Release the key to return to the previous zoom level.
- Area zoom: Hold the configured key and drag around a region to fit it to the viewport.
- Keyboard zoom: Zoom in and out around the mouse pointer using configurable shortcuts.

FULLY CUSTOMIZABLE

- Choose Ctrl, Alt, Shift, or Cmd/Win as the activation key.
- Set hover magnification from 1.2× to 6×.
- Set shortcut zoom increments from 1.1× to 3×.
- Set the maximum zoom up to 20×.
- Adjust animation from instant to extra smooth.
- Remap Chrome keyboard shortcuts.

PRIVATE BY DESIGN

EZ Zoom does not collect browsing data, page content, keystrokes, or personal information. It contains no analytics, advertising, telemetry, or tracking and makes no direct network requests to developer-controlled or third-party servers. Preferences are stored using Chrome's settings storage and may be synchronized by Chrome when Chrome Sync is enabled.

USEFUL FOR

Reading small text, examining photographs and diagrams, presentations, screen sharing, accessibility, web development, and design review.

Chrome does not allow extensions to operate on protected pages such as chrome:// pages or the Chrome Web Store.
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
The storage permission is used only to save the user's zoom preferences, including zoom level, maximum zoom, animation duration, activation key, and pointer-follow setting. Chrome may synchronize these preferences when Chrome Sync is enabled.
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

## Screenshot plan

Use five actual screenshots at **1280 × 800 px**.

| Position | Demonstration | Suggested caption |
|---|---|---|
| 1 | Hold Ctrl and magnify beneath the pointer | Precision zoom exactly where you point |
| 2 | Drag a visible selection rectangle | Select any region and fit it to your screen |
| 3 | Use the keyboard shortcuts with the zoom badge visible | Precise keyboard zoom centered at the pointer |
| 4 | Show the complete settings popup | Customize the key, magnification, limit, and animation |
| 5 | Show a practical diagram or small-text use case | Read text and inspect images without changing page zoom |

Screenshots must show the extension's real behavior. Avoid private information, misleading composites, excessive text, browser-store branding, or claims that the extension does not provide.

## Publication checklist

1. Merge the reviewed pull request.
2. Download or clone the updated `main` branch.
3. Create a ZIP containing the extension files at the root of the archive.
4. Test the unpacked extension in a separate Chrome profile.
5. In the Chrome Web Store Developer Dashboard, open EZ Zoom.
6. Upload the version 1.1.1 ZIP under **Package**.
7. Paste the detailed description under **Store listing**.
8. Upload the five screenshots in the intended order.
9. Set the homepage, support, and privacy-policy URLs.
10. Review the **Privacy practices** declarations and permission justifications.
11. Save the draft and preview the public listing.
12. Submit the update for review.
13. After publication, test installation, all three zoom modes, settings persistence, the support links, and the displayed version in a signed-out or Incognito window.
