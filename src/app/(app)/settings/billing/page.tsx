import { AppHeader } from "@/components/app/app-header"
import { BillingActions } from "./billing-actions"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function BillingSettingsPage() {
  return (
    <>
      <AppHeader
        title="결제 · 플랜"
        description="청구 주기와 사용량을 확인합니다."
      />
      <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 p-4 md:p-6">
        <Card className="rounded-2xl border-border/80 p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">현재 플랜</p>
              <p className="mt-1 text-2xl font-semibold">프로</p>
              <p className="text-muted-foreground mt-1 text-xs">
                다음 청구일 · 2026년 5월 12일
              </p>
            </div>
            <Badge className="rounded-full">활성</Badge>
          </div>
          <Separator className="my-6" />
          <BillingActions />
        </Card>
        <Card className="rounded-2xl border-border/80 p-6 shadow-sm">
          <p className="text-sm font-medium">청구 내역</p>
          <p className="text-muted-foreground mt-3 text-sm">
            데모 환경에서는 표시되지 않습니다.
          </p>
        </Card>
      </div>
    </>
  )
}
