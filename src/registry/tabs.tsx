"use client"

import {
  addTransitionType,
  createContext,
  startTransition,
  useContext,
  useId,
  useRef,
  useState,
  ViewTransition,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react"

type TabsState = {
  id: string
  value: string | undefined
  select: (next: string, animated?: boolean) => void
  list: RefObject<HTMLDivElement | null>
}

const Context = createContext<TabsState | null>(null)

function useTabs() {
  const tabs = useContext(Context)
  if (!tabs) throw new Error("Tabs parts must be used inside <Tabs>")
  return tabs
}

const tabsOf = (list: HTMLElement | null) => [
  ...(list?.querySelectorAll<HTMLButtonElement>("[role=tab]") ?? []),
]

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  className = "",
  children,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: ReactNode
}) {
  const id = useId()
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const value = controlled ?? uncontrolled
  const list = useRef<HTMLDivElement>(null)

  const select = (next: string, animated = true) => {
    const values = tabsOf(list.current).map((tab) => tab.dataset.value)
    const from = values.indexOf(value)
    const to = values.indexOf(next)
    if (to === from || to < 0) return
    const update = () => {
      setUncontrolled(next)
      onValueChange?.(next)
    }
    document.activeViewTransition?.skipTransition()
    if (!animated) return update()
    startTransition(() => {
      addTransitionType(to > from ? "tabs-next" : "tabs-prev")
      update()
    })
  }

  return (
    <Context value={{ id, value, select, list }}>
      <div className={`w-full max-w-md text-foreground ${className}`}>{children}</div>
    </Context>
  )
}

export function TabsList({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { select, list } = useTabs()

  const onKeyDown = (e: KeyboardEvent) => {
    const tabs = tabsOf(list.current)
    const index = tabs.findIndex((tab) => tab === document.activeElement)
    const step = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key]
    const to = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : step ? index + step : null
    if (to === null || index < 0) return
    e.preventDefault()
    const tab = tabs[(to + tabs.length) % tabs.length]
    select(tab.dataset.value!, false)
    tab.focus()
  }

  return (
    <div
      ref={list}
      role="tablist"
      onKeyDown={onKeyDown}
      className={`flex gap-1 border-b border-border ${className}`}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const { id, value: active, select } = useTabs()
  const selected = value === active
  return (
    <button
      type="button"
      role="tab"
      data-value={value}
      id={`${id}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${id}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      onClick={() => select(value)}
      className={`relative -mb-px cursor-pointer rounded-md px-3 pt-1.5 pb-2.5 text-sm font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 ${
        selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      {selected && (
        <ViewTransition name={`${id}-underline`} share="vt-move vt-quick" default="none">
          <span className="absolute inset-x-0 -bottom-[0.5px] h-0.5 rounded-full bg-foreground" />
        </ViewTransition>
      )}
    </button>
  )
}

export function TabsContent({
  value,
  className = "",
  children,
}: {
  value: string
  className?: string
  children: ReactNode
}) {
  const { id, value: active } = useTabs()
  if (value !== active) return null
  return (
    <ViewTransition
      name={`${id}-panel`}
      share={{
        "tabs-next": "vt-slide vt-quick vt-clip vt-forward",
        "tabs-prev": "vt-slide vt-quick vt-clip vt-back",
        default: "none",
      }}
    >
      <div
        role="tabpanel"
        id={`${id}-panel-${value}`}
        aria-labelledby={`${id}-tab-${value}`}
        className={`-mx-1 h-40 overflow-hidden px-1 pt-5 text-sm ${className}`}
      >
        {children}
      </div>
    </ViewTransition>
  )
}
