"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import type { TeamMember, RepType } from "@/lib/types"
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react"

interface TeamTableProps {
  teamMembers: TeamMember[]
  onAddMember: (member: Omit<TeamMember, "id" | "assignedLeads">) => Promise<void>
  onUpdateMember: (member: TeamMember) => Promise<void>
  onDeleteMember: (memberId: string) => Promise<void>
}

const roleColors: Record<string, string> = {
  "Enterprise Sales":
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  "Senior Sales Rep":
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  "Mid-level Rep":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "Junior Rep / SDR":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  "Marketing Automation":
    "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800",
}

const ROLE_OPTIONS: RepType[] = [
  "Enterprise Sales",
  "Senior Sales Rep",
  "Mid-level Rep",
  "Junior Rep / SDR",
  "Marketing Automation",
]

export function TeamTable({ teamMembers, onAddMember, onUpdateMember, onDeleteMember }: TeamTableProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [newMember, setNewMember] = useState({
    name: "",
    role: "Mid-level Rep" as RepType,
    capacity: 15,
    weeklyLimit: 50,
  })

  const handleAddMember = async () => {
    await onAddMember(newMember)
    setNewMember({ name: "", role: "Mid-level Rep", capacity: 15, weeklyLimit: 50 })
    setAddDialogOpen(false)
  }

  const handleUpdateMember = async () => {
    if (editingMember) {
      await onUpdateMember(editingMember)
      setEditingMember(null)
      setEditDialogOpen(false)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    await onDeleteMember(memberId)
  }

  const openEditDialog = (member: TeamMember) => {
    setEditingMember({ ...member })
    setEditDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>Add a new sales representative to your team.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newMember.role}
                  onValueChange={(v) => setNewMember({ ...newMember, role: v as RepType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Active Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newMember.capacity}
                    onChange={(e) => setNewMember({ ...newMember, capacity: Number(e.target.value) })}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyLimit">Weekly Limit</Label>
                  <Input
                    id="weeklyLimit"
                    type="number"
                    value={newMember.weeklyLimit}
                    onChange={(e) => setNewMember({ ...newMember, weeklyLimit: Number(e.target.value) })}
                    min={1}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember} disabled={!newMember.name.trim()}>
                Add Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update team member details and assignment limits.</DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editingMember.role}
                  onValueChange={(v) => setEditingMember({ ...editingMember, role: v as RepType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Active Capacity</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={editingMember.capacity}
                    onChange={(e) => setEditingMember({ ...editingMember, capacity: Number(e.target.value) })}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-weeklyLimit">Weekly Limit</Label>
                  <Input
                    id="edit-weeklyLimit"
                    type="number"
                    value={editingMember.weeklyLimit}
                    onChange={(e) => setEditingMember({ ...editingMember, weeklyLimit: Number(e.target.value) })}
                    min={1}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Capacity</TableHead>
              <TableHead className="text-center">Weekly Limit</TableHead>
              <TableHead className="text-center">Assigned</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => {
              const isNearCapacity = member.assignedLeads >= member.capacity * 0.8
              const isAtCapacity = member.assignedLeads >= member.capacity
              return (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleColors[member.role] || "bg-muted"}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{member.capacity}</TableCell>
                  <TableCell className="text-center">{member.weeklyLimit}/week</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        isAtCapacity
                          ? "text-destructive font-medium"
                          : isNearCapacity
                            ? "text-amber-600 dark:text-amber-400"
                            : ""
                      }
                    >
                      {member.assignedLeads}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{Math.max(0, member.capacity - member.assignedLeads)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(member)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                              Delete Team Member
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove <strong>{member.name}</strong> from the team? This will
                              unassign all their leads ({member.assignedLeads} currently assigned).
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
