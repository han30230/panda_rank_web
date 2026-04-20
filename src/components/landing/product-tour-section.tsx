"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, LayoutDashboard, PenLine, Search } from "lucide-react"

import { MarketingSection } from "@/components/layout/marketing-section"
import { SectionHeader } from "@/components/layout/section-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const panes = [
  {
    id: "analyze",
    label: "키워드 분석",
    icon: Search,
    headline: "의도·연관어·갭을 한 번에",
    bullets: ["검색 의도 태그", "연관 토픽 클러스터", "헤딩 갭 하이라이트"],
    preview: (
      <div className="space-y-3 text-left text-sm">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="rounded-full font-normal">
            정보형
          </Badge>
          <Badge variant="outline" className="rounded-full font-normal">
            롱테일
          </Badge>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground">
          상위 10개 URL · 스니펫 패턴 요약
        </div>
        <ul className="space-y-2 text-[13px] leading-relaxed text-foreground">
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            H2에 &lsquo;비교&rsquo;·&lsquo;가격&rsquo; 언급이 부족합니다
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            FAQ 스키마 후보 2개
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "content",
    label: "콘텐츠 스튜디오",
    icon: PenLine,
    headline: "초안·메타·버전을 같이 관리",
    bullets: ["톤·길이 프리셋", "버전 비교", "메타·OG 한 세트"],
    preview: (
      <div className="space-y-3 text-left text-sm">
        <div className="rounded-lg border border-dashed border-border/80 bg-background/80 px-3 py-6 text-center text-muted-foreground">
          <p className="text-[13px] leading-relaxed">
            제목 후보 3 · 본문 개요 · CTA 문장이 생성됩니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="rounded-full">v2</Badge>
          <Badge variant="outline" className="rounded-full font-normal">
            v1 대비 짧게
          </Badge>
        </div>
      </div>
    ),
  },
  {
    id: "report",
    label: "리포트·내보내기",
    icon: LayoutDashboard,
    headline: "팀이 읽기 좋은 요약",
    bullets: ["공유 링크", "요약 카드", "다음 액션 체크"],
    preview: (
      <div className="space-y-3 text-left text-sm">
        <Card className="border-border/70 p-4 shadow-none">
          <p className="text-xs font-medium text-muted-foreground">이번 스프린트</p>
          <p className="mt-2 text-[15px] font-semibold leading-snug">
            핵심 키워드 4건 · 초안 12 · 게시 5
          </p>
        </Card>
        <div className="flex flex-wrap gap-2">
          {["PDF", "슬랙 공유", "이메일"].map((x) => (
            <Badge key={x} variant="secondary" className="rounded-full font-normal">
              {x}
            </Badge>
          ))}
        </div>
      </div>
    ),
  },
] as const

type PaneId = (typeof panes)[number]["id"]

export function ProductTourSection() {
  const [active, setActive] = useState<PaneId>(panes[0].id)

  const current = panes.find((p) => p.id === active) ?? panes[0]

  return (
    <MarketingSection>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeader
            align="start"
            eyebrow="제품 둘러보기"
            title="대시보드 안에서 끝나는 키워드·콘텐츠 루프"
            description="분석 결과를 바로 초안과 체크리스트로 이어 저장합니다. 별도 툴을 오갈 필요 없이 한 워크스페이스에서 버전과 리포트를 유지합니다."
          />
          <ul className="text-muted-foreground mt-8 space-y-3 text-sm leading-relaxed">
            {current.bullets.map((line) => (
              <li key={line} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
          <Button className="mt-8 h-11 rounded-full px-7 font-medium" variant="outline" asChild>
            <Link href="/dashboard">무료로 시작</Link>
          </Button>
        </div>

        <Card className="surface-card overflow-hidden rounded-[1.25rem] border-border/70 p-1 shadow-lg shadow-foreground/5">
          <div
            className="flex gap-1 rounded-[1.05rem] bg-muted/40 p-1"
            role="tablist"
            aria-label="제품 화면 선택"
          >
            {panes.map((p) => {
              const Icon = p.icon
              const selected = p.id === active
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(p.id)}
                  className={cn(
                    "flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-center text-xs font-medium transition-colors md:text-[13px]",
                    selected
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
              )
            })}
          </div>
          <div className="p-6 md:p-8" role="tabpanel">
            <p className="text-primary text-xs font-semibold uppercase tracking-wider">
              {current.label}
            </p>
            <h3 className="text-title-sm mt-2">{current.headline}</h3>
            <div className="mt-6">{current.preview}</div>
          </div>
        </Card>
      </div>
    </MarketingSection>
  )
}
