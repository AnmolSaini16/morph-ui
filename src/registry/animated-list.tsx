"use client"

import {
  startTransition,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
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
const X = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M4.5 4.5l7 7" />
    <path d="M11.5 4.5l-7 7" />
  </svg>
)

export type Task = {
  id: string | number
  title: string
  priority: "urgent" | "high" | "low"
  owner: string
}
const tone = {
  urgent: "bg-foreground text-background",
  high: "border border-border text-foreground",
  low: "bg-muted text-muted-foreground",
}

export function AnimatedList({
  tasks,
  onRemove,
  height = "20.5rem",
}: {
  tasks: Task[]
  onRemove?: (id: Task["id"]) => void
  height?: string
}) {
  const [more, setMore] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const removed = useRef<number | null>(null)

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

  useLayoutEffect(() => {
    const el = scroller.current
    const transition = document.activeViewTransition
    if (!el || !transition) return
    el.dataset.animating = ""
    transition.finished.finally(() => delete el.dataset.animating)
  }, [tasks])

  useLayoutEffect(() => {
    const i = removed.current
    const el = scroller.current
    if (i === null || !el) return
    removed.current = null
    const buttons = el.querySelectorAll<HTMLElement>("[data-remove]")
    const next = buttons[Math.min(i, buttons.length - 1)] ?? el.querySelector("[role=status]")
    ;(next as HTMLElement | null)?.focus({ preventScroll: true })
  }, [tasks])

  return (
    <ViewTransition update={more ? "vt-scroll vt-edge-bottom" : "vt-scroll"}>
      <div
        ref={scroller}
        className={`group/list relative w-full max-w-sm overflow-y-auto text-foreground [scrollbar-width:none] [view-transition-group:contain] [&::-webkit-scrollbar]:hidden ${
          more ? "[mask-image:linear-gradient(to_bottom,black_calc(100%-3rem),transparent)]" : ""
        }`}
        style={{ height }}
      >
        <ul className="grid gap-2" aria-label="Tasks">
          {tasks.map((task) => (
            <ViewTransition key={task.id} default="vt-move vt-presence">
              <li className="relative flex h-12 min-w-0 items-center gap-2 rounded-lg border border-border bg-card py-2 pr-10 pl-3 text-sm">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                  {task.owner}
                </span>
                <span className="min-w-0 flex-1 truncate" title={task.title}>
                  {task.title}
                </span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ${tone[task.priority]}`}
                >
                  {task.priority}
                </span>
                {onRemove && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 right-[7px] inline-flex w-7 items-center justify-center text-muted-foreground"
                  >
                    <X className="size-3.5" />
                  </span>
                )}
              </li>
            </ViewTransition>
          ))}
        </ul>
        {tasks.length === 0 && (
          <p
            role="status"
            tabIndex={-1}
            className="rounded-lg border border-border border-dashed p-6 text-center text-sm text-muted-foreground outline-none"
          >
            All clear. Add a task.
          </p>
        )}
        {onRemove && (
          <div className="pointer-events-none absolute inset-x-0 top-0 grid gap-2 group-has-[[style*=view-transition-name]]/list:opacity-0 group-data-[animating]/list:opacity-0">
            {tasks.map((task, i) => (
              <div key={task.id} className="flex h-12 items-center justify-end pr-2">
                <button
                  type="button"
                  data-remove
                  aria-label={`Remove ${task.title}`}
                  onClick={() => {
                    removed.current = i
                    document.activeViewTransition?.skipTransition()
                    startTransition(() => onRemove(task.id))
                  }}
                  className="pointer-events-auto inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ViewTransition>
  )
}
