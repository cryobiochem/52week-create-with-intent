"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2 } from "lucide-react"
import type { Lead } from "@/lib/types"

interface AskAIDialogProps {
  leads: Lead[]
  selectedLeadIds: Set<string>
  onEnrichLeads: (leadIds: string[], field: string, results: Record<string, string>) => Promise<void>
}

const ENRICHABLE_FIELDS = [
  { value: "budget", label: "Budget" },
  { value: "phone", label: "Phone" },
  { value: "website", label: "Website" },
  { value: "instagram", label: "Instagram" },
  { value: "industry", label: "Industry" },
  { value: "rating", label: "Rating" },
  { value: "companySize", label: "Company Size" },
  { value: "location", label: "Location" },
]

const PRESET_QUESTIONS = [
  { field: "budget", question: "What is the approximate annual budget or revenue of this company?" },
  { field: "phone", question: "What is the main phone number for this business?" },
  { field: "website", question: "What is the official website URL for this business?" },
  { field: "instagram", question: "What is the Instagram handle for this business?" },
  { field: "industry", question: "What industry or sector does this business operate in?" },
  { field: "rating", question: "What is the Google Maps or Yelp rating (out of 5) for this business?" },
  { field: "companySize", question: "What is the company size? (Enterprise, Mid-Market, SMB, Startup, Solopreneur)" },
  { field: "location", question: "Where is this business located? (City, State/Country)" },
]

export function AskAIDialog({ leads, selectedLeadIds, onEnrichLeads }: AskAIDialogProps) {
  const [open, setOpen] = useState(false)
  const [field, setField] = useState("")
  const [question, setQuestion] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const selectedLeads = leads.filter((l) => selectedLeadIds.has(l.id))

  const handleFieldChange = (value: string) => {
    setField(value)
    const preset = PRESET_QUESTIONS.find((p) => p.field === value)
    if (preset) {
      setQuestion(preset.question)
    }
  }

  const handleSubmit = async () => {
    if (!field || !question || selectedLeads.length === 0) return

    setIsProcessing(true)
    setError(null)
    setProgress({ current: 0, total: selectedLeads.length })

    try {
      const response = await fetch("/api/ai/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads: selectedLeads.map((l) => ({
            id: l.id,
            name: l.name,
            company: l.company,
            website: l.website,
            industry: l.industry,
            location: l.location,
          })),
          question,
          field,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to enrich leads")
      }

      const { results } = await response.json()
      await onEnrichLeads(Array.from(selectedLeadIds), field, results)
      setOpen(false)
      setField("")
      setQuestion("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsProcessing(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" disabled={selectedLeadIds.size === 0}>
          <Sparkles className="h-4 w-4" />
          Ask AI ({selectedLeadIds.size})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Ask AI to Enrich Leads
          </DialogTitle>
          <DialogDescription>
            Use AI to research and fill in information for {selectedLeads.length} selected lead(s). Powered by
            Perplexity AI.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="field">Field to Enrich</Label>
            <Select value={field} onValueChange={handleFieldChange}>
              <SelectTrigger id="field">
                <SelectValue placeholder="Select a field..." />
              </SelectTrigger>
              <SelectContent>
                {ENRICHABLE_FIELDS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question to Ask</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What is the approximate budget for this company?"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              The AI will research each selected lead and try to answer this question.
            </p>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          {isProcessing && progress.total > 0 && (
            <div className="text-sm text-muted-foreground">
              Processing {progress.current} of {progress.total} leads...
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!field || !question || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Enrich Leads
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
