import { NextResponse } from "next/server"
import type { Lead } from "@/lib/types"
import { calculateScore, getTierInfo } from "@/lib/scoring"

// In-memory store (shared across requests in dev, resets on restart)
let leads: Lead[] = []

export async function GET() {
  return NextResponse.json(leads)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Calculate score for the new lead
    const scoreBreakdown = calculateScore(body)
    const tierInfo = getTierInfo(scoreBreakdown.total)

    const newLead: Lead = {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email,
      company: body.company,
      location: body.location,
      industry: body.industry,
      budget: Number(body.budget),
      source: body.source,
      score: scoreBreakdown.total,
      assignedTo: null,
      createdAt: new Date(),
      companySize: body.companySize,
      buyingStage: body.buyingStage,
      website: body.website,
      phone: body.phone,
      rating: body.rating,
      instagram: body.instagram,
      status: body.status,
      bucket: body.bucket,
      instagramFollowers: body.instagramFollowers,
      hasActiveOnSocial: body.hasActiveOnSocial,
      linkedInVerified: body.linkedInVerified,
      hasEngagementHistory: body.hasEngagementHistory,
      lastContactedDaysAgo: body.lastContactedDaysAgo,
      isFirstContact: body.isFirstContact ?? true,
      isReengagementOpportunity: body.isReengagementOpportunity,
      tier: tierInfo.tier,
      priority: tierInfo.priority,
      responseTime: tierInfo.responseTime,
      sla: tierInfo.sla,
    }

    leads.push(newLead)

    return NextResponse.json(newLead, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (body.action === "bulk-import") {
      const importedLeads: Lead[] = body.leads.map((lead: Partial<Lead>) => {
        const scoreBreakdown = calculateScore(lead)
        const tierInfo = getTierInfo(scoreBreakdown.total)
        return {
          id: crypto.randomUUID(),
          ...lead,
          budget: Number(lead.budget) || 0,
          score: scoreBreakdown.total,
          assignedTo: null,
          createdAt: new Date(),
          isFirstContact: lead.isFirstContact ?? true,
          tier: tierInfo.tier,
          priority: tierInfo.priority,
          responseTime: tierInfo.responseTime,
          sla: tierInfo.sla,
        }
      })

      leads = [...leads, ...importedLeads]
      return NextResponse.json({ imported: importedLeads.length })
    }

    if (body.action === "rescore") {
      leads = leads.map((lead) => {
        const scoreBreakdown = calculateScore(lead)
        const tierInfo = getTierInfo(scoreBreakdown.total)
        return {
          ...lead,
          score: scoreBreakdown.total,
          tier: tierInfo.tier,
          priority: tierInfo.priority,
          responseTime: tierInfo.responseTime,
          sla: tierInfo.sla,
        }
      })
      return NextResponse.json({ rescored: leads.length })
    }

    if (body.action === "set-leads") {
      leads = body.leads
      return NextResponse.json({ success: true })
    }

    if (body.action === "update-lead") {
      const index = leads.findIndex((l) => l.id === body.lead.id)
      if (index >= 0) {
        // Recalculate score after update
        const scoreBreakdown = calculateScore(body.lead)
        const tierInfo = getTierInfo(scoreBreakdown.total)
        leads[index] = {
          ...leads[index],
          ...body.lead,
          score: scoreBreakdown.total,
          tier: tierInfo.tier,
          priority: tierInfo.priority,
          responseTime: tierInfo.responseTime,
          sla: tierInfo.sla,
        }
        return NextResponse.json({ success: true, lead: leads[index] })
      }
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    if (body.action === "delete-lead") {
      const index = leads.findIndex((l) => l.id === body.leadId)
      if (index >= 0) {
        leads.splice(index, 1)
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    if (body.action === "delete-leads") {
      const idsToDelete = new Set(body.leadIds as string[])
      leads = leads.filter((l) => !idsToDelete.has(l.id))
      return NextResponse.json({ success: true, deleted: idsToDelete.size })
    }

    if (body.action === "bulk-move-bucket") {
      const idsToMove = new Set(body.leadIds as string[])
      const bucketId = body.bucketId as string

      leads = leads.map((lead) => {
        if (idsToMove.has(lead.id)) {
          return { ...lead, bucket: bucketId }
        }
        return lead
      })

      return NextResponse.json({ success: true, moved: idsToMove.size })
    }

    if (body.action === "enrich-leads") {
      const idsToEnrich = body.leadIds as string[]
      const field = body.field as string
      const results = body.results as Record<string, string>

      leads = leads.map((lead) => {
        if (idsToEnrich.includes(lead.id) && results[lead.id]) {
          const value = results[lead.id]

          // Parse and assign the value based on the field type
          if (field === "budget") {
            const budgetValue = Number.parseInt(value.replace(/[^0-9]/g, ""))
            if (!isNaN(budgetValue)) {
              return { ...lead, budget: budgetValue }
            }
          } else if (field === "rating") {
            const ratingValue = Number.parseFloat(value)
            if (!isNaN(ratingValue)) {
              return { ...lead, rating: Math.min(5, Math.max(0, ratingValue)) }
            }
          } else if (field === "phone" || field === "website" || field === "instagram") {
            if (value !== "Unknown" && value !== "Error") {
              return { ...lead, [field]: value }
            }
          } else {
            // For other string fields
            if (value !== "Unknown" && value !== "Error") {
              return { ...lead, [field]: value }
            }
          }
        }
        return lead
      })

      // Recalculate scores after enrichment
      leads = leads.map((lead) => {
        if (idsToEnrich.includes(lead.id)) {
          const scoreBreakdown = calculateScore(lead)
          const tierInfo = getTierInfo(scoreBreakdown.total)
          return {
            ...lead,
            score: scoreBreakdown.total,
            tier: tierInfo.tier,
            priority: tierInfo.priority,
            responseTime: tierInfo.responseTime,
            sla: tierInfo.sla,
          }
        }
        return lead
      })

      return NextResponse.json({ success: true, enriched: idsToEnrich.length })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE() {
  leads = []
  return NextResponse.json({ success: true })
}
