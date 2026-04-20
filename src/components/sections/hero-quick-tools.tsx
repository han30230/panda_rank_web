"use client"

import Link from "next/link"
import {
  BarChart3,
  FileBarChart,
  Gift,
  ImageIcon,
  PenLine,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { HeroQuickToolItem } from "@/constants/landing"

const iconMap: Record<HeroQuickToolItem["icon"], LucideIcon> = {
  fileBarChart: FileBarChart,
  penLine: PenLine,
  image: ImageIcon,
  shoppingBag: ShoppingBag,
  barChart3: BarChart3,
  gift: Gift,
  trophy: Trophy,
  shoppingCart: ShoppingCart,
}

type Props = {
  items: readonly HeroQuickToolItem[]
}

export function HeroQuickTools({ items }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-8">
      {items.map((item) => {
        const Icon = iconMap[item.icon]
        return (
          <Link
            key={item.id}
            href={item.href}
            className="group focus-visible:ring-ring flex flex-col items-center gap-2 rounded-2xl py-2 text-center outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2"
          >
            <div
              className={`relative flex size-12 items-center justify-center rounded-2xl ring-1 transition-shadow group-hover:shadow-md md:size-14 ${item.colorClass}`}
            >
              <Icon className="size-6 md:size-7" strokeWidth={1.75} aria-hidden />
              {item.badge === "ai" ? (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border/80">
                  <Sparkles className="text-primary size-3" aria-hidden />
                </span>
              ) : null}
              {item.badge === "new" ? (
                <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded px-1 py-0 text-[9px] font-bold leading-none">
                  N
                </Badge>
              ) : null}
            </div>
            <span className="text-muted-foreground group-hover:text-foreground max-w-[5.5rem] text-[11px] font-medium leading-tight md:text-xs">
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
