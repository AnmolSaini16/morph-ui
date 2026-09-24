"use client"

import { ViewTransition, type ReactNode } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <ViewTransition key={pathname} name="docs-page" share="vt-blur" default="none">
      {children}
    </ViewTransition>
  )
}
