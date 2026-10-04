"use client"

import { useRef, useState } from "react"
import { EmptyState, type EmptyStateItem } from "@/components/empty-state"

const names = ["Aurora", "Basecamp redesign", "Q4 launch", "Docs refresh"]

export default function EmptyStateDemo() {
  const [projects, setProjects] = useState<EmptyStateItem[]>([])
  const nextId = useRef(0)

  const create = () => {
    const id = nextId.current++
    setProjects((current) =>
      current.length >= 4
        ? current
        : [{ id, title: names[id % names.length], meta: "Just now" }, ...current],
    )
  }

  return (
    <EmptyState
      items={projects}
      onCreate={create}
      onRemove={(id) => setProjects((current) => current.filter((item) => item.id !== id))}
    />
  )
}
