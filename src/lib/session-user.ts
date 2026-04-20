import type { User } from "@prisma/client"

import { GUEST_USER_ID, isGuestUserRecord } from "@/lib/guest-user"

export type SessionUser = {
  id: string
  email: string
  name: string
  isGuest?: boolean
  onboardingRole?: string | null
  onboardingGoals?: string[] | null
  siteUrl?: string | null
  onboardingCompletedAt?: string | null
  dashboardWelcomeDismissed?: boolean
}

function parseGoals(raw: unknown): string[] | null {
  if (raw == null) return null
  if (Array.isArray(raw)) return raw.map(String)
  return null
}

export function userToSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isGuest: isGuestUserRecord(user),
    onboardingRole: user.onboardingRole,
    onboardingGoals: parseGoals(user.onboardingGoals),
    siteUrl: user.siteUrl,
    onboardingCompletedAt: user.onboardingCompletedAt?.toISOString() ?? null,
    dashboardWelcomeDismissed: user.dashboardWelcomeDismissed,
  }
}

export function isGuestSessionUser(user: SessionUser | null | undefined): boolean {
  if (!user) return false
  if (user.isGuest === true) return true
  return user.id === GUEST_USER_ID || user.email === "guest@local"
}
