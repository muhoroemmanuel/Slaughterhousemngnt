"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login, getSession } from "@/lib/auth"
import { Lock, Mail, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const session = getSession()
    if (session) {
      router.push("/")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("[v0] Attempting login with email:", email)
      const result = login(email, password)
      console.log("[v0] Login result:", result.success, result.error)

      if (result.success) {
        console.log("[v0] Login successful, redirecting to dashboard")
        router.push("/")
      } else {
        setError(result.error || "Login failed")
        setLoading(false)
      }
    } catch (err) {
      console.log("[v0] Login error:", err)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  const handleResetAuth = () => {
    localStorage.removeItem("users")
    localStorage.removeItem("user_passwords")
    localStorage.removeItem("auth_session")
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Slaughterhouse Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your credentials to access the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="operator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-4 rounded-md bg-muted p-3 text-sm">
            <p className="mb-1 font-semibold text-foreground">Demo Credentials:</p>
            <p className="text-muted-foreground">Email: admin@slaughterhouse.com</p>
            <p className="text-muted-foreground">Password: admin123</p>
          </div>

          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={handleResetAuth}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              Having trouble? Reset authentication data
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
