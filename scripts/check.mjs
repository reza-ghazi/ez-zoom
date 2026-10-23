// Validate src/ before packaging: manifest shape, referenced files, JS syntax, version bookkeeping.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const src = join(root, 'src');
const problems = [];
const manifest = JSON.parse(readFileSync(join(src, 'manifest.json'), 'utf8'));

if (manifest.manifest_version !== 3) problems.push('manifest_version must be 3');
if (!/^\d+(\.\d+){0,3}$/.test(manifest.version ?? '')) problems.push(`invalid version: ${manifest.version}`);
if ((manifest.description ?? '').length > 132) problems.push(`description is ${manifest.description.length} chars (max 132)`);

// Every file the manifest points at must exist.
const referenced = [
  manifest.background?.service_worker,
  manifest.action?.default_popup,
  ...Object.values(manifest.icons ?? {}),
  ...Object.values(manifest.action?.default_icon ?? {}),
  ...(manifest.content_scripts ?? []).flatMap((c) => [...(c.js ?? []), ...(c.css ?? [])]),
].filter(Boolean);
for (const f of new Set(referenced)) if (!existsSync(join(src, f))) problems.push(`manifest references missing file: ${f}`);

// Permissions are part of the store's privacy declarations; changing them needs a listing review.
const EXPECTED_PERMISSIONS = ['storage'];
if (JSON.stringify(manifest.permissions ?? []) !== JSON.stringify(EXPECTED_PERMISSIONS)) {
  problems.push(`permissions changed to ${JSON.stringify(manifest.permissions)}: update PRIVACY.md, docs/permissions.md, store/listing.md and EXPECTED_PERMISSIONS`);
}
if (manifest.host_permissions || manifest.optional_host_permissions) problems.push('host permissions added: review privacy declarations first');

const files = [];
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(relative(src, p));
  }
};
walk(src);
for (const f of files.filter((f) => f.endsWith('.js'))) {
  try {
    execFileSync(process.execPath, ['--check', join(src, f)], { stdio: 'pipe' });
  } catch (e) {
    problems.push(`syntax error in ${f}: ${e.stderr.toString().trim().split('\n')[0]}`);
  }
}

const changelog = readFileSync(join(root, 'CHANGELOG.md'), 'utf8');
const latest = changelog.match(/^## (\S+)/m)?.[1];
if (latest !== manifest.version) problems.push(`CHANGELOG.md top entry is ${latest}, manifest is ${manifest.version}`);

if (problems.length) {
  console.error('Check failed:\n' + problems.map((p) => ' - ' + p).join('\n'));
  process.exit(1);
}
console.log(`OK: EZ Zoom ${manifest.version}, ${files.length} files in src/`);
