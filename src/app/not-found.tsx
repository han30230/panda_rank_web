import Link from "next/link"
import { ArrowLeft, Compass } from "lucide-react"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

export default function NotFound() {
  return (
    <div className="bg-muted/20 flex min-h-dvh flex-col">
      <header className="border-border/60 bg-background/90 sticky top-0 z-10 border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 md:px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-muted-foreground text-sm font-medium tabular-nums">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mt-4 max-w-md text-pretty text-sm leading-relaxed">
          주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 홈에서 다시 찾아보세요.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button className="rounded-full" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden />
              홈으로
            </Link>
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/pricing">
              <Compass className="size-4" aria-hidden />
              요금제
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
