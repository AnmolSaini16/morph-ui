# 004 — Stop List Switcher's descriptions leaving before the list is ready

- **Status**: TODO
- **Commit**: none (not a git repository); written 2026-09-24 against the files quoted below
- **Severity**: LOW
- **Category**: Easing & duration
- **Estimated scope**: 2 files, 2 small edits

## Problem

Switching List Switcher from cards to list removes each repository's description. The description leaves with `vt-fade`, which fades it out over 150ms on a strong ease-out, so it's mostly gone by ~60ms, while the cards are still reshaping around it. Measured frame by frame, the list area loses 10% of its visible content at 80ms, then recovers. It's a small hollow beat in an otherwise continuous change.

The description leaves alone: nothing takes its place, since list view has no description. For a view that leaves alone, the library's own answer is to stay a beat before fading, which is what `vt-blur` does for a lone exit.

`src/registry/list-switcher.tsx:179–185`, current:

```tsx
{
  isCards && (
    <ViewTransition enter="vt-fade vt-text vt-delay-3" exit="vt-fade vt-text">
      <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
        {repo.description}
      </p>
    </ViewTransition>
  )
}
```

## Target

Only the exit changes. The enter (list to cards) keeps its deliberate 105ms delay, so descriptions appear after the cards have opened up.

```tsx
                      <ViewTransition enter="vt-fade vt-text vt-delay-3" exit="vt-blur vt-text">
```

What `vt-blur` does for a lone exit, already in `src/registry/morph.css`:

```css
/* A view leaving on its own, with nothing taking its place (a list as a card
   opens over it), stays for a beat before it fades, so the area never empties */
::view-transition-old(.vt-blur):only-child {
  animation: 250ms var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-blur-leave;
}
@keyframes vt-blur-leave {
  40% {
    opacity: 1;
  }
  to {
    opacity: 0;
    filter: blur(4px);
  }
}
```

If plan 002 has already run, that `250ms` reads `var(--vt-crossfade, 250ms)`, which is equivalent.

## Repo conventions to follow

- Each component lists the `vt-*` classes it uses in `src/lib/component-css.ts`. That list is how its CSS snippet is generated, and a test fails if a class used in the component is missing.
- Exemplar of the same pattern: Post List's list, `src/registry/post-list.tsx`, uses `exit="vt-blur"` for a view that leaves on its own.

## Steps

1. In `src/registry/list-switcher.tsx:180`, change `exit="vt-fade vt-text"` to `exit="vt-blur vt-text"`. Leave `enter` exactly as it is.
2. In `src/lib/component-css.ts`, add `"vt-blur"` to the `"list-switcher"` array, after `"vt-fade"`. Current array:

   ```ts
     "list-switcher": [
       "vt-clip",
       "vt-edge-bottom",
       "vt-move",
       "vt-shell",
       "vt-text",
       "vt-fade",
       "vt-delay-3",
     ],
   ```

3. Run `npm run format` and `npm run skill`.

## Boundaries

- Do NOT change the `enter` prop, any other `<ViewTransition>` in the file, or any class in `morph.css`.
- Do NOT touch other components.
- If the quoted line doesn't match (drift), STOP and report.
- If step 1's feel check shows the description visibly sticking out past its shrinking card, STOP and report. Don't try other classes.

## Verification

- **Mechanical**:
  - `npm test` passes; it checks the manifest covers every class used.
  - `npm run lint` shows 0 warnings or errors, and `npm run build` succeeds.
  - `npx prettier --check .` passes.
- **Measured**: build and run with `npm run build && npm run start` (port 3000). Then use the frame-by-frame dip script from plan 001, saved as `/tmp/vt-check/dip.mjs` with `puppeteer-core` installed in `/tmp/vt-check`, and run:

  ```bash
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node /tmp/vt-check/dip.mjs http://localhost:3000/list-switcher "article [data-slot=card] .overflow-y-auto" '[...document.querySelectorAll("article [data-slot=card] button[aria-pressed=false]")][0].click()'
  ```

  Before this plan it prints `dip 10%`. After, it must print **5% or less**. If plan 001 isn't done, `dip.mjs` won't exist; create it by copying the script from plan 001's Verification section.

- **Feel check** (`npm run dev`, `/list-switcher`):
  - Switch cards to list. The descriptions stay a moment, soften and fade as the cards become rows, with no hollow beat.
  - Set playback to 10% in the DevTools Animations panel. Each description stays inside its card while fading. If one hangs outside a card that has already shrunk, STOP and report.
  - Switch list to cards. Unchanged: descriptions appear just after the cards open.
  - Emulate `prefers-reduced-motion: reduce`. Descriptions simply crossfade.
- **Done when**: dip is 5% or less, descriptions stay inside their cards, and all checks pass.
