import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { componentClasses, getComponentCss } from "../src/lib/component-css.ts"
import { entries } from "../src/lib/entries.ts"
import {
  classGroups,
  routeTransitionCode,
  skipOnScrollCode,
  themeCss,
} from "../src/lib/reference.ts"
import { themeVarsIn } from "../src/lib/theme-vars.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
export const outDir = path.join(root, "skills", "morph-ui")

const read = (file) => readFileSync(path.join(root, file), "utf8")
const fill = (template, values) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Unknown placeholder {{${key}}}`)
    return values[key]
  })

export function buildSkill() {
  const css = read("src/registry/morph.css")
  const files = {}

  files["assets/morph.css"] = css
  files["assets/theme.css"] = themeCss
  for (const { slug } of entries) {
    files[`assets/components/${slug}.tsx`] = read(`src/registry/${slug}.tsx`)
    files[`assets/examples/${slug}.tsx`] = read(
      `src/components/docs/examples/${slug}.tsx`,
    ).replaceAll("@/registry/", "@/components/")
  }

  const list = entries.map((e) => `- **${e.title}** (\`${e.slug}\`): ${e.description}`).join("\n")
  files["SKILL.md"] = fill(read("scripts/skill/SKILL.md"), {
    componentNames: entries.map((e) => e.title.toLowerCase()).join(", "),
    components: list,
  })

  const components = entries.map((e) => {
    const source = files[`assets/components/${e.slug}.tsx`]
    const exports = [...source.matchAll(/^export (?:function|type) (\w+)/gm)].map((m) => m[1])
    const theme = themeVarsIn(source, getComponentCss(css, e.slug))
    return [
      `## ${e.title}`,
      "",
      e.description,
      "",
      `- Component: \`assets/components/${e.slug}.tsx\``,
      `- Example: \`assets/examples/${e.slug}.tsx\``,
      `- Exports: ${exports.map((name) => `\`${name}\``).join(", ")}`,
      `- Classes: ${componentClasses[e.slug].map((c) => `\`${c}\``).join(", ")}`,
      `- Theme variables: ${theme.map((v) => `\`${v}\``).join(", ")}`,
      `- Docs: \`/${e.slug}\` on the Morph UI site`,
    ].join("\n")
  })
  files["references/components.md"] = [
    "# Components",
    "",
    "Each component is one file whose only import is `react`, plus `morph.css`. Copy the component unchanged and adapt its example. Read the component file for its props: they're typed at the top of its exported function.",
    "",
    ...components.flatMap((c) => [c, ""]),
  ].join("\n")

  const settings = css
    .slice(css.indexOf("── Settings"), css.indexOf("*/", css.indexOf("── Settings")))
    .split("\n")
    .filter((line) => /^\s+--vt-/.test(line))
    .map((line) => {
      const [, name, rest] = line.match(/^\s+(--vt-[\w-]+)\s+(.*)$/)
      return `| \`${name}\` | ${rest.replace(/\s{2,}/g, " · ").replaceAll("|", "\\|")} |`
    })
  files["references/classes.md"] = [
    "# Classes",
    "",
    'Give them to `<ViewTransition>` and combine them: `update="vt-move vt-shell"`, `share="vt-move vt-text"`. Direction classes pair with `addTransitionType`: `update={{ "step-next": "vt-slide vt-forward", "step-back": "vt-slide vt-back", default: "none" }}`.',
    "",
    ...classGroups.flatMap(([group, rows]) => [
      `## ${group}`,
      "",
      "| Class | What it does |",
      "| --- | --- |",
      ...rows.map(([name, body]) => `| \`${name}\` | ${body} |`),
      "",
    ]),
    "## Settings",
    "",
    "Each is written where it's used with its default, like `var(--vt-move, 420ms)`, so nothing is declared on `:root`. Set any of them in the user's CSS: `:root { --vt-move: 300ms; }`.",
    "",
    "| Setting | Default and use |",
    "| --- | --- |",
    ...settings,
    "",
  ].join("\n")

  files["references/patterns.md"] = fill(read("scripts/skill/patterns.md"), {
    routeTransition: routeTransitionCode,
    skipOnScroll: skipOnScrollCode,
  })

  return files
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = buildSkill()
  rmSync(outDir, { recursive: true, force: true })
  for (const [file, contents] of Object.entries(files)) {
    const target = path.join(outDir, file)
    mkdirSync(path.dirname(target), { recursive: true })
    writeFileSync(target, contents)
  }
  console.log(`Wrote ${Object.keys(files).length} files to ${path.relative(root, outDir)}/`)
}
