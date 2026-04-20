import { createHash } from "crypto"

import { z } from "zod"

export type ContentScores = {
  seo: number
  keywordFit: number
  readability: number
}

export type ContentLengthMode = "draft" | "full"

export type ContentGenerateResult = {
  body: string
  meta: { title: string; description: string }
  titleSuggestions: string[]
  scores: ContentScores
  seoHint: string
  checklist: string[]
  source: "openai" | "heuristic"
  lengthMode: ContentLengthMode
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

export function heuristicGenerate(
  topic: string,
  keyword: string,
  tone: string,
  length: ContentLengthMode = "full",
): ContentGenerateResult {
  const t = topic.trim() || "블로그 포스트"
  const k = keyword.trim() || "키워드"
  const toneLabel = tone.trim() || "정보형"
  const seed = `${t}|${k}|${toneLabel}|${length}`
  const base = hashToInt(seed, 0)

  const seo = clampScore(58 + (base % 38) + (length === "full" ? 4 : 0))
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
  const a3 = angles[(base + 5) % angles.length]!

  const draftBody = `## 들어가며

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

  const fullBody = `## 들어가며

**${t}**에 대해 검색하신 독자분들을 위해, 핵심 키워드 **「${k}」**를 글 전체에 고르게 배치한 **${toneLabel}** 톤의 완성형 포스트입니다. 아래에서는 왜 이 주제가 중요한지부터, 실천 방법·주의점·FAQ까지 한 번에 정리합니다.

검색 의도(정보형·비교·구매 보조 등)에 맞춰 문단을 나누었고, 스크롤만으로도 구조가 보이도록 소제목을 촘촘히 잡았습니다.

## 핵심만 먼저

- **주제**: ${t}
- **키워드**: ${k}
- **이 글에서 얻을 것**: 실행 순서, 흔한 실수, ${a1}에 대한 요약

${k}는 제목·리드(첫 문단)·각 H2의 첫 문장에 자연스럽게 반복되도록 구성하는 것이 좋습니다. 같은 단어만 반복하지 말고, 관련 표현(동의어·질문형)을 섞으면 가독성과 SEO 균형이 맞습니다.

## ${a1} — 상세 설명

${k}를 다룰 때 가장 먼저 짚어야 할 것은 **독자의 현재 단계**입니다. 입문·중급·전문가에 따라 설명 깊이와 예시 밀도를 조절하세요. ${toneLabel} 톤을 유지하면서도, 한 문단은 짧게 끊고 다음 문단에서 근거를 덧붙이는 식으로 읽힘이 좋아집니다.

실제 적용 시에는 다음 순서를 추천합니다.

1. 목표와 제약(시간·예산·환경)을 명확히 한다.
2. ${a2}에 해당하는 정보를 모아 표나 목록으로 정리한다.
3. 독자가 바로 시도할 수 있는 **미니 과제** 한 가지를 제시한다.

## ${a2} — 사례와 비교

같은 ${k} 주제라도 채널·브랜드·개인 경험에 따라 접근이 달라집니다. 여기서는 일반화할 수 있는 기준을 제시하고, 예외 상황은 부록 느낌으로 짧게 안내합니다. 비교표나 체크리스트를 넣으면 체류 시간과 공유에도 유리합니다.

### 실무 팁

- 문장은 2~3줄 단위로 끊어 스크롤 피로를 줄입니다.
- 이미지·인용·출처가 있다면 캡션과 alt에 키워드 변형을 넣습니다.
- 내부 링크(관련 글)로 주제 클러스터를 강화합니다.

## ${a3} — 자주 묻는 질문

**Q. ${k}만 넣으면 순위가 오를까요?**  
A. 키워드는 신호 중 하나일 뿐이며, 의도 충족·체류·신뢰도가 함께 맞아야 합니다.

**Q. 길이는 어느 정도가 적당한가요?**  
A. 주제에 따라 다르지만, 이 글처럼 소제목이 많은 **전체 글**은 검색·스니펫 대비에 유리한 편입니다.

**Q. 톤을 바꾸고 싶으면?**  
A. 지금은 **${toneLabel}** 기준입니다. 더 친근하게 쓰려면 1인칭·질문형 문장을 늘리면 됩니다.

## 정리와 다음 행동

${t}와 ${k}를 중심으로 한 흐름을 다시 요약하면, **준비 → 실행 → 점검**의 세 단계로 압축할 수 있습니다. 메타 제목·설명은 아래 탭에서 다듬고, 썸네일 문구와 첫 이미지 alt까지 맞추면 발행 준비가 됩니다.

독자가 글을 끝까지 읽고 **댓글·저장·공유** 중 하나라도 하도록, 마지막 한 줄에 부담 없는 행동 제안을 남겨 보세요.
`

  const body = length === "full" ? fullBody : draftBody

  const titleSuggestions =
    length === "full"
      ? [
          `${t} 완벽 정리 — ${k}로 읽는 장문 가이드`,
          `${k} 중심 ${toneLabel} 톤의 ${t.slice(0, 20)}${t.length > 20 ? "…" : ""} 풀 버전`,
          `${t} | ${k} FAQ·실전 팁까지`,
        ]
      : [
          `${t} — ${k}로 읽는 실전 가이드`,
          `${k} 중심으로 보는 ${t.slice(0, 24)}${t.length > 24 ? "…" : ""}`,
          `${toneLabel} 톤의 ${k} 정리 노트`,
        ]

  return {
    body,
    meta: {
      title:
        length === "full"
          ? `${t} | ${k} 완성형 가이드`
          : `${t} | ${k} 핵심 정리`,
      description:
        length === "full"
          ? `${k}와 ${t}를 ${toneLabel} 톤으로 풀 분량 정리했습니다. 단계별 설명·FAQ·실무 팁을 포함합니다.`
          : `${k}를 중심으로 ${t}를 ${toneLabel} 톤으로 요약했습니다. 단계별 설명과 체크 포인트를 포함합니다.`,
    },
    titleSuggestions,
    scores: { seo, keywordFit, readability },
    seoHint: `「${k}」가 제목·첫 문단·H2에 고르게 분포하도록 조정하면 점수가 안정됩니다.${
      length === "full" ? " 전체 글은 섹션 수·체류 시간 지표도 챙기세요." : ""
    }`,
    checklist:
      length === "full"
        ? [
            "첫 문단에 핵심 키워드·주제 문장",
            "H2 5개 이상, 가능하면 H3로 세부 구분",
            "FAQ 또는 실무 팁 블록 포함",
            "내부·외부 링크와 이미지 alt 정리",
            "마지막에 가벼운 행동 유도 문장",
          ]
        : [
            "첫 문단에 핵심 키워드 포함",
            "H2 섹션 3개 이상",
            "문장 길이 혼합(짧은 문장 + 설명)",
            "이미지·링크 alt에 키워드 변형",
          ],
    source: "heuristic",
    lengthMode: length,
  }
}

export async function generateWithOpenAI(
  topic: string,
  keyword: string,
  tone: string,
  length: ContentLengthMode = "full",
): Promise<ContentGenerateResult | null> {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) return null

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"

  const lengthInstruction =
    length === "full"
      ? `생성 길이: **전체 글(완성형)**. 각 섹션을 풍부하게 작성하고, 총 분량은 한국어 기준 약 2,000~4,500자 분량이 되도록 하세요. 독자가 그대로 블로그에 게시할 수 있는 완성도로, ## 소제목을 5개 이상 쓰고, 가능하면 ### 소제목과 FAQ·실무 팁 문단을 포함하세요.`
      : `생성 길이: **초안**. 구조와 핵심 위주로, 한국어 기준 약 800~1,500자 분량. ## 소제목 3~4개 중심으로 짧게.`

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
          content: `You write Korean blog content for Naver-style search. Always respond with valid JSON only, keys:
- body: string (Markdown, use ## and ### for sections, no code fences)
- metaTitle: string (under 60 chars Korean)
- metaDescription: string (under 160 chars Korean)
- titleSuggestions: string[] (exactly 3 title ideas)
- scores: { seo: number, keywordFit: number, readability: number } (integers 0-100)
- seoHint: string (one short Korean sentence for the author)
- checklist: string[] (${length === "full" ? "5-7" : "3-5"} Korean checklist items)
Follow the user's length mode strictly for body depth and section count.`,
        },
        {
          role: "user",
          content: `주제(포스트 제목): ${topic}\n핵심 키워드: ${keyword}\n톤·스타일: ${tone}\n\n${lengthInstruction}\n\n위 입력에 맞춰 블로그 본문을 작성하세요. 주제·키워드·톤이 바뀔 때마다 내용은 완전히 달라야 합니다.`,
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
    lengthMode: length,
  }
}
