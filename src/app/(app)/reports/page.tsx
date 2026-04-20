import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { AppHeader } from "@/components/app/app-header"
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
import { listMockReports } from "@/lib/mock-reports"

export default function ReportsListPage() {
  const rows = listMockReports()

  return (
    <>
      <AppHeader
        title="리포트"
        description="분석·콘텐츠 결과를 프로젝트 단위로 보관합니다."
      />
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <Card className="rounded-2xl border-border/80 p-0 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">유형</TableHead>
                <TableHead className="text-xs">제목</TableHead>
                <TableHead className="text-xs">상태</TableHead>
                <TableHead className="text-right text-xs">수정일</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs">
                    {r.kind === "analyze" ? "분석" : "콘텐츠"}
                  </TableCell>
                  <TableCell className="text-xs font-medium">{r.title}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant="outline" className="font-normal">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs tabular-nums">
                    {r.updatedAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" asChild>
                      <Link href={`/reports/${r.id}`} aria-label={`${r.title} 열기`}>
                        <ChevronRight className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <p className="text-muted-foreground text-xs">
          데모 데이터입니다. 실제 제품에서는 검색·필터·태그가 추가됩니다.
        </p>
      </div>
    </>
  )
}
