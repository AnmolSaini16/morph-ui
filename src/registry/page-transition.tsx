"use client"

import { Children, ViewTransition, type ReactNode } from "react"

export type PageEffect = "crossfade" | "blur" | "stagger"

export function PageTransition({
  page,
  effect = "crossfade",
  children,
}: {
  page: string
  effect?: PageEffect
  children: ReactNode
}) {
  if (effect === "stagger") {
    return (
      <div>
        {Children.toArray(children).map((section, i) => (
          <ViewTransition
            key={`${page}-${i}`}
            enter={i ? `vt-rise vt-delay-${Math.min(i, 3)}` : "vt-rise"}
            exit="vt-rise"
            default="none"
          >
            <div>{section}</div>
          </ViewTransition>
        ))}
      </div>
    )
  }
  return (
    <ViewTransition update={effect === "blur" ? "vt-blur" : "auto"}>
      <div>{children}</div>
    </ViewTransition>
  )
}
