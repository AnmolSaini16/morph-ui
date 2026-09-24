import { ogImage, ogSize } from "@/lib/og"
import { docsPages } from "@/lib/site"

export const alt = "The Morph UI agent skill"
export const size = ogSize
export const contentType = "image/png"

export default function Image() {
  return ogImage({ eyebrow: "Docs", ...docsPages["skill"] })
}
