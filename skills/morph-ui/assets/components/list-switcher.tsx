"use client"

import { startTransition, useEffect, useRef, useState, ViewTransition } from "react"

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
const BookMarked = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M4 12.75V3.5a1 1 0 0 1 1-1h7.5v9H5.25A1.25 1.25 0 0 0 4 12.75Zm0 0A1.25 1.25 0 0 0 5.25 14h7.25" />
    <path d="M7 2.5v4l1.25-1 1.25 1v-4" />
  </svg>
)
const GitFork = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <circle cx="4.5" cy="3.5" r="1.5" />
    <circle cx="11.5" cy="3.5" r="1.5" />
    <circle cx="8" cy="12.5" r="1.5" />
    <path d="M4.5 5v1a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2V5" />
    <path d="M8 8v3" />
  </svg>
)
const LayoutGrid = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
  </svg>
)
const List = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M6 4h7.5" />
    <path d="M6 8h7.5" />
    <path d="M6 12h7.5" />
    <path d="M2.75 4h.01" />
    <path d="M2.75 8h.01" />
    <path d="M2.75 12h.01" />
  </svg>
)
const Star = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M8.00 2.50 L9.53 6.30 L13.61 6.58 L10.47 9.20 L11.47 13.17 L8.00 11.00 L4.53 13.17 L5.53 9.20 L2.39 6.58 L6.47 6.30Z" />
  </svg>
)

export type Repo = {
  id: string
  name: string
  description: string
  language: string
  color: string
  stars: string
  forks: number
  updated: string
}

type View = "cards" | "list"

const toggle =
  "inline-flex h-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm dark:text-muted-foreground dark:aria-pressed:border-input dark:aria-pressed:bg-input/30 dark:aria-pressed:text-foreground [&_svg]:size-4"

export function ListSwitcher({
  repos,
  title = "Repositories",
  defaultView = "cards",
  height = "21.5rem",
}: {
  repos: Repo[]
  title?: string
  defaultView?: View
  height?: string
}) {
  const [view, setView] = useState<View>(defaultView)
  const [more, setMore] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const isCards = view === "cards"

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const check = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 1)
    check()
    el.addEventListener("scroll", check, { passive: true })
    const observer = new ResizeObserver(check)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => {
      el.removeEventListener("scroll", check)
      observer.disconnect()
    }
  }, [])
  const show = (next: View) => {
    if (next === view) return
    document.activeViewTransition?.skipTransition()
    startTransition(() => setView(next))
  }

  return (
    <div className="@container w-full max-w-xl text-foreground">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        <div
          role="group"
          aria-label="View"
          className="inline-flex h-8 items-center rounded-lg bg-muted p-[3px] text-muted-foreground"
        >
          <button
            type="button"
            aria-label="Cards view"
            aria-pressed={isCards}
            onClick={() => show("cards")}
            className={toggle}
          >
            <LayoutGrid />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={!isCards}
            onClick={() => show("list")}
            className={toggle}
          >
            <List />
          </button>
        </div>
      </div>

      <ViewTransition update={more ? "vt-clip vt-edge-bottom" : "vt-clip"}>
        <div
          ref={scroller}
          data-view={view}
          className={`overflow-y-auto p-px [scrollbar-width:none] [view-transition-group:contain] [&::-webkit-scrollbar]:hidden ${
            more ? "[mask-image:linear-gradient(to_bottom,black_calc(100%-3rem),transparent)]" : ""
          }`}
          style={{ height }}
        >
          <ul
            className={
              isCards
                ? "grid auto-rows-fr grid-cols-1 gap-2 @sm:grid-cols-2 @md:gap-3"
                : "flex flex-col gap-2"
            }
          >
            {repos.map((repo) => (
              <li key={repo.id}>
                <ViewTransition update="vt-move vt-shell">
                  <div
                    className={`flex h-full gap-3 rounded-xl bg-card p-3 text-sm text-card-foreground ring-1 ring-foreground/10 @md:p-4 ${
                      isCards ? "flex-col" : "flex-col @md:flex-row @md:items-center"
                    }`}
                  >
                    <ViewTransition update="vt-move vt-text">
                      <div
                        className={`flex items-center gap-2 ${isCards ? "w-fit max-w-full" : "min-w-0 @md:flex-1"}`}
                      >
                        <BookMarked className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate font-medium">{repo.name}</span>
                        <span className="hidden h-5 shrink-0 items-center rounded-full border border-border px-2 text-xs font-medium text-muted-foreground @md:inline-flex">
                          Public
                        </span>
                      </div>
                    </ViewTransition>

                    {isCards && (
                      <ViewTransition enter="vt-fade vt-text vt-delay-3" exit="vt-fade vt-text">
                        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                          {repo.description}
                        </p>
                      </ViewTransition>
                    )}

                    <ViewTransition update="vt-move vt-text">
                      <div
                        className={`flex w-fit max-w-full flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground ${
                          isCards ? "mt-auto" : ""
                        }`}
                      >
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <span
                            className="size-2 rounded-full"
                            style={{ background: repo.color }}
                          />
                          {repo.language}
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Star className="size-3.5" /> {repo.stars}
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <GitFork className="size-3.5" /> {repo.forks}
                        </span>
                        <span className="whitespace-nowrap">{repo.updated}</span>
                      </div>
                    </ViewTransition>
                  </div>
                </ViewTransition>
              </li>
            ))}
          </ul>
        </div>
      </ViewTransition>
    </div>
  )
}
