import { createHash } from "crypto"

import { z } from "zod"

export type ContentScores = {
  seo: number
  keywordFit: number
  readability: number
}

export type ContentGenerateResult = {
  body: string
  meta: { title: string; description: string }
  titleSuggestions: string[]
  scores: ContentScores
  seoHint: string
  checklist: string[]
  source: "openai" | "heuristic"
}

const responseSchema = z.object({
  body: z.string().min(1),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  titleSuggestions: z.array(z.string()).min(1).max(6),
  scores: z.object({
    seo: z.coerce.number().min(0).max(100),
    keywordFit: z.coerce.number().min(0).max(100),
    readability: z.coerce.number().min(0).max(100),
  }),
  seoHint: z.string(),
  checklist: z.array(z.string()).min(1).max(12),
})

function hashToInt(s: string, salt: number): number {
  const h = createHash("sha256").update(s + salt).digest()
  return h[0]! + (h[1]! << 8)
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

export function heuristicGenerate(topic: string, keyword: string, tone: string): ContentGenerateResult {
  const t = topic.trim() || "블로그 포스트"
  const k = keyword.trim() || "키워드"
  const toneLabel = tone.trim() || "정보형"
  const seed = `${t}|${k}|${toneLabel}`
  const base = hashToInt(seed, 0)

  const seo = clampScore(58 + (base % 38))
  const keywordFit = clampScore(60 + (hashToInt(seed, 1) % 35))
  const readability = clampScore(55 + (hashToInt(seed, 2) % 40))

  const angles = [
    "실천 순서와 체크리스트",
    "초보가 흔히 놓치는 포인트",
    "비용·시간 대비 효과",
    "사례와 비교 기준",
    "자주 묻는 질문",
  ]
  const a1 = angles[base % angles.length]!
  const a2 = angles[(base + 3) % angles.length]!

  const body = `## 들어가며

이 글은 **${t}**를 다루며, 핵심 키워드 **「${k}」**를 자연스럽게 녹였습니다. 톤은 **${toneLabel}**에 맞춰 작성했습니다.

## ${a1}

${k}와 관련해 독자가 바로 실행할 수 있는 단계를 정리했습니다. 주제에 맞게 문단을 조정하고, 불필요한 반복은 피하세요.

## 본문 핵심

- **준비**: 검색 의도에 맞는 정보를 한눈에 보이게 구성합니다.
- **전개**: ${a2}를 중심으로 근거와 예시를 배치합니다.
- **마무리**: 다음 행동(댓글, 공유, 관련 글)을 부드럽게 제안합니다.

## 정리

${t}에 관심 있는 독자가 혼자서도 따라 할 수 있도록 요약과 체크 포인트를 남깁니다. 메타 설명과 제목 후보도 함께 다듬어 주세요.
`

  const titleSuggestions = [
    `${t} — ${k}로 읽는 실전 가이드`,
    `${k} 중심으로 보는 ${t.slice(0, 24)}${t.length > 24 ? "…" : ""}`,
    `${toneLabel} 톤의 ${k} 정리 노트`,
  ]

  return {
    body,
    meta: {
      title: `${t} | ${k} 핵심 정리`,
      description: `${k}를 중심으로 ${t}를 ${toneLabel} 톤으로 요약했습니다. 단계별 설명과 체크 포인트를 포함합니다.`,
    },
    titleSuggestions,
    scores: { seo, keywordFit, readability },
    seoHint: `「${k}」가 제목·첫 문단·H2에 고르게 분포하도록 조정하면 점수가 안정됩니다.`,
    checklist: [
      "첫 문단에 핵심 키워드 포함",
      "H2 섹션 3개 이상",
      "문장 길이 혼합(짧은 문장 + 설명)",
      "이미지·링크 alt에 키워드 변형",
    ],
    source: "heuristic",
  }
}

export async function generateWithOpenAI(
  topic: string,
  keyword: string,
  tone: string,
): Promise<ContentGenerateResult | null> {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) return null

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You write Korean blog drafts for Naver-style search. Always respond with valid JSON only, keys:
- body: string (Markdown, use ## for sections, no code fences)
- metaTitle: string (under 60 chars Korean)
- metaDescription: string (under 160 chars Korean)
- titleSuggestions: string[] (exactly 3 title ideas)
- scores: { seo: number, keywordFit: number, readability: number } (integers 0-100)
- seoHint: string (one short Korean sentence for the author)
- checklist: string[] (3-5 Korean checklist items)`,
        },
        {
          role: "user",
          content: `주제(포스트 제목): ${topic}\n핵심 키워드: ${keyword}\n톤·스타일: ${tone}\n\n위 입력에 맞춰 블로그 초안을 작성하세요. 주제와 키워드가 바뀔 때마다 내용은 완전히 달라야 합니다.`,
        },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("OpenAI content error", res.status, err)
    return null
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const raw = data.choices?.[0]?.message?.content
  if (!raw) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }

  const checked = responseSchema.safeParse(parsed)
  if (!checked.success) return null

  const v = checked.data
  return {
    body: v.body,
    meta: { title: v.metaTitle, description: v.metaDescription },
    titleSuggestions: v.titleSuggestions.slice(0, 3),
    scores: {
      seo: clampScore(v.scores.seo),
      keywordFit: clampScore(v.scores.keywordFit),
      readability: clampScore(v.scores.readability),
    },
    seoHint: v.seoHint,
    checklist: v.checklist,
    source: "openai",
  }
}
