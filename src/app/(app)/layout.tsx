import type { Metadata } from "next"

import { AppSidebar } from "@/components/app/app-sidebar"
import { siteConfig } from "@/lib/site-config"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export const metadata: Metadata = {
  title: "대시보드",
  description: `${siteConfig.name} 작업 공간`,
  robots: { index: false, follow: false },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-[calc(100dvh-0px)]">
      <AppSidebar className="hidden md:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-border/60 flex h-14 items-center gap-2 border-b px-3 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-sm" aria-label="메뉴 열기">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <AppSidebar className="flex w-full border-0" />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">{siteConfig.name}</span>
        </div>
        {children}
      </div>
    </div>
  )
}
