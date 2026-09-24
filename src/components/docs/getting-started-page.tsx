"use client"

import { Card } from "@/components/ui/card"
import { CodeCard, InlineCode, SubHeading } from "./content"
import type { SourceFile } from "@/lib/entries"
import { classGroups, skipOnScrollCode, themeCss } from "@/lib/reference"
import { DocsLink } from "./navigation"
import { PageHeader } from "./page-header"

const steps = [
  [
    "Wrap",
    "Put <ViewTransition> around what should animate, with a class for each kind of change.",
  ],
  [
    "Update",
    "Change state inside startTransition. addTransitionType tags direction, like next or back.",
  ],
  [
    "Animate",
    "The browser snapshots before and after. The motion lives in CSS, keyed by those classes.",
  ],
]

const settingsExample = `:root {
  --vt-move: 300ms;
  --vt-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
}
`

const importExample = `@import "tailwindcss";
@import "./morph.css";
`

const usage = `import { addTransitionType, startTransition, ViewTransition } from "react"

// Mark what animates, and which class each kind of change gets
<ViewTransition update={{ "step-next": "vt-slide vt-forward", "step-back": "vt-slide vt-back", default: "none" }}>
  <div>{step.title}</div>
</ViewTransition>

// Animate a change by making it a transition
document.activeViewTransition?.skipTransition()
startTransition(() => {
  addTransitionType("step-next")
  setStep((s) => s + 1)
})
`

export function GettingStartedPage({ baseCss }: { baseCss: SourceFile }) {
  return (
    <article>
      <PageHeader
        title="Getting started"
        description="Every component is one React file plus a little CSS. Copy both into your project; there are no packages to install."
      />

      <SubHeading>Requirements</SubHeading>
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground marker:text-muted-foreground/50">
        <li>
          React 19.3+ for <InlineCode>&lt;ViewTransition&gt;</InlineCode>, and Tailwind CSS v4.
        </li>
        <li>
          Foundational tailwind{" "}
          <a href="#theme" className="underline underline-offset-4">
            theme variables
          </a>{" "}
          for colors, like <InlineCode>--color-card</InlineCode>. shadcn projects already have them.
        </li>
        <li>
          A browser with view transition types and classes: current Chrome, Edge, Safari and
          Firefox. Elsewhere everything works, without the animation.
        </li>
      </ul>

      <SubHeading>Installation</SubHeading>
      <ol className="space-y-3">
        {[
          <>
            <span className="font-medium">Add the base CSS.</span> Import{" "}
            <a href="#base" className="underline underline-offset-4">
              morph.css
            </a>{" "}
            once, after Tailwind. No shadcn? Add the{" "}
            <a href="#theme" className="underline underline-offset-4">
              theme variables
            </a>{" "}
            too.
          </>,
          <>
            <span className="font-medium">Copy a component.</span> Its{" "}
            <InlineCode>Component</InlineCode> tab goes in <InlineCode>components/</InlineCode>.
          </>,
          <>
            <span className="font-medium">Use it.</span> Start from its{" "}
            <InlineCode>Usage</InlineCode> tab.
          </>,
        ].map((text, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-7">
            <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-muted font-mono leading-none text-[11px] text-muted-foreground">
              {i + 1}
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
        Using an AI agent? Try the{" "}
        <DocsLink href="/skill" className="text-foreground underline underline-offset-4">
          Morph UI skill
        </DocsLink>
        .
      </p>

      <SubHeading>How it works</SubHeading>
      <Card className="mb-6 gap-0 divide-y py-0">
        {steps.map(([title, body], i) => (
          <div key={title} className="flex gap-4 px-4 py-3 text-sm">
            <span className="font-mono text-xs leading-5 text-muted-foreground">{i + 1}</span>
            <p>
              <span className="font-medium">{title}.</span>{" "}
              <span className="text-muted-foreground">{body}</span>
            </p>
          </div>
        ))}
      </Card>

      <p className="mb-4 text-[15px] leading-7 text-muted-foreground">
        React names the snapshots and schedules the browser transition, so components never collide.
        Anything that must stay clickable mid-animation sits outside the boundary.
      </p>
      <CodeCard code={usage} file="example.tsx" />

      <SubHeading id="base">Base CSS</SubHeading>
      <p className="mb-4 text-[15px] leading-7 text-muted-foreground">
        <InlineCode>morph.css</InlineCode> holds every component&apos;s motion. Add it once;
        components need nothing else.
      </p>
      <CodeCard code={importExample} file="globals.css" />
      <p className="mt-4 mb-4 text-[15px] leading-7 text-muted-foreground">
        Its only rule on your root, <InlineCode>view-transition-name: none</InlineCode>, keeps the
        page clickable while things animate. Need just one component? Use its{" "}
        <InlineCode>CSS</InlineCode> tab instead.
      </p>
      <CodeCard code={baseCss.code} file={baseCss.path} />

      <SubHeading id="theme">Your theme</SubHeading>
      <p className="mb-4 text-[15px] leading-7 text-muted-foreground">
        Components ship no colors. They use shadcn&apos;s variable names, like{" "}
        <InlineCode>--card</InlineCode> and <InlineCode>--muted-foreground</InlineCode>, so they
        pick up your theme and dark mode as they are. Each component page lists the ones it reads.
      </p>
      <p className="mb-4 text-[15px] leading-7 text-muted-foreground">
        Using shadcn? Skip this, you already have them. If not, add these to your{" "}
        <InlineCode>globals.css</InlineCode> once, after{" "}
        <InlineCode>@import &quot;tailwindcss&quot;</InlineCode>, and change the values to your own.
      </p>
      <CodeCard code={themeCss} file="globals.css" />

      <SubHeading id="settings">Settings</SubHeading>
      <p className="mb-4 text-[15px] leading-7 text-muted-foreground">
        Every timing and curve is written with its default, like{" "}
        <InlineCode>var(--vt-move, 420ms)</InlineCode>, so nothing is added to your{" "}
        <InlineCode>:root</InlineCode>. Set any of them anywhere in your CSS, in any order. The full
        list is at the top of <InlineCode>morph.css</InlineCode>.
      </p>
      <CodeCard code={settingsExample} file="globals.css" />

      <SubHeading id="scrolling">Scrolling mid-animation</SubHeading>
      <p className="mb-4 text-[15px] leading-7 text-muted-foreground">
        While a component animates, the browser draws snapshots pinned to the screen. If the page
        scrolls during that moment, the animating content seems to drift with the scroll. Add this
        once, anywhere in your layout, to finish the animation as soon as anything scrolls.
      </p>
      <CodeCard code={skipOnScrollCode} file="components/skip-on-scroll.tsx" />

      <SubHeading>Classes</SubHeading>
      <p className="mb-4 text-[15px] leading-7 text-muted-foreground">
        Give them to <InlineCode>&lt;ViewTransition&gt;</InlineCode> and combine them, like{" "}
        <InlineCode>update=&quot;vt-move vt-shell&quot;</InlineCode>. Direction classes pair with{" "}
        <InlineCode>addTransitionType</InlineCode>. Your own components can use them too.
      </p>
      <Card className="gap-0 divide-y py-0 text-sm">
        {classGroups.map(([group, rows]) => (
          <div key={group} className="grid gap-x-4 px-4 py-3 sm:grid-cols-[6rem_1fr]">
            <p className="pb-2 text-xs text-muted-foreground sm:pt-0.5 sm:pb-0">{group}</p>
            <dl className="grid gap-y-1.5">
              {rows.map(([name, body]) => (
                <div key={name} className="grid gap-x-3 gap-y-0.5 sm:grid-cols-[10rem_1fr]">
                  <dt className="font-mono text-xs leading-5">{name}</dt>
                  <dd className="text-muted-foreground">{body}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </Card>
    </article>
  )
}
