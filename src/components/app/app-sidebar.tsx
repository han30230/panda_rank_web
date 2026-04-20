"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  FileEdit,
  FileText,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ScanSearch,
  Settings,
} from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const nav = [
  { href: "/dashboard", label: "홈", icon: LayoutDashboard },
  { href: "/workspace/new", label: "새 작업", icon: PlusCircle },
  { href: "/analyze/keyword", label: "키워드 분석", icon: ScanSearch },
  { href: "/content/new", label: "콘텐츠 작성", icon: FileEdit },
  { href: "/reports", label: "리포트", icon: FileText },
]

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside
      className={cn(
        "border-border/60 bg-sidebar text-sidebar-foreground flex w-60 shrink-0 flex-col border-r",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2 px-4">
        <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-9 items-center justify-center rounded-xl">
          <BarChart3 className="size-4" />
        </span>
        <span className="font-semibold tracking-tight">{siteConfig.name}</span>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const active =
              item.href === "/reports"
                ? pathname.startsWith("/reports")
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)
            return (
              <Button
                key={item.href}
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 rounded-lg",
                  active && "bg-sidebar-accent font-medium",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="p-2">
        {user ? (
          <p className="text-muted-foreground mb-2 truncate px-2 text-xs font-medium" title={user.email}>
            {user.email}
          </p>
        ) : null}
        <Button variant="ghost" className="w-full justify-start gap-2 rounded-lg" asChild>
          <Link href="/settings/billing">
            <Settings className="size-4" />
            설정
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="mt-1 w-full justify-start gap-2 rounded-lg text-destructive hover:text-destructive"
          type="button"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          로그아웃
        </Button>
        <Button variant="outline" className="mt-2 w-full rounded-lg" size="sm" asChild>
          <Link href="/">랜딩으로</Link>
        </Button>
      </div>
    </aside>
  )
}
