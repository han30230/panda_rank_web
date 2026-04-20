import { AppHeader } from "@/components/app/app-header"
import { BillingActions } from "./billing-actions"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getSessionWithUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

const PLAN_LABEL = process.env.BILLING_PLAN_LABEL?.trim() || "프로"

export default async function BillingSettingsPage() {
  const session = await getSessionWithUser()
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  let reportsThisMonth = 0
  if (session) {
    reportsThisMonth = await prisma.report.count({
      where: { userId: session.userId, createdAt: { gte: monthStart } },
    })
  }

  const creditCap = Number(process.env.MONTHLY_CREDIT_CAP ?? 5000)
  const creditPerReport = Number(process.env.CREDITS_PER_REPORT ?? 80)
  const used = Math.min(reportsThisMonth * creditPerReport, creditCap)
  const pct = Math.round((used / creditCap) * 100)
  const fmt = new Intl.NumberFormat("ko-KR")

  return (
    <>
      <AppHeader
        title="결제 · 플랜"
        description="청구 주기와 이번 달 리포트 사용량을 확인합니다."
      />
      <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 p-4 md:p-6">
        <Card className="rounded-2xl border-border/80 p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">현재 플랜</p>
              <p className="mt-1 text-2xl font-semibold">{PLAN_LABEL}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {session
                  ? "로그인된 계정 기준으로 사용량을 집계합니다."
                  : "로그인하면 사용량이 표시됩니다."}
              </p>
            </div>
            <Badge className="rounded-full">활성</Badge>
          </div>
          <Separator className="my-6" />
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">이번 달 생성한 리포트</span>{" "}
              <span className="font-semibold tabular-nums">{reportsThisMonth}건</span>
            </p>
            <p>
              <span className="text-muted-foreground">크레딧 사용(추정)</span>{" "}
              <span className="font-semibold tabular-nums">
                {fmt.format(used)} / {fmt.format(creditCap)} ({pct}%)
              </span>
            </p>
            <p className="text-muted-foreground text-xs">
              리포트 1건당 약 {creditPerReport} 크레딧으로 산정합니다. 환경 변수{" "}
              <code className="text-[11px]">MONTHLY_CREDIT_CAP</code>,{" "}
              <code className="text-[11px]">CREDITS_PER_REPORT</code>로 조정할 수 있습니다.
            </p>
          </div>
          <Separator className="my-6" />
          <BillingActions />
        </Card>
        <Card className="rounded-2xl border-border/80 p-6 shadow-sm">
          <p className="text-sm font-medium">청구 내역</p>
          <p className="text-muted-foreground mt-3 text-sm">
            외부 결제(Stripe·토스 등)를 연동하면 이곳에 인보이스가 표시됩니다. 지금은 앱 내 사용량만
            집계합니다.
          </p>
        </Card>
      </div>
    </>
  )
}
