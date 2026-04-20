import { NextResponse } from "next/server"
import { z } from "zod"

import { getTrendingForPostType } from "@/lib/trending-live"

export const revalidate = 300

const querySchema = z.object({
  postType: z.string().trim().min(1).optional().default("informative"),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const parsed = querySchema.safeParse({
    postType: url.searchParams.get("postType") ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 })
  }

  try {
    const body = await getTrendingForPostType(parsed.data.postType)
    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (e) {
    console.error("trending topics", e)
    return NextResponse.json({ error: "트렌드를 불러오지 못했습니다." }, { status: 502 })
  }
}
