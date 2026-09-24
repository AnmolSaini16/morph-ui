const themeNames = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "radius",
]
const utility =
  "(?:bg|text|border|ring|outline|fill|stroke|from|via|to|divide|decoration|caret|placeholder|shadow)"

export function themeVarsIn(component: string, css: string): string[] {
  return themeNames
    .filter(
      (name) =>
        new RegExp(`(?<![\\w-])${utility}-${name}(?:/[\\d.]+)?(?![\\w-])`).test(component) ||
        new RegExp(`var\\(\\s*--${name}\\b(?!-)`).test(css),
    )
    .map((name) => `--${name}`)
}
