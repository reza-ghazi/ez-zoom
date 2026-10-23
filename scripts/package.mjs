// Package src/ into a clean, versioned Chrome Web Store ZIP with checksums and a content audit.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

const root = process.cwd();
execFileSync(process.execPath, [join(root, 'scripts/check.mjs')], { stdio: 'inherit' });

const manifest = JSON.parse(readFileSync(join(root, 'src/manifest.json'), 'utf8'));
// Stage a copy so pinning timestamps never touches the working tree.
const stage = mkdtempSync(join(tmpdir(), 'ez-zoom-'));
cpSync(join(root, 'src'), stage, { recursive: true });

const files = [];
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(relative(stage, p));
  }
};
walk(stage);
files.sort();

// Audit: allowed file types only; no maps, tests, secrets or remote code.
const allowed = /\.(js|html|css|json|png)$/;
const problems = [];
for (const f of files) {
  if (!allowed.test(f)) problems.push(`unexpected file type: ${f}`);
  if (/\.map$|test|spec|fixture|private/i.test(f)) problems.push(`development/private file: ${f}`);
  const text = /\.(js|html|css|json)$/.test(f) ? readFileSync(join(stage, f), 'utf8') : '';
  if (/AIza[0-9A-Za-z_-]{30,}|sk-[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(text)) problems.push(`possible secret in ${f}`);
  if (/\beval\s*\(|new Function\s*\(/.test(text)) problems.push(`eval/new Function in ${f}`);
  if (/<script[^>]+src=["']https?:/i.test(text) || /import\s*\(\s*["']https?:/.test(text)) problems.push(`remote script reference in ${f}`);
  if (/\bfetch\s*\(|XMLHttpRequest|WebSocket\s*\(|sendBeacon/.test(text)) problems.push(`network API in ${f} (privacy policy says none)`);
  if (/sourceMappingURL/.test(text)) problems.push(`source map reference in ${f}`);
}
if (problems.length) {
  rmSync(stage, { recursive: true, force: true });
  console.error('Package audit failed:\n' + problems.map((p) => ' - ' + p).join('\n'));
  process.exit(1);
}

mkdirSync(join(root, 'release'), { recursive: true });
const zipName = `ez-zoom-${manifest.version}.zip`;
const zipPath = join(root, 'release', zipName);
rmSync(zipPath, { force: true });
// Reproducible archive: fixed entry order, no extra attributes, and timestamps pinned to
// SOURCE_DATE_EPOCH (default: last git commit time) so identical sources give identical bytes.
const epoch = Number(process.env.SOURCE_DATE_EPOCH ?? execFileSync('git', ['log', '-1', '--format=%ct']).toString().trim());
for (const f of files) utimesSync(join(stage, f), epoch, epoch);
execFileSync('zip', ['-X', '-q', '-D', zipPath, ...files], { cwd: stage, env: { ...process.env, TZ: 'UTC' } });
const sha = createHash('sha256').update(readFileSync(zipPath)).digest('hex');
const fileHashes = files.map((f) => `${createHash('sha256').update(readFileSync(join(stage, f))).digest('hex')}  ${f}`);
writeFileSync(join(root, 'release', `${zipName}.sha256`), `${sha}  ${zipName}\n`);
writeFileSync(join(root, 'release', `ez-zoom-${manifest.version}.files.sha256`), fileHashes.join('\n') + '\n');
rmSync(stage, { recursive: true, force: true });
console.log(JSON.stringify({ zip: `release/${zipName}`, bytes: statSync(zipPath).size, sha256: sha, files: files.length, permissions: manifest.permissions }, null, 2));
