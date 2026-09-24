"use client"

import { useEffect } from "react"

export function SkipOnScroll() {
  useEffect(() => {
    const skip = () => document.activeViewTransition?.skipTransition()
    addEventListener("scroll", skip, { capture: true, passive: true })
    return () => removeEventListener("scroll", skip, { capture: true })
  }, [])
  return null
}
