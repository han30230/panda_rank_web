"use client"

import Link from "next/link"
import { BarChart3, Menu, Search } from "lucide-react"

import { siteConfig, mainNav } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  return (
    <header className="border-border/55 sticky top-0 z-50 w-full border-b bg-background/85 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 py-2 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-foreground"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BarChart3 className="size-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </Link>

        <NavigationMenu
          className="relative z-50 hidden min-w-0 max-w-[min(100%,56rem)] flex-1 justify-center lg:flex"
          viewport={false}
        >
          {/* overflow-x-auto 제거: 드롭다운(제품·리소스 등)이 잘리지 않도록 줄바꿈 사용 */}
          <NavigationMenuList className="flex flex-wrap justify-center gap-x-0.5 gap-y-1 py-0.5">
            {mainNav.map((group) => (
              <NavigationMenuItem key={group.title}>
                <NavigationMenuTrigger className="h-9 shrink-0 px-2 text-xs font-medium sm:px-2.5 sm:text-sm">
                  {group.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="data-[motion^=from-]:animate-none data-[motion^=to-]:animate-none">
                  <ul className="grid w-[min(90vw,380px)] gap-1 p-2 sm:w-[400px]">
                    {group.items.map((item) => (
                      <li key={item.href + item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="flex flex-col gap-0.5 rounded-lg p-3 no-underline hover:bg-muted"
                          >
                            <span className="font-medium">{item.title}</span>
                            <span className="text-muted-foreground text-xs leading-snug">
                              {item.description}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/pricing"
                  className="inline-flex h-9 items-center rounded-lg px-2.5 py-1.5 text-sm font-medium hover:bg-muted"
                >
                  요금제
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon-sm" className="hidden sm:inline-flex" asChild>
            <Link href="/analyze/keyword" aria-label="분석 도구로 이동">
              <Search className="size-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
            <Link href="/login">로그인</Link>
          </Button>
          <Button size="lg" className="hidden rounded-full px-5 sm:inline-flex" asChild>
            <Link href="/dashboard">무료로 시작</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="메뉴">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw,380px)] gap-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <BarChart3 className="size-4" />
                </span>
                {siteConfig.name}
              </Link>
              <nav className="flex max-h-[min(70vh,560px)] flex-col gap-4 overflow-y-auto pr-1 text-sm">
                {mainNav.map((group) => (
                  <div key={group.title}>
                    <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                      {group.title}
                    </p>
                    <ul className="flex flex-col gap-1">
                      {group.items.map((item) => (
                        <li key={item.title + item.href}>
                          <Link
                            href={item.href}
                            className="block rounded-lg px-2 py-2 hover:bg-muted"
                          >
                            <span className="font-medium">{item.title}</span>
                            <span className="text-muted-foreground mt-0.5 block text-xs leading-snug">
                              {item.description}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link href="/pricing" className="block rounded-lg px-2 py-2 font-medium hover:bg-muted">
                  요금제
                </Link>
                <Link href="/login" className="block rounded-lg px-2 py-2 font-medium hover:bg-muted">
                  로그인
                </Link>
                <Button className="mt-2 w-full rounded-full" asChild>
                  <Link href="/dashboard">무료로 시작</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
