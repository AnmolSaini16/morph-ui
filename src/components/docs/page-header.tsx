import type { ReactNode } from "react"

export function PageHeader({
  title,
  description,
  children,
}: {
  title: ReactNode
  description: ReactNode
  children?: ReactNode
}) {
  return (
    <header>
      <h1 className="text-3xl leading-tight font-normal tracking-tight text-balance md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-6 text-pretty text-muted-foreground">
        {description}
      </p>
      {children}
    </header>
  )
}
