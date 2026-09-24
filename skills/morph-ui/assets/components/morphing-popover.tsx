"use client"

import {
  addTransitionType,
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
  type RefObject,
} from "react"

function animate(update: () => void) {
  document.activeViewTransition?.skipTransition()
  startTransition(update)
}

const shell = { "popover-close": "vt-move vt-expand vt-quick", default: "vt-move vt-expand" }
const text = { "popover-close": "vt-move vt-text vt-quick", default: "vt-move vt-text" }

type PopoverState = {
  id: string
  open: boolean
  show: () => void
  close: () => void
  panel: RefObject<HTMLDivElement | null>
  trigger: RefObject<HTMLButtonElement | null>
}

const Context = createContext<PopoverState | null>(null)

function usePopover() {
  const popover = useContext(Context)
  if (!popover) throw new Error("MorphingPopover parts must be used inside <MorphingPopover>")
  return popover
}

export function MorphingPopover({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  const close = () =>
    animate(() => {
      addTransitionType("popover-close")
      setOpen(false)
    })

  useLayoutEffect(() => {
    if (open) {
      const title = document.getElementById(`${id}-title`)
      if (title) panel.current?.setAttribute("aria-labelledby", title.id)
      else panel.current?.removeAttribute("aria-labelledby")
      const field = panel.current?.querySelector<HTMLElement>(
        "[autofocus], input, textarea, select",
      )
      ;(field ?? panel.current)?.focus({ preventScroll: true })
    } else if (wasOpen.current) trigger.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open, id])

  useLayoutEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const r = panel.current?.getBoundingClientRect()
      if (!r) return
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      if (!inside) close()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      document.activeViewTransition?.skipTransition()
      setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const state: PopoverState = {
    id,
    open,
    show: () => animate(() => setOpen(true)),
    close,
    panel,
    trigger,
  }
  return (
    <Context value={state}>
      <div className={`flex h-64 w-full max-w-sm justify-center text-foreground ${className}`}>
        {children}
      </div>
    </Context>
  )
}

function Label({ children }: { children: ReactNode }) {
  const { id } = usePopover()
  return (
    <ViewTransition name={`${id}-label`} share={text}>
      <span className="inline-flex w-fit items-center gap-1.5 [&_svg]:size-4">{children}</span>
    </ViewTransition>
  )
}

export function MorphingPopoverTrigger({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { id, open, show, trigger } = usePopover()
  if (open) return null
  return (
    <ViewTransition key="button" name={`${id}-shell`} share={shell}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={false}
        onClick={show}
        className={`inline-flex h-9 cursor-pointer items-center justify-center rounded-xl bg-card px-3 text-sm leading-none font-medium text-card-foreground ring-1 ring-foreground/10 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 [&[style*=view-transition-name]]:ring-0 ${className}`}
      >
        <Label>{children}</Label>
      </button>
    </ViewTransition>
  )
}

export function MorphingPopoverContent({
  className = "",
  children,
  ...props
}: ComponentProps<"div">) {
  const { id, open, panel } = usePopover()
  if (!open) return null
  return (
    <ViewTransition key="panel" name={`${id}-shell`} share={shell}>
      <div
        ref={panel}
        role="dialog"
        tabIndex={-1}
        className={`h-fit w-full rounded-xl bg-card p-3 text-sm text-card-foreground ring-1 ring-foreground/10 outline-none [&[style*=view-transition-name]]:ring-0 ${className}`}
        {...props}
      >
        {children}
      </div>
    </ViewTransition>
  )
}

export function MorphingPopoverTitle({ children }: { children: ReactNode }) {
  const { id } = usePopover()
  return (
    <p id={`${id}-title`} className="flex h-5 items-center px-1 text-sm leading-none font-medium">
      <Label>{children}</Label>
    </p>
  )
}

export function MorphingPopoverClose({
  onClick,
  type = "button",
  ...props
}: ComponentProps<"button">) {
  const { close } = usePopover()
  return (
    <button
      type={type}
      onClick={(e) => {
        onClick?.(e)
        close()
      }}
      {...props}
    />
  )
}
