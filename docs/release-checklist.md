# Release checklist

## Prepare
- [ ] Bump `version` in `src/manifest.json` (the only place the version lives)
- [ ] Add a matching entry at the top of `CHANGELOG.md`
- [ ] If permissions, data handling or public claims changed: update `PRIVACY.md`, `docs/permissions.md` and `store/listing.md`
- [ ] Commit (the ZIP's timestamps, and so its checksum, come from the last commit)

## Build & verify
- [ ] `npm run package` — check and audit pass; note the SHA-256 from `release/ez-zoom-<version>.zip.sha256`
- [ ] Load `src/` unpacked in a fresh Chrome profile: no errors on `chrome://extensions`
- [ ] Hold-key hover (follow on and off), area zoom, all three shortcuts, Esc cancel, Ctrl+C / Ctrl+T pass through
- [ ] Popup: every control saves and applies live in an open tab

## Submit
- [ ] Chrome Web Store Developer Dashboard → EZ Zoom → **Package** → upload `release/ez-zoom-<version>.zip`
- [ ] Update the store listing from `store/listing.md` if copy or screenshots changed
- [ ] Review **Privacy practices** — declarations must match the code
- [ ] Submit for review

## After publication
- [ ] Install from the store in a clean profile; confirm the version and the three zoom modes
- [ ] Tag the release commit `v<version>` and publish a GitHub release with the submitted ZIP and its checksum
