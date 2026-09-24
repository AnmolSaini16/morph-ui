"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { GitHubLink, X_URL } from "./github-link"
import { Logo } from "./logo"
import { categories, entries } from "@/lib/entries"
import { DocsLink, useNavigation } from "./navigation"
import { ThemeToggle } from "./theme-toggle"

const linkClass =
  "h-auto px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground active:bg-muted active:text-foreground data-active:bg-muted data-active:font-normal data-active:text-foreground"

export function AppSidebar() {
  const { selected } = useNavigation()
  const { setOpenMobile } = useSidebar()
  const close = () => setOpenMobile(false)

  const link = (href: string, label: string, active: boolean) => (
    <SidebarMenuItem key={href}>
      <SidebarMenuButton asChild isActive={active} className={linkClass}>
        <DocsLink href={href} onClick={close}>
          {label}
        </DocsLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="px-3 pt-5 pb-0">
        <DocsLink href="/" onClick={close} className="flex items-center gap-2 px-2.5">
          <Logo className="size-5" />
          <span className="text-sm font-medium tracking-tight">Morph UI</span>
        </DocsLink>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-1 pt-6">
        <SidebarGroup className="py-0">
          <SidebarMenu className="gap-0.5">
            {link("/", "Introduction", selected === "/")}
            {link("/getting-started", "Getting started", selected === "/getting-started")}
            {link("/skill", "Skill", selected === "/skill")}
          </SidebarMenu>
        </SidebarGroup>

        {categories.map((category) => (
          <SidebarGroup key={category} className="pt-5 pb-0">
            <SidebarGroupLabel className="h-auto px-2.5 pb-1 font-normal text-muted-foreground/70">
              {category}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
              {entries
                .filter((e) => e.category === category)
                .map((e) => link(`/${e.slug}`, e.title, selected === `/${e.slug}`))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="mx-3 flex-row items-center justify-between gap-2 border-t px-1 pt-4 pb-5">
        <p className="min-w-0 truncate pl-1 text-xs text-muted-foreground">
          Created by{" "}
          <a
            href={X_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Anmol
          </a>
        </p>
        <div className="flex shrink-0 gap-0.5 items-center">
          <GitHubLink />
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function MobileNav() {
  const { selected } = useNavigation()
  const links = [
    { slug: "", title: "Introduction" },
    { slug: "getting-started", title: "Getting started" },
    { slug: "skill", title: "Skill" },
    ...entries,
  ]

  return (
    <header className="sticky top-0 z-20 border-b bg-sidebar/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <DocsLink href="/" className="flex items-center gap-2">
          <Logo className="size-5" />
          <span className="text-sm font-medium tracking-tight">Morph UI</span>
        </DocsLink>
        <div className="flex items-center gap-1.5">
          <GitHubLink />
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex [scrollbar-width:none] gap-1 overflow-x-auto px-3 pb-2.5 [&::-webkit-scrollbar]:hidden">
        {links.map((link) => {
          const active = selected === `/${link.slug}`
          return (
            <DocsLink
              key={link.slug}
              href={`/${link.slug}`}
              aria-current={active ? "page" : undefined}
              ref={(el) => {
                if (active) el?.scrollIntoView({ block: "nearest", inline: "center" })
              }}
              className={
                "shrink-0 rounded-md px-2.5 py-1 text-[13px] transition-colors " +
                (active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {link.title}
            </DocsLink>
          )
        })}
      </nav>
    </header>
  )
}
