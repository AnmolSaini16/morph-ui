"use client"

import {
  Children,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
  type ReactElement,
  type ReactNode,
} from "react"

type ItemProps = { action?: ReactNode; className?: string; children: ReactNode }

export function AnimatedListItem({ children }: ItemProps) {
  return <>{children}</>
}

export function AnimatedList({
  label = "Items",
  height = "20.5rem",
  rowHeight = "3rem",
  empty = "Nothing here yet.",
  className = "",
  children,
}: {
  label?: string
  height?: string
  rowHeight?: string
  empty?: ReactNode
  className?: string
  children: ReactNode
}) {
  const [more, setMore] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const controls = useRef<HTMLDivElement>(null)
  const acted = useRef<number | null>(null)

  const items = Children.toArray(children).filter(isValidElement) as ReactElement<ItemProps>[]
  const order = items.map((item) => item.key).join("/")
  const hasActions = items.some((item) => item.props.action)

  // The actions scroll in their own layer, outside the captured list, so each follows the other
  useEffect(() => {
    const el = scroller.current
    const layer = controls.current
    if (!el) return
    const check = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 1)
    const follow = (from: HTMLElement, to: HTMLElement | null) => () => {
      if (to && to.scrollTop !== from.scrollTop) to.scrollTop = from.scrollTop
    }
    const onScroll = () => {
      check()
      follow(el, layer)()
    }
    const onLayerScroll = layer ? follow(layer, el) : null
    check()
    el.addEventListener("scroll", onScroll, { passive: true })
    if (onLayerScroll) layer?.addEventListener("scroll", onLayerScroll, { passive: true })
    const observer = new ResizeObserver(check)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => {
      el.removeEventListener("scroll", onScroll)
      if (onLayerScroll) layer?.removeEventListener("scroll", onLayerScroll)
      observer.disconnect()
    }
  }, [hasActions])

  useLayoutEffect(() => {
    const el = frame.current
    if (controls.current && scroller.current)
      controls.current.scrollTop = scroller.current.scrollTop
    const transition = document.activeViewTransition
    if (!el || !transition) return
    el.dataset.animating = ""
    transition.finished.finally(() => delete el.dataset.animating)
  }, [order])

  useLayoutEffect(() => {
    const i = acted.current
    const el = frame.current
    acted.current = null
    if (i === null || !el || el.contains(document.activeElement)) return
    const cells = el.querySelectorAll<HTMLElement>("[data-action-cell]")
    const next =
      cells[Math.min(i, cells.length - 1)]?.querySelector<HTMLElement>(
        "button, a, input, [tabindex]",
      ) ?? el.querySelector<HTMLElement>("[role=status]")
    next?.focus({ preventScroll: true })
  }, [order])

  const scroll = `overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
    more ? "[mask-image:linear-gradient(to_bottom,black_calc(100%-3rem),transparent)]" : ""
  }`

  return (
    <div
      ref={frame}
      className={`group/list relative w-full max-w-sm text-foreground ${className}`}
      style={{ height }}
    >
      <ViewTransition update={more ? "vt-scroll vt-edge-bottom" : "vt-scroll"}>
        <div ref={scroller} className={`h-full [view-transition-group:contain] ${scroll}`}>
          <ul className="grid gap-2" aria-label={label}>
            {items.map((item) => (
              <ViewTransition key={item.key} default="vt-move vt-presence">
                <li
                  style={{ height: rowHeight }}
                  className={`relative flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card pl-3 text-sm ${
                    item.props.action ? "pr-10" : "pr-3"
                  } ${item.props.className ?? ""}`}
                >
                  {item.props.children}
                  {item.props.action && (
                    <span
                      aria-hidden="true"
                      inert
                      className="pointer-events-none absolute inset-y-0 right-[7px] flex items-center"
                    >
                      {item.props.action}
                    </span>
                  )}
                </li>
              </ViewTransition>
            ))}
          </ul>
          {items.length === 0 && (
            <p
              role="status"
              tabIndex={-1}
              className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground outline-none"
            >
              {empty}
            </p>
          )}
        </div>
      </ViewTransition>
      {hasActions && (
        <div
          ref={controls}
          className={`pointer-events-none absolute inset-0 group-has-[[style*=view-transition-name]]/list:opacity-0 group-data-[animating]/list:opacity-0 ${scroll}`}
        >
          <div className="grid gap-2">
            {items.map((item, i) => (
              <div
                key={item.key}
                data-action-cell
                style={{ height: rowHeight }}
                onClickCapture={() => {
                  acted.current = i
                }}
                className="flex items-center justify-end pr-2 [&>*]:pointer-events-auto [&>*]:opacity-0 [&>*:focus-visible]:opacity-100 [&>*:hover]:opacity-100"
              >
                {item.props.action}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
