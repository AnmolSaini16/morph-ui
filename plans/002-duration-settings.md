# 002 — Make every duration tunable through `--vt-*` settings

- **Status**: TODO (run after 001)
- **Commit**: none (not a git repository); written 2026-09-24 against the files quoted below
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`src/registry/morph.css`), about 12 value swaps plus 2 lines in the settings list

## Problem

`src/registry/morph.css` promises, in its header: "Tune everything through the settings below." Most timings do go through `--vt-*` settings (`var(--vt-move, 420ms)`), but three groups of durations are typed as bare numbers. A user who sets `:root { --vt-move: 300ms; }` or wants a slower crossfade can't reach them:

- **250ms, the crossfade:**
  - `vt-blur` old/new, `morph.css:181`, `:184`
  - `vt-blur`'s lone exit, `morph.css:207`
  - `vt-expand` old/new, `morph.css:394`, `:397`
- **300ms, the UI-length step:**
  - `vt-rise` enter, `morph.css:266`
  - `vt-pop` group and enter, `morph.css:282`, `:289`
  - `vt-slide` group and slide parts, `morph.css:442`, and the two `300ms …vt-slide…` lines in its old and new rules
- **200ms:** `vt-pop` exit, `morph.css:294`, the only exit not on `--vt-exit`.

Current, verbatim (line numbers from before plan 001; search by content):

```css
::view-transition-old(.vt-blur) {
  animation: 250ms var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-blur-out;
}
::view-transition-new(.vt-blur) {
  animation: 250ms var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-blur-in;
}
::view-transition-old(.vt-blur):only-child {
  animation: 250ms var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-blur-leave;
}
::view-transition-old(.vt-expand) {
  animation: 250ms var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-blur-out;
}
::view-transition-new(.vt-expand) {
  animation: 250ms var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-blur-in;
}
::view-transition-new(.vt-rise) {
  animation: 300ms var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-rise;
}
::view-transition-group(.vt-pop) {
  animation-duration: 300ms;
  …
}
::view-transition-new(.vt-pop):only-child {
  animation: 300ms
    var(--vt-bounce, linear(0, 0.22 8%, 0.6 18%, 0.94 30%, 1.07 40%, 1.05 48%, 1 60%, 0.99 74%, 1))
    both vt-pop;
}
::view-transition-old(.vt-pop):only-child {
  animation: 200ms var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-pop-out;
}
::view-transition-group(.vt-slide) {
  animation-duration: 300ms;
  …
}
/* and inside the vt-slide old/new rules (after plan 001): */
    300ms var(--vt-ease, cubic-bezier(0.32, 0.72, 0, 1)) both vt-slide-out;
    300ms var(--vt-ease, cubic-bezier(0.32, 0.72, 0, 1)) both vt-slide;
```

## Target

Two new settings, and one existing setting reused. Every value stays the same except the pop exit (200ms to 150ms, matching every other exit).

| Current literal                                                                                | Becomes                      |
| ---------------------------------------------------------------------------------------------- | ---------------------------- |
| `250ms` (5 places: vt-blur ×3, vt-expand ×2)                                                   | `var(--vt-crossfade, 250ms)` |
| `300ms` (vt-rise enter, vt-pop group and enter, vt-slide group and both slide parts: 6 places) | `var(--vt-step, 300ms)`      |
| `200ms` (vt-pop exit)                                                                          | `var(--vt-exit, 150ms)`      |

Settings list, the header comment in `morph.css`. Insert these two lines directly after the `--vt-slow` line, aligned with the columns around them:

```
   --vt-crossfade        250ms   one view dissolving into another (vt-blur, vt-expand)
   --vt-step             300ms   UI-length motion: steps, pops, rises (vt-slide, vt-pop, vt-rise)
```

Example of a converted rule:

```css
::view-transition-new(.vt-rise) {
  animation: var(--vt-step, 300ms) var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-rise;
}
```

## Repo conventions to follow

- Settings are **never declared**. Each use is written as `var(--vt-name, default)` with the same default every time, and nothing new goes on `:root`. `tests/component-css.test.mjs` fails if one setting has two different defaults, or if anything but `view-transition-name` is declared on `:root`.
- Exemplar of the convention: `::view-transition-group(.vt-slow) { animation-duration: var(--vt-slow, 480ms); }` in `morph.css`.
- Every setting must appear in the header list, because the agent skill's settings table is generated from it (`scripts/build-skill.mjs`).

## Steps

1. Confirm plan 001 is done: the `::view-transition-new(.vt-slide)` rule no longer contains `var(--vt-enter-delay, 90ms)`. If it still does, STOP; this plan must run after 001.
2. In `src/registry/morph.css`, add the two settings lines to the header list, right after `--vt-slow`.
3. Replace the five `250ms` animation durations listed in the table with `var(--vt-crossfade, 250ms)`. Only change durations that start an `animation:` value, never numbers inside comments.
4. Replace the six `300ms` durations listed in the table with `var(--vt-step, 300ms)`. That covers `vt-rise` enter, `vt-pop` group `animation-duration`, `vt-pop` enter, `vt-slide` group `animation-duration`, and the `300ms` at the start of the `vt-slide-out` and `vt-slide` lines.
5. Replace `200ms` in the `::view-transition-old(.vt-pop):only-child` rule with `var(--vt-exit, 150ms)`.
6. Leave `@media (prefers-reduced-motion: reduce)` alone: its `150ms` is a deliberate fixed value for reduced motion.
7. Run `npm run format`, then `npm run skill`.

## Boundaries

- Do NOT change any other value, curve or keyframe.
- Do NOT touch `--vt-swipe-duration` or `--vt-push-duration`; they're already settings.
- Do NOT edit `.tsx` files or anything outside `src/registry/morph.css`, apart from the `skills/` output `npm run skill` generates.
- If a quoted rule isn't found (drift), STOP and report.

## Verification

- **Mechanical**:
  - `npm test` passes. In particular, "every setting carries the same default everywhere" must pass, and it will catch a typo'd default.
  - `grep -nE "animation(-duration)?: [0-9]+ms" src/registry/morph.css` prints only the lines inside `@media (prefers-reduced-motion: reduce)`.
  - `npm run lint`, `npm run build` and `npx prettier --check .` all pass.
- **Tunability**: in the browser's DevTools, add `:root { --vt-crossfade: 1000ms; --vt-step: 1000ms; }` to the page styles.
  - On `/page-transition`, switching pages takes about a second.
  - On `/step-wizard`, Continue takes about a second.
  - On `/photo-grid`, Add takes about a second.
  - Remove the override afterwards.
- **Feel check**: with no overrides, every animation looks exactly as before, except Photo Grid's shrink-away on remove, which is now 150ms instead of 200ms. Remove a few photos in `/photo-grid`: they should vanish crisply with no pop or jump at the end. View at 10% playback in the DevTools Animations panel to compare.
- **Done when**: every duration in `morph.css` outside the reduced-motion block reads from a `--vt-*` setting, both new settings are in the header list, and all checks pass.
