"use client"

import { MorphingPopover } from "@/components/morphing-popover"

export default function MorphingPopoverDemo() {
  return <MorphingPopover label="Feedback" onSubmit={(text) => console.info("Feedback:", text)} />
}
