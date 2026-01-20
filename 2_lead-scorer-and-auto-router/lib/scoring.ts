import type { Lead, ScoreBreakdown, TierInfo } from "./types"

/**
 * Budget scoring (6 tiers, max +50)
 */
function calculateBudgetScore(budget: number): number {
  if (budget > 100000) return 50
  if (budget > 50000) return 40
  if (budget > 25000) return 30
  if (budget > 10000) return 20
  if (budget > 5000) return 10
  return 5
}

/**
 * Industry scoring (10+ categories, max +35)
 */
function calculateIndustryScore(industry: string): number {
  const industryScores: Record<string, number> = {
    Tech: 35,
    SaaS: 35,
    FinTech: 33,
    Finance: 33,
    Healthcare: 32,
    Pharma: 32,
    "Scientific Research": 30,
    "E-commerce": 28,
    Retail: 28,
    Automotive: 27,
    Manufacturing: 27,
    "Real Estate": 26,
    Construction: 26,
    Education: 25,
    Logistics: 24,
    "Supply Chain": 24,
    Media: 23,
    Entertainment: 23,
  }

  // Case-insensitive matching
  const normalizedIndustry = industry.trim()
  for (const [key, value] of Object.entries(industryScores)) {
    if (normalizedIndustry.toLowerCase() === key.toLowerCase()) {
      return value
    }
  }
  return 10 // Other
}

/**
 * Location scoring (9 regions, max +25)
 */
function calculateLocationScore(location: string): number {
  const locationScores: Record<string, number> = {
    PT: 25,
    Portugal: 25,
    UK: 24,
    Ireland: 24,
    "United Kingdom": 24,
    Germany: 23,
    France: 23,
    Benelux: 23,
    Netherlands: 23,
    Belgium: 23,
    Luxembourg: 23,
    Spain: 22,
    Italy: 22,
    Scandinavia: 21,
    Denmark: 21,
    Sweden: 21,
    Norway: 21,
    Finland: 21,
    US: 20,
    USA: 20,
    "United States": 20,
    CA: 20,
    Canada: 20,
    "North America": 20,
    Australia: 18,
    NZ: 18,
    "New Zealand": 18,
    Singapore: 17,
    Japan: 17,
    India: 17,
    APAC: 17,
    Asia: 17,
    Brazil: 16,
    LATAM: 16,
    Mexico: 16,
    "South America": 16,
  }

  const normalizedLocation = location.trim()
  for (const [key, value] of Object.entries(locationScores)) {
    if (normalizedLocation.toLowerCase() === key.toLowerCase()) {
      return value
    }
  }
  return 8 // Other
}

/**
 * Source scoring (9 sources, max +30)
 */
function calculateSourceScore(source: string): number {
  const sourceScores: Record<string, number> = {
    Referral: 30,
    "Warm Intro": 30,
    Partnership: 28,
    Channel: 28,
    Inbound: 25,
    Website: 25,
    "Website Form": 25,
    Event: 25,
    Conference: 25,
    "Trade Show": 24,
    "LinkedIn DM": 22,
    LinkedIn: 22,
    Press: 20,
    Media: 20,
    "Social Media": 18,
    Instagram: 18,
    "Cold Email": 12,
    "Cold Call": 12,
  }

  const normalizedSource = source.trim()
  for (const [key, value] of Object.entries(sourceScores)) {
    if (normalizedSource.toLowerCase() === key.toLowerCase()) {
      return value
    }
  }
  return 8 // Other
}

/**
 * Company Size scoring (6 tiers, max +28)
 */
function calculateCompanySizeScore(companySize?: string): number {
  const sizeScores: Record<string, number> = {
    Enterprise: 28,
    "Mid-Market": 25,
    SMB: 20,
    Startup: 18,
    Solopreneur: 10,
    Freelance: 10,
    Unknown: 5,
  }

  if (!companySize) return 5
  return sizeScores[companySize] || 5
}

/**
 * Lead Quality scoring (7 sub-criteria, max +30)
 */
function calculateQualityScore(lead: Partial<Lead>): number {
  let score = 0

  // Website + Active Social
  if (lead.website && lead.hasActiveOnSocial) score += 15
  else if (lead.website) score += 8

  // Instagram followers
  if (lead.instagramFollowers && lead.instagramFollowers > 5000) score += 12
  else if (lead.instagramFollowers && lead.instagramFollowers > 1000) score += 8

  // Rating
  if (lead.rating && lead.rating > 4.5) score += 10
  else if (lead.rating && lead.rating > 4.0) score += 7

  // LinkedIn verified
  if (lead.linkedInVerified) score += 8

  // Engagement history
  if (lead.hasEngagementHistory) score += 10

  return Math.min(score, 30)
}

/**
 * Engagement Level scoring (6 tiers, max +25)
 */
function calculateEngagementScore(lead: Partial<Lead>): number {
  let score = 0

  if (lead.lastContactedDaysAgo !== undefined) {
    if (lead.lastContactedDaysAgo < 3) score += 15
    else if (lead.lastContactedDaysAgo < 7) score += 10
    else if (lead.lastContactedDaysAgo < 28) score += 5
  } else if (lead.isFirstContact) {
    score += 15
  }

  if (lead.isReengagementOpportunity) score += 8

  return Math.min(score, 25)
}

/**
 * Decision Velocity scoring (4 stages, max +20)
 */
function calculateVelocityScore(buyingStage?: string): number {
  const stageScores: Record<string, number> = {
    "Budget Approved": 20,
    "Active Buying Cycle": 18,
    Planning: 12,
    "Early Awareness": 5,
    Unknown: 0,
  }

  if (!buyingStage) return 0
  return stageScores[buyingStage] || 0
}

/**
 * Main scoring function - calculates complete score breakdown
 */
export function calculateScore(lead: Partial<Lead>): ScoreBreakdown {
  const budget = calculateBudgetScore(lead.budget || 0)
  const industry = calculateIndustryScore(lead.industry || "")
  const location = calculateLocationScore(lead.location || "")
  const source = calculateSourceScore(lead.source || "")
  const companySize = calculateCompanySizeScore(lead.companySize)
  const quality = calculateQualityScore(lead)
  const engagement = calculateEngagementScore(lead)
  const velocity = calculateVelocityScore(lead.buyingStage)

  const total = Math.min(
    budget + industry + location + source + companySize + quality + engagement + velocity,
    213, // Maximum possible score
  )

  return {
    budget,
    industry,
    location,
    source,
    companySize,
    quality,
    engagement,
    velocity,
    total,
  }
}

/**
 * Gets the tier classification based on score
 */
export function getTierInfo(score: number): TierInfo {
  if (score >= 170) {
    return {
      tier: "ENTERPRISE",
      repType: "Enterprise Sales",
      priority: "URGENT",
      responseTime: "Same day",
      sla: 0,
    }
  }
  if (score >= 130) {
    return {
      tier: "HIGH VALUE",
      repType: "Senior Sales Rep",
      priority: "HIGH",
      responseTime: "<24 hours",
      sla: 24,
    }
  }
  if (score >= 90) {
    return {
      tier: "QUALIFIED",
      repType: "Mid-level Rep",
      priority: "MEDIUM",
      responseTime: "<48 hours",
      sla: 48,
    }
  }
  if (score >= 50) {
    return {
      tier: "WARM LEAD",
      repType: "Junior Rep / SDR",
      priority: "NORMAL",
      responseTime: "<72 hours",
      sla: 72,
    }
  }
  return {
    tier: "NURTURE",
    repType: "Marketing Automation",
    priority: "LOW",
    responseTime: "Automated",
    sla: null,
  }
}

/**
 * Legacy function for backward compatibility
 */
export function getScoreTier(score: number): "enterprise" | "high" | "qualified" | "warm" | "nurture" {
  if (score >= 170) return "enterprise"
  if (score >= 130) return "high"
  if (score >= 90) return "qualified"
  if (score >= 50) return "warm"
  return "nurture"
}

/**
 * Get all scoring rules documentation
 */
export function getScoringRules() {
  return {
    budget: {
      name: "Budget",
      maxPoints: 50,
      tiers: [
        { label: "$100k+", points: 50 },
        { label: "$50–100k", points: 40 },
        { label: "$25–50k", points: 30 },
        { label: "$10–25k", points: 20 },
        { label: "$5–10k", points: 10 },
        { label: "<$5k", points: 5 },
      ],
    },
    industry: {
      name: "Industry",
      maxPoints: 35,
      tiers: [
        { label: "Tech/SaaS", points: 35 },
        { label: "FinTech/Finance", points: 33 },
        { label: "Healthcare/Pharma", points: 32 },
        { label: "Scientific Research", points: 30 },
        { label: "E-commerce/Retail", points: 28 },
        { label: "Automotive/Manufacturing", points: 27 },
        { label: "Real Estate/Construction", points: 26 },
        { label: "Education", points: 25 },
        { label: "Logistics/Supply Chain", points: 24 },
        { label: "Media/Entertainment", points: 23 },
        { label: "Other", points: 10 },
      ],
    },
    location: {
      name: "Location",
      maxPoints: 25,
      tiers: [
        { label: "Portugal", points: 25 },
        { label: "UK/Ireland", points: 24 },
        { label: "Germany/France/Benelux", points: 23 },
        { label: "Spain/Italy", points: 22 },
        { label: "Scandinavia", points: 21 },
        { label: "North America", points: 20 },
        { label: "Australia/NZ", points: 18 },
        { label: "APAC", points: 17 },
        { label: "Brazil/LATAM", points: 16 },
        { label: "Other", points: 8 },
      ],
    },
    source: {
      name: "Source",
      maxPoints: 30,
      tiers: [
        { label: "Referral/Warm Intro", points: 30 },
        { label: "Partnership/Channel", points: 28 },
        { label: "Inbound/Website", points: 25 },
        { label: "Event/Conference", points: 25 },
        { label: "Trade Show", points: 24 },
        { label: "LinkedIn DM", points: 22 },
        { label: "Press/Media", points: 20 },
        { label: "Social Media", points: 18 },
        { label: "Cold Email", points: 12 },
        { label: "Other", points: 8 },
      ],
    },
    companySize: {
      name: "Company Size",
      maxPoints: 28,
      tiers: [
        { label: "Enterprise", points: 28 },
        { label: "Mid-Market", points: 25 },
        { label: "SMB", points: 20 },
        { label: "Startup", points: 18 },
        { label: "Solopreneur/Freelance", points: 10 },
        { label: "Unknown", points: 5 },
      ],
    },
    quality: {
      name: "Lead Quality",
      maxPoints: 30,
      tiers: [
        { label: "Website + Active Social", points: 15 },
        { label: "Instagram >5k followers", points: 12 },
        { label: "Instagram 1–5k", points: 8 },
        { label: "Rating >4.5", points: 10 },
        { label: "Rating 4.0–4.5", points: 7 },
        { label: "LinkedIn verified", points: 8 },
        { label: "Engagement history", points: 10 },
      ],
    },
    engagement: {
      name: "Engagement Level",
      maxPoints: 25,
      tiers: [
        { label: "Last contacted <3 days", points: 15 },
        { label: "Last contacted <7 days", points: 10 },
        { label: "Last contacted 1–4 weeks", points: 5 },
        { label: "Fresh/First contact", points: 15 },
        { label: "Re-engagement opportunity", points: 8 },
      ],
    },
    velocity: {
      name: "Decision Velocity",
      maxPoints: 20,
      tiers: [
        { label: "Budget approved", points: 20 },
        { label: "Active buying cycle", points: 18 },
        { label: "Planning stage", points: 12 },
        { label: "Early awareness", points: 5 },
      ],
    },
  }
}

/**
 * Get routing tiers documentation
 */
export function getRoutingTiers() {
  return [
    {
      tier: "ENTERPRISE",
      scoreRange: "170+",
      repType: "Enterprise Sales",
      priority: "URGENT",
      responseTime: "Same day",
    },
    {
      tier: "HIGH VALUE",
      scoreRange: "130–169",
      repType: "Senior Sales Rep",
      priority: "HIGH",
      responseTime: "<24 hours",
    },
    {
      tier: "QUALIFIED",
      scoreRange: "90–129",
      repType: "Mid-level Rep",
      priority: "MEDIUM",
      responseTime: "<48 hours",
    },
    {
      tier: "WARM LEAD",
      scoreRange: "50–89",
      repType: "Junior Rep / SDR",
      priority: "NORMAL",
      responseTime: "<72 hours",
    },
    {
      tier: "NURTURE",
      scoreRange: "0–49",
      repType: "Marketing Automation",
      priority: "LOW",
      responseTime: "Automated",
    },
  ]
}
