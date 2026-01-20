"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Info, Calculator, Route, Layers, Code } from "lucide-react"
import { getScoringRules, getRoutingTiers } from "@/lib/scoring"

const FULL_CODE_REFERENCE = `function autoScoreLead(lead) {
  let score = 0;

  // Budget scoring
  if (lead.budget > 50000) score += 50;
  else if (lead.budget > 20000) score += 30;
  else if (lead.budget > 5000) score += 15;
  else score += 5;

  // Industry scoring
  if (["Tech", "SaaS", "FinTech"].includes(lead.industry)) score += 30;
  else if (["Healthcare", "Finance"].includes(lead.industry)) score += 20;
  else if (["Retail", "E-commerce"].includes(lead.industry)) score += 15;
  else score += 5;

  // Location scoring
  if (["PT", "UK", "DE", "FR", "ES"].includes(lead.country)) score += 20;
  else if (["US", "CA"].includes(lead.country)) score += 15;
  else score += 5;

  // Source scoring
  const sourceScores = {
    "Referral": 25,
    "Inbound": 20,
    "LinkedIn": 15,
    "Cold": 10,
    "Event": 20
  };
  score += sourceScores[lead.source] || 0;

  // Quality signals
  if (lead.website) score += 10;
  if (lead.instagramFollowers > 1000) score += 10;
  if (lead.rating > 4.0) score += 10;
  if (lead.hasEngagementHistory) score += 5;

  // Recency
  if (lead.lastContactedDaysAgo < 7) score += 10;

  return Math.min(score, 145); // Cap at max
}

function assignRepByScore(lead, teamMembers) {
  const score = autoScoreLead(lead);
  
  let tier, repType;
  if (score >= 90) {
    tier = "HIGH";
    repType = "Senior";
  } else if (score >= 60) {
    tier = "QUALIFIED";
    repType = "Mid-level";
  } else if (score >= 30) {
    tier = "WARM";
    repType = "Junior";
  } else {
    tier = "LOW";
    repType = "Nurture";
  }

  // Round-robin: assign to rep with lowest current load in tier
  const availableReps = teamMembers.filter(r => r.role === repType && r.capacity > 0);
  const assignedRep = availableReps.sort((a, b) => a.assignedLeadsCount - b.assignedLeadsCount)[0];

  return {
    score,
    tier,
    assignedTo: assignedRep?.name || "Unassigned",
    priority: tier === "HIGH" ? "ASAP" : tier === "QUALIFIED" ? "24h" : "48h"
  };
}`

export function AlgorithmInfoDialog() {
  const [open, setOpen] = useState(false)
  const scoringRules = getScoringRules()
  const routingTiers = getRoutingTiers()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          Further Information
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Lead Scoring & Auto-Routing Algorithm</DialogTitle>
          <DialogDescription>Comprehensive documentation of the scoring criteria and routing logic</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="scoring" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scoring" className="gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Scoring Rules</span>
              <span className="sm:hidden">Score</span>
            </TabsTrigger>
            <TabsTrigger value="routing" className="gap-2">
              <Route className="h-4 w-4" />
              <span className="hidden sm:inline">Routing Tiers</span>
              <span className="sm:hidden">Route</span>
            </TabsTrigger>
            <TabsTrigger value="algorithm" className="gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Algorithm</span>
              <span className="sm:hidden">Algo</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Code Reference</span>
              <span className="sm:hidden">Code</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4 pr-4">
            <TabsContent value="scoring" className="space-y-6 min-w-0">
              <div className="text-sm text-muted-foreground mb-4">
                Maximum possible score: <strong>145 points</strong>
              </div>

              {Object.entries(scoringRules).map(([key, category]) => (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <Badge variant="outline">Max: {category.maxPoints} pts</Badge>
                  </div>
                  <div className="grid gap-2">
                    {category.tiers.map((tier, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                        <span className="text-sm">{tier.label}</span>
                        <span className="font-mono text-sm font-medium">+{tier.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="routing" className="space-y-6 min-w-0">
              <div className="text-sm text-muted-foreground mb-4">
                Leads are automatically routed based on their score to the appropriate team tier.
              </div>

              <div className="space-y-4">
                {routingTiers.map((tier, idx) => (
                  <div key={idx} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            tier.tier === "HIGH"
                              ? "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                              : tier.tier === "QUALIFIED"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                : tier.tier === "WARM"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                          }
                        >
                          {tier.tier}
                        </Badge>
                        <span className="font-mono text-sm">{tier.scoreRange} pts</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          tier.priority === "ASAP"
                            ? "border-red-500 text-red-600"
                            : tier.priority === "24h"
                              ? "border-orange-500 text-orange-600"
                              : "border-slate-500 text-slate-600"
                        }
                      >
                        {tier.priority}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Assigned To:</span>
                        <span className="ml-2 font-medium">{tier.repType}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Response Time:</span>
                        <span className="ml-2 font-medium">{tier.responseTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="algorithm" className="space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">1. Score Calculation</h3>
                  <p className="text-sm text-muted-foreground">
                    Each lead is scored across 6 dimensions: Budget, Industry, Location, Source, Quality Signals, and
                    Recency. Points from each dimension are summed to produce a total score (max 145).
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">2. Tier Classification</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on the total score, leads are classified into one of 4 tiers: HIGH (90+), QUALIFIED (60-89),
                    WARM (30-59), or LOW (0-29). Each tier has an associated priority level.
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">3. Rep Assignment (Round-Robin)</h3>
                  <p className="text-sm text-muted-foreground">
                    Leads are assigned to sales reps matching their tier&apos;s required role type. Within each role,
                    the rep with the lowest current assignment count and available capacity receives the lead. This
                    ensures even distribution across the team.
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">4. Fallback Logic</h3>
                  <p className="text-sm text-muted-foreground">
                    If no reps of the target role have available capacity, leads are unassigned.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="min-w-0 overflow-hidden">
              <div className="rounded-lg bg-slate-950 dark:bg-slate-900 p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                  <code className="text-slate-100 block whitespace-pre-wrap break-words">{FULL_CODE_REFERENCE}</code>
                </pre>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
