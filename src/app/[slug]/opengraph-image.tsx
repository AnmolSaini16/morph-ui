import { entries } from "@/lib/entries"
import { ogImage, ogSize } from "@/lib/og"

export const alt = "Morph UI component"
export const size = ogSize
export const contentType = "image/png"

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = entries.find((e) => e.slug === slug)
  return ogImage({
    eyebrow: entry?.category,
    title: entry?.title ?? "Morph UI",
    description: entry?.description ?? "",
  })
}
