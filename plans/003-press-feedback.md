# 003 — Add press feedback to buttons

- **Status**: TODO
- **Commit**: none (not a git repository); written 2026-09-24 against the files quoted below
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 6 files, one class string each (plus one new const in `stack-navigator.tsx`)

## Problem

No button in the library responds to being pressed. Everything else animates carefully, but a click on Continue, a carousel arrow or a demo button gives no physical feedback until the result appears. The standard is a subtle scale on `:active`: `transform: scale(0.97)` with `transition: transform 160ms ease-out`.

Buttons to fix, with their current class strings verbatim:

`src/registry/carousel.tsx:43` (the prev/next arrows; they sit outside the animated slide):

```ts
const arrow =
  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-background outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
```

`src/registry/step-wizard.tsx:38` (Back, Continue and Start over; outside the animated step):

```ts
const button =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-7 gap-1 rounded-md border border-transparent px-2.5 text-[0.8rem] [&_svg]:size-3.5"
```

`src/registry/stack-navigator.tsx:44`. This const is used by the **Send** button (inside the animated screen). The **Back** button (outside it) uses `backButton`, derived from it just below. Only the Back button gets feedback.

```ts
const iconButton =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-7 rounded-md [&_svg]:size-4"
```

`src/components/docs/examples/animated-list.tsx:50`:

```ts
const button =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-7 gap-1 rounded-md px-2.5 text-[0.8rem] border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:size-3.5"
```

`src/components/docs/examples/photo-grid.tsx:41`:

```ts
const button =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-7 gap-1 rounded-md border border-transparent px-2.5 text-[0.8rem] [&_svg]:size-3.5"
```

`src/components/docs/examples/number-flip.tsx:46`:

```ts
const button =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-8 gap-1.5 rounded-lg px-2.5 text-sm border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:size-4"
```

## Target

Every button above gets this exact set of classes. Where the string has `transition-colors`, **replace** it; don't keep both, because two transition utilities conflict unpredictably in Tailwind v4.

```
transition-[color,background-color,border-color,transform] duration-160 ease-out active:scale-[0.97] motion-reduce:active:scale-100
```

- `active:scale-[0.97]` is the press, 0.97 as the standard specifies.
- `duration-160 ease-out` is 160ms on Tailwind's `ease-out`, `cubic-bezier(0, 0, 0.2, 1)`.
- The transition list keeps the colour transitions `transition-colors` provided, and adds `transform`.
- `motion-reduce:active:scale-100` means reduced motion keeps the colour feedback and drops the scale.

## Repo conventions to follow

- Class strings are plain Tailwind in a `const` at the top of each file. There's no `cn()` in `src/registry/`, and the only import there is `react`.
- Keep every existing class in each string. Only swap `transition-colors`, or add the set where there's no transition, as in `arrow`.
- **Never** add press feedback to anything that is, or sits inside, a `<ViewTransition>` boundary that animates on that click. The snapshot is taken while the button is pressed, so it would bake the 0.97 scale into the animation and cause a visible jump. That's why these are excluded (see Boundaries).

## Steps

1. `src/registry/carousel.tsx:43`: insert the target classes into `arrow`, right after `outline-none`. It currently has no transition.
2. `src/registry/step-wizard.tsx:38`: in `button`, replace `transition-colors` with the target classes.
3. `src/registry/stack-navigator.tsx`: leave `iconButton` unchanged; the Send button inside the animated chat keeps it, since pressing would bake its scale into the transition's snapshot. The Back button already has its own const, directly below `iconButton`:

   ```ts
   // Back is hidden, not dimmed, when there's nothing to go back to
   const backButton = iconButton.replace("disabled:opacity-50", "disabled:opacity-0")
   ```

   Replace it with this, so Back also presses in:

   ```ts
   // Back is hidden, not dimmed, when there's nothing to go back to, and presses in.
   // Send (inside the animated chat) doesn't: pressing would bake its scale into the snapshot.
   const backButton = iconButton
     .replace("disabled:opacity-50", "disabled:opacity-0")
     .replace(
       "transition-colors",
       "transition-[color,background-color,border-color,transform] duration-160 ease-out active:scale-[0.97] motion-reduce:active:scale-100",
     )
   ```

   Line 156 (Send) keeps `${iconButton}`.

4. In `src/components/docs/examples/animated-list.tsx:50`, `photo-grid.tsx:41` and `number-flip.tsx:46`, replace `transition-colors` in `button` with the target classes. (`photo-grid.tsx:43`, `outline`, is only a colour modifier; leave it.)
5. Run `npm run format` and `npm run skill`. The skill bundles the component files and the examples.

## Boundaries

Do NOT add press feedback to:

- `src/registry/morphing-popover.tsx`: the trigger is the morphing surface itself, and Cancel and Send are inside it.
- `src/registry/post-list.tsx` rows: they wrap the shared shell that morphs on click.
- `src/registry/tabs.tsx` tab triggers: a segmented control switched all day; keep it still.
- `src/registry/stack-navigator.tsx:156`, the Send button inside the chat screen.
- Anything in `src/components/docs/examples/dynamic-island.tsx`: its buttons are inside the island's boundary.
- The Page Transition demo's page and effect switchers.
- `src/components/ui/*` (the docs site's shadcn primitives).

Also:

- Do NOT change sizes, colours, padding or any other class.
- If a quoted string doesn't match (drift), STOP and report.

## Verification

- **Mechanical**:
  - `npm test` passes (monochrome, CSS and skill tests).
  - `npm run lint` shows 0 warnings or errors.
  - `npm run build` succeeds.
  - `npx prettier --check .` passes.
  - `grep -c "active:scale-\[0.97\]" src/registry/carousel.tsx src/registry/step-wizard.tsx src/registry/stack-navigator.tsx src/components/docs/examples/{animated-list,photo-grid,number-flip}.tsx` prints 1 for each file.
- **Feel check** (`npm run dev`):
  - Press and hold Continue on `/step-wizard`. It dips slightly (0.97) and returns on release. A normal click shows a barely noticeable dip, not a bounce.
  - Do the same on `/carousel` (arrows), `/number-flip`, `/animated-list` and `/photo-grid` (demo buttons), and on the Back button of `/stack-navigator` after opening a chat.
  - On `/stack-navigator`, tap Back mid-way through the push animation. The screen slides back smoothly, with no jump from the button scale.
  - In the DevTools Rendering panel, emulate `prefers-reduced-motion: reduce`. Pressing no longer scales; the hover colour still changes.
  - Check the popover trigger, Post List rows and tabs: none of them scale on press.
- **Done when**: the listed buttons (five class strings and `backButton`) press in, none of the excluded ones do, and all checks pass.
