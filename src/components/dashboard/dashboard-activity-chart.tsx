import { Card } from "@/components/ui/card"

/** 정적 미니 차트 — 외부 라이브러리 없이 추이만 표현 */
export function DashboardActivityChart() {
  const weeks = [
    { label: "4/1", h: "h-[3.2rem]" },
    { label: "4/8", h: "h-[4.4rem]" },
    { label: "4/15", h: "h-[3.8rem]" },
    { label: "4/22", h: "h-[5.6rem]" },
  ]

  return (
    <Card className="surface-card rounded-[1.05rem] px-6 py-7 md:px-7">
      <div>
        <p className="text-sm font-semibold">주간 분석 추이</p>
        <p className="text-muted-foreground mt-1 text-xs">데모용 정적 막대입니다.</p>
      </div>
      <div className="mt-8 flex h-32 items-end justify-between gap-3 border-b border-border/40 pb-1">
        {weeks.map((w) => (
          <div key={w.label} className="flex flex-1 flex-col items-center gap-3">
            <div
              className={`bg-primary/85 w-full max-w-[2.75rem] rounded-t-md ${w.h}`}
              title={`${w.label}`}
            />
            <span className="text-muted-foreground text-[10px] font-medium tabular-nums">{w.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
