"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import type { TeamMember } from "@/lib/types"

interface LeadsFilterPopoverProps {
  scoreFilter: string
  sourceFilter: string
  repFilter: string
  tierFilter: string
  priorityFilter: string
  industryFilter: string
  budgetRange: [number, number]
  maxBudget: number
  onScoreFilterChange: (value: string) => void
  onSourceFilterChange: (value: string) => void
  onRepFilterChange: (value: string) => void
  onTierFilterChange: (value: string) => void
  onPriorityFilterChange: (value: string) => void
  onIndustryFilterChange: (value: string) => void
  onBudgetRangeChange: (value: [number, number]) => void
  teamMembers: TeamMember[]
  sources: string[]
  industries: string[]
  onClearAll: () => void
  activeFilterCount: number
}

export function LeadsFilterPopover({
  scoreFilter,
  sourceFilter,
  repFilter,
  tierFilter,
  priorityFilter,
  industryFilter,
  budgetRange,
  maxBudget,
  onScoreFilterChange,
  onSourceFilterChange,
  onRepFilterChange,
  onTierFilterChange,
  onPriorityFilterChange,
  onIndustryFilterChange,
  onBudgetRangeChange,
  teamMembers,
  sources,
  industries,
  onClearAll,
  activeFilterCount,
}: LeadsFilterPopoverProps) {
  const [open, setOpen] = useState(false)

  const formatBudget = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
    return `$${value}`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filter Leads</h4>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8 px-2 text-xs">
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Tier</Label>
                <Select value={tierFilter} onValueChange={onTierFilterChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tiers</SelectItem>
                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    <SelectItem value="HIGH VALUE">High Value</SelectItem>
                    <SelectItem value="QUALIFIED">Qualified</SelectItem>
                    <SelectItem value="WARM LEAD">Warm Lead</SelectItem>
                    <SelectItem value="NURTURE">Nurture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Priority</Label>
                <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Industry</Label>
                <Select value={industryFilter} onValueChange={onIndustryFilterChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All industries</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Source</Label>
                <Select value={sourceFilter} onValueChange={onSourceFilterChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sources</SelectItem>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Assigned Rep</Label>
                <Select value={repFilter} onValueChange={onRepFilterChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All reps</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Score Range</Label>
                <Select value={scoreFilter} onValueChange={onScoreFilterChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All scores</SelectItem>
                    <SelectItem value="enterprise">170+ (Enterprise)</SelectItem>
                    <SelectItem value="high">130-169 (High Value)</SelectItem>
                    <SelectItem value="qualified">90-129 (Qualified)</SelectItem>
                    <SelectItem value="warm">50-89 (Warm Lead)</SelectItem>
                    <SelectItem value="nurture">0-49 (Nurture)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Range Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Budget Range</Label>
                <span className="text-xs text-muted-foreground">
                  {formatBudget(budgetRange[0])} -{" "}
                  {budgetRange[1] >= maxBudget ? "No limit" : formatBudget(budgetRange[1])}
                </span>
              </div>
              <Slider
                value={budgetRange}
                onValueChange={(value) => onBudgetRangeChange(value as [number, number])}
                max={maxBudget}
                min={0}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>{formatBudget(maxBudget)}</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
