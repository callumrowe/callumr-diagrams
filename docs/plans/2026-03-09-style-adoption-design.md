# Style Adoption Design

## Goal

Adopt the visual language from `callum-rowe-lab` into the diagrams app while preserving all current behavior, routes, and interaction logic.

## Scope

- In scope: design tokens, typography, spacing rhythm, gradients/surfaces, border radius, shadows, transitions, and component-level visual treatment.
- Out of scope: theme toggling, dark-mode behavior, route/state changes, data model changes, manifest/schema changes.

## Product Direction

- Keep the current minimalist reading-focused UI.
- Shift the current monochrome system to the lab's neutral + violet tokenized visual language.
- Improve perceived polish without introducing feature or interaction changes.

## Architecture

- Styling-only migration.
- `app/app.js` remains behaviorally unchanged.
- `app/styles.css` becomes token-led and maps existing selectors to new tokens.
- `app/index.html` adds font loading for `Inter` (body) and `Space Grotesk` (display text).

## Style System Plan

- Introduce semantic tokens modeled on lab conventions:
  - Core: `--background`, `--foreground`, `--card`, `--muted`, `--border`, `--primary`, `--accent`, `--radius`.
  - Supporting tokens: neutral grays, charcoal text tones, violet accent shades.
  - Effects: subtle gradient/background atmospherics, shared shadows, shared transition curve.
- Refactor existing rule blocks to consume tokens rather than ad hoc hex values.

## Component Mapping

- `shell` and `viewer-shell`: spacing and surface tuning for stronger layout rhythm.
- `title` and viewer heading text: display font + tightened hierarchy treatment.
- `subtle`: muted semantic color alignment.
- `list` and list links: card-like panel treatment with tokenized borders and hover feedback.
- `viewer-head`: tokenized backdrop and separator treatment.
- `controls button`: unified radius/border/shadow/transition treatment.
- `notice`: visual alignment with tokenized system for error/info states.

## Data Flow and Error Handling

- Data flow stays unchanged (manifest fetch, route parse, index/detail render).
- Error handling logic stays unchanged.
- Only state presentation changes via updated `notice` styling.

## Testing and Verification

- Existing tests should remain valid because no behavior or structure changes are planned.
- Run full suite after style updates to verify no regressions.

## Risks and Mitigations

- Risk: visual drift from current app readability.
  - Mitigation: keep current layout structure and interaction affordances intact.
- Risk: typography or spacing regressions on narrow screens.
  - Mitigation: preserve mobile breakpoint and tune spacing with responsive checks.
- Risk: over-adoption introducing unwanted theming complexity.
  - Mitigation: explicitly exclude theme system work in this pass.
