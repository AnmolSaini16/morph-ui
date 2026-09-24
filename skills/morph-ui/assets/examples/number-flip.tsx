"use client"

import { startTransition, useState } from "react"
import { NumberFlip } from "@/components/number-flip"

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
const Minus = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M3.5 8h9" />
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
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-8 gap-1.5 rounded-lg px-2.5 text-sm border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:size-4"

export default function NumberFlipDemo() {
  const [balance, setBalance] = useState(6578.42)

  const change = (next: (value: number) => number) =>
    animate(() => setBalance((value) => Math.max(0, Math.round(next(value) * 100) / 100)))

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="rounded-xl bg-card p-6 text-sm text-card-foreground ring-1 ring-foreground/10">
        <p className="text-sm text-muted-foreground">Balance</p>
        <p className="mt-4 text-5xl font-semibold tracking-tight tabular-nums">
          $<NumberFlip value={balance} />
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Available across all accounts</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" className={button} onClick={() => change((v) => v - 9.99)}>
          <Minus /> 9.99
        </button>
        <button type="button" className={button} onClick={() => change((v) => v + 12.5)}>
          <Plus /> 12.50
        </button>
        <button
          type="button"
          className={button}
          onClick={() => change(() => 1000 + Math.random() * 9000)}
        >
          <Shuffle /> Random
        </button>
      </div>
    </div>
  )
}
