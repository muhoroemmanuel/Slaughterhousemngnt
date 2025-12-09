import { ProtectedRoute } from "@/components/protected-route"
import { InventoryManagement } from "@/components/inventory-management"

export default function InventoryPage() {
  return (
    <ProtectedRoute requiredPermission="inventory">
      <InventoryManagement />
    </ProtectedRoute>
  )
}
