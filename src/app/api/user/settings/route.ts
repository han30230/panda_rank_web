import { NextResponse } from "next/server"
import { z } from "zod"

import { getSessionWithUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { userToSessionUser } from "@/lib/session-user"

const patchSchema = z.object({
  dashboardWelcomeDismissed: z.boolean().optional(),
})

export async function PATCH(req: Request) {
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

  const parsed = patchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const d = parsed.data
  if (d.dashboardWelcomeDismissed === undefined) {
    return NextResponse.json({ error: "변경할 항목이 없습니다." }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { dashboardWelcomeDismissed: d.dashboardWelcomeDismissed },
  })

  return NextResponse.json({ user: userToSessionUser(user) })
}
