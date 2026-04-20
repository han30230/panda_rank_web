import {
  ImageIcon,
  LayoutList,
  Link2,
  ScanSearch,
  Sparkles,
  Target,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: ScanSearch,
    title: "키워드 & 의도",
    body: "검색 결과 유형과 질문형 쿼리를 묶어 콘텐츠 각도를 제안합니다.",
  },
  {
    icon: Target,
    title: "경쟁 스냅샷",
    body: "상위 결과의 공통 헤딩과 토픽 갭을 빠르게 스캔합니다.",
  },
  {
    icon: Sparkles,
    title: "AI 초안",
    body: "톤·길이·금지어를 반영해 초안 버전을 나란히 비교합니다.",
  },
  {
    icon: LayoutList,
    title: "온페이지 체크",
    body: "제목, 메타, H 구조, 내부 링크를 체크리스트로 정리합니다.",
  },
  {
    icon: Link2,
    title: "내보내기",
    body: "마크다운·HTML·요약 링크로 팀과 공유하기 쉽게 만듭니다.",
  },
  {
    icon: ImageIcon,
    title: "에셋 자리",
    body: "썸네일·대표 이미지 프롬프트 슬롯을 글 작업과 붙여 둡니다.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              많아 보여도, 한 화면에서 끝나는 도구 모음
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
              각 카드는 하나의 목적만 말합니다. 깊이는 분석 페이지에서 이어집니다.
            </p>
          </div>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/dashboard">앱 둘러보기</Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="rounded-2xl border-border/80 p-6 shadow-sm transition-all hover:border-primary/25 hover:shadow-md"
            >
              <div className="bg-muted mb-4 flex size-10 items-center justify-center rounded-xl">
                <f.icon className="text-foreground size-5" aria-hidden />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{f.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
