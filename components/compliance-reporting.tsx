"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Calendar,
  Shield,
  Thermometer,
  ClipboardCheck,
  Eye,
  Search,
  MessageSquare,
  Clock,
  Mail,
  Printer,
  LinkIcon,
  Bell,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface StatusHistory {
  status: "passed" | "failed" | "pending"
  timestamp: string
  changedBy: string
  notes?: string
}

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
}

interface ComplianceCheck {
  id: string
  name: string
  category: string
  status: "passed" | "failed" | "pending"
  lastCheck: string
  nextDue: string
  score: number
  description?: string
  inspector?: string
  notes?: string
  history: StatusHistory[]
  comments: Comment[]
  linkedBatch?: string
}

interface Report {
  id: string
  name: string
  type: string
  date: string
  status: "completed" | "pending"
  summary?: string
  findings?: string[]
  recommendations?: string[]
}

interface CalendarEvent {
  id: string
  checkId: string
  checkName: string
  dueDate: string
  dueTime: string
  reminderSent: boolean
  priority: "high" | "medium" | "low"
}

export function ComplianceReporting() {
  const [searchQuery, setSearchQuery] = useState("")

  const [checks, setChecks] = useState<ComplianceCheck[]>([
    {
      id: "1",
      name: "Temperature Control",
      category: "Safety",
      status: "passed",
      lastCheck: "2 hours ago",
      nextDue: "In 4 hours",
      score: 98,
      description: "Regular monitoring of temperature in all processing areas",
      inspector: "John Smith",
      notes: "All zones within acceptable range. Minor fluctuation in Zone C noted.",
      history: [
        { status: "passed", timestamp: "2025-03-10 14:00", changedBy: "John Smith", notes: "Initial check completed" },
        { status: "passed", timestamp: "2025-03-10 10:00", changedBy: "John Smith", notes: "Morning inspection" },
      ],
      comments: [
        {
          id: "c1",
          author: "John Smith",
          text: "Zone C temperature slightly elevated but within limits",
          timestamp: "2025-03-10 14:05",
        },
      ],
      linkedBatch: "BATCH-2025-001",
    },
    {
      id: "2",
      name: "Sanitation Standards",
      category: "Hygiene",
      status: "passed",
      lastCheck: "1 hour ago",
      nextDue: "In 5 hours",
      score: 95,
      description: "Comprehensive sanitation protocol compliance check",
      inspector: "Sarah Johnson",
      notes: "Excellent adherence to cleaning schedules. All equipment properly sanitized.",
      history: [{ status: "passed", timestamp: "2025-03-10 15:00", changedBy: "Sarah Johnson" }],
      comments: [],
      linkedBatch: "BATCH-2025-002",
    },
    {
      id: "3",
      name: "Equipment Maintenance",
      category: "Operations",
      status: "pending",
      lastCheck: "Yesterday",
      nextDue: "Today",
      score: 0,
      description: "Scheduled maintenance verification for all processing equipment",
      inspector: "Mike Davis",
      notes: "Awaiting completion of scheduled maintenance on Line 2.",
      history: [
        { status: "pending", timestamp: "2025-03-09 16:00", changedBy: "Mike Davis", notes: "Maintenance scheduled" },
      ],
      comments: [
        { id: "c2", author: "Mike Davis", text: "Line 2 maintenance in progress", timestamp: "2025-03-10 09:00" },
      ],
    },
    {
      id: "4",
      name: "Worker Safety Protocol",
      category: "Safety",
      status: "passed",
      lastCheck: "3 hours ago",
      nextDue: "Tomorrow",
      score: 100,
      description: "PPE compliance and safety procedure adherence check",
      inspector: "Lisa Chen",
      notes: "Perfect compliance. All workers following safety protocols correctly.",
      history: [{ status: "passed", timestamp: "2025-03-10 13:00", changedBy: "Lisa Chen" }],
      comments: [],
    },
    {
      id: "5",
      name: "Waste Disposal",
      category: "Environmental",
      status: "passed",
      lastCheck: "30 minutes ago",
      nextDue: "In 6 hours",
      score: 92,
      description: "Waste management and disposal procedures verification",
      inspector: "Tom Wilson",
      notes: "Good practices observed. Recommend additional training for new staff.",
      history: [{ status: "passed", timestamp: "2025-03-10 15:30", changedBy: "Tom Wilson" }],
      comments: [],
    },
    {
      id: "6",
      name: "Documentation Review",
      category: "Administrative",
      status: "failed",
      lastCheck: "4 hours ago",
      nextDue: "Overdue",
      score: 65,
      description: "Review of required documentation and record-keeping",
      inspector: "Emma Brown",
      notes: "Missing several required forms. Immediate action needed to update records.",
      history: [
        { status: "failed", timestamp: "2025-03-10 12:00", changedBy: "Emma Brown", notes: "Documentation incomplete" },
        { status: "passed", timestamp: "2025-03-09 12:00", changedBy: "Emma Brown" },
      ],
      comments: [
        { id: "c3", author: "Emma Brown", text: "Forms 23A and 45B are missing", timestamp: "2025-03-10 12:05" },
        { id: "c4", author: "Admin", text: "Working on updating the forms", timestamp: "2025-03-10 13:00" },
      ],
    },
  ])

  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      name: "Daily Operations Report",
      type: "Daily",
      date: "2025-03-10",
      status: "completed",
      summary: "All operations running smoothly with no major incidents.",
      findings: ["Temperature controls optimal", "Sanitation protocols followed", "Production targets met"],
      recommendations: ["Continue current practices", "Schedule equipment maintenance"],
    },
    {
      id: "2",
      name: "Weekly Safety Audit",
      type: "Weekly",
      date: "2025-03-08",
      status: "completed",
      summary: "Comprehensive safety audit completed with positive results.",
      findings: ["PPE compliance at 100%", "No safety incidents reported", "Emergency procedures reviewed"],
      recommendations: ["Update safety training materials", "Conduct fire drill next week"],
    },
    {
      id: "3",
      name: "Monthly Compliance Summary",
      type: "Monthly",
      date: "2025-03-01",
      status: "completed",
      summary: "Overall compliance rating remains high with minor areas for improvement.",
      findings: ["95% compliance rate", "Documentation needs improvement", "All critical checks passed"],
      recommendations: ["Implement digital documentation system", "Increase audit frequency"],
    },
    {
      id: "4",
      name: "Quarterly Inspection Report",
      type: "Quarterly",
      date: "2025-01-15",
      status: "completed",
      summary: "Facility meets all regulatory requirements for the quarter.",
      findings: ["All equipment certified", "Staff training up to date", "Environmental compliance verified"],
      recommendations: ["Plan for equipment upgrades", "Review waste management procedures"],
    },
  ])

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    {
      id: "e1",
      checkId: "1",
      checkName: "Temperature Control",
      dueDate: "2025-03-10",
      dueTime: "20:00",
      reminderSent: false,
      priority: "high",
    },
    {
      id: "e2",
      checkId: "3",
      checkName: "Equipment Maintenance",
      dueDate: "2025-03-10",
      dueTime: "17:00",
      reminderSent: true,
      priority: "high",
    },
    {
      id: "e3",
      checkId: "4",
      checkName: "Worker Safety Protocol",
      dueDate: "2025-03-11",
      dueTime: "09:00",
      reminderSent: false,
      priority: "medium",
    },
    {
      id: "e4",
      checkId: "5",
      checkName: "Waste Disposal",
      dueDate: "2025-03-10",
      dueTime: "22:00",
      reminderSent: false,
      priority: "medium",
    },
  ])

  const [selectedCheck, setSelectedCheck] = useState<ComplianceCheck | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [newComment, setNewComment] = useState("")
  const [emailRecipient, setEmailRecipient] = useState("")
  const [batchToLink, setBatchToLink] = useState("")

  const updateCheckStatus = (checkId: string, newStatus: "passed" | "failed" | "pending") => {
    setChecks(
      checks.map((check) => {
        if (check.id === checkId) {
          const newHistory: StatusHistory = {
            status: newStatus,
            timestamp: new Date().toLocaleString(),
            changedBy: check.inspector || "System",
            notes: `Status changed to ${newStatus}`,
          }
          return {
            ...check,
            status: newStatus,
            lastCheck: "Just now",
            history: [newHistory, ...check.history],
          }
        }
        return check
      }),
    )
  }

  const updateReportStatus = (reportId: string, newStatus: "completed" | "pending") => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report)))
  }

  const addComment = (checkId: string) => {
    if (!newComment.trim()) return

    setChecks(
      checks.map((check) => {
        if (check.id === checkId) {
          const comment: Comment = {
            id: `c${Date.now()}`,
            author: check.inspector || "User",
            text: newComment,
            timestamp: new Date().toLocaleString(),
          }
          return {
            ...check,
            comments: [...check.comments, comment],
          }
        }
        return check
      }),
    )
    setNewComment("")
  }

  const linkBatch = (checkId: string) => {
    if (!batchToLink.trim()) return

    setChecks(checks.map((check) => (check.id === checkId ? { ...check, linkedBatch: batchToLink } : check)))
    setBatchToLink("")
  }

  const sendReportEmail = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId)
    if (!report || !emailRecipient) return

    // Simulate email sending
    alert(`Report "${report.name}" sent to ${emailRecipient}`)
    setEmailRecipient("")
  }

  const printChecklist = (checkId: string) => {
    const check = checks.find((c) => c.id === checkId)
    if (!check) return

    // Create printable content
    const printWindow = window.open("", "", "height=600,width=800")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Compliance Checklist - ${check.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .section { margin: 20px 0; }
            .checkbox { display: inline-block; width: 20px; height: 20px; border: 2px solid #333; margin-right: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Compliance Checklist</h1>
          <div class="section">
            <h2>${check.name}</h2>
            <p><strong>Category:</strong> ${check.category}</p>
            <p><strong>Inspector:</strong> ${check.inspector}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Description:</strong> ${check.description}</p>
          </div>
          <div class="section">
            <h3>Inspection Items</h3>
            <p><span class="checkbox"></span> All equipment functioning properly</p>
            <p><span class="checkbox"></span> Safety protocols being followed</p>
            <p><span class="checkbox"></span> Documentation up to date</p>
            <p><span class="checkbox"></span> Area clean and organized</p>
            <p><span class="checkbox"></span> Staff properly trained</p>
          </div>
          <div class="section">
            <h3>Notes</h3>
            <table>
              <tr>
                <td style="height: 100px;"></td>
              </tr>
            </table>
          </div>
          <div class="section">
            <p><strong>Inspector Signature:</strong> _______________________</p>
            <p><strong>Date:</strong> _______________________</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const filteredChecks = checks.filter(
    (check) =>
      check.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.inspector?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredReports = reports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const passedChecks = checks.filter((c) => c.status === "passed").length
  const failedChecks = checks.filter((c) => c.status === "failed").length
  const pendingChecks = checks.filter((c) => c.status === "pending").length
  const overallScore = Math.round(checks.reduce((sum, check) => sum + check.score, 0) / checks.length)

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
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-sans text-xl font-bold text-foreground">Compliance & Reporting</h1>
                  <p className="text-sm text-muted-foreground">Monitor standards and generate reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{overallScore}%</div>
              <Progress value={overallScore} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Passed Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{passedChecks}</div>
              <p className="text-xs text-muted-foreground mt-1">All requirements met</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{failedChecks}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{pendingChecks}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting inspection</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search checks, reports, categories, or inspectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="checks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="calendar">Calendar & Reminders</TabsTrigger>
          </TabsList>

          {/* Compliance Checks Tab */}
          <TabsContent value="checks" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Active Compliance Checks</CardTitle>
                    <CardDescription>Monitor and track regulatory requirements</CardDescription>
                  </div>
                  <Button>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Run All Checks
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredChecks.map((check) => (
                    <div
                      key={check.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            check.status === "passed" && "bg-green-500/10",
                            check.status === "failed" && "bg-red-500/10",
                            check.status === "pending" && "bg-yellow-500/10",
                          )}
                        >
                          {check.status === "passed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {check.status === "failed" && <AlertCircle className="h-5 w-5 text-red-500" />}
                          {check.status === "pending" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">{check.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {check.category}
                            </Badge>
                            {check.linkedBatch && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20"
                              >
                                <LinkIcon className="h-3 w-3 mr-1" />
                                {check.linkedBatch}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Last check: {check.lastCheck}</span>
                            <span>•</span>
                            <span>Next due: {check.nextDue}</span>
                            {check.comments.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {check.comments.length} comments
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {check.status !== "pending" && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-foreground">{check.score}%</div>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>
                        )}
                        <Select
                          value={check.status}
                          onValueChange={(value) =>
                            updateCheckStatus(check.id, value as "passed" | "failed" | "pending")
                          }
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passed">Passed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => printChecklist(check.id)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedCheck(check)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {check.name}
                                <Badge variant="outline" className={cn("capitalize", getStatusColor(check.status))}>
                                  {check.status}
                                </Badge>
                              </DialogTitle>
                              <DialogDescription>{check.description}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                                  <p className="text-sm text-foreground mt-1">{check.category}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Inspector</p>
                                  <p className="text-sm text-foreground mt-1">{check.inspector}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Last Check</p>
                                  <p className="text-sm text-foreground mt-1">{check.lastCheck}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Next Due</p>
                                  <p className="text-sm text-foreground mt-1">{check.nextDue}</p>
                                </div>
                                {check.status !== "pending" && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Score</p>
                                    <p className="text-2xl font-bold text-foreground mt-1">{check.score}%</p>
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Linked Batch</p>
                                {check.linkedBatch ? (
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    >
                                      <LinkIcon className="h-3 w-3 mr-1" />
                                      {check.linkedBatch}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setChecks(
                                          checks.map((c) => (c.id === check.id ? { ...c, linkedBatch: undefined } : c)),
                                        )
                                      }}
                                    >
                                      Unlink
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Enter batch ID (e.g., BATCH-2025-001)"
                                      value={batchToLink}
                                      onChange={(e) => setBatchToLink(e.target.value)}
                                    />
                                    <Button onClick={() => linkBatch(check.id)}>
                                      <LinkIcon className="mr-2 h-4 w-4" />
                                      Link
                                    </Button>
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Inspector Notes</p>
                                <div className="p-3 rounded-lg bg-muted">
                                  <p className="text-sm text-foreground">{check.notes}</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Status History
                                </p>
                                <div className="space-y-3">
                                  {check.history.map((entry, index) => (
                                    <div key={index} className="flex gap-3 relative">
                                      {index !== check.history.length - 1 && (
                                        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />
                                      )}
                                      <div
                                        className={cn(
                                          "flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 mt-0.5",
                                          entry.status === "passed" && "bg-green-500/20",
                                          entry.status === "failed" && "bg-red-500/20",
                                          entry.status === "pending" && "bg-yellow-500/20",
                                        )}
                                      >
                                        <div
                                          className={cn(
                                            "h-2 w-2 rounded-full",
                                            entry.status === "passed" && "bg-green-500",
                                            entry.status === "failed" && "bg-red-500",
                                            entry.status === "pending" && "bg-yellow-500",
                                          )}
                                        />
                                      </div>
                                      <div className="flex-1 pb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge
                                            variant="outline"
                                            className={cn("capitalize text-xs", getStatusColor(entry.status))}
                                          >
                                            {entry.status}
                                          </Badge>
                                          <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-foreground">Changed by {entry.changedBy}</p>
                                        {entry.notes && (
                                          <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4" />
                                  Comments ({check.comments.length})
                                </p>
                                <div className="space-y-3 mb-4">
                                  {check.comments.map((comment) => (
                                    <div key={comment.id} className="p-3 rounded-lg bg-muted">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-foreground">{comment.author}</span>
                                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                      </div>
                                      <p className="text-sm text-foreground">{comment.text}</p>
                                    </div>
                                  ))}
                                  {check.comments.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No comments yet</p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Textarea
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows={2}
                                  />
                                  <Button onClick={() => addComment(check.id)} className="self-end">
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Thermometer className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-foreground">Temperature Logs</CardTitle>
                  <CardDescription>View temperature monitoring records</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Logs
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <ClipboardCheck className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-foreground">Safety Audits</CardTitle>
                  <CardDescription>Access safety inspection records</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Audits
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-foreground">Documentation</CardTitle>
                  <CardDescription>Manage compliance documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Documents
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Generated Reports</CardTitle>
                    <CardDescription>Access and download compliance reports</CardDescription>
                  </div>
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate New Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{report.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>{report.date}</span>
                            <span>•</span>
                            <span>{report.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Select
                          value={report.status}
                          onValueChange={(value) => updateReportStatus(report.id, value as "completed" | "pending")}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Email Report</DialogTitle>
                              <DialogDescription>Send {report.name} to stakeholders</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <Label htmlFor="email">Recipient Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="stakeholder@example.com"
                                  value={emailRecipient}
                                  onChange={(e) => setEmailRecipient(e.target.value)}
                                />
                              </div>
                              <Button onClick={() => sendReportEmail(report.id)} className="w-full">
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{report.name}</DialogTitle>
                              <DialogDescription>
                                {report.type} report generated on {report.date}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Summary</p>
                                <p className="text-sm text-foreground">{report.summary}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Key Findings</p>
                                <ul className="space-y-2">
                                  {report.findings?.map((finding, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span>{finding}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Recommendations</p>
                                <ul className="space-y-2">
                                  {report.recommendations?.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                                      <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Report Templates</CardTitle>
                <CardDescription>Quick access to common report types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {["Daily Operations", "Weekly Safety", "Monthly Summary", "Quarterly Audit"].map((template) => (
                    <Button key={template} variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                      <FileText className="h-5 w-5" />
                      <span className="text-sm">{template}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Upcoming Inspections</CardTitle>
                    <CardDescription>Scheduled compliance checks and automated reminders</CardDescription>
                  </div>
                  <Button>
                    <Bell className="mr-2 h-4 w-4" />
                    Configure Reminders
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calendarEvents
                    .sort(
                      (a, b) =>
                        new Date(a.dueDate + " " + a.dueTime).getTime() -
                        new Date(b.dueDate + " " + b.dueTime).getTime(),
                    )
                    .map((event) => {
                      const check = checks.find((c) => c.id === event.checkId)
                      return (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg",
                                event.priority === "high" && "bg-red-500/10",
                                event.priority === "medium" && "bg-yellow-500/10",
                                event.priority === "low" && "bg-blue-500/10",
                              )}
                            >
                              <Calendar
                                className={cn(
                                  "h-5 w-5",
                                  event.priority === "high" && "text-red-500",
                                  event.priority === "medium" && "text-yellow-500",
                                  event.priority === "low" && "text-blue-500",
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-foreground">{event.checkName}</h3>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs capitalize",
                                    event.priority === "high" && "bg-red-500/10 text-red-500 border-red-500/20",
                                    event.priority === "medium" &&
                                      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                    event.priority === "low" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                  )}
                                >
                                  {event.priority} priority
                                </Badge>
                                {event.reminderSent && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-500/10 text-green-500 border-green-500/20"
                                  >
                                    <Bell className="h-3 w-3 mr-1" />
                                    Reminder sent
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {event.dueDate}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.dueTime}
                                </span>
                                {check && (
                                  <>
                                    <span>•</span>
                                    <span>Inspector: {check.inspector}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCalendarEvents(
                                  calendarEvents.map((e) => (e.id === event.id ? { ...e, reminderSent: true } : e)),
                                )
                                alert(`Reminder sent for ${event.checkName}`)
                              }}
                              disabled={event.reminderSent}
                            >
                              <Bell className="mr-2 h-4 w-4" />
                              {event.reminderSent ? "Sent" : "Send Reminder"}
                            </Button>
                            {check && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href="/processing">
                                  <LinkIcon className="mr-2 h-4 w-4" />
                                  View Check
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Calendar View */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Calendar View</CardTitle>
                <CardDescription>Visual overview of scheduled inspections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const dayNumber = i - 2
                    const hasEvent = calendarEvents.some((e) => {
                      const eventDay = new Date(e.dueDate).getDate()
                      return eventDay === dayNumber + 1
                    })
                    return (
                      <div
                        key={i}
                        className={cn(
                          "aspect-square p-2 rounded-lg border border-border flex flex-col items-center justify-center text-sm",
                          dayNumber < 1 || dayNumber > 31 ? "bg-muted/50 text-muted-foreground" : "bg-card",
                          dayNumber === 10 && "border-primary border-2",
                          hasEvent && "bg-primary/5",
                        )}
                      >
                        {dayNumber > 0 && dayNumber <= 31 && (
                          <>
                            <span className="font-medium">{dayNumber}</span>
                            {hasEvent && <div className="h-1 w-1 rounded-full bg-primary mt-1" />}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
