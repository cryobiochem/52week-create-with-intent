import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!process.env.PERPLEXITY_API_KEY) {
      return NextResponse.json({ error: "PERPLEXITY_API_KEY not configured" }, { status: 500 })
    }

    // Build messages array for Perplexity API
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant for a lead scoring and routing dashboard. You help users understand their leads, scoring algorithms, team management, and answer general questions. Be concise and friendly.",
      },
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: "user",
        content: message,
      },
    ]

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Perplexity API error:", errorText)
      return NextResponse.json({ error: "Failed to get AI response" }, { status: response.status })
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
