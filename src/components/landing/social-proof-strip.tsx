const labels = ["Studio North", "Bloom Retail", "Atlas Media", "River Labs", "Pixel & Co"]

const stats = [
  { label: "월간 분석 요청", value: "32만건" },
  { label: "평균 응답", value: "~2초" },
  { label: "업타임", value: "99.9%" },
]

export function SocialProofStrip() {
  return (
    <section className="border-b border-border/50 bg-muted/25">
      <div className="marketing-container py-12 md:py-14">
        <p className="text-eyebrow text-center">함께하는 팀</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
          {labels.map((name) => (
            <span
              key={name}
              className="text-muted-foreground hover:text-foreground/90 text-sm font-semibold tracking-tight transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/45 pt-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-caption font-medium uppercase tracking-wide">{s.label}</p>
              <p className="mt-2 text-lg font-semibold tabular-nums tracking-tight md:text-xl">{s.value}</p>
            </div>
          ))}
        </div>
        <p className="text-caption mt-6 text-center">상단 수치는 표시용 예시입니다.</p>
      </div>
    </section>
  )
}
