import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { leads, question, field } = await request.json()

  const apiKey = process.env.PERPLEXITY_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "Perplexity API key not configured. Please add PERPLEXITY_API_KEY to your environment variables." },
      { status: 500 },
    )
  }

  const results: Record<string, string> = {}

  for (const lead of leads) {
    const prompt = `You are a business research assistant. Answer the following question about this business/lead. Be concise and provide only the answer, no explanations.

Business: ${lead.company || lead.name}
${lead.website ? `Website: ${lead.website}` : ""}
${lead.industry ? `Industry: ${lead.industry}` : ""}
${lead.location ? `Location: ${lead.location}` : ""}

Question: ${question}

If you cannot find the answer or it's not applicable, respond with "Unknown".`

    try {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 150,
        }),
      })

      if (!response.ok) {
        console.error(`Perplexity API error for ${lead.id}:`, await response.text())
        results[lead.id] = "Error"
        continue
      }

      const data = await response.json()
      const answer = data.choices?.[0]?.message?.content?.trim() || "Unknown"
      results[lead.id] = answer
    } catch (error) {
      console.error(`Error enriching lead ${lead.id}:`, error)
      results[lead.id] = "Error"
    }
  }

  return NextResponse.json({ results, field })
}
