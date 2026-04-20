"use client"

import { useMemo, useState } from "react"
import { GitCompareArrows } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { jaccardSimilarity, sharedTokens } from "@/lib/text-compare"

function countChars(s: string) {
  return s.length
}

function countHangulWords(s: string) {
  const hangul = s.match(/[\uAC00-\uD7A3]{2,}/g)?.length ?? 0
  const latin = s.match(/[a-zA-Z]{3,}/g)?.length ?? 0
  return hangul + latin
}

export function CompareClient() {
  const [a, setA] = useState("")
  const [b, setB] = useState("")

  const stats = useMemo(() => {
    const jac = jaccardSimilarity(a, b)
    const shared = sharedTokens(a, b, 32)
    return {
      jac,
      shared,
      lenA: countChars(a),
      lenB: countChars(b),
      tokA: countHangulWords(a),
      tokB: countHangulWords(b),
    }
  }, [a, b])

  function swap() {
    setA(b)
    setB(a)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <Card className="surface-analytics rounded-2xl p-6">
        <h2 className="text-sm font-semibold">원문 A</h2>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          블로그 초안·경쟁 글·랜딩 문구 등을 붙여 넣습니다. 비교는 브라우저에서만 처리됩니다.
        </p>
        <div className="mt-4 space-y-2">
          <Label htmlFor="cmp-a" className="sr-only">
            원문 A
          </Label>
          <Textarea
            id="cmp-a"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="첫 번째 본문…"
            className="min-h-[220px] rounded-xl font-mono text-sm"
          />
          <p className="text-muted-foreground text-xs tabular-nums">
            {stats.lenA.toLocaleString()}자 · 추정 토큰 {stats.tokA}
          </p>
        </div>
      </Card>

      <Card className="surface-analytics rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">원문 B</h2>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              두 번째 글과 단어 겹침·유사도를 봅니다.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={swap}
          >
            <GitCompareArrows className="size-3.5" />
            A↔B 교환
          </Button>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="cmp-b" className="sr-only">
            원문 B
          </Label>
          <Textarea
            id="cmp-b"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="두 번째 본문…"
            className="min-h-[220px] rounded-xl font-mono text-sm"
          />
          <p className="text-muted-foreground text-xs tabular-nums">
            {stats.lenB.toLocaleString()}자 · 추정 토큰 {stats.tokB}
          </p>
        </div>
      </Card>

      <Card className="surface-card rounded-2xl border-border/90 p-6 lg:col-span-2">
        <h2 className="text-sm font-semibold">겹침 요약</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          자카드 유사도(한글 2자 이상·영단어 3자 이상 토큰 기준). 서버로 전송하지 않습니다.
        </p>
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <p className="text-3xl font-semibold tabular-nums text-primary">
            {(stats.jac * 100).toFixed(1)}
            <span className="text-muted-foreground text-lg font-normal">%</span>
          </p>
          <span className="text-muted-foreground text-sm">토큰 집합 유사도</span>
        </div>
        <div className="mt-4">
          <p className="text-muted-foreground text-xs font-medium">공통 토큰</p>
          {stats.shared.length === 0 ? (
            <p className="text-muted-foreground mt-2 text-sm">
              {a.trim() || b.trim()
                ? "겹치는 토큰이 없습니다."
                : "양쪽에 본문을 입력하면 공통어가 표시됩니다."}
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {stats.shared.map((t) => (
                <Badge key={t} variant="secondary" className="font-normal">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
