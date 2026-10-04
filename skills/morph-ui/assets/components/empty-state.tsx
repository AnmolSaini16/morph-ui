"use client"

import { startTransition, useId, useLayoutEffect, useRef, useState, ViewTransition } from "react"

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

const Plus = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M8 3.5v9" />
    <path d="M3.5 8h9" />
  </svg>
)
const X = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M4.5 4.5l7 7" />
    <path d="M11.5 4.5l-7 7" />
  </svg>
)
const Folder = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M2 4.25a1.5 1.5 0 0 1 1.5-1.5h2.6l1.5 1.75h4.9a1.5 1.5 0 0 1 1.5 1.5v5.75a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.75Z" />
  </svg>
)

export type EmptyStateItem = { id: string | number; title: string; meta?: string }

const surface =
  "rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 [&[style*=vt-expand]]:ring-0 [&[style*=vt-surface]]:ring-0"
const morph = "vt-move vt-expand"
const move = "vt-move vt-surface"

function animate(update: () => void) {
  document.activeViewTransition?.skipTransition()
  startTransition(update)
}

export function EmptyState({
  items,
  onCreate,
  onRemove,
  title = "Projects",
  emptyTitle = "No projects yet",
  emptyDescription = "Create your first project to get started.",
  actionLabel = "New project",
  height = "16rem",
}: {
  items: EmptyStateItem[]
  onCreate: () => void
  onRemove?: (id: EmptyStateItem["id"]) => void
  title?: string
  emptyTitle?: string
  emptyDescription?: string
  actionLabel?: string
  height?: string
}) {
  const id = useId()
  const frame = useRef<HTMLDivElement>(null)
  const add = useRef<HTMLButtonElement>(null)
  const cta = useRef<HTMLButtonElement>(null)
  const focus = useRef<"add" | "cta" | number | null>(null)
  const empty = items.length === 0

  // The button and the row it becomes must share a name, and a row keeps its name for life.
  const ids = items.map((item) => item.id)
  const [names, setNames] = useState<{
    ids: EmptyStateItem["id"][]
    button: string
    first: EmptyStateItem["id"] | null
  }>({ ids, button: `${id}-first`, first: null })
  const nameOf = (itemId: EmptyStateItem["id"]) =>
    names.first === itemId ? names.button : `${id}-${itemId}`
  if (ids.length !== names.ids.length || ids.some((itemId, i) => itemId !== names.ids[i])) {
    if (names.ids.length === 0) setNames({ ids, button: names.button, first: ids[0] })
    else if (ids.length === 0) setNames({ ids, button: nameOf(names.ids[0]), first: null })
    else setNames({ ...names, ids })
  }

  useLayoutEffect(() => {
    const el = frame.current
    const transition = document.activeViewTransition
    if (!el || !transition) return
    el.dataset.animating = ""
    transition.finished.finally(() => delete el.dataset.animating)
  }, [items])

  useLayoutEffect(() => {
    const target = focus.current
    focus.current = null
    if (target === null) return
    const buttons = frame.current?.querySelectorAll<HTMLElement>("[data-remove]") ?? []
    const next =
      target === "add"
        ? add.current
        : target === "cta" || buttons.length === 0
          ? cta.current
          : buttons[Math.min(target, buttons.length - 1)]
    next?.focus({ preventScroll: true })
  }, [items])

  return (
    <div ref={frame} className="group/empty w-full max-w-sm text-sm text-foreground">
      <div className="mb-3 flex h-7 items-center justify-between">
        <p className="font-medium">
          {title}
          <span className="ml-2 font-normal text-muted-foreground tabular-nums">
            {items.length}
          </span>
        </p>
        <button
          ref={add}
          type="button"
          inert={empty}
          onClick={() => animate(onCreate)}
          className={`inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2.5 text-[0.8rem] font-medium transition-[opacity,background-color] duration-200 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-3.5 ${
            empty ? "opacity-0" : ""
          }`}
        >
          <Plus /> New
        </button>
      </div>
      <div className="relative" style={{ height }}>
        {empty ? (
          <ViewTransition key="empty" enter="vt-fade" exit="vt-fade" default="none">
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 text-center">
              <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
                <Folder />
              </span>
              <p className="mt-3 font-medium">{emptyTitle}</p>
              <p className="mt-1 text-muted-foreground">{emptyDescription}</p>
              <ViewTransition name={names.button} share={morph} default="none">
                <button
                  ref={cta}
                  type="button"
                  onClick={() => {
                    focus.current = "add"
                    animate(onCreate)
                  }}
                  className={`mt-4 inline-flex h-9 cursor-pointer items-center gap-1.5 px-3 font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4 ${surface}`}
                >
                  <Plus /> {actionLabel}
                </button>
              </ViewTransition>
            </div>
          </ViewTransition>
        ) : (
          <ViewTransition key="list" default="none">
            <ul className="grid gap-2" aria-label={title}>
              {items.map((item) => (
                <ViewTransition
                  key={item.id}
                  name={nameOf(item.id)}
                  share={morph}
                  enter="vt-presence"
                  exit="vt-presence"
                  update={move}
                  default="none"
                >
                  <li
                    className={`relative flex h-12 min-w-0 items-center gap-3 pr-10 pl-3 ${surface}`}
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                      <Folder />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{item.title}</span>
                    {item.meta && (
                      <span className="shrink-0 text-xs text-muted-foreground">{item.meta}</span>
                    )}
                    {onRemove && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 right-2 inline-flex w-7 items-center justify-center text-muted-foreground"
                      >
                        <X className="size-3.5" />
                      </span>
                    )}
                  </li>
                </ViewTransition>
              ))}
            </ul>
          </ViewTransition>
        )}
        {onRemove && !empty && (
          <div className="pointer-events-none absolute inset-x-0 top-0 grid gap-2 group-has-[[style*=view-transition-name]]/empty:opacity-0 group-data-[animating]/empty:opacity-0">
            {items.map((item, index) => (
              <div key={item.id} className="flex h-12 items-center justify-end pr-2">
                <button
                  type="button"
                  data-remove
                  aria-label={`Remove ${item.title}`}
                  onClick={() => {
                    focus.current = items.length === 1 ? "cta" : index
                    animate(() => onRemove(item.id))
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
    </div>
  )
}
