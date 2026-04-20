import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "RankDeck — 키워드·콘텐츠 워크스페이스"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0f172a 0%, #022c22 42%, #14532d 88%)",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 18,
              background: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            R
          </div>
          <span
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            RankDeck
          </span>
        </div>
        <p
          style={{
            marginTop: 26,
            fontSize: 28,
            color: "rgba(248, 250, 252, 0.9)",
            maxWidth: 880,
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          Keyword insights, AI drafts, and on-page checks — one calm workspace for growing channels.
        </p>
      </div>
    ),
    { ...size },
  )
}
