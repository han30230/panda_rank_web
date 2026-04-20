import Link from "next/link"
import { Bell, Search } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

type AppHeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
}

/**
 * 앱 상단 바 — 페이지 제목 위계를 고정하고, 우측은 보조 액션만 둡니다.
 */
export function AppHeader({ title, description, action }: AppHeaderProps) {
  return (
    <header className="border-border/70 bg-background/92 flex h-[3.75rem] shrink-0 items-center justify-between gap-4 border-b px-4 shadow-[0_1px_0_oklch(0.48_0.11_188/0.06)] backdrop-blur-md md:px-6">
      <div className="min-w-0">
        <h1 className="text-foreground truncate text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground hidden text-[13px] leading-snug sm:block md:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        {action ? <div className="mr-1 flex items-center">{action}</div> : null}
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/dashboard" aria-label="검색">
            <Search className="size-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="알림">
          <Bell className="size-4" />
        </Button>
        <Avatar className="size-8 border border-border/60">
          <AvatarFallback className="text-xs font-medium">ME</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
