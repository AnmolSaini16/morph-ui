import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }

const brand = "#f0703a"

// Satori spaces Geist's words unevenly, so the images use Inter
const inter = readFile(join(process.cwd(), "src/lib/fonts/Inter-Regular.ttf"))

export async function ogImage({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description: string
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#141414",
        color: "#fafafa",
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34 }}>
        <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
          <rect
            x="3"
            y="3"
            width="17"
            height="17"
            rx="5"
            stroke={brand}
            strokeWidth="1.75"
            strokeDasharray="3 3"
          />
          <rect x="12" y="12" width="17" height="17" rx="5" fill={brand} />
        </svg>
        Morph UI
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow && (
          <div style={{ fontSize: 30, color: "#8a8a8a", marginBottom: 20 }}>{eyebrow}</div>
        )}
        <div
          style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: "-0.035em", textWrap: "balance" }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 28,
            maxWidth: 920,
            fontSize: 34,
            lineHeight: 1.4,
            color: "#a3a3a3",
            textWrap: "balance",
          }}
        >
          {description}
        </div>
      </div>
    </div>,
    { ...ogSize, fonts: [{ name: "Inter", data: await inter, weight: 400, style: "normal" }] },
  )
}
