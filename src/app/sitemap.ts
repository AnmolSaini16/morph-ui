import type { MetadataRoute } from "next"
import { entries } from "@/lib/entries"
import { site } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/getting-started", "/skill", ...entries.map((entry) => `/${entry.slug}`)]
  return paths.map((path) => ({ url: `${site.url}${path}`, lastModified: new Date() }))
}
