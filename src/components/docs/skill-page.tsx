"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { entries } from "@/lib/entries"
import { CodeCard, InlineCode, SubHeading } from "./content"
import { REPO } from "./github-link"
import { DocsLink } from "./navigation"
import { PageHeader } from "./page-header"

const installCommand = `npx skills add ${REPO}\n`

const knows = [
  [
    "Installing components",
    "Checks for React 19.3 and your theme, puts files where your project keeps them, and adds morph.css once.",
  ],
  [
    "Writing transitions",
    "Picks the right vt-* classes and follows the same rules as these components: clicks never wait, controls stay live, heights stay fixed.",
  ],
  [
    "Recipes",
    "Lists, shared elements, directional slides, number rolls, and route transitions in Next.js.",
  ],
  ["Tuning", "Changes timings and curves through the --vt-* settings, without editing morph.css."],
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
      <Card className="gap-0 divide-y py-0">
        {knows.map(([title, body]) => (
          <p key={title} className="px-4 py-3 text-sm">
            <span className="font-medium">{title}.</span>{" "}
            <span className="text-muted-foreground">{body}</span>
          </p>
        ))}
      </Card>

      <SubHeading>Try asking</SubHeading>
      <ul className="space-y-2">
        {prompts.map((prompt) => (
          <li
            key={prompt}
            className="rounded-lg bg-muted px-3 py-2 font-mono text-[12px] text-foreground"
          >
            {prompt}
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
