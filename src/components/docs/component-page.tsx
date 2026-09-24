"use client"

import { Fragment } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CodeTabs } from "./code-block"
import { CodeCard, InlineCode, SubHeading } from "./content"
import { Demo } from "./demos"
import { entries, type Entry, type SourceFile } from "@/lib/entries"
import { routeTransitionCode } from "@/lib/reference"
import { DocsLink } from "./navigation"
import { PageHeader } from "./page-header"

const explanations: Record<string, string> = {
  "post-list":
    "Matching names pair each post’s surface, cover, and title with the open article. Shared boundaries animate their geometry; text keeps its natural size while the surrounding card grows.",
  "dynamic-island":
    "An outer boundary animates the pill’s size and paints its surface. Both boundaries use the same spring easing; content scales gently into view through the expanding shell. The example pins the island to the top of a fixed-height stage so it expands down and out without moving the controls. Nested clipping keeps content inside the changing pill.",
  "morphing-popover":
    "The button and the panel share one name, keyed so React swaps one for the other, which pairs them into one surface that changes shape. vt-expand paints the surface on the group, so its corners never stretch, and crossfades the contents. The label has its own name and glides from the button into the panel's title. It opens at the pace of Post List's card, a surface changing shape like a small modal, and closes faster: a close transition type maps to vt-quick, since dismissing should snap. Escape closes it instantly, since shortcuts shouldn't animate.",
  "morph-dialog":
    "The trigger and the panel share one name, so React pairs them into one surface that grows from the card into the dialog and shrinks back. The panel sits in a native <dialog>, opened with showModal(), which gives you the top layer, focus trapping and an inert page for free. The dialog itself is the backdrop: it's never captured, so plain CSS fades it in and out while the panel morphs above it. Closing snaps faster with vt-quick; Escape closes it instantly. Outside clicks are checked against the panel's box, so a click on the panel mid-morph never closes it.",
  "number-flip":
    "Each digit has a stable key based on its position from the right. Changed digits roll a full line in the direction of the value change. They start immediately; enable stagger for a short carry effect on slower updates.",
  "animated-list":
    "Stable item keys let React match rows before and after a reorder. Existing rows move to their new positions; only inserted or removed rows receive the presence animation.",
  "photo-grid":
    "Stable photo keys preserve identity across shuffles. Added and removed photos scale and fade, while the rest move to their new spots with the same bounce curve.",
  tabs: "The underline is one named boundary rendered inside whichever tab is active. Moving it to another tab pairs the old and new underline, so it glides and stretches between them. The click adds a next or previous transition type, and the panel slides in that direction.",
  "list-switcher":
    "Each repository keeps the same boundaries in both layouts. The surface resizes while nested names and stats move independently; a fixed scroll area keeps the surrounding page still.",
  carousel:
    "The click adds a next or previous transition type. CSS slides the two snapshots in that direction and clips their travel to the card’s footprint; controls remain outside the snapshot. Arrow keys switch instantly, without the slide.",
  "step-wizard":
    "Next and Back select directional CSS through addTransitionType. Only the step content is captured, leaving the progress indicator and buttons interactive.",
  "stack-navigator":
    "Push moves a new screen over the old one; Pop reverses their roles with separate exit easing. The header and conversation travel as one screen inside a fixed frame. Back sits inside the chat header: its icon travels with the screen, while a live button outside the captured boundary can interrupt a slide.",
  "page-transition":
    "Three effects. crossfade, the default: a persistent boundary with the browser's own transition. blur: the same boundary, crossfading old and new with a short blur. stagger: each section gets its own boundary keyed by page, so the old sections fade out together and the new ones rise in one by one through vt-delay-*. For route navigation, use the recipe below, keyed by the URL.",
}

const list = (items: string[]) =>
  items.map((item, i) => (
    <Fragment key={item}>
      {i > 0 && ", "}
      <span className="whitespace-nowrap">{item}</span>
    </Fragment>
  ))

const step = "flex gap-3 text-[15px] leading-7"
const stepNumber =
  "mt-1 grid size-5 shrink-0 place-items-center leading-none rounded-full bg-muted font-mono text-[11px] text-muted-foreground"

export function ComponentPage({
  entry,
  files,
  usage,
  themeVars,
}: {
  entry: Entry
  files: SourceFile[]
  usage: string
  themeVars: string[]
}) {
  const index = entries.findIndex((e) => e.slug === entry.slug)
  const prev = entries[index - 1]
  const next = entries[index + 1]

  return (
    <article>
      <PageHeader title={entry.title} description={entry.description} />

      <div className="mt-8 rounded-2xl bg-code md:mt-10 ring-[0.5px] ring-foreground/10">
        <Card className="min-h-[400px] items-center justify-center rounded-2xl bg-background px-6 py-12 ring-[0.5px] ring-foreground/10 shadow-none">
          <Demo slug={entry.slug} />
        </Card>
        <CodeTabs
          files={[...files, { path: `${entry.slug}-demo.tsx`, label: "Usage", code: usage }]}
        />
      </div>
      <SubHeading>Installation</SubHeading>
      <ol className="space-y-3">
        {[
          <>
            Copy the <InlineCode>Component</InlineCode> tab into{" "}
            <InlineCode>components/{entry.slug}.tsx</InlineCode>.
          </>,
          <>
            Paste the <InlineCode>CSS</InlineCode> tab into <InlineCode>globals.css</InlineCode>,
            after Tailwind.
          </>,
        ].map((text, i) => (
          <li key={i} className={step}>
            <span className={stepNumber}>{i + 1}</span>
            <span>{text}</span>
          </li>
        ))}
      </ol>

      <SubHeading>How it works</SubHeading>
      <p className="text-[15px] leading-7 text-muted-foreground">{explanations[entry.slug]}</p>

      {entry.slug === "page-transition" && (
        <>
          <SubHeading>Route changes in Next.js</SubHeading>
          <p className="mb-4 text-[15px] leading-7 text-muted-foreground">
            This component swaps views inside one page. To blur between routes instead, wrap your
            layout&apos;s <InlineCode>{"{children}"}</InlineCode> in a{" "}
            <InlineCode>&lt;ViewTransition&gt;</InlineCode> keyed by the URL. The key makes every
            route change animate, nested ones included. Next.js runs navigations as transitions, so
            links animate with no extra code, and <InlineCode>vt-blur</InlineCode> is already in{" "}
            <InlineCode>morph.css</InlineCode>.
          </p>
          <CodeCard code={routeTransitionCode} file="components/route-transition.tsx" />
        </>
      )}

      <dl className="mt-12 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px] leading-6 text-muted-foreground">
        <dt>Uses</dt>
        <dd className="font-mono text-foreground">{list(entry.uses)}</dd>
        {themeVars.length > 0 && (
          <>
            <dt>Theme</dt>
            <dd className="font-mono text-foreground">{list(themeVars)}</dd>
          </>
        )}
      </dl>

      <footer className="mt-14 flex justify-between border-t pt-5">
        <Button variant="ghost" asChild>
          <DocsLink href={prev ? `/${prev.slug}` : "/skill"}>
            <ArrowLeft /> {prev ? prev.title : "Skill"}
          </DocsLink>
        </Button>
        {next && (
          <Button variant="ghost" asChild>
            <DocsLink href={`/${next.slug}`}>
              {next.title} <ArrowRight />
            </DocsLink>
          </Button>
        )}
      </footer>
    </article>
  )
}
