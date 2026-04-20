import type { Metadata } from "next"
import Link from "next/link"
import { BarChart3 } from "lucide-react"

import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "온보딩",
  description: `${siteConfig.name}를 내 워크플로우에 맞게 설정합니다.`,
  robots: { index: false, follow: false },
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <header className="border-border/60 flex h-14 items-center justify-between border-b px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl">
            <BarChart3 className="size-4" />
          </span>
          {siteConfig.name}
        </Link>
        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
          <Link href="/dashboard">건너뛰기</Link>
        </Button>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
