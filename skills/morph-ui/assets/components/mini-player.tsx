"use client"

import {
  addTransitionType,
  startTransition,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
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
const ChevronDown = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M3.5 6 8 10.5 12.5 6" />
  </svg>
)
const Play = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M5 3.5v9l7.5-4.5Z" fill="currentColor" />
  </svg>
)
const Pause = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <rect x="4" y="3" width="2.5" height="10" rx=".75" fill="currentColor" />
    <rect x="9.5" y="3" width="2.5" height="10" rx=".75" fill="currentColor" />
  </svg>
)
const SkipBack = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M12 3.5 6 8l6 4.5Z" fill="currentColor" />
    <path d="M4 3.5v9" />
  </svg>
)
const SkipForward = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M4 3.5 10 8l-6 4.5Z" fill="currentColor" />
    <path d="M12 3.5v9" />
  </svg>
)

export type Track = {
  id: string
  title: string
  artist: string
  cover: string
  coverFilter?: string
  duration: number
}

function Cover({ track, className }: { track: Track; className: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 ${track.coverFilter ? "scale-110" : ""}`}
        style={{ background: track.cover, filter: track.coverFilter }}
      />
    </div>
  )
}

const time = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`

const shell = { "player-close": "vt-move vt-expand vt-quick", default: "vt-move vt-expand" }
const part = { "player-close": "vt-move vt-quick", default: "vt-move" }
const art = { "player-close": "vt-move vt-cover vt-quick", default: "vt-move vt-cover" }
const slide = (anchor: string) => ({
  "player-next": `vt-slide vt-short ${anchor} vt-forward`,
  "player-previous": `vt-slide vt-short ${anchor} vt-back`,
  default: "none",
})
const slideLeft = slide("vt-text")
const slideCenter = slide("vt-center")

const surface =
  "bg-card text-card-foreground ring-1 ring-foreground/10 [&[style*=view-transition-name]]:ring-0"
const iconButton =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"

export function MiniPlayer({
  track,
  playing,
  elapsed = 0,
  onPlayingChange,
  onNext,
  onPrevious,
  className = "h-[30rem] w-full max-w-xs",
  children,
}: {
  track: Track
  playing: boolean
  elapsed?: number
  onPlayingChange: (playing: boolean) => void
  onNext?: () => void
  onPrevious?: () => void
  className?: string
  children?: ReactNode
}) {
  const id = useId()
  const [expanded, setExpanded] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const collapseButton = useRef<HTMLButtonElement>(null)
  const expandButton = useRef<HTMLButtonElement>(null)
  const opened = useRef(false)
  const animation = useRef<typeof document.activeViewTransition>(null)
  const name = (piece: string) => `${id}-${piece}`
  const progress = `${track.duration > 0 ? Math.min(100, (elapsed / track.duration) * 100) : 0}%`

  const expand = () => {
    opened.current = true
    document.activeViewTransition?.skipTransition()
    startTransition(() => setExpanded(true))
  }
  const collapse = () => {
    document.activeViewTransition?.skipTransition()
    startTransition(() => {
      addTransitionType("player-close")
      setExpanded(false)
    })
  }
  const skip = (type: string, change?: () => void) =>
    change &&
    (() => {
      document.activeViewTransition?.skipTransition()
      startTransition(() => {
        addTransitionType(type)
        change()
      })
    })
  const next = skip("player-next", onNext)
  const previous = skip("player-previous", onPrevious)

  useLayoutEffect(() => {
    if (expanded) collapseButton.current?.focus({ preventScroll: true })
    else if (opened.current) expandButton.current?.focus({ preventScroll: true })
  }, [expanded])

  useLayoutEffect(() => {
    const el = frame.current
    const transition = document.activeViewTransition
    if (!el || !transition) return
    animation.current = transition
    el.dataset.animating = ""
    transition.finished.finally(() => {
      if (animation.current === transition) delete el.dataset.animating
    })
  }, [expanded])

  const PlayIcon = playing ? Pause : Play

  return (
    <div
      ref={frame}
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !expanded) return
        e.preventDefault()
        e.stopPropagation()
        document.activeViewTransition?.skipTransition()
        setExpanded(false)
      }}
      className={`group/player relative overflow-hidden rounded-[calc(var(--radius)*1.4+9px)] border border-border bg-background text-sm text-foreground ${className}`}
    >
      <div inert={expanded} className="h-full overflow-y-auto pb-18">
        {children}
      </div>

      <button
        ref={collapseButton}
        type="button"
        onClick={collapse}
        disabled={!expanded}
        tabIndex={expanded ? 0 : -1}
        aria-hidden={!expanded}
        aria-label="Close player"
        className={`${iconButton} absolute top-5 left-5 z-10 size-9 text-muted-foreground hover:bg-muted hover:text-foreground group-data-[animating]/player:opacity-0 [&_svg]:size-5 ${expanded ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ChevronDown />
      </button>

      {expanded ? (
        <ViewTransition key="full" name={name("shell")} share={shell} default="none">
          <section
            aria-label="Now playing"
            tabIndex={-1}
            className={`absolute inset-2 flex flex-col rounded-xl px-6 pt-3 pb-6 outline-none ${surface}`}
          >
            <div className="-mx-3 flex h-9 shrink-0 items-center justify-between">
              <span
                aria-hidden
                className="inline-flex size-9 items-center justify-center text-muted-foreground [&_svg]:size-5"
              >
                <ChevronDown />
              </span>
              <p className="text-xs font-medium text-muted-foreground">Now playing</p>
              <span aria-hidden className="size-9" />
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center py-3">
              <ViewTransition name={name("cover")} share={art} default="none">
                <Cover track={track} className="aspect-square h-full max-h-48 rounded-lg" />
              </ViewTransition>
            </div>
            <div className="flex shrink-0 flex-col items-center text-center">
              <ViewTransition name={name("title")} share={part} update={slideCenter} default="none">
                <h3 className="w-fit max-w-full truncate text-lg leading-7 font-semibold tracking-tight">
                  {track.title}
                </h3>
              </ViewTransition>
              <ViewTransition
                name={name("artist")}
                share={part}
                update={slideCenter}
                default="none"
              >
                <p className="w-fit max-w-full truncate leading-5 text-muted-foreground">
                  {track.artist}
                </p>
              </ViewTransition>
            </div>
            <div className="mt-5 shrink-0">
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-foreground" style={{ width: progress }} />
              </div>
              <div className="mt-1.5 flex justify-between text-xs text-muted-foreground tabular-nums">
                <span>{time(elapsed)}</span>
                <span>-{time(Math.max(0, Math.ceil(track.duration - elapsed)))}</span>
              </div>
            </div>
            <div className="mt-3 flex shrink-0 items-center justify-center gap-5">
              <button
                type="button"
                aria-label="Previous"
                onClick={previous}
                disabled={!previous}
                className={`${iconButton} size-12 hover:bg-muted disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5`}
              >
                <SkipBack />
              </button>
              <ViewTransition name={name("play")} share={part} default="none">
                <button
                  type="button"
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={() => onPlayingChange(!playing)}
                  className={`${iconButton} size-14 bg-foreground text-background hover:bg-foreground/85 [&_svg]:size-6`}
                >
                  <PlayIcon />
                </button>
              </ViewTransition>
              <ViewTransition name={name("next")} share={part} default="none">
                <button
                  type="button"
                  aria-label="Next"
                  onClick={next}
                  disabled={!next}
                  className={`${iconButton} size-12 hover:bg-muted disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5`}
                >
                  <SkipForward />
                </button>
              </ViewTransition>
            </div>
          </section>
        </ViewTransition>
      ) : (
        <ViewTransition key="mini" name={name("shell")} share={shell} default="none">
          <div
            className={`absolute inset-x-2 bottom-2 flex h-13 items-center gap-1 rounded-xl p-1 pr-2 has-[[data-expand]:hover]:ring-foreground/20 ${surface}`}
          >
            <button
              ref={expandButton}
              type="button"
              data-expand
              onClick={expand}
              aria-label={`Open player: ${track.title} by ${track.artist}`}
              className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg pr-1 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ViewTransition name={name("cover")} share={art} default="none">
                <Cover track={track} className="size-11 rounded-lg" />
              </ViewTransition>
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <ViewTransition name={name("title")} share={part} update={slideLeft} default="none">
                  <p className="w-fit max-w-full truncate leading-5 font-medium">{track.title}</p>
                </ViewTransition>
                <ViewTransition
                  name={name("artist")}
                  share={part}
                  update={slideLeft}
                  default="none"
                >
                  <p className="w-fit max-w-full truncate text-xs leading-4 text-muted-foreground">
                    {track.artist}
                  </p>
                </ViewTransition>
              </div>
            </button>
            <ViewTransition name={name("play")} share={part} default="none">
              <button
                type="button"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => onPlayingChange(!playing)}
                className={`${iconButton} size-9 hover:bg-muted [&_svg]:size-4`}
              >
                <PlayIcon />
              </button>
            </ViewTransition>
            {next && (
              <ViewTransition name={name("next")} share={part} default="none">
                <button
                  type="button"
                  aria-label="Next"
                  onClick={next}
                  className={`${iconButton} size-9 hover:bg-muted [&_svg]:size-4`}
                >
                  <SkipForward />
                </button>
              </ViewTransition>
            )}
          </div>
        </ViewTransition>
      )}
    </div>
  )
}
