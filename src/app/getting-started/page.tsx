import type { Metadata } from "next"
import { GettingStartedPage } from "@/components/docs/getting-started-page"
import { getBaseCss } from "@/lib/sources"

export const metadata: Metadata = {
  title: "Getting started",
  description: "Install a component, hook up your theme, and learn the view transition classes.",
}

export default async function Page() {
  return <GettingStartedPage baseCss={await getBaseCss()} />
}
