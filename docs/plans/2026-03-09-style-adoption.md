# Style Adoption Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Adopt the visual language from `callum-rowe-lab` in the diagrams app while keeping all current behavior and routing unchanged.

**Architecture:** Keep `app/app.js` behavior intact and perform a styling-only migration in `app/styles.css` driven by semantic design tokens. Update `app/index.html` to load the same typography family as the reference app. Validate through smoke tests that tokenized variables and typography hooks are present and that existing app behavior remains unaffected.

**Tech Stack:** Vanilla JS, HTML, CSS custom properties, Node test runner (`node --test`).

---

### Task 1: Lock design-token contract with failing tests

**Files:**
- Modify: `tests/smoke/theme.test.js`
- Test: `tests/smoke/theme.test.js`

**Step 1: Write the failing test**

```js
test("styles define semantic design tokens", () => {
  const css = readFileSync("app/styles.css", "utf8");
  assert.equal(css.includes("--background"), true);
  assert.equal(css.includes("--foreground"), true);
  assert.equal(css.includes("--primary"), true);
  assert.equal(css.includes("--radius"), true);
  assert.equal(css.includes(".viewer-head"), true);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/smoke/theme.test.js`
Expected: FAIL because current CSS still uses legacy tokens such as `--bg`/`--fg`.

**Step 3: Keep existing behavior assertions and add new token assertions only**

```js
test("styles preserve viewer interaction styling hooks", () => {
  const css = readFileSync("app/styles.css", "utf8");
  assert.equal(css.includes(".canvas"), true);
  assert.equal(css.includes("display: flex"), true);
  assert.equal(css.includes("max-width: 100%"), true);
  assert.equal(css.includes("max-height: 100%"), true);
});
```

**Step 4: Run test to verify expected failure profile remains token-related**

Run: `node --test tests/smoke/theme.test.js`
Expected: FAIL on missing semantic tokens, PASS on interaction-style hooks.

**Step 5: Commit**

```bash
git add tests/smoke/theme.test.js
git commit -m "test: define semantic style token contract"
```

### Task 2: Apply tokenized visual language and typography imports

**Files:**
- Modify: `app/styles.css`
- Modify: `app/index.html`
- Test: `tests/smoke/theme.test.js`

**Step 1: Write the failing typography test**

Add to `tests/smoke/theme.test.js`:

```js
test("index loads Inter and Space Grotesk fonts", () => {
  const html = readFileSync("app/index.html", "utf8");
  assert.equal(html.includes("Inter"), true);
  assert.equal(html.includes("Space+Grotesk"), true);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/smoke/theme.test.js`
Expected: FAIL because current HTML does not import those font families.

**Step 3: Implement minimal styling migration**

Update `app/styles.css` to:

```css
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(220 13% 13%);
  --primary: hsl(262 83% 58%);
  --muted-foreground: hsl(220 9% 46%);
  --border: hsl(220 13% 91%);
  --radius: 0.75rem;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.title,
.viewer-head strong {
  font-family: "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

Also remap existing classes (`.list`, `.viewer-head`, `.controls button`, `.notice`) to semantic tokens and shared transitions/shadows.

Update `app/index.html` with font loading links for Inter + Space Grotesk in `<head>`.

**Step 4: Run targeted test to verify it passes**

Run: `node --test tests/smoke/theme.test.js`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/styles.css app/index.html tests/smoke/theme.test.js
git commit -m "feat: adopt lab visual language tokens and typography"
```

### Task 3: Verify full suite and document style direction

**Files:**
- Modify: `README.md`
- Test: `tests/smoke/*.test.js`
- Test: `tests/unit/*.test.js`

**Step 1: Write doc update for visual language**

Add a short section to `README.md` describing:
- semantic token approach in `app/styles.css`
- typography choices
- explicit non-goal: no theme-toggle behavior in this pass

Example snippet:

```md
## Visual language

The app styling adopts semantic tokens (`--background`, `--foreground`, `--primary`, `--border`) and uses Inter + Space Grotesk to match the broader Callum Rowe lab style direction.
```

**Step 2: Run full test suite**

Run: `npm test`
Expected: PASS for all smoke and unit tests.

**Step 3: Run docker config sanity check**

Run: `docker compose config`
Expected: Valid compose output with no errors.

**Step 4: Commit**

```bash
git add README.md
git commit -m "docs: record style adoption constraints"
```

**Step 5: Final verification commit (if needed for fixes)**

If any fixes were required after verification:

```bash
git add -A
git commit -m "fix: address verification issues for style adoption"
```

## Verification

- `node --test tests/smoke/theme.test.js`
- `npm test`
- `docker compose config`

## Notes

- Preserve all current routes and `app/app.js` interaction behavior.
- Do not add dark mode or theme switching in this scope.
- Keep CSS changes DRY by using semantic tokens and reusing existing selectors.
