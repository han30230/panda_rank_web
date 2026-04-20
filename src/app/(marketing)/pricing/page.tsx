import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "요금제",
  description: `${siteConfig.name} 플랜 비교 및 크레딧 안내`,
}

const plans = [
  {
    name: "스타터",
    price: "₩0",
    cadence: "/월",
    blurb: "개인 크리에이터가 흐름을 익히기에 충분합니다.",
    features: ["월 20회 분석", "크레딧 300", "단일 워크스페이스", "이메일 지원"],
    cta: "시작하기",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "프로",
    price: "₩39,000",
    cadence: "/월",
    blurb: "콘텐츠 팀이 매주 리포트를 돌리기 좋습니다.",
    features: [
      "무제한 분석*",
      "크레딧 4,000",
      "버전 비교",
      "우선 응답",
    ],
    cta: "7일 무료 체험",
    href: "/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "팀",
    price: "문의",
    cadence: "",
    blurb: "초대·권한·감사 로그가 필요한 조직용입니다.",
    features: ["SSO 옵션", "공유 리포트", "웹훅", "전담 CSM"],
    cta: "영업팀에 문의",
    href: siteConfig.links.sales,
    highlighted: false,
  },
]

const matrix = [
  { feature: "키워드·의도 리포트", starter: true, pro: true, team: true },
  { feature: "AI 초안 생성", starter: true, pro: true, team: true },
  { feature: "버전 비교", starter: false, pro: true, team: true },
  { feature: "API·웹훅", starter: false, pro: false, team: true },
]

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">요금제</h1>
        <p className="text-muted-foreground mt-4 text-sm md:text-base">
          사용량이 보이면 팀이 결정을 빠르게 내립니다. 모든 플랜에 무료 체험 구간이 있습니다.
        </p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={`relative flex flex-col rounded-3xl border p-8 shadow-sm ${
              p.highlighted
                ? "border-primary/40 shadow-md shadow-primary/10 ring-1 ring-primary/20"
                : "border-border/80"
            }`}
          >
            {p.highlighted ? (
              <Badge className="absolute -top-3 left-6 rounded-full">많이 선택됨</Badge>
            ) : null}
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-muted-foreground mt-2 min-h-10 text-sm">{p.blurb}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-3xl font-semibold tabular-nums">{p.price}</span>
              <span className="text-muted-foreground text-sm">{p.cadence}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="mt-8 w-full rounded-full"
              variant={p.highlighted ? "default" : "outline"}
              asChild
            >
              <Link href={p.href}>{p.cta}</Link>
            </Button>
          </Card>
        ))}
      </div>
      <p className="text-muted-foreground mt-4 text-center text-xs">
        * 공정 사용 정책 적용. 세부 한도는 대시보드에서 확인하세요.
      </p>

      <div className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">기능 비교</h2>
        <Card className="mt-6 overflow-hidden rounded-2xl border-border/80">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%]">기능</TableHead>
                <TableHead>스타터</TableHead>
                <TableHead>프로</TableHead>
                <TableHead>팀</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrix.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell className="font-medium">{row.feature}</TableCell>
                  <TableCell>{row.starter ? "✓" : "—"}</TableCell>
                  <TableCell>{row.pro ? "✓" : "—"}</TableCell>
                  <TableCell>{row.team ? "✓" : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
