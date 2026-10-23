// Record the README / store demo of the real extension (src/) in Playwright's Chromium.
// Writes store/demo/ez-zoom-demo.gif (README) and release/ez-zoom-demo.mp4 (upload to YouTube for the store).
// Requires ffmpeg. Headless video has no mouse pointer, so a drawn cursor follows the real one.
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import http from 'node:http';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = process.cwd();
const ext = join(root, 'src');
const html = readFileSync(join(root, 'scripts/demo/page.html'), 'utf8');
const work = mkdtempSync(join(tmpdir(), 'ez-zoom-demo-'));
const srv = http.createServer((q, r) => { r.setHeader('content-type', 'text/html'); r.end(html); }).listen(0);

const ctx = await chromium.launchPersistentContext(join(work, 'profile'), {
  channel: 'chromium', headless: true, viewport: { width: 1280, height: 800 },
  recordVideo: { dir: work, size: { width: 1280, height: 800 } },
  args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`],
});
let [sw] = ctx.serviceWorkers();
if (!sw) sw = await ctx.waitForEvent('serviceworker');
await sw.evaluate(() => chrome.storage.sync.set({ hoverZoom: 3, duration: 400 }));
const page = ctx.pages()[0] ?? await ctx.newPage();
await page.goto(`http://127.0.0.1:${srv.address().port}/`);

// Overlays live on <html>, outside the zoomed <body>: a caption bar and the drawn cursor.
await page.evaluate(() => {
  const cap = document.createElement('div');
  cap.id = 'cap';
  cap.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:2147483647;padding:22px 40px;background:#0f172a;color:#f8fafc;font:600 24px system-ui,sans-serif;display:flex;gap:14px;align-items:center';
  document.documentElement.appendChild(cap);
  const c = document.createElement('div');
  c.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;width:26px;height:26px';
  c.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 2l15 11-6.5 1 3.8 7.3-2.6 1.3-3.7-7.3L3 20z" fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  document.documentElement.appendChild(c);
  addEventListener('mousemove', (e) => { c.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 2}px)`; }, true);
});

const kbd = (k) => `<span style="font:700 18px ui-monospace,monospace;background:#334155;border:1px solid #64748b;border-radius:6px;padding:3px 9px">${k}</span>`;
const caption = (t) => page.evaluate((t) => { document.getElementById('cap').innerHTML = t; }, t);
const wait = (ms) => page.waitForTimeout(ms);
const glide = async (x0, y0, x1, y1, ms) => {
  const n = Math.round(ms / 16);
  for (let i = 1; i <= n; i++) {
    const t = i / n, e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    await page.mouse.move(x0 + (x1 - x0) * e, y0 + (y1 - y0) * e);
    await wait(16);
  }
};
// Keyboard shortcuts can't be pressed in headless Chromium; send the same message background.js sends.
const command = (c) => sw.evaluate(async (c) => {
  const [t] = await chrome.tabs.query({ active: true });
  await chrome.tabs.sendMessage(t.id, { type: 'ezzoom-command', command: c });
}, c);

await page.mouse.move(640, 600);
await caption(`<span style="color:#38bdf8">EZ Zoom</span> — a magnifier for any webpage`); await wait(1800);

await caption(`Hold ${kbd('Ctrl')} and point — the page magnifies under your cursor`);
await glide(640, 600, 200, 482, 900); await wait(300);
await page.keyboard.down('Control'); await wait(700);
await glide(200, 482, 640, 488, 3000); await wait(700); await glide(640, 488, 330, 505, 1800); await wait(900);
await page.keyboard.up('Control'); await wait(1200);

await caption(`Hold ${kbd('Ctrl')} and drag — zoom into exactly the area you select`);
await glide(330, 505, 880, 172, 1100); await wait(300);
await page.keyboard.down('Control'); await wait(60);
await page.mouse.down(); await glide(880, 172, 1045, 338, 1100); await wait(150); await page.mouse.up();
await wait(2600); await page.keyboard.up('Control'); await wait(1300);

await caption(`${kbd('Alt')} + ${kbd('Shift')} + ${kbd('↑')} / ${kbd('↓')} — step zoom at the pointer`);
await glide(1045, 338, 470, 385, 1000); await wait(400);
await command('zoom-in'); await wait(900); await command('zoom-in'); await wait(1600);
await command('zoom-out'); await wait(900); await command('zoom-reset'); await wait(1000);
await caption(`<span style="color:#38bdf8">EZ Zoom</span> — private, no tracking · free on the Chrome Web Store`); await wait(2200);

const video = page.video();
await ctx.close();
srv.close();
const raw = await video.path();

mkdirSync(join(root, 'store/demo'), { recursive: true });
mkdirSync(join(root, 'release'), { recursive: true });
const gif = join(root, 'store/demo/ez-zoom-demo.gif');
const mp4 = join(root, 'release/ez-zoom-demo.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-ss', '0.4', '-vf',
  'fps=10,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle', gif]);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-ss', '0.4', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
rmSync(work, { recursive: true, force: true });
console.log(`wrote ${gif}\nwrote ${mp4}`);
