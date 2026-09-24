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

export function MorphDialog({
  trigger,
  title,
  description,
  children,
  className = "",
  overlayClassName = "",
}: {
  trigger: ReactNode
  title: ReactNode
  description?: ReactNode
  children?: ReactNode | ((close: () => void) => ReactNode)
  className?: string
  overlayClassName?: string
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)

  const close = () =>
    animate(() => {
      addTransitionType("dialog-close")
      setOpen(false)
    })

  useLayoutEffect(() => {
    const el = dialog.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) {
      el.close()
      button.current?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <div className="text-foreground">
      {open ? (
        <div aria-hidden className={`invisible ${surface} ${className}`}>
          {trigger}
        </div>
      ) : (
        <ViewTransition key="trigger" name={`${id}-shell`} share={share}>
          <button
            ref={button}
            type="button"
            aria-haspopup="dialog"
            onClick={() => animate(() => setOpen(true))}
            className={`block cursor-pointer text-left outline-none transition-shadow hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50 ${surface} ${className}`}
          >
            {trigger}
          </button>
        </ViewTransition>
      )}
      <dialog
        ref={dialog}
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-description` : undefined}
        onCancel={(e) => {
          e.preventDefault()
          document.activeViewTransition?.skipTransition()
          setOpen(false)
        }}
        onPointerDown={(e) => {
          const r = panel.current?.getBoundingClientRect()
          if (!r) return
          const inside =
            e.clientX >= r.left &&
            e.clientX <= r.right &&
            e.clientY >= r.top &&
            e.clientY <= r.bottom
          if (!inside) close()
        }}
        className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-y-auto overscroll-contain bg-background/80 p-0 text-foreground opacity-0 backdrop-blur-sm transition-[opacity,display,overlay] transition-discrete duration-200 ease-out backdrop:bg-transparent open:opacity-100 motion-reduce:duration-100 starting:open:opacity-0"
      >
        <div className={`grid min-h-full place-items-center p-4 ${overlayClassName}`}>
          {open && (
            <ViewTransition key="panel" name={`${id}-shell`} share={share}>
              <div ref={panel} className={`relative w-full max-w-md p-5 text-sm ${surface}`}>
                <h2 id={`${id}-title`} className="pr-8 text-base leading-6 font-semibold">
                  {title}
                </h2>
                {description && (
                  <p id={`${id}-description`} className="mt-1 text-muted-foreground">
                    {description}
                  </p>
                )}
                <div className="mt-4">
                  {typeof children === "function" ? children(close) : children}
                </div>
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
    </div>
  )
}
