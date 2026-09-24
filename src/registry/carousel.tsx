"use client"

import {
  addTransitionType,
  startTransition,
  useRef,
  useState,
  ViewTransition,
  type KeyboardEvent,
  type ReactNode,
} from "react"

const icon = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M10 3.5 5.5 8l4.5 4.5" />
  </svg>
)
const ChevronRight = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M6 3.5 10.5 8 6 12.5" />
  </svg>
)

export type Slide = {
  id: string
  label: string
  content: ReactNode
}
const arrow =
  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-background outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

export function Carousel({ slides, label = "Photos" }: { slides: Slide[]; label?: string }) {
  const [index, setIndex] = useState(0)
  const requested = useRef(0)
  const active = slides.length ? index % slides.length : 0

  function go(next: number, direction: "next" | "prev", animated = true) {
    if (slides.length < 2) return
    next = (next + slides.length) % slides.length
    if (next === requested.current % slides.length) return
    requested.current = next
    if (!animated) {
      document.activeViewTransition?.skipTransition()
      setIndex(next)
      return
    }
    document.activeViewTransition?.skipTransition()
    startTransition(() => {
      addTransitionType(`carousel-${direction}`)
      setIndex(next)
    })
  }
  const move = (delta: number, animated = true) =>
    go(requested.current + delta, delta > 0 ? "next" : "prev", animated)
  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    move(event.key === "ArrowRight" ? 1 : -1, false)
  }
  const slide = slides[active]
  if (!slide) return <p className="text-sm text-muted-foreground">No slides yet.</p>

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="w-full max-w-md rounded-xl text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Previous slide"
          disabled={slides.length < 2}
          onClick={() => move(-1)}
          className={arrow}
        >
          <ChevronLeft className="size-4" />
        </button>
        <ViewTransition
          update={{
            "carousel-next": "vt-swipe vt-forward",
            "carousel-prev": "vt-swipe vt-back",
            default: "none",
          }}
        >
          <div className="flex aspect-square min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground">
            {slide.content}
          </div>
        </ViewTransition>
        <button
          type="button"
          aria-label="Next slide"
          disabled={slides.length < 2}
          onClick={() => move(1)}
          className={arrow}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        Slide {active + 1} of {slides.length}: {slide.label}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-1">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${i + 1}: ${s.label}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => go(i, i < requested.current ? "prev" : "next")}
            className="grid size-7 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className={`h-2 rounded-full transition-[width] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${i === active ? "w-5 bg-foreground" : "w-2 bg-muted-foreground/30"}`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
