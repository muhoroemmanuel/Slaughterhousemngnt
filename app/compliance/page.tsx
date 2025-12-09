import { ProtectedRoute } from "@/components/protected-route"
import { ComplianceReporting } from "@/components/compliance-reporting"

export default function CompliancePage() {
  return (
    <ProtectedRoute requiredPermission="compliance">
      <ComplianceReporting />
    </ProtectedRoute>
  )
}
