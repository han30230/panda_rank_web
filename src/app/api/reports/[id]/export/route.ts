import { NextResponse } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

import { getSessionWithUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

function outlineToLines(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String)
  return []
}

function chunkLines(text: string, max = 90): string[] {
  const lines: string[] = []
  const paragraphs = text.split(/\n/)
  for (const p of paragraphs) {
    let rest = p
    while (rest.length > max) {
      lines.push(rest.slice(0, max))
      rest = rest.slice(max)
    }
    if (rest.length) lines.push(rest)
  }
  return lines.length ? lines : [""]
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

  const report = await prisma.report.findFirst({
    where: { id, userId: session.userId },
  })
  if (!report) {
    return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 })
  }

  const outline = outlineToLines(report.outline)

  const pdf = await PDFDocument.create()
  let font = await pdf.embedFont(StandardFonts.Helvetica)
  try {
    const fontUrl =
      "https://raw.githubusercontent.com/googlefonts/noto-cjk/main/Sans/OTF/Korean/NotoSansKR-Regular.otf"
    const buf = await fetch(fontUrl).then((r) => r.arrayBuffer())
    font = await pdf.embedFont(buf)
  } catch {
    /* 한글 미지원 시 Helvetica */
  }

  const pageSize: [number, number] = [595.28, 841.89]
  let page = pdf.addPage(pageSize)
  const { width, height } = page.getSize()
  const margin = 48
  let y = height - margin
  const lineH = 14
  const fontSize = 10
  const titleSize = 16

  const drawLines = (lines: string[], size = fontSize) => {
    for (const line of lines) {
      if (y < margin + lineH * 2) {
        page = pdf.addPage(pageSize)
        y = height - margin
      }
      page.drawText(line, {
        x: margin,
        y,
        size,
        font,
        color: rgb(0.12, 0.12, 0.14),
        maxWidth: width - margin * 2,
      })
      y -= lineH + (size > fontSize ? 4 : 2)
    }
  }

  drawLines([report.title], titleSize)
  y -= 6
  drawLines(
    chunkLines(
      `${report.kind === "analyze" ? "분석" : "콘텐츠"} · ${report.status} · ${report.updatedAt.toISOString().slice(0, 10)}`,
    ),
    9,
  )
  if (report.keyword) {
    drawLines(chunkLines(`키워드: ${report.keyword}`), 9)
  }
  y -= 8
  drawLines(["요약"], 12)
  drawLines(chunkLines(report.summary, 85))
  if (report.intent) {
    y -= 4
    drawLines(["의도 추정"], 12)
    drawLines(chunkLines(report.intent, 85))
  }
  y -= 4
  drawLines(["제안 목차"], 12)
  outline.forEach((line, i) => {
    drawLines(chunkLines(`${i + 1}. ${line}`, 85))
  })
  y -= 4
  drawLines(["메타 제안"], 12)
  drawLines(chunkLines(`Title: ${report.metaTitle}`, 85))
  drawLines(chunkLines(`Description: ${report.metaDescription}`, 85))

  const bytes = await pdf.save()
  const filename = `report-${report.id.slice(0, 8)}.pdf`

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
