"use client"

import { useState, ViewTransition } from "react"

export function NumberFlip({
  value,
  fractionDigits = 2,
  stagger = false,
  className = "",
}: {
  value: number
  fractionDigits?: number
  stagger?: boolean
  className?: string
}) {
  const [previous, setPrevious] = useState(value)
  const [direction, setDirection] = useState<"forward" | "back">("forward")
  if (previous !== value) {
    setPrevious(value)
    setDirection(value >= previous ? "forward" : "back")
  }
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
  return (
    <span aria-label={formatted} className={`inline-flex tabular-nums ${className}`}>
      {formatted.split("").map((char, index) => {
        const position = formatted.length - index
        const delay = stagger
          ? Math.min(formatted.slice(index + 1).replace(/\D/g, "").length, 2)
          : 0
        return /\d/.test(char) ? (
          <ViewTransition
            key={position}
            default={`vt-roll vt-${direction}${delay ? ` vt-delay-${delay}` : ""}`}
          >
            <span aria-hidden="true">{char}</span>
          </ViewTransition>
        ) : (
          <span key={position} aria-hidden="true">
            {char}
          </span>
        )
      })}
    </span>
  )
}
