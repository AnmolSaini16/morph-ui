import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ComponentPage } from "@/components/docs/component-page"
import { entries } from "@/lib/entries"
import { getComponentFiles, getThemeVars, getUsage } from "@/lib/sources"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = entries.find((e) => e.slug === slug)
  return entry ? { title: entry.title, description: entry.description } : {}
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const entry = entries.find((e) => e.slug === slug)
  if (!entry) notFound()

  const files = await getComponentFiles(slug)
  return (
    <ComponentPage
      key={slug}
      entry={entry}
      files={files}
      usage={await getUsage(slug)}
      themeVars={await getThemeVars(slug)}
    />
  )
}
