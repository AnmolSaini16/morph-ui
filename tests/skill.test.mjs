import { test } from "node:test"
import assert from "node:assert/strict"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { buildSkill, outDir } from "../scripts/build-skill.mjs"
import { classGroups } from "../src/lib/reference.ts"

const files = buildSkill()

function onDisk(dir, prefix = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory()
      ? onDisk(path.join(dir, d.name), `${prefix}${d.name}/`)
      : [`${prefix}${d.name}`],
  )
}

test("skills/morph-ui is up to date (run npm run skill)", () => {
  assert.ok(existsSync(outDir), "skills/morph-ui is missing")
  assert.deepEqual(onDisk(outDir).sort(), Object.keys(files).sort(), "files added or removed")
  for (const [file, contents] of Object.entries(files))
    assert.equal(readFileSync(path.join(outDir, file), "utf8"), contents, `${file} is stale`)
})

test("SKILL.md has valid frontmatter", () => {
  const [, front] = files["SKILL.md"].match(/^---\n([\s\S]*?)\n---\n/)
  const name = front.match(/^name: (.+)$/m)?.[1]
  const description = front.match(/^description: (.+)$/m)?.[1]
  assert.equal(name, "morph-ui", "name must match the folder")
  assert.ok(description && description.length <= 1024, "description missing or over 1024 chars")
  assert.doesNotMatch(files["SKILL.md"], /\{\{\w+\}\}/, "unfilled placeholder")
})

test("every class in morph.css is documented", () => {
  const css = readFileSync(new URL("../src/registry/morph.css", import.meta.url), "utf8")
  const documented = classGroups.flatMap(([, rows]) => rows.map(([name]) => name)).join(" ")
  const used = new Set([...css.matchAll(/\.(vt-[a-z]+)(?:-\d)?\b/g)].map((m) => m[1]))
  for (const name of used)
    assert.match(documented, new RegExp(`\\b${name}\\b`), `${name} undocumented`)
})

test("markdown code fences are balanced", () => {
  for (const [file, contents] of Object.entries(files)) {
    if (!file.endsWith(".md")) continue
    assert.doesNotMatch(contents, /^````/m, `${file} has a four-backtick fence`)
    const fences = contents.match(/^\s*```/gm) ?? []
    assert.equal(fences.length % 2, 0, `${file} has an unclosed code fence`)
  }
})
