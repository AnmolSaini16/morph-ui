"use client"

import type { ReactNode } from "react"
import { CodeBlock, CopyButton } from "./code-block"

export function CodeCard({ code, file, plain }: { code: string; file?: string; plain?: boolean }) {
  return (
    <div className="rounded-2xl bg-code">
      <div className="flex items-center justify-between py-2.5 pr-2.5 pl-5">
        <p className="font-mono text-xs text-muted-foreground">{file}</p>
        <CopyButton value={code.trimEnd()} />
      </div>
      <CodeBlock code={code} plain={plain} copy={false} className="max-h-[420px] [&>pre]:pt-0" />
    </div>
  )
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] whitespace-nowrap text-foreground">
      {children}
    </code>
  )
}

export function SubHeading({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mt-12 mb-4 scroll-mt-20 text-lg font-medium tracking-tight">
      {children}
    </h2>
  )
}
