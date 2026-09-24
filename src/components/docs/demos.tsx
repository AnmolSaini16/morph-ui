"use client"

import type { ComponentType } from "react"
import AnimatedListDemo from "./examples/animated-list"
import CarouselDemo from "./examples/carousel"
import DynamicIslandDemo from "./examples/dynamic-island"
import ListSwitcherDemo from "./examples/list-switcher"
import MorphDialogDemo from "./examples/morph-dialog"
import MorphingPopoverDemo from "./examples/morphing-popover"
import NumberFlipDemo from "./examples/number-flip"
import PageTransitionDemo from "./examples/page-transition"
import PhotoGridDemo from "./examples/photo-grid"
import PostListDemo from "./examples/post-list"
import StackNavigatorDemo from "./examples/stack-navigator"
import StepWizardDemo from "./examples/step-wizard"
import TabsDemo from "./examples/tabs"

const demos: Record<string, ComponentType> = {
  "post-list": PostListDemo,
  "dynamic-island": DynamicIslandDemo,
  "morphing-popover": MorphingPopoverDemo,
  "morph-dialog": MorphDialogDemo,
  "number-flip": NumberFlipDemo,
  "animated-list": AnimatedListDemo,
  "photo-grid": PhotoGridDemo,
  "list-switcher": ListSwitcherDemo,
  tabs: TabsDemo,
  carousel: CarouselDemo,
  "step-wizard": StepWizardDemo,
  "stack-navigator": StackNavigatorDemo,
  "page-transition": PageTransitionDemo,
}

export function Demo({ slug }: { slug: string }) {
  const Component = demos[slug]
  return Component ? <Component /> : null
}
