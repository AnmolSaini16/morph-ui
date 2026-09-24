"use client"

import { useEffect, useLayoutEffect, useRef, ViewTransition, type ReactNode } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const historyMove = useRef(false)
  const firstPath = useRef(pathname)

  useEffect(() => {
    const onPopState = () => {
      historyMove.current = true
      document.documentElement.style.setProperty("--docs-page-offset", "0px")
    }
    addEventListener("popstate", onPopState)
    return () => removeEventListener("popstate", onPopState)
  }, [])

  // Scroll during the page swap, before the new page is captured. If Next.js scrolled
  // afterwards, the snapshots would stay at the old offset and jump when they're removed.
  useLayoutEffect(() => {
    if (firstPath.current === pathname) return
    firstPath.current = ""
    if (historyMove.current) {
      historyMove.current = false
      return
    }
    const target =
      location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (target) target.scrollIntoView()
    else scrollTo(0, 0)
  }, [pathname])

  return (
    <ViewTransition key={pathname} name="docs-page" share="vt-blur" default="none">
      {children}
    </ViewTransition>
  )
}
