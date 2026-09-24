import { ImageResponse } from "next/og"

export const dynamic = "force-static"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
        <rect
          x="3"
          y="3"
          width="17"
          height="17"
          rx="5"
          stroke="#f0703a"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <rect x="12" y="12" width="17" height="17" rx="5" fill="#f0703a" />
      </svg>
    </div>,
    size,
  )
}
