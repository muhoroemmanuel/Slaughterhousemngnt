"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { type AuthSession, getSession, logout as authLogout, hasPermission } from "@/lib/auth"

export function useAuth(requireAuth = false) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const currentSession = getSession()
    setSession(currentSession)
    setLoading(false)

    if (requireAuth && !currentSession && pathname !== "/login") {
      router.push("/login")
    }
  }, [requireAuth, router, pathname])

  const logout = () => {
    authLogout()
    setSession(null)
    router.push("/login")
  }

  const checkPermission = (resource: string): boolean => {
    if (!session) return false
    return hasPermission(session.user.role, resource)
  }

  return {
    user: session?.user || null,
    session,
    loading,
    isAuthenticated: !!session,
    logout,
    checkPermission,
  }
}
