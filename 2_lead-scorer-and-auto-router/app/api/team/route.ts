import { NextResponse } from "next/server"
import type { TeamMember } from "@/lib/types"
import { initialTeamMembers } from "@/lib/store"

let teamMembers: TeamMember[] = [...initialTeamMembers]

export async function GET() {
  return NextResponse.json(teamMembers)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: body.name,
      role: body.role,
      capacity: body.capacity || 10,
      assignedLeads: 0,
      weeklyLimit: body.weeklyLimit || 50,
    }
    teamMembers.push(newMember)
    return NextResponse.json(newMember)
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (body.action === "set-team") {
      teamMembers = body.teamMembers
      return NextResponse.json({ success: true })
    }

    if (body.action === "reset") {
      teamMembers = [...initialTeamMembers]
      return NextResponse.json({ success: true })
    }

    if (body.action === "update-member") {
      const index = teamMembers.findIndex((m) => m.id === body.member.id)
      if (index >= 0) {
        teamMembers[index] = { ...teamMembers[index], ...body.member }
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    if (body.action === "delete-member") {
      teamMembers = teamMembers.filter((m) => m.id !== body.memberId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
