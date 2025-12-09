export interface AuditLog {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: string
  resource: string
  details?: string
  timestamp: string
  ipAddress?: string
}

// Get all audit logs from localStorage
export function getAuditLogs(): AuditLog[] {
  if (typeof window === "undefined") return []

  const logsData = localStorage.getItem("audit_logs")
  if (!logsData) return []

  try {
    return JSON.parse(logsData)
  } catch {
    return []
  }
}

// Save audit logs to localStorage
function saveAuditLogs(logs: AuditLog[]): void {
  localStorage.setItem("audit_logs", JSON.stringify(logs))
}

// Add a new audit log entry
export function logAuditEvent(
  userId: string,
  userName: string,
  userEmail: string,
  action: string,
  resource: string,
  details?: string,
): void {
  const logs = getAuditLogs()

  const newLog: AuditLog = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    userEmail,
    action,
    resource,
    details,
    timestamp: new Date().toISOString(),
  }

  // Keep only the last 1000 logs to prevent localStorage from getting too large
  const updatedLogs = [newLog, ...logs].slice(0, 1000)
  saveAuditLogs(updatedLogs)
}

// Clear all audit logs (admin only)
export function clearAuditLogs(): void {
  localStorage.setItem("audit_logs", JSON.stringify([]))
}

// Filter audit logs by criteria
export function filterAuditLogs(
  logs: AuditLog[],
  filters: {
    userId?: string
    action?: string
    resource?: string
    startDate?: Date
    endDate?: Date
  },
): AuditLog[] {
  return logs.filter((log) => {
    if (filters.userId && log.userId !== filters.userId) return false
    if (filters.action && !log.action.toLowerCase().includes(filters.action.toLowerCase())) return false
    if (filters.resource && !log.resource.toLowerCase().includes(filters.resource.toLowerCase())) return false
    if (filters.startDate && new Date(log.timestamp) < filters.startDate) return false
    if (filters.endDate && new Date(log.timestamp) > filters.endDate) return false
    return true
  })
}

// Export logs as CSV
export function exportLogsAsCSV(logs: AuditLog[]): string {
  const headers = ["Timestamp", "User", "Email", "Action", "Resource", "Details"]
  const rows = logs.map((log) => [
    new Date(log.timestamp).toLocaleString(),
    log.userName,
    log.userEmail,
    log.action,
    log.resource,
    log.details || "",
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  return csvContent
}
