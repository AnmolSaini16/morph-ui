"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { entries } from "@/lib/entries"
import { Demo } from "./demos"
import { InlineCode } from "./content"
import { REPO } from "./github-link"
import { DocsLink } from "./navigation"
import { PageHeader } from "./page-header"

const prompt = `Set up Morph UI in this project: copy-paste React components animated with React's <ViewTransition> and one small CSS file, no animation library.

1. Install the Morph UI agent skill: npx skills add ${REPO}
2. Check the project uses React 19.3 or later, and upgrade React if it doesn't.
3. Add morph.css from the skill to the global stylesheet, after Tailwind.
4. Show me the components the skill offers and ask which one to install first.`

function CopyPrompt() {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await navigator.clipboard.writeText(prompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? "Copied" : "Copy prompt"}
    </Button>
  )
}

export function IntroductionPage() {
  return (
    <article data-wide className="@container">
      <div className="mx-auto max-w-[640px]">
        <PageHeader
          title="Motion that lives in the browser"
          description={
            <>
              Animated React components you copy and paste, built on the View Transition API and
              React&apos;s <InlineCode>&lt;ViewTransition&gt;</InlineCode>. No animation library,
              just React 19.3 and a little CSS.
            </>
          }
        >
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <DocsLink href="/getting-started">Get started</DocsLink>
            </Button>
            <CopyPrompt />
          </div>
        </PageHeader>
      </div>

      <div className="mx-auto mt-12 grid max-w-[68rem] grid-cols-1 gap-5 @3xl:grid-cols-2 @[96rem]:max-w-none @[96rem]:grid-cols-3">
        {entries.map((entry) => (
          <section
            key={entry.slug}
            aria-labelledby={`${entry.slug}-title`}
            className="flex min-w-0 flex-col rounded-2xl bg-code ring-[0.5px] ring-foreground/10 transition-colors has-[a:hover]:bg-code-hover"
          >
            <div className="flex h-[34rem] items-center justify-center rounded-2xl bg-background px-5 py-8 ring-[0.5px] ring-foreground/10">
              <Demo slug={entry.slug} />
            </div>
            <DocsLink
              href={`/${entry.slug}`}
              className="block rounded-b-2xl px-5 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <h2 id={`${entry.slug}-title`} className="text-sm font-medium">
                {entry.title}
              </h2>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{entry.description}</p>
            </DocsLink>
          </section>
        ))}
      </div>
    </article>
  )
}
