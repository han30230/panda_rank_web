"use client"

import { PANDA_GREEN, PANDA_PROMO_LINES } from "@/lib/pandarank-theme"

export function PandaPromoTicker() {
  return (
    <div
      className="border-b py-0 overflow-hidden"
      style={{
        borderColor: `${PANDA_GREEN}33`,
        background: `linear-gradient(180deg, ${PANDA_GREEN}0f 0%, transparent 100%)`,
      }}
    >
      <div className="animate-panda-marquee flex w-max gap-16 py-3">
        {[...PANDA_PROMO_LINES, ...PANDA_PROMO_LINES].map((line, i) => (
          <span
            key={`${line}-${i}`}
            className="text-compact-sm shrink-0 whitespace-nowrap text-sm font-medium sm:text-base"
          >
            <span style={{ color: PANDA_GREEN }} className="font-semibold">
              판다 AI
            </span>
            <span className="text-foreground/85 mx-1">·</span>
            <span className="text-foreground/90">{line}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
