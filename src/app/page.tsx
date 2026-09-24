import type { Metadata } from "next"
import { IntroductionPage } from "@/components/docs/introduction-page"

export const metadata: Metadata = { alternates: { canonical: "/" } }

export default function Home() {
  return <IntroductionPage />
}
