"use client"

import { useMemo, useState } from "react"
import { Check, Copy } from "lucide-react"
import { highlight } from "sugar-high"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { SourceFile } from "@/lib/entries"

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn("text-muted-foreground", className)}
    >
      {copied ? <Check className="text-emerald-500" /> : <Copy />}
    </Button>
  )
}

const escape = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
const plainLines = (text: string) =>
  text
    .split("\n")
    .map((line) => `<span class="sh__line">${escape(line)}</span>`)
    .join("\n")

export function CodeBlock({
  code,
  className,
  copy = true,
  plain = false,
}: {
  code: string
  className?: string
  copy?: boolean
  plain?: boolean
}) {
  const source = code.trimEnd()
  const html = useMemo(() => (plain ? plainLines(source) : highlight(source)), [plain, source])

  return (
    <div className={cn("relative [timeline-scope:--code]", className)}>
      <pre className="code-lines [scroll-timeline:--code_block] h-full max-h-[inherit] [scrollbar-width:none] overflow-auto px-5 pt-2 pb-5 font-mono text-[13px] leading-[1.75] [&::-webkit-scrollbar]:hidden">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      <div
        aria-hidden
        className="code-fade-top pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-code to-transparent"
      />
      <div
        aria-hidden
        className="code-fade pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-gradient-to-t from-code to-transparent"
      />
      {copy && (
        <CopyButton value={source} className="absolute top-2 right-3 bg-code/90 backdrop-blur-sm" />
      )}
    </div>
  )
}

export function CodeTabs({ files, className }: { files: SourceFile[]; className?: string }) {
  const [active, setActive] = useState(files[0].path)
  const file = files.find((f) => f.path === active) ?? files[0]

  return (
    <Tabs value={active} onValueChange={setActive} className={cn("gap-0", className)}>
      <div className="flex items-center justify-between py-2.5 pr-3 pl-2.5">
        <TabsList className="h-8 gap-0.5 bg-transparent p-0">
          {files.map((f) => (
            <TabsTrigger
              key={f.path}
              value={f.path}
              title={f.path}
              className="h-7 flex-none rounded-md border-0 px-2.5 font-mono text-xs text-muted-foreground data-active:bg-foreground/[0.06] data-active:text-foreground data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-foreground/[0.08]"
            >
              {f.label ?? f.path.split("/").pop()}
            </TabsTrigger>
          ))}
        </TabsList>
        <CopyButton value={file.code.trimEnd()} />
      </div>
      {files.map((f) => (
        <TabsContent key={f.path} value={f.path}>
          <CodeBlock code={f.code} copy={false} className="h-[380px] [&>pre]:pt-0" />
        </TabsContent>
      ))}
    </Tabs>
  )
}
