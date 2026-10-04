"use client"

import {
  createContext,
  startTransition,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
  type ComponentProps,
  type ReactNode,
} from "react"

type ItemId = string | number

type State = {
  ids: ItemId[]
  nameOf: (id: ItemId) => string
  button: string
  refocus: (target: "list" | number) => void
}

const Context = createContext<State | null>(null)

function useEmptyState() {
  const state = useContext(Context)
  if (!state) throw new Error("Empty parts must be used inside <EmptyState>")
  return state
}

const surface =
  "rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 [&[style*=vt-expand]]:ring-0 [&[style*=vt-surface]]:ring-0"
const morph = "vt-move vt-expand"
const move = "vt-move vt-surface"
// The action is drawn twice in the same spot: once in the item, so it travels in its snapshot,
// and once live on top, so it stays clickable while items animate
const actions = "pointer-events-none flex items-center justify-end pr-2"

export function EmptyState({
  ids,
  className = "",
  children,
}: {
  ids: ItemId[]
  className?: string
  children: ReactNode
}) {
  const id = useId()
  const frame = useRef<HTMLDivElement>(null)
  const focus = useRef<"list" | number | null>(null)

  // The button and the item it becomes must share a name, and an item keeps its name for life
  const [names, setNames] = useState<{ ids: ItemId[]; button: string; first: ItemId | null }>({
    ids,
    button: `${id}-first`,
    first: null,
  })
  const nameOf = (itemId: ItemId) => (names.first === itemId ? names.button : `${id}-${itemId}`)
  if (ids.length !== names.ids.length || ids.some((itemId, i) => itemId !== names.ids[i])) {
    if (names.ids.length === 0) setNames({ ids, button: names.button, first: ids[0] })
    else if (ids.length === 0) setNames({ ids, button: nameOf(names.ids[0]), first: null })
    else setNames({ ...names, ids })
  }

  const order = ids.join("/")
  const refocus = (target: "list" | number) => {
    focus.current = target
  }

  useLayoutEffect(() => {
    const el = frame.current
    const transition = document.activeViewTransition
    if (!el || !transition) return
    el.dataset.animating = ""
    transition.finished.finally(() => delete el.dataset.animating)
  }, [order])

  useLayoutEffect(() => {
    const el = frame.current
    const target = focus.current
    focus.current = null
    if (!el || target === null || el.contains(document.activeElement)) return
    const cells = el.querySelectorAll<HTMLElement>("[data-empty-cell]")
    const cell = typeof target === "number" ? cells[Math.min(target, cells.length - 1)] : cells[0]
    const next =
      el.querySelector<HTMLElement>("[data-empty-action]") ??
      cell?.querySelector<HTMLElement>("button, a, input, [tabindex]") ??
      el.querySelector<HTMLElement>("[data-empty-list]")
    next?.focus({ preventScroll: true })
  }, [order])

  return (
    <Context value={{ ids, nameOf, button: names.button, refocus }}>
      <div ref={frame} className={`group/empty relative text-sm text-foreground ${className}`}>
        {children}
      </div>
    </Context>
  )
}

export function Empty({ className = "", ...props }: ComponentProps<"div">) {
  const { ids } = useEmptyState()
  if (ids.length > 0) return null
  return (
    <ViewTransition enter="vt-fade" exit="vt-fade" default="none">
      <div
        className={`flex h-full min-w-0 flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-border p-6 text-center text-balance ${className}`}
        {...props}
      />
    </ViewTransition>
  )
}

export function EmptyHeader({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`flex max-w-sm flex-col items-center gap-1.5 ${className}`} {...props} />
}

export function EmptyMedia({
  variant = "default",
  className = "",
  ...props
}: ComponentProps<"div"> & { variant?: "default" | "icon" }) {
  return (
    <div
      className={`mb-1.5 flex shrink-0 items-center justify-center ${
        variant === "icon" ? "size-10 rounded-lg bg-muted text-foreground [&_svg]:size-5" : ""
      } ${className}`}
      {...props}
    />
  )
}

export function EmptyTitle({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`text-base font-medium tracking-tight ${className}`} {...props} />
}

export function EmptyDescription({ className = "", ...props }: ComponentProps<"p">) {
  return <p className={`text-sm/relaxed text-muted-foreground ${className}`} {...props} />
}

export function EmptyContent({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`flex w-full max-w-sm min-w-0 flex-col items-center gap-3 ${className}`}
      {...props}
    />
  )
}

export function EmptyAction({
  className = "",
  onClick,
  type = "button",
  ...props
}: ComponentProps<"button">) {
  const { button, refocus } = useEmptyState()
  return (
    <ViewTransition name={button} share={morph} default="none">
      <button
        type={type}
        data-empty-action
        onClick={(e) => {
          refocus("list")
          document.activeViewTransition?.skipTransition()
          startTransition(() => onClick?.(e))
        }}
        className={`inline-flex h-9 cursor-pointer items-center gap-1.5 px-3 font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4 ${surface} ${className}`}
        {...props}
      />
    </ViewTransition>
  )
}

export function EmptyList({ className = "", ...props }: ComponentProps<"ul">) {
  const { ids } = useEmptyState()
  if (ids.length === 0) return null
  return (
    <ViewTransition default="none">
      <ul
        data-empty-list
        tabIndex={-1}
        className={`grid gap-2 outline-none ${className}`}
        {...props}
      />
    </ViewTransition>
  )
}

export function EmptyItem({
  id,
  action,
  className = "",
  children,
}: {
  id: ItemId
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  const { ids, nameOf, refocus } = useEmptyState()
  const index = ids.indexOf(id)
  const cell = { gridRow: index + 1, gridColumn: 1 }
  return (
    <>
      <ViewTransition
        name={nameOf(id)}
        share={morph}
        enter="vt-presence"
        exit="vt-presence"
        update={move}
        default="none"
      >
        <li style={cell} className={`relative min-w-0 ${surface} ${className}`}>
          {children}
          {action && (
            <span aria-hidden="true" inert className={`absolute inset-0 ${actions}`}>
              {action}
            </span>
          )}
        </li>
      </ViewTransition>
      {action && (
        <li
          role="presentation"
          data-empty-cell
          style={cell}
          onClickCapture={() => refocus(index)}
          className={`z-10 group-has-[[style*=view-transition-name]]/empty:opacity-0 group-data-[animating]/empty:opacity-0 [&>*]:pointer-events-auto ${actions}`}
        >
          {action}
        </li>
      )}
    </>
  )
}
