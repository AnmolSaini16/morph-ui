import type { Metadata } from "next"
import { SkillPage } from "@/components/docs/skill-page"

export const metadata: Metadata = {
  title: "Skill",
  description:
    "Teach your coding agent Morph UI: it installs components and writes view transitions the right way.",
}

export default function Page() {
  return <SkillPage />
}
