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

const surface =
  "rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 [&[style*=view-transition-name]]:ring-0"
const share = { "dialog-close": "vt-move vt-expand vt-quick", default: "vt-move vt-expand" }

function animate(update: () => void) {
  document.activeViewTransition?.skipTransition()
  startTransition(update)
}

type DialogState = {
  id: string
  open: boolean
  show: () => void
  close: () => void
  closeNow: () => void
  trigger: RefObject<HTMLButtonElement | null>
}

const Context = createContext<DialogState | null>(null)

function linkParts(el: HTMLElement, id: string) {
  for (const [attr, part] of [
    ["aria-labelledby", "title"],
    ["aria-describedby", "description"],
  ]) {
    if (document.getElementById(`${id}-${part}`)) el.setAttribute(attr, `${id}-${part}`)
    else el.removeAttribute(attr)
  }
}

function useDialog() {
  const dialog = useContext(Context)
  if (!dialog) throw new Error("MorphDialog parts must be used inside <MorphDialog>")
  return dialog
}

export function MorphDialog({ children }: { children: ReactNode }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const state: DialogState = {
    id,
    open,
    trigger,
    show: () => animate(() => setOpen(true)),
    close: () =>
      animate(() => {
        addTransitionType("dialog-close")
        setOpen(false)
      }),
    closeNow: () => {
      document.activeViewTransition?.skipTransition()
      setOpen(false)
    },
  }
  return (
    <Context value={state}>
      <div className="text-foreground">{children}</div>
    </Context>
  )
}

export function MorphDialogTrigger({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { id, open, show, trigger } = useDialog()
  if (open) {
    return (
      <div aria-hidden className={`invisible ${surface} ${className}`}>
        {children}
      </div>
    )
  }
  return (
    <ViewTransition key="trigger" name={`${id}-shell`} share={share}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        onClick={show}
        className={`block cursor-pointer text-left outline-none hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50 ${surface} ${className}`}
      >
        {children}
      </button>
    </ViewTransition>
  )
}

export function MorphDialogContent({
  className = "",
  children,
  "aria-label": label,
}: {
  className?: string
  children: ReactNode
  "aria-label"?: string
}) {
  const { id, open, close, closeNow, trigger } = useDialog()
  const dialog = useRef<HTMLDialogElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = dialog.current
    if (!el) return
    if (open && !el.open) {
      linkParts(el, id)
      el.showModal()
    }
    if (!open && el.open) {
      el.close()
      trigger.current?.focus({ preventScroll: true })
    }
  }, [open, id, trigger])

  return (
    <dialog
      ref={dialog}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault()
        closeNow()
      }}
      onPointerDown={(e) => {
        const r = panel.current?.getBoundingClientRect()
        if (!r) return
        const inside =
          e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
        if (!inside) close()
      }}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-y-auto overscroll-contain bg-background/80 p-0 text-foreground opacity-0 backdrop-blur-sm transition-[opacity,display,overlay] transition-discrete duration-200 ease-out backdrop:bg-transparent open:opacity-100 motion-reduce:duration-100 starting:open:opacity-0"
    >
      <div className="grid min-h-full place-items-center p-4">
        {open && (
          <ViewTransition key="panel" name={`${id}-shell`} share={share}>
            <div
              ref={panel}
              className={`relative w-full max-w-md p-5 text-sm ${surface} ${className}`}
            >
              {children}
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="absolute top-3.5 right-3.5 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <X className="size-4" />
              </button>
            </div>
          </ViewTransition>
        )}
      </div>
    </dialog>
  )
}

export function MorphDialogTitle({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { id } = useDialog()
  return (
    <h2 id={`${id}-title`} className={`pr-8 text-base leading-6 font-semibold ${className}`}>
      {children}
    </h2>
  )
}

export function MorphDialogDescription({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { id } = useDialog()
  return (
    <p id={`${id}-description`} className={`mt-1 text-muted-foreground ${className}`}>
      {children}
    </p>
  )
}

export function MorphDialogClose({ onClick, type = "button", ...props }: ComponentProps<"button">) {
  const { close } = useDialog()
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
