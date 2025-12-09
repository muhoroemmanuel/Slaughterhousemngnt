"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Package,
  ArrowLeft,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Bell,
  Truck,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

interface LivestockEntry {
  id: string
  animalId: string
  type: string
  breed: string
  quantity: number
  weight: string
  supplier: string
  origin: string
  transportId: string
  healthCert: string
  traceabilityCode: string
  purchasePrice: number
  paymentTerms: string
  invoiceNumber: string
  qualityGrade: string
  vetInspectionStatus: string
  vetInspectionNotes: string
  quarantineFlag: boolean
  quarantineReason: string
  intakeTimestamp: Date
  expectedProcessingDate: Date
  holdingDuration: number
  processingBatchId?: string
  processingLineAssigned?: string
  status: "pending" | "inspected" | "cleared" | "processing" | "quarantine"
  notes: string
}

export function LivestockIntake() {
  const [entries, setEntries] = useState<LivestockEntry[]>([])
  const [holdingPenAnimals, setHoldingPenAnimals] = useState<LivestockEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<LivestockEntry | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState<string>("")

  const [currentEntry, setCurrentEntry] = useState({
    animalId: "",
    type: "",
    breed: "",
    quantity: "",
    weight: "",
    supplier: "",
    origin: "",
    transportId: "",
    healthCert: "",
    purchasePrice: "",
    paymentTerms: "Net 30",
    invoiceNumber: "",
    qualityGrade: "Select",
    vetInspectionStatus: "pending",
    vetInspectionNotes: "",
    quarantineFlag: false,
    quarantineReason: "",
    notes: "",
  })

  useEffect(() => {
    if (currentEntry.type && !currentEntry.animalId) {
      const generatedId = generateAnimalId(currentEntry.type)
      setCurrentEntry((prev) => ({ ...prev, animalId: generatedId }))
    }
  }, [currentEntry.type])

  const generateAnimalId = (type: string) => {
    const typePrefix =
      {
        cattle: "CTL",
        pigs: "PIG",
        sheep: "SHP",
        goats: "GOT",
        poultry: "PLT",
      }[type] || "ANM"

    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")

    const todayAnimals = [...entries, ...holdingPenAnimals].filter(
      (entry) =>
        entry.type === type && entry.intakeTimestamp.toISOString().slice(0, 10) === date.toISOString().slice(0, 10),
    )
    const sequenceNum = (todayAnimals.length + 1).toString().padStart(4, "0")

    return `${typePrefix}-${dateStr}-${sequenceNum}`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setHoldingPenAnimals((prev) =>
        prev.map((animal) => ({
          ...animal,
          holdingDuration: Math.floor((Date.now() - animal.intakeTimestamp.getTime()) / (1000 * 60 * 60)),
        })),
      )
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    localStorage.setItem("holdingPenAnimals", JSON.stringify(holdingPenAnimals))
  }, [holdingPenAnimals])

  useEffect(() => {
    const stored = localStorage.getItem("holdingPenAnimals")
    if (stored) {
      const parsed = JSON.parse(stored)
      setHoldingPenAnimals(
        parsed.map((animal: any) => ({
          ...animal,
          intakeTimestamp: new Date(animal.intakeTimestamp),
          expectedProcessingDate: new Date(animal.expectedProcessingDate),
        })),
      )
    }
  }, [])

  const validateAnimalId = (animalId: string) => {
    const isDuplicate = [...entries, ...holdingPenAnimals].some(
      (entry) => entry.animalId.toLowerCase() === animalId.toLowerCase(),
    )
    if (isDuplicate) {
      setDuplicateWarning(`Warning: Animal ID "${animalId}" already exists in the system!`)
      return false
    }
    setDuplicateWarning("")
    return true
  }

  const generateTraceabilityCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `TC-${timestamp}-${random}`
  }

  const createProcessingBatch = (entry: LivestockEntry) => {
    const batchId = `BATCH-${Date.now()}`
    const availableLines = ["Line A", "Line B", "Line C"]
    const assignedLine = availableLines[Math.floor(Math.random() * availableLines.length)]

    console.log("[v0] Auto-creating processing batch:", {
      batchId,
      assignedLine,
      animalId: entry.animalId,
      traceabilityCode: entry.traceabilityCode,
      weight: entry.weight,
      origin: entry.origin,
      supplier: entry.supplier,
      purchasePrice: entry.purchasePrice,
      qualityGrade: entry.qualityGrade,
    })

    console.log("[v0] Notification sent to processing team:", {
      message: `New batch ${batchId} ready for processing on ${assignedLine}`,
      animalCount: entry.quantity,
      priority: entry.qualityGrade === "Prime" ? "High" : "Normal",
    })

    return { batchId, assignedLine }
  }

  const handleAddEntry = () => {
    if (!currentEntry.animalId || !currentEntry.type || !currentEntry.quantity || !currentEntry.supplier) {
      alert("Please fill in all required fields (Animal ID, Type, Quantity, Supplier)")
      return
    }

    if (!validateAnimalId(currentEntry.animalId)) {
      return
    }

    const traceabilityCode = generateTraceabilityCode()
    const intakeTimestamp = new Date()

    const newEntry: LivestockEntry = {
      id: Date.now().toString(),
      animalId: currentEntry.animalId,
      type: currentEntry.type,
      breed: currentEntry.breed,
      quantity: Number.parseInt(currentEntry.quantity),
      weight: currentEntry.weight,
      supplier: currentEntry.supplier,
      origin: currentEntry.origin,
      transportId: currentEntry.transportId,
      healthCert: currentEntry.healthCert,
      traceabilityCode,
      purchasePrice: Number.parseFloat(currentEntry.purchasePrice) || 0,
      paymentTerms: currentEntry.paymentTerms,
      invoiceNumber: currentEntry.invoiceNumber,
      qualityGrade: currentEntry.qualityGrade,
      vetInspectionStatus: currentEntry.vetInspectionStatus,
      vetInspectionNotes: currentEntry.vetInspectionNotes,
      quarantineFlag: currentEntry.quarantineFlag,
      quarantineReason: currentEntry.quarantineReason,
      intakeTimestamp,
      expectedProcessingDate: new Date(intakeTimestamp.getTime() + 24 * 60 * 60 * 1000),
      holdingDuration: 0,
      status: currentEntry.quarantineFlag ? "quarantine" : "pending",
      notes: currentEntry.notes,
    }

    setEntries([...entries, newEntry])
    setCurrentEntry({
      animalId: "",
      type: "",
      breed: "",
      quantity: "",
      weight: "",
      supplier: "",
      origin: "",
      transportId: "",
      healthCert: "",
      purchasePrice: "",
      paymentTerms: "Net 30",
      invoiceNumber: "",
      qualityGrade: "Select",
      vetInspectionStatus: "pending",
      vetInspectionNotes: "",
      quarantineFlag: false,
      quarantineReason: "",
      notes: "",
    })
    setDuplicateWarning("")
  }

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const handleSubmit = () => {
    if (entries.length === 0) {
      alert("No entries to submit")
      return
    }

    const processedEntries = entries.map((entry) => {
      if (!entry.quarantineFlag) {
        const { batchId, assignedLine } = createProcessingBatch(entry)
        return {
          ...entry,
          processingBatchId: batchId,
          processingLineAssigned: assignedLine,
          status: "cleared" as const,
        }
      }
      return entry
    })

    setHoldingPenAnimals([...holdingPenAnimals, ...processedEntries])

    console.log("[v0] Submitting intake batch:", {
      entries: processedEntries,
      totalAnimals: processedEntries.reduce((sum, e) => sum + e.quantity, 0),
      totalCost: processedEntries.reduce((sum, e) => sum + e.purchasePrice * e.quantity, 0),
    })

    alert(
      `Batch registered successfully! ${processedEntries.length} entries recorded and ${processedEntries.filter((e) => !e.quarantineFlag).length} batches created for processing.`,
    )
    setEntries([])
  }

  const updateVetInspection = (id: string, status: string, notes: string) => {
    setHoldingPenAnimals((prev) =>
      prev.map((animal) =>
        animal.id === id
          ? {
              ...animal,
              vetInspectionStatus: status,
              vetInspectionNotes: notes,
              status: status === "passed" ? "cleared" : status === "failed" ? "quarantine" : "inspected",
            }
          : animal,
      ),
    )
  }

  const generateSupplierReport = (supplier: string) => {
    const supplierAnimals = holdingPenAnimals.filter((a) => a.supplier === supplier)
    const avgQuality = (supplierAnimals.filter((a) => a.qualityGrade === "Prime").length / supplierAnimals.length) * 100
    const passRate =
      (supplierAnimals.filter((a) => a.vetInspectionStatus === "passed").length / supplierAnimals.length) * 100

    console.log("[v0] Supplier Quality Report:", {
      supplier,
      totalDeliveries: supplierAnimals.length,
      averageQualityScore: avgQuality.toFixed(1) + "%",
      vetPassRate: passRate.toFixed(1) + "%",
      quarantineRate: supplierAnimals.filter((a) => a.quarantineFlag).length,
    })

    alert(
      `Quality Report for ${supplier}:\n\nTotal Deliveries: ${supplierAnimals.length}\nPrime Grade: ${avgQuality.toFixed(1)}%\nVet Pass Rate: ${passRate.toFixed(1)}%`,
    )
  }

  const recentBatches = holdingPenAnimals
    .sort((a, b) => b.intakeTimestamp.getTime() - a.intakeTimestamp.getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
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
                  <h1 className="font-sans text-xl font-bold text-foreground">Livestock Intake</h1>
                  <p className="text-sm text-muted-foreground">Register new arrivals with full traceability</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {holdingPenAnimals.length} in holding
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="intake" className="space-y-6">
          <TabsList>
            <TabsTrigger value="intake">New Intake</TabsTrigger>
            <TabsTrigger value="holding">
              Holding Pen
              {holdingPenAnimals.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {holdingPenAnimals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reports">Quality Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="intake">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">New Intake Entry</CardTitle>
                    <CardDescription>Enter livestock details with complete traceability information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {duplicateWarning && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">{duplicateWarning}</p>
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="animalId">Animal ID (Auto-generated) *</Label>
                        <Input
                          id="animalId"
                          placeholder="Select type to generate ID"
                          value={currentEntry.animalId}
                          readOnly
                          className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">
                          Format: TYPE-YYYYMMDD-XXXX (e.g., CTL-20250310-0001)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Livestock Type *</Label>
                        <Select
                          value={currentEntry.type}
                          onValueChange={(value) => setCurrentEntry({ ...currentEntry, type: value, animalId: "" })}
                        >
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent position="popper" className="bg-popover border-border shadow-lg">
                            <SelectItem value="cattle">Cattle</SelectItem>
                            <SelectItem value="pigs">Pigs</SelectItem>
                            <SelectItem value="sheep">Sheep</SelectItem>
                            <SelectItem value="goats">Goats</SelectItem>
                            <SelectItem value="poultry">Poultry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="breed">Breed</Label>
                        <Input
                          id="breed"
                          placeholder="e.g., Angus, Duroc"
                          value={currentEntry.breed}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, breed: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="Enter quantity"
                          value={currentEntry.quantity}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, quantity: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight">Average Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="Enter weight"
                          value={currentEntry.weight}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, weight: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="qualityGrade">Quality Grade</Label>
                        <Select
                          value={currentEntry.qualityGrade}
                          onValueChange={(value) => setCurrentEntry({ ...currentEntry, qualityGrade: value })}
                        >
                          <SelectTrigger id="qualityGrade">
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent position="popper" className="bg-popover border-border shadow-lg">
                            <SelectItem value="Prime">Prime</SelectItem>
                            <SelectItem value="Choice">Choice</SelectItem>
                            <SelectItem value="Select">Select</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="supplier">Supplier Name *</Label>
                        <Input
                          id="supplier"
                          placeholder="Enter supplier name"
                          value={currentEntry.supplier}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, supplier: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="origin">Origin Location</Label>
                        <Input
                          id="origin"
                          placeholder="Enter origin"
                          value={currentEntry.origin}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, origin: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="transportId">Transport ID</Label>
                        <Input
                          id="transportId"
                          placeholder="Enter transport ID"
                          value={currentEntry.transportId}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, transportId: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="healthCert">Health Certificate Number</Label>
                        <Input
                          id="healthCert"
                          placeholder="Enter certificate number"
                          value={currentEntry.healthCert}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, healthCert: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purchasePrice">Purchase Price per Animal (KES)</Label>
                        <Input
                          id="purchasePrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={currentEntry.purchasePrice}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, purchasePrice: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Invoice Number</Label>
                        <Input
                          id="invoiceNumber"
                          placeholder="Enter invoice #"
                          value={currentEntry.invoiceNumber}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, invoiceNumber: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="vetNotes">Vet Inspection Notes</Label>
                        <Textarea
                          id="vetNotes"
                          placeholder="Enter veterinary inspection notes"
                          value={currentEntry.vetInspectionNotes}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, vetInspectionNotes: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="quarantine"
                            checked={currentEntry.quarantineFlag}
                            onChange={(e) => setCurrentEntry({ ...currentEntry, quarantineFlag: e.target.checked })}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="quarantine" className="cursor-pointer">
                            Flag for Quarantine / Special Handling
                          </Label>
                        </div>
                        {currentEntry.quarantineFlag && (
                          <Input
                            placeholder="Enter quarantine reason"
                            value={currentEntry.quarantineReason}
                            onChange={(e) => setCurrentEntry({ ...currentEntry, quarantineReason: e.target.value })}
                          />
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Enter any additional information"
                          value={currentEntry.notes}
                          onChange={(e) => setCurrentEntry({ ...currentEntry, notes: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>

                    <Button onClick={handleAddEntry} className="w-full md:w-auto" disabled={!!duplicateWarning}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Batch
                    </Button>
                  </CardContent>
                </Card>

                {entries.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Current Batch ({entries.length} entries)</CardTitle>
                      <CardDescription>Review entries before submitting</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {entries.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-foreground capitalize">
                                  {entry.animalId} - {entry.type} {entry.breed && `(${entry.breed})`}
                                </p>
                                {entry.quarantineFlag && (
                                  <Badge variant="destructive" className="gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Quarantine
                                  </Badge>
                                )}
                                <Badge variant="outline">{entry.qualityGrade}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {entry.quantity} head • {entry.weight}kg avg • {entry.supplier}
                              </p>
                              {entry.purchasePrice > 0 && (
                                <p className="text-sm text-muted-foreground">
                                  KES {entry.purchasePrice}/animal • Total: KES{" "}
                                  {(entry.purchasePrice * entry.quantity).toFixed(2)}
                                </p>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveEntry(entry.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Button onClick={handleSubmit} className="w-full mt-6">
                        <Bell className="mr-2 h-4 w-4" />
                        Submit Batch & Notify Processing Team
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Recently Added Animals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentBatches.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No animals added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentBatches.map((animal) => (
                          <div
                            key={animal.id}
                            className="p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedEntry(animal)
                              setShowDetailsDialog(true)
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-medium text-foreground">{animal.animalId}</p>
                              <span className="text-xs text-muted-foreground">
                                {animal.intakeTimestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-foreground capitalize">
                              {animal.type} {animal.breed && `(${animal.breed})`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {animal.quantity} head • {animal.supplier}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <p className="text-xs text-muted-foreground font-mono">{animal.traceabilityCode}</p>
                              <Badge variant="outline" className="text-xs">
                                {animal.qualityGrade}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="holding">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Holding Pen Dashboard</CardTitle>
                <CardDescription>
                  Monitor livestock awaiting processing with welfare compliance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                {holdingPenAnimals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No animals currently in holding pen</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {holdingPenAnimals.map((animal) => (
                      <div key={animal.id} className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">
                                {animal.animalId} - {animal.type}
                              </h3>
                              <Badge
                                variant={
                                  animal.status === "cleared"
                                    ? "default"
                                    : animal.status === "quarantine"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {animal.status}
                              </Badge>
                              {animal.holdingDuration > 24 && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Exceeds 24h
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <p>
                                <strong>Traceability:</strong> {animal.traceabilityCode}
                              </p>
                              <p>
                                <strong>Supplier:</strong> {animal.supplier}
                              </p>
                              <p>
                                <strong>Origin:</strong> {animal.origin}
                              </p>
                              <p>
                                <strong>Quality:</strong> {animal.qualityGrade}
                              </p>
                              <p>
                                <strong>Holding Time:</strong> {animal.holdingDuration}h
                              </p>
                              <p>
                                <strong>Vet Status:</strong> {animal.vetInspectionStatus}
                              </p>
                              {animal.processingBatchId && (
                                <>
                                  <p>
                                    <strong>Batch:</strong> {animal.processingBatchId}
                                  </p>
                                  <p>
                                    <strong>Line:</strong> {animal.processingLineAssigned}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEntry(animal)
                              setShowDetailsDialog(true)
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </div>

                        {animal.quarantineFlag && (
                          <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-sm text-destructive">
                              <strong>Quarantine Reason:</strong> {animal.quarantineReason}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Supplier Quality Reports</CardTitle>
                <CardDescription>Generate performance reports for suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(holdingPenAnimals.map((a) => a.supplier))).map((supplier) => {
                    const supplierAnimals = holdingPenAnimals.filter((a) => a.supplier === supplier)
                    const avgQuality =
                      (supplierAnimals.filter((a) => a.qualityGrade === "Prime").length / supplierAnimals.length) * 100
                    const passRate =
                      (supplierAnimals.filter((a) => a.vetInspectionStatus === "passed").length /
                        supplierAnimals.length) *
                      100

                    return (
                      <div key={supplier} className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-foreground">{supplier}</h3>
                          <Button variant="outline" size="sm" onClick={() => generateSupplierReport(supplier)}>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Generate Report
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Total Deliveries</p>
                            <p className="text-2xl font-bold text-foreground">{supplierAnimals.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Prime Grade %</p>
                            <p className="text-2xl font-bold text-foreground">{avgQuality.toFixed(0)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Vet Pass Rate</p>
                            <p className="text-2xl font-bold text-foreground">{passRate.toFixed(0)}%</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {holdingPenAnimals.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No data available for quality reports</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Livestock Details - {selectedEntry?.animalId}</DialogTitle>
            <DialogDescription>Complete traceability and financial information</DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Traceability Code</Label>
                  <p className="font-mono text-sm font-semibold">{selectedEntry.traceabilityCode}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className="mt-1">{selectedEntry.status}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Animal ID</Label>
                  <p className="font-semibold">{selectedEntry.animalId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type & Breed</Label>
                  <p className="font-semibold capitalize">
                    {selectedEntry.type} {selectedEntry.breed && `- ${selectedEntry.breed}`}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Quantity</Label>
                  <p className="font-semibold">{selectedEntry.quantity} head</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Weight</Label>
                  <p className="font-semibold">{selectedEntry.weight} kg avg</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Quality Grade</Label>
                  <p className="font-semibold">{selectedEntry.qualityGrade}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Holding Duration</Label>
                  <p className="font-semibold">{selectedEntry.holdingDuration} hours</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Source & Transport
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Supplier</Label>
                    <p className="font-semibold">{selectedEntry.supplier}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Origin</Label>
                    <p className="font-semibold">{selectedEntry.origin}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Transport ID</Label>
                    <p className="font-semibold">{selectedEntry.transportId || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Health Certificate</Label>
                    <p className="font-semibold">{selectedEntry.healthCert || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Purchase Price</Label>
                    <p className="font-semibold">KES {selectedEntry.purchasePrice}/animal</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Cost</Label>
                    <p className="font-semibold">
                      KES {(selectedEntry.purchasePrice * selectedEntry.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Invoice Number</Label>
                    <p className="font-semibold">{selectedEntry.invoiceNumber || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Veterinary Inspection
                </h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge className="mt-1">{selectedEntry.vetInspectionStatus}</Badge>
                  </div>
                  {selectedEntry.vetInspectionNotes && (
                    <div>
                      <Label className="text-muted-foreground">Notes</Label>
                      <p className="text-sm">{selectedEntry.vetInspectionNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedEntry.processingBatchId && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Processing Assignment</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Batch ID</Label>
                      <p className="font-semibold font-mono text-sm">{selectedEntry.processingBatchId}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Processing Line</Label>
                      <p className="font-semibold">{selectedEntry.processingLineAssigned}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedEntry.notes && (
                <div className="border-t pt-4">
                  <Label className="text-muted-foreground">Additional Notes</Label>
                  <p className="text-sm mt-1">{selectedEntry.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
