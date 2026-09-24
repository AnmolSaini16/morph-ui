import "server-only"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { getComponentCss } from "./component-css"
import type { SourceFile } from "./entries"
import { themeVarsIn } from "./theme-vars"

const read = (file: string) => readFile(path.join(process.cwd(), "src", file), "utf8")

export async function getComponentFiles(slug: string): Promise<SourceFile[]> {
  const [component, css] = await Promise.all([
    read(`registry/${slug}.tsx`),
    read("registry/morph.css"),
  ])
  return [
    { path: `components/${slug}.tsx`, label: "Component", code: component },
    { path: `${slug}.css`, label: "CSS", code: getComponentCss(css, slug) },
  ]
}

export async function getThemeVars(slug: string): Promise<string[]> {
  const [component, files] = await Promise.all([
    read(`registry/${slug}.tsx`),
    getComponentFiles(slug),
  ])
  return themeVarsIn(component, files.find((file) => file.label === "CSS")?.code ?? "")
}

export async function getUsage(slug: string): Promise<string> {
  return (await read(`components/docs/examples/${slug}.tsx`)).replaceAll(
    "@/registry/",
    "@/components/",
  )
}

export async function getBaseCss(): Promise<SourceFile> {
  return { path: "morph.css", code: await read("registry/morph.css") }
}
