import Link from "next/link"
import { notFound } from "next/navigation"

import { AppHeader } from "@/components/app/app-header"
import { ReportDetailToolbar } from "@/components/reports/report-detail-toolbar"
import { ReportMetaCopyButton } from "@/components/reports/report-meta-copy-button"
import { ReportsSessionGate } from "@/components/reports/reports-session-gate"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSessionWithUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { toReportRow } from "@/lib/report-dto"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await getSessionWithUser()
  if (!session) {
    return (
      <>
        <AppHeader title="리포트" description="불러오는 중…" />
        <ReportsSessionGate />
      </>
    )
  }

  const row = await prisma.report.findFirst({
    where: { id, userId: session.userId },
  })
  if (!row) notFound()

  const report = toReportRow(row)

  return (
    <>
      <AppHeader
        title={report.title}
        description={`${report.kind === "analyze" ? "분석" : "콘텐츠"} 리포트 · ${report.updatedAt}`}
        action={
          <ReportDetailToolbar reportId={report.id} className="hidden sm:flex" />
        }
      />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            {report.kind === "analyze" ? "분석" : "콘텐츠"}
          </Badge>
          <Badge variant="outline" className="rounded-full font-normal">
            {report.status}
          </Badge>
          {report.keyword ? (
            <span className="text-muted-foreground text-xs">
              키워드: <span className="text-foreground font-medium">{report.keyword}</span>
            </span>
          ) : null}
        </div>

        <ReportDetailToolbar reportId={report.id} className="sm:hidden" />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="h-10 w-full justify-start overflow-x-auto rounded-xl md:w-auto">
            <TabsTrigger value="overview" className="rounded-lg">
              개요
            </TabsTrigger>
            <TabsTrigger value="outline" className="rounded-lg">
              목차·각도
            </TabsTrigger>
            <TabsTrigger value="meta" className="rounded-lg">
              메타
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6 outline-none">
            <Card className="rounded-2xl border-border/80 p-6 shadow-sm">
              <h2 className="text-sm font-medium">요약</h2>
              <p className="mt-3 text-sm leading-relaxed">{report.summary}</p>
              {report.intent ? (
                <>
                  <Separator className="my-6" />
                  <h3 className="text-sm font-medium">의도 추정</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{report.intent}</p>
                </>
              ) : null}
            </Card>
          </TabsContent>
          <TabsContent value="outline" className="mt-6 outline-none">
            <Card className="rounded-2xl border-border/80 p-6 shadow-sm">
              <h2 className="text-sm font-medium">제안 목차</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
                {report.outline.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <Button className="mt-6 rounded-full" asChild>
                <Link href="/content/new">이 목차로 초안 만들기</Link>
              </Button>
            </Card>
          </TabsContent>
          <TabsContent value="meta" className="mt-6 outline-none">
            <Card className="rounded-2xl border-border/80 p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-medium">메타 제안</h2>
                  <p className="mt-3 text-sm font-medium">{report.meta.title}</p>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {report.meta.description}
                  </p>
                </div>
                <ReportMetaCopyButton
                  title={report.meta.title}
                  description={report.meta.description}
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/reports">목록으로</Link>
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/analyze/keyword">다시 분석</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
