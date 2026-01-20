"use client"

import type React from "react"
import { useState, useCallback } from "react"
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
import { Upload, FileSpreadsheet, AlertCircle, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

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

interface ImportLeadsDialogProps {
  onImport: (
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

export function ImportLeadsDialog({ onImport }: ImportLeadsDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"upload" | "mapping" | "preview">("upload")
  const [csvData, setCsvData] = useState<string>("")
  const [headers, setHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<string[][]>([])
  const [fieldMappings, setFieldMappings] = useState<FieldMappings>({
    name: "",
    email: "",
    company: "",
    location: "",
    industry: "",
    budget: "",
    source: "",
  })
  const [error, setError] = useState<string>("")

  const parseCSV = useCallback((text: string) => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) {
      setError("CSV must have a header row and at least one data row")
      return { headers: [], rows: [] }
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

    const parsedHeaders = parseLine(lines[0])
    const parsedRows = lines.slice(1).map(parseLine)

    setError("")
    return { headers: parsedHeaders, rows: parsedRows }
  }, [])

  const autoDetectMappings = (sourceHeaders: string[]): FieldMappings => {
    const mappings: FieldMappings = {
      name: "",
      email: "",
      company: "",
      location: "",
      industry: "",
      budget: "",
      source: "",
    }

    sourceHeaders.forEach((header) => {
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

    if (!mappings.company && !mappings.name) {
      const businessHeader = sourceHeaders.find((h) => h.toLowerCase() === "business")
      if (businessHeader) {
        mappings.company = businessHeader
      }
    }

    return mappings
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvData(text)
      const { headers: h, rows: r } = parseCSV(text)
      if (h.length > 0) {
        setHeaders(h)
        setRawRows(r)
        setFieldMappings(autoDetectMappings(h))
        setStep("mapping")
      }
    }
    reader.readAsText(file)
  }

  const handleTextChange = (text: string) => {
    setCsvData(text)
    if (text.trim()) {
      const { headers: h, rows: r } = parseCSV(text)
      if (h.length > 0) {
        setHeaders(h)
        setRawRows(r)
        setFieldMappings(autoDetectMappings(h))
      }
    }
  }

  const handleProceedToMapping = () => {
    if (headers.length > 0 && rawRows.length > 0) {
      setStep("mapping")
    }
  }

  const updateFieldMapping = (field: LeadFieldKey, csvColumn: string) => {
    setFieldMappings((prev) => ({
      ...prev,
      [field]: csvColumn,
    }))
  }

  const getColumnIndex = (headerName: string): number => {
    return headers.indexOf(headerName)
  }

  const getMappedLeads = () => {
    return rawRows.map((row) => {
      const lead: Record<string, string> = {
        name: "",
        email: "",
        company: "",
        location: "",
        industry: "",
        budget: "0",
        source: "",
      }

      Object.entries(fieldMappings).forEach(([field, csvColumn]) => {
        if (csvColumn) {
          const idx = getColumnIndex(csvColumn)
          if (idx >= 0) {
            lead[field] = row[idx] || ""
          }
        }
      })

      return lead
    })
  }

  const getPreviewLeads = () => {
    return getMappedLeads().slice(0, 5)
  }

  const validateMappings = () => {
    const requiredFields = LEAD_FIELDS.filter((f) => f.required).map((f) => f.key)
    const missingRequired = requiredFields.filter((f) => !fieldMappings[f])
    return missingRequired
  }

  const handleImport = () => {
    const mappedLeads = getMappedLeads()
    const formattedLeads = mappedLeads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      location: lead.location || "Unknown",
      industry: lead.industry || "Other",
      budget: Number(lead.budget.replace(/[^0-9.-]/g, "")) || 0,
      source: lead.source || "Import",
    }))

    onImport(formattedLeads)
    resetDialog()
  }

  const resetDialog = () => {
    setCsvData("")
    setHeaders([])
    setRawRows([])
    setFieldMappings({
      name: "",
      email: "",
      company: "",
      location: "",
      industry: "",
      budget: "",
      source: "",
    })
    setStep("upload")
    setError("")
    setOpen(false)
  }

  const missingRequired = validateMappings()

  const getSampleValue = (csvColumn: string): string => {
    if (!csvColumn) return ""
    const idx = getColumnIndex(csvColumn)
    if (idx < 0) return ""
    const value = rawRows[0]?.[idx] || ""
    return value.length > 30 ? value.slice(0, 30) + "..." : value
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) resetDialog()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {step === "upload" && "Import Leads from CSV"}
            {step === "mapping" && "Map Columns to Lead Fields"}
            {step === "preview" && "Preview Import"}
          </DialogTitle>
          <DialogDescription>
            {step === "upload" && "Upload a CSV file or paste CSV data from your Google Sheets export"}
            {step === "mapping" && "Choose which CSV column maps to each lead field"}
            {step === "preview" && `Review ${rawRows.length} leads before importing`}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 py-2">
          {["upload", "mapping", "preview"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : ["mapping", "preview"].indexOf(step) > i - 1
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {["mapping", "preview"].indexOf(step) > i ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < 2 && <div className="w-12 h-0.5 bg-muted" />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="csv-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileSpreadsheet className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">CSV file from Google Sheets</p>
                  </div>
                  <input id="csv-upload" type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or paste CSV data</span>
                </div>
              </div>

              <textarea
                className="w-full h-32 p-3 text-sm border rounded-md font-mono bg-background"
                placeholder="Business,Niche,Address,Website,Email,Contact,...&#10;TechCorp,Tech,123 Main St,techcorp.com,john@tech.com,John Doe,..."
                value={csvData}
                onChange={(e) => handleTextChange(e.target.value)}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {headers.length > 0 && !error && (
                <Alert>
                  <AlertDescription>
                    Found {headers.length} columns and {rawRows.length} rows
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === "mapping" && (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3 py-2">
                {LEAD_FIELDS.map((field) => (
                  <div key={field.key} className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                    <div className="w-[140px] shrink-0">
                      <Label className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Select
                        value={fieldMappings[field.key] || "none"}
                        onValueChange={(v) => updateFieldMapping(field.key, v === "none" ? "" : v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select CSV column..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-- Not mapped --</SelectItem>
                          {headers.map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldMappings[field.key] && (
                        <span className="text-xs text-muted-foreground mt-1 block truncate">
                          Sample: {getSampleValue(fieldMappings[field.key]) || "(empty)"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Step 3: Preview - Add horizontal scrolling for all columns */}
          {step === "preview" && (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 py-2">
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-muted">
                      <tr>
                        {LEAD_FIELDS.map((field) => (
                          <th key={field.key} className="px-3 py-2 text-left font-medium whitespace-nowrap">
                            {field.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getPreviewLeads().map((lead, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-3 py-2 whitespace-nowrap">{lead.name || "-"}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{lead.email || "-"}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{lead.company || "-"}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{lead.location || "-"}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{lead.industry || "-"}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{lead.budget || "-"}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{lead.source || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rawRows.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">Showing 5 of {rawRows.length} leads</p>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Validation warning */}
        {step === "mapping" && missingRequired.length > 0 && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Missing required fields: {missingRequired.join(", ")}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {step !== "upload" && (
            <Button type="button" variant="outline" onClick={() => setStep(step === "preview" ? "mapping" : "upload")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={resetDialog}>
            Cancel
          </Button>
          {step === "upload" && (
            <Button onClick={handleProceedToMapping} disabled={headers.length === 0 || !!error}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {step === "mapping" && (
            <Button onClick={() => setStep("preview")} disabled={missingRequired.length > 0}>
              Preview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {step === "preview" && (
            <Button onClick={handleImport}>
              Import {rawRows.length} Lead{rawRows.length !== 1 ? "s" : ""}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
