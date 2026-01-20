import { NextResponse } from "next/server"
import type { LeadBucket } from "@/lib/types"

// In-memory store for buckets
let buckets: LeadBucket[] = [{ id: "all", name: "All Leads", color: "gray" }]

export async function GET() {
  return NextResponse.json(buckets)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newBucket: LeadBucket = {
      id: crypto.randomUUID(),
      name: body.name,
      color: body.color || "blue",
    }

    buckets.push(newBucket)
    return NextResponse.json(newBucket, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (body.action === "update") {
      const index = buckets.findIndex((b) => b.id === body.bucket.id)
      if (index >= 0) {
        buckets[index] = { ...buckets[index], ...body.bucket }
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: "Bucket not found" }, { status: 404 })
    }

    if (body.action === "delete") {
      // Don't allow deleting the "All Leads" bucket
      if (body.bucketId === "all") {
        return NextResponse.json({ error: "Cannot delete default bucket" }, { status: 400 })
      }
      buckets = buckets.filter((b) => b.id !== body.bucketId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
