import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import postcss from "postcss"
import { componentClasses, getComponentCss } from "../src/lib/component-css.ts"
const css = readFileSync(new URL("../src/registry/morph.css", import.meta.url), "utf8")
for (const [slug, classes] of Object.entries(componentClasses)) {
  test(`${slug}: complete standalone CSS with no unrelated classes`, () => {
    const snippet = getComponentCss(css, slug)
    const root = postcss.parse(snippet)
    assert.ok(snippet.length < css.length)
    const definitions = new Set(["--radius", "--card", "--foreground"])
    const references = new Set()
    const animations = new Set()
    const keyframes = new Set()
    root.walkDecls((d) => {
      if (d.prop.startsWith("--")) definitions.add(d.prop)
      for (const m of d.value.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) references.add(m[1])
      if (d.prop === "animation")
        for (const m of d.value.matchAll(/(?<![\w-])vt-[\w-]+\b/g)) animations.add(m[0])
    })
    root.walkAtRules("keyframes", (a) => keyframes.add(a.params))
    for (const ref of references) assert.ok(definitions.has(ref), `Missing ${ref}`)
    for (const name of animations) assert.ok(keyframes.has(name), `Missing keyframe ${name}`)
    root.walkRules((r) => {
      for (const m of r.selector.matchAll(/\.(vt-[\w-]+)/g))
        assert.ok(classes.includes(m[1]), `Unexpected ${m[1]}`)
    })
    assert.match(snippet, /view-transition-name: none/)
    assert.match(snippet, /prefers-reduced-motion/)
    assert.match(snippet, /::view-transition-image-pair\(\*\)/)
    const source = readFileSync(new URL(`../src/registry/${slug}.tsx`, import.meta.url), "utf8")
    for (const m of source.matchAll(/\bvt-[a-z0-9]+(?:-[a-z0-9]+)*(-?)/g)) {
      if (m[1]) continue
      assert.ok(classes.includes(m[0]), `Manifest missing ${m[0]}`)
    }
  })
}
test("compound selectors and transitive token dependencies survive extraction", () => {
  const snippet = getComponentCss(css, "dynamic-island")
  assert.match(snippet, /\.vt-shell\.vt-inverse/)
  assert.doesNotMatch(snippet, /vt-swipe|vt-push|vt-roll|vt-expand/)
})
test("unregistered components fail rather than silently exporting incomplete CSS", () => {
  assert.throws(() => getComponentCss(css, "missing"), /Missing CSS dependencies/)
})

function settingsIn(text) {
  const out = []
  for (const m of text.matchAll(/var\(\s*(--vt-[\w-]+)/g)) {
    let i = m.index + m[0].length,
      depth = 1,
      start = -1
    for (; i < text.length && depth; i++) {
      if (text[i] === "(") depth++
      else if (text[i] === ")") depth--
      else if (text[i] === "," && depth === 1 && start < 0) start = i + 1
    }
    out.push([m[1], start < 0 ? null : text.slice(start, i - 1).trim()])
  }
  return out
}

test("every setting carries the same default everywhere, and nothing else lands on :root", () => {
  const defaults = new Map()
  for (const [name, fallback] of settingsIn(css.replace(/\/\*[\s\S]*?\*\//g, ""))) {
    if (name === "--vt-offset") continue
    assert.ok(fallback, `${name} is used without a default`)
    if (defaults.has(name))
      assert.equal(fallback, defaults.get(name), `${name} has two different defaults`)
    defaults.set(name, fallback)
  }
  postcss.parse(css).walkRules(":root", (rule) => {
    rule.walkDecls((decl) =>
      assert.equal(decl.prop, "view-transition-name", `${decl.prop} declared on :root`),
    )
  })
})

test("morph.css and every snippet parse cleanly in Lightning CSS", async () => {
  const { transform } = await import("lightningcss")
  const check = (filename, code) => {
    const { warnings } = transform({ filename, code: Buffer.from(code), errorRecovery: true })
    assert.deepEqual(
      warnings.map((w) => w.message),
      [],
      `${filename} has CSS the parser rejects`,
    )
  }
  check("morph.css", css)
  for (const slug of Object.keys(componentClasses)) check(`${slug}.css`, getComponentCss(css, slug))
})
