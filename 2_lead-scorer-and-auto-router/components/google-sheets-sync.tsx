"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, RefreshCw, Link2, AlertCircle, Check, ArrowRight, Unlink } from "lucide-react"

const LEAD_FIELDS = [
  { key: "name", label: "Name", required: false },
  { key: "email", label: "Email", required: false },
  { key: "company", label: "Company", required: false },
  { key: "location", label: "Location", required: false },
  { key: "industry", label: "Industry", required: false },
  { key: "budget", label: "Budget", required: false },
  { key: "source", label: "Source", required: false },
] as const

type LeadFieldKey = (typeof LEAD_FIELDS)[number]["key"]

type FieldMappings = Record<LeadFieldKey, string>

interface SheetConfig {
  url: string
  sheetId: string
  headers: string[]
  mappings: FieldMappings
  lastSynced: Date | null
  rowCount: number
}

interface GoogleSheetsSyncProps {
  onSync: (
    leads: Array<{
      name: string
      email: string
      company: string
      location: string
      industry: string
      budget: number
      source: string
    }>,
  ) => void
}

export function GoogleSheetsSync({ onSync }: GoogleSheetsSyncProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"connect" | "mapping" | "ready">("connect")
  const [sheetUrl, setSheetUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState("")
  const [sheetConfig, setSheetConfig] = useState<SheetConfig | null>(null)

  const extractSheetId = (url: string): string | null => {
    const patterns = [/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/, /\/d\/([a-zA-Z0-9-_]+)/, /key=([a-zA-Z0-9-_]+)/]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const autoDetectMappings = (headers: string[]): FieldMappings => {
    const mappings: FieldMappings = {
      name: "",
      email: "",
      company: "",
      location: "",
      industry: "",
      budget: "",
      source: "",
    }

    headers.forEach((header) => {
      const lowerHeader = header.toLowerCase().trim()

      if ((lowerHeader.includes("name") || lowerHeader === "contact") && !mappings.name) {
        mappings.name = header
      } else if (lowerHeader.includes("email") && !mappings.email) {
        mappings.email = header
      } else if ((lowerHeader.includes("company") || lowerHeader === "business") && !mappings.company) {
        mappings.company = header
      } else if (
        (lowerHeader.includes("location") || lowerHeader.includes("address") || lowerHeader.includes("country")) &&
        !mappings.location
      ) {
        mappings.location = header
      } else if ((lowerHeader.includes("industry") || lowerHeader.includes("niche")) && !mappings.industry) {
        mappings.industry = header
      } else if (lowerHeader.includes("budget") && !mappings.budget) {
        mappings.budget = header
      } else if (
        (lowerHeader.includes("source") || lowerHeader === "url" || lowerHeader.includes("website")) &&
        !mappings.source
      ) {
        mappings.source = header
      }
    })

    // Fallback: if company is empty but business exists, use business
    if (!mappings.company && !mappings.name) {
      const businessHeader = headers.find((h) => h.toLowerCase() === "business")
      if (businessHeader) {
        mappings.company = businessHeader
      }
    }

    return mappings
  }

  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const handleConnect = async () => {
    setError("")
    const sheetId = extractSheetId(sheetUrl)

    if (!sheetId) {
      setError("Invalid Google Sheets URL. Please paste a valid sharing link.")
      return
    }

    setIsLoading(true)

    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`
      const response = await fetch(csvUrl)

      if (!response.ok) {
        throw new Error(
          "Could not access the spreadsheet. Make sure it's shared publicly or with 'Anyone with the link'.",
        )
      }

      const csvText = await response.text()

      const lines = csvText
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n")
        .filter((line) => line.trim().length > 0)

      if (lines.length < 1) {
        throw new Error("Spreadsheet appears to be empty")
      }

      const headers = parseLine(lines[0])

      const rowCount = Math.max(0, lines.length - 1)
      const mappings = autoDetectMappings(headers)

      setSheetConfig({
        url: sheetUrl,
        sheetId,
        headers,
        mappings,
        lastSynced: null,
        rowCount,
      })

      setStep("mapping")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to spreadsheet")
    } finally {
      setIsLoading(false)
    }
  }

  const updateFieldMapping = (field: LeadFieldKey, csvColumn: string) => {
    if (!sheetConfig) return
    setSheetConfig({
      ...sheetConfig,
      mappings: {
        ...sheetConfig.mappings,
        [field]: csvColumn,
      },
    })
  }

  const validateMappings = () => {
    if (!sheetConfig) return []
    return []
  }

  const handleSaveMapping = () => {
    if (!sheetConfig || validateMappings().length > 0) return
    setStep("ready")
  }

  const handleSync = async () => {
    if (!sheetConfig) return
    setIsSyncing(true)
    setError("")

    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetConfig.sheetId}/export?format=csv`
      const response = await fetch(csvUrl)

      if (!response.ok) {
        throw new Error("Could not access the spreadsheet")
      }

      const csvText = await response.text()
      const lines = csvText
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n")
        .filter((line) => line.trim().length > 0)

      if (lines.length < 2) {
        throw new Error("No data rows found in spreadsheet")
      }

      const headers = parseLine(lines[0])
      const rows = lines.slice(1).map(parseLine)

      const leads = rows.map((row) => {
        const lead: Record<string, string> = {
          name: "",
          email: "",
          company: "",
          location: "",
          industry: "",
          budget: "0",
          source: "",
        }

        Object.entries(sheetConfig.mappings).forEach(([field, csvColumn]) => {
          if (csvColumn) {
            const idx = headers.indexOf(csvColumn)
            if (idx >= 0) {
              lead[field] = row[idx] || ""
            }
          }
        })

        return lead
      })

      const formattedLeads = leads.map((lead) => ({
        name: lead.name,
        email: lead.email,
        company: lead.company,
        location: lead.location || "Unknown",
        industry: lead.industry || "Other",
        budget: Number(lead.budget.replace(/[^0-9.-]/g, "")) || 0,
        source: lead.source || "Google Sheets",
      }))

      onSync(formattedLeads)

      setSheetConfig({
        ...sheetConfig,
        lastSynced: new Date(),
        rowCount: rows.length,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync")
    } finally {
      setIsSyncing(false)
    }
  }

  const handleDisconnect = () => {
    setSheetConfig(null)
    setSheetUrl("")
    setStep("connect")
    setError("")
  }

  const missingRequired = validateMappings()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Sheet className="h-4 w-4" />
          {sheetConfig ? "Sheets Connected" : "Connect Sheets"}
          {sheetConfig && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0">
              {sheetConfig.rowCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sheet className="h-5 w-5" />
            {step === "connect" && "Connect Google Sheets"}
            {step === "mapping" && "Configure Column Mapping"}
            {step === "ready" && "Google Sheets Sync"}
          </DialogTitle>
          <DialogDescription>
            {step === "connect" && "Paste your Google Sheets URL to sync leads automatically"}
            {step === "mapping" && "Choose which CSV column maps to each lead field"}
            {step === "ready" && "Your spreadsheet is connected and ready to sync"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden py-4">
          {/* Step 1: Connect */}
          {step === "connect" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sheet-url">Google Sheets URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="sheet-url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleConnect} disabled={!sheetUrl || isLoading}>
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  Make sure your spreadsheet is shared with <strong>"Anyone with the link"</strong> can view.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === "mapping" && sheetConfig && (
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-3">
                {LEAD_FIELDS.map((field) => (
                  <div key={field.key} className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                    <div className="w-[140px] shrink-0">
                      <Label className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Select
                      value={sheetConfig.mappings[field.key] || "none"}
                      onValueChange={(v) => updateFieldMapping(field.key, v === "none" ? "" : v)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select CSV column..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- Not mapped --</SelectItem>
                        {sheetConfig.headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Step 3: Ready */}
          {step === "ready" && sheetConfig && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Connected Sheet</span>
                  <Badge variant="outline" className="gap-1">
                    <Check className="h-3 w-3" />
                    Connected
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{sheetConfig.url}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rows</span>
                  <span className="font-medium">{sheetConfig.rowCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Synced</span>
                  <span className="font-medium">
                    {sheetConfig.lastSynced ? sheetConfig.lastSynced.toLocaleTimeString() : "Never"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Mapped Fields</span>
                  <span className="font-medium">{Object.values(sheetConfig.mappings).filter(Boolean).length}</span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSync} disabled={isSyncing} className="flex-1">
                  {isSyncing ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Sync Now
                </Button>
                <Button variant="outline" onClick={() => setStep("mapping")}>
                  Edit Mapping
                </Button>
              </div>
            </div>
          )}
        </div>

        {step === "mapping" && missingRequired.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Missing required fields: {missingRequired.join(", ")}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step === "ready" && (
            <Button variant="ghost" onClick={handleDisconnect} className="gap-2 text-destructive">
              <Unlink className="h-4 w-4" />
              Disconnect
            </Button>
          )}
          {step === "mapping" && (
            <>
              <Button variant="outline" onClick={() => setStep("connect")}>
                Back
              </Button>
              <Button onClick={handleSaveMapping} disabled={missingRequired.length > 0}>
                Save Mapping
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
