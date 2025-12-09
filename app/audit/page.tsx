"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AuditLogViewer } from "@/components/audit-log-viewer"

export default function AuditPage() {
  return (
    <ProtectedRoute requiredPermission="*">
      <AuditLogViewer />
    </ProtectedRoute>
  )
}
