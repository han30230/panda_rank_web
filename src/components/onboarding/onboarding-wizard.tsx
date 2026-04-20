"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { saveOnboardingProfile } from "@/lib/local-auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

const roles = [
  { id: "marketer", label: "콘텐츠 마케터", hint: "캠페인·블로그·리드" },
  { id: "creator", label: "크리에이터", hint: "채널·뉴스레터" },
  { id: "operator", label: "운영·셀러", hint: "상세페이지·카테고리" },
] as const

const goals = [
  { id: "traffic", label: "검색 유입" },
  { id: "conversion", label: "전환·매출" },
  { id: "cadence", label: "발행 캐던스" },
] as const

const steps = 4

export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<(typeof roles)[number]["id"] | null>(null)
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set())
  const [siteUrl, setSiteUrl] = useState("")

  const progress = Math.round((step / steps) * 100)

  function toggleGoal(id: string) {
    setSelectedGoals((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function next() {
    if (step === 1 && !role) return
    if (step === 2 && selectedGoals.size === 0) return
    setStep((s) => Math.min(s + 1, steps))
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1))
  }

  function finish() {
    if (role) {
      saveOnboardingProfile({
        role,
        goals: Array.from(selectedGoals),
        siteUrl: siteUrl.trim(),
      })
    }
    router.push("/dashboard")
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 md:py-16">
      <div className="mb-8">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          시작하기 · {step}/{steps}
        </p>
        <Progress value={progress} className="mt-3 h-2" />
      </div>

      {step === 1 ? (
        <Card className="rounded-3xl border-border/80 p-6 shadow-sm md:p-8">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            어떤 역할에 가장 가깝나요?
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            대시보드 추천 액션을 맞춤화하는 데 쓰입니다.
          </p>
          <div className="mt-6 space-y-3">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  role === r.id
                    ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/80 hover:border-primary/25"
                }`}
              >
                <p className="font-medium">{r.label}</p>
                <p className="text-muted-foreground mt-1 text-xs">{r.hint}</p>
              </button>
            ))}
          </div>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card className="rounded-3xl border-border/80 p-6 shadow-sm md:p-8">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            이번 분기 목표를 고르세요
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">복수 선택 가능합니다.</p>
          <div className="mt-6 space-y-3">
            {goals.map((g) => (
              <label
                key={g.id}
                className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-2xl border border-border/80 p-4"
              >
                <Checkbox
                  checked={selectedGoals.has(g.id)}
                  onCheckedChange={() => toggleGoal(g.id)}
                />
                <span className="text-sm font-medium">{g.label}</span>
              </label>
            ))}
          </div>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card className="rounded-3xl border-border/80 p-6 shadow-sm md:p-8">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            사이트나 채널 URL이 있나요?
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            나중에 설정에서도 연결할 수 있습니다.
          </p>
          <div className="mt-6 space-y-2">
            <Label htmlFor="site">URL (선택)</Label>
            <Input
              id="site"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://"
              className="rounded-xl"
            />
          </div>
        </Card>
      ) : null}

      {step === 4 ? (
        <Card className="rounded-3xl border-border/80 p-6 shadow-sm md:p-8">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            설정이 준비됐습니다
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            대시보드에서 첫 작업을 이어갈 수 있습니다.
          </p>
          <ul className="text-muted-foreground mt-6 space-y-2 text-sm">
            <li>
              · 역할:{" "}
              <span className="text-foreground font-medium">
                {roles.find((r) => r.id === role)?.label ?? "—"}
              </span>
            </li>
            <li>
              · 목표:{" "}
              <span className="text-foreground font-medium">
                {selectedGoals.size
                  ? goals
                      .filter((g) => selectedGoals.has(g.id))
                      .map((g) => g.label)
                      .join(", ")
                  : "—"}
              </span>
            </li>
            <li>
              · URL:{" "}
              <span className="text-foreground font-medium">
                {siteUrl.trim() || "나중에 연결"}
              </span>
            </li>
          </ul>
          <Button className="mt-8 w-full rounded-xl" type="button" onClick={finish}>
            대시보드로 이동
          </Button>
          <Button variant="ghost" className="mt-2 w-full rounded-xl" asChild>
            <Link href="/analyze/keyword">바로 분석하기</Link>
          </Button>
        </Card>
      ) : null}

      {step < 4 ? (
        <div className="mt-8 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={step === 1}
            onClick={back}
          >
            이전
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-xl"
            disabled={
              (step === 1 && !role) ||
              (step === 2 && selectedGoals.size === 0)
            }
            onClick={next}
          >
            다음
          </Button>
        </div>
      ) : null}
    </div>
  )
}
