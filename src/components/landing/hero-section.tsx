"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Search } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const sampleTrends = [
  { label: "연말 선물 세트", hot: true },
  { label: "로컬 맛집 후기", hot: false },
  { label: "재택 근무 생산성", hot: false },
]

export function HeroSection() {
  const router = useRouter()
  const [mode, setMode] = useState<"creator" | "seller">("creator")
  const [query, setQuery] = useState("")

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/signup?intent=analyze&q=${encodeURIComponent(q)}`)
  }

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.52_0.12_175/0.12),transparent)]"
        aria-hidden
      />
      <div className="marketing-container pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-eyebrow">SEO · AI 콘텐츠 · 운영 워크스페이스</p>
          <h1 className="text-display mx-auto mt-5 max-w-[22ch] sm:max-w-none">
            네이버형 콘텐츠에 맞춘
            <br className="hidden sm:block" /> 키워드·SEO·초안 워크스페이스
          </h1>
          <p className="text-lead mx-auto mt-6 max-w-2xl text-balance">
            블로그·지식iN·상품 설명까지, 한국어 검색 맥락에 맞춰 의도 → 점수 → 초안까지 한
            화면에서 이어 갑니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="h-12 rounded-full px-9 text-base font-semibold shadow-[0_4px_16px_-2px_oklch(0.52_0.12_175/0.4)]"
              asChild
            >
              <Link href="/signup">
                7일 무료로 시작
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 rounded-full border-border/90 bg-background px-7" asChild>
              <Link href="/pricing">플랜 비교</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:mt-20 lg:grid-cols-12 lg:items-start lg:gap-10">
          <Card className="surface-card lg:col-span-7 rounded-[1.35rem] p-7 md:p-9">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="분석할 키워드를 입력하세요"
                  className="h-12 flex-1 rounded-xl border-border/80 bg-background text-base md:text-base"
                  aria-label="키워드"
                />
                <div className="flex shrink-0 items-center gap-2">
                  <div className="bg-muted flex rounded-full p-1 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setMode("creator")}
                      className={`rounded-full px-3 py-1.5 transition-colors ${
                        mode === "creator"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground"
                      }`}
                    >
                      크리에이터
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("seller")}
                      className={`rounded-full px-3 py-1.5 transition-colors ${
                        mode === "seller"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground"
                      }`}
                    >
                      셀러
                    </button>
                  </div>
                  <Button
                    type="submit"
                    size="icon-lg"
                    className="size-12 shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/90"
                    aria-label="분석 실행"
                  >
                    <Search className="size-5" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                  샘플 트렌드
                </p>
                <div className="flex flex-wrap gap-2">
                  {sampleTrends.map((t) => (
                    <Badge
                      key={t.label}
                      variant={t.hot ? "default" : "secondary"}
                      className="rounded-full px-3 py-1 font-normal"
                    >
                      {t.label}
                      {t.hot ? (
                        <span className="text-primary-foreground/80 ml-1 text-[10px]">
                          추천
                        </span>
                      ) : null}
                    </Badge>
                  ))}
                </div>
              </div>
            </form>
          </Card>

          <Card className="surface-card lg:col-span-5 rounded-[1.35rem] p-7 md:p-9">
            <Badge variant="secondary" className="mb-3 font-normal">
              예시 결과 미리보기
            </Badge>
            <h2 className="text-lg font-semibold tracking-tight md:text-xl">
              분석 후 보이는 카드 화면입니다
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              실제 앱에서도 동일한 밀도로 요약합니다. 숫자는 가이드용 입니다.
            </p>
            <div className="mt-5 space-y-3">
              <div className="border-border/80 bg-muted/40 flex items-center justify-between rounded-xl border px-4 py-3">
                <span className="text-sm font-medium">키워드 적합도</span>
                <span className="text-primary text-xl font-semibold tabular-nums">78</span>
              </div>
              <div className="border-border/80 rounded-xl border bg-background px-4 py-3">
                <p className="text-muted-foreground text-xs font-medium">제목 후보</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  <li className="truncate">캠핑 버너 고르기 전에 볼 체크리스트</li>
                  <li className="truncate">입문자용 캠핑 버너 비교 가이드</li>
                  <li className="truncate">2026 추천 캠핑 버너 5선</li>
                </ul>
              </div>
              <div className="border-border/80 flex items-center justify-between rounded-xl border px-4 py-3">
                <span className="text-sm">온페이지 체크리스트</span>
                <span className="text-muted-foreground text-sm tabular-nums">5 / 8</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 h-auto px-0 font-medium" asChild>
              <Link href="/signup">
                내 키워드로 같은 화면 보기
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}
