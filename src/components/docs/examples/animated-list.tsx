"use client"

import { startTransition, useRef, useState } from "react"
import { AnimatedList, type Task } from "@/registry/animated-list"

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
const ArrowDownWideNarrow = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M3.5 3v10" />
    <path d="M1.75 11.25 3.5 13l1.75-1.75" />
    <path d="M7 4h7" />
    <path d="M7 8h5" />
    <path d="M7 12h3" />
  </svg>
)
const Plus = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M8 3.5v9" />
    <path d="M3.5 8h9" />
  </svg>
)
const Shuffle = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M2.5 4.5h1.9c1 0 1.9.5 2.5 1.3l2.2 3.4c.6.8 1.5 1.3 2.5 1.3h1.9" />
    <path d="M2.5 11.5h1.9c1 0 1.9-.5 2.5-1.3l.2-.3" />
    <path d="M9.4 5.8l.2-.3c.6-.8 1.5-1.3 2.5-1.3h1.4" />
    <path d="M11.75 2.75 13.5 4.5l-1.75 1.75" />
    <path d="M11.75 9.75l1.75 1.75-1.75 1.75" />
  </svg>
)

function animate(update: () => void) {
  document.activeViewTransition?.skipTransition()
  startTransition(update)
}

const button =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-7 gap-1 rounded-md px-2.5 text-[0.8rem] border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:size-3.5"

const rank = { urgent: 0, high: 1, low: 2 }
const priorities: Task["priority"][] = ["urgent", "high", "low"]
const backlog = [
  "Add keyboard shortcuts",
  "Migrate billing webhooks",
  "Dark mode for emails",
  "Flaky e2e on Safari",
  "Cache avatar images",
]

const seed: Task[] = [
  { id: 1, title: "Fix checkout race condition", priority: "urgent", owner: "AK" },
  { id: 2, title: "Refresh onboarding copy", priority: "low", owner: "MJ" },
  { id: 3, title: "Rotate API keys", priority: "high", owner: "SL" },
  { id: 4, title: "Audit bundle size", priority: "low", owner: "RN" },
]

export default function AnimatedListDemo() {
  const [tasks, setTasks] = useState(seed)
  const nextId = useRef(seed.length + 1)

  const add = () => {
    const id = nextId.current++
    animate(() =>
      setTasks((t) =>
        t.length >= 6
          ? t
          : [
              {
                id,
                title: backlog[id % backlog.length],
                priority: priorities[id % 3],
                owner: "ME",
              },
              ...t,
            ],
      ),
    )
  }
  const shuffle = () => animate(() => setTasks((t) => [...t].sort(() => Math.random() - 0.5)))
  const sort = () =>
    animate(() => setTasks((t) => [...t].sort((a, b) => rank[a.priority] - rank[b.priority])))
  const remove = (id: Task["id"]) => setTasks((t) => t.filter((task) => task.id !== id))

  return (
    <div className="w-full max-w-sm">
      <div className="mb-3 flex gap-1.5">
        <button type="button" className={button} onClick={add} disabled={tasks.length >= 6}>
          <Plus /> Add
        </button>
        <button type="button" className={button} onClick={shuffle}>
          <Shuffle /> Shuffle
        </button>
        <button type="button" className={button} onClick={sort}>
          <ArrowDownWideNarrow /> Sort
        </button>
      </div>
      <AnimatedList tasks={tasks} onRemove={remove} />
    </div>
  )
}
