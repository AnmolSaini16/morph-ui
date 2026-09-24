import { SkillPage } from "@/components/docs/skill-page"
import { docsPages, pageMetadata } from "@/lib/site"

export const metadata = pageMetadata({ ...docsPages.skill, path: "/skill" })

export default function Page() {
  return <SkillPage />
}
