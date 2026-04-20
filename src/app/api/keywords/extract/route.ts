import { NextResponse } from "next/server"
import { z } from "zod"

import { extractKeywordsFromText } from "@/lib/keyword-extract"

const bodySchema = z.object({
  text: z.string().max(80_000),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
})

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { text, limit } = parsed.data
  const trimmed = text.trim()
  if (!trimmed) {
    return NextResponse.json({ error: "본문을 입력해 주세요." }, { status: 400 })
  }

  const keywords = extractKeywordsFromText(trimmed, limit)
  return NextResponse.json({ keywords })
}
