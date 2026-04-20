/** 글 유형 — 선택 시 기본 톤 프리셋과 연동 */
export const CONTENT_POST_TYPES = [
  { id: "informative", label: "정보성 글", tonePresetId: "info-calm" },
  { id: "review", label: "리뷰·비교", tonePresetId: "review" },
  { id: "story", label: "스토리·후기", tonePresetId: "story" },
  { id: "tutorial", label: "튜토리얼·가이드", tonePresetId: "tutorial" },
  { id: "marketing", label: "홍보·랜딩", tonePresetId: "marketing" },
  { id: "opinion", label: "칼럼·의견", tonePresetId: "opinion" },
  { id: "casual", label: "일상·캐주얼", tonePresetId: "casual" },
] as const

export type ContentPostTypeId = (typeof CONTENT_POST_TYPES)[number]["id"]

/** 우측 패널 — 글 유형별 트렌드 주제 (실제 검색·관심사에 가까운 한국어 키워드 조합, 정적 큐레이션) */
export type TrendingTopicItem = {
  id: string
  /** 포스트 제목 입력란에 그대로 넣을 문구 */
  title: string
  /** 키워드 칩으로 넣을 표현 2~5개 (중복·빈 문자열 제거 후 상한은 UI에서 처리) */
  keywords: string[]
  hot?: boolean
}

export const CONTENT_TRENDING_BY_POST_TYPE: Record<ContentPostTypeId, TrendingTopicItem[]> = {
  informative: [
    {
      id: "inf-1",
      title: "2026 연말정산 간소화 자료 뜻부터 환급일까지 총정리",
      keywords: ["연말정산", "간소화 자료", "환급", "공제"],
      hot: true,
    },
    {
      id: "inf-2",
      title: "겨울철 난방비 줄이는 온도 설정·단열 체크리스트",
      keywords: ["난방비 절약", "단열", "겨울 전기요금"],
      hot: true,
    },
    {
      id: "inf-3",
      title: "국민연금·퇴직연금 차이 한눈에 보는 가이드",
      keywords: ["국민연금", "퇴직연금", "노후 준비"],
    },
    {
      id: "inf-4",
      title: "재택근무 시 눈 건강·거북목 예방 루틴 정리",
      keywords: ["재택근무", "거북목", "모니터 거리"],
    },
    {
      id: "inf-5",
      title: "챗GPT 검색 연동 이후 블로그·SEO에 달라진 점 요약",
      keywords: ["AI 검색", "SEO", "블로그 노출"],
    },
    {
      id: "inf-6",
      title: "미세먼지·건조할 때 공기청정기·가습기 같이 쓰는 법",
      keywords: ["미세먼지", "공기청정기", "가습기"],
    },
  ],
  review: [
    {
      id: "rev-1",
      title: "무선청소기 30만 원대 비교 — 흡입·배터리·먼지통까지",
      keywords: ["무선청소기", "비교", "추천"],
      hot: true,
    },
    {
      id: "rev-2",
      title: "가성비 노트북 2026 — 문서·영상편집 기준으로 골라본 후기",
      keywords: ["가성비 노트북", "문서 작업", "영상편집"],
      hot: true,
    },
    {
      id: "rev-3",
      title: "공기청정기 필터 교체 주기·면적별 모델 선택 팁",
      keywords: ["공기청정기", "필터", "추천"],
    },
    {
      id: "rev-4",
      title: "캠핑 버너 입문 — 코펠·토치형 쓸 때 안전 체크",
      keywords: ["캠핑 버너", "코펠", "캠핑 장비"],
    },
    {
      id: "rev-5",
      title: "전기매트 vs 온수매트 전기요금·안전 실사용 비교",
      keywords: ["전기매트", "온수매트", "전기요금"],
    },
    {
      id: "rev-6",
      title: "블루투스 이어폰 노캔 비교 — 출퇴근·운동 기준",
      keywords: ["노이즈캔슬링", "이어폰 추천", "블루투스"],
    },
  ],
  story: [
    {
      id: "sto-1",
      title: "첫 육아휴직 한 달 — 집에서 버틴 루틴과 마음 정리",
      keywords: ["육아휴직", "육아 루틴", "워라밸"],
      hot: true,
    },
    {
      id: "sto-2",
      title: "이직 3개월 차 — 연봉·분위기·후회 없이 옮긴 후기",
      keywords: ["이직 후기", "직장", "커리어"],
      hot: true,
    },
    {
      id: "sto-3",
      title: "혼자 떠난 제주 2박 3일 — 비용·동선 솔직 기록",
      keywords: ["제주 여행", "혼행", "여행 경비"],
    },
    {
      id: "sto-4",
      title: "반려견 첫 병원·미용 — 견주가 미리 알았으면 하는 것",
      keywords: ["반려견", "견주", "반려동물"],
    },
    {
      id: "sto-5",
      title: "캠핑 처음 나가본 날 — 텐트 설치부터 실패담까지",
      keywords: ["캠핑 입문", "캠핑 후기", "캠핑 장비"],
    },
    {
      id: "sto-6",
      title: "30평대 아파트 입주 1년 — 수리·가전·후회 리스트",
      keywords: ["아파트 입주", "인테리어", "가전"],
    },
  ],
  tutorial: [
    {
      id: "tut-1",
      title: "엑셀 피벗테이블 10분 만에 익히기 — 예시 파일 따라하기",
      keywords: ["엑셀", "피벗테이블", "사무 자동화"],
      hot: true,
    },
    {
      id: "tut-2",
      title: "노션으로 블로그 기획·캘린더 한 페이지에 묶는 법",
      keywords: ["노션", "블로그 기획", "콘텐츠 캘린더"],
      hot: true,
    },
    {
      id: "tut-3",
      title: "캔바로 썸네일 만드는 법 — 글자·배경·해상도까지",
      keywords: ["캔바", "썸네일", "블로그 이미지"],
    },
    {
      id: "tut-4",
      title: "인스타 릴스 자막·컷 편집 — 모바일 앱만으로 완성",
      keywords: ["인스타 릴스", "숏폼", "자막"],
    },
    {
      id: "tut-5",
      title: "네이버 블로그 글감·키워드 리서치 체크리스트",
      keywords: ["블로그 글감", "키워드", "검색 의도"],
    },
    {
      id: "tut-6",
      title: "집에서 화상회의 배경·조명 세팅 — 줌·팀즈 공통",
      keywords: ["화상회의", "재택근무", "조명"],
    },
  ],
  marketing: [
    {
      id: "mkt-1",
      title: "신제품 출시 알림 받기 — 한정 혜택·재입고 안내 문구 예시",
      keywords: ["출시 알림", "한정 혜택", "랜딩"],
      hot: true,
    },
    {
      id: "mkt-2",
      title: "블랙프라이데이·연말 세일 랜딩 카피 — CTA·신뢰 문구",
      keywords: ["세일", "CTA", "프로모션"],
      hot: true,
    },
    {
      id: "mkt-3",
      title: "무료 체험 → 유료 전환 설득하는 블로그·상세페이지 구조",
      keywords: ["무료 체험", "전환율", "상세페이지"],
    },
    {
      id: "mkt-4",
      title: "지역 맛집·카페 협찬 글에서 꼭 넣는 정보·해시태그 가이드",
      keywords: ["협찬", "맛집 홍보", "지역 마케팅"],
    },
    {
      id: "mkt-5",
      title: "쿠팡 파트너스·제휴 링크 넣을 때 설명·고지 문구 예시",
      keywords: ["쿠팡 파트너스", "제휴 링크", "고지"],
    },
    {
      id: "mkt-6",
      title: "뉴스레터 구독 유도 — 첫 화면·팝업 문구 A/B 아이디어",
      keywords: ["뉴스레터", "구독 유도", "리드"],
    },
  ],
  opinion: [
    {
      id: "opi-1",
      title: "금리·전세 시장 보면서 집 살 때 지금 묻고 싶은 질문들",
      keywords: ["금리", "전세", "부동산"],
      hot: true,
    },
    {
      id: "opi-2",
      title: "MZ 세대 소비 트렌드 — 가성비와 경험 사이에서",
      keywords: ["MZ", "소비 트렌드", "가성비"],
    },
    {
      id: "opi-3",
      title: "재택·하이브리드 이후 사무실의 역할이 바뀌는 이유",
      keywords: ["재택근무", "하이브리드", "조직문화"],
    },
    {
      id: "opi-4",
      title: "플랫폼 노동·배달 라이더 이슈 — 제도와 현장 사이",
      keywords: ["플랫폼 노동", "배달", "노동 이슈"],
    },
    {
      id: "opi-5",
      title: "환경·ESG 말만 많을 때 소비자가 보는 기준",
      keywords: ["ESG", "친환경", "소비"],
    },
    {
      id: "opi-6",
      title: "AI 콘텐츠 시대에 ‘사람 글’이 남는 이유",
      keywords: ["AI 글쓰기", "콘텐츠", "저작권"],
    },
  ],
  casual: [
    {
      id: "cas-1",
      title: "주말 브런치 맛집 — 줄 안 서는 시간대·메뉴 조합",
      keywords: ["브런치", "맛집", "주말"],
      hot: true,
    },
    {
      id: "cas-2",
      title: "한 달 가계부 써본 솔직 후기 — 앱 추천·줄이게 된 지출",
      keywords: ["가계부", "절약", "소비 습관"],
      hot: true,
    },
    {
      id: "cas-3",
      title: "집 앞 산책 코스 — 계절별로 바뀌는 풍경 메모",
      keywords: ["산책", "일상", "힐링"],
    },
    {
      id: "cas-4",
      title: "넷플릭스·OTT 이번 주 숏폼처럼 보는 법 (스포 없이)",
      keywords: ["OTT", "넷플릭스", "취미"],
    },
    {
      id: "cas-5",
      title: "미니멀 책상 정리 — 케이블·모니터암만 바꿔도 달라진 점",
      keywords: ["미니멀", "책상 정리", "재택"],
    },
    {
      id: "cas-6",
      title: "연말 선물 고민 줄이는 조합 — 부모님·친구·동료",
      keywords: ["연말 선물", "선물 추천", "연말"],
    },
  ],
}

export function getTrendingTopicsForPostType(postTypeId: string): TrendingTopicItem[] {
  const valid = CONTENT_POST_TYPES.some((p) => p.id === postTypeId)
  const key = (valid ? postTypeId : "informative") as ContentPostTypeId
  return CONTENT_TRENDING_BY_POST_TYPE[key]
}

/** 콘텐츠 작성 — 톤 프리셋 (API에 그대로 전달) */
export const CONTENT_TONE_PRESETS = [
  { id: "info-calm", label: "정보형 · 차분", value: "정보형 · 차분" },
  { id: "info-friendly", label: "정보형 · 친근", value: "정보형 · 친근한 설명체" },
  { id: "story", label: "스토리텔링 · 감성", value: "스토리텔링 · 감성적인 톤" },
  { id: "expert", label: "전문가 · 격식", value: "전문가 시점 · 격식 있는 설명" },
  { id: "review", label: "리뷰·비교", value: "리뷰·비교형 · 솔직한 톤" },
  { id: "marketing", label: "마케팅 · CTA", value: "마케팅 · 행동 유도(CTA) 강조" },
  { id: "casual", label: "대화체 · 캐주얼", value: "대화체 · 캐주얼하고 가벼운 톤" },
  { id: "opinion", label: "의견·칼럼", value: "의견·칼럼형 · 필자의 관점 강조" },
  { id: "tutorial", label: "튜토리얼 · 단계별", value: "튜토리얼 · 단계별 따라 하기" },
] as const

export const CONTENT_LENGTH_OPTIONS: {
  id: "draft" | "full"
  label: string
  description: string
}[] = [
  {
    id: "full",
    label: "전체 글",
    description: "섹션을 풍부하게 완성형 (긴 분량)",
  },
  {
    id: "draft",
    label: "초안",
    description: "구조·핵심만 빠르게 (짧은 분량)",
  },
]
