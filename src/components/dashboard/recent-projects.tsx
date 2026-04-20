import Link from "next/link"

import { recentProjects } from "@/constants/dashboard"
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

type RecentProjectsProps = {
  /** 추후 `/api/projects` 연결 시 서버에서 전달 */
  rows?: typeof recentProjects
}

export function RecentProjects({ rows = recentProjects }: RecentProjectsProps) {
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
          {rows.map((r) => (
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
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
