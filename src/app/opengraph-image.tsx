import { ogImage, ogSize } from "@/lib/og"
import { site } from "@/lib/site"

export const dynamic = "force-static"

export const alt = site.title
export const size = ogSize
export const contentType = "image/png"

export default function Image() {
  return ogImage({ title: "Motion that lives in the browser", description: site.description })
}
