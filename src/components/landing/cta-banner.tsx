import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaBanner() {
  return (
    <section className="section-y-tight pb-[var(--section-py)]">
      <div className="marketing-container">
        <div className="surface-card relative overflow-hidden rounded-[1.5rem] border-primary/20 bg-gradient-to-br from-primary/[0.07] via-background to-muted/30 px-8 py-12 md:px-14 md:py-16">
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-title-sm md:text-3xl">오늘 바로 첫 리포트를 만들어 보세요</h2>
              <p className="text-lead mt-3">
                가입 후 온보딩에서 목표만 고르면 대시보드가 추천 작업을 채워 줍니다.
              </p>
            </div>
            <div className="flex w-full flex-wrap gap-3 sm:w-auto sm:justify-end">
              <Button
                size="lg"
                className="h-12 rounded-full px-9 font-semibold shadow-[0_4px_18px_-2px_oklch(0.52_0.12_175/0.45)]"
                asChild
              >
                <Link href="/signup">
                  7일 무료 시작
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border/80 bg-background/95 px-7"
                asChild
              >
                <Link href="/pricing">플랜 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
