/**
 * 브라우저 전용 데모 인증 — 서버 DB 없이 가입/로그인을 재현합니다.
 * 프로덕션에서는 API·세션 쿠키(httpOnly)·해시 비밀번호로 교체하세요.
 */

import {
  PROFILE_STORAGE_KEY,
  SESSION_COOKIE,
  SESSION_STORAGE_KEY,
  USERS_STORAGE_KEY,
} from "@/lib/session-constants"

/** 서버 세션과 동일한 게스트 ID (SQLite 시드) */
export const GUEST_USER_ID = "user_guest" as const

export type SessionUser = {
  id: string
  email: string
  name: string
  isGuest?: boolean
}

export const GUEST_USER: SessionUser = {
  id: GUEST_USER_ID,
  email: "guest@local",
  name: "게스트",
  isGuest: true,
}

export function isGuestUser(user: SessionUser | null | undefined): boolean {
  if (!user) return false
  if (user.isGuest === true) return true
  return user.id === GUEST_USER_ID || user.email === "guest@local"
}

type StoredUser = SessionUser & {
  /** 데모 전용 평문 비밀번호 */
  password: string
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function registerLocalUser(input: {
  email: string
  password: string
  name: string
}): SessionUser {
  const users = readUsers()
  const email = input.email.trim().toLowerCase()
  if (users.some((u) => u.email === email)) {
    throw new Error("이미 가입된 이메일입니다.")
  }
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email,
    name: input.name.trim(),
    password: input.password,
  }
  users.push(user)
  writeUsers(users)
  return { id: user.id, email: user.email, name: user.name }
}

export function loginLocalUser(email: string, password: string): SessionUser {
  const users = readUsers()
  const e = email.trim().toLowerCase()
  const found = users.find((u) => u.email === e && u.password === password)
  if (!found) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.")
  }
  return { id: found.id, email: found.email, name: found.name }
}

export function userExists(email: string): boolean {
  const users = readUsers()
  const e = email.trim().toLowerCase()
  return users.some((u) => u.email === e)
}

export function persistSession(user: SessionUser) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
}

export function clearPersistedSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

export function readSessionFromStorage(): SessionUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const u = JSON.parse(raw) as SessionUser
    if (!u?.id || !u?.email) return null
    return u
  } catch {
    return null
  }
}

export function setSessionCookie(user: SessionUser) {
  const maxAge = 60 * 60 * 24 * 7
  const value = encodeURIComponent(JSON.stringify(user))
  document.cookie = `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
}

export function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function readSessionFromCookie(): SessionUser | null {
  if (typeof document === "undefined") return null
  const parts = document.cookie.split("; ")
  for (const part of parts) {
    if (!part.startsWith(`${SESSION_COOKIE}=`)) continue
    const raw = part.slice(SESSION_COOKIE.length + 1)
    try {
      const u = JSON.parse(decodeURIComponent(raw)) as SessionUser
      if (!u?.id || !u?.email) return null
      return u
    } catch {
      return null
    }
  }
  return null
}

export type OnboardingProfile = {
  role: string
  goals: string[]
  siteUrl: string
  completedAt: string
}

export function saveOnboardingProfile(profile: Omit<OnboardingProfile, "completedAt">) {
  const data: OnboardingProfile = {
    ...profile,
    completedAt: new Date().toISOString(),
  }
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data))
}

export function readOnboardingProfile(): OnboardingProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OnboardingProfile
  } catch {
    return null
  }
}
