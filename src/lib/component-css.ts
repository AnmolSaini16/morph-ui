import postcss, { type Rule } from "postcss"

export const componentClasses: Record<string, string[]> = {
  "post-list": ["vt-move", "vt-expand", "vt-cover", "vt-text", "vt-blur", "vt-quick"],
  "dynamic-island": [
    "vt-move",
    "vt-slow",
    "vt-spring",
    "vt-shell",
    "vt-inverse",
    "vt-clip",
    "vt-reveal",
    "vt-top",
  ],
  "morphing-popover": ["vt-move", "vt-expand", "vt-text", "vt-quick"],
  "morph-dialog": ["vt-move", "vt-expand", "vt-quick"],
  "number-flip": ["vt-roll", "vt-forward", "vt-back", "vt-delay-1", "vt-delay-2"],
  "animated-list": ["vt-move", "vt-presence", "vt-scroll", "vt-edge-bottom"],
  "photo-grid": ["vt-pop"],
  "list-switcher": [
    "vt-clip",
    "vt-edge-bottom",
    "vt-move",
    "vt-shell",
    "vt-text",
    "vt-fade",
    "vt-delay-3",
  ],
  tabs: ["vt-move", "vt-quick", "vt-slide", "vt-clip", "vt-forward", "vt-back"],
  carousel: ["vt-swipe", "vt-forward", "vt-back"],
  "step-wizard": ["vt-slide", "vt-clip", "vt-forward", "vt-back"],
  "stack-navigator": ["vt-push", "vt-clip", "vt-forward", "vt-back"],
  "page-transition": ["vt-blur", "vt-rise", "vt-delay-1", "vt-delay-2", "vt-delay-3"],
}

export function getComponentCss(css: string, slug: string): string {
  const dependencies = componentClasses[slug]
  if (!dependencies) throw new Error(`Missing CSS dependencies for ${slug}`)
  const classes = new Set(dependencies)
  const root = postcss.parse(css)
  const output = postcss.root()
  const keepSelector = (selector: string) => {
    const names = [...selector.matchAll(/\.(vt-[\w-]+)/g)].map((match) => match[1])
    return names.length === 0 || names.every((name) => classes.has(name))
  }
  const filterRule = (rule: Rule) => {
    const selectors = rule.selectors.filter(keepSelector)
    if (selectors.length === 0) rule.remove()
    else rule.selectors = selectors
  }
  for (const node of root.nodes) {
    if (node.type === "comment") continue
    if (node.type === "atrule" && node.name === "keyframes") continue
    const copy = node.clone()
    if (copy.type === "rule") {
      const selectors = copy.selectors.filter(keepSelector)
      if (!selectors.length) continue
      copy.selectors = selectors
    }
    if (copy.type === "atrule") copy.walkRules(filterRule)
    output.append(copy)
  }
  const keyframes = new Set<string>()
  output.walkDecls(/^animation(?:-name)?$/, (decl) => {
    for (const match of decl.value.matchAll(/(?<![\w-])vt-[\w-]+\b/g)) keyframes.add(match[0])
  })
  root.walkAtRules("keyframes", (rule) => {
    if (keyframes.has(rule.params)) output.append(rule.clone())
  })
  output.walkComments((comment) => {
    comment.remove()
  })
  return `/* ${slug}: paste into globals.css after Tailwind.\n   Skip it if you already import morph.css. Settings are var(--vt-*, default):\n   override any of them anywhere, e.g. :root { --vt-move: 300ms; } */\n${output.toString().trim()}\n`
}
