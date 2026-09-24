import type { Metadata } from "next"

export const site = {
  name: "Morph UI",
  title: "Morph UI — View Transition components",
  description:
    "Animated React components you copy and paste, built on the View Transition API. No animation library.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: { name: "Anmol", url: "https://x.com/anmold_s" },
  x: "@anmold_s",
}

export const docsPages = {
  "getting-started": {
    title: "Getting started",
    description: "Install a component, hook up your theme, and learn the view transition classes.",
  },
  skill: {
    title: "Skill",
    description:
      "Teach your coding agent Morph UI: it installs components and writes view transitions the right way.",
  },
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const fullTitle = `${title} — ${site.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: fullTitle,
      description,
      url: path,
    },
    twitter: { card: "summary_large_image", creator: site.x, title: fullTitle, description },
  }
}
