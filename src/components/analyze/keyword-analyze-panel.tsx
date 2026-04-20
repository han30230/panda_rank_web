"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { Copy, FilePlus2, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

type Phase = "idle" | "loading" | "done" | "error"

const steps = [
  "검색 의도 추정…",
  "상위 스니펫 패턴 스캔…",
  "연관 키워드·질문형 매칭…",
]

type AnalyzeApiResult = {
  intent: string
  ideas: string[]
  scores: { seo: number; fit: number; readability: number }
  source: "openai" | "heuristic"
}

type KeywordAnalyzePanelProps = {
  initialKeyword?: string | null
}

export function KeywordAnalyzePanel({ initialKeyword }: KeywordAnalyzePanelProps) {
  const [keyword, setKeyword] = useState(() => initialKeyword?.trim() ?? "")
  const [locale, setLocale] = useState("한국")
  const [lang, setLang] = useState("ko")
  const [phase, setPhase] = useState<Phase>("idle")
  const [progress, setProgress] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [result, setResult] = useState<AnalyzeApiResult | null>(null)
  const [saving, setSaving] = useState(false)

  const run = useCallback(async () => {
    const q = keyword.trim()
    if (!q) {
      setPhase("error")
      return
    }
    setPhase("loading")
    setResult(null)
    setProgress(8)
    setStepIdx(0)
    const tick = window.setInterval(() => {
      setProgress((p) => Math.min(88, p + 14))
      setStepIdx((i) => (i + 1) % steps.length)
    }, 400)
    try {
      const res = await fetch("/api/keywords/analyze", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: q, locale, lang }),
      })
      window.clearInterval(tick)
      setProgress(100)
      const payload = (await res.json().catch(() => ({}))) as
        | AnalyzeApiResult
        | { error?: unknown }
      if (!res.ok) {
        throw new Error(
          typeof (payload as { error?: unknown }).error === "string"
            ? ((payload as { error: string }).error)
            : "분석 요청에 실패했습니다.",
        )
      }
      const data = payload as AnalyzeApiResult
      setResult(data)
      setPhase("done")
      toast.success(
        data.source === "openai"
          ? "OpenAI 모델로 분석했습니다."
          : "로컬 추정 모델로 분석했습니다. (OPENAI_API_KEY 없음)",
      )
    } catch (e) {
      window.clearInterval(tick)
      setPhase("error")
      toast.error(e instanceof Error ? e.message : "분석에 실패했습니다.")
    }
  }, [keyword, locale, lang])

  const saveReport = useCallback(async () => {
    if (!result) return
    const q = keyword.trim()
    if (!q) return
    setSaving(true)
    try {
      const summary = `의도: ${result.intent}. 제안 각도: ${result.ideas.join(", ")}`
      const res = await fetch("/api/reports", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: q,
          kind: "analyze",
          status: "완료",
          keyword: q,
          summary,
          intent: result.intent,
          outline: result.ideas,
          metaTitle: `${q} | ${siteConfig.name}`,
          metaDescription: `${result.intent} 기준으로 정리한 키워드 분석 리포트입니다.`,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { report?: { id: string } }
      if (!res.ok) {
        throw new Error("리포트를 저장하지 못했습니다.")
      }
      toast.success("리포트에 저장했습니다.")
      if (data.report?.id) {
        window.location.href = `/reports/${data.report.id}`
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }, [keyword, result])

  function copySummary() {
    if (!result) return
    const text = `키워드: ${keyword}\n의도: ${result.intent}\n제안: ${result.ideas.join(", ")}`
    void navigator.clipboard.writeText(text)
    toast.success("요약이 복사되었습니다.")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      <Card className="surface-analytics rounded-2xl p-6 lg:col-span-5">
        <h2 className="text-sm font-semibold">분석 입력</h2>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          서버 API로 분석합니다. <code className="text-[11px]">OPENAI_API_KEY</code>가 있으면
          OpenAI, 없으면 결정적 추정값을 씁니다.
        </p>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kw">키워드</Label>
            <Input
              id="kw"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                if (phase === "error") setPhase("idle")
              }}
              placeholder="예: 미니멀 책상 정리"
              className="rounded-xl"
              aria-invalid={phase === "error"}
            />
            {phase === "error" ? (
              <p className="text-destructive text-xs">키워드를 입력해 주세요.</p>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="locale">지역</Label>
              <Input
                id="locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lang">언어</Label>
              <Input id="lang" value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-xl" />
            </div>
          </div>
          <Button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl font-semibold shadow-sm"
            disabled={phase === "loading"}
            onClick={() => void run()}
            type="button"
          >
            <Sparkles className="size-3.5 opacity-90" aria-hidden />
            {phase === "loading" ? "분석 중…" : "분석 실행"}
          </Button>
          {phase === "done" && result ? (
            <Button
              variant="secondary"
              className="w-full rounded-xl"
              type="button"
              disabled={saving}
              onClick={() => void saveReport()}
            >
              <FilePlus2 className="size-3.5" />
              {saving ? "저장 중…" : "리포트로 저장"}
            </Button>
          ) : null}
          <Button variant="outline" className="w-full rounded-xl" asChild>
            <Link href="/content/new">이 주제로 초안 만들기</Link>
          </Button>
        </div>
      </Card>

      <Card className="surface-card overflow-hidden rounded-2xl border-border/90 p-0 lg:col-span-7">
        <Tabs defaultValue="overview" className="flex flex-col gap-0">
          <div className="border-border/60 flex flex-wrap items-center justify-between gap-2 border-b bg-muted/20 px-4 py-3">
            <TabsList className="h-9 rounded-lg">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                개요
              </TabsTrigger>
              <TabsTrigger value="compete" className="text-xs sm:text-sm">
                비교
              </TabsTrigger>
              <TabsTrigger value="ideas" className="text-xs sm:text-sm">
                제안
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap items-center gap-2">
              {phase === "done" && result ? (
                <>
                  <Badge variant="secondary" className="rounded-full font-normal">
                    {result.source === "openai" ? "OpenAI" : "로컬 추정"}
                  </Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-full bg-background"
                    onClick={copySummary}
                  >
                    <Copy className="size-3.5" />
                    요약 복사
                  </Button>
                </>
              ) : null}
            </div>
          </div>
          <div className="p-4 md:p-6">
            <TabsContent value="overview" className="mt-0 outline-none">
              {phase === "idle" ? (
                <p className="text-muted-foreground text-sm">
                  좌측에서 키워드를 입력하고 분석을 실행하면 점수 카드와 요약이 표시됩니다.
                </p>
              ) : null}
              {phase === "loading" ? (
                <div className="space-y-4" role="status" aria-live="polite">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-foreground text-sm font-medium">{steps[stepIdx]}</p>
                    <Badge className="inline-flex items-center gap-1 border-primary/25 bg-primary/10 font-normal text-primary">
                      <Sparkles className="size-3" aria-hidden />
                      API 요청
                    </Badge>
                  </div>
                  <div className={cn("rounded-full", "ai-processing-ring")}>
                    <Progress value={progress} className="h-2.5 rounded-full bg-muted/80" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                    <Skeleton className="h-20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                  </div>
                </div>
              ) : null}
              {phase === "done" && result ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        검색 의도 추정
                      </p>
                      <p className="mt-1 text-lg font-semibold">{result.intent}</p>
                    </div>
                    <p className="text-primary text-3xl font-semibold tabular-nums">
                      {result.scores.fit}
                      <span className="text-muted-foreground text-lg font-normal">/100</span>
                      <span className="text-muted-foreground ml-2 text-sm font-normal">
                        키워드 적합도
                      </span>
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Card className="surface-analytics rounded-xl p-4">
                      <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wide">
                        SEO 잠재 점수
                      </p>
                      <p className="text-primary mt-2 text-2xl font-semibold tabular-nums">
                        {result.scores.seo}
                      </p>
                      <p className="text-muted-foreground mt-2 text-xs">구조·의도 기준 가이드</p>
                    </Card>
                    <Card className="surface-analytics rounded-xl p-4">
                      <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wide">
                        키워드 적합도
                      </p>
                      <p className="text-primary mt-2 text-2xl font-semibold tabular-nums">
                        {result.scores.fit}
                      </p>
                      <p className="text-muted-foreground mt-2 text-xs">제목·본문 일치</p>
                    </Card>
                    <Card className="surface-analytics rounded-xl p-4">
                      <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wide">
                        가독성
                      </p>
                      <p className="text-primary mt-2 text-2xl font-semibold tabular-nums">
                        {result.scores.readability}
                      </p>
                      <p className="text-muted-foreground mt-2 text-xs">문장·단락 길이</p>
                    </Card>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    상위 결과는 정보성 글과 제품 나열이 섞여 있습니다. 체크리스트·비교표 포맷이 유리합니다.
                  </p>
                </div>
              ) : null}
            </TabsContent>
            <TabsContent value="compete" className="mt-0 outline-none">
              <p className="text-muted-foreground text-sm">
                {phase === "done"
                  ? "헤딩 패턴: H2에 ‘장단점’, ‘추천’이 반복됩니다. 틈새는 ‘실패 사례’입니다."
                  : "분석 후 경쟁 스냅샷이 여기에 표시됩니다."}
              </p>
            </TabsContent>
            <TabsContent value="ideas" className="mt-0 outline-none">
              {result ? (
                <ul className="list-inside list-disc space-y-2 text-sm">
                  {result.ideas.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">제목·목차 아이디어가 여기에 뜹니다.</p>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
