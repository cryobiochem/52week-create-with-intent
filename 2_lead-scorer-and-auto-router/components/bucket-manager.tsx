"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2, FolderOpen } from "lucide-react"
import type { LeadBucket } from "@/lib/types"

const BUCKET_COLORS = [
  { name: "gray", class: "bg-gray-500" },
  { name: "red", class: "bg-red-500" },
  { name: "orange", class: "bg-orange-500" },
  { name: "amber", class: "bg-amber-500" },
  { name: "green", class: "bg-green-500" },
  { name: "teal", class: "bg-teal-500" },
  { name: "blue", class: "bg-blue-500" },
  { name: "indigo", class: "bg-indigo-500" },
  { name: "purple", class: "bg-purple-500" },
  { name: "pink", class: "bg-pink-500" },
]

interface BucketManagerProps {
  buckets: LeadBucket[]
  selectedBucket: string
  onSelectBucket: (bucketId: string) => void
  onAddBucket: (bucket: Omit<LeadBucket, "id">) => Promise<void>
  onUpdateBucket: (bucket: LeadBucket) => Promise<void>
  onDeleteBucket: (bucketId: string) => Promise<void>
  bucketCounts: Record<string, number>
}

export function BucketManager({
  buckets,
  selectedBucket,
  onSelectBucket,
  onAddBucket,
  onUpdateBucket,
  onDeleteBucket,
  bucketCounts,
}: BucketManagerProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingBucket, setEditingBucket] = useState<LeadBucket | null>(null)
  const [newBucketName, setNewBucketName] = useState("")
  const [newBucketColor, setNewBucketColor] = useState("blue")

  const handleAddBucket = async () => {
    if (!newBucketName.trim()) return
    await onAddBucket({ name: newBucketName.trim(), color: newBucketColor })
    setNewBucketName("")
    setNewBucketColor("blue")
    setAddDialogOpen(false)
  }

  const handleEditBucket = async () => {
    if (!editingBucket || !newBucketName.trim()) return
    await onUpdateBucket({ ...editingBucket, name: newBucketName.trim(), color: newBucketColor })
    setEditingBucket(null)
    setNewBucketName("")
    setNewBucketColor("blue")
    setEditDialogOpen(false)
  }

  const startEdit = (bucket: LeadBucket) => {
    setEditingBucket(bucket)
    setNewBucketName(bucket.name)
    setNewBucketColor(bucket.color)
    setEditDialogOpen(true)
  }

  const getColorClass = (color: string) => {
    return BUCKET_COLORS.find((c) => c.name === color)?.class || "bg-blue-500"
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {buckets.map((bucket) => (
        <div key={bucket.id} className="flex items-center">
          <Button
            variant={selectedBucket === bucket.id ? "secondary" : "ghost"}
            size="sm"
            className="gap-2"
            onClick={() => onSelectBucket(bucket.id)}
          >
            <div className={`w-2 h-2 rounded-full ${getColorClass(bucket.color)}`} />
            {bucket.name}
            <Badge variant="outline" className="ml-1 text-xs">
              {bucketCounts[bucket.id] || 0}
            </Badge>
          </Button>
          {bucket.id !== "all" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 ml-0.5">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => startEdit(bucket)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => onDeleteBucket(bucket.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Bucket
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Create New Bucket
            </DialogTitle>
            <DialogDescription>Create a bucket to organize your leads into categories.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bucket Name</label>
              <Input
                placeholder="e.g., Research, Pet Shops, Hot Leads..."
                value={newBucketName}
                onChange={(e) => setNewBucketName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2">
                {BUCKET_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      newBucketColor === color.name ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                    onClick={() => setNewBucketColor(color.name)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBucket} disabled={!newBucketName.trim()}>
              Create Bucket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Bucket
            </DialogTitle>
            <DialogDescription>Update the bucket name and color.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bucket Name</label>
              <Input value={newBucketName} onChange={(e) => setNewBucketName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex flex-wrap gap-2">
                {BUCKET_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      newBucketColor === color.name ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                    onClick={() => setNewBucketColor(color.name)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBucket} disabled={!newBucketName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
