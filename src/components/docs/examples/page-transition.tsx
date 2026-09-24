"use client"

import { startTransition, useState } from "react"
import { PageTransition, type PageEffect } from "@/registry/page-transition"

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
const FolderKanban = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M2 4.5a1 1 0 0 1 1-1h3l1.5 1.5H13a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z" />
    <path d="M5.5 8v3" />
    <path d="M8 8v1.5" />
    <path d="M10.5 8v2" />
  </svg>
)
const House = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M2.5 7 8 2.5 13.5 7" />
    <path d="M4 6v6.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6" />
    <path d="M6.5 13.5V10h3v3.5" />
  </svg>
)
const Settings = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M2.5 4.5H9" />
    <path d="M12 4.5h1.5" />
    <path d="M2.5 11.5H4" />
    <path d="M7 11.5h6.5" />
    <circle cx="10.5" cy="4.5" r="1.5" />
    <circle cx="5.5" cy="11.5" r="1.5" />
  </svg>
)

function animate(update: () => void) {
  document.activeViewTransition?.skipTransition()
  startTransition(update)
}

type Page = "home" | "projects" | "settings"

function homePage() {
  return [
    <div key="title">
      <p className="text-lg font-semibold tracking-tight">Good morning, Maya</p>
      <p className="mt-1 text-sm text-muted-foreground">Here is what happened overnight.</p>
    </div>,
    <div key="stats" className="mt-5 grid grid-cols-3 gap-2">
      {[
        ["Deploys", "12"],
        ["Visitors", "8.4k"],
        ["Errors", "0"],
      ].map(([label, value]) => (
        <div key={label} className="rounded-lg bg-muted/60 p-3">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
        </div>
      ))}
    </div>,
  ]
}

function projectsPage() {
  const projects = [
    ["Marketing site", "Live"],
    ["Mobile app", "Review"],
    ["Design system", "Draft"],
  ]
  return [
    <p key="title" className="text-lg font-semibold tracking-tight">
      Projects
    </p>,
    <ul key="list" className="mt-4 divide-y divide-border rounded-lg border border-border">
      {projects.map(([name, status]) => (
        <li key={name} className="flex items-center justify-between px-3 py-2.5 text-sm">
          {name}
          <span className="inline-flex h-5 items-center rounded-full bg-secondary px-2 text-xs font-medium text-secondary-foreground">
            {status}
          </span>
        </li>
      ))}
    </ul>,
  ]
}

function settingsPage() {
  const rows = [
    ["Workspace name", "Acme Inc."],
    ["Region", "Frankfurt"],
    ["Plan", "Pro"],
  ]
  return [
    <p key="title" className="mb-4 text-lg font-semibold tracking-tight">
      Settings
    </p>,
    ...rows.map(([label, value]) => (
      <div key={label} className="mb-3 flex justify-between border-b border-border pb-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    )),
  ]
}

const pages = {
  home: { label: "Home", icon: House, sections: homePage },
  projects: { label: "Projects", icon: FolderKanban, sections: projectsPage },
  settings: { label: "Settings", icon: Settings, sections: settingsPage },
}

const effects: PageEffect[] = ["crossfade", "blur", "stagger"]

export default function PageTransitionDemo() {
  const [page, setPage] = useState<Page>("home")
  const [effect, setEffect] = useState<PageEffect>("crossfade")

  return (
    <div className="@container flex w-full max-w-lg flex-col items-center gap-6">
      <div className="w-full overflow-hidden rounded-xl bg-card text-sm text-card-foreground ring-1 ring-foreground/10">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <nav
            aria-label="Pages"
            className="inline-flex h-8 items-center rounded-lg bg-muted p-[3px] text-muted-foreground"
          >
            {(Object.keys(pages) as Page[]).map((key) => {
              const { label, icon: Icon } = pages[key]
              return (
                <button
                  key={key}
                  type="button"
                  aria-label={label}
                  aria-pressed={page === key}
                  onClick={() => key !== page && animate(() => setPage(key))}
                  className="inline-flex h-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm dark:text-muted-foreground dark:aria-pressed:border-input dark:aria-pressed:bg-input/30 dark:aria-pressed:text-foreground [&_svg]:size-4"
                >
                  <Icon /> <span className="hidden @sm:inline">{label}</span>
                </button>
              )
            })}
          </nav>
        </div>
        <div className="h-60 overflow-y-auto p-5">
          <PageTransition page={page} effect={effect}>
            {pages[page].sections()}
          </PageTransition>
        </div>
      </div>
      <div
        role="group"
        aria-label="Effect"
        className="inline-flex h-8 items-center rounded-lg bg-muted p-[3px] text-muted-foreground"
      >
        {effects.map((e) => (
          <button
            key={e}
            type="button"
            aria-pressed={effect === e}
            onClick={() => setEffect(e)}
            className="inline-flex h-full cursor-pointer items-center justify-center rounded-md border border-transparent px-2.5 text-sm font-medium whitespace-nowrap text-foreground/60 capitalize transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm dark:text-muted-foreground dark:aria-pressed:border-input dark:aria-pressed:bg-input/30 dark:aria-pressed:text-foreground"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  )
}
