"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AddLeadDialog } from "@/components/add-lead-dialog"
import { ImportLeadsDialog } from "@/components/import-leads-dialog"
import { GoogleSheetsSync } from "@/components/google-sheets-sync"
import { LeadsTable } from "@/components/leads-table"
import { TeamTable } from "@/components/team-table"
import { LeadsFilterPopover } from "@/components/leads-filter-popover"
import { StatsCards } from "@/components/stats-cards"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlgorithmInfoDialog } from "@/components/algorithm-info-dialog"
import { HeroSection } from "@/components/hero-section"
import { BucketManager } from "@/components/bucket-manager"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { RefreshCw, Download, Zap, Users, Trash2 } from "lucide-react"
import type { Lead, TeamMember, LeadBucket } from "@/lib/types"
import { routeAllLeads } from "@/lib/routing"
import { getScoreTier, getTierInfo } from "@/lib/scoring"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)

  const { data: leads = [], mutate: mutateLeads } = useSWR<Lead[]>("/api/leads", fetcher)
  const { data: teamMembers = [], mutate: mutateTeam } = useSWR<TeamMember[]>("/api/team", fetcher)
  const { data: buckets = [{ id: "all", name: "All Leads", color: "gray" }], mutate: mutateBuckets } = useSWR<
    LeadBucket[]
  >("/api/buckets", fetcher)

  const [scoreFilter, setScoreFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [repFilter, setRepFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedBucket, setSelectedBucket] = useState("all")

  const maxBudget = useMemo(() => {
    if (leads.length === 0) return 500000
    const max = Math.max(...leads.map((l) => l.budget))
    return Math.max(max, 500000)
  }, [leads])

  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, maxBudget])

  const sources = useMemo(() => {
    const uniqueSources = [...new Set(leads.map((l) => l.source))]
    return uniqueSources.filter(Boolean)
  }, [leads])

  const industries = useMemo(() => {
    const uniqueIndustries = [...new Set(leads.map((l) => l.industry))]
    return uniqueIndustries.filter(Boolean).sort()
  }, [leads])

  const bucketCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length }
    for (const bucket of buckets) {
      if (bucket.id !== "all") {
        counts[bucket.id] = leads.filter((l) => l.bucket === bucket.id).length
      }
    }
    return counts
  }, [leads, buckets])

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (selectedBucket !== "all" && lead.bucket !== selectedBucket) return false

      if (scoreFilter !== "all") {
        const tier = getScoreTier(lead.score)
        if (tier !== scoreFilter) return false
      }

      if (tierFilter !== "all") {
        const leadTier = lead.tier || getTierInfo(lead.score).tier
        if (leadTier !== tierFilter) return false
      }

      if (priorityFilter !== "all") {
        const leadPriority = lead.priority || getTierInfo(lead.score).priority
        if (leadPriority !== priorityFilter) return false
      }

      if (industryFilter !== "all" && lead.industry !== industryFilter) return false

      if (sourceFilter !== "all" && lead.source !== sourceFilter) return false

      if (repFilter === "unassigned" && lead.assignedTo !== null) return false
      if (repFilter !== "all" && repFilter !== "unassigned" && lead.assignedTo !== repFilter) return false

      if (lead.budget < budgetRange[0] || (budgetRange[1] < maxBudget && lead.budget > budgetRange[1])) return false

      return true
    })
  }, [
    leads,
    scoreFilter,
    sourceFilter,
    repFilter,
    tierFilter,
    priorityFilter,
    industryFilter,
    budgetRange,
    maxBudget,
    selectedBucket,
  ])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (scoreFilter !== "all") count++
    if (sourceFilter !== "all") count++
    if (repFilter !== "all") count++
    if (tierFilter !== "all") count++
    if (priorityFilter !== "all") count++
    if (industryFilter !== "all") count++
    if (budgetRange[0] > 0 || budgetRange[1] < maxBudget) count++
    return count
  }, [scoreFilter, sourceFilter, repFilter, tierFilter, priorityFilter, industryFilter, budgetRange, maxBudget])

  const handleAddLead = async (leadData: Omit<Lead, "id" | "score" | "assignedTo" | "createdAt">) => {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData),
    })
    mutateLeads()
  }

  const handleImportLeads = async (importedLeads: Array<Omit<Lead, "id" | "score" | "assignedTo" | "createdAt">>) => {
    await fetch("/api/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bulk-import", leads: importedLeads }),
    })
    mutateLeads()
  }

  const handleSyncLeads = async (syncedLeads: Array<Omit<Lead, "id" | "score" | "assignedTo" | "createdAt">>) => {
    await fetch("/api/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bulk-import", leads: syncedLeads }),
    })
    mutateLeads()
  }

  const handleUpdateLead = async (updatedLead: Lead) => {
    await fetch("/api/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-lead", lead: updatedLead }),
    })
    mutateLeads()
  }

  const handleDeleteLead = async (leadId: string) => {
    await fetch("/api/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-lead", leadId }),
    })
    mutateLeads()
  }

  const handleDeleteLeads = async (leadIds: string[]) => {
    await fetch("/api/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-leads", leadIds }),
    })
    mutateLeads()
  }

  const handleDeleteAllLeads = async () => {
    await fetch("/api/leads", {
      method: "DELETE",
    })
    mutateLeads()
  }

  const handleRescore = async () => {
    setIsProcessing(true)
    await fetch("/api/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rescore" }),
    })
    await mutateLeads()
    setIsProcessing(false)
  }

  const handleReroute = async () => {
    setIsProcessing(true)

    const currentLeads = await fetch("/api/leads").then((r) => r.json())
    const currentTeam = await fetch("/api/team").then((r) => r.json())

    const { leads: routedLeads, teamMembers: updatedTeam } = routeAllLeads(currentLeads, currentTeam)

    await Promise.all([
      fetch("/api/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-leads", leads: routedLeads }),
      }),
      fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-team", teamMembers: updatedTeam }),
      }),
    ])

    await Promise.all([mutateLeads(), mutateTeam()])
    setIsProcessing(false)
  }

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Company",
      "Phone",
      "Website",
      "Rating",
      "Instagram",
      "Status",
      "Bucket",
      "Location",
      "Industry",
      "Budget",
      "Source",
      "Company Size",
      "Score",
      "Tier",
      "Priority",
      "SLA",
      "Assigned To",
      "Rep Role",
    ]
    const rows = leads.map((lead) => {
      const rep = teamMembers.find((m) => m.id === lead.assignedTo)
      const bucket = buckets.find((b) => b.id === lead.bucket)
      return [
        lead.name,
        lead.email,
        lead.company,
        lead.phone || "",
        lead.website || "",
        lead.rating?.toString() || "",
        lead.instagram || "",
        lead.status || "",
        bucket?.name || "",
        lead.location,
        lead.industry,
        lead.budget.toString(),
        lead.source,
        lead.companySize || "Unknown",
        lead.score.toString(),
        lead.tier || "",
        lead.priority || "",
        lead.responseTime || "",
        rep?.name || "Unassigned",
        rep?.role || "",
      ]
    })

    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "leads-export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAllFilters = () => {
    setScoreFilter("all")
    setSourceFilter("all")
    setRepFilter("all")
    setTierFilter("all")
    setPriorityFilter("all")
    setIndustryFilter("all")
    setBudgetRange([0, maxBudget])
  }

  const handleAddTeamMember = async (member: Omit<TeamMember, "id" | "assignedLeads">) => {
    await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    })
    mutateTeam()
  }

  const handleUpdateTeamMember = async (member: TeamMember) => {
    await fetch("/api/team", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-member", member }),
    })
    mutateTeam()
  }

  const handleDeleteTeamMember = async (memberId: string) => {
    await fetch("/api/team", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete-member", memberId }),
    })
    mutateTeam()
  }

  const handleAddBucket = async (bucket: Omit<LeadBucket, "id">) => {
    await fetch("/api/buckets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bucket),
    })
    mutateBuckets()
  }

  const handleUpdateBucket = async (bucket: LeadBucket) => {
    await fetch("/api/buckets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", bucket }),
    })
    mutateBuckets()
  }

  const handleDeleteBucket = async (bucketId: string) => {
    await fetch("/api/buckets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", bucketId }),
    })
    if (selectedBucket === bucketId) {
      setSelectedBucket("all")
    }
    mutateBuckets()
  }

  const handleBulkMoveToBucket = async (leadIds: string[], bucketId: string) => {
    await fetch("/api/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bulk-move-bucket", leadIds, bucketId }),
    })
    mutateLeads()
  }

  if (!showDashboard) {
    return <HeroSection onGetStarted={() => setShowDashboard(true)} />
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                  :]
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Bruno&apos;s Inbound Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Manage, score, and route your inbound leads automatically</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <GoogleSheetsSync onSync={handleSyncLeads} />
                <ImportLeadsDialog onImport={handleImportLeads} />
                <AddLeadDialog onAddLead={handleAddLead} buckets={buckets} />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6 flex-1">
          <StatsCards leads={leads} teamMembers={teamMembers} />

          <Tabs defaultValue="leads" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="leads" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Leads
                </TabsTrigger>
                <TabsTrigger value="team" className="gap-2">
                  <Users className="h-4 w-4" />
                  Team
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRescore}
                      disabled={isProcessing || leads.length === 0}
                      className="bg-transparent"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
                      Re-score
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="font-semibold">Recalculate All Scores</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recalculates scores for all leads using the 8-dimension scoring algorithm (Budget, Industry,
                      Location, Source, Company Size, Quality, Engagement, Velocity). Use this after updating lead data
                      or scoring rules.
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReroute}
                      disabled={isProcessing || leads.length === 0}
                      className="bg-transparent"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
                      Re-route
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="font-semibold">Reassign All Leads</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Clears all current assignments and redistributes leads using round-robin routing. Higher-scoring
                      leads are processed first to ensure enterprise opportunities get the best reps. Respects team
                      capacity limits.
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  disabled={leads.length === 0}
                  className="bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={leads.length === 0}
                      className="bg-transparent text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete all {leads.length} leads?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. All leads will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAllLeads}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <TabsContent value="leads" className="space-y-4">
              <BucketManager
                buckets={buckets}
                selectedBucket={selectedBucket}
                onSelectBucket={setSelectedBucket}
                onAddBucket={handleAddBucket}
                onUpdateBucket={handleUpdateBucket}
                onDeleteBucket={handleDeleteBucket}
                bucketCounts={bucketCounts}
              />

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">
                        Leads {filteredLeads.length !== leads.length && `(${filteredLeads.length} of ${leads.length})`}
                      </CardTitle>
                      <LeadsFilterPopover
                        scoreFilter={scoreFilter}
                        sourceFilter={sourceFilter}
                        repFilter={repFilter}
                        tierFilter={tierFilter}
                        priorityFilter={priorityFilter}
                        industryFilter={industryFilter}
                        budgetRange={budgetRange}
                        maxBudget={maxBudget}
                        onScoreFilterChange={setScoreFilter}
                        onSourceFilterChange={setSourceFilter}
                        onRepFilterChange={setRepFilter}
                        onTierFilterChange={setTierFilter}
                        onPriorityFilterChange={setPriorityFilter}
                        onIndustryFilterChange={setIndustryFilter}
                        onBudgetRangeChange={setBudgetRange}
                        teamMembers={teamMembers}
                        sources={sources}
                        industries={industries}
                        onClearAll={clearAllFilters}
                        activeFilterCount={activeFilterCount}
                      />
                    </div>
                    <CardDescription className="hidden sm:block">Click any row to edit lead details</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <LeadsTable
                    leads={filteredLeads}
                    teamMembers={teamMembers}
                    buckets={buckets}
                    onUpdateLead={handleUpdateLead}
                    onDeleteLead={handleDeleteLead}
                    onDeleteLeads={handleDeleteLeads}
                    onBulkMoveToBucket={handleBulkMoveToBucket}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Members</CardTitle>
                  <CardDescription>
                    Sales representatives with their roles, capacity, weekly limits, and current assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamTable
                    teamMembers={teamMembers}
                    onAddMember={handleAddTeamMember}
                    onUpdateMember={handleUpdateTeamMember}
                    onDeleteMember={handleDeleteTeamMember}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t bg-background mt-auto py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              
              <AlgorithmInfoDialog>
                <button className="underline hover:text-foreground transition-colors">scoring algorithm</button>
              </AlgorithmInfoDialog>
            </p>
          </div>
        </footer>

        <AIChatWidget />
      </div>
    </TooltipProvider>
  )
}
