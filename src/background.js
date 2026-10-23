// EZ Zoom - background service worker
// Relays keyboard shortcut commands to the content script in the active tab.

chrome.commands.onCommand.addListener(async (command) => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    await chrome.tabs.sendMessage(tab.id, { type: "ezzoom-command", command });
  } catch (e) {
    // Content script may not be available on this page (e.g. chrome:// pages).
    // Silently ignore.
  }
});
