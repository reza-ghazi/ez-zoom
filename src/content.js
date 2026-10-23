// EZ Zoom - content script
//
// Three ways to zoom:
//  1) Keyboard shortcuts (Alt+Shift+Up/Down/X by default): step zoom anchored
//     at the mouse pointer. View stays FROZEN while zoomed.
//  2) Hold Ctrl + hover: temporarily zooms in at the pointer; releasing Ctrl
//     zooms back out. Optionally follows the pointer like a magnifier.
//  3) Hold Ctrl + drag a rectangle: zooms to fit that rectangle; releasing
//     Ctrl zooms back out.

(() => {
  "use strict";

  // ---------- Settings (user-configurable via the popup) ----------
  const DEFAULTS = {
    step: 1.5,          // zoom multiplier per key press
    maxZoom: 8,         // maximum zoom level
    duration: 280,      // animation duration in ms (0 = instant)
    holdEnabled: true,  // enable hold-modifier zoom modes
    modifier: "Control",// Control | Alt | Shift | Meta
    hoverZoom: 2,       // zoom level while holding the modifier
    follow: true        // hover zoom follows the pointer like a magnifier
  };
  let settings = { ...DEFAULTS };

  chrome.storage.sync.get(DEFAULTS, (items) => {
    settings = { ...DEFAULTS, ...items };
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    for (const key of Object.keys(changes)) {
      if (key in DEFAULTS) settings[key] = changes[key].newValue;
    }
  });

  // ---------- Mouse tracking ----------
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let haveMouse = false;

  const trackMouse = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    haveMouse = true;
  };
  window.addEventListener("mousemove", trackMouse, { capture: true, passive: true });
  window.addEventListener("mouseover", trackMouse, { capture: true, passive: true });

  // ---------- Zoom state ----------
  let scale = 1;
  let tx = 0; // translation X (document px, applied after scale)
  let ty = 0; // translation Y

  function target() {
    return document.body || null;
  }

  function applyTransform(animate, durOverride) {
    const el = target();
    if (!el) return;

    const dur = animate ? Math.max(0, durOverride ?? settings.duration) : 0;
    el.style.setProperty(
      "transition",
      dur > 0 ? `transform ${dur}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
      "important"
    );
    el.style.setProperty("transform-origin", "0 0", "important");

    if (scale === 1 && tx === 0 && ty === 0) {
      el.style.setProperty("transform", "none", "important");
      el.style.removeProperty("will-change");
      const cleanup = () => {
        if (scale === 1) {
          el.style.removeProperty("transform");
          el.style.removeProperty("transform-origin");
          el.style.removeProperty("transition");
        }
      };
      if (dur > 0) setTimeout(cleanup, dur + 50);
      else cleanup();
    } else {
      el.style.setProperty("will-change", "transform");
      el.style.setProperty(
        "transform",
        `translate(${tx}px, ${ty}px) scale(${scale})`,
        "important"
      );
    }
  }

  // Keep zoomed content covering the viewport (no blank gaps).
  function clampT(nscale, ntx, nty) {
    const el = target();
    if (!el) return [ntx, nty];
    const sx = window.scrollX, sy = window.scrollY;
    const vw = window.innerWidth, vh = window.innerHeight;
    const cw = el.offsetWidth * nscale;
    const ch = Math.max(el.offsetHeight, el.scrollHeight) * nscale;

    if (ntx > sx) ntx = sx;
    if (nty > sy) nty = sy;
    if (cw >= vw && ntx < sx + vw - cw) ntx = sx + vw - cw;
    if (ch >= vh && nty < sy + vh - ch) nty = sy + vh - ch;
    return [ntx, nty];
  }

  // Zoom so the document point currently under (mx, my) stays under (mx, my).
  function zoomTo(newScale, mx, my, animate = true) {
    const el = target();
    if (!el) return;

    newScale = Math.min(Math.max(newScale, 1), Math.max(1, settings.maxZoom));

    if (newScale <= 1.001) {
      scale = 1; tx = 0; ty = 0;
      applyTransform(animate);
      showBadge("100%");
      return;
    }

    const sx = window.scrollX, sy = window.scrollY;
    const px = (mx + sx - tx) / scale;
    const py = (my + sy - ty) / scale;

    let ntx = mx + sx - newScale * px;
    let nty = my + sy - newScale * py;
    [ntx, nty] = clampT(newScale, ntx, nty);

    scale = newScale;
    tx = ntx;
    ty = nty;
    applyTransform(animate);
    showBadge(Math.round(scale * 100) + "%");
  }

  function anchorX() { return haveMouse ? mouseX : window.innerWidth / 2; }
  function anchorY() { return haveMouse ? mouseY : window.innerHeight / 2; }

  function zoomIn()  { zoomTo(scale * settings.step, anchorX(), anchorY()); }
  function zoomOut() { zoomTo(scale / settings.step, anchorX(), anchorY()); }
  function zoomReset() {
    scale = 1; tx = 0; ty = 0;
    applyTransform(true);
    showBadge("100%");
  }

  // ---------- Zoom level badge ----------
  let badge = null;
  let badgeTimer = null;

  function showBadge(text) {
    const root = document.documentElement;
    if (!root) return;
    if (!badge || !badge.isConnected) {
      badge = document.createElement("div");
      badge.setAttribute("data-ezzoom-badge", "");
      badge.style.cssText = [
        "position: fixed",
        "top: 16px",
        "right: 16px",
        "z-index: 2147483647",
        "padding: 8px 14px",
        "border-radius: 999px",
        "background: rgba(17, 24, 39, 0.88)",
        "color: #fff",
        "font: 600 13px/1 system-ui, -apple-system, sans-serif",
        "letter-spacing: 0.3px",
        "pointer-events: none",
        "box-shadow: 0 4px 14px rgba(0,0,0,0.35)",
        "transition: opacity 250ms ease",
        "opacity: 0"
      ].join(";");
      // Attach to <html>, NOT <body>: body is the transformed element.
      root.appendChild(badge);
    }
    badge.textContent = "EZ Zoom  " + text;
    badge.style.opacity = "1";
    clearTimeout(badgeTimer);
    badgeTimer = setTimeout(() => {
      if (badge) badge.style.opacity = "0";
    }, 1200);
  }

  // =====================================================================
  // Hold-modifier zoom (Ctrl + hover / Ctrl + rectangle)
  // =====================================================================

  const HOLD_DELAY = 150; // ms before hover zoom kicks in (lets Ctrl+C pass)
  const RECT_MIN = 12;    // px: smaller drags are treated as clicks, ignored

  let session = null;        // { saved: {scale,tx,ty}, mode: "hover"|"rect"|"rectZoomed" }
  let pendingTimer = null;   // hover activation timer
  let suppressed = false;    // another key was combined with the modifier
  let raf = 0;               // follow-loop handle
  let cur = { s: 1, x: 0, y: 0 }; // animated values for the follow loop
  let rect = null;           // { x0, y0, x1, y1, overlay }

  function modifierHeld(e) {
    try { return e.getModifierState(settings.modifier); }
    catch { return false; }
  }

  function startPending() {
    clearTimeout(pendingTimer);
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      activateHover();
    }, HOLD_DELAY);
  }

  function activateHover() {
    if (session) return;
    session = { saved: { scale, tx, ty }, mode: "hover" };
    const zl = Math.max(1.1, settings.hoverZoom);

    if (settings.follow) {
      // Smooth magnifier: animate scale + pan toward the pointer every frame.
      cur = { s: scale, x: tx, y: ty };
      const el = target();
      if (el) el.style.setProperty("will-change", "transform");
      let last = performance.now();
      const loop = (now) => {
        if (!session || session.mode !== "hover") { raf = 0; return; }
        const dt = Math.min(50, now - last);
        last = now;
        // Exponential smoothing (time-constant ~90ms) = buttery + frame-rate independent
        const k = 1 - Math.exp(-dt / 90);

        const sx = window.scrollX, sy = window.scrollY;
        const S = zl;
        let txT = (1 - S) * (anchorX() + sx);
        let tyT = (1 - S) * (anchorY() + sy);
        [txT, tyT] = clampT(S, txT, tyT);

        cur.s += (S - cur.s) * k;
        cur.x += (txT - cur.x) * k;
        cur.y += (tyT - cur.y) * k;

        scale = cur.s; tx = cur.x; ty = cur.y;
        applyTransform(false);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      showBadge(Math.round(zl * 100) + "%");
    } else {
      // Frozen hover zoom: one smooth zoom at the pointer, then locked.
      zoomTo(zl, anchorX(), anchorY());
    }
  }

  function endSession(animate = true) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    destroyRect();
    if (!session) return;
    const saved = session.saved;
    session = null;
    scale = saved.scale; tx = saved.tx; ty = saved.ty;
    applyTransform(animate);
    showBadge(Math.round(scale * 100) + "%");
  }

  // ---------- Rectangle selection ----------
  function makeOverlay() {
    const o = document.createElement("div");
    o.setAttribute("data-ezzoom-rect", "");
    o.style.cssText = [
      "position: fixed",
      "z-index: 2147483646",
      "border: 2px solid #38bdf8",
      "background: rgba(56, 189, 248, 0.15)",
      "border-radius: 4px",
      "box-shadow: 0 0 0 100000px rgba(15, 23, 42, 0.25)",
      "pointer-events: none",
      "left: 0; top: 0; width: 0; height: 0"
    ].join(";");
    document.documentElement.appendChild(o);
    return o;
  }

  function updateOverlay() {
    if (!rect || !rect.overlay) return;
    const x = Math.min(rect.x0, rect.x1);
    const y = Math.min(rect.y0, rect.y1);
    const w = Math.abs(rect.x1 - rect.x0);
    const h = Math.abs(rect.y1 - rect.y0);
    rect.overlay.style.left = x + "px";
    rect.overlay.style.top = y + "px";
    rect.overlay.style.width = w + "px";
    rect.overlay.style.height = h + "px";
  }

  function destroyRect() {
    if (rect && rect.overlay) rect.overlay.remove();
    rect = null;
  }

  function zoomToRect(vx0, vy0, vx1, vy1) {
    const el = target();
    if (!el) return;
    const sx = window.scrollX, sy = window.scrollY;
    const vw = window.innerWidth, vh = window.innerHeight;

    // Convert viewport corners to document coordinates (respecting the
    // transform that may already be applied, e.g. hover zoom).
    const dx0 = (Math.min(vx0, vx1) + sx - tx) / scale;
    const dy0 = (Math.min(vy0, vy1) + sy - ty) / scale;
    const dx1 = (Math.max(vx0, vx1) + sx - tx) / scale;
    const dy1 = (Math.max(vy0, vy1) + sy - ty) / scale;
    const rw = Math.max(1, dx1 - dx0);
    const rh = Math.max(1, dy1 - dy0);

    let S = Math.min(vw / rw, vh / rh);
    S = Math.min(Math.max(S, 1), Math.max(1, settings.maxZoom));

    // Center the rectangle in the viewport.
    let ntx = sx + (vw - S * rw) / 2 - S * dx0;
    let nty = sy + (vh - S * rh) / 2 - S * dy0;
    [ntx, nty] = clampT(S, ntx, nty);

    scale = S; tx = ntx; ty = nty;
    applyTransform(true);
    showBadge(Math.round(S * 100) + "%");
  }

  // ---------- Modifier key handling ----------
  window.addEventListener("keydown", (e) => {
    if (!settings.holdEnabled) return;

    if (e.key === settings.modifier) {
      if (e.repeat || session || pendingTimer || suppressed) return;
      startPending();
      return;
    }

    // Another key while the modifier is involved: this is a normal shortcut
    // (Ctrl+C, Ctrl+T, ...). Cancel/suppress our zoom until release.
    if (modifierHeld(e)) {
      suppressed = true;
      clearTimeout(pendingTimer);
      pendingTimer = null;
      if (session && session.mode === "hover") endSession(false);
      if (e.key === "Escape" && session) endSession(true);
    }
  }, true);

  window.addEventListener("keyup", (e) => {
    if (e.key !== settings.modifier) return;
    suppressed = false;
    clearTimeout(pendingTimer);
    pendingTimer = null;
    if (session) endSession(true);
  }, true);

  // Lost focus (tab switch, alt-tab): keyup may never arrive - bail out.
  window.addEventListener("blur", () => {
    suppressed = false;
    if (session) endSession(false);
    clearTimeout(pendingTimer);
    pendingTimer = null;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && session) endSession(false);
  });

  // ---------- Rectangle drag handling ----------
  window.addEventListener("mousedown", (e) => {
    if (!settings.holdEnabled || suppressed) return;
    if (e.button !== 0 || !modifierHeld(e)) return;

    // Start a session right away if the hover delay hadn't elapsed yet.
    clearTimeout(pendingTimer);
    pendingTimer = null;
    if (!session) session = { saved: { scale, tx, ty }, mode: "rect" };
    else session.mode = "rect"; // freeze hover-follow while selecting
    if (raf) { cancelAnimationFrame(raf); raf = 0; }

    rect = { x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY, overlay: makeOverlay() };
    updateOverlay();
    e.preventDefault();
    e.stopPropagation();
  }, true);

  window.addEventListener("mousemove", (e) => {
    if (!rect) return;
    rect.x1 = e.clientX;
    rect.y1 = e.clientY;
    updateOverlay();
    e.preventDefault();
  }, true);

  window.addEventListener("mouseup", (e) => {
    if (!rect) return;
    const { x0, y0 } = rect;
    const x1 = e.clientX, y1 = e.clientY;
    destroyRect();
    e.preventDefault();
    e.stopPropagation();

    if (Math.abs(x1 - x0) < RECT_MIN || Math.abs(y1 - y0) < RECT_MIN) {
      // Too small: treat as an accidental click. Fall back to hover zoom.
      if (session) {
        session.mode = "hover";
        const keep = session;
        session = null;
        // restart hover behavior with the same saved state
        activateHover();
        if (session) session.saved = keep.saved;
      }
      return;
    }

    if (session) session.mode = "rectZoomed";
    zoomToRect(x0, y0, x1, y1);
  }, true);

  // Swallow the click that follows a rectangle drag (avoid Ctrl+click nav).
  window.addEventListener("click", (e) => {
    if (session && (session.mode === "rect" || session.mode === "rectZoomed") && modifierHeld(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // ---------- Command handling ----------
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (!msg) return;
    if (msg.type === "ezzoom-command") {
      if (msg.command === "zoom-in") zoomIn();
      else if (msg.command === "zoom-out") zoomOut();
      else if (msg.command === "zoom-reset") zoomReset();
      sendResponse({ ok: true, scale });
    } else if (msg.type === "ezzoom-status") {
      sendResponse({ ok: true, scale });
    }
    return true;
  });

  window.addEventListener("pageshow", (e) => {
    if (e.persisted && scale !== 1) {
      session = null;
      scale = 1; tx = 0; ty = 0;
      applyTransform(false);
    }
  });
})();
