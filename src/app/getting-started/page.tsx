import { GettingStartedPage } from "@/components/docs/getting-started-page"
import { docsPages, pageMetadata } from "@/lib/site"
import { getBaseCss } from "@/lib/sources"

export const metadata = pageMetadata({ ...docsPages["getting-started"], path: "/getting-started" })

export default async function Page() {
  return <GettingStartedPage baseCss={await getBaseCss()} />
}
