# Classes

Give them to `<ViewTransition>` and combine them: `update="vt-move vt-shell"`, `share="vt-move vt-text"`. Direction classes pair with `addTransitionType`: `update={{ "step-next": "vt-slide vt-forward", "step-back": "vt-slide vt-back", default: "none" }}`.

## Motion

| Class | What it does |
| --- | --- |
| `vt-move` | Position and size change, content stays the same |
| `vt-morph` | Content changes too; a short blur hides the crossfade |
| `vt-fade` | Old fades out, then new fades in |
| `vt-dissolve` | Content blends immediately, without blur or delay |
| `vt-reveal` | Content scales into a growing, clipped shell from its center |
| `vt-spring` | Size and position settle with a soft bounce |
| `vt-blur` | A soft, blurred crossfade between two views |
| `vt-slow` | A longer move, for big shape changes |
| `vt-quick` | A short move or slide, for small UI used all day, like tabs |

## Lists

| Class | What it does |
| --- | --- |
| `vt-presence` | Added and removed items fade; pair with vt-move |
| `vt-pop` | Items scale in and out, the rest bounce into place |
| `vt-rise` | Sections fade up into place; stagger them with vt-delay-* |

## Sizing

| Class | What it does |
| --- | --- |
| `vt-text` | Text keeps its natural size, never stretches |
| `vt-center` | Content keeps its size, centered in the box |
| `vt-top` | Content keeps its size, pinned to the top as the box grows |
| `vt-cover` | Images crop to their box, like object-fit: cover |

## Surfaces

| Class | What it does |
| --- | --- |
| `vt-shell` | A card surface resizes; its contents animate on their own |
| `vt-expand` | A card grows into a new layout, contents crossfade |
| `vt-inverse` | Makes vt-shell a pill in the inverse of your theme, like the Dynamic Island |
| `vt-clip` | Clips snapshots; add view-transition-group: contain to clip nested groups |
| `vt-scroll` | A scroll area: clips nested snapshots at its edges, with square corners |
| `vt-edge-bottom` | Keeps a scroll area's faded bottom edge while it animates |

## Direction

| Class | What it does |
| --- | --- |
| `vt-slide` | A short slide with a fade, for steps |
| `vt-short` | With vt-slide: travels 8px instead of 48px, for a line of text |
| `vt-swipe` | Full-width swap, like a carousel |
| `vt-push` | An iOS-style stack push and pop |
| `vt-roll` | Digits or words roll up or down |
| `vt-forward / vt-back` | Which way the four above go |
| `vt-delay-1 … 7` | Stagger, in steps of --vt-stagger |

## Settings

Each is written where it's used with its default, like `var(--vt-move, 420ms)`, so nothing is declared on `:root`. Set any of them in the user's CSS: `:root { --vt-move: 300ms; }`.

| Setting | Default and use |
| --- | --- |
| `--vt-exit` | 150ms · old content leaving |
| `--vt-enter` | 210ms · new content arriving |
| `--vt-enter-delay` | 90ms · when new content starts, once the old is mostly gone |
| `--vt-move` | 420ms · moves and resizes |
| `--vt-slow` | 480ms · big shape changes (vt-slow) |
| `--vt-stagger` | 35ms · step between vt-delay-* classes |
| `--vt-ease` | cubic-bezier(0.32, 0.72, 0, 1) |
| `--vt-ease-out` | cubic-bezier(0.33, 1, 0.68, 1) · crossfades: starts at once, spreads the change out |
| `--vt-bounce` | a soft overshoot for vt-pop and vt-spring |
| `--vt-radius` | calc(var(--radius) * 1.4) · card corners while animating |
| `--vt-surface` | var(--card) · card surface while animating |
| `--vt-ring` | 10% of --foreground · card ring while animating |
| `--vt-inverse` | var(--foreground) · vt-inverse pill: dark in light mode, light in dark mode |
| `--vt-inverse-radius` | 32px |
| `--vt-swipe-travel` | calc(100% + 1.5rem) · one width plus a gap |
| `--vt-swipe-duration` | 300ms |
| `--vt-swipe-ease` | cubic-bezier(0.25, 1, 0.5, 1) · fast start, lands without creeping |
| `--vt-push-duration` | 300ms |
| `--vt-push-ease` | cubic-bezier(0.3, 0.7, 0.1, 1) · iOS-like push and pop |
