"use client"

import { startTransition, useRef, useState } from "react"
import {
  Empty,
  EmptyAction,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyItem,
  EmptyList,
  EmptyMedia,
  EmptyState,
  EmptyTitle,
} from "@/registry/empty-state"

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
const Plus = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M8 3.5v9" />
    <path d="M3.5 8h9" />
  </svg>
)
const X = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M4.5 4.5l7 7" />
    <path d="M11.5 4.5l-7 7" />
  </svg>
)
const Folder = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M2 4.25a1.5 1.5 0 0 1 1.5-1.5h2.6l1.5 1.75h4.9a1.5 1.5 0 0 1 1.5 1.5v5.75a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.75Z" />
  </svg>
)

function animate(update: () => void) {
  document.activeViewTransition?.skipTransition()
  startTransition(update)
}

type Project = { id: number; name: string }

const names = ["Aurora", "Basecamp redesign", "Q4 launch", "Docs refresh"]

export default function EmptyStateDemo() {
  const [projects, setProjects] = useState<Project[]>([])
  const nextId = useRef(0)
  const empty = projects.length === 0

  const create = () => {
    const id = nextId.current++
    setProjects((current) =>
      current.length >= 4 ? current : [{ id, name: names[id % names.length] }, ...current],
    )
  }
  const remove = (id: number) =>
    animate(() => setProjects((current) => current.filter((project) => project.id !== id)))

  return (
    <div className="w-full max-w-sm text-sm">
      <div className="mb-3 flex h-7 items-center justify-between">
        <p className="font-medium">
          Projects
          <span className="ml-2 font-normal text-muted-foreground tabular-nums">
            {projects.length}
          </span>
        </p>
        <button
          type="button"
          inert={empty}
          disabled={projects.length >= 4}
          onClick={() => animate(create)}
          className={`inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border bg-background px-2.5 text-[0.8rem] font-medium transition-[opacity,background-color] duration-200 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:border-input dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:size-3.5 ${
            empty ? "opacity-0" : ""
          }`}
        >
          <Plus /> New
        </button>
      </div>
      <EmptyState ids={projects.map((project) => project.id)} className="h-64">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Folder />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>Create your first project to get started.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <EmptyAction onClick={create}>
              <Plus /> New project
            </EmptyAction>
          </EmptyContent>
        </Empty>
        <EmptyList aria-label="Projects">
          {projects.map((project) => (
            <EmptyItem
              key={project.id}
              id={project.id}
              className="flex h-12 items-center gap-3 pr-11 pl-3"
              action={
                <button
                  type="button"
                  aria-label={`Remove ${project.name}`}
                  onClick={() => remove(project.id)}
                  className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-3.5" />
                </button>
              }
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <Folder />
              </span>
              <span className="min-w-0 flex-1 truncate font-medium">{project.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">Just now</span>
            </EmptyItem>
          ))}
        </EmptyList>
      </EmptyState>
    </div>
  )
}
