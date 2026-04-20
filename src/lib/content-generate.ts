import { createHash } from "crypto"

import { z } from "zod"

import type { ContentPostTypeId } from "@/constants/content-studio"
import { charTargetForClient, resolveCharTarget } from "@/lib/content-char-target"
import {
  buildNaverSystemPrompt,
  buildNaverUserAddendum,
  buildNaverUserQualityFooter,
} from "@/lib/naver-blog-prompts"

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
  /** 적용된 목표 글자 수 범위(프리셋 또는 사용자 지정) */
  charTarget?: { min: number; max: number; label: string }
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

const HEURISTIC_ANGLES: Record<ContentPostTypeId, string[]> = {
  informative: [
    "실천 순서와 체크리스트",
    "초보가 흔히 놓치는 포인트",
    "비용·시간 대비 효과",
    "사례와 비교 기준",
    "자주 묻는 질문",
  ],
  review: [
    "스펙·가격 비교",
    "실사용 환경별 추천",
    "장점과 아쉬운 점",
    "이런 분께 추천 / 비추천",
    "총평과 구매 결론",
  ],
  story: [
    "그때의 상황",
    "중간에 겪은 일",
    "마음이 바뀐 순간",
    "독자에게 전하는 팁",
    "짧은 정리",
  ],
  tutorial: [
    "준비물과 전제 조건",
    "단계별로 따라 하기",
    "자주 틀리는 실수",
    "안전·주의할 점",
    "확인·마무리",
  ],
  marketing: [
    "먼저 알아두면 좋은 점",
    "핵심 혜택과 차별점",
    "이런 분께 맞습니다",
    "근거와 신뢰 포인트",
    "부담 없는 다음 행동",
  ],
  opinion: [
    "내가 생각하는 핵심",
    "왜 그렇게 보는지",
    "다른 시각도 짚어보면",
    "정리하면",
    "남기고 싶은 질문",
  ],
  casual: [
    "오늘의 한 장면",
    "중간에 든 생각",
    "소소한 발견",
    "짧은 팁",
    "인사로 마무리",
  ],
}

const TYPE_TAGLINE: Record<ContentPostTypeId, string> = {
  informative: "검색·정보를 찾는 독자에게 맞춘",
  review: "비교와 선택을 돕기 위한",
  story: "경험과 감정을 담은",
  tutorial: "따라 하기 쉽게 단계를 나눈",
  marketing: "혜택과 근거를 균형 있게 담은",
  opinion: "주장과 근거를 분명히 한",
  casual: "일상처럼 가볍게 읽히는",
}

/** 휴리스틱 본문에 넣는 네이버 상위 글 패턴 한 줄 */
const NAVER_HEURISTIC_LINE =
  "네이버 검색·블로그에서 반응이 잘 나는 글은 첫 문단에서 검색 의도를 짚고, ◆ 소제목만으로도 목차가 보이며, 문장·문단이 모바일에서 읽기 편하게 이어집니다."

export function heuristicGenerate(
  topic: string,
  keyword: string,
  tone: string,
  length: ContentLengthMode = "full",
  postType: ContentPostTypeId = "informative",
  targetChars?: number | null,
): ContentGenerateResult {
  const t = topic.trim() || "블로그 포스트"
  const k = keyword.trim() || "키워드"
  const toneLabel = tone.trim() || "정보형"
  const resolved = resolveCharTarget(length, targetChars)
  const seed = `${t}|${k}|${toneLabel}|${length}|${postType}|${targetChars ?? ""}|${resolved.bucket}`
  const base = hashToInt(seed, 0)

  const seo = clampScore(58 + (base % 38) + (resolved.bucket === "full" ? 4 : 0))
  const keywordFit = clampScore(60 + (hashToInt(seed, 1) % 35))
  const readability = clampScore(55 + (hashToInt(seed, 2) % 40))

  const angles = HEURISTIC_ANGLES[postType] ?? HEURISTIC_ANGLES.informative
  const a1 = angles[base % angles.length]!
  const a2 = angles[(base + 3) % angles.length]!
  const a3 = angles[(base + 5) % angles.length]!
  const tag = TYPE_TAGLINE[postType] ?? TYPE_TAGLINE.informative

  const draftBody = `◆ 들어가며

${t}에 관심 있어 이 글을 찾아주신 분들을 위해, ${tag} ${toneLabel} 톤으로 핵심만 정리했습니다. 검색하신 표현 ${k}가 자연스럽게 녹아 있도록 문단을 나눴고, 블로그 에디터에 그대로 붙여 넣어도 어색하지 않게 평문 위주로 썼습니다.

${NAVER_HEURISTIC_LINE}

처음에는 왜 이 주제가 요즘 자주 검색되는지, 그리고 글을 읽고 나면 무엇을 할 수 있게 되는지 짧게 짚고 넘어갑니다. 장황한 수식어보다는 문장 하나하나가 실제로 도움이 되도록 구성했습니다.

◆ ${a1}

${k}와 관련해서 많은 분들이 막히는 지점은 정보는 많은데 무엇부터 손대야 할지 모르겠다는 점입니다. 여기서는 실행 순서를 세 단계로만 압축해 보겠습니다. 첫째, 지금 내 상황에서 꼭 필요한 목표를 한 문장으로 적는다. 둘째, ${a2}에 해당하는 자료만 골라 표나 메모로 정리한다. 셋째, 오늘 당장 시도할 수 있는 작은 행동 하나만 정한다.

이 세 단계만 지켜도 글의 신뢰도가 올라가고, 독자가 댓글이나 저장을 누를 만한 근거가 생깁니다. 세부 내용은 주제에 맞게 문장만 바꿔 쓰시면 됩니다.

◆ 정리하며

${t}를 다룬 글은 결국 독자가 혼자서도 다음 행동을 정할 수 있게 해 주는지로 평가받습니다. 메타 설명과 제목 후보는 별도 탭에서 다듬고, 이미지나 링크를 넣을 자리는 문단 사이 빈 줄로 표시해 두시면 편합니다.
`

  const fullBody = `◆ 들어가며

안녕하세요. 오늘은 ${t}에 대해, 검색창에 ${k}를 입력하고 들어오신 분들이 궁금해할 만한 지점을 빠짐없이 짚어 보려고 합니다. 이번 글은 ${tag} 형식으로, ${toneLabel} 톤을 기본으로 두고 독자가 글을 끝까지 읽었을 때 실제로 손에 잡히는 결론이 남도록 쓰는 편입니다.

블로그 글은 예쁜 문장만으로는 부족합니다. 네이버 검색에서 상위에 노출되는 글들을 보면 공통점이 있습니다. 첫째, 검색 의도를 첫 문단에서 바로 짚어 준다는 점입니다. 둘째, 소제목마다 정보의 밀도가 다르지 않고 균형이 맞는다는 점입니다. 셋째, 독자가 다음에 무엇을 하면 좋은지까지 안내한다는 점입니다. 이 글도 그 기준을 따라 ${k}를 중심으로 전개해 보겠습니다.

이 글을 읽기 전에 미리 알아 두시면 좋은 것은, 같은 키워드라도 개인의 경험·예산·시간 제약에 따라 정답이 달라질 수 있다는 점입니다. 그래서 아래에서는 원칙을 먼저 제시하고, 그다음에 상황별로 조절하는 방법을 길게 풀어 쓰겠습니다. 중간중간 제가 실무에서 자주 쓰는 체크 방식도 함께 넣었습니다.

${NAVER_HEURISTIC_LINE}

◆ 핵심만 먼저 짚고 가기

우선 이 글에서 다루는 주제는 ${t}이고, 검색과 본문 전체를 관통하는 표현은 ${k}입니다. 글이 길어질수록 이 두 가지가 흐려지기 쉬운데, 소제목을 바꿀 때마다 한 번씩은 ${k}와 자연스럽게 연결되는 문장을 넣어 주시면 좋습니다. 단어를 기계적으로 반복하기보다는, 질문형 문장이나 비슷한 뜻의 말을 섞어 가독성을 지키는 것이 포인트입니다.

이 글을 다 읽고 나면 얻을 수 있는 것은 크게 세 가지입니다. 첫째, ${a1}에 대해 혼자 정리할 수 있는 틀. 둘째, ${a2}를 비교할 때 쓸 수 있는 기준. 셋째, 자주 묻는 질문에 대한 답을 바탕으로 스스로 판단하는 연습입니다. 아래 본문은 이 순서에 맞춰 꽤 길게 이어집니다. 스크롤만으로도 목차가 보이도록 소제목을 촘촘히 잡아 두었습니다.

◆ ${a1}을 깊이 있게 이해하기

${k}를 다룰 때 가장 먼저 해야 할 일은 독자의 현재 단계를 가정하는 것입니다. 입문 단계라면 용어부터 짚어 주고, 이미 경험이 있는 독자라면 실수하기 쉬운 디테일을 늘리는 식으로 문단의 무게를 조절해야 합니다. ${toneLabel} 톤을 유지한다는 것은 말투만 통일하는 것이 아니라, 문장 길이와 설명 깊이도 일정하게 맞춘다는 뜻입니다.

한 문단은 보통 세 문장에서 여섯 문장 정도로 끊는 것이 모바일에서 읽기 좋습니다. 긴 문장이 이어지면 중간에 숨을 고르듯 짧은 문장 하나를 넣어 주세요. 그러면 독자가 스크롤을 멈추지 않고 읽을 확률이 높아집니다.

실제로 적용해 볼 때는 다음 순서를 추천합니다. 먼저 목표와 제약, 즉 시간과 예산과 환경을 한 장 메모에 적습니다. 그다음 ${a2}에 해당하는 정보를 모아 표나 번호 목록으로 정리합니다. 마지막으로 오늘 당장 시도할 수 있는 작은 과제 하나만 정합니다. 이 과제는 거창할 필요가 없습니다. 실행 가능한 한 가지만 남기는 것이 중요합니다.

◆ ${a2}를 사례와 비교로 넓히기

같은 ${k}라도 채널과 브랜드, 개인의 생활 패턴에 따라 선택이 달라집니다. 그래서 이 글에서는 일반화할 수 있는 기준을 먼저 제시하고, 예외에 가까운 상황은 짧게 덧붙이는 방식으로 썼습니다. 비교할 때는 장단점을 나란히 쓰기보다, 독자가 자신에게 맞는지 스스로 체크할 수 있도록 질문 형태로 유도하는 것도 방법입니다.

실무에서 자주 쓰는 팁을 몇 가지 적어 보면 이렇습니다. 문장은 화면에서 두세 줄을 넘기지 않도록 나눕니다. 이미지나 인용, 출처가 있다면 캡션과 대체 텍스트에 키워드의 자연스러운 변형을 넣습니다. 관련 글이 있다면 본문 중간에 내부 링크를 넣어 주제를 묶어 주면 체류 시간과 신뢰도에 도움이 됩니다.

◆ ${a3}에 대해 자주 묻는 질문

많은 분이 ${k}만 제목과 본문에 넣으면 검색 순위가 오를지 궁금해하십니다. 키워드는 분명 중요한 신호이지만, 그것만으로는 부족합니다. 검색 결과를 클릭한 사람이 원하는 정보를 실제로 얻었는지, 글에 머무는 시간은 어떤지, 다른 글과 비교했을 때 신뢰가 가는지가 함께 맞아야 합니다.

글 길이에 대해서도 질문을 주십니다. 주제마다 적정 분량은 다르지만, 소제목이 충분히 나뉘어 있고 각 문단에 실질적인 내용이 있다면 긴 글도 충분히 경쟁력이 있습니다. 반대로 짧은 글이라도 한 문단 한 문단이 밀도 있게 쓰였다면 만족도는 높게 나올 수 있습니다.

톤을 바꾸고 싶다면 지금의 ${toneLabel} 기준에서 한 단계만 조정해 보세요. 더 친근하게 가고 싶다면 1인칭 경험담과 질문형 문장을 늘리고, 더 무겁게 가고 싶다면 근거와 출처를 문단마다 조금씩 더하는 식입니다.

◆ 마무리하며 다음 행동까지

${t}와 ${k}를 한 흐름으로 정리하면, 준비하고 실행한 뒤 점검하는 세 단계로 압축할 수 있습니다. 메타 제목과 메타 설명은 발행 전에 꼭 다시 읽어 보시고, 썸네일에 들어갈 한 줄 문구와 첫 이미지의 대체 텍스트까지 맞춰 두시면 좋습니다.

긴 글을 읽어 주신 분께는 부담 없이 댓글이나 저장, 공유 중 편한 방법으로 반응을 남겨 주시면 다음 글을 쓸 때 큰 힘이 됩니다. 이상으로 ${t}와 ${k}를 중심으로 한 장문 가이드를 마칩니다. 도움이 되셨다면 이웃 추가나 이 글을 북마크해 두시고, 궁금한 점은 댓글로 남겨 주세요.
`

  const body = resolved.bucket === "full" ? fullBody : draftBody

  const typeHint =
    postType === "review"
      ? "비교·총평"
      : postType === "story"
        ? "후기·기록"
        : postType === "tutorial"
          ? "단계 가이드"
          : postType === "marketing"
            ? "핵심 정리"
            : postType === "opinion"
              ? "칼럼"
              : postType === "casual"
                ? "일상 글"
                : "총정리"

  const titleSuggestions =
    resolved.bucket === "full"
      ? [
          `${t} — ${k} ${typeHint}`,
          `${k} 중심 ${toneLabel} 톤 ${t.slice(0, 18)}${t.length > 18 ? "…" : ""}`,
          `${t} | ${k} 실전 팁`,
        ]
      : [
          `${t} — ${k} 실전 노트`,
          `${k}로 보는 ${t.slice(0, 22)}${t.length > 22 ? "…" : ""}`,
          `${toneLabel} 톤 ${k} 요약`,
        ]

  return {
    body,
    meta: {
      title:
        resolved.bucket === "full"
          ? `${t} | ${k} 완성형 가이드`
          : `${t} | ${k} 핵심 정리`,
      description:
        resolved.bucket === "full"
          ? `${k}와 ${t}를 ${toneLabel} 톤으로 풀 분량 정리했습니다. 단계별 설명·FAQ·실무 팁을 포함합니다.`
          : `${k}를 중심으로 ${t}를 ${toneLabel} 톤으로 요약했습니다. 단계별 설명과 체크 포인트를 포함합니다.`,
    },
    titleSuggestions,
    scores: { seo, keywordFit, readability },
    seoHint: `「${k}」를 제목·첫 150자·◆ 소제목 첫 문장에 자연스럽게 분산하고, 같은 말 반복 대신 동의어·질문형으로 변주하세요.${
      resolved.bucket === "full"
        ? " 전체 글은 소제목 5개 이상·문단 밀도로 체류 시간을 챙기면 네이버 블로그에서 유리합니다."
        : " 초안이라도 첫 문단에 검색 의도가 드러나게 쓰면 발행 후 다듬기 쉽습니다."
    }`,
    checklist:
      resolved.bucket === "full"
        ? [
            "첫 문단 2~5문장 안에 검색 의도·핵심 키워드(또는 자연스러운 동의어)",
            "◆ 또는 ■ 소제목 5개 이상·각 소제목 아래 문단 3문장 이상(모바일 가독)",
            "숫자·조건·예시·주의사항 등 정보 밀도(빈 말 반복 금지)",
            "질문형 소제목 또는 Q&A 1회 이상(주제에 맞을 때)",
            "메타 제목·설명이 본문과 같은 약속을 하도록 정리",
            "마지막에 요약·가벼운 댓글·저장 유도 한 번",
          ]
        : [
            "첫 문단에 검색 의도·핵심 키워드가 드러나게",
            "◆ 소제목 3개 이상으로 뼈대 정리",
            "문장 길이 혼합(짧은 문장 + 설명)",
            "발행 전 이미지·링크 넣을 자리는 문단 사이 빈 줄로 표시",
          ],
    source: "heuristic",
    lengthMode: length,
    charTarget: charTargetForClient(resolved),
  }
}

export async function generateWithOpenAI(
  topic: string,
  keyword: string,
  tone: string,
  length: ContentLengthMode = "full",
  postType: ContentPostTypeId = "informative",
  targetChars?: number | null,
): Promise<ContentGenerateResult | null> {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) return null

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini"

  const resolved = resolveCharTarget(length, targetChars)
  const lengthInstruction = resolved.summary

  const systemPrompt = buildNaverSystemPrompt(postType, resolved)
  const typeAddendum = buildNaverUserAddendum(postType)

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.66,
      max_tokens: 14_000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `주제(포스트 제목): ${topic}\n핵심 키워드: ${keyword}\n톤·스타일: ${tone}\n선택한 글 유형 ID: ${postType}\n\n${lengthInstruction}\n\n위 입력에 맞춰 네이버 블로그 본문을 작성하세요. 주제·키워드·톤·글 유형이 바뀔 때마다 내용과 구조는 완전히 달라야 합니다.\n\n${typeAddendum}\n\n복붙용 요구: 에디터에 붙이면 기호·마크다운 덩어리 없이 읽히는 평문 위주로, ◆ 또는 ■ 소제목과 빈 줄로 문단만 구분하세요. 별표·해시·코드블록은 쓰지 마세요. FAQ가 필요하면 질문과 답을 각각 별도 문단으로 자연스럽게 서술하세요.\n\n${buildNaverUserQualityFooter()}`,
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
    charTarget: charTargetForClient(resolved),
  }
}
