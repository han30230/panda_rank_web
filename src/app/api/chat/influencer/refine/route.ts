import { NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({
  draft: z.string().trim().min(20, "본문이 너무 짧습니다."),
  instruction: z.string().trim().min(1, "어떻게 바꿀지 입력해 주세요.").max(800),
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

  const { draft, instruction } = parsed.data
  const key = process.env.OPENAI_API_KEY?.trim()

  if (key) {
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.55,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You edit Korean Naver blog posts. Output JSON only: {"body": string}.
Rules: Plain Korean only. No Markdown (no **, #, - bullets). Section lines may start with ◆ or ■ at line start + space + title. Blank line between paragraphs. Apply the user's instruction to the full draft while keeping topic and keywords coherent.`,
          },
          {
            role: "user",
            content: `현재 본문:\n${draft}\n\n수정 요청:\n${instruction}\n\n전체 본문을 요청에 맞게 수정한 결과만 JSON으로 주세요.`,
          },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("refine error", res.status, err)
      return NextResponse.json({ error: "다듬기 요청에 실패했습니다." }, { status: 502 })
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const raw = data.choices?.[0]?.message?.content
    if (!raw) {
      return NextResponse.json({ error: "응답이 비었습니다." }, { status: 502 })
    }

    try {
      const obj = JSON.parse(raw) as { body?: string }
      if (!obj.body || typeof obj.body !== "string") {
        return NextResponse.json({ error: "형식이 올바르지 않습니다." }, { status: 502 })
      }
      return NextResponse.json({ body: obj.body.trim() })
    } catch {
      return NextResponse.json({ error: "파싱에 실패했습니다." }, { status: 502 })
    }
  }

  // 키 없음: 요청을 본문 말미에 반영한 안내 문단 추가 (로컬 폴백)
  const note = `◆ 요청 반영 메모

아래는 "${instruction.slice(0, 120)}${instruction.length > 120 ? "…" : ""}"에 대한 수정 방향을 반영한 추가 문단입니다. OPENAI_API_KEY가 설정되면 전체 본문이 한 번에 다듬어집니다.

위 내용을 참고해 직접 문장을 고치시거나, 다시 다듬기를 시도해 보세요.`
  return NextResponse.json({ body: `${draft.trim()}\n\n${note}` })
}
