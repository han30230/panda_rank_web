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
import { Textarea } from "@/components/ui/textarea"
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
  initialMode?: "keyword" | "extract"
}

export function KeywordAnalyzePanel({
  initialKeyword,
  initialMode = "keyword",
}: KeywordAnalyzePanelProps) {
  const [inputTab, setInputTab] = useState<"keyword" | "extract">(initialMode)
  const [keyword, setKeyword] = useState(() => initialKeyword?.trim() ?? "")
  const [locale, setLocale] = useState("한국")
  const [lang, setLang] = useState("ko")
  const [phase, setPhase] = useState<Phase>("idle")
  const [progress, setProgress] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [result, setResult] = useState<AnalyzeApiResult | null>(null)
  const [saving, setSaving] = useState(false)

  const [bodyText, setBodyText] = useState("")
  const [extractLoading, setExtractLoading] = useState(false)
  const [extracted, setExtracted] = useState<{ term: string; count: number }[]>([])

  const runExtract = useCallback(async () => {
    const t = bodyText.trim()
    if (!t) {
      toast.error("본문을 붙여 넣어 주세요.")
      return
    }
    setExtractLoading(true)
    try {
      const res = await fetch("/api/keywords/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t, limit: 24 }),
      })
      const payload = (await res.json().catch(() => ({}))) as
        | { keywords?: { term: string; count: number }[] }
        | { error?: unknown }
      if (!res.ok) {
        const err =
          typeof (payload as { error?: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "추출에 실패했습니다."
        throw new Error(err)
      }
      const list = (payload as { keywords: { term: string; count: number }[] }).keywords
      setExtracted(Array.isArray(list) ? list : [])
      toast.success("빈도 상위 키워드를 추출했습니다.")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "추출에 실패했습니다.")
    } finally {
      setExtractLoading(false)
    }
  }, [bodyText])

  const run = useCallback(async (keywordOverride?: string) => {
    const q = (keywordOverride ?? keyword).trim()
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
      const seoScore = Math.round(
        (result.scores.seo + result.scores.fit + result.scores.readability) / 3,
      )
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
          seoScore,
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

  function copyExtracted() {
    if (!extracted.length) return
    const text = extracted.map((h) => `${h.term}\t${h.count}`).join("\n")
    void navigator.clipboard.writeText(text)
    toast.success("키워드 목록을 복사했습니다.")
  }

  function analyzeWithTerm(term: string) {
    setKeyword(term)
    setInputTab("keyword")
    if (phase === "error") setPhase("idle")
    void run(term)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      <Card className="surface-analytics rounded-2xl p-6 lg:col-span-5">
        <Tabs
          value={inputTab}
          onValueChange={(v) => setInputTab(v as "keyword" | "extract")}
          className="gap-4"
        >
          <TabsList className="grid h-9 w-full grid-cols-2 rounded-lg">
            <TabsTrigger value="keyword" className="text-xs sm:text-sm">
              키워드 분석
            </TabsTrigger>
            <TabsTrigger value="extract" className="text-xs sm:text-sm">
              본문 추출
            </TabsTrigger>
          </TabsList>
          <TabsContent value="keyword" className="mt-0 space-y-4 outline-none">
            <div>
              <h2 className="text-sm font-semibold">분석 입력</h2>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                서버 API로 분석합니다. <code className="text-[11px]">OPENAI_API_KEY</code>가 있으면
                OpenAI, 없으면 결정적 추정값을 씁니다.
              </p>
            </div>
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
          </TabsContent>
          <TabsContent value="extract" className="mt-0 space-y-4 outline-none">
            <div>
              <h2 className="text-sm font-semibold">본문에서 키워드 추출</h2>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                글 전체를 붙여 넣으면 빈도 상위 단어를 뽑습니다. 형태소 분석은 하지 않습니다.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="body-extract">본문</Label>
              <Textarea
                id="body-extract"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="블로그 글·상세페이지 문구를 붙여 넣으세요."
                className="min-h-[160px] rounded-xl font-mono text-sm"
              />
            </div>
            <Button
              className="w-full rounded-xl font-semibold"
              type="button"
              disabled={extractLoading}
              onClick={() => void runExtract()}
            >
              <Sparkles className="size-3.5 opacity-90" aria-hidden />
              {extractLoading ? "추출 중…" : "키워드 추출"}
            </Button>
            {extracted.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-muted-foreground text-xs font-medium">빈도 상위</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full text-xs"
                      onClick={copyExtracted}
                    >
                      목록 복사
                    </Button>
                  </div>
                </div>
                <ul className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-border/80 bg-muted/20 p-3 text-sm">
                  {extracted.map((h) => (
                    <li
                      key={h.term}
                      className="flex items-center justify-between gap-2 border-b border-border/40 py-1 last:border-0"
                    >
                      <button
                        type="button"
                        className="text-left font-medium text-primary hover:underline"
                        onClick={() => analyzeWithTerm(h.term)}
                      >
                        {h.term}
                      </button>
                      <span className="text-muted-foreground tabular-nums text-xs">{h.count}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  항목을 누르면 &ldquo;키워드 분석&rdquo; 탭으로 이동해 바로 분석합니다.
                </p>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
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
              {phase === "done" && result ? (
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="text-muted-foreground">분석 키워드 </span>
                    <span className="font-semibold text-foreground">{keyword.trim() || "—"}</span>
                    <span className="text-muted-foreground"> 기준으로 흔한 패턴을 가정했습니다.</span>
                  </p>
                  <ul className="text-muted-foreground list-inside list-disc space-y-2 leading-relaxed">
                    <li>상위 제목에 숫자·비교·‘총정리’ 유형이 자주 섞입니다.</li>
                    <li>H2는 스펙·가격·단점 순으로 반복되는 경우가 많습니다.</li>
                    <li>
                      롱테일 후보:{" "}
                      <span className="text-foreground">{result.ideas[1] ?? result.ideas[0]}</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  키워드 분석을 실행하면 이 탭에 요약이 표시됩니다.
                </p>
              )}
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
