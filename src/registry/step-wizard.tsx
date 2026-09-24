"use client"

import { addTransitionType, startTransition, useState, ViewTransition, type ReactNode } from "react"

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
const ArrowLeft = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M13 8H3.5" />
    <path d="M7.5 4 3.5 8l4 4" />
  </svg>
)
const ArrowRight = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M3 8h9.5" />
    <path d="M8.5 4l4 4-4 4" />
  </svg>
)
const Check = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
)

export type Step = { icon?: ReactNode; title: string; body: string }
type Progress = { step: number; done: boolean }

const button =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-7 gap-1 rounded-md border border-transparent px-2.5 text-[0.8rem] [&_svg]:size-3.5"
const outline =
  "border border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"

export function StepWizard({
  steps,
  doneTitle = "You're all set",
  doneBody = "Your workspace is ready to go.",
}: {
  steps: Step[]
  doneTitle?: string
  doneBody?: string
}) {
  const [{ step, done }, setState] = useState<Progress>({
    step: 0,
    done: false,
  })
  const last = steps.length - 1

  const move = (direction: "next" | "prev", update: (s: Progress) => Progress) => {
    document.activeViewTransition?.skipTransition()
    startTransition(() => {
      addTransitionType(`wizard-${direction}`)
      setState(update)
    })
  }

  const next = () =>
    move("next", (s) =>
      s.step === last ? { ...s, done: true } : { step: s.step + 1, done: false },
    )
  const prev = () =>
    move("prev", (s) =>
      s.done ? { ...s, done: false } : { step: Math.max(0, s.step - 1), done: false },
    )
  const restart = () => move("prev", () => ({ step: 0, done: false }))

  const current = steps[step]

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground">
      <div className="mb-5 flex items-center gap-1.5">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              !done && i === step
                ? "w-6 bg-foreground"
                : i < step || done
                  ? "w-1.5 bg-foreground"
                  : "w-1.5 bg-muted"
            }`}
          />
        ))}
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {done ? "Done" : `${step + 1} / ${steps.length}`}
        </span>
      </div>

      <ViewTransition
        update={{
          "wizard-next": "vt-slide vt-clip vt-forward",
          "wizard-prev": "vt-slide vt-clip vt-back",
          default: "none",
        }}
      >
        <div className="-mx-5 h-32 px-5" aria-live="polite">
          <div className="mb-3 grid size-10 place-items-center rounded-xl bg-muted [&_svg]:size-5">
            {done ? <Check className="text-foreground" /> : current?.icon}
          </div>
          <h3 className="font-semibold">{done ? doneTitle : current?.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{done ? doneBody : current?.body}</p>
        </div>
      </ViewTransition>

      <div className="mt-5 flex justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0 && !done}
          className={`${button} bg-secondary text-secondary-foreground hover:bg-secondary/80`}
        >
          <ArrowLeft /> Back
        </button>
        {done ? (
          <button type="button" onClick={restart} className={`${button} ${outline}`}>
            Start over
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className={`${button} bg-primary text-primary-foreground hover:bg-primary/80`}
          >
            {step === last ? "Finish" : "Continue"} <ArrowRight />
          </button>
        )}
      </div>
    </div>
  )
}
