import { test } from "node:test"
import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"

const hues =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone"
const utility =
  "bg|text|border|ring|fill|stroke|from|via|to|shadow|outline|decoration|accent|caret|divide"
const paletteClass = new RegExp(`(?<![\\w-])(?:${utility})-(?:${hues})-\\d{2,3}\\b`)
const whiteBlack = new RegExp(`(?<![\\w-])(?:${utility})-(?:white|black)\\b`)
const literal = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/

const dirs = [
  new URL("../src/registry/", import.meta.url),
  new URL("../src/components/docs/examples/", import.meta.url),
]

for (const dir of dirs) {
  for (const name of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
    const url = new URL(name, dir)
    test(`monochrome: ${url.pathname.split("/src/")[1]}`, () => {
      const lines = readFileSync(url, "utf8").split("\n")
      lines.forEach((line, i) => {
        const where = `${name}:${i + 1}`
        assert.doesNotMatch(line, paletteClass, `hard-coded colour class at ${where}`)
        assert.doesNotMatch(line, whiteBlack, `white/black class at ${where}`)
        assert.doesNotMatch(line, literal, `literal colour at ${where}`)
      })
    })
  }
}
