"use client"

import { startTransition, useLayoutEffect, useRef, ViewTransition } from "react"

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
const Trash2 = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M2.75 4.5h10.5" />
    <path d="M6.25 4.5V3.25h3.5V4.5" />
    <path d="M4.25 4.5l.6 8.1a1 1 0 0 0 1 .9h4.3a1 1 0 0 0 1-.9l.6-8.1" />
    <path d="M6.75 7v4" />
    <path d="M9.25 7v4" />
  </svg>
)

export type Photo = {
  id: string | number
  name: string
  detail?: string
  image: string
  filter?: string
}
const grid = "grid grid-cols-3 auto-rows-[9rem] gap-3 @min-[360px]:grid-cols-5"

export function PhotoGrid({
  photos,
  onRemove,
  height = "22rem",
}: {
  photos: Photo[]
  onRemove?: (id: Photo["id"]) => void
  height?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = root.current
    const transition = document.activeViewTransition
    if (!el || !transition) return
    el.dataset.animating = ""
    transition.finished.finally(() => delete el.dataset.animating)
  }, [photos])

  return (
    <div
      ref={root}
      className="group/grid @container relative w-full max-w-md overflow-y-auto text-foreground"
      style={{ height }}
    >
      <ul className={grid} aria-label="Photos">
        {photos.map((photo) => (
          <ViewTransition key={photo.id} default="vt-pop">
            <li className="relative min-w-0">
              <div className="relative h-24 overflow-hidden rounded-xl bg-muted">
                <div
                  className={`absolute inset-0 ${photo.filter ? "scale-110" : ""}`}
                  style={{ background: photo.image, filter: photo.filter }}
                />
              </div>
              {onRemove && (
                <span
                  aria-hidden="true"
                  className="absolute top-16 right-1 inline-flex size-7 items-center justify-center rounded-full border border-border bg-background text-foreground"
                >
                  <Trash2 className="size-3" />
                </span>
              )}
              <p className="mt-1.5 truncate text-xs font-medium" title={photo.name}>
                {photo.name}
              </p>
              {photo.detail && (
                <p className="truncate text-[11px] text-muted-foreground">{photo.detail}</p>
              )}
            </li>
          </ViewTransition>
        ))}
      </ul>
      {photos.length === 0 && (
        <p role="status" className="text-sm text-muted-foreground">
          No photos yet.
        </p>
      )}
      {onRemove && (
        <div
          className={`${grid} pointer-events-none absolute inset-x-0 top-0 group-has-[[style*=view-transition-name]]/grid:opacity-0 group-data-[animating]/grid:opacity-0`}
        >
          {photos.map((photo) => (
            <div key={photo.id} className="flex h-36 items-start justify-end pt-16 pr-1">
              <button
                type="button"
                aria-label={`Remove ${photo.name}`}
                onClick={() => {
                  document.activeViewTransition?.skipTransition()
                  startTransition(() => onRemove(photo.id))
                }}
                className="pointer-events-auto inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
