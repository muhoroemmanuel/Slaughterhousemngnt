import { ProtectedRoute } from "@/components/protected-route"
import { LivestockIntake } from "@/components/livestock-intake"

export default function IntakePage() {
  return (
    <ProtectedRoute requiredPermission="intake">
      <LivestockIntake />
    </ProtectedRoute>
  )
}
