# AGENTS.md

Agent guide for `2026-03-09-callumr-diagram-app`.

This repo is a minimal read-only diagrams app served by nginx and tested with Node's built-in test runner.

## Project Layout

- `app/`: static frontend app (`index.html`, `app.js`, `styles.css`, `data/diagrams.json`, assets)
- `app/lib/`: app helpers (`manifest.js`, `router.js`, `paths.js`, canvas viewer adapter)
- `app/lib/vendor/`: vendored browser libraries (do not refactor unless required)
- `nginx/default.conf`: SPA serving, `/diagrams` prefix rewrite, security headers
- `tests/unit/`: pure unit tests for helpers and app-level behavior
- `tests/smoke/`: repo/config/content smoke checks
- `docker-compose.yml`: production-ish Traefik deployment
- `docker-compose.local.yml`: local direct port mapping (`8080:80`)

## Install / Setup

```bash
npm install
```

## Build, Lint, Test Commands

There is no dedicated lint script and no JS bundling step in `package.json`.

Use the commands below as the canonical verification flow.

### Test (all)

```bash
npm test
# equivalent: node --test
```

### Test (single file)

```bash
node --test tests/unit/router.test.js
```

### Test (single test name / case)

```bash
node --test tests/unit/router.test.js --test-name-pattern="parseRoute extracts slug from path"
```

### Test subsets

```bash
node --test tests/unit/*.test.js
node --test tests/smoke/*.test.js
```

### Lint / format

```bash
# No lint or formatter is configured in package.json.
# If you add one, document and script it in package.json and update this file.
```

### Build / run containerized app

```bash
npm run start
# docker compose up --build
```

### Run local without Traefik

```bash
npm run start:local
# docker compose -f docker-compose.local.yml up --build
```

### Docker config sanity check

```bash
docker compose config
docker compose -f docker-compose.local.yml config
```

## Cursor / Copilot Rules

- No `.cursorrules` file found.
- No `.cursor/rules/` directory found.
- No `.github/copilot-instructions.md` file found.

If any of these are added later, treat them as high-priority instructions and merge guidance into this document.

## Coding Standards

### JavaScript modules and imports

- Use ES module syntax only (`import` / `export`), no CommonJS.
- Prefer named exports for helpers (`export function ...`).
- In tests, import order should stay:
  1) `node:test`
  2) `node:assert/strict` and other `node:` built-ins
  3) relative app imports
- Keep import specifiers explicit with `.js` extension for local files.

### Formatting and structure

- Use 2-space indentation.
- Use semicolons consistently.
- Use double quotes in JS and JSON where applicable.
- Keep lines readable; break long calls over multiple lines with trailing commas.
- Prefer small focused helper functions over deeply nested inline logic.

### Naming conventions

- Variables/functions: `camelCase` (`buildFilePath`, `renderError`).
- Constants: `UPPER_SNAKE_CASE` only for true constants; otherwise `camelCase`.
- File names in `app/lib/`: lowercase kebab-ish/simple names (`router.js`, `paths.js`).
- Test files: `<subject>.test.js` colocated under `tests/unit` or `tests/smoke`.
- Test names should be sentence-style and behavior-driven.

### Types and data handling

- This is plain JS; enforce shape via runtime validation.
- Normalize external data early (see `normalizeManifest`).
- Coerce only when intentional (`String(...)`, `Number(...)`) and guard invalid values.
- For numeric checks, prefer `Number.isFinite(...)` style guards.
- Preserve existing manifest contract:
  - required: `slug`, `title`, `file`
  - optional: `width`, `height`

### Error handling and resilience

- Check `response.ok` for all fetches before parsing payloads.
- Throw explicit `Error` objects with actionable messages when fetch fails.
- Convert thrown errors into user-visible notices in UI render paths.
- Fail soft in the browser UI (`renderError`, fallback notices), not with uncaught exceptions.
- Keep security behavior aligned with nginx CSP and local-only asset expectations.

### Routing and path handling

- Keep `/diagrams` base-path support intact when changing routing logic.
- Use shared helpers in `app/lib/paths.js` instead of ad-hoc path string building.
- Use `encodeURIComponent` / `decodeURIComponent` for slug boundaries.
- Preserve SPA fallback behavior coordinated between app router and nginx config.

### DOM/UI patterns

- Build DOM via explicit element creation (`document.createElement`) and `replaceChildren`.
- Keep interactions keyboard-aware (Escape/back, arrow keys, zoom shortcuts).
- Avoid introducing framework/tooling churn unless requested.
- Maintain read-only behavior for diagram content.

### CSS conventions

- Keep semantic design tokens in `:root` (`--background`, `--foreground`, etc.).
- Reuse existing token names before adding new ones.
- Preserve responsive behavior at current breakpoint (`@media (max-width: 720px)`).
- Avoid remote runtime dependencies that violate CSP constraints.

### Testing conventions

- Use `test("...", () => { ... })` from `node:test`.
- Use `assert.equal` / `assert.deepEqual` from `node:assert/strict`.
- Keep tests deterministic and filesystem-local.
- Prefer small focused tests with clear single behavior assertions.
- When adding features, add/adjust tests in both unit and smoke suites if relevant.

## Change Checklist for Agents

Before finishing a change:

1. Run targeted test file(s) first.
2. Run full suite with `npm test`.
3. If infra/config changed, run `docker compose config` checks.
4. Update `README.md` if user-facing workflow changed.
5. Update this `AGENTS.md` if commands or conventions changed.
