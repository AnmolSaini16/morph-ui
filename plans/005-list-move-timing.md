# 005 — Give list reorders a UI-length move (feel-check first)

- **Status**: TODO (run after 002; has a human decision gate)
- **Commit**: none (not a git repository); written 2026-09-24 against the files quoted below
- **Severity**: LOW
- **Category**: Easing & duration
- **Estimated scope**: 5 files, small edits, and only if the gate says go

## Problem

Rows in Animated List (shuffle, sort, add, remove) and cards in List Switcher (cards to list) move with `vt-move`, whose default is 420ms on `cubic-bezier(0.32, 0.72, 0, 1)`. That timing was chosen for **morphs**, a card opening into an article, and it's right there: modals and drawers get 200–500ms. Reordering a list is **UI** motion, whose budget is under 300ms. At 420ms, a shuffle can feel like it's waiting to finish.

This can't be judged from code alone: the moves travel far, and the curve is front-loaded, so 420ms may already read as ~300ms. So this plan starts with a feel-check, and only changes code if the shorter timing wins.

Where the moves come from, current:

```tsx
// src/registry/animated-list.tsx:83
<ViewTransition key={task.id} default="vt-move vt-presence">
// src/registry/list-switcher.tsx:161
<ViewTransition update="vt-move vt-shell">
// src/registry/list-switcher.tsx:167 and :187
<ViewTransition update="vt-move vt-text">
```

```css
/* src/registry/morph.css — the shared move timing */
::view-transition-group(.vt-move),
::view-transition-group(.vt-morph),
::view-transition-group(.vt-fade),
::view-transition-group(.vt-roll) {
  animation-duration: var(--vt-move, 420ms);
  animation-timing-function: var(--vt-ease, cubic-bezier(0.32, 0.72, 0, 1));
}
```

**Do not** shorten `--vt-move` itself. Post List, Morphing Popover and Dynamic Island use it for morphs, and their timing was tuned deliberately.

## Target

Only if the decision gate (step 1) says go: a new modifier class that brings any move to the UI-length setting from plan 002, applied to the list components.

```css
/* target: src/registry/morph.css, placed directly after the vt-quick rules */
/* vt-brisk: a UI-length move (--vt-step) for lists that reorder or change layout,
   shorter than vt-move's morph timing. It comes after every motion class, so it wins
   over their durations; add it next to one: "vt-move vt-brisk". */
::view-transition-group(.vt-brisk) {
  animation-duration: var(--vt-step, 300ms);
}
```

```tsx
// src/registry/animated-list.tsx:83
<ViewTransition key={task.id} default="vt-move vt-brisk vt-presence">
// src/registry/list-switcher.tsx:161
<ViewTransition update="vt-move vt-brisk vt-shell">
// src/registry/list-switcher.tsx:167 and :187
<ViewTransition update="vt-move vt-brisk vt-text">
```

## Repo conventions to follow

- Modifier classes that change a duration come **after** every motion class in `morph.css`, so they win at equal specificity. The exemplar is `vt-quick`, just before the `/* ── Stagger` section:

  ```css
  ::view-transition-group(.vt-quick) {
    animation-duration: var(--vt-enter, 210ms);
  }
  ```

- Settings use `var(--vt-step, 300ms)`, always with that exact default (plan 002 adds `--vt-step`).
- New classes are listed in `classGroups` in `src/lib/reference.ts`, which feeds the Getting started class table and the agent skill. A test fails if a class in `morph.css` isn't documented there.
- Each component's classes are listed in `src/lib/component-css.ts`.

## Steps

1. **Decision gate. Do this and STOP.**
   - Confirm plan 002 is done: `grep -c "var(--vt-step, 300ms)" src/registry/morph.css` prints 1 or more. If not, STOP.
   - Run `npm run dev`. On `/animated-list`, click Shuffle and Sort several times; on `/list-switcher`, toggle cards and list several times.
   - In DevTools, add a temporary style rule, `:root { --vt-move: 300ms; }`, and repeat. It also speeds up morphs; for this test, only judge the lists.
   - Remove the temporary rule.
   - Report both impressions to the human and ask: **"Should list moves use 300ms (go) or keep 420ms (no-go)?"** Don't continue until they answer. If no-go, set this plan's Status to `WONTFIX` and stop.
2. (Go only.) In `src/registry/morph.css`, add the `vt-brisk` rule from Target directly after the `::view-transition-old(.vt-quick), ::view-transition-new(.vt-quick)` rule, before `/* ── Stagger`.
3. (Go only.) Apply the class at the four locations in Target, adding `vt-brisk` right after `vt-move` and changing nothing else.
4. (Go only.) In `src/lib/component-css.ts`, add `"vt-brisk"` to the `"animated-list"` array and to the `"list-switcher"` array.
5. (Go only.) In `src/lib/reference.ts`, in `classGroups`, "Motion" group, add this row right after the `vt-quick` row:
   `["vt-brisk", "A UI-length move for lists that reorder or change layout"],`
6. (Go only.) Run `npm run format` and `npm run skill`.

## Boundaries

- Do NOT change `--vt-move`'s default, or any morph component (Post List, Morphing Popover, Dynamic Island, Tabs, Carousel, Step Wizard, Stack Navigator, Page Transition).
- Do NOT change Photo Grid; `vt-pop` is already 300ms.
- Do NOT change the presence fades (`vt-presence`) or the descriptions' enter and exit in List Switcher.
- Never skip the decision gate.

## Verification

- **Mechanical** (go only): `npm test` passes; it checks the manifest, the class docs, a single default per setting, and Lightning CSS parsing. `npm run lint` shows 0 warnings or errors, `npm run build` succeeds, and `npx prettier --check .` passes.
- **Timing** (go only): on `/animated-list`, click Shuffle, then run this in the console while it animates:
  `Math.max(...document.getAnimations().filter(a => a.effect?.pseudoElement?.startsWith("::view-transition-group")).map(a => a.effect.getComputedTiming().duration))`
  It returns `300`, not `420`. Opening a post on `/post-list` still returns `420`.
- **Feel check** (go only):
  - Shuffle and Sort: rows land crisply, with no long tail.
  - Add: the new row still rises in, and the rows below make room in step with it.
  - List Switcher: cards fold into rows faster, and names and stats stay in sync with their cards. At 10% playback, text never lags or overshoots its card.
  - Emulate `prefers-reduced-motion: reduce`: rows jump into place and content crossfades, as before.
- **Done when**: the gate is answered and, if go, list moves measure 300ms, morphs still measure 420ms, and all checks pass.
