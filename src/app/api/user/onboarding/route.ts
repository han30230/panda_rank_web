import { NextResponse } from "next/server"
import { z } from "zod"

import { getSessionWithUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { userToSessionUser } from "@/lib/session-user"

const bodySchema = z.object({
  role: z.enum(["marketer", "creator", "operator"]),
  goals: z.array(z.string().min(1)).min(1),
  siteUrl: z.string().trim().max(500).optional(),
})

export async function POST(req: Request) {
  const session = await getSessionWithUser()
  if (!session) {
    return NextResponse.json({ error: "세션이 없습니다." }, { status: 401 })
  }

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

  const { role, goals, siteUrl } = parsed.data
  const url = siteUrl?.trim() ?? ""

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      onboardingRole: role,
      onboardingGoals: goals,
      siteUrl: url.length > 0 ? url : null,
      onboardingCompletedAt: new Date(),
    },
  })

  return NextResponse.json({ user: userToSessionUser(user) })
}
