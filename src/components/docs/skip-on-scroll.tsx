"use client"

import { useEffect } from "react"

const scrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"])

export function SkipOnScroll() {
  useEffect(() => {
    const skip = () => document.activeViewTransition?.skipTransition()
    const onKey = (e: KeyboardEvent) => scrollKeys.has(e.key) && skip()
    const options = { capture: true, passive: true }
    addEventListener("wheel", skip, options)
    addEventListener("touchmove", skip, options)
    addEventListener("keydown", onKey, options)
    return () => {
      removeEventListener("wheel", skip, options)
      removeEventListener("touchmove", skip, options)
      removeEventListener("keydown", onKey, options)
    }
  }, [])
  return null
}
