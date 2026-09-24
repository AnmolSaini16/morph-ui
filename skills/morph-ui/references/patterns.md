# Patterns

Short recipes built from the `vt-*` classes. Each assumes the `animate()` helper from SKILL.md:

```tsx
function animate(update: () => void) {
  document.activeViewTransition?.skipTransition()
  startTransition(update)
}
```

## A list: add, remove, reorder

Stable keys let React match items before and after. Moved items glide; added and removed ones fade.

```tsx
<ul className="grid gap-2">
  {items.map((item) => (
    <ViewTransition key={item.id} default="vt-move vt-presence">
      <li className="rounded-lg border border-border bg-card p-3">{item.title}</li>
    </ViewTransition>
  ))}
</ul>

<button type="button" onClick={() => animate(() => setItems((items) => shuffle(items)))}>
  Shuffle
</button>
```

For a bouncier grid use `vt-pop` alone: `default="vt-pop"`.

## A shared element: a card that opens

The same name on both sides pairs them. The card's surface resizes while its contents crossfade.

```tsx
const id = useId()

{
  open ? (
    <ViewTransition name={`${id}-card`} share="vt-move vt-expand">
      <article className="rounded-xl bg-card p-6">…full view…</article>
    </ViewTransition>
  ) : (
    <ViewTransition name={`${id}-card`} share="vt-move vt-expand">
      <button
        type="button"
        onClick={() => animate(() => setOpen(true))}
        className="rounded-xl bg-card p-3"
      >
        …summary…
      </button>
    </ViewTransition>
  )
}
```

Add a named boundary with `share="vt-move vt-text"` for a title that should glide without stretching, or `vt-move vt-cover` for an image.

## A shape that changes: a pill or panel

The outer boundary animates the size and paints the surface (`vt-shell`), and clips what's inside (`vt-clip` plus `view-transition-group: contain` on the element). The nested boundary carries the content, which scales open from the middle.

```tsx
<ViewTransition update="vt-move vt-shell vt-clip">
  <div className="overflow-hidden rounded-xl bg-card [view-transition-group:contain]">
    <ViewTransition update="vt-move vt-reveal vt-center">
      <div>{content}</div>
    </ViewTransition>
  </div>
</ViewTransition>
```

Add `vt-spring` to both for a soft settle, or `vt-inverse` to the outer one for a pill in the inverse of the theme (paint the element `bg-foreground text-background` to match). The Dynamic Island component is this pattern.

## Direction: steps, tabs, a carousel

Tag the transition with its direction and map each type to a class.

```tsx
const go = (to: number) =>
  to !== step &&
  animate(() => {
    addTransitionType(to > step ? "step-next" : "step-back")
    setStep(to)
  })

<ViewTransition
  update={{
    "step-next": "vt-slide vt-clip vt-forward",
    "step-back": "vt-slide vt-clip vt-back",
    default: "none",
  }}
>
  <div className="h-40">{steps[step]}</div>
</ViewTransition>
```

Swap `vt-slide` for `vt-swipe` (a full-width swap, like a carousel) or `vt-push` (an iOS-style stack).

## A number that rolls

One boundary per digit, keyed by its place from the right, so only changed digits roll. Work out the direction during render, so it belongs to the same update as the new value.

```tsx
const [previous, setPrevious] = useState(value)
const [direction, setDirection] = useState<"forward" | "back">("forward")
if (previous !== value) {
  setPrevious(value)
  setDirection(value >= previous ? "forward" : "back")
}

const text = String(value)
{
  text.split("").map((char, i) => (
    <ViewTransition key={text.length - i} default={`vt-roll vt-${direction}`}>
      <span className="tabular-nums">{char}</span>
    </ViewTransition>
  ))
}
```

The Number Flip component adds formatting and an optional stagger (`vt-delay-1`, `vt-delay-2`).

## Swap views in place

A persistent boundary crossfades whatever is inside it, with a short blur.

```tsx
<ViewTransition update="vt-blur">
  <div>{view === "list" ? <List /> : <Details />}</div>
</ViewTransition>
```

## Route transitions in Next.js

Next.js runs navigations as transitions, so links animate with no extra code. Wrap `{children}` in `app/layout.tsx`:

```tsx
// components/route-transition.tsx
"use client"

import { ViewTransition, type ReactNode } from "react"
import { usePathname } from "next/navigation"

// Keyed by the URL, so every route change animates, even /docs/a → /docs/b.
// One name for every page, so the old and new page pair into a single crossfade.
// Wrap {children} in app/layout.tsx with it.
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <ViewTransition key={pathname} name="page" share="vt-blur" default="none">
      {children}
    </ViewTransition>
  )
}
```

Don't use `app/template.tsx` for this. A template only re-mounts when its own segment changes, so `/docs/a` → `/docs/b` wouldn't animate.

## Scrolling mid-animation

Snapshots are pinned to the screen, not the page. Render this once in the root layout so a scroll finishes the animation instead of letting content drift:

```tsx
// components/skip-on-scroll.tsx
"use client"

import { useEffect } from "react"

const scrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"])

// Animation snapshots are pinned to the screen, not the page. If the user scrolls
// mid-animation, finish it, so content never drifts with the scroll. It listens to
// the user's input, not the scroll event, so a scroll the browser makes on its own
// (layout shifting, a momentum settle) doesn't cut an animation short.
export function SkipOnScroll() {
  useEffect(() => {
    const skip = () => document.activeViewTransition?.skipTransition()
    const onKey = (e: KeyboardEvent) => scrollKeys.has(e.key) && skip()
    // Capture catches input over any scroll area: the page and inner ones
    const options = { capture: true, passive: true }
    addEventListener("wheel", skip, options)
    addEventListener("touchmove", skip, options)
    addEventListener("keydown", onKey, options)
    return () => {
      removeEventListener("wheel", skip, options)
      removeEventListener("touchmove", skip, options)
      removeEventListener("keydown", onKey, options)
    }
  }, [])
  return null
}
```
