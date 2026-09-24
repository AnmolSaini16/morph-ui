import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  // Keep the dev badge clear of the sidebar footer
  devIndicators: { position: "bottom-right" },
}

export default nextConfig
