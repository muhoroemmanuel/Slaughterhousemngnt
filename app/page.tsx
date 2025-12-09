import { ProtectedRoute } from "@/components/protected-route"
import { DashboardOverview } from "@/components/dashboard-overview"

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardOverview />
    </ProtectedRoute>
  )
}
