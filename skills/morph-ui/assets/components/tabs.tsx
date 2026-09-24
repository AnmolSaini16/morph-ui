"use client"

import {
  addTransitionType,
  startTransition,
  useId,
  useRef,
  useState,
  ViewTransition,
  type KeyboardEvent,
  type ReactNode,
} from "react"

export type Tab = { id: string; label: string; content: ReactNode }

export function Tabs({
  tabs,
  defaultTab = tabs[0]?.id,
  height = "10rem",
}: {
  tabs: Tab[]
  defaultTab?: string
  height?: string
}) {
  const id = useId()
  const [active, setActive] = useState(defaultTab)
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  const index = tabs.findIndex((tab) => tab.id === active)
  const current = tabs[index]

  const select = (next: string, animated = true) => {
    const to = tabs.findIndex((tab) => tab.id === next)
    if (to === index || to < 0) return
    if (!animated) {
      document.activeViewTransition?.skipTransition()
      setActive(next)
      return
    }
    document.activeViewTransition?.skipTransition()
    startTransition(() => {
      addTransitionType(to > index ? "tabs-next" : "tabs-prev")
      setActive(next)
    })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const step = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key]
    const to = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : step ? index + step : null
    if (to === null) return
    e.preventDefault()
    const tab = tabs[(to + tabs.length) % tabs.length]
    select(tab.id, false)
    buttons.current.get(tab.id)?.focus()
  }

  return (
    <div className="w-full max-w-md text-foreground">
      <div role="tablist" onKeyDown={onKeyDown} className="flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) buttons.current.set(tab.id, el)
                else buttons.current.delete(tab.id)
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              className={`relative -mb-px cursor-pointer rounded-md px-3 pt-1.5 pb-2.5 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
                selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {selected && (
                <ViewTransition name={`${id}-underline`} share="vt-move vt-quick" default="none">
                  <span className="absolute inset-x-0 -bottom-[0.5px] h-0.5 rounded-full bg-foreground" />
                </ViewTransition>
              )}
            </button>
          )
        })}
      </div>

      <ViewTransition
        update={{
          "tabs-next": "vt-slide vt-quick vt-clip vt-forward",
          "tabs-prev": "vt-slide vt-quick vt-clip vt-back",
          default: "none",
        }}
      >
        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${active}`}
          className="-mx-1 overflow-hidden px-1 pt-5 text-sm"
          style={{ height }}
        >
          {current?.content}
        </div>
      </ViewTransition>
    </div>
  )
}
