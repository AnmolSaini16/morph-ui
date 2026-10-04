"use client"

import type { ReactNode } from "react"
import {
  StepWizard,
  StepWizardBack,
  StepWizardContent,
  StepWizardDone,
  StepWizardNext,
  StepWizardProgress,
  StepWizardStep,
} from "@/registry/step-wizard"

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
const Check = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
)
const Palette = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M8 2a6 6 0 1 0 0 12c.8 0 1.2-.5 1.2-1.1 0-.4-.2-.7-.4-1-.2-.3-.4-.6-.4-1 0-.7.6-1.2 1.3-1.2H11a3 3 0 0 0 3-3C14 4.4 11.3 2 8 2Z" />
    <path d="M5 7.5h.01" />
    <path d="M7 5h.01" />
    <path d="M10 5.5h.01" />
  </svg>
)
const Rocket = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M10 2.5c1.9 0 3.5 1.6 3.5 3.5 0 2.6-2.9 5.3-5.2 6.6l-2.9-2.9C6.7 7.4 7.4 2.5 10 2.5Z" />
    <circle cx="10" cy="6" r="1" />
    <path d="M5.4 9.7 3 9.2l1.9-2.1" />
    <path d="M6.3 10.6 6.8 13l2.1-1.9" />
    <path d="M4.25 11.75 2.5 13.5" />
  </svg>
)
const Users = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <circle cx="6" cy="5.5" r="2.25" />
    <path d="M2 13.25c.4-2.3 2-3.5 4-3.5s3.6 1.2 4 3.5" />
    <path d="M10.5 3.4a2.25 2.25 0 0 1 0 4.2" />
    <path d="M12 9.9c1.1.5 1.8 1.6 2 3.35" />
  </svg>
)

const steps = [
  {
    icon: <Users />,
    title: "Invite your team",
    body: "Bring collaborators in. Everyone gets their own workspace view.",
  },
  {
    icon: <Palette />,
    title: "Pick a look",
    body: "Choose colors, fonts and density. You can change them anytime.",
  },
  {
    icon: <Rocket />,
    title: "Ship it",
    body: "Connect your repo and deploy your first preview in seconds.",
  },
]

function Step({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <>
      <div className="mb-3 grid size-10 place-items-center rounded-xl bg-muted [&_svg]:size-5">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </>
  )
}

export default function StepWizardDemo() {
  return (
    <StepWizard>
      <StepWizardProgress />
      <StepWizardContent>
        {steps.map((step) => (
          <StepWizardStep key={step.title}>
            <Step {...step} />
          </StepWizardStep>
        ))}
        <StepWizardDone>
          <Step icon={<Check />} title="You're all set" body="Your workspace is ready to go." />
        </StepWizardDone>
      </StepWizardContent>
      <div className="mt-5 flex justify-between">
        <StepWizardBack />
        <StepWizardNext />
      </div>
    </StepWizard>
  )
}
