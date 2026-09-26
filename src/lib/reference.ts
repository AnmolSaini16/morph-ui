export const classGroups: [string, [string, string][]][] = [
  [
    "Motion",
    [
      ["vt-move", "Position and size change, content stays the same"],
      ["vt-morph", "Content changes too; a short blur hides the crossfade"],
      ["vt-fade", "Old fades out, then new fades in"],
      ["vt-dissolve", "Content blends immediately, without blur or delay"],
      ["vt-reveal", "Content scales into a growing, clipped shell from its center"],
      ["vt-spring", "Size and position settle with a soft bounce"],
      ["vt-blur", "A soft, blurred crossfade between two views"],
      ["vt-slow", "A longer move, for big shape changes"],
      ["vt-quick", "A short move or slide, for small UI used all day, like tabs"],
    ],
  ],
  [
    "Lists",
    [
      ["vt-presence", "Added and removed items fade; pair with vt-move"],
      ["vt-pop", "Items scale in and out, the rest bounce into place"],
      ["vt-rise", "Sections fade up into place; stagger them with vt-delay-*"],
    ],
  ],
  [
    "Sizing",
    [
      ["vt-text", "Text keeps its natural size, never stretches"],
      ["vt-center", "Content keeps its size, centered in the box"],
      ["vt-top", "Content keeps its size, pinned to the top as the box grows"],
      ["vt-cover", "Images crop to their box, like object-fit: cover"],
    ],
  ],
  [
    "Surfaces",
    [
      ["vt-shell", "A card surface resizes; its contents animate on their own"],
      ["vt-expand", "A card grows into a new layout, contents crossfade"],
      ["vt-inverse", "Makes vt-shell a pill in the inverse of your theme, like the Dynamic Island"],
      ["vt-clip", "Clips snapshots; add view-transition-group: contain to clip nested groups"],
      ["vt-scroll", "A scroll area: clips nested snapshots at its edges, with square corners"],
      ["vt-edge-bottom", "Keeps a scroll area's faded bottom edge while it animates"],
    ],
  ],
  [
    "Direction",
    [
      ["vt-slide", "A short slide with a fade, for steps"],
      ["vt-short", "With vt-slide: travels 8px instead of 48px, for a line of text"],
      ["vt-swipe", "Full-width swap, like a carousel"],
      ["vt-push", "An iOS-style stack push and pop"],
      ["vt-roll", "Digits or words roll up or down"],
      ["vt-forward / vt-back", "Which way the four above go"],
      ["vt-delay-1 … 7", "Stagger, in steps of --vt-stagger"],
    ],
  ],
]

export const themeCss = `/* The theme variables Morph UI reads, with shadcn's neutral defaults.
   Skip this if you use shadcn: you already have them. */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --radius: 0.625rem;
  --background:           oklch(1 0 0);
  --foreground:           oklch(0.145 0 0);
  --card:                 oklch(1 0 0);
  --card-foreground:      oklch(0.145 0 0);
  --primary:              oklch(0.205 0 0);
  --primary-foreground:   oklch(0.985 0 0);
  --secondary:            oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted:                oklch(0.97 0 0);
  --muted-foreground:     oklch(0.556 0 0);
  --border:               oklch(0.922 0 0);
  --input:                oklch(0.922 0 0);
  --ring:                 oklch(0.708 0 0);
}

.dark {
  --background:           oklch(0.145 0 0);
  --foreground:           oklch(0.985 0 0);
  --card:                 oklch(0.205 0 0);
  --card-foreground:      oklch(0.985 0 0);
  --primary:              oklch(0.922 0 0);
  --primary-foreground:   oklch(0.205 0 0);
  --secondary:            oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted:                oklch(0.269 0 0);
  --muted-foreground:     oklch(0.708 0 0);
  --border:               oklch(1 0 0 / 10%);
  --input:                oklch(1 0 0 / 15%);
  --ring:                 oklch(0.556 0 0);
}

@theme inline {
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}
`

export const skipOnScrollCode = `// components/skip-on-scroll.tsx
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
`

export const routeTransitionCode = `// components/route-transition.tsx
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
`
