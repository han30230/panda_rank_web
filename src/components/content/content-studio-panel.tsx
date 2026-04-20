"use client"

import { useCallback, useMemo, useState } from "react"
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
  "키워드 맥락을 읽는 중…",
  "가독성 규칙을 적용하는 중…",
  "제목 후보를 랭킹하는 중…",
]

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
  const [topic, setTopic] = useState("미니멀 책상 정리 완벽 가이드")
  const [keyword, setKeyword] = useState("책상 정리")
  const [tone, setTone] = useState("정보형 · 차분")
  const [phase, setPhase] = useState<Phase>("idle")
  const [progress, setProgress] = useState(0)
  const [loadingIdx, setLoadingIdx] = useState(0)
  const [draft, setDraft] = useState("")
  const [meta, setMeta] = useState({ title: "", desc: "" })

  const scores = {
    seo: 78,
    keywordFit: 82,
    readability: 74,
  }

  const titleSuggestions = useMemo(
    () => [
      `${topic.split(/\s+/)[0] ?? topic} | 실천 체크리스트`,
      `초보자도 OK — ${keyword} 5단계`,
      `${keyword}로 꾸미는 데스크 환경`,
    ],
    [topic, keyword],
  )

  const generate = useCallback(() => {
    setPhase("generating")
    setProgress(12)
    setLoadingIdx(0)
    setDraft("")
    const tick = window.setInterval(() => {
      setProgress((p) => Math.min(92, p + 18))
      setLoadingIdx((i) => (i + 1) % loadingMessages.length)
    }, 550)
    window.setTimeout(() => {
      window.clearInterval(tick)
      setProgress(100)
      setDraft(
        `## 들어가며\n${keyword}에 맞춰 책상 위 물건을 최소화하는 방법을 정리합니다.\n\n## 준비\n- 수납 1곳 확보\n- 분류 기준 3가지\n\n## 단계\n1. …\n2. …\n\n## 마무리\n포스트 하단에 체크리스트를 붙이면 체류 시간이 길어집니다.`,
      )
      setMeta({
        title: titleSuggestions[0] ?? "",
        desc: `${keyword} 실천 팁을 한 페이지에 모았습니다. 초보자를 위한 단계별 설명.`,
      })
      setPhase("done")
      toast.success("초안이 생성되었습니다.")
    }, 2200)
  }, [keyword, titleSuggestions])

  function copyBody() {
    if (!draft) return
    void navigator.clipboard.writeText(draft)
    toast.success("본문이 복사되었습니다.")
  }

  function saveProject() {
    toast.success("프로젝트에 저장되었습니다.")
  }

  function shareLink() {
    void navigator.clipboard.writeText(`${window.location.href}`)
    toast.success("링크가 복사되었습니다.")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      <Card className="surface-analytics rounded-2xl p-6 lg:col-span-5">
        <h2 className="text-sm font-semibold">입력</h2>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          필수 필드만 채우면 됩니다. 초안은 팀 룰(톤·금지어)에 맞춰 생성됩니다.
        </p>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">주제·포스트 제목</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kw">핵심 키워드</Label>
            <Input
              id="kw"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 책상 정리"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">톤</Label>
            <Input
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold shadow-sm"
              onClick={generate}
              disabled={phase === "generating"}
            >
              <Sparkles className="size-3.5 opacity-90" aria-hidden />
              {phase === "generating" ? "생성 중…" : "초안 생성"}
            </Button>
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setPhase("idle")}>
              초기화
            </Button>
          </div>
        </div>
      </Card>

      <Card className="surface-card overflow-hidden rounded-2xl border-border/90 p-0 lg:col-span-7">
        <div className="border-border/60 flex flex-wrap items-center justify-between gap-2 border-b bg-muted/25 px-4 py-3">
          <p className="text-sm font-semibold">결과</p>
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
              <Button type="button" size="sm" variant="outline" className="rounded-full bg-background" onClick={saveProject}>
                <Save className="size-3.5" />
                저장
              </Button>
              <Button type="button" size="sm" variant="outline" className="rounded-full bg-background" onClick={generate}>
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
              왼쪽에서 초안 생성을 누르면 점수 카드와 본문이 채워집니다.
            </p>
          ) : null}

          {phase === "generating" ? (
            <div className="space-y-4" role="status" aria-live="polite">
              <div className="flex items-center justify-between gap-2">
                <p className="text-foreground text-sm font-medium">{loadingMessages[loadingIdx]}</p>
                <Badge className="border-primary/25 bg-primary/10 font-normal text-primary inline-flex items-center gap-1">
                  <Sparkles className="size-3" aria-hidden />
                  AI 분석 중
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
                  <p className="text-muted-foreground mt-1 max-w-xl text-sm">
                    키워드 밀도와 헤딩 구조가 양호합니다. 서론에 동의어 한 번 더 넣으면 추천 점수가 올라갑니다.
                  </p>
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
                  hint="H2에 키워드 변형 포함을 권장합니다."
                  action="서론 2문장에 반영"
                />
                <ScoreCard
                  title="키워드 적합도"
                  score={scores.keywordFit}
                  hint="본문·제목·메타의 일치도입니다."
                />
                <ScoreCard
                  title="가독성"
                  score={scores.readability}
                  hint="문장 길이는 적정입니다."
                />
              </div>

              <div>
                <p className="text-sm font-medium">제목 추천</p>
                <ul className="mt-2 space-y-2">
                  {titleSuggestions.map((t) => (
                    <li
                      key={t}
                      className="border-border/60 flex items-center justify-between gap-2 rounded-xl border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <span className="min-w-0 flex-1">{t}</span>
                      <Button size="xs" variant="ghost" type="button">
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
                    <Input value={meta.title} onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>메타 설명</Label>
                    <Textarea value={meta.desc} onChange={(e) => setMeta((m) => ({ ...m, desc: e.target.value }))} className="min-h-[88px] rounded-xl text-sm" />
                  </div>
                </TabsContent>
                <TabsContent value="check" className="mt-4 outline-none">
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span> 첫 단락에 핵심 키워드 포함
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span> H2 3개 이상
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">○</span> 내부 링크 1개 이상 권장
                    </li>
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
