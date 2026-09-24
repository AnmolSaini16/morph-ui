"use client"

import {
  addTransitionType,
  startTransition,
  useEffect,
  useId,
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
const Message = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M3.5 3h9A1.5 1.5 0 0 1 14 4.5v5a1.5 1.5 0 0 1-1.5 1.5H7l-3 2.5V11h-.5A1.5 1.5 0 0 1 2 9.5v-5A1.5 1.5 0 0 1 3.5 3Z" />
  </svg>
)

const button =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-7 rounded-md px-2.5 text-[0.8rem]"

function animate(update: () => void) {
  document.activeViewTransition?.skipTransition()
  startTransition(update)
}

export function MorphingPopover({
  label = "Feedback",
  placeholder = "What could be better?",
  submitLabel = "Send",
  onSubmit,
}: {
  label?: string
  placeholder?: string
  submitLabel?: string
  onSubmit?: (text: string) => void
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const panel = useRef<HTMLFormElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const field = useRef<HTMLTextAreaElement>(null)
  const wasOpen = useRef(false)

  const close = () =>
    animate(() => {
      addTransitionType("popover-close")
      setOpen(false)
    })

  useLayoutEffect(() => {
    if (open) field.current?.focus({ preventScroll: true })
    else if (wasOpen.current) trigger.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open])

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

  useEffect(() => {
    if (!sent) return
    const timer = setTimeout(() => setSent(false), 2000)
    return () => clearTimeout(timer)
  }, [sent])

  const labelView = (
    <ViewTransition
      name={`${id}-label`}
      share={{ "popover-close": "vt-move vt-text vt-quick", default: "vt-move vt-text" }}
    >
      <span className="inline-flex w-fit items-center gap-1.5">
        <Message className="size-4" />
        {open || !sent ? label : "Thanks!"}
      </span>
    </ViewTransition>
  )

  return (
    <div className="flex h-64 w-full max-w-sm justify-center text-foreground">
      {open ? (
        <ViewTransition
          key="panel"
          name={`${id}-shell`}
          share={{ "popover-close": "vt-move vt-expand vt-quick", default: "vt-move vt-expand" }}
        >
          <form
            ref={panel}
            aria-label={label}
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit?.(field.current?.value ?? "")
              animate(() => {
                addTransitionType("popover-close")
                setSent(true)
                setOpen(false)
              })
            }}
            className="h-fit w-full rounded-xl bg-card ring-1 ring-foreground/10 [&[style*=view-transition-name]]:ring-0 p-3 text-sm text-card-foreground"
          >
            <p className="flex h-5 items-center px-1 text-sm leading-none font-medium">
              {labelView}
            </p>
            <textarea
              ref={field}
              placeholder={placeholder}
              rows={4}
              className="mt-3 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className={`${button} bg-secondary text-secondary-foreground hover:bg-secondary/80`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${button} bg-primary text-primary-foreground hover:bg-primary/80`}
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </ViewTransition>
      ) : (
        <ViewTransition
          key="button"
          name={`${id}-shell`}
          share={{ "popover-close": "vt-move vt-expand vt-quick", default: "vt-move vt-expand" }}
        >
          <button
            ref={trigger}
            type="button"
            aria-expanded={false}
            onClick={() => animate(() => setOpen(true))}
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl bg-card border  px-3 text-sm leading-none font-medium text-card-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {labelView}
          </button>
        </ViewTransition>
      )}
    </div>
  )
}
