import { createHash } from "crypto"

export type KeywordAnalyzeScores = {
  seo: number
  fit: number
  readability: number
}

export type KeywordAnalyzeResult = {
  intent: string
  ideas: string[]
  scores: KeywordAnalyzeScores
  source: "openai" | "heuristic"
}

function hashToInt(s: string, salt: number): number {
  const h = createHash("sha256").update(s + salt).digest()
  return h[0]! + (h[1]! << 8)
}

export function heuristicAnalyze(keyword: string): KeywordAnalyzeResult {
  const q = keyword.trim()
  const base = hashToInt(q, 0)
  const seo = 58 + (base % 38)
  const fit = 60 + (hashToInt(q, 1) % 35)
  const readability = 55 + (hashToInt(q, 2) % 40)

  const intents = [
    "정보형 + 비교 후 구매",
    "정보형 + 실행 체크리스트",
    "지역·후기 탐색형",
    "비교 + 구매 보조",
  ]
  const intent = intents[base % intents.length]!

  const ideas = [
    `${q} 체크리스트`,
    `${q} 실패 사례와 회피법`,
    `${q} 예산별 추천`,
  ]

  return {
    intent,
    ideas,
    scores: { seo, fit, readability },
    source: "heuristic",
  }
}

export async function analyzeKeywordWithOpenAI(
  keyword: string,
  locale: string,
  lang: string,
): Promise<KeywordAnalyzeResult | null> {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) return null

  const body = {
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
    response_format: { type: "json_object" as const },
    messages: [
      {
        role: "system" as const,
        content:
          "You are an SEO assistant for Korean search. Reply with JSON only: {\"intent\": string, \"ideas\": string[3], \"scores\": {\"seo\": number, \"fit\": number, \"readability\": number}}. Scores are integers 0-100.",
      },
      {
        role: "user" as const,
        content: `Analyze keyword: "${keyword}". Locale: ${locale}, language: ${lang}.`,
      },
    ],
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("OpenAI error", res.status, err)
    return null
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const raw = data.choices?.[0]?.message?.content
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as {
      intent?: string
      ideas?: string[]
      scores?: KeywordAnalyzeScores
    }
    if (
      !parsed.intent ||
      !Array.isArray(parsed.ideas) ||
      parsed.ideas.length < 1 ||
      !parsed.scores
    ) {
      return null
    }
    const ideas = parsed.ideas.slice(0, 5).map(String)
    const scores = {
      seo: clampScore(parsed.scores.seo),
      fit: clampScore(parsed.scores.fit),
      readability: clampScore(parsed.scores.readability),
    }
    return {
      intent: String(parsed.intent),
      ideas,
      scores,
      source: "openai",
    }
  } catch {
    return null
  }
}

function clampScore(n: unknown): number {
  const x = typeof n === "number" ? n : Number(n)
  if (Number.isNaN(x)) return 70
  return Math.max(0, Math.min(100, Math.round(x)))
}
