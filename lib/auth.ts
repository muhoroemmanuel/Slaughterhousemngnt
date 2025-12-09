export type UserRole =
  | "admin"
  | "supervisor"
  | "intake_operator"
  | "processing_operator"
  | "quality_control"
  | "inventory_manager"
  | "viewer"

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  createdAt: string
  lastLogin: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: string
}

// Role permissions mapping
export const rolePermissions: Record<UserRole, string[]> = {
  admin: ["*"], // Full access
  supervisor: ["dashboard", "intake", "processing", "inventory", "compliance", "reports"],
  intake_operator: ["dashboard", "intake"],
  processing_operator: ["dashboard", "processing"],
  quality_control: ["dashboard", "compliance", "reports"],
  inventory_manager: ["dashboard", "inventory", "reports"],
  viewer: ["dashboard", "reports:read"],
}

// Check if user has permission for a resource
export function hasPermission(role: UserRole, resource: string): boolean {
  const permissions = rolePermissions[role]
  return permissions.includes("*") || permissions.includes(resource)
}

// Get current session from localStorage
export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null

  const sessionData = localStorage.getItem("auth_session")
  if (!sessionData) return null

  try {
    const session: AuthSession = JSON.parse(sessionData)

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem("auth_session")
      return null
    }

    return session
  } catch {
    return null
  }
}

// Save session to localStorage
export function setSession(session: AuthSession): void {
  localStorage.setItem("auth_session", JSON.stringify(session))
}

// Clear session
export function clearSession(): void {
  localStorage.removeItem("auth_session")
}

// Get all users from localStorage
export function getUsers(): User[] {
  if (typeof window === "undefined") return []

  const usersData = localStorage.getItem("users")
  const passwordsData = localStorage.getItem("user_passwords")

  if (!usersData || !passwordsData) {
    // Initialize with default admin user
    const defaultAdmin: User = {
      id: "1",
      email: "admin@slaughterhouse.com",
      fullName: "System Administrator",
      role: "admin",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }
    const defaultUsers = [defaultAdmin]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
    // Store password separately (in production, this would be hashed on backend)
    const passwords: Record<string, string> = { "1": "admin123" }
    localStorage.setItem("user_passwords", JSON.stringify(passwords))
    return defaultUsers
  }

  try {
    return JSON.parse(usersData)
  } catch {
    return []
  }
}

// Save users to localStorage
export function saveUsers(users: User[]): void {
  localStorage.setItem("users", JSON.stringify(users))
}

import { logAuditEvent } from "./audit-log"

// Login function
export function login(email: string, password: string): { success: boolean; session?: AuthSession; error?: string } {
  const users = getUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    console.log("[v0] Login failed: User not found for email:", email)
    return { success: false, error: "Invalid email or password" }
  }

  // Check password (in production, this would be done on backend with hashed passwords)
  const passwordsData = localStorage.getItem("user_passwords")
  if (!passwordsData) {
    console.log("[v0] Login failed: No passwords data found")
    return { success: false, error: "Authentication error" }
  }

  const passwords: Record<string, string> = JSON.parse(passwordsData)
  const storedPassword = passwords[user.id]

  console.log("[v0] Password check - User ID:", user.id)
  console.log("[v0] Password check - Stored password exists:", !!storedPassword)
  console.log("[v0] Password check - Stored password length:", storedPassword?.length)
  console.log("[v0] Password check - Input password length:", password.length)
  console.log("[v0] Password check - Match:", storedPassword === password)

  if (storedPassword !== password) {
    logAuditEvent(user.id, user.fullName, user.email, "LOGIN_FAILED", "Authentication", "Invalid password")
    return { success: false, error: "Invalid email or password" }
  }

  // Update last login
  user.lastLogin = new Date().toISOString()
  saveUsers(users)

  // Create session (expires in 8 hours)
  const session: AuthSession = {
    user,
    token: `token_${user.id}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  }

  setSession(session)

  logAuditEvent(user.id, user.fullName, user.email, "LOGIN_SUCCESS", "Authentication", "User logged in")

  return { success: true, session }
}

// Logout function
export function logout(): void {
  const session = getSession()
  if (session) {
    logAuditEvent(
      session.user.id,
      session.user.fullName,
      session.user.email,
      "LOGOUT",
      "Authentication",
      "User logged out",
    )
  }
  clearSession()
}

// Signup function - allows users to create an account with a specific role
export function signup(
  email: string,
  fullName: string,
  password: string,
  role: UserRole = "viewer",
): { success: boolean; user?: User; session?: AuthSession; error?: string } {
  const users = getUsers()

  // Check if email already exists
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "Email already registered" }
  }

  // Validate password strength
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email,
    fullName,
    role,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  // Save password
  const passwordsData = localStorage.getItem("user_passwords") || "{}"
  const passwords: Record<string, string> = JSON.parse(passwordsData)
  passwords[newUser.id] = password
  localStorage.setItem("user_passwords", JSON.stringify(passwords))

  // Log signup event
  logAuditEvent(
    newUser.id,
    newUser.fullName,
    newUser.email,
    "USER_SIGNUP",
    "Authentication",
    `New user signed up with role ${role}`,
  )

  const session: AuthSession = {
    user: newUser,
    token: `token_${newUser.id}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  }

  setSession(session)

  logAuditEvent(
    newUser.id,
    newUser.fullName,
    newUser.email,
    "LOGIN_SUCCESS",
    "Authentication",
    "User logged in after signup",
  )

  return { success: true, user: newUser, session }
}

// Create new user (admin only)
export function createUser(
  userData: Omit<User, "id" | "createdAt" | "lastLogin">,
  password: string,
): { success: boolean; user?: User; error?: string } {
  const users = getUsers()

  // Check if email already exists
  if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
    return { success: false, error: "Email already exists" }
  }

  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  // Save password
  const passwordsData = localStorage.getItem("user_passwords") || "{}"
  const passwords: Record<string, string> = JSON.parse(passwordsData)
  passwords[newUser.id] = password
  localStorage.setItem("user_passwords", JSON.stringify(passwords))

  const session = getSession()
  if (session) {
    logAuditEvent(
      session.user.id,
      session.user.fullName,
      session.user.email,
      "USER_CREATED",
      "User Management",
      `Created user: ${newUser.fullName} (${newUser.email}) with role ${newUser.role}`,
    )
  }

  return { success: true, user: newUser }
}

// Update user
export function updateUser(userId: string, updates: Partial<User>): { success: boolean; user?: User; error?: string } {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    return { success: false, error: "User not found" }
  }

  const oldUser = { ...users[userIndex] }
  users[userIndex] = { ...users[userIndex], ...updates }
  saveUsers(users)

  // Update session if current user
  const session = getSession()
  if (session && session.user.id === userId) {
    session.user = users[userIndex]
    setSession(session)
  }

  if (session) {
    const changes = Object.keys(updates)
      .map((key) => `${key}: ${oldUser[key as keyof User]} → ${updates[key as keyof User]}`)
      .join(", ")
    logAuditEvent(
      session.user.id,
      session.user.fullName,
      session.user.email,
      "USER_UPDATED",
      "User Management",
      `Updated user: ${users[userIndex].fullName} - Changes: ${changes}`,
    )
  }

  return { success: true, user: users[userIndex] }
}

// Delete user
export function deleteUser(userId: string): { success: boolean; error?: string } {
  const users = getUsers()
  const userToDelete = users.find((u) => u.id === userId)
  const filteredUsers = users.filter((u) => u.id !== userId)

  if (filteredUsers.length === users.length) {
    return { success: false, error: "User not found" }
  }

  saveUsers(filteredUsers)

  // Remove password
  const passwordsData = localStorage.getItem("user_passwords") || "{}"
  const passwords: Record<string, string> = JSON.parse(passwordsData)
  delete passwords[userId]
  localStorage.setItem("user_passwords", JSON.stringify(passwords))

  const session = getSession()
  if (session && userToDelete) {
    logAuditEvent(
      session.user.id,
      session.user.fullName,
      session.user.email,
      "USER_DELETED",
      "User Management",
      `Deleted user: ${userToDelete.fullName} (${userToDelete.email})`,
    )
  }

  return { success: true }
}

// Update password
export function updatePassword(userId: string, newPassword: string): { success: boolean; error?: string } {
  const users = getUsers()
  const user = users.find((u) => u.id === userId)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  const passwordsData = localStorage.getItem("user_passwords") || "{}"
  const passwords: Record<string, string> = JSON.parse(passwordsData)
  passwords[userId] = newPassword
  localStorage.setItem("user_passwords", JSON.stringify(passwords))

  const session = getSession()
  if (session) {
    logAuditEvent(
      session.user.id,
      session.user.fullName,
      session.user.email,
      "PASSWORD_CHANGED",
      "User Management",
      `Changed password for user: ${user.fullName}`,
    )
  }

  return { success: true }
}
