# Permissions explained

EZ Zoom requests the smallest set of permissions it can work with. `npm run check` fails if the manifest permissions change, so this page and the store declarations are reviewed first.

| Manifest entry | Why it is needed | What it is not used for |
|---|---|---|
| `storage` | Save your zoom preferences in `chrome.storage.sync` so they persist and, if Chrome Sync is on, follow you to other devices | Storing page content, history or keystrokes |
| Content script on `<all_urls>` | Apply the visual zoom transform to the page you are viewing and read the mouse position and modifier-key state used for gestures | Reading, storing or sending page content |
| `commands` (keyboard shortcuts) | Zoom in / out / reset from the keyboard; remappable at `chrome://extensions/shortcuts` | — (not a permission; shows no warning) |

EZ Zoom has no host permissions, makes no network requests, and contains no remote code. `npm run package` refuses to build a ZIP that contains network APIs, `eval` or remote script references.

See also the [Privacy Policy](../PRIVACY.md).
