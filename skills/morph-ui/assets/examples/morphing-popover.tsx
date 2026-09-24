"use client"

import { useEffect, useState } from "react"
import {
  MorphingPopover,
  MorphingPopoverClose,
  MorphingPopoverContent,
  MorphingPopoverTitle,
  MorphingPopoverTrigger,
} from "@/components/morphing-popover"

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
const Message = ({ className }: { className?: string }) => (
  <svg {...icon} className={className}>
    <path d="M3.5 3h9A1.5 1.5 0 0 1 14 4.5v5a1.5 1.5 0 0 1-1.5 1.5H7l-3 2.5V11h-.5A1.5 1.5 0 0 1 2 9.5v-5A1.5 1.5 0 0 1 3.5 3Z" />
  </svg>
)

const button =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 h-7 rounded-md px-2.5 text-[0.8rem]"

export default function MorphingPopoverDemo() {
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!sent) return
    const timer = setTimeout(() => setSent(false), 2000)
    return () => clearTimeout(timer)
  }, [sent])

  return (
    <MorphingPopover>
      <MorphingPopoverTrigger>
        <Message />
        {sent ? "Thanks!" : "Feedback"}
      </MorphingPopoverTrigger>
      <MorphingPopoverContent>
        <MorphingPopoverTitle>
          <Message />
          Feedback
        </MorphingPopoverTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.info("Feedback:", new FormData(e.currentTarget).get("feedback"))
            setSent(true)
          }}
        >
          <textarea
            name="feedback"
            placeholder="What could be better?"
            rows={4}
            className="mt-3 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="mt-2 flex justify-end gap-2">
            <MorphingPopoverClose
              className={`${button} bg-secondary text-secondary-foreground hover:bg-secondary/80`}
            >
              Cancel
            </MorphingPopoverClose>
            <MorphingPopoverClose
              type="submit"
              className={`${button} bg-primary text-primary-foreground hover:bg-primary/80`}
            >
              Send
            </MorphingPopoverClose>
          </div>
        </form>
      </MorphingPopoverContent>
    </MorphingPopover>
  )
}
