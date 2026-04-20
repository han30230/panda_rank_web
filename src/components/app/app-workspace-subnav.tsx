"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const tabs = [
  { href: "/dashboard", label: "홈", prefix: "/dashboard" },
  { href: "/analyze/keyword", label: "키워드 분석", prefix: "/analyze" },
  { href: "/content/new", label: "AI 콘텐츠", prefix: "/content", badge: "블로그" },
  { href: "/reports", label: "리포트", prefix: "/reports" },
  { href: "/workspace/new", label: "새 작업", prefix: "/workspace" },
] as const

function isTabActive(pathname: string, prefix: string, href: string) {
  if (prefix === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/")
  }
  return pathname === href || pathname.startsWith(`${prefix}/`) || pathname.startsWith(prefix + "/")
}

export function AppWorkspaceSubnav() {
  const pathname = usePathname()

  return (
    <nav
      className="border-border/60 bg-card/80 supports-[backdrop-filter]:bg-card/70 sticky top-14 z-30 border-b backdrop-blur-md md:top-0"
      aria-label="작업 공간 메뉴"
    >
      <div className="scrollbar-none flex items-stretch gap-0 overflow-x-auto px-2 sm:px-4">
        {tabs.map((tab) => {
          const active = isTabActive(pathname, tab.prefix, tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 sm:py-3",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {"badge" in tab && tab.badge ? (
                <Badge
                  variant="secondary"
                  className="h-5 border-0 bg-primary/12 px-1.5 text-[10px] font-semibold text-primary"
                >
                  {tab.badge}
                </Badge>
              ) : null}
              {active ? (
                <span
                  className="bg-primary absolute right-3 bottom-0 left-3 h-0.5 rounded-full sm:right-4 sm:left-4"
                  aria-hidden
                />
              ) : null}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
