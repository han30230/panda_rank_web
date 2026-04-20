import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ReportNotFound() {
  return (
    <div className="bg-background flex min-h-[50vh] flex-col items-center justify-center p-6">
      <Card className="max-w-md rounded-3xl border-border/80 p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold">리포트를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          링크가 만료되었거나 ID가 올바르지 않을 수 있습니다.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button className="rounded-full" asChild>
            <Link href="/reports">리포트 목록</Link>
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/dashboard">홈</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
