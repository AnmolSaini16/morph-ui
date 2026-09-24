"use client"

import { ListSwitcher, type Repo } from "@/registry/list-switcher"

const repos: Repo[] = [
  {
    id: "orbit",
    name: "orbit",
    description: "Realtime presence and cursors for any React app.",
    language: "TypeScript",
    color: "color-mix(in oklab, var(--foreground) 90%, var(--muted))",
    stars: "4.2k",
    forks: 212,
    updated: "2h ago",
  },
  {
    id: "tidewave",
    name: "tidewave",
    description: "Event streaming without the ops burden.",
    language: "Go",
    color: "color-mix(in oklab, var(--foreground) 65%, var(--muted))",
    stars: "1.8k",
    forks: 96,
    updated: "5h ago",
  },
  {
    id: "lumen-css",
    name: "lumen-css",
    description: "Design tokens compiled to modern CSS.",
    language: "CSS",
    color: "color-mix(in oklab, var(--foreground) 45%, var(--muted))",
    stars: "932",
    forks: 41,
    updated: "1d ago",
  },
  {
    id: "ferrous",
    name: "ferrous",
    description: "A tiny, fast image pipeline written in Rust.",
    language: "Rust",
    color: "color-mix(in oklab, var(--foreground) 25%, var(--muted))",
    stars: "2.6k",
    forks: 130,
    updated: "3d ago",
  },
]

export default function ListSwitcherDemo() {
  return <ListSwitcher repos={repos} />
}
