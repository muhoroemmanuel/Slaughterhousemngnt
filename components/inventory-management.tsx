"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  ArrowLeft,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  Trash2,
  Edit,
  TrendingUp,
  DollarSign,
  BarChart3,
  LinkIcon,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  location: string
  temperature: string
  status: "optimal" | "low" | "critical"
  lastUpdated: string
  // Traceability fields
  animalId?: string
  farmOrigin?: string
  batchNumber?: string
  dateReceived?: string
  dateProcessed?: string
  // Financial fields
  costPerUnit: number
  sellingPrice: number
  purchaseOrderId?: string
  // Calculated fields
  totalValue?: number
  profitMargin?: number
  daysInStock?: number
}

export function InventoryManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState("")
  const [editingCostId, setEditingCostId] = useState<string | null>(null)
  const [editCost, setEditCost] = useState("")
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState("")
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)
  const [viewDetailsItem, setViewDetailsItem] = useState<InventoryItem | null>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "beef",
    quantity: "",
    unit: "kg",
    location: "",
    temperature: "",
    animalId: "",
    farmOrigin: "",
    batchNumber: "",
    costPerUnit: "",
    sellingPrice: "",
    purchaseOrderId: "",
  })

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Beef Cuts - Prime",
      category: "beef",
      quantity: 450,
      unit: "kg",
      location: "Cold Storage A1",
      temperature: "2°C",
      status: "optimal",
      lastUpdated: "2 hours ago",
      animalId: "C-2847-001",
      farmOrigin: "Green Valley Farms",
      batchNumber: "2847",
      dateReceived: "2025-03-10",
      dateProcessed: "2025-03-10",
      costPerUnit: 8.5,
      sellingPrice: 15.0,
      purchaseOrderId: "PO-2847",
      totalValue: 3825,
      profitMargin: 76.47,
      daysInStock: 0,
    },
    {
      id: "2",
      name: "Pork Cuts - Standard",
      category: "pork",
      quantity: 280,
      unit: "kg",
      location: "Cold Storage A2",
      temperature: "3°C",
      status: "optimal",
      lastUpdated: "1 hour ago",
      animalId: "P-2846-001",
      farmOrigin: "Riverside Ranch",
      batchNumber: "2846",
      dateReceived: "2025-03-10",
      dateProcessed: "2025-03-10",
      costPerUnit: 6.0,
      sellingPrice: 11.0,
      purchaseOrderId: "PO-2846",
      totalValue: 1680,
      profitMargin: 83.33,
      daysInStock: 0,
    },
    {
      id: "3",
      name: "Lamb Cuts",
      category: "lamb",
      quantity: 85,
      unit: "kg",
      location: "Cold Storage B1",
      temperature: "2°C",
      status: "low",
      lastUpdated: "30 minutes ago",
      animalId: "L-2845-001",
      farmOrigin: "Mountain View Livestock",
      batchNumber: "2845",
      dateReceived: "2025-03-09",
      dateProcessed: "2025-03-09",
      costPerUnit: 10.0,
      sellingPrice: 18.0,
      purchaseOrderId: "PO-2845",
      totalValue: 850,
      profitMargin: 80.0,
      daysInStock: 1,
    },
    {
      id: "4",
      name: "Beef Offal",
      category: "offal",
      quantity: 120,
      unit: "kg",
      location: "Cold Storage C1",
      temperature: "1°C",
      status: "optimal",
      lastUpdated: "3 hours ago",
      animalId: "C-2847-002",
      farmOrigin: "Green Valley Farms",
      batchNumber: "2847",
      dateReceived: "2025-03-10",
      dateProcessed: "2025-03-10",
      costPerUnit: 3.0,
      sellingPrice: 5.5,
      purchaseOrderId: "PO-2847",
      totalValue: 360,
      profitMargin: 83.33,
      daysInStock: 0,
    },
    {
      id: "5",
      name: "Pork Ribs",
      category: "pork",
      quantity: 45,
      unit: "kg",
      location: "Cold Storage A2",
      temperature: "3°C",
      status: "critical",
      lastUpdated: "15 minutes ago",
      animalId: "P-2846-002",
      farmOrigin: "Riverside Ranch",
      batchNumber: "2846",
      dateReceived: "2025-03-10",
      dateProcessed: "2025-03-10",
      costPerUnit: 7.5,
      sellingPrice: 13.0,
      purchaseOrderId: "PO-2846",
      totalValue: 337.5,
      profitMargin: 73.33,
      daysInStock: 0,
    },
    {
      id: "6",
      name: "Ground Beef",
      category: "beef",
      quantity: 320,
      unit: "kg",
      location: "Cold Storage A3",
      temperature: "2°C",
      status: "optimal",
      lastUpdated: "4 hours ago",
      animalId: "C-2847-003",
      farmOrigin: "Green Valley Farms",
      batchNumber: "2847",
      dateReceived: "2025-03-10",
      dateProcessed: "2025-03-10",
      costPerUnit: 5.0,
      sellingPrice: 9.0,
      purchaseOrderId: "PO-2847",
      totalValue: 1600,
      profitMargin: 80.0,
      daysInStock: 0,
    },
  ])

  useEffect(() => {
    const loadInventory = () => {
      const stored = localStorage.getItem("inventory")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInventory(parsed)
          }
        } catch (error) {
          console.error("Failed to load inventory from localStorage:", error)
        }
      }
    }

    loadInventory()
  }, [])

  useEffect(() => {
    if (inventory.length > 0) {
      localStorage.setItem("inventory", JSON.stringify(inventory))
    }
  }, [inventory])

  const handleUpdateQuantity = (id: string, change: number) => {
    setInventory(
      inventory.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change)
          let newStatus: "optimal" | "low" | "critical" = "optimal"
          if (newQuantity < 50) newStatus = "critical"
          else if (newQuantity < 100) newStatus = "low"
          const totalValue = newQuantity * item.costPerUnit
          return { ...item, quantity: newQuantity, status: newStatus, lastUpdated: "Just now", totalValue }
        }
        return item
      }),
    )
  }

  const handleEditQuantity = (id: string, newQuantity: string) => {
    const quantity = Number.parseInt(newQuantity)
    if (isNaN(quantity) || quantity < 0) return

    setInventory(
      inventory.map((item) => {
        if (item.id === id) {
          let newStatus: "optimal" | "low" | "critical" = "optimal"
          if (quantity < 50) newStatus = "critical"
          else if (quantity < 100) newStatus = "low"
          const totalValue = quantity * item.costPerUnit
          return { ...item, quantity, status: newStatus, lastUpdated: "Just now", totalValue }
        }
        return item
      }),
    )
    setEditingItemId(null)
    setEditQuantity("")
  }

  const handleEditCost = (id: string, newCost: string) => {
    const cost = Number.parseFloat(newCost)
    if (isNaN(cost) || cost < 0) return

    setInventory(
      inventory.map((item) => {
        if (item.id === id) {
          const totalValue = item.quantity * cost
          const profitMargin = item.sellingPrice > 0 ? ((item.sellingPrice - cost) / item.sellingPrice) * 100 : 0
          return { ...item, costPerUnit: cost, totalValue, profitMargin, lastUpdated: "Just now" }
        }
        return item
      }),
    )
    setEditingCostId(null)
    setEditCost("")
  }

  const handleEditPrice = (id: string, newPrice: string) => {
    const price = Number.parseFloat(newPrice)
    if (isNaN(price) || price < 0) return

    setInventory(
      inventory.map((item) => {
        if (item.id === id) {
          const profitMargin = price > 0 ? ((price - item.costPerUnit) / price) * 100 : 0
          return { ...item, sellingPrice: price, profitMargin, lastUpdated: "Just now" }
        }
        return item
      }),
    )
    setEditingPriceId(null)
    setEditPrice("")
  }

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.location || !newItem.temperature) {
      return
    }

    const quantity = Number.parseInt(newItem.quantity)
    const costPerUnit = Number.parseFloat(newItem.costPerUnit) || 0
    const sellingPrice = Number.parseFloat(newItem.sellingPrice) || 0
    let status: "optimal" | "low" | "critical" = "optimal"
    if (quantity < 50) status = "critical"
    else if (quantity < 100) status = "low"

    const totalValue = quantity * costPerUnit
    const profitMargin = sellingPrice > 0 ? ((sellingPrice - costPerUnit) / sellingPrice) * 100 : 0

    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      quantity,
      unit: newItem.unit,
      location: newItem.location,
      temperature: newItem.temperature,
      status,
      lastUpdated: "Just now",
      animalId: newItem.animalId || undefined,
      farmOrigin: newItem.farmOrigin || undefined,
      batchNumber: newItem.batchNumber || undefined,
      dateReceived: new Date().toISOString().split("T")[0],
      costPerUnit,
      sellingPrice,
      purchaseOrderId: newItem.purchaseOrderId || undefined,
      totalValue,
      profitMargin,
      daysInStock: 0,
    }

    setInventory([...inventory, item])
    setIsAddDialogOpen(false)
    setNewItem({
      name: "",
      category: "beef",
      quantity: "",
      unit: "kg",
      location: "",
      temperature: "",
      animalId: "",
      farmOrigin: "",
      batchNumber: "",
      costPerUnit: "",
      sellingPrice: "",
      purchaseOrderId: "",
    })
  }

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id))
    setDeleteItemId(null)
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "low":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0)
  const criticalItems = inventory.filter((item) => item.status === "critical").length
  const lowStockItems = inventory.filter((item) => item.status === "low").length
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.totalValue || 0), 0)
  const averageProfitMargin =
    inventory.length > 0 ? inventory.reduce((sum, item) => sum + (item.profitMargin || 0), 0) / inventory.length : 0
  const totalCost = inventory.reduce((sum, item) => sum + item.quantity * item.costPerUnit, 0)
  const potentialRevenue = inventory.reduce((sum, item) => sum + item.quantity * item.sellingPrice, 0)
  const averageTurnoverDays =
    inventory.length > 0 ? inventory.reduce((sum, item) => sum + (item.daysInStock || 0), 0) / inventory.length : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-sans text-xl font-bold text-foreground">Inventory Management</h1>
                  <p className="text-sm text-muted-foreground">Track and manage stock levels</p>
                </div>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>Enter the details for the new inventory item.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Beef Cuts - Prime"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                      >
                        <SelectTrigger id="category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beef">Beef</SelectItem>
                          <SelectItem value="pork">Pork</SelectItem>
                          <SelectItem value="lamb">Lamb</SelectItem>
                          <SelectItem value="offal">Offal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                        <SelectTrigger id="unit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="lbs">lbs</SelectItem>
                          <SelectItem value="units">units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="e.g., 450"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Traceability Information</h4>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="animalId">Animal ID</Label>
                          <Input
                            id="animalId"
                            placeholder="e.g., C-2847-001"
                            value={newItem.animalId}
                            onChange={(e) => setNewItem({ ...newItem, animalId: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="batchNumber">Batch Number</Label>
                          <Input
                            id="batchNumber"
                            placeholder="e.g., 2847"
                            value={newItem.batchNumber}
                            onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="farmOrigin">Farm Origin</Label>
                        <Input
                          id="farmOrigin"
                          placeholder="e.g., Green Valley Farms"
                          value={newItem.farmOrigin}
                          onChange={(e) => setNewItem({ ...newItem, farmOrigin: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Financial Information</h4>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="costPerUnit">Cost per Unit ($)</Label>
                          <Input
                            id="costPerUnit"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 8.50"
                            value={newItem.costPerUnit}
                            onChange={(e) => setNewItem({ ...newItem, costPerUnit: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                          <Input
                            id="sellingPrice"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 15.00"
                            value={newItem.sellingPrice}
                            onChange={(e) => setNewItem({ ...newItem, sellingPrice: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="purchaseOrderId">Purchase Order ID</Label>
                        <Input
                          id="purchaseOrderId"
                          placeholder="e.g., PO-2847"
                          value={newItem.purchaseOrderId}
                          onChange={(e) => setNewItem({ ...newItem, purchaseOrderId: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Storage Information</h4>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="location">Storage Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Cold Storage A1"
                          value={newItem.location}
                          onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="temperature">Temperature</Label>
                        <Input
                          id="temperature"
                          placeholder="e.g., 2°C"
                          value={newItem.temperature}
                          onChange={(e) => setNewItem({ ...newItem, temperature: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Financials</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{totalItems.toLocaleString()} kg</div>
                  <p className="text-xs text-muted-foreground mt-1">{inventory.length} product types</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    $
                    {totalInventoryValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Current inventory cost</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{lowStockItems}</div>
                  <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Critical Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{criticalItems}</div>
                  <p className="text-xs text-muted-foreground mt-1">Immediate action needed</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search inventory..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="beef">Beef</SelectItem>
                      <SelectItem value="pork">Pork</SelectItem>
                      <SelectItem value="lamb">Lamb</SelectItem>
                      <SelectItem value="offal">Offal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Current Stock</CardTitle>
                <CardDescription>Real-time inventory levels with traceability and financial data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Cost/Unit</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                          <TableCell className="capitalize text-muted-foreground">{item.category}</TableCell>
                          <TableCell className="text-foreground">
                            {editingItemId === item.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={editQuantity}
                                  onChange={(e) => setEditQuantity(e.target.value)}
                                  onBlur={() => handleEditQuantity(item.id, editQuantity)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleEditQuantity(item.id, editQuantity)
                                    } else if (e.key === "Escape") {
                                      setEditingItemId(null)
                                      setEditQuantity("")
                                    }
                                  }}
                                  className="w-20 h-8"
                                  autoFocus
                                />
                                <span className="text-sm text-muted-foreground">{item.unit}</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingItemId(item.id)
                                  setEditQuantity(item.quantity.toString())
                                }}
                                className="flex items-center gap-2 hover:text-primary transition-colors"
                              >
                                {item.quantity} {item.unit}
                                <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                              </button>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">${item.costPerUnit.toFixed(2)}</TableCell>
                          <TableCell className="font-medium text-foreground">${item.totalValue?.toFixed(2)}</TableCell>
                          <TableCell>
                            {item.batchNumber ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setViewDetailsItem(item)}
                              >
                                <LinkIcon className="h-3 w-3 mr-1" />
                                {item.batchNumber}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("capitalize", getStatusColor(item.status))}>
                              {item.status === "critical" && <AlertTriangle className="mr-1 h-3 w-3" />}
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => handleUpdateQuantity(item.id, -10)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => handleUpdateQuantity(item.id, 10)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                onClick={() => setDeleteItemId(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Financial Overview */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Current inventory cost</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Potential Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    $
                    {potentialRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">If all stock sold</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Avg Profit Margin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{averageProfitMargin.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all products</p>
                </CardContent>
              </Card>
            </div>

            {/* Turnover and Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Inventory Turnover Analysis</CardTitle>
                <CardDescription>Track how quickly inventory moves through your facility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Average Days in Stock</p>
                      <p className="text-xs text-muted-foreground mt-1">Lower is better for perishable goods</p>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{averageTurnoverDays.toFixed(1)} days</div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Estimated Annual Turnover Rate</p>
                      <p className="text-xs text-muted-foreground mt-1">Based on current average</p>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {averageTurnoverDays > 0 ? (365 / averageTurnoverDays).toFixed(1) : "N/A"}x
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Product Performance</CardTitle>
                <CardDescription>Financial breakdown by product - click to edit prices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Cost/Unit</TableHead>
                        <TableHead>Sell Price</TableHead>
                        <TableHead>Total Value</TableHead>
                        <TableHead>Profit Margin</TableHead>
                        <TableHead>Days in Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {editingCostId === item.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm">$</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editCost}
                                  onChange={(e) => setEditCost(e.target.value)}
                                  onBlur={() => handleEditCost(item.id, editCost)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleEditCost(item.id, editCost)
                                    } else if (e.key === "Escape") {
                                      setEditingCostId(null)
                                      setEditCost("")
                                    }
                                  }}
                                  className="w-24 h-8"
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingCostId(item.id)
                                  setEditCost(item.costPerUnit.toString())
                                }}
                                className="flex items-center gap-2 hover:text-primary transition-colors group"
                              >
                                ${item.costPerUnit.toFixed(2)}
                                <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                              </button>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {editingPriceId === item.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm">$</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  onBlur={() => handleEditPrice(item.id, editPrice)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleEditPrice(item.id, editPrice)
                                    } else if (e.key === "Escape") {
                                      setEditingPriceId(null)
                                      setEditPrice("")
                                    }
                                  }}
                                  className="w-24 h-8"
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingPriceId(item.id)
                                  setEditPrice(item.sellingPrice.toString())
                                }}
                                className="flex items-center gap-2 hover:text-primary transition-colors group"
                              >
                                ${item.sellingPrice.toFixed(2)}
                                <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                              </button>
                            )}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">${item.totalValue?.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                (item.profitMargin || 0) >= 75
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : (item.profitMargin || 0) >= 50
                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                              )}
                            >
                              {item.profitMargin?.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{item.daysInStock} days</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={viewDetailsItem !== null} onOpenChange={() => setViewDetailsItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Traceability Details</DialogTitle>
            <DialogDescription>Complete tracking information for this inventory item</DialogDescription>
          </DialogHeader>
          {viewDetailsItem && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Product Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product Name:</span>
                    <span className="font-medium text-foreground">{viewDetailsItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium text-foreground capitalize">{viewDetailsItem.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium text-foreground">
                      {viewDetailsItem.quantity} {viewDetailsItem.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Traceability</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Animal ID:</span>
                    <span className="font-medium text-foreground">{viewDetailsItem.animalId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Batch Number:</span>
                    <span className="font-medium text-foreground">{viewDetailsItem.batchNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Farm Origin:</span>
                    <span className="font-medium text-foreground">{viewDetailsItem.farmOrigin || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date Received:</span>
                    <span className="font-medium text-foreground">{viewDetailsItem.dateReceived || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date Processed:</span>
                    <span className="font-medium text-foreground">{viewDetailsItem.dateProcessed || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Financial Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase Order:</span>
                    <span className="font-medium text-foreground">{viewDetailsItem.purchaseOrderId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost per Unit:</span>
                    <span className="font-medium text-foreground">${viewDetailsItem.costPerUnit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selling Price:</span>
                    <span className="font-medium text-foreground">${viewDetailsItem.sellingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Value:</span>
                    <span className="font-medium text-foreground">${viewDetailsItem.totalValue?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Profit Margin:</span>
                    <span className="font-medium text-green-500">{viewDetailsItem.profitMargin?.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Storage</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium text-foreground">{viewDetailsItem.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temperature:</span>
                    <span className="font-medium text-foreground">{viewDetailsItem.temperature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days in Stock:</span>
                    <span className="font-medium text-foreground">{viewDetailsItem.daysInStock} days</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsItem(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteItemId !== null} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
