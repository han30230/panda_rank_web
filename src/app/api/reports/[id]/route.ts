import { NextResponse } from "next/server"
import { z } from "zod"

import { getSessionWithUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { toReportRow } from "@/lib/report-dto"

const patchSchema = z.object({
  title: z.string().trim().min(1).optional(),
  status: z.enum(["완료", "검토", "실행중"]).optional(),
  summary: z.string().trim().min(1).optional(),
  intent: z.string().trim().optional(),
  outline: z.array(z.string()).optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
})

async function getOwnedReport(id: string, userId: string) {
  return prisma.report.findFirst({
    where: { id, userId },
  })
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const session = await getSessionWithUser()
  if (!session) {
    return NextResponse.json({ error: "세션이 없습니다." }, { status: 401 })
  }

  const report = await getOwnedReport(id, session.userId)
  if (!report) {
    return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 })
  }

  return NextResponse.json({ report: toReportRow(report) })
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const session = await getSessionWithUser()
  if (!session) {
    return NextResponse.json({ error: "세션이 없습니다." }, { status: 401 })
  }

  const existing = await getOwnedReport(id, session.userId)
  if (!existing) {
    return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const d = parsed.data
  const report = await prisma.report.update({
    where: { id },
    data: {
      ...(d.title !== undefined ? { title: d.title } : {}),
      ...(d.status !== undefined ? { status: d.status } : {}),
      ...(d.summary !== undefined ? { summary: d.summary } : {}),
      ...(d.intent !== undefined ? { intent: d.intent } : {}),
      ...(d.outline !== undefined ? { outline: d.outline } : {}),
      ...(d.metaTitle !== undefined ? { metaTitle: d.metaTitle } : {}),
      ...(d.metaDescription !== undefined ? { metaDescription: d.metaDescription } : {}),
    },
  })

  return NextResponse.json({ report: toReportRow(report) })
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const session = await getSessionWithUser()
  if (!session) {
    return NextResponse.json({ error: "세션이 없습니다." }, { status: 401 })
  }

  const existing = await getOwnedReport(id, session.userId)
  if (!existing) {
    return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 })
  }

  await prisma.report.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
