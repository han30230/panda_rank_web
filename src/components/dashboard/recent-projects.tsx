import Link from "next/link"

import type { RecentProjectRow } from "@/lib/dashboard-summary"
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

export function RecentProjects({ rows }: { rows: RecentProjectRow[] }) {
  return (
    <Card className="surface-card overflow-hidden rounded-[1.05rem] p-0">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4 md:px-6">
        <p className="text-sm font-semibold">최근 작업</p>
        <Button variant="link" className="h-auto p-0 text-xs font-semibold" asChild>
          <Link href="/reports">전체 리포트</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="h-11 pl-6 text-xs font-semibold">유형</TableHead>
            <TableHead className="text-xs font-semibold">제목</TableHead>
            <TableHead className="text-xs font-semibold">상태</TableHead>
            <TableHead className="h-11 pr-6 text-right text-xs font-semibold">일자</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableCell colSpan={4} className="text-muted-foreground px-6 py-10 text-center text-sm">
                아직 저장된 리포트가 없습니다.{" "}
                <Link href="/analyze/keyword" className="text-primary font-medium underline underline-offset-4">
                  키워드 분석
                </Link>
                이나{" "}
                <Link href="/content/new" className="text-primary font-medium underline underline-offset-4">
                  콘텐츠 작성
                </Link>
                을 시작해 보세요.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => (
              <TableRow key={r.id} className="border-border/50">
                <TableCell className="pl-6 text-sm">{r.type}</TableCell>
                <TableCell className="max-w-[10rem] truncate text-sm font-medium sm:max-w-none">
                  <Link href={r.href} className="text-primary hover:underline">
                    {r.title}
                  </Link>
                </TableCell>
                <TableCell className="text-sm">
                  <Badge variant="outline" className="font-normal">
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6 text-right text-sm tabular-nums">{r.date}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
