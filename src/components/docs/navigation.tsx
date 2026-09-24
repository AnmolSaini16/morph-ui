"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createContext, useContext, useState, type ComponentProps, type ReactNode } from "react"

type Navigation = {
  selected: string
}

const NavigationContext = createContext<Navigation & { select: (href: string) => void }>({
  selected: "/",
  select: () => {},
})

export function useNavigation() {
  return useContext(NavigationContext)
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [clicked, setClicked] = useState<{ href: string; from: string } | null>(null)
  if (clicked && clicked.from !== pathname) setClicked(null)
  const selected = clicked?.from === pathname ? clicked.href : pathname

  return (
    <NavigationContext.Provider
      value={{ selected, select: (href) => setClicked({ href, from: pathname }) }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function DocsLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const { select } = useNavigation()
  return (
    <Link
      href={href}
      scroll={false}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || event.button !== 0) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        document.activeViewTransition?.skipTransition()
        document.documentElement.style.setProperty("--docs-page-offset", `${-scrollY}px`)
        select(href)
      }}
      {...props}
    />
  )
}
