import { cookies } from "next/headers"
import { randomBytes } from "crypto"

import { prisma } from "@/lib/prisma"
import { SESSION_COOKIE_NAME } from "@/lib/session-constants"

const SESSION_DAYS = 7

export function randomSessionToken(): string {
  return randomBytes(32).toString("hex")
}

export function sessionExpiresAt(): Date {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
}

export async function getSessionWithUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })
  if (!session) return null
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {})
    return null
  }
  return session
}

export async function getUserFromCookie() {
  const s = await getSessionWithUser()
  return s?.user ?? null
}
