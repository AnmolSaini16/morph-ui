"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { entries } from "@/lib/entries"
import { CodeCard, InlineCode, SubHeading } from "./content"
import { REPO } from "./github-link"
import { DocsLink } from "./navigation"
import { PageHeader } from "./page-header"

const installCommand = `npx skills add ${REPO}\n`

const knows = [
  {
    title: "Installing components",
    body: (
      <>
        Adds components and <InlineCode>morph.css</InlineCode> to your project.
      </>
    ),
  },
  {
    title: "Writing transitions",
    body: (
      <>
        Picks the right <InlineCode>vt-*</InlineCode> classes and follows the same rules.
      </>
    ),
  },
  { title: "Recipes", body: "Lists, shared elements, slides and Next.js route transitions." },
  {
    title: "Tuning",
    body: (
      <>
        Adjusts timing and easing through the <InlineCode>--vt-*</InlineCode> settings.
      </>
    ),
  },
]

const prompts = [
  "Add the Post List to my blog page.",
  "Animate this list when tasks are added or removed.",
  "Make the settings tabs slide between panels.",
  "Add page transitions to my Next.js app.",
  "Make every animation a little faster.",
]

const tree = `skills/morph-ui/
├── SKILL.md            when to use it, and the rules
├── references/
│   ├── components.md   each component's exports, classes and theme
│   ├── classes.md      the vt-* classes and settings
│   └── patterns.md     recipes
└── assets/
    ├── morph.css
    ├── theme.css       theme variables, for projects without shadcn
    ├── components/     every component, ready to copy
    └── examples/       a working example of each
`

export function SkillPage() {
  return (
    <article>
      <PageHeader
        title="Skill"
        description="Teach your coding agent Morph UI. It installs components for you and writes view transitions the right way."
      />

      <SubHeading>Installation</SubHeading>
      <CodeCard code={installCommand} file="Terminal" />
      <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
        Works with Claude Code, Cursor, Codex and other agents that support skills. Or copy the{" "}
        <InlineCode>skills/morph-ui</InlineCode> folder from the repository into{" "}
        <InlineCode>.claude/skills/</InlineCode>, or your agent&apos;s skills folder.
      </p>

      <SubHeading>What it knows</SubHeading>
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground marker:text-muted-foreground/50">
        {knows.map(({ title, body }) => (
          <li key={title}>
            <span className="font-medium text-foreground">{title}.</span> {body}
          </li>
        ))}
      </ul>

      <SubHeading>Try asking</SubHeading>
      <p className="mb-3 text-[15px] leading-7 text-muted-foreground">
        For example, you can ask your agent to:
      </p>
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 marker:text-muted-foreground/50">
        {prompts.map((prompt) => (
          <li key={prompt}>
            <em>&ldquo;{prompt}&rdquo;</em>
          </li>
        ))}
      </ul>

      <SubHeading>What&apos;s inside</SubHeading>
      <p className="mb-4 text-[15px] leading-7 text-muted-foreground">
        The skill is built from the same files as this site, so it always matches the components you
        see here. Your agent reads only what the task needs.
      </p>
      <CodeCard code={tree} file="skills/morph-ui" plain />

      <footer className="mt-14 flex justify-between border-t pt-5">
        <Button variant="ghost" asChild>
          <DocsLink href="/getting-started">
            <ArrowLeft /> Getting started
          </DocsLink>
        </Button>
        <Button variant="ghost" asChild>
          <DocsLink href={`/${entries[0].slug}`}>
            {entries[0].title} <ArrowRight />
          </DocsLink>
        </Button>
      </footer>
    </article>
  )
}
