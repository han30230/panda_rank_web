import { NextResponse } from "next/server"
import { z } from "zod"

import { analyzeKeywordWithOpenAI, heuristicAnalyze } from "@/lib/keyword-analyze"

const bodySchema = z.object({
  keyword: z.string().trim().min(1, "키워드를 입력해 주세요."),
  locale: z.string().trim().optional().default("한국"),
  lang: z.string().trim().optional().default("ko"),
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

  const { keyword, locale, lang } = parsed.data

  const ai = await analyzeKeywordWithOpenAI(keyword, locale, lang)
  const result = ai ?? heuristicAnalyze(keyword)

  return NextResponse.json(result)
}
