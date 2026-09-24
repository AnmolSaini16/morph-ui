"use client"

import { ViewTransition, type ReactNode } from "react"

export function DynamicIsland({ children }: { children: ReactNode }) {
  return (
    <ViewTransition update="vt-move vt-slow vt-spring vt-shell vt-inverse vt-clip">
      <div className="overflow-hidden rounded-[32px] bg-foreground text-background [view-transition-group:contain]">
        <ViewTransition update="vt-move vt-slow vt-spring vt-reveal vt-top">
          <div>{children}</div>
        </ViewTransition>
      </div>
    </ViewTransition>
  )
}
