import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

/** 주간 추이 — 그리드·Y축 라벨로 분석 UI 인상 강화 */
export function DashboardActivityChart() {
  const weeks = [
    { label: "4/1", h: "h-[3.2rem]", v: 12 },
    { label: "4/8", h: "h-[4.4rem]", v: 18 },
    { label: "4/15", h: "h-[3.8rem]", v: 15 },
    { label: "4/22", h: "h-[5.6rem]", v: 24 },
  ]
  const maxV = Math.max(...weeks.map((w) => w.v))

  return (
    <Card className="surface-analytics overflow-hidden rounded-[1.05rem]">
      <div className="border-border/60 flex flex-wrap items-start justify-between gap-3 border-b bg-muted/30 px-6 py-4 md:px-7">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold tracking-tight">주간 분석 추이</p>
            <Badge variant="secondary" className="font-normal text-[10px]">
              샘플 데이터
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            팀 대시보드와 동일한 스케일로 확장됩니다.
          </p>
        </div>
        <p className="text-muted-foreground text-[11px] font-medium tabular-nums">단위: 건</p>
      </div>
      <div className="px-6 py-6 md:px-7 md:py-7">
        <div className="relative rounded-lg border border-border/60 bg-[repeating-linear-gradient(0deg,transparent,transparent_23px,oklch(0.5_0.02_252/0.08)_23px,oklch(0.5_0.02_252/0.08)_24px)] p-4 pl-10 pt-8">
          <div className="text-muted-foreground pointer-events-none absolute left-3 top-2 flex h-[7.5rem] flex-col justify-between text-[9px] font-semibold tabular-nums">
            <span>{maxV}</span>
            <span>{Math.round(maxV / 2)}</span>
            <span>0</span>
          </div>
          <div className="ml-1 flex h-36 items-end justify-between gap-2 border-b border-border/70 pb-0.5">
            {weeks.map((w) => (
              <div key={w.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex w-full max-w-[3rem] flex-1 flex-col justify-end">
                  <div
                    className={`bg-primary w-full rounded-t-[4px] shadow-[0_-1px_0_oklch(0.48_0.11_188/0.2)_inset] ${w.h}`}
                    style={{ opacity: 0.72 + w.v / 120 }}
                    title={`${w.label} · 약 ${w.v}건`}
                  />
                </div>
                <span className="text-muted-foreground w-full truncate text-center text-[10px] font-semibold tabular-nums">
                  {w.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
