"use client"

import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { Package, AlertCircle, CheckCircle, Users, ClipboardList, UserCog } from "lucide-react"

export function DashboardOverview() {
  const { checkPermission } = useAuth()

  const stats = [
    {
      title: "Active Livestock",
      value: "248",
      change: "+12 today",
      icon: Users,
      trend: "up",
    },
    {
      title: "Processing Queue",
      value: "32",
      change: "8 in progress",
      icon: ClipboardList,
      trend: "neutral",
    },
    {
      title: "Inventory Items",
      value: "1,847",
      change: "+156 this week",
      icon: Package,
      trend: "up",
    },
    {
      title: "Compliance Status",
      value: "98%",
      change: "All checks passed",
      icon: CheckCircle,
      trend: "up",
    },
  ]

  const recentActivity = [
    { id: 1, type: "intake", description: "Batch #2847 - 24 cattle received", time: "10 minutes ago" },
    { id: 2, type: "processing", description: "Processing line 2 completed", time: "25 minutes ago" },
    { id: 3, type: "inventory", description: "Cold storage unit 3 restocked", time: "1 hour ago" },
    { id: 4, type: "compliance", description: "Daily inspection completed", time: "2 hours ago" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Slaughterhouse Management</h1>
                <p className="text-sm text-muted-foreground">Operations Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-primary">
                  Dashboard
                </Link>
                {checkPermission("intake") && (
                  <Link
                    href="/intake"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Livestock Intake
                  </Link>
                )}
                {checkPermission("processing") && (
                  <Link
                    href="/processing"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Processing
                  </Link>
                )}
                {checkPermission("inventory") && (
                  <Link
                    href="/inventory"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Inventory
                  </Link>
                )}
                {checkPermission("compliance") && (
                  <Link
                    href="/compliance"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Compliance
                  </Link>
                )}
                {checkPermission("*") && (
                  <Link
                    href="/users"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Users
                  </Link>
                )}
              </nav>
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-1">
            <h2 className="font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              {checkPermission("intake") && (
                <Link
                  href="/intake"
                  className="w-full px-4 py-2 flex items-center gap-2 rounded border border-border bg-background text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <Users className="h-4 w-4" />
                  Register Livestock
                </Link>
              )}
              {checkPermission("processing") && (
                <Link
                  href="/processing"
                  className="w-full px-4 py-2 flex items-center gap-2 rounded border border-border bg-background text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <ClipboardList className="h-4 w-4" />
                  Start Processing
                </Link>
              )}
              {checkPermission("inventory") && (
                <Link
                  href="/inventory"
                  className="w-full px-4 py-2 flex items-center gap-2 rounded border border-border bg-background text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <Package className="h-4 w-4" />
                  Update Inventory
                </Link>
              )}
              {checkPermission("compliance") && (
                <Link
                  href="/compliance"
                  className="w-full px-4 py-2 flex items-center gap-2 rounded border border-border bg-background text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  Run Compliance Check
                </Link>
              )}
              {checkPermission("*") && (
                <Link
                  href="/users"
                  className="w-full px-4 py-2 flex items-center gap-2 rounded border border-border bg-background text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <UserCog className="h-4 w-4" />
                  Manage Users
                </Link>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
                    {activity.type === "intake" && <Users className="h-4 w-4 text-muted-foreground" />}
                    {activity.type === "processing" && <ClipboardList className="h-4 w-4 text-muted-foreground" />}
                    {activity.type === "inventory" && <Package className="h-4 w-4 text-muted-foreground" />}
                    {activity.type === "compliance" && <CheckCircle className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground leading-relaxed">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm mt-6">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            System Alerts
          </h2>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
            <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
            <p className="text-sm text-foreground leading-relaxed">
              All systems operational. No critical alerts at this time.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
