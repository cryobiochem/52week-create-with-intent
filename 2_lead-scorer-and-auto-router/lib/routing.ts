import type { Lead, TeamMember, RepType } from "./types"
import { getTierInfo, getScoreTier } from "./scoring"

/**
 * Routes a lead to an appropriate team member based on score tier.
 *
 * Routing Logic:
 * - ENTERPRISE (170+): assign to Enterprise Sales
 * - HIGH VALUE (130–169): assign to Senior Sales Rep
 * - QUALIFIED (90–129): assign to Mid-level Rep
 * - WARM LEAD (50–89): assign to Junior Rep / SDR
 * - NURTURE (0–49): assign to Marketing Automation
 *
 * Uses round-robin within each tier to distribute leads evenly.
 */
export function routeLead(lead: Lead, teamMembers: TeamMember[]): string | null {
  const tierInfo = getTierInfo(lead.score)
  const targetRole = tierInfo.repType

  // Find eligible team members (matching role with capacity)
  const eligibleMembers = teamMembers.filter(
    (member) => member.role === targetRole && member.assignedLeads < member.capacity,
  )

  if (eligibleMembers.length === 0) {
    // Fallback: find any member with capacity, prioritizing by role hierarchy
    const roleHierarchy: RepType[] = [
      "Enterprise Sales",
      "Senior Sales Rep",
      "Mid-level Rep",
      "Junior Rep / SDR",
      "Marketing Automation",
    ]

    for (const role of roleHierarchy) {
      const fallback = teamMembers.find((m) => m.role === role && m.assignedLeads < m.capacity)
      if (fallback) return fallback.id
    }

    return null
  }

  // Round-robin: pick member with least assigned leads within tier
  const sorted = eligibleMembers.sort((a, b) => a.assignedLeads - b.assignedLeads)
  return sorted[0].id
}

/**
 * Routes all leads and returns updated leads and team members.
 */
export function routeAllLeads(leads: Lead[], teamMembers: TeamMember[]): { leads: Lead[]; teamMembers: TeamMember[] } {
  // Reset assignments
  const updatedTeamMembers = teamMembers.map((m) => ({ ...m, assignedLeads: 0 }))

  // Sort leads by score descending (prioritize high-value leads)
  const sortedLeads = [...leads].sort((a, b) => b.score - a.score)

  const updatedLeads = sortedLeads.map((lead) => {
    const tierInfo = getTierInfo(lead.score)
    const assignedTo = routeLead(lead, updatedTeamMembers)

    if (assignedTo) {
      const memberIndex = updatedTeamMembers.findIndex((m) => m.id === assignedTo)
      if (memberIndex !== -1) {
        updatedTeamMembers[memberIndex].assignedLeads++
      }
    }

    return {
      ...lead,
      assignedTo,
      tier: tierInfo.tier,
      priority: tierInfo.priority,
      responseTime: tierInfo.responseTime,
      sla: tierInfo.sla,
    }
  })

  return { leads: updatedLeads, teamMembers: updatedTeamMembers }
}

// Re-export for backward compatibility
export { getScoreTier }
