"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Package,
  ArrowLeft,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  User,
  AlertTriangle,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface IndividualAnimal {
  id: string
  animalId: string // Sub-ID like #2847-001
  batchId: string
  type: string
  currentStage: number
  status: "in-progress" | "complete" | "hold" | "quarantine" | "rework"
  operator: string
  timeInStage: number // minutes
  startTime: string
  // Stage-specific data
  liveWeight?: number
  carcassWeight?: number
  dressingPercentage?: number
  qualityGrade?: string
  defects?: string[]
  packagedProducts?: string[]
  lotNumber?: string
  expiryDate?: string
  storageLocation?: string
  notes?: string
}

interface ProcessingLine {
  id: string
  name: string
  status: "idle" | "active" | "paused" | "completed"
  batchId: string
  type: string
  quantity: number
  processed: number
  startTime: string
  estimatedCompletion: string
  animals: IndividualAnimal[] // Individual animals in this line
}

interface Operator {
  id: string
  name: string
  role: string
  loggedIn: boolean
  currentLine?: string
}

const workflowStages = [
  { id: 1, name: "Receiving", icon: Package },
  { id: 2, name: "Inspection", icon: AlertCircle },
  { id: 3, name: "Processing", icon: Clock },
  { id: 4, name: "Quality Check", icon: CheckCircle },
  { id: 5, name: "Packaging", icon: Package },
]

export function ProcessingWorkflow() {
  const [operators, setOperators] = useState<Operator[]>([
    { id: "op1", name: "John Smith", role: "Processor", loggedIn: true, currentLine: "line-1" },
    { id: "op2", name: "Maria Garcia", role: "Inspector", loggedIn: true, currentLine: "line-1" },
    { id: "op3", name: "David Chen", role: "Packager", loggedIn: false },
  ])

  const [lines, setLines] = useState<ProcessingLine[]>([
    {
      id: "line-1",
      name: "Processing Line 1",
      status: "active",
      batchId: "2847",
      type: "Cattle",
      quantity: 24,
      processed: 16,
      startTime: "08:30 AM",
      estimatedCompletion: "02:15 PM",
      animals: [], // Will be populated
    },
    {
      id: "line-2",
      name: "Processing Line 2",
      status: "active",
      batchId: "2846",
      type: "Pigs",
      quantity: 18,
      processed: 12,
      startTime: "09:00 AM",
      estimatedCompletion: "01:45 PM",
      animals: [],
    },
    {
      id: "line-3",
      name: "Processing Line 3",
      status: "idle",
      batchId: "",
      type: "",
      quantity: 0,
      processed: 0,
      startTime: "",
      estimatedCompletion: "",
      animals: [],
    },
    {
      id: "line-4",
      name: "Processing Line 4",
      status: "paused",
      batchId: "2845",
      type: "Cattle",
      quantity: 32,
      processed: 8,
      startTime: "07:45 AM",
      estimatedCompletion: "03:30 PM",
      animals: [],
    },
  ])

  const [currentStage, setCurrentStage] = useState(3)
  const [activeTab, setActiveTab] = useState("line-1")
  const [selectedAnimal, setSelectedAnimal] = useState<IndividualAnimal | null>(null)
  const [isAnimalDialogOpen, setIsAnimalDialogOpen] = useState(false)
  const [holdingPenAnimals, setHoldingPenAnimals] = useState<any[]>([])

  useEffect(() => {
    const initializeAnimals = () => {
      setLines((prevLines) =>
        prevLines.map((line) => {
          if (line.animals.length === 0 && line.quantity > 0 && line.batchId) {
            // Create individual animal records
            const animals: IndividualAnimal[] = []
            for (let i = 0; i < line.quantity; i++) {
              const animalNumber = String(i + 1).padStart(3, "0")
              animals.push({
                id: `${line.batchId}-${animalNumber}`,
                animalId: `#${line.batchId}-${animalNumber}`,
                batchId: line.batchId,
                type: line.type,
                currentStage: Math.min(currentStage, Math.floor((i / line.quantity) * 5) + 1),
                status: i < line.processed ? "complete" : "in-progress",
                operator: i < line.processed ? "John Smith" : "",
                timeInStage: Math.floor(Math.random() * 45) + 5,
                startTime: line.startTime,
              })
            }
            return { ...line, animals }
          }
          return line
        }),
      )
    }

    initializeAnimals()
  }, [])

  useEffect(() => {
    const loadHoldingPenAnimals = () => {
      const stored = localStorage.getItem("holdingPenAnimals")
      if (stored) {
        setHoldingPenAnimals(JSON.parse(stored))
      }
    }

    loadHoldingPenAnimals()
    const interval = setInterval(loadHoldingPenAnimals, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prevLines) =>
        prevLines.map((line) => ({
          ...line,
          animals: line.animals.map((animal) =>
            animal.status === "in-progress" ? { ...animal, timeInStage: animal.timeInStage + 1 } : animal,
          ),
        })),
      )
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [])

  const handleToggleStatus = (lineId: string) => {
    setLines(
      lines.map((line) => {
        if (line.id === lineId) {
          if (line.status === "active") {
            return { ...line, status: "paused" as const }
          } else if (line.status === "paused") {
            return { ...line, status: "active" as const }
          }
        }
        return line
      }),
    )
  }

  const handleStageClick = (stageId: number) => {
    setCurrentStage(stageId)
  }

  const handleCompleteStage = () => {
    if (currentStage < workflowStages.length) {
      setCurrentStage(currentStage + 1)
    }
  }

  const handleCompleteAnimalStage = (lineId: string, animalId: string) => {
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id === lineId) {
          return {
            ...line,
            animals: line.animals.map((animal) => {
              if (animal.id === animalId && animal.currentStage < workflowStages.length) {
                const newStage = animal.currentStage + 1
                const isComplete = newStage > workflowStages.length

                if (newStage === 6) {
                  // Stage 6 means packaging is complete
                  createInventoryFromAnimal(animal)
                }

                return {
                  ...animal,
                  currentStage: newStage,
                  status: isComplete ? ("complete" as const) : ("in-progress" as const),
                  timeInStage: 0,
                }
              }
              return animal
            }),
            processed: line.animals.filter((a) =>
              a.id === animalId ? a.currentStage >= workflowStages.length : a.status === "complete",
            ).length,
          }
        }
        return line
      }),
    )
  }

  const createInventoryFromAnimal = (animal: IndividualAnimal) => {
    console.log("[v0] Creating inventory for animal:", animal.animalId)

    // Get existing inventory from localStorage
    const existingInventory = JSON.parse(localStorage.getItem("inventory") || "[]")

    // Create inventory items based on animal data
    const newItems = [
      {
        id: `inv-${animal.id}-cuts`,
        name: `${animal.type} Cuts - ${animal.qualityGrade || "Standard"}`,
        category: animal.type.toLowerCase(),
        quantity: animal.carcassWeight ? Math.floor(animal.carcassWeight * 0.7) : 100,
        unit: "kg",
        location: animal.storageLocation || "Cold Storage A1",
        temperature: "2°C",
        status: "optimal",
        lastUpdated: "Just now",
        animalId: animal.animalId,
        farmOrigin: "Traced from intake",
        batchNumber: animal.batchId,
        dateReceived: new Date().toISOString().split("T")[0],
        dateProcessed: new Date().toISOString().split("T")[0],
        costPerUnit: 8.5,
        sellingPrice: 15.0,
        purchaseOrderId: `PO-${animal.batchId}`,
        totalValue: (animal.carcassWeight ? Math.floor(animal.carcassWeight * 0.7) : 100) * 8.5,
        profitMargin: 76.47,
        daysInStock: 0,
      },
    ]

    // Save to localStorage
    localStorage.setItem("inventory", JSON.stringify([...existingInventory, ...newItems]))

    alert(`✓ Inventory created for ${animal.animalId}\n${newItems.length} items added to inventory`)
  }

  const handleUpdateAnimalStatus = (
    lineId: string,
    animalId: string,
    status: "in-progress" | "complete" | "hold" | "quarantine" | "rework",
    defect?: string,
  ) => {
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id === lineId) {
          return {
            ...line,
            animals: line.animals.map((animal) => {
              if (animal.id === animalId) {
                const updatedAnimal = { ...animal, status }
                if (defect && !updatedAnimal.defects) {
                  updatedAnimal.defects = []
                }
                if (defect) {
                  updatedAnimal.defects?.push(defect)
                }
                return updatedAnimal
              }
              return animal
            }),
          }
        }
        return line
      }),
    )
  }

  const handleAssignOperator = (lineId: string, animalId: string, operatorName: string) => {
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id === lineId) {
          return {
            ...line,
            animals: line.animals.map((animal) =>
              animal.id === animalId ? { ...animal, operator: operatorName } : animal,
            ),
          }
        }
        return line
      }),
    )
  }

  const handleUpdateAnimalData = (lineId: string, animalId: string, data: Partial<IndividualAnimal>) => {
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id === lineId) {
          return {
            ...line,
            animals: line.animals.map((animal) => {
              if (animal.id === animalId) {
                const updatedAnimal = { ...animal, ...data }
                // Calculate dressing percentage if both weights are available
                if (updatedAnimal.liveWeight && updatedAnimal.carcassWeight) {
                  updatedAnimal.dressingPercentage = (updatedAnimal.carcassWeight / updatedAnimal.liveWeight) * 100
                }
                return updatedAnimal
              }
              return animal
            }),
          }
        }
        return line
      }),
    )
  }

  const handleCompleteBatch = (lineId: string) => {
    const line = lines.find((l) => l.id === lineId)
    if (!line || !line.batchId) return

    // Check if all animals are complete
    const allComplete = line.animals.every((animal) => animal.status === "complete")
    if (!allComplete) {
      alert("Please complete all animals in the batch before finishing.")
      return
    }

    console.log("[v0] Batch completed:", {
      batchId: line.batchId,
      lineId: line.id,
      processed: line.processed,
      quantity: line.quantity,
    })

    alert(
      `✓ Batch #${line.batchId} completed successfully!\n\n` +
        `${line.quantity} ${line.type} processed and ready for inventory.\n\n` +
        `Loading next batch...`,
    )

    // Find next batch
    const nextBatch = holdingPenAnimals.find(
      (animal) =>
        animal.processingLineAssigned === line.name &&
        animal.status === "cleared" &&
        !lines.some((l) => l.batchId === animal.processingBatchId),
    )

    if (nextBatch) {
      // Load next batch and create individual animals
      const newAnimals: IndividualAnimal[] = []
      for (let i = 0; i < nextBatch.quantity; i++) {
        const animalNumber = String(i + 1).padStart(3, "0")
        newAnimals.push({
          id: `${nextBatch.processingBatchId}-${animalNumber}`,
          animalId: `#${nextBatch.processingBatchId}-${animalNumber}`,
          batchId: nextBatch.processingBatchId,
          type: nextBatch.type,
          currentStage: 1,
          status: "in-progress",
          operator: "",
          timeInStage: 0,
          startTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        })
      }

      setLines(
        lines.map((l) => {
          if (l.id === lineId) {
            return {
              ...l,
              batchId: nextBatch.processingBatchId,
              type: nextBatch.type,
              quantity: nextBatch.quantity,
              processed: 0,
              startTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
              estimatedCompletion: "TBD",
              status: "active" as const,
              animals: newAnimals,
            }
          }
          return l
        }),
      )

      const updatedAnimals = holdingPenAnimals.map((animal) =>
        animal.id === nextBatch.id ? { ...animal, status: "processing" } : animal,
      )
      localStorage.setItem("holdingPenAnimals", JSON.stringify(updatedAnimals))
      setHoldingPenAnimals(updatedAnimals)

      setCurrentStage(1)
      alert(`Next batch loaded: ${nextBatch.processingBatchId}\n${nextBatch.type} - ${nextBatch.quantity} head`)
    } else {
      setLines(
        lines.map((l) => {
          if (l.id === lineId) {
            return {
              ...l,
              status: "idle" as const,
              batchId: "",
              type: "",
              quantity: 0,
              processed: 0,
              startTime: "",
              estimatedCompletion: "",
              animals: [],
            }
          }
          return l
        }),
      )

      alert("No more batches in queue for this line. Line set to idle.")
    }
  }

  const handleAssignBatch = (batchId: string, lineId: string) => {
    const quantity = batchId === "2848" ? 16 : batchId === "2849" ? 28 : 20
    const type = batchId === "2848" ? "Sheep" : batchId === "2849" ? "Cattle" : "Pigs"

    // Create individual animals for the batch
    const newAnimals: IndividualAnimal[] = []
    for (let i = 0; i < quantity; i++) {
      const animalNumber = String(i + 1).padStart(3, "0")
      newAnimals.push({
        id: `${batchId}-${animalNumber}`,
        animalId: `#${batchId}-${animalNumber}`,
        batchId: batchId,
        type: type,
        currentStage: 1,
        status: "in-progress",
        operator: "",
        timeInStage: 0,
        startTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      })
    }

    setLines(
      lines.map((line) => {
        if (line.id === lineId && line.status === "idle") {
          return {
            ...line,
            status: "active" as const,
            batchId: batchId,
            type: type,
            quantity: quantity,
            processed: 0,
            startTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            estimatedCompletion: "TBD",
            animals: newAnimals,
          }
        }
        return line
      }),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "complete":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "paused":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "hold":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "quarantine":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "rework":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "idle":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const handleViewAnimalDetails = (animal: IndividualAnimal) => {
    setSelectedAnimal(animal)
    setIsAnimalDialogOpen(true)
  }

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
                  <h1 className="font-sans text-xl font-bold text-foreground">Processing Workflow</h1>
                  <p className="text-sm text-muted-foreground">Individual animal tracking and management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {operators.filter((op) => op.loggedIn).length} operators active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Workflow Stages */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Current Workflow Stage</CardTitle>
            <CardDescription>Click on any stage to jump to it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              {workflowStages.map((stage, index) => {
                const Icon = stage.icon
                const isActive = index + 1 === currentStage
                const isCompleted = index + 1 < currentStage
                return (
                  <div key={stage.id} className="flex items-center flex-1">
                    <button
                      onClick={() => handleStageClick(index + 1)}
                      className="flex flex-col items-center flex-1 group cursor-pointer"
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                          isCompleted && "bg-primary border-primary",
                          isActive && "bg-primary/10 border-primary",
                          !isActive && !isCompleted && "bg-muted border-border",
                          "group-hover:scale-110 group-hover:shadow-lg",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isCompleted && "text-primary-foreground",
                            isActive && "text-primary",
                            !isActive && !isCompleted && "text-muted-foreground",
                          )}
                        />
                      </div>
                      <p
                        className={cn(
                          "text-xs mt-2 text-center font-medium transition-colors",
                          (isActive || isCompleted) && "text-foreground",
                          !isActive && !isCompleted && "text-muted-foreground",
                          "group-hover:text-primary",
                        )}
                      >
                        {stage.name}
                      </p>
                    </button>
                    {index < workflowStages.length - 1 && (
                      <ChevronRight
                        className={cn(
                          "h-5 w-5 -mx-2",
                          isCompleted && "text-primary",
                          !isCompleted && "text-muted-foreground",
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCompleteStage} disabled={currentStage >= workflowStages.length}>
                Complete Current Stage
              </Button>
              <Button variant="outline" onClick={() => setCurrentStage(1)}>
                Reset Workflow
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Processing Lines */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            {lines.map((line) => (
              <TabsTrigger key={line.id} value={line.id} className="relative">
                {line.name.replace("Processing ", "")}
                <span
                  className={cn(
                    "absolute top-2 right-2 h-2 w-2 rounded-full",
                    line.status === "active" && "bg-green-500",
                    line.status === "paused" && "bg-yellow-500",
                    line.status === "idle" && "bg-muted-foreground",
                  )}
                />
              </TabsTrigger>
            ))}
          </TabsList>

          {lines.map((line) => {
            const progress = line.quantity > 0 ? (line.processed / line.quantity) * 100 : 0
            const completedCount = line.animals.filter((a) => a.status === "complete").length
            const inProgressCount = line.animals.filter((a) => a.status === "in-progress").length
            const holdCount = line.animals.filter((a) => a.status === "hold" || a.status === "quarantine").length

            return (
              <TabsContent key={line.id} value={line.id}>
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-foreground">{line.name}</CardTitle>
                        {line.batchId && <CardDescription className="mt-1">Batch #{line.batchId}</CardDescription>}
                      </div>
                      <Badge variant="outline" className={cn("capitalize", getStatusColor(line.status))}>
                        {line.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {line.status !== "idle" ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Batch Progress</span>
                            <span className="font-medium text-foreground">
                              {completedCount} / {line.quantity} ({progress.toFixed(0)}%)
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <p className="text-2xl font-bold text-green-500">{completedCount}</p>
                            <p className="text-xs text-muted-foreground">Complete</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-2xl font-bold text-blue-500">{inProgressCount}</p>
                            <p className="text-xs text-muted-foreground">In Progress</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <p className="text-2xl font-bold text-orange-500">{holdCount}</p>
                            <p className="text-xs text-muted-foreground">Hold/Issue</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => handleToggleStatus(line.id)}
                          >
                            {line.status === "active" ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Resume
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => handleCompleteBatch(line.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Complete Batch
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground mb-4">Line is idle</p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Assign a batch from the queue below to start processing
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {line.animals.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Individual Animal Tracking</CardTitle>
                      <CardDescription>
                        Monitor each animal through the processing workflow - Click to view details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border border-border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Animal ID</TableHead>
                              <TableHead>Current Stage</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Operator</TableHead>
                              <TableHead>Time in Stage</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {line.animals.slice(0, 10).map((animal) => (
                              <TableRow
                                key={animal.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleViewAnimalDetails(animal)}
                              >
                                <TableCell className="font-medium text-foreground">{animal.animalId}</TableCell>
                                <TableCell className="text-muted-foreground">
                                  {animal.currentStage <= workflowStages.length
                                    ? workflowStages[animal.currentStage - 1].name
                                    : "Complete"}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={cn("capitalize", getStatusColor(animal.status))}>
                                    {animal.status === "hold" && <AlertTriangle className="mr-1 h-3 w-3" />}
                                    {animal.status === "quarantine" && <AlertCircle className="mr-1 h-3 w-3" />}
                                    {animal.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {animal.operator || <span className="text-xs italic">Unassigned</span>}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{animal.timeInStage} min</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCompleteAnimalStage(line.id, animal.id)
                                      }}
                                      disabled={animal.status !== "in-progress"}
                                    >
                                      Complete Stage
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 bg-transparent"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleViewAnimalDetails(animal)
                                      }}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      {line.animals.length > 10 && (
                        <p className="text-xs text-muted-foreground text-center mt-4">
                          Showing 10 of {line.animals.length} animals
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )
          })}
        </Tabs>

        {/* Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Processing Queue</CardTitle>
            <CardDescription>Batches waiting for processing - Click assign to add to a line</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { batchId: "2848", type: "Sheep", quantity: 16, priority: "Normal" },
                { batchId: "2849", type: "Cattle", quantity: 28, priority: "High" },
                { batchId: "2850", type: "Pigs", quantity: 20, priority: "Normal" },
              ].map((batch) => (
                <div
                  key={batch.batchId}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                >
                  <div>
                    <p className="font-medium text-foreground">Batch #{batch.batchId}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {batch.type} • {batch.quantity} head
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        batch.priority === "High"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      {batch.priority}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAssignBatch(batch.batchId, activeTab)}
                      disabled={lines.find((l) => l.id === activeTab)?.status !== "idle"}
                    >
                      Assign to {lines.find((l) => l.id === activeTab)?.name.replace("Processing ", "")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isAnimalDialogOpen} onOpenChange={setIsAnimalDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Animal Details - {selectedAnimal?.animalId}</DialogTitle>
            <DialogDescription>Complete processing information and data entry</DialogDescription>
          </DialogHeader>
          {selectedAnimal && (
            <div className="space-y-6 py-4">
              {/* Status and Stage */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Current Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Stage</Label>
                    <p className="text-sm font-medium text-foreground">
                      {selectedAnimal.currentStage <= workflowStages.length
                        ? workflowStages[selectedAnimal.currentStage - 1].name
                        : "Complete"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge variant="outline" className={cn("capitalize mt-1", getStatusColor(selectedAnimal.status))}>
                      {selectedAnimal.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Time in Stage</Label>
                    <p className="text-sm font-medium text-foreground">{selectedAnimal.timeInStage} minutes</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Operator</Label>
                    <p className="text-sm font-medium text-foreground">{selectedAnimal.operator || "Unassigned"}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal.id))?.id
                      if (lineId) {
                        handleUpdateAnimalStatus(lineId, selectedAnimal.id, "hold", "Quality issue")
                        setIsAnimalDialogOpen(false)
                      }
                    }}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Hold
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal.id))?.id
                      if (lineId) {
                        handleUpdateAnimalStatus(lineId, selectedAnimal.id, "quarantine", "Health concern")
                        setIsAnimalDialogOpen(false)
                      }
                    }}
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Quarantine
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal.id))?.id
                      if (lineId) {
                        handleUpdateAnimalStatus(lineId, selectedAnimal.id, "rework", "Requires reprocessing")
                        setIsAnimalDialogOpen(false)
                      }
                    }}
                  >
                    Rework
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal.id))?.id
                      if (lineId) {
                        handleUpdateAnimalStatus(lineId, selectedAnimal.id, "in-progress")
                        setIsAnimalDialogOpen(false)
                      }
                    }}
                  >
                    Resume
                  </Button>
                </div>
              </div>

              {/* Data Entry Forms */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-foreground mb-3">Processing Data</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="liveWeight">Live Weight (kg)</Label>
                      <Input
                        id="liveWeight"
                        type="number"
                        placeholder="e.g., 450"
                        defaultValue={selectedAnimal.liveWeight ?? ""}
                        onBlur={(e) => {
                          const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal.id))?.id
                          if (lineId) {
                            handleUpdateAnimalData(lineId, selectedAnimal.id, {
                              liveWeight: Number.parseFloat(e.target.value),
                            })
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="carcassWeight">Carcass Weight (kg)</Label>
                      <Input
                        id="carcassWeight"
                        type="number"
                        placeholder="e.g., 280"
                        defaultValue={selectedAnimal.carcassWeight ?? ""}
                        onBlur={(e) => {
                          const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal.id))?.id
                          if (lineId) {
                            handleUpdateAnimalData(lineId, selectedAnimal.id, {
                              carcassWeight: Number.parseFloat(e.target.value),
                            })
                          }
                        }}
                      />
                    </div>
                  </div>

                  {selectedAnimal.dressingPercentage && (
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground">Dressing Percentage</p>
                      <p className="text-lg font-bold text-foreground">
                        {selectedAnimal.dressingPercentage.toFixed(1)}%
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="qualityGrade">Quality Grade</Label>
                    <Select
                      defaultValue={selectedAnimal.qualityGrade}
                      onValueChange={(value) => {
                        const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal.id))?.id
                        if (lineId) {
                          handleUpdateAnimalData(lineId, selectedAnimal.id, { qualityGrade: value })
                        }
                      }}
                    >
                      <SelectTrigger id="qualityGrade">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border shadow-lg" position="popper">
                        <SelectItem value="Prime">Prime</SelectItem>
                        <SelectItem value="Choice">Choice</SelectItem>
                        <SelectItem value="Select">Select</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="operator">Assign Operator</Label>
                    <Select
                      defaultValue={selectedAnimal.operator}
                      onValueChange={(value) => {
                        const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal.id))?.id
                        if (lineId) {
                          handleAssignOperator(lineId, selectedAnimal.id, value)
                        }
                      }}
                    >
                      <SelectTrigger id="operator">
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border shadow-lg" position="popper">
                        {operators
                          .filter((op) => op.loggedIn)
                          .map((op) => (
                            <SelectItem key={op.id} value={op.name}>
                              {op.name} - {op.role}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="storageLocation">Storage Location</Label>
                    <Input
                      id="storageLocation"
                      placeholder="e.g., Cold Storage A1"
                      defaultValue={selectedAnimal.storageLocation}
                      onBlur={(e) => {
                        const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal.id))?.id
                        if (lineId) {
                          handleUpdateAnimalData(lineId, selectedAnimal.id, { storageLocation: e.target.value })
                        }
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes / Observations</Label>
                    <Input
                      id="notes"
                      placeholder="Add any observations or notes"
                      defaultValue={selectedAnimal.notes}
                      onBlur={(e) => {
                        const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal.id))?.id
                        if (lineId) {
                          handleUpdateAnimalData(lineId, selectedAnimal.id, { notes: e.target.value })
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Defects */}
              {selectedAnimal.defects && selectedAnimal.defects.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Recorded Defects</h4>
                  <div className="space-y-2">
                    {selectedAnimal.defects.map((defect, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-foreground">{defect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAnimalDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                const lineId = lines.find((l) => l.animals.some((a) => a.id === selectedAnimal?.id))?.id
                if (lineId && selectedAnimal) {
                  handleCompleteAnimalStage(lineId, selectedAnimal.id)
                  setIsAnimalDialogOpen(false)
                }
              }}
            >
              Complete Stage & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
