"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Key, Plus, Search, Sparkles } from "lucide-react"
import { useState } from "react"

import { HeroQuickTools } from "@/components/sections/hero-quick-tools"
import {
  heroContent,
  heroPromo,
  heroQuickTools,
  heroSampleRank,
} from "@/constants/landing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function Hero() {
  const router = useRouter()
  const [mode, setMode] = useState<"creator" | "seller">("creator")
  const [query, setQuery] = useState("")

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/analyze/keyword?q=${encodeURIComponent(q)}`)
  }

  return (
    <section className="relative overflow-hidden">
      <div className="hero-backdrop pointer-events-none absolute inset-0 -z-20" aria-hidden />
      <div className="hero-grid-noise pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="marketing-container relative pb-14 pt-16 sm:pb-16 sm:pt-20 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-eyebrow">{heroContent.eyebrow}</p>
          <h1 className="text-display-hero mx-auto mt-4 max-w-[20ch] px-1 sm:mt-5 sm:max-w-none sm:px-0">
            {heroContent.titleLines[0]}
            <br className="hidden sm:block" /> {heroContent.titleLines[1]}
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-balance text-sm leading-relaxed sm:mt-6 sm:text-base md:text-lg">
            {heroContent.description}
          </p>
          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mx-auto sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Button
              size="lg"
              className="h-12 w-full min-h-12 rounded-full px-8 text-base font-semibold shadow-[0_4px_16px_-2px_oklch(0.52_0.12_175/0.4)] sm:w-auto sm:px-9"
              asChild
            >
              <Link href={heroContent.primaryCta.href}>
                {heroContent.primaryCta.label}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full min-h-12 rounded-full border-border/90 bg-background px-7 sm:w-auto"
              asChild
            >
              <Link href={heroContent.secondaryCta.href}>{heroContent.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:mt-16 sm:gap-6 lg:mt-20 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="flex flex-col gap-5 sm:gap-6 lg:col-span-8">
            <Card className="surface-card rounded-[1.35rem] p-4 sm:p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  키워드 검색
                </p>
                <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[11px] font-medium">
                  <Sparkles className="text-primary size-3.5" aria-hidden />
                  AI 후보는 분석 화면에서 확인
                </span>
              </div>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="분석할 키워드를 입력해 주세요"
                    className="h-12 flex-1 rounded-xl border-border/80 bg-background text-base"
                    aria-label="키워드"
                  />
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="bg-muted flex rounded-full p-1 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setMode("creator")}
                        className={`rounded-full px-3 py-1.5 transition-colors ${
                          mode === "creator"
                            ? "bg-background font-semibold text-foreground shadow-sm"
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
                            ? "bg-background font-semibold text-foreground shadow-sm"
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

                <Link
                  href={`/analyze/keyword?q=${encodeURIComponent(heroSampleRank.keyword)}`}
                  className="bg-muted/50 hover:bg-muted/70 flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 transition-colors"
                >
                  <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums">
                    {heroSampleRank.rank}
                  </span>
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#03C75A] text-sm font-bold text-white"
                    aria-label="네이버"
                  >
                    N
                  </span>
                  <span className="min-w-0 truncate text-sm font-medium">{heroSampleRank.keyword}</span>
                </Link>

                <div className="flex flex-wrap items-center justify-end gap-4 text-[12px] font-medium">
                  <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                  >
                    <Plus className="size-3.5" aria-hidden />
                    더보기
                  </Link>
                  <Link
                    href="/analyze/keyword"
                    className="inline-flex items-center gap-1 text-amber-700 transition-colors hover:text-amber-900 dark:text-amber-500/90"
                  >
                    <Key className="size-3.5" aria-hidden />
                    황금 키워드
                  </Link>
                </div>

                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  팁: 브랜드명 + 카테고리(예: 캠핑 버너) 조합이면 검색 의도를 더 잘 잡습니다.
                </p>
              </form>
            </Card>

            <Card id="blog-tools" className="surface-card scroll-mt-24 rounded-[1.35rem] p-5 md:p-7">
              <p className="text-muted-foreground mb-4 text-center text-xs font-semibold tracking-wide uppercase md:text-left">
                바로가기
              </p>
              <HeroQuickTools items={heroQuickTools} />
            </Card>
          </div>

          <Card className="relative flex min-h-[280px] flex-col overflow-hidden rounded-[1.35rem] border-0 bg-zinc-950 p-6 text-white shadow-xl md:min-h-[320px] lg:col-span-4 lg:min-h-0">
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 70% 20%, oklch(0.35 0.08 85), transparent 50%), radial-gradient(ellipse 60% 50% at 30% 80%, oklch(0.25 0.05 280), transparent 55%)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-1 flex-col">
              <Badge className="mb-3 w-fit border-0 bg-white/10 font-normal text-white hover:bg-white/15">
                {heroPromo.badge}
              </Badge>
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                <span className="bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                  {heroPromo.title}
                </span>
                <br />
                <span className="text-2xl font-extrabold text-white md:text-3xl">{heroPromo.titleAccent}</span>
              </h2>
              <p className="text-white/60 mt-2 text-sm">데이터로 선별한 키워드 리스트를 만나보세요.</p>

              <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                <div
                  className="relative size-[7.5rem] shrink-0 overflow-hidden rounded-2xl md:size-32"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 25%, oklch(0.75 0.12 85), oklch(0.55 0.1 75) 45%, oklch(0.35 0.06 55) 100%)",
                    boxShadow: "0 12px 40px -8px oklch(0.45 0.08 75 / 0.6), inset 0 2px 12px oklch(0.9 0.05 90 / 0.35)",
                  }}
                >
                  <Image
                    src={heroPromo.imageSrc}
                    alt={heroPromo.imageAlt}
                    width={256}
                    height={256}
                    className="size-full object-contain p-1"
                    sizes="(max-width: 1024px) 120px, 128px"
                    unoptimized={heroPromo.imageSrc.endsWith(".svg")}
                  />
                </div>
                <span className="text-white/40 text-xs font-medium tabular-nums">{heroPromo.carouselHint}</span>
              </div>
            </div>
            <Button
              size="sm"
              className="relative mt-4 w-full rounded-full bg-amber-500/90 font-semibold text-zinc-950 hover:bg-amber-400"
              asChild
            >
              <Link href="/analyze/keyword">황금 키워드 보기</Link>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}
