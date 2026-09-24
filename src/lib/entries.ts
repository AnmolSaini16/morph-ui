export type Category = "Morphs" | "Lists" | "Navigation"

export const categories: Category[] = ["Morphs", "Lists", "Navigation"]

export type Entry = {
  slug: string
  category: Category
  title: string
  description: string
  uses: string[]
}

export type SourceFile = { path: string; label?: string; code: string }

export const entries: Entry[] = [
  {
    slug: "post-list",
    category: "Morphs",
    title: "Post List",
    description: "A post expands into the full article and folds back into the list.",
    uses: ["name + share", "vt-move", "vt-expand", "vt-cover", "vt-text"],
  },
  {
    slug: "dynamic-island",
    category: "Morphs",
    title: "Dynamic Island",
    description: "One shape, many states. The pill expands and reveals its content.",
    uses: ["nested boundaries", "vt-shell", "vt-inverse", "vt-top"],
  },
  {
    slug: "morphing-popover",
    category: "Morphs",
    title: "Morphing Popover",
    description: "A button grows into a panel and folds back into the button.",
    uses: ["name + share", "vt-expand", "vt-text"],
  },
  {
    slug: "morph-dialog",
    category: "Morphs",
    title: "Morph Dialog",
    description: "A card grows into a modal dialog and folds back when it closes.",
    uses: ["name + share", "<dialog>", "vt-expand", "vt-quick"],
  },
  {
    slug: "number-flip",
    category: "Morphs",
    title: "Number Flip",
    description: "Changed digits roll a full line, with blur and optional stagger.",
    uses: ["one boundary per digit", "vt-roll", "vt-delay-*"],
  },
  {
    slug: "animated-list",
    category: "Lists",
    title: "Animated List",
    description: "Add, remove, shuffle and sort with zero layout math.",
    uses: ["keyed boundaries", "vt-move", "vt-presence"],
  },
  {
    slug: "photo-grid",
    category: "Lists",
    title: "Photo Grid",
    description: "Photos pop in, shrink away and bounce into their new spots.",
    uses: ["keyed boundaries", "vt-pop"],
  },
  {
    slug: "list-switcher",
    category: "Lists",
    title: "List Switcher",
    description: "Cards fold into a list; names and stats glide into place.",
    uses: ["container queries", "vt-shell", "vt-text", "vt-fade"],
  },
  {
    slug: "tabs",
    category: "Navigation",
    title: "Tabs",
    description: "The underline glides to your tab; the panel slides the same way.",
    uses: ["name + share", "addTransitionType", "vt-slide", "vt-quick"],
  },
  {
    slug: "carousel",
    category: "Navigation",
    title: "Carousel",
    description: "Cards slide by like a track, with arrows or dots.",
    uses: ["addTransitionType", "vt-swipe"],
  },
  {
    slug: "step-wizard",
    category: "Navigation",
    title: "Step Wizard",
    description: "Steps slide the way you move, forward or back.",
    uses: ["addTransitionType", "vt-slide"],
  },
  {
    slug: "stack-navigator",
    category: "Navigation",
    title: "Stack Navigator",
    description: "Chats push in from the right and pop back out, like a native app.",
    uses: ["addTransitionType", "vt-push", "vt-clip"],
  },
  {
    slug: "page-transition",
    category: "Navigation",
    title: "Page Transition",
    description: "Swap views with a crossfade, a blurred one, or sections one by one.",
    uses: ["update", "vt-blur", "vt-rise", "vt-delay-*"],
  },
]
