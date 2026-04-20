import { NextResponse } from "next/server"
import { z } from "zod"

import { generateWithOpenAI, heuristicGenerate } from "@/lib/content-generate"

const bodySchema = z.object({
  topic: z.string().trim().min(1, "주제를 입력해 주세요."),
  keyword: z.string().trim().min(1, "핵심 키워드를 입력해 주세요."),
  tone: z.string().trim().optional().default("정보형 · 차분"),
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

  const { topic, keyword, tone } = parsed.data

  const ai = await generateWithOpenAI(topic, keyword, tone)
  const result = ai ?? heuristicGenerate(topic, keyword, tone)

  return NextResponse.json(result)
}
