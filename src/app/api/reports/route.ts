import { NextResponse } from "next/server"
import { z } from "zod"

import { getSessionWithUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { toReportRow } from "@/lib/report-dto"

const createSchema = z.object({
  title: z.string().trim().min(1),
  kind: z.enum(["analyze", "content"]),
  status: z.enum(["완료", "검토", "실행중"]),
  keyword: z.string().trim().optional(),
  summary: z.string().trim().min(1),
  intent: z.string().trim().optional(),
  outline: z.array(z.string()),
  metaTitle: z.string().trim().min(1),
  metaDescription: z.string().trim().min(1),
})

export async function GET() {
  const session = await getSessionWithUser()
  if (!session) {
    return NextResponse.json({ error: "세션이 없습니다." }, { status: 401 })
  }

  const rows = await prisma.report.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json({ reports: rows.map(toReportRow) })
}

export async function POST(req: Request) {
  const session = await getSessionWithUser()
  if (!session) {
    return NextResponse.json({ error: "세션이 없습니다." }, { status: 401 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 })
  }

  const parsed = createSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const d = parsed.data
  const report = await prisma.report.create({
    data: {
      userId: session.userId,
      title: d.title,
      kind: d.kind,
      status: d.status,
      keyword: d.keyword,
      summary: d.summary,
      intent: d.intent,
      outline: d.outline,
      metaTitle: d.metaTitle,
      metaDescription: d.metaDescription,
    },
  })

  return NextResponse.json({ report: toReportRow(report) })
}
