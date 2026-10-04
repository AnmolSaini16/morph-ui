"use client"

import {
  addTransitionType,
  Children,
  createContext,
  isValidElement,
  startTransition,
  useContext,
  useLayoutEffect,
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

type Shape = { count: number; hasDone: boolean }

type WizardState = {
  step: number
  count: number
  done: boolean
  hasDone: boolean
  next: () => void
  back: () => void
  restart: () => void
  setShape: (shape: Shape) => void
}

const Context = createContext<WizardState | null>(null)

export function useStepWizard() {
  const wizard = useContext(Context)
  if (!wizard) throw new Error("StepWizard parts must be used inside <StepWizard>")
  return wizard
}

const button =
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-7 gap-1 rounded-md border border-transparent px-2.5 text-[0.8rem] [&_svg]:size-3.5"
const outline =
  "border border-border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"

export function StepWizard({
  defaultStep = 0,
  onStepChange,
  className = "",
  children,
}: {
  defaultStep?: number
  onStepChange?: (step: number) => void
  className?: string
  children: ReactNode
}) {
  const [index, setIndex] = useState(defaultStep)
  const [{ count, hasDone }, setShape] = useState<Shape>({ count: 0, hasDone: false })
  const last = hasDone ? count : count - 1
  const step = Math.max(0, Math.min(index, last))

  const move = (direction: "next" | "prev", to: number) => {
    if (to === step || to < 0 || to > last) return
    document.activeViewTransition?.skipTransition()
    startTransition(() => {
      addTransitionType(`wizard-${direction}`)
      setIndex(to)
      onStepChange?.(to)
    })
  }

  const state: WizardState = {
    step,
    count,
    done: hasDone && step === count,
    hasDone,
    next: () => move("next", step + 1),
    back: () => move("prev", step - 1),
    restart: () => move("prev", 0),
    setShape,
  }

  return (
    <Context value={state}>
      <div
        className={`w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-card-foreground ${className}`}
      >
        {children}
      </div>
    </Context>
  )
}

export function StepWizardProgress({
  doneLabel = "Done",
  className = "",
}: {
  doneLabel?: string
  className?: string
}) {
  const { step, count, done } = useStepWizard()
  return (
    <div className={`mb-5 flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
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
        {done ? doneLabel : `${step + 1} / ${count}`}
      </span>
    </div>
  )
}

export function StepWizardContent({
  className = "",
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { step, setShape } = useStepWizard()
  const items = Children.toArray(children).filter(isValidElement)
  const steps = items.filter((item) => item.type !== StepWizardDone)
  const done = items.find((item) => item.type === StepWizardDone)
  const count = steps.length
  const hasDone = Boolean(done)

  useLayoutEffect(() => setShape({ count, hasDone }), [count, hasDone, setShape])

  return (
    <ViewTransition
      update={{
        "wizard-next": "vt-slide vt-clip vt-forward",
        "wizard-prev": "vt-slide vt-clip vt-back",
        default: "none",
      }}
    >
      <div className={`-mx-5 h-32 px-5 ${className}`} aria-live="polite">
        {step >= count ? done : steps[step]}
      </div>
    </ViewTransition>
  )
}

export function StepWizardStep({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function StepWizardDone({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function StepWizardBack({
  className = "",
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  const { step, back } = useStepWizard()
  return (
    <button
      type="button"
      onClick={back}
      disabled={step === 0}
      className={`${button} bg-secondary text-secondary-foreground hover:bg-secondary/80 ${className}`}
    >
      {children ?? (
        <>
          <ArrowLeft /> Back
        </>
      )}
    </button>
  )
}

export function StepWizardNext({
  finishLabel = "Finish",
  restartLabel = "Start over",
  className = "",
  children,
}: {
  finishLabel?: string
  restartLabel?: string
  className?: string
  children?: ReactNode
}) {
  const { step, count, done, hasDone, next, restart } = useStepWizard()
  if (done)
    return (
      <button type="button" onClick={restart} className={`${button} ${outline} ${className}`}>
        {restartLabel}
      </button>
    )
  const finishing = step === count - 1
  return (
    <button
      type="button"
      onClick={next}
      disabled={finishing && !hasDone}
      className={`${button} bg-primary text-primary-foreground hover:bg-primary/80 ${className}`}
    >
      {finishing ? finishLabel : (children ?? "Continue")} <ArrowRight />
    </button>
  )
}
