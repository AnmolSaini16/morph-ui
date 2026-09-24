"use client"

import {
  addTransitionType,
  Children,
  createContext,
  isValidElement,
  startTransition,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
  type KeyboardEvent,
  type ReactElement,
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

const arrow =
  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-background outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

type CarouselState = {
  active: number
  labels: string[]
  setLabels: (labels: string[]) => void
  go: (next: number, direction: "next" | "prev", animated?: boolean) => void
  move: (delta: number, animated?: boolean) => void
  requested: () => number
}

const Context = createContext<CarouselState | null>(null)

function useCarousel() {
  const carousel = useContext(Context)
  if (!carousel) throw new Error("Carousel parts must be used inside <Carousel>")
  return carousel
}

export function Carousel({
  label = "Slides",
  className = "",
  children,
}: {
  label?: string
  className?: string
  children: ReactNode
}) {
  const [index, setIndex] = useState(0)
  const [labels, setLabels] = useState<string[]>([])
  const requested = useRef(0)
  const count = labels.length
  const active = count ? index % count : 0

  function go(next: number, direction: "next" | "prev", animated = true) {
    if (count < 2) return
    next = (next + count) % count
    if (next === requested.current % count) return
    requested.current = next
    document.activeViewTransition?.skipTransition()
    if (!animated) return setIndex(next)
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

  return (
    <Context value={{ active, labels, setLabels, go, move, requested: () => requested.current }}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={`w-full max-w-md rounded-xl text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      >
        {children}
        {count > 0 && (
          <p className="sr-only" aria-live="polite">
            Slide {active + 1} of {count}: {labels[active]}
          </p>
        )}
      </div>
    </Context>
  )
}

export function CarouselContent({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { active, setLabels } = useCarousel()
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{
    label?: string
  }>[]
  const key = items.map((item, i) => item.props.label ?? `Slide ${i + 1}`).join("\n")

  useLayoutEffect(() => setLabels(key ? key.split("\n") : []), [key, setLabels])

  if (!items.length) return <p className="text-sm text-muted-foreground">No slides yet.</p>
  const current = Math.min(active, items.length - 1)
  return (
    <ViewTransition
      update={{
        "carousel-next": "vt-swipe vt-forward",
        "carousel-prev": "vt-swipe vt-back",
        default: "none",
      }}
    >
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`${current + 1} of ${items.length}: ${key.split("\n")[current]}`}
        className={`flex aspect-square min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground ${className}`}
      >
        {items[current]}
      </div>
    </ViewTransition>
  )
}

export function CarouselItem({ children }: { label?: string; children: ReactNode }) {
  return <>{children}</>
}

export function CarouselPrevious({ className = "" }: { className?: string }) {
  const { labels, move } = useCarousel()
  return (
    <button
      type="button"
      aria-label="Previous slide"
      disabled={labels.length < 2}
      onClick={() => move(-1)}
      className={`${arrow} ${className}`}
    >
      <ChevronLeft className="size-4" />
    </button>
  )
}

export function CarouselNext({ className = "" }: { className?: string }) {
  const { labels, move } = useCarousel()
  return (
    <button
      type="button"
      aria-label="Next slide"
      disabled={labels.length < 2}
      onClick={() => move(1)}
      className={`${arrow} ${className}`}
    >
      <ChevronRight className="size-4" />
    </button>
  )
}

export function CarouselDots({ className = "" }: { className?: string }) {
  const { active, labels, go, requested } = useCarousel()
  return (
    <div className={`mt-4 flex min-h-7 flex-wrap justify-center gap-1 ${className}`}>
      {labels.map((label, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}: ${label}`}
          aria-current={i === active ? "true" : undefined}
          onClick={() => go(i, i < requested() ? "prev" : "next")}
          className="grid size-7 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            className={`h-2 rounded-full transition-[width] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${i === active ? "w-5 bg-foreground" : "w-2 bg-muted-foreground/30"}`}
          />
        </button>
      ))}
    </div>
  )
}
