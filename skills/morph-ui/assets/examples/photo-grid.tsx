"use client"

import { startTransition, useRef, useState } from "react"
import { PhotoGrid, type Photo } from "@/components/photo-grid"

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
  "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 h-7 gap-1 rounded-md border border-transparent px-2.5 text-[0.8rem] [&_svg]:size-3.5"
const outline =
  "border bg-background hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"

const photo =
  "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?w=400&q=80&auto=format&fit=crop"
const shots: Omit<Photo, "id">[] = [
  {
    name: "Dune",
    detail: "Soft light",
    image: `url(${photo}) 50% 50% / cover`,
    filter: "grayscale(1)",
  },
  {
    name: "Drift",
    detail: "Blurred",
    image: `url(${photo}) 20% 30% / 220%`,
    filter: "grayscale(1) blur(4px)",
  },
  {
    name: "Ridge",
    detail: "High contrast",
    image: `url(${photo}) 80% 60% / 260%`,
    filter: "grayscale(1) contrast(1.6) brightness(0.85)",
  },
  {
    name: "Haze",
    detail: "Faded",
    image: `url(${photo}) 40% 80% / 180%`,
    filter: "grayscale(1) brightness(1.25) contrast(0.8)",
  },
  {
    name: "Fold",
    detail: "Close crop",
    image: `url(${photo}) 70% 20% / 320%`,
    filter: "grayscale(1)",
  },
  {
    name: "Mist",
    detail: "Soft blur",
    image: `url(${photo}) 30% 70% / 200%`,
    filter: "grayscale(1) blur(2px) brightness(1.1)",
  },
  {
    name: "Night",
    detail: "Low key",
    image: `url(${photo}) 60% 40% / 240%`,
    filter: "grayscale(1) brightness(0.6)",
  },
  {
    name: "Grain",
    detail: "Sharpened",
    image: `url(${photo}) 10% 50% / 280%`,
    filter: "grayscale(1) contrast(1.3)",
  },
]
const max = 10

export default function PhotoGridDemo() {
  const nextId = useRef(4)
  const [photos, setPhotos] = useState<Photo[]>(() =>
    shots.slice(0, 4).map((s, i) => ({ id: i, ...s })),
  )

  const add = () => {
    const id = nextId.current++
    const shot = shots[id % shots.length]
    animate(() => setPhotos((list) => (list.length >= max ? list : [{ id, ...shot }, ...list])))
  }
  const shuffle = () =>
    animate(() => setPhotos((list) => [...list].sort(() => Math.random() - 0.5)))
  const remove = (id: Photo["id"]) => setPhotos((list) => list.filter((s) => s.id !== id))

  return (
    <div className="w-full max-w-md">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium">
          Photos <span className="text-muted-foreground tabular-nums">· {photos.length}</span>
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={shuffle}
            disabled={photos.length < 2}
            className={`${button} ${outline}`}
          >
            <Shuffle /> Shuffle
          </button>
          <button
            type="button"
            onClick={add}
            disabled={photos.length >= max}
            className={`${button} bg-primary text-primary-foreground hover:bg-primary/80`}
          >
            <Plus /> Add
          </button>
        </div>
      </div>
      <PhotoGrid photos={photos} onRemove={remove} height="19rem" />
    </div>
  )
}
