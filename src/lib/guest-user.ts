/** 게스트 계정 식별 — 클라이언트·서버 공용 (next/headers 없음) */

export const GUEST_USER_ID = "user_guest" as const

export function isGuestUserRecord(user: { id: string; email: string }) {
  return user.id === GUEST_USER_ID || user.email === "guest@local"
}
