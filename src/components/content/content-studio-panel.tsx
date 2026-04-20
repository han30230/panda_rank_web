"use client"

import { useCallback, useState } from "react"
import {
  Copy,
  RefreshCw,
  Save,
  Share2,
  Pencil,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type Phase = "idle" | "generating" | "done"

const loadingMessages = [
  "주제·키워드에 맞는 구조를 잡는 중…",
  "문단과 톤을 맞추는 중…",
  "메타·제목 후보를 정리하는 중…",
]

type GeneratePayload = {
  body: string
  meta: { title: string; description: string }
  titleSuggestions: string[]
  scores: { seo: number; keywordFit: number; readability: number }
  seoHint: string
  checklist: string[]
  source: "openai" | "heuristic"
}

function ScoreCard({
  title,
  score,
  hint,
  action,
}: {
  title: string
  score: number
  hint: string
  action?: string
}) {
  return (
    <Card className="surface-analytics rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wide">{title}</p>
        <span className="text-primary text-lg font-semibold tabular-nums">{score}</span>
      </div>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{hint}</p>
      {action ? (
        <p className="text-primary mt-2 text-xs font-medium">{action}</p>
      ) : null}
    </Card>
  )
}

export function ContentStudioPanel() {
  const [topic, setTopic] = useState("")
  const [keyword, setKeyword] = useState("")
  const [tone, setTone] = useState("정보형 · 차분")
  const [phase, setPhase] = useState<Phase>("idle")
  const [progress, setProgress] = useState(0)
  const [loadingIdx, setLoadingIdx] = useState(0)
  const [draft, setDraft] = useState("")
  const [meta, setMeta] = useState({ title: "", desc: "" })
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([])
  const [scores, setScores] = useState({ seo: 0, keywordFit: 0, readability: 0 })
  const [seoHint, setSeoHint] = useState("")
  const [checklist, setChecklist] = useState<string[]>([])
  const [source, setSource] = useState<"openai" | "heuristic" | null>(null)
  const [saving, setSaving] = useState(false)

  const generate = useCallback(async () => {
    const t = topic.trim()
    const k = keyword.trim()
    if (!t || !k) {
      toast.error("주제와 핵심 키워드를 모두 입력해 주세요.")
      return
    }

    setPhase("generating")
    setProgress(10)
    setLoadingIdx(0)
    setDraft("")
    setSource(null)
    const tick = window.setInterval(() => {
      setProgress((p) => Math.min(90, p + 12))
      setLoadingIdx((i) => (i + 1) % loadingMessages.length)
    }, 450)

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t, keyword: k, tone: tone.trim() || "정보형 · 차분" }),
      })
      setProgress(100)

      const payload = (await res.json().catch(() => ({}))) as GeneratePayload & { error?: unknown }
      if (!res.ok) {
        throw new Error(
          typeof payload.error === "string" ? payload.error : "생성 요청에 실패했습니다.",
        )
      }

      setDraft(payload.body)
      setMeta({ title: payload.meta.title, desc: payload.meta.description })
      setTitleSuggestions(payload.titleSuggestions)
      setScores(payload.scores)
      setSeoHint(payload.seoHint)
      setChecklist(payload.checklist)
      setSource(payload.source)
      setPhase("done")
      toast.success(
        payload.source === "openai"
          ? "OpenAI로 초안을 만들었습니다."
          : "로컬 추정 모델로 초안을 만들었습니다. (OPENAI_API_KEY 없음)",
      )
    } catch (e) {
      setPhase("idle")
      toast.error(e instanceof Error ? e.message : "생성에 실패했습니다.")
    } finally {
      window.clearInterval(tick)
    }
  }, [topic, keyword, tone])

  function copyBody() {
    if (!draft) return
    void navigator.clipboard.writeText(draft)
    toast.success("본문이 복사되었습니다.")
  }

  async function saveProject() {
    if (!draft.trim()) return
    setSaving(true)
    try {
      const summary =
        meta.desc.slice(0, 280) ||
        draft.slice(0, 200).replace(/\n/g, " ")
      const outlineFromHeadings = draft
        .split("\n")
        .filter((line) => line.startsWith("## "))
        .map((line) => line.replace(/^##\s+/, ""))
        .filter(Boolean)
      const outline =
        outlineFromHeadings.length > 0 ? outlineFromHeadings : titleSuggestions.slice(0, 4)

      const res = await fetch("/api/reports", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: topic.trim() || meta.title,
          kind: "content",
          status: "검토",
          keyword: keyword.trim() || undefined,
          summary,
          intent: tone,
          outline,
          metaTitle: meta.title,
          metaDescription: meta.desc,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { report?: { id: string } }
      if (!res.ok) throw new Error("저장에 실패했습니다.")
      toast.success("리포트에 저장했습니다.")
      if (data.report?.id) {
        window.location.href = `/reports/${data.report.id}`
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  function shareLink() {
    void navigator.clipboard.writeText(`${window.location.href}`)
    toast.success("링크가 복사되었습니다.")
  }

  function applyTitleSuggestion(t: string) {
    setMeta((m) => ({ ...m, title: t }))
    toast.message("메타 제목에 반영했습니다.")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      <Card className="surface-analytics rounded-2xl p-6 lg:col-span-5">
        <h2 className="text-sm font-semibold">입력</h2>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          주제·키워드마다 다른 초안이 생성됩니다. <code className="text-[11px]">OPENAI_API_KEY</code>가
          있으면 OpenAI, 없으면 서버 추정 모델을 씁니다.
        </p>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">주제·포스트 제목</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 재택근무 집중력 끌어올리기"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kw">핵심 키워드</Label>
            <Input
              id="kw"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 뽀모도로"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">톤</Label>
            <Input
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="정보형 · 차분"
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold shadow-sm"
              onClick={() => void generate()}
              disabled={phase === "generating"}
            >
              <Sparkles className="size-3.5 opacity-90" aria-hidden />
              {phase === "generating" ? "생성 중…" : "초안 생성"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setPhase("idle")
                setDraft("")
                setSource(null)
              }}
            >
              초기화
            </Button>
          </div>
        </div>
      </Card>

      <Card className="surface-card overflow-hidden rounded-2xl border-border/90 p-0 lg:col-span-7">
        <div className="border-border/60 flex flex-wrap items-center justify-between gap-2 border-b bg-muted/25 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">결과</p>
            {source ? (
              <Badge variant="secondary" className="rounded-full font-normal">
                {source === "openai" ? "OpenAI" : "로컬 추정"}
              </Badge>
            ) : null}
          </div>
          {phase === "done" ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="rounded-full"
                onClick={copyBody}
              >
                <Copy className="size-3.5" />
                복사
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full bg-background"
                disabled={saving}
                onClick={() => void saveProject()}
              >
                <Save className="size-3.5" />
                {saving ? "저장 중…" : "리포트에 저장"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full bg-background"
                onClick={() => void generate()}
              >
                <RefreshCw className="size-3.5" />
                다시 생성
              </Button>
              <Button type="button" size="sm" variant="ghost" className="rounded-full" onClick={shareLink}>
                <Share2 className="size-3.5" />
                공유
              </Button>
            </div>
          ) : null}
        </div>

        <div className="p-4 md:p-6">
          {phase === "idle" ? (
            <p className="text-muted-foreground text-sm">
              왼쪽에서 주제·키워드를 입력한 뒤 초안 생성을 누르면 본문·점수·메타가 채워집니다.
            </p>
          ) : null}

          {phase === "generating" ? (
            <div className="space-y-4" role="status" aria-live="polite">
              <div className="flex items-center justify-between gap-2">
                <p className="text-foreground text-sm font-medium">{loadingMessages[loadingIdx]}</p>
                <Badge className="border-primary/25 bg-primary/10 font-normal text-primary inline-flex items-center gap-1">
                  <Sparkles className="size-3" aria-hidden />
                  API 요청
                </Badge>
              </div>
              <div className={cn("rounded-full", "ai-processing-ring")}>
                <Progress value={progress} className="h-2.5 rounded-full bg-muted/80" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
              </div>
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          ) : null}

          {phase === "done" ? (
            <div className="space-y-6">
              <div className="border-border/60 flex flex-wrap items-end justify-between gap-3 border-b pb-4">
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    종합
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">
                    <span className="text-primary">{scores.seo}</span>
                    <span className="text-muted-foreground text-lg font-normal">/100</span>
                    <span className="text-muted-foreground ml-2 text-sm font-normal">SEO 가이드 점수</span>
                  </p>
                  <p className="text-muted-foreground mt-1 max-w-xl text-sm">{seoHint}</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full" type="button">
                  <Pencil className="size-3.5" />
                  수정 모드
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <ScoreCard
                  title="SEO 점수"
                  score={scores.seo}
                  hint="제목·첫 문단·헤딩에 키워드 변형을 배치해 보세요."
                  action={seoHint ? "위 안내 참고" : undefined}
                />
                <ScoreCard
                  title="키워드 적합도"
                  score={scores.keywordFit}
                  hint="본문·메타·제목의 일치도 추정입니다."
                />
                <ScoreCard title="가독성" score={scores.readability} hint="문장 길이와 단락 나눔 기준입니다." />
              </div>

              <div>
                <p className="text-sm font-medium">제목 추천</p>
                <ul className="mt-2 space-y-2">
                  {titleSuggestions.map((sug) => (
                    <li
                      key={sug}
                      className="border-border/60 flex items-center justify-between gap-2 rounded-xl border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <span className="min-w-0 flex-1">{sug}</span>
                      <Button
                        size="xs"
                        variant="ghost"
                        type="button"
                        onClick={() => applyTitleSuggestion(sug)}
                      >
                        적용
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <Tabs defaultValue="draft" className="gap-0">
                <TabsList className="h-9">
                  <TabsTrigger value="draft" className="text-xs sm:text-sm">
                    초안
                  </TabsTrigger>
                  <TabsTrigger value="meta" className="text-xs sm:text-sm">
                    메타·요약
                  </TabsTrigger>
                  <TabsTrigger value="check" className="text-xs sm:text-sm">
                    체크리스트
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="draft" className="mt-4 outline-none">
                  <Textarea
                    className="min-h-[220px] resize-y rounded-xl font-mono text-sm"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="meta" className="mt-4 space-y-3 outline-none">
                  <div className="space-y-2">
                    <Label>메타 제목</Label>
                    <Input
                      value={meta.title}
                      onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>메타 설명</Label>
                    <Textarea
                      value={meta.desc}
                      onChange={(e) => setMeta((m) => ({ ...m, desc: e.target.value }))}
                      className="min-h-[88px] rounded-xl text-sm"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="check" className="mt-4 outline-none">
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    {checklist.map((item, i) => (
                      <li key={`${i}-${item}`} className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  )
}
