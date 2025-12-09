"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { type User, type AuthSession, getSession, logout as authLogout, hasPermission } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  loading: boolean
  isAuthenticated: boolean
  logout: () => void
  checkPermission: (resource: string) => boolean
  refreshSession: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const refreshSession = () => {
    const currentSession = getSession()
    setSession(currentSession)
  }

  useEffect(() => {
    refreshSession()
    setLoading(false)
  }, [])

  const logout = () => {
    authLogout()
    setSession(null)
    router.push("/login")
  }

  const checkPermission = (resource: string): boolean => {
    if (!session) return false
    return hasPermission(session.user.role, resource)
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        loading,
        isAuthenticated: !!session,
        logout,
        checkPermission,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
