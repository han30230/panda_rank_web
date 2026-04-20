import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { PANDA_GREEN } from "@/lib/pandarank-theme"

/** 판다랭크 /chat/tool/… 상단 바 느낌 — 도구 맥락·뒤로가기 */
export default function ChatToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-border/60 bg-background/95 supports-[backdrop-filter]:bg-background/80 flex h-11 shrink-0 items-center gap-2 border-b px-3 text-sm backdrop-blur md:px-4">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden />
          홈
        </Link>
        <span className="text-muted-foreground/80" aria-hidden>
          /
        </span>
        <span className="font-medium" style={{ color: PANDA_GREEN }}>
          판다 AI 도구
        </span>
      </div>
      {children}
    </div>
  )
}
