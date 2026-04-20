"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Copy,
  HelpCircle,
  ImagePlus,
  Loader2,
  RefreshCw,
  Save,
  Share2,
  Sparkles,
  Wand2,
  X,
  ChevronRight,
  FileText,
  MessageSquare,
  Pencil,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  CONTENT_LENGTH_OPTIONS,
  CONTENT_POST_TYPES,
  CONTENT_TONE_PRESETS,
  type TrendingTopicItem,
} from "@/constants/content-studio"
import { TARGET_CHARS_MAX, TARGET_CHARS_MIN } from "@/lib/content-char-target"
import { PANDA_GREEN, PANDA_GREEN_HOVER } from "@/lib/pandarank-theme"
import type { ReportRow } from "@/lib/report-dto"

/** 네이버 블로그 제목 길이에 맞춤 (트렌드 예시·긴 제목 허용) */
const TITLE_MAX = 100
const KEYWORD_MAX = 20
const IMAGE_MAX = 10
const IMAGE_MAX_MB = 5

type Phase = "idle" | "generating" | "done"

function resolveTone(presetId: string, customTone: string): string {
  if (presetId === "custom") return customTone.trim() || "정보형 · 차분"
  const p = CONTENT_TONE_PRESETS.find((x) => x.id === presetId)
  return p?.value ?? "정보형 · 차분"
}

function keywordStringForApi(chips: string[]): string {
  return chips.map((c) => c.trim()).filter(Boolean).join(" · ")
}

const loadingMessages = [
  "주제·키워드에 맞는 구조를 잡는 중…",
  "문단과 톤을 맞추는 중…",
  "메타·제목 후보를 정리하는 중…",
]

/** 본문에서 소제목 추출: 마크다운 ## 또는 네이버에서 쓰기 쉬운 ◆·■ 한 줄 제목 */
function extractOutlineFromDraft(draft: string): string[] {
  const out: string[] = []
  for (const raw of draft.split("\n")) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith("## ")) {
      out.push(line.replace(/^##\s+/, "").trim())
      continue
    }
    if (/^[◆◇■▶]/.test(line)) {
      const t = line.replace(/^[◆◇■▶]\s*/, "").trim()
      if (t.length > 0 && t.length < 120) out.push(t)
    }
  }
  return out
}

type GeneratePayload = {
  body: string
  meta: { title: string; description: string }
  titleSuggestions: string[]
  scores: { seo: number; keywordFit: number; readability: number }
  seoHint: string
  checklist: string[]
  source: "openai" | "heuristic"
  lengthMode: "draft" | "full"
  charTarget?: { min: number; max: number; label: string }
}

export type ContentStudioVariant = "default" | "pandarank"

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

export function ContentStudioPanel({
  variant = "default",
}: {
  variant?: ContentStudioVariant
}) {
  const isPanda = variant === "pandarank"
  const [postTypeId, setPostTypeId] = useState<string>(CONTENT_POST_TYPES[0]!.id)
  const [topic, setTopic] = useState("")
  const [keywordChips, setKeywordChips] = useState<string[]>([])
  const [kwInput, setKwInput] = useState("")
  const [tonePresetId, setTonePresetId] = useState("info-calm")
  const [customTone, setCustomTone] = useState("")
  const [lengthMode, setLengthMode] = useState<"draft" | "full">("full")
  const [targetCharsInput, setTargetCharsInput] = useState("")
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
  const [generatedLength, setGeneratedLength] = useState<"draft" | "full" | null>(null)
  const [appliedCharTarget, setAppliedCharTarget] = useState<{
    min: number
    max: number
    label: string
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [recentReports, setRecentReports] = useState<ReportRow[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [trendingTopics, setTrendingTopics] = useState<TrendingTopicItem[]>([])
  const [trendingSource, setTrendingSource] = useState<"live" | "fallback" | null>(null)
  const [trendingLoading, setTrendingLoading] = useState(true)

  const [refineInput, setRefineInput] = useState("")
  const [refinePhase, setRefinePhase] = useState<"idle" | "loading">("idle")

  useEffect(() => {
    setTrendingLoading(true)
    void fetch(`/api/trending/topics?postType=${encodeURIComponent(postTypeId)}`)
      .then((r) => r.json())
      .then((d: { items?: TrendingTopicItem[]; source?: "live" | "fallback" }) => {
        setTrendingTopics(d.items ?? [])
        setTrendingSource(d.source ?? "fallback")
      })
      .catch(() => {
        setTrendingTopics([])
        setTrendingSource("fallback")
      })
      .finally(() => setTrendingLoading(false))
  }, [postTypeId])

  useEffect(() => {
    void fetch("/api/reports", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { reports?: ReportRow[] }) => {
        const list = (d.reports ?? []).filter((x) => x.kind === "content").slice(0, 6)
        setRecentReports(list)
      })
      .catch(() => {})
  }, [])

  function onPostTypeChange(id: string) {
    setPostTypeId(id)
    const m = CONTENT_POST_TYPES.find((p) => p.id === id)
    if (m) setTonePresetId(m.tonePresetId)
  }

  function addKeywordChip(raw?: string) {
    const v = (raw ?? kwInput).trim()
    if (!v || keywordChips.length >= KEYWORD_MAX) return
    if (keywordChips.includes(v)) {
      setKwInput("")
      return
    }
    setKeywordChips((c) => [...c, v])
    setKwInput("")
  }

  function removeKeywordChip(i: number) {
    setKeywordChips((c) => c.filter((_, idx) => idx !== i))
  }

  function autoFillKeywords() {
    const parts = topic
      .trim()
      .split(/[\s,.·/]+/)
      .map((w) => w.replace(/[^\w가-힣]/g, ""))
      .filter((w) => w.length >= 2)
    const next = [...new Set(parts)].slice(0, KEYWORD_MAX)
    if (next.length === 0) {
      toast.error("제목에서 추출할 키워드가 없습니다.")
      return
    }
    setKeywordChips(next)
    toast.message("제목 기준으로 키워드를 채웠습니다.")
  }

  function onImagePick(files: FileList | null) {
    if (!files?.length) return
    const next: File[] = [...imageFiles]
    for (let i = 0; i < files.length; i++) {
      const f = files[i]!
      if (f.size > IMAGE_MAX_MB * 1024 * 1024) {
        toast.error(`${f.name}은(는) ${IMAGE_MAX_MB}MB를 초과합니다.`)
        continue
      }
      if (!/^image\/(jpeg|jpg|png)$/i.test(f.type) && !/\.(jpe?g|png)$/i.test(f.name)) {
        toast.error(`${f.name}: jpg, png만 지원합니다.`)
        continue
      }
      if (next.length >= IMAGE_MAX) break
      next.push(f)
    }
    setImageFiles(next.slice(0, IMAGE_MAX))
  }

  const generate = useCallback(async () => {
    const t = topic.trim()
    const kw = keywordStringForApi(keywordChips)
    if (!t) {
      toast.error("포스트 제목을 입력해 주세요.")
      return
    }
    if (!kw) {
      toast.error("키워드를 1개 이상 추가해 주세요. (엔터로 입력)")
      return
    }

    setPhase("generating")
    setProgress(10)
    setLoadingIdx(0)
    setDraft("")
    setSource(null)
    setAppliedCharTarget(null)
    const tick = window.setInterval(() => {
      setProgress((p) => Math.min(90, p + 12))
      setLoadingIdx((i) => (i + 1) % loadingMessages.length)
    }, 450)

    try {
      const toneResolved = resolveTone(tonePresetId, customTone)
      const rawTarget = targetCharsInput.trim()
      const parsedTarget = rawTarget === "" ? NaN : Number.parseInt(rawTarget, 10)
      const payloadBody: Record<string, unknown> = {
        topic: t,
        keyword: kw,
        tone: toneResolved,
        length: lengthMode,
        postType: postTypeId,
      }
      if (
        Number.isFinite(parsedTarget) &&
        parsedTarget >= TARGET_CHARS_MIN &&
        parsedTarget <= TARGET_CHARS_MAX
      ) {
        payloadBody.targetChars = parsedTarget
      }

      const res = await fetch("/api/content/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBody),
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
      setGeneratedLength(payload.lengthMode)
      setAppliedCharTarget(payload.charTarget ?? null)
      setPhase("done")
      const modeLabel = payload.lengthMode === "full" ? "전체 글" : "초안"
      toast.success(
        payload.source === "openai"
          ? `OpenAI로 ${modeLabel}을(를) 만들었습니다.`
          : `로컬 추정 모델로 ${modeLabel}을(를) 만들었습니다.`,
      )
    } catch (e) {
      setPhase("idle")
      toast.error(e instanceof Error ? e.message : "생성에 실패했습니다.")
    } finally {
      window.clearInterval(tick)
    }
  }, [topic, keywordChips, tonePresetId, customTone, lengthMode, postTypeId, targetCharsInput])

  const runRefine = useCallback(async () => {
    const ins = refineInput.trim()
    if (!ins) {
      toast.error("어떻게 바꿀지 한 줄 이상 입력해 주세요.")
      return
    }
    if (!draft.trim()) {
      toast.error("먼저 본문을 생성해 주세요.")
      return
    }
    setRefinePhase("loading")
    try {
      const res = await fetch("/api/chat/influencer/refine", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, instruction: ins }),
      })
      const payload = (await res.json().catch(() => ({}))) as { body?: string; error?: unknown }
      if (!res.ok) {
        throw new Error(
          typeof payload.error === "string" ? payload.error : "다듬기에 실패했습니다.",
        )
      }
      if (!payload.body) throw new Error("응답 본문이 없습니다.")
      setDraft(payload.body)
      setRefineInput("")
      toast.success("본문에 반영했습니다.")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "다듬기에 실패했습니다.")
    } finally {
      setRefinePhase("idle")
    }
  }, [draft, refineInput])

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
      const outlineFromHeadings = extractOutlineFromDraft(draft)
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
          keyword: keywordStringForApi(keywordChips) || undefined,
          summary,
          intent: resolveTone(tonePresetId, customTone),
          outline,
          metaTitle: meta.title,
          metaDescription: meta.desc,
          seoScore: Math.round((scores.seo + scores.keywordFit + scores.readability) / 3),
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

  function applyTrendTopic(item: TrendingTopicItem) {
    const title = item.title.trim().slice(0, TITLE_MAX)
    const uniq = [...new Set(item.keywords.map((k) => k.trim()).filter(Boolean))].slice(0, KEYWORD_MAX)
    setTopic(title)
    setKeywordChips(uniq)
    if (uniq.length === 0) {
      toast.message("제목을 채웠습니다. 키워드를 추가해 주세요.")
    } else {
      toast.success("제목과 키워드를 채웠습니다.")
    }
  }

  const titleLen = topic.length

  return (
    <div className="space-y-6">
      {/* 상단 툴바 느낌 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {isPanda ? "🐼" : "📄"}
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              {isPanda ? "인플루언서 포스트" : "블로그 글쓰기"}
            </h2>
            <p className="text-muted-foreground text-xs">
              {isPanda
                ? "판다 AI 스타일 · 실시간 상위 노출 패턴에 맞춘 초안·다듬기"
                : "네이버 검색·블로그에 맞춘 구조·메타·본문 (의도·밀도·가독성)"}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "ml-1 rounded-full font-normal",
              isPanda && "border-[#00C95A]/40 bg-[#00C95A]/12 text-[#008f45]",
            )}
          >
            {isPanda ? "판다 AI" : "2.1"}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs tabular-nums">
            {isPanda ? "채팅형 도구 · 리포트에서 이력 확인" : "오늘 생성은 대시보드에서 확인"}
          </span>
          <Button size="sm" variant="outline" className="rounded-full text-xs" asChild>
            <Link href="/settings/billing">크레딧</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* 왼쪽: 입력 폼 */}
        <div className="space-y-4">
          <Card className="border-border/80 overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-border/60 bg-muted/30 px-4 py-3">
              <p className="text-sm font-semibold">새 글 만들기</p>
              <p className="text-muted-foreground text-xs">
                유형·제목·키워드 입력 후 생성. 상위 노출에 가까운 패턴(첫 문단·◆목차·밀도)을 반영합니다.
              </p>
            </div>
            <div className="space-y-5 p-4 md:p-6">
              <div className="space-y-2">
                <Label htmlFor="post-type" className="flex items-center gap-1 text-sm font-medium">
                  글 유형
                  <HelpCircle className="text-muted-foreground size-3.5" aria-hidden />
                </Label>
                <select
                  id="post-type"
                  value={postTypeId}
                  onChange={(e) => onPostTypeChange(e.target.value)}
                  className={cn(
                    "border-input bg-background h-11 w-full rounded-xl border px-3 text-sm shadow-sm",
                    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                  )}
                >
                  {CONTENT_POST_TYPES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  선택한 유형마다 네이버 블로그용 AI 지시(역할·구성·톤)가 다르게 적용됩니다.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="topic" className="text-sm font-medium">
                    포스트 제목{" "}
                    <span style={{ color: isPanda ? PANDA_GREEN : undefined }} className={!isPanda ? "text-emerald-600" : ""}>
                      *
                    </span>
                  </Label>
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      titleLen > TITLE_MAX ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {titleLen}/{TITLE_MAX}
                  </span>
                </div>
                <Input
                  id="topic"
                  value={topic}
                  maxLength={TITLE_MAX}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="블로그 제목을 입력하세요"
                  className="h-11 rounded-xl border-border/80 bg-background text-base"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label className="flex items-center gap-1 text-sm font-medium">
                    키워드
                    <HelpCircle className="text-muted-foreground size-3.5" aria-hidden />
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-primary h-7 gap-1 rounded-full px-2 text-xs font-semibold"
                    onClick={autoFillKeywords}
                  >
                    <Wand2 className="size-3.5" />
                    자동입력
                  </Button>
                </div>
                <p className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
                  <span>입력 후 엔터로 추가</span>
                  <span className="tabular-nums">
                    {keywordChips.length}/{KEYWORD_MAX}
                  </span>
                </p>
                <div className="border-input flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border bg-background px-2 py-1.5 shadow-sm">
                  {keywordChips.map((chip, i) => (
                    <span
                      key={`${chip}-${i}`}
                      className="bg-primary/12 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                      {chip}
                      <button
                        type="button"
                        className="hover:bg-primary/20 rounded-full p-0.5"
                        onClick={() => removeKeywordChip(i)}
                        aria-label={`${chip} 삭제`}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    className="placeholder:text-muted-foreground min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none"
                    placeholder={
                      keywordChips.length >= KEYWORD_MAX ? "최대 개수 도달" : "키워드 입력 후 Enter"
                    }
                    disabled={keywordChips.length >= KEYWORD_MAX}
                    value={kwInput}
                    onChange={(e) => setKwInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addKeywordChip()
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">이미지 첨부 (선택)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
                  multiple
                  className="hidden"
                  onChange={(e) => onImagePick(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    onImagePick(e.dataTransfer.files)
                  }}
                  className={cn(
                    "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/40",
                    "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 transition-colors",
                  )}
                >
                  <div className="bg-muted flex size-12 items-center justify-center rounded-full">
                    <ImagePlus className="text-muted-foreground size-6" />
                  </div>
                  <p className="text-muted-foreground text-center text-xs leading-relaxed">
                    최대 {IMAGE_MAX}장 · jpg, png (장당 최대 {IMAGE_MAX_MB}MB)
                  </p>
                  {imageFiles.length > 0 ? (
                    <p className="text-primary text-xs font-medium">{imageFiles.length}개 선택됨</p>
                  ) : null}
                </button>
                {imageFiles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {imageFiles.map((f, i) => (
                      <span
                        key={`${f.name}-${i}`}
                        className="bg-muted text-muted-foreground max-w-[10rem] truncate rounded-lg px-2 py-1 text-xs"
                      >
                        {f.name}
                      </span>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setImageFiles([])}
                    >
                      전체 제거
                    </Button>
                  </div>
                ) : null}
                <p className="text-muted-foreground text-[11px]">
                  참고용으로만 저장됩니다. 생성 본문에 자동 삽입은 추후 연동 예정입니다.
                </p>
              </div>

              <Accordion type="single" collapsible className="border-border/60 rounded-xl border px-3">
                <AccordionItem value="adv" className="border-0">
                  <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
                    <span className="flex items-center gap-2">
                      고급 설정
                      <Badge variant="outline" className="font-normal">
                        분량·글자수·톤
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pb-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">분량</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {CONTENT_LENGTH_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setLengthMode(opt.id)}
                              className={cn(
                                "rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                                lengthMode === opt.id
                                  ? "border-primary bg-primary/10 ring-1 ring-primary/25"
                                  : "border-border/80 bg-background hover:bg-muted/50",
                              )}
                            >
                              <span className="font-medium">{opt.label}</span>
                              <span className="text-muted-foreground mt-0.5 block text-xs">
                                {opt.description}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="target-chars" className="text-xs font-medium">
                          목표 글자 수 (선택)
                        </Label>
                        <Input
                          id="target-chars"
                          type="number"
                          min={TARGET_CHARS_MIN}
                          max={TARGET_CHARS_MAX}
                          step={100}
                          inputMode="numeric"
                          placeholder={
                            lengthMode === "full"
                              ? "비우면 전체 글 기준(약 5,000~9,000자)"
                              : "비우면 초안 기준(약 1,500~2,800자)"
                          }
                          value={targetCharsInput}
                          onChange={(e) => setTargetCharsInput(e.target.value)}
                          className="h-10 rounded-xl"
                        />
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          숫자를 넣으면 초안/전체 설정보다 <strong className="font-medium text-foreground">우선</strong>
                          합니다. 허용 {TARGET_CHARS_MIN.toLocaleString()}~
                          {TARGET_CHARS_MAX.toLocaleString()}자.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tone-preset" className="text-xs font-medium">
                          톤·스타일
                        </Label>
                        <select
                          id="tone-preset"
                          value={tonePresetId}
                          onChange={(e) => setTonePresetId(e.target.value)}
                          className="border-input h-10 w-full rounded-xl border px-3 text-sm"
                        >
                          {CONTENT_TONE_PRESETS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                          <option value="custom">직접 입력</option>
                        </select>
                        {tonePresetId === "custom" ? (
                          <Input
                            value={customTone}
                            onChange={(e) => setCustomTone(e.target.value)}
                            placeholder="예: 유머 있게 · 밈 활용"
                            className="rounded-xl"
                          />
                        ) : null}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  aria-label="임시 저장 안내"
                  onClick={() => toast.message("에디터에서 직접 수정한 뒤 리포트에 저장하세요.")}
                >
                  <FileText className="size-4" />
                </Button>
                <Button
                  type="button"
                  disabled={phase === "generating"}
                  onClick={() => void generate()}
                  className={cn(
                    "h-12 min-w-[200px] flex-1 rounded-xl font-semibold shadow-md transition-all",
                    isPanda
                      ? "border-0 text-white shadow-none hover:opacity-[0.95]"
                      : "bg-gradient-to-r from-violet-600 via-violet-600 to-fuchsia-600 text-white hover:opacity-[0.96] dark:from-violet-500 dark:to-fuchsia-500",
                  )}
                  style={
                    isPanda
                      ? { backgroundColor: PANDA_GREEN }
                      : undefined
                  }
                  onMouseEnter={(e) => {
                    if (isPanda) (e.currentTarget as HTMLButtonElement).style.backgroundColor = PANDA_GREEN_HOVER
                  }}
                  onMouseLeave={(e) => {
                    if (isPanda) (e.currentTarget as HTMLButtonElement).style.backgroundColor = PANDA_GREEN
                  }}
                >
                  {phase === "generating" ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      생성 중…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 size-4" />
                      {lengthMode === "full" ? "전체 글 생성" : "AI로 초안 생성"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-12 rounded-xl"
                  onClick={() => {
                    setPhase("idle")
                    setDraft("")
                    setSource(null)
                    setGeneratedLength(null)
                  }}
                >
                  초기화
                </Button>
              </div>
            </div>
          </Card>

          {/* 최근 생성 */}
          <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
            <div className="px-4 py-3">
              <p className="text-sm font-semibold">최근 생성 글 (7일)</p>
            </div>
            <Link
              href="/reports"
              className="bg-emerald-600 hover:bg-emerald-700 flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-white transition-colors"
            >
              <span>저장된 리포트에서 노출·점수를 확인해 보세요</span>
              <ChevronRight className="size-4 shrink-0 opacity-90" />
            </Link>
            <div className="flex flex-wrap gap-2 p-4 pt-3">
              {recentReports.length === 0 ? (
                <p className="text-muted-foreground text-xs">아직 저장된 콘텐츠 리포트가 없습니다.</p>
              ) : (
                recentReports.map((r) => (
                  <Link
                    key={r.id}
                    href={`/reports/${r.id}`}
                    className="border-border/70 bg-muted/40 hover:bg-muted/70 max-w-full truncate rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                  >
                    {r.title}
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* 오른쪽: 트렌드 */}
        <aside className="space-y-3">
          <Card className="border-border/80 overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div
              className={cn(
                "border-border/60 px-4 py-3",
                isPanda ? "bg-[#00C95A]/10" : "bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10",
              )}
            >
              <div className="flex items-center gap-2">
                <Sparkles className={cn("size-4", isPanda ? "text-[#00C95A]" : "text-violet-600")} />
                <p className="text-sm font-bold">실시간 트렌드 주제</p>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {trendingSource === "live"
                  ? "Google 뉴스(한국) 상위 헤드라인을 주기적으로 반영합니다. 클릭하면 제목·키워드가 채워집니다."
                  : "선택한 글 유형에 맞는 예시 주제입니다. 클릭하면 제목·키워드가 함께 채워집니다."}
              </p>
              {trendingSource === "live" ? (
                <p className="text-primary mt-1.5 text-[10px] font-semibold">실시간 피드 연동</p>
              ) : trendingSource === "fallback" && !trendingLoading ? (
                <p className="text-muted-foreground mt-1.5 text-[10px]">오프라인 예시 목록</p>
              ) : null}
            </div>
            <ul className="divide-border/60 max-h-[min(70vh,520px)] divide-y overflow-y-auto">
              {trendingLoading ? (
                <li className="text-muted-foreground px-4 py-6 text-center text-xs">트렌드를 불러오는 중…</li>
              ) : null}
              {!trendingLoading && trendingTopics.length === 0 ? (
                <li className="text-muted-foreground px-4 py-6 text-center text-xs">표시할 주제가 없습니다.</li>
              ) : null}
              {trendingTopics.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => applyTrendTopic(item)}
                    className="hover:bg-muted/50 flex w-full items-start gap-3 px-4 py-3 text-left transition-colors"
                  >
                    <span className="bg-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                      <Sparkles className="size-3.5 text-white" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm font-medium leading-snug">{item.title}</span>
                      {item.keywords.length > 0 ? (
                        <span className="text-muted-foreground mt-1 line-clamp-1 block text-[11px]">
                          {item.keywords.slice(0, 4).join(" · ")}
                        </span>
                      ) : null}
                    </span>
                    {item.hot ? (
                      <Badge className="shrink-0 border-0 bg-red-500 text-[10px] font-semibold text-white">
                        급상승
                      </Badge>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>

      {/* 결과 — 전체 폭 */}
      <Card className="surface-card overflow-hidden rounded-2xl border-border/90 p-0 shadow-sm">
        <div className="border-border/60 flex flex-wrap items-center justify-between gap-2 border-b bg-muted/25 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">생성 결과</p>
            {source ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="rounded-full font-normal">
                  {source === "openai" ? "OpenAI" : "로컬 추정"}
                </Badge>
                <Badge variant="outline" className="rounded-full font-normal">
                  {(generatedLength ?? lengthMode) === "full" ? "전체 글" : "초안"}
                </Badge>
                {appliedCharTarget ? (
                  <Badge variant="outline" className="rounded-full font-normal tabular-nums">
                    {appliedCharTarget.label}
                  </Badge>
                ) : null}
              </div>
            ) : null}
          </div>
          {phase === "done" ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" size="sm" variant="secondary" className="rounded-full" onClick={copyBody}>
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
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-16 text-center text-sm">
              <Sparkles className="text-muted-foreground/50 size-10" />
              <p>위에서 제목·키워드를 입력한 뒤 보라색 버튼으로 AI 본문을 생성하세요.</p>
            </div>
          ) : null}

          {phase === "generating" ? (
            <div className="space-y-4" role="status" aria-live="polite">
              <div className="flex items-center justify-between gap-2">
                <p className="text-foreground text-sm font-medium">{loadingMessages[loadingIdx]}</p>
                <Badge className="border-primary/25 bg-primary/10 font-normal text-primary inline-flex items-center gap-1">
                  <Sparkles className="size-3" aria-hidden />
                  생성 중
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
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">종합</p>
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
                      <Button size="sm" variant="ghost" type="button" className="h-7 text-xs" onClick={() => applyTitleSuggestion(sug)}>
                        적용
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <Tabs defaultValue="body" className="gap-0">
                <TabsList className="h-9">
                  <TabsTrigger value="body" className="text-xs sm:text-sm">
                    본문
                  </TabsTrigger>
                  <TabsTrigger value="meta" className="text-xs sm:text-sm">
                    메타·요약
                  </TabsTrigger>
                  <TabsTrigger value="check" className="text-xs sm:text-sm">
                    체크리스트
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="body" className="mt-4 outline-none">
                  <Textarea
                    className={cn(
                      "resize-y rounded-xl font-mono text-sm",
                      (generatedLength ?? lengthMode) === "full" ? "min-h-[320px]" : "min-h-[220px]",
                    )}
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

              {isPanda ? (
                <Card className="mt-6 border-[#00C95A]/35 bg-[#00C95A]/[0.07] p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-4 shrink-0" style={{ color: PANDA_GREEN }} aria-hidden />
                    <p className="text-sm font-semibold">판다 AI와 이어서 다듬기</p>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    톤 변경·소제목 추가·요약 등을 입력하면 본문 전체를 요청에 맞게 다시 다듬습니다. (OPENAI 키가 있으면
                    품질이 높아집니다.)
                  </p>
                  <Textarea
                    className="mt-3 min-h-[88px] rounded-xl text-sm"
                    placeholder='예: 더 친근한 말투로 바꿔 줘 / "비용" 소제목 추가해 줘'
                    value={refineInput}
                    onChange={(e) => setRefineInput(e.target.value)}
                    disabled={refinePhase === "loading"}
                  />
                  <Button
                    type="button"
                    className="mt-3 w-full rounded-xl font-semibold text-white sm:w-auto"
                    style={{ backgroundColor: PANDA_GREEN }}
                    disabled={refinePhase === "loading" || phase !== "done"}
                    onClick={() => void runRefine()}
                  >
                    {refinePhase === "loading" ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        반영 중…
                      </>
                    ) : (
                      "요청 반영하기"
                    )}
                  </Button>
                </Card>
              ) : null}
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  )
}
