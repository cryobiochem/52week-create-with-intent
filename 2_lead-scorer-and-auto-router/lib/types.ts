export type LeadTier = "ENTERPRISE" | "HIGH VALUE" | "QUALIFIED" | "WARM LEAD" | "NURTURE"
export type Priority = "URGENT" | "HIGH" | "MEDIUM" | "NORMAL" | "LOW"
export type RepType =
  | "Enterprise Sales"
  | "Senior Sales Rep"
  | "Mid-level Rep"
  | "Junior Rep / SDR"
  | "Marketing Automation"
export type CompanySize = "Enterprise" | "Mid-Market" | "SMB" | "Startup" | "Solopreneur" | "Freelance" | "Unknown"
export type BuyingStage = "Budget Approved" | "Active Buying Cycle" | "Planning" | "Early Awareness" | "Unknown"
export type LeadStatus =
  | "contacted"
  | "rejected"
  | "bad timing"
  | "ghosted"
  | "discovery call"
  | "proposal sent"
  | "closed"

export interface LeadBucket {
  id: string
  name: string
  color: string
}

export interface Lead {
  id: string
  name: string
  email: string
  company: string
  location: string
  industry: string
  budget: number
  source: string
  score: number
  assignedTo: string | null
  createdAt: Date
  bucket?: string
  phone?: string

  // Extended fields for comprehensive scoring
  companySize?: CompanySize
  website?: string
  rating?: number
  instagram?: string
  status?: LeadStatus
  instagramFollowers?: number
  hasActiveOnSocial?: boolean
  linkedInVerified?: boolean
  hasEngagementHistory?: boolean
  lastContactedDaysAgo?: number
  isFirstContact?: boolean
  isReengagementOpportunity?: boolean
  buyingStage?: BuyingStage

  // Tier and routing info (calculated)
  tier?: LeadTier
  priority?: Priority
  responseTime?: string
  sla?: number | null
}

export interface TeamMember {
  id: string
  name: string
  role: RepType
  capacity: number
  assignedLeads: number
  weeklyLimit: number
}

export interface ScoreBreakdown {
  budget: number
  industry: number
  source: number
  location: number
  companySize: number
  quality: number
  engagement: number
  velocity: number
  total: number
}

export interface TierInfo {
  tier: LeadTier
  repType: RepType
  priority: Priority
  responseTime: string
  sla: number | null
}
