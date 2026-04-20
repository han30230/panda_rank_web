import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const bodySchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
})

export async function POST(req: Request) {
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

  const { token, password } = parsed.data

  const row = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!row || row.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "링크가 만료되었거나 잘못되었습니다. 비밀번호 찾기를 다시 요청해 주세요." },
      { status: 400 },
    )
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({ where: { userId: row.userId } }),
    prisma.session.deleteMany({ where: { userId: row.userId } }),
  ])

  return NextResponse.json({ ok: true, message: "비밀번호가 변경되었습니다. 다시 로그인해 주세요." })
}
