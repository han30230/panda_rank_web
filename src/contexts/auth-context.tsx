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

import {
  GUEST_USER,
  loginLocalUser,
  persistSession,
  readSessionFromCookie,
  readSessionFromStorage,
  registerLocalUser,
  setSessionCookie,
  type SessionUser,
} from "@/lib/local-auth"

type AuthContextValue = {
  user: SessionUser | null
  ready: boolean
  login: (email: string, password: string) => void
  signUp: (input: { email: string; password: string; name: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const fromCookie = readSessionFromCookie()
    const fromStorage = readSessionFromStorage()
    const resolved = fromCookie ?? fromStorage
    if (resolved) {
      persistSession(resolved)
      setSessionCookie(resolved)
      startTransition(() => {
        setUser(resolved)
      })
    } else {
      persistSession(GUEST_USER)
      setSessionCookie(GUEST_USER)
      startTransition(() => {
        setUser(GUEST_USER)
      })
    }
    startTransition(() => {
      setReady(true)
    })
  }, [])

  const login = useCallback((email: string, password: string) => {
    const u = loginLocalUser(email, password)
    setUser(u)
    persistSession(u)
    setSessionCookie(u)
  }, [])

  const signUp = useCallback(
    (input: { email: string; password: string; name: string }) => {
      const u = registerLocalUser(input)
      setUser(u)
      persistSession(u)
      setSessionCookie(u)
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(GUEST_USER)
    persistSession(GUEST_USER)
    setSessionCookie(GUEST_USER)
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
