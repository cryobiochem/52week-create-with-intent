"use client"

import type React from "react"

import { useState } from "react"
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
import { Plus } from "lucide-react"
import type { CompanySize, BuyingStage, LeadStatus, LeadBucket } from "@/lib/types"

interface AddLeadDialogProps {
  onAddLead: (lead: {
    name: string
    email: string
    company: string
    location: string
    industry: string
    budget: number
    source: string
    companySize?: CompanySize
    buyingStage?: BuyingStage
    phone?: string
    website?: string
    rating?: number
    instagram?: string
    status?: LeadStatus
    bucket?: string
  }) => void
  buckets: LeadBucket[]
}

const industries = [
  "Tech",
  "SaaS",
  "FinTech",
  "Finance",
  "Healthcare",
  "Pharma",
  "Scientific Research",
  "E-commerce",
  "Retail",
  "Automotive",
  "Manufacturing",
  "Real Estate",
  "Construction",
  "Education",
  "Logistics",
  "Media",
  "Entertainment",
  "Other",
]

const locations = [
  "Portugal",
  "UK",
  "Ireland",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Scandinavia",
  "USA",
  "Canada",
  "Australia",
  "Singapore",
  "Japan",
  "India",
  "Brazil",
  "Mexico",
  "Other",
]

const sources = [
  "Referral",
  "Warm Intro",
  "Partnership",
  "Inbound",
  "Website",
  "Event",
  "Conference",
  "Trade Show",
  "LinkedIn DM",
  "Press",
  "Social Media",
  "Cold Email",
  "Other",
]

const companySizes: CompanySize[] = [
  "Enterprise",
  "Mid-Market",
  "SMB",
  "Startup",
  "Solopreneur",
  "Freelance",
  "Unknown",
]

const buyingStages: BuyingStage[] = ["Budget Approved", "Active Buying Cycle", "Planning", "Early Awareness", "Unknown"]

const leadStatuses: LeadStatus[] = [
  "contacted",
  "rejected",
  "bad timing",
  "ghosted",
  "discovery call",
  "proposal sent",
  "closed",
]

export function AddLeadDialog({ onAddLead, buckets }: AddLeadDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    location: "",
    industry: "",
    budget: "",
    source: "",
    companySize: "" as CompanySize | "",
    buyingStage: "" as BuyingStage | "",
    phone: "",
    website: "",
    rating: "",
    instagram: "",
    status: "" as LeadStatus | "",
    bucket: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddLead({
      ...formData,
      budget: Number(formData.budget),
      companySize: formData.companySize || undefined,
      buyingStage: formData.buyingStage || undefined,
      phone: formData.phone || undefined,
      website: formData.website || undefined,
      rating: formData.rating ? Number(formData.rating) : undefined,
      instagram: formData.instagram || undefined,
      status: formData.status || undefined,
      bucket: formData.bucket || undefined,
    })
    setFormData({
      name: "",
      email: "",
      company: "",
      location: "",
      industry: "",
      budget: "",
      source: "",
      companySize: "",
      buyingStage: "",
      phone: "",
      website: "",
      rating: "",
      instagram: "",
      status: "",
      bucket: "",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>Enter the lead details. Score will be calculated automatically.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Inc."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="15000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((src) => (
                      <SelectItem key={src} value={src}>
                        {src}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select
                  value={formData.companySize}
                  onValueChange={(value) => setFormData({ ...formData, companySize: value as CompanySize })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyingStage">Buying Stage</Label>
                <Select
                  value={formData.buyingStage}
                  onValueChange={(value) => setFormData({ ...formData, buyingStage: value as BuyingStage })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {buyingStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
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
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="4.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as LeadStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bucket">Bucket</Label>
                <Select value={formData.bucket} onValueChange={(value) => setFormData({ ...formData, bucket: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bucket" />
                  </SelectTrigger>
                  <SelectContent>
                    {buckets
                      .filter((b) => b.id !== "all")
                      .map((bucket) => (
                        <SelectItem key={bucket.id} value={bucket.id}>
                          {bucket.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
