"use client"

import type { CSSProperties, ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar, MobileNav } from "./app-sidebar"
import { NavigationProvider } from "./navigation"
import { PageTransition } from "./page-transition"
import { SkipOnScroll } from "./skip-on-scroll"

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <NavigationProvider>
      <SkipOnScroll />
      <TooltipProvider>
        <SidebarProvider style={{ "--sidebar-width": "15rem" } as CSSProperties}>
          <AppSidebar />
          <SidebarInset>
            <MobileNav />
            <div
              data-docs-page
              className="mx-auto w-full max-w-[720px] px-5 py-12 has-[[data-wide]]:max-w-[1760px] md:px-10 md:py-20"
            >
              <PageTransition>{children}</PageTransition>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </NavigationProvider>
  )
}
