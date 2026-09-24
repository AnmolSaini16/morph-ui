---
name: morph-ui
description: Add Morph UI's animated React components and write view transitions with React's <ViewTransition> and the vt-* CSS classes. Use when the user wants a Morph UI component (post list, dynamic island, morphing popover, morph dialog, number flip, animated list, photo grid, list switcher, tabs, carousel, step wizard, stack navigator, page transition), or wants to animate UI changes in React 19.3+ without an animation library, such as shared-element morphs, list add/remove/reorder, directional slides, number rolls or route transitions in Next.js.
---

# Morph UI

Animated React components you copy and paste. Each one is a single `.tsx` file whose only import is `react`, plus the shared `morph.css`. The motion comes from the browser's View Transition API through React's `<ViewTransition>`. There is no animation library.

## Before you start

1. **React 19.3 or newer.** `ViewTransition` and `addTransitionType` are imported from `react`. Check `package.json`. If React is older, tell the user and stop; don't polyfill or fall back to another library.
2. **Tailwind CSS v4 with shadcn theme variables** (`--background`, `--foreground`, `--card`, `--muted`, `--muted-foreground`, `--border`, `--ring`, `--radius`, …). shadcn projects already have them. If they're missing, add `assets/theme.css` to the global stylesheet after `@import "tailwindcss"`, and tell the user to change the values to their own.
3. **Find the paths.** Components go where the project keeps them: check `components.json` (`aliases.components`) or the `@/*` path in `tsconfig.json`. The global stylesheet is usually `app/globals.css` or `src/app/globals.css`.

## Install a component

1. **CSS, once per project.** If the project has no `morph.css` yet, copy `assets/morph.css` next to the global stylesheet and import it after Tailwind and the theme:
   ```css
   @import "tailwindcss";
   @import "./morph.css";
   ```
   It holds every `vt-*` class, so later components need no extra CSS. Never edit it per component.
2. **Component.** Copy `assets/components/<slug>.tsx` into the components folder unchanged.
3. **Usage.** `assets/examples/<slug>.tsx` is a working example (it imports from `@/components/<slug>`). Adapt it to the user's data and fix the import path if theirs differs.
4. **Scrolling.** If the app has no `SkipOnScroll` yet, add it once to the root layout (see `references/patterns.md`). Otherwise content drifts when the page scrolls mid-animation.

Components:

- **Post List** (`post-list`): A post expands into the full article and folds back into the list.
- **Dynamic Island** (`dynamic-island`): One shape, many states. The pill expands and reveals its content.
- **Morphing Popover** (`morphing-popover`): A button grows into a panel and folds back into the button.
- **Morph Dialog** (`morph-dialog`): A card grows into a modal dialog and folds back when it closes.
- **Number Flip** (`number-flip`): Changed digits roll a full line, with an optional stagger.
- **Animated List** (`animated-list`): Add, remove, shuffle and sort with zero layout math.
- **Photo Grid** (`photo-grid`): Photos pop in, shrink away and bounce into their new spots.
- **List Switcher** (`list-switcher`): Cards fold into a list; names and stats glide into place.
- **Tabs** (`tabs`): The underline glides to your tab; the panel slides the same way.
- **Carousel** (`carousel`): Cards slide by like a track, with arrows or dots.
- **Step Wizard** (`step-wizard`): Steps slide the way you move, forward or back.
- **Stack Navigator** (`stack-navigator`): Chats push in from the right and pop back out, like a native app.
- **Page Transition** (`page-transition`): Swap views with a crossfade, a blurred one, or sections one by one.

Props, data shapes and the CSS classes each one uses: `references/components.md`.

## Writing your own transitions

Use this when the user wants something animated that isn't one of the components. Compose the existing `vt-*` classes (`references/classes.md`). Only write new `::view-transition-*` CSS when no combination fits, and follow the rules at the end of this section.

```tsx
import { startTransition, ViewTransition, type ReactNode } from "react"

// Finish a running animation first, so fast clicks show up right away
function animate(update: () => void) {
  document.activeViewTransition?.skipTransition()
  startTransition(update)
}

// Mark what animates, and how: here a card that resizes
function Panel({ children }: { children: ReactNode }) {
  return (
    <ViewTransition update="vt-move vt-shell">
      <div className="rounded-xl bg-card p-4">{children}</div>
    </ViewTransition>
  )
}
```

Rules that matter:

- **Only React's `<ViewTransition>`.** Never call `document.startViewTransition()`; it interrupts React's transitions.
- **Changes animate only inside `startTransition`** (or Suspense and `useDeferredValue`). A plain `setState` changes instantly.
- **Call `document.activeViewTransition?.skipTransition()` before every `startTransition`.** React holds a new transition until the running one ends, so without it a click mid-animation feels dead.
- **Use functional updates** (`setX((x) => …)`): while an animation runs, closures go stale.
- **Guard no-op changes.** Clicking the tab that's already active must not start a transition.
- **Never animate keyboard-driven changes** (arrow keys, shortcuts). Set state directly, after `document.activeViewTransition?.skipTransition()`; motion on every key press makes it feel slow.
- **Match motion to frequency.** UI used all day (tabs, toggles) stays near 200ms: add `vt-quick`. Keep UI motion under 300ms; only big morphs, like a card opening, take longer.
- **Pick triggers with props:** `update`, `enter`, `exit`, `share`, or `default` for all of them. Add `default="none"` when only one trigger should animate.
- **`enter` and `exit` fire only on the outermost `<ViewTransition>`** of an inserted or removed subtree, and it must wrap a DOM element directly. Give list items stable keys: `<ViewTransition key={item.id} default="vt-move vt-presence">`.
- **Shared elements:** the same `name` on the old and new element, plus `share="vt-move"` (or `vt-morph`, `vt-expand`). Namespace names with `useId()` so two instances never pair. Both sides must be nested the same way.
- **Direction:** `addTransitionType("step-next")` inside `startTransition`, mapped with `update={{ "step-next": "vt-slide vt-forward", "step-back": "vt-slide vt-back", default: "none" }}`.
- **Keep controls outside the boundary.** Elements inside a `<ViewTransition>` are replaced by a snapshot while it animates.
- **Snapshots paint above the whole page.** A moving snapshot covers anything it passes over. A tab highlight behind the labels would hide them, so use an underline instead.
- **Fixed heights** around anything that grows or shrinks, so the page doesn't jump.
- **Next.js routes:** use a `<ViewTransition>` keyed by `usePathname()` (`references/patterns.md`), not `app/template.tsx`, which doesn't re-mount for nested routes.
- **Colors come from the user's theme.** Use `bg-card`, `text-muted-foreground`, `border-border` and so on, never palette colors like `bg-blue-500`, white or black.

If you write new CSS:

- Tailwind can't style `::view-transition-*`; it lives on the root. Put the CSS in the global stylesheet, keyed by class: `::view-transition-group(.my-class)`.
- Give every setting a default where it's used, like `var(--vt-move, 420ms)`. Don't declare anything on `:root`.
- Snapshots ignore `overflow`. Clip with `overflow: clip` plus `border-radius` on `::view-transition-image-pair(.my-class)`.
- Use a real `border` on anything that slides. A `box-shadow` ring sits outside the box and gets cut off.
- Reference every `@keyframes` from an `animation` shorthand.
- Never `ease-in` on UI: it delays the moment people are watching. Use `var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1))` for fades and `var(--vt-ease, cubic-bezier(0.32, 0.72, 0, 1))` for moves.
- Never scale from nothing: start at `scale: 0.9` or more, with opacity.

## Tuning

Every timing and curve is a `--vt-*` setting with a built-in default. Set any of them in the user's CSS, for example `:root { --vt-move: 300ms; }`. The full list is in `references/classes.md`. Reduced motion is already handled by `morph.css`.
