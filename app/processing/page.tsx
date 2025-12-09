import { ProtectedRoute } from "@/components/protected-route"
import { ProcessingWorkflow } from "@/components/processing-workflow"

export default function ProcessingPage() {
  return (
    <ProtectedRoute requiredPermission="processing">
      <ProcessingWorkflow />
    </ProtectedRoute>
  )
}
