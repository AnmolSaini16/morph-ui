"use client"

import { startTransition, useState } from "react"
import { DynamicIsland } from "@/components/dynamic-island"

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
const Airplay = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M5 12H3.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H11" />
    <path d="M8 10l3 3.5H5Z" />
  </svg>
)
const AudioLines = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M2.5 7v2" />
    <path d="M5 5v6" />
    <path d="M7.5 2.75v10.5" />
    <path d="M10 5.5v5" />
    <path d="M12.5 6.5v3" />
  </svg>
)
const FastForward = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M8.5 4 13 8l-4.5 4Z" />
    <path d="M2.5 4 7 8l-4.5 4Z" />
  </svg>
)
const Mic = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <rect x="6" y="2" width="4" height="7.5" rx="2" />
    <path d="M3.75 7.5a4.25 4.25 0 0 0 8.5 0" />
    <path d="M8 11.75V14" />
  </svg>
)
const Pause = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <rect x="4" y="3" width="2.5" height="10" rx=".75" />
    <rect x="9.5" y="3" width="2.5" height="10" rx=".75" />
  </svg>
)
const Phone = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M4.5 2.5h2l1 3-1.5 1a8 8 0 0 0 3.5 3.5l1-1.5 3 1v2a1.5 1.5 0 0 1-1.5 1.5A10.5 10.5 0 0 1 3 4a1.5 1.5 0 0 1 1.5-1.5Z" />
  </svg>
)
const PhoneOff = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <g transform="rotate(135 8 8)">
      <path d="M4.5 2.5h2l1 3-1.5 1a8 8 0 0 0 3.5 3.5l1-1.5 3 1v2a1.5 1.5 0 0 1-1.5 1.5A10.5 10.5 0 0 1 3 4a1.5 1.5 0 0 1 1.5-1.5Z" />
    </g>
  </svg>
)
const Rewind = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M7.5 4 3 8l4.5 4Z" />
    <path d="M13.5 4 9 8l4.5 4Z" />
  </svg>
)
const Timer = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <circle cx="8" cy="9" r="5" />
    <path d="M8 9V6.5" />
    <path d="M6.5 2h3" />
    <path d="M12.25 4.75l.75-.75" />
  </svg>
)

function animate(update: () => void) {
  document.activeViewTransition?.skipTransition()
  startTransition(update)
}

type IslandState = "idle" | "timer" | "call" | "music"

const iconButton =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 size-9 rounded-full [&_svg]:size-4"
const islandButton = `${iconButton} text-background hover:bg-background/10`

function Content({ state }: { state: IslandState }) {
  switch (state) {
    case "call":
      return (
        <div className="flex w-[min(18rem,100cqw)] items-center gap-3 p-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-background/15 text-xs font-semibold">
            MJ
          </span>
          <div className="flex-1 leading-tight">
            <p className="text-xs text-background/50">mobile</p>
            <p className="text-sm font-medium">Maya Jones</p>
          </div>
          <button
            type="button"
            aria-label="Decline"
            className={`${iconButton} bg-background/15 text-background hover:bg-background/25`}
          >
            <PhoneOff />
          </button>
          <button
            type="button"
            aria-label="Accept"
            className={`${iconButton} bg-background text-foreground hover:bg-background/90`}
          >
            <Phone />
          </button>
        </div>
      )
    case "timer":
      return (
        <div className="flex w-44 items-center justify-between px-3.5 py-2">
          <Timer className="size-4 text-background/70" />
          <span className="font-mono text-sm tabular-nums">04:59</span>
        </div>
      )
    case "music":
      return (
        <div className="w-[min(20rem,100cqw)] px-5 pt-5 pb-4">
          <div className="flex items-center gap-3.5">
            <span className="size-14 shrink-0 rounded-xl bg-[radial-gradient(circle_at_35%_30%,color-mix(in_oklab,var(--background)_90%,transparent)_0_14%,transparent_15%),linear-gradient(135deg,color-mix(in_oklab,var(--background)_40%,transparent),color-mix(in_oklab,var(--background)_8%,transparent))]" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate font-semibold">Entropy</p>
              <p className="truncate text-background/60">Beach Bunny</p>
            </div>
            <AudioLines className="size-6 text-background/70" />
          </div>
          <div className="mt-5 flex items-center gap-3 text-[11px] text-background/60 tabular-nums">
            <span>2:50</span>
            <div className="h-1.5 flex-1 rounded-full bg-background/20">
              <div className="h-full w-[77%] rounded-full bg-background" />
            </div>
            <span>-0:51</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="size-9" />
            <div className="flex items-center gap-5">
              <button type="button" aria-label="Previous" className={islandButton}>
                <Rewind className="size-6 fill-background" />
              </button>
              <button type="button" aria-label="Pause" className={islandButton}>
                <Pause className="size-7 fill-background" />
              </button>
              <button type="button" aria-label="Next" className={islandButton}>
                <FastForward className="size-6 fill-background" />
              </button>
            </div>
            <button type="button" aria-label="AirPlay" className={islandButton}>
              <Airplay />
            </button>
          </div>
        </div>
      )
    default:
      return (
        <div className="flex w-32 items-center justify-between px-3.5 py-2.5">
          <span className="size-2 rounded-full bg-background/80" />
          <Mic className="size-3.5 text-background/70" />
        </div>
      )
  }
}

const states: IslandState[] = ["idle", "timer", "call", "music"]

export default function DynamicIslandDemo() {
  const [state, setState] = useState<IslandState>("idle")

  return (
    <div className="@container flex w-full flex-col items-center gap-8">
      <div className="flex h-48 items-start justify-center">
        <DynamicIsland>
          <Content state={state} />
        </DynamicIsland>
      </div>
      <div
        role="group"
        aria-label="Island state"
        className="inline-flex h-8 items-center rounded-lg bg-muted p-[3px] text-muted-foreground"
      >
        {states.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={state === s}
            onClick={() => s !== state && animate(() => setState(s))}
            className="inline-flex h-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm dark:text-muted-foreground dark:aria-pressed:border-input dark:aria-pressed:bg-input/30 dark:aria-pressed:text-foreground [&_svg]:size-4 capitalize"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
