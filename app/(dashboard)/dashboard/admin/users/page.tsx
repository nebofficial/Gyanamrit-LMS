"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Users, Plus, Pencil, Trash2, Eye, Save } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { DASHBOARD_ROUTES } from "@/lib/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as userService from "@/lib/user-service"
import type { UserProfile, AddUserPayload, UpdateUserStatusPayload } from "@/lib/user-service"

const addUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  contactNumber: z.string().optional(),
  role: z.enum(["student", "instructor", "admin"]),
})

const updateUserSchema = z.object({
  status: z.enum(["pending", "active", "suspended"]).optional(),
  role: z.enum(["student", "instructor", "admin"]).optional(),
})

type AddUserValues = z.infer<typeof addUserSchema>
type UpdateUserValues = z.infer<typeof updateUserSchema>

export default function UserManagementPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [usersData, setUsersData] = useState<UserProfile[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [userError, setUserError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const addForm = useForm<AddUserValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      role: "student",
    },
  })

  const updateForm = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      status: undefined,
      role: undefined,
    },
  })

  useEffect(() => {
    if (user?.role !== "admin") {
      router.replace(DASHBOARD_ROUTES[user?.role ?? "student"])
    }
  }, [router, user?.role])

  useEffect(() => {
    if (!token) return
    fetchUsers()
  }, [token])

  const fetchUsers = async () => {
    if (!token) return
    setLoadingUsers(true)
    try {
      const response = await userService.listUsers(token)
      setUsersData(response.data ?? [])
      setUserError(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load users."
      setUserError(message)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleAddUser = async (values: AddUserValues) => {
    if (!token) return
    try {
      await userService.addUser(token, values)
      toast.success("User added successfully. Welcome email sent with password.")
      setIsAddDialogOpen(false)
      addForm.reset()
      fetchUsers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to add user."
      toast.error(message)
    }
  }

  const handleUpdateUser = async (values: UpdateUserValues) => {
    if (!token || !selectedUser) return
    try {
      await userService.updateUserStatus(token, selectedUser.id, values)
      toast.success("User updated successfully.")
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      updateForm.reset()
      fetchUsers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update user."
      toast.error(message)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!token) return
    setDeletingUserId(userId)
    try {
      await userService.deleteUser(token, userId)
      toast.success("User deleted successfully.")
      fetchUsers()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete user."
      toast.error(message)
    } finally {
      setDeletingUserId(null)
    }
  }

  const openEditDialog = (userItem: UserProfile) => {
    setSelectedUser(userItem)
    updateForm.reset({
      status: (userItem.status as "pending" | "active" | "suspended") || undefined,
      role: userItem.role,
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = async (userItem: UserProfile) => {
    if (!token) return
    try {
      const response = await userService.getUserById(token, userItem.id)
      setSelectedUser(response.data)
      setIsViewDialogOpen(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load user details."
      toast.error(message)
    }
  }

  const stats = {
    totalUsers: usersData.length,
    instructors: usersData.filter((item) => item.role === "instructor").length,
    students: usersData.filter((item) => item.role === "student").length,
    verified: usersData.filter((item) => item.isEmailVerified).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-2">Manage all platform users and their access</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-red-800 hover:bg-red-700 text-amber-100">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account. A welcome email with password will be sent.</DialogDescription>
            </DialogHeader>
            <form onSubmit={addForm.handleSubmit(handleAddUser)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" {...addForm.register("name")} />
                {addForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{addForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" {...addForm.register("email")} />
                {addForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">{addForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
                <Input id="contactNumber" placeholder="+977 9812345678" {...addForm.register("contactNumber")} />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="w-full rounded-md border border-amber-900/40 bg-amber-50/95 px-3 py-2 text-sm text-black shadow-[0_4px_18px_rgba(120,53,15,0.25)] outline-none transition-[color,box-shadow] focus-visible:border-amber-800 focus-visible:ring-amber-800/40 focus-visible:ring-[3px]"
                  {...addForm.register("role")}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addForm.formState.isSubmitting} className="bg-red-800 hover:bg-red-700">
                  {addForm.formState.isSubmitting ? "Adding..." : "Add User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <p className="text-3xl font-semibold">{stats.totalUsers}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Instructors</CardTitle>
            <CardDescription>Teaching staff</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <p className="text-3xl font-semibold">{stats.instructors}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Active learners</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <p className="text-3xl font-semibold">{stats.students}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verified</CardTitle>
            <CardDescription>Email verified users</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <p className="text-3xl font-semibold">{stats.verified}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            <div>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>Manage access and monitor verification</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {userError && <p className="text-sm text-red-500 mb-3">{userError}</p>}
          {loadingUsers ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading users...
            </div>
          ) : usersData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.contactNumber ?? "—"}</TableCell>
                      <TableCell>{item.country ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "active"
                              ? "default"
                              : item.status === "suspended"
                                ? "destructive"
                                : "secondary"
                          }
                          className="capitalize"
                        >
                          {item.status ?? "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openViewDialog(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                disabled={deletingUserId === item.id}
                              >
                                {deletingUserId === item.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete user "{item.name}". This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(item.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View complete user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <Badge variant="outline" className="capitalize">
                    {selectedUser.role}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={
                      selectedUser.status === "active"
                        ? "default"
                        : selectedUser.status === "suspended"
                          ? "destructive"
                          : "secondary"
                    }
                    className="capitalize"
                  >
                    {selectedUser.status ?? "pending"}
                  </Badge>
                </div>
                <div>
                  <Label>Contact Number</Label>
                  <p className="font-medium">{selectedUser.contactNumber ?? "—"}</p>
                </div>
                <div>
                  <Label>Country</Label>
                  <p className="font-medium">{selectedUser.country ?? "—"}</p>
                </div>
                <div>
                  <Label>Email Verified</Label>
                  <Badge variant={selectedUser.isEmailVerified ? "default" : "secondary"}>
                    {selectedUser.isEmailVerified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div>
                  <Label>Joined</Label>
                  <p className="font-medium">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
              {selectedUser.bio && (
                <div>
                  <Label>Bio</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.bio}</p>
                </div>
              )}
              {selectedUser.role === "instructor" && (
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedUser.expertise && (
                    <div>
                      <Label>Expertise</Label>
                      <p className="font-medium">{selectedUser.expertise}</p>
                    </div>
                  )}
                  {selectedUser.experience && (
                    <div>
                      <Label>Experience</Label>
                      <p className="font-medium">{selectedUser.experience}</p>
                    </div>
                  )}
                  {selectedUser.qualification && (
                    <div className="md:col-span-2">
                      <Label>Qualification</Label>
                      <p className="font-medium">{selectedUser.qualification}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>Update user status and role</DialogDescription>
          </DialogHeader>
          <form onSubmit={updateForm.handleSubmit(handleUpdateUser)} className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full rounded-md border border-amber-900/40 bg-amber-50/95 px-3 py-2 text-sm text-black shadow-[0_4px_18px_rgba(120,53,15,0.25)] outline-none transition-[color,box-shadow] focus-visible:border-amber-800 focus-visible:ring-amber-800/40 focus-visible:ring-[3px]"
                {...updateForm.register("status")}
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="w-full rounded-md border border-amber-900/40 bg-amber-50/95 px-3 py-2 text-sm text-black shadow-[0_4px_18px_rgba(120,53,15,0.25)] outline-none transition-[color,box-shadow] focus-visible:border-amber-800 focus-visible:ring-amber-800/40 focus-visible:ring-[3px]"
                {...updateForm.register("role")}
              >
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateForm.formState.isSubmitting} className="bg-red-800 hover:bg-red-700">
                {updateForm.formState.isSubmitting ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
