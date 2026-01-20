"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScoreBadge, TierBadge, PriorityBadge } from "@/components/score-badge"
import type { Lead, TeamMember, CompanySize, BuyingStage, LeadStatus, LeadBucket } from "@/lib/types"
import { getTierInfo } from "@/lib/scoring"
import { X, Trash2 } from "lucide-react"

interface EditLeadDialogProps {
  lead: Lead | null
  teamMembers: TeamMember[]
  buckets: LeadBucket[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (lead: Lead) => Promise<void>
  onDelete: (leadId: string) => Promise<void>
}

const COMPANY_SIZES: CompanySize[] = [
  "Enterprise",
  "Mid-Market",
  "SMB",
  "Startup",
  "Solopreneur",
  "Freelance",
  "Unknown",
]
const BUYING_STAGES: BuyingStage[] = [
  "Budget Approved",
  "Active Buying Cycle",
  "Planning",
  "Early Awareness",
  "Unknown",
]

const LEAD_STATUSES: LeadStatus[] = [
  "contacted",
  "rejected",
  "bad timing",
  "ghosted",
  "discovery call",
  "proposal sent",
  "closed",
]

export function EditLeadDialog({
  lead,
  teamMembers,
  buckets,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EditLeadDialogProps) {
  const [editedLead, setEditedLead] = useState<Lead | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (lead) {
      setEditedLead({ ...lead })
    }
  }, [lead])

  const handleSave = async () => {
    if (!editedLead) return
    setIsSaving(true)
    await onSave(editedLead)
    setIsSaving(false)
    onOpenChange(false)
  }

  const handleDelete = async () => {
    if (!editedLead) return
    await onDelete(editedLead.id)
    onOpenChange(false)
  }

  if (!editedLead) return null

  const tierInfo = getTierInfo(editedLead.score)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>Update lead information and details.</DialogDescription>
        </DialogHeader>

        {/* Score Summary */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Score</span>
            <ScoreBadge score={editedLead.score} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Tier</span>
            <TierBadge tier={editedLead.tier || tierInfo.tier} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">Priority</span>
            <PriorityBadge priority={editedLead.priority || tierInfo.priority} />
          </div>
          <div className="flex flex-col items-center gap-1 ml-auto">
            <span className="text-xs text-muted-foreground">SLA</span>
            <span className="text-sm font-medium">{editedLead.responseTime || tierInfo.responseTime}</span>
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editedLead.name}
                onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedLead.email}
                onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={editedLead.company}
                onChange={(e) => setEditedLead({ ...editedLead, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editedLead.location}
                onChange={(e) => setEditedLead({ ...editedLead, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={editedLead.industry}
                onChange={(e) => setEditedLead({ ...editedLead, industry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={editedLead.source}
                onChange={(e) => setEditedLead({ ...editedLead, source: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={editedLead.budget}
                onChange={(e) => setEditedLead({ ...editedLead, budget: Number(e.target.value) })}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size</Label>
              <Select
                value={editedLead.companySize || "Unknown"}
                onValueChange={(v) => setEditedLead({ ...editedLead, companySize: v as CompanySize })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (WhatsApp)</Label>
              <Input
                id="phone"
                value={editedLead.phone || ""}
                onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={editedLead.website || ""}
                onChange={(e) => setEditedLead({ ...editedLead, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={editedLead.rating ?? ""}
                onChange={(e) =>
                  setEditedLead({ ...editedLead, rating: e.target.value ? Number(e.target.value) : undefined })
                }
                placeholder="4.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={editedLead.instagram || ""}
                onChange={(e) => setEditedLead({ ...editedLead, instagram: e.target.value })}
                placeholder="@username"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <div className="flex gap-2">
                <Select
                  value={editedLead.status || "__none__"}
                  onValueChange={(v) =>
                    setEditedLead({ ...editedLead, status: v === "__none__" ? undefined : (v as LeadStatus) })
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">-- None --</SelectItem>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editedLead.status && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditedLead({ ...editedLead, status: undefined })}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyingStage">Buying Stage</Label>
              <div className="flex gap-2">
                <Select
                  value={editedLead.buyingStage || "__none__"}
                  onValueChange={(v) =>
                    setEditedLead({ ...editedLead, buyingStage: v === "__none__" ? undefined : (v as BuyingStage) })
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">-- None --</SelectItem>
                    {BUYING_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editedLead.buyingStage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditedLead({ ...editedLead, buyingStage: undefined })}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bucket">Bucket</Label>
            <div className="flex gap-2">
              <Select
                value={editedLead.bucket || "__none__"}
                onValueChange={(v) => setEditedLead({ ...editedLead, bucket: v === "__none__" ? undefined : v })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select bucket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">-- None --</SelectItem>
                  {buckets
                    .filter((b) => b.id !== "all")
                    .map((bucket) => (
                      <SelectItem key={bucket.id} value={bucket.id}>
                        {bucket.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {editedLead.bucket && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditedLead({ ...editedLead, bucket: undefined })}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2 sm:mr-auto">
                <Trash2 className="h-4 w-4" />
                Delete Lead
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete {editedLead.name} from your leads.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
