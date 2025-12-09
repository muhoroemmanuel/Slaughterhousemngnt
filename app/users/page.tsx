"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { UserManagement } from "@/components/user-management"

export default function UsersPage() {
  return (
    <ProtectedRoute requiredPermission="*">
      <UserManagement />
    </ProtectedRoute>
  )
}
