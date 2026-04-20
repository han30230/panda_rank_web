"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from "react"

import type { SessionUser } from "@/lib/local-auth"
import {
  SESSION_COOKIE,
  SESSION_STORAGE_KEY,
} from "@/lib/session-constants"

type AuthContextValue = {
  user: SessionUser | null
  ready: boolean
  login: (email: string, password: string) => Promise<void>
  signUp: (input: { email: string; password: string; name: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function clearLegacyClientSession() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    clearLegacyClientSession()
    void fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("me")
        const data = (await res.json()) as { user: SessionUser }
        startTransition(() => {
          setUser(data.user)
        })
      })
      .catch(() => {
        startTransition(() => {
          setUser(null)
        })
      })
      .finally(() => {
        startTransition(() => {
          setReady(true)
        })
      })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = (await res.json().catch(() => ({}))) as {
      error?: unknown
      user?: SessionUser
    }
    if (!res.ok) {
      const msg =
        typeof data.error === "string"
          ? data.error
          : "로그인에 실패했습니다."
      throw new Error(msg)
    }
    if (data.user) setUser(data.user)
  }, [])

  const signUp = useCallback(
    async (input: { email: string; password: string; name: string }) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: input.name,
          email: input.email,
          password: input.password,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: unknown
        user?: SessionUser
      }
      if (!res.ok) {
        let msg = "가입에 실패했습니다."
        if (typeof data.error === "string") msg = data.error
        else if (data.error && typeof data.error === "object") {
          msg = "입력값을 확인해 주세요."
        }
        throw new Error(msg)
      }
      if (data.user) setUser(data.user)
    },
    [],
  )

  const logout = useCallback(async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    const data = (await res.json().catch(() => ({}))) as { user?: SessionUser }
    if (res.ok && data.user) {
      setUser(data.user)
      return
    }
    void fetch("/api/auth/me", { credentials: "include" }).then(async (r) => {
      if (r.ok) {
        const j = (await r.json()) as { user: SessionUser }
        setUser(j.user)
      }
    })
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, signUp, logout }),
    [user, ready, login, signUp, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.")
  }
  return ctx
}
