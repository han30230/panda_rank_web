import { NextResponse } from "next/server"
import { z } from "zod"

import { TARGET_CHARS_MAX, TARGET_CHARS_MIN } from "@/lib/content-char-target"
import { generateWithOpenAI, heuristicGenerate } from "@/lib/content-generate"
import { normalizeContentPostTypeId } from "@/lib/naver-blog-prompts"

const bodySchema = z.object({
  topic: z.string().trim().min(1, "주제를 입력해 주세요."),
  keyword: z.string().trim().min(1, "핵심 키워드를 입력해 주세요."),
  tone: z.string().trim().optional().default("정보형 · 차분"),
  length: z.enum(["draft", "full"]).default("full"),
  postType: z.string().trim().optional().default("informative"),
  targetChars: z
    .number()
    .int()
    .min(TARGET_CHARS_MIN)
    .max(TARGET_CHARS_MAX)
    .optional(),
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

  const { topic, keyword, tone, length, postType, targetChars } = parsed.data
  const postTypeId = normalizeContentPostTypeId(postType)

  const ai = await generateWithOpenAI(topic, keyword, tone, length, postTypeId, targetChars)
  const result = ai ?? heuristicGenerate(topic, keyword, tone, length, postTypeId, targetChars)

  return NextResponse.json(result)
}
