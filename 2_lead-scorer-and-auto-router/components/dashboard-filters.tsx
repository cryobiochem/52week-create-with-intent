"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TeamMember } from "@/lib/types"

interface DashboardFiltersProps {
  scoreFilter: string
  sourceFilter: string
  repFilter: string
  tierFilter: string
  priorityFilter: string
  industryFilter: string
  budgetMin: string
  budgetMax: string
  onScoreFilterChange: (value: string) => void
  onSourceFilterChange: (value: string) => void
  onRepFilterChange: (value: string) => void
  onTierFilterChange: (value: string) => void
  onPriorityFilterChange: (value: string) => void
  onIndustryFilterChange: (value: string) => void
  onBudgetMinChange: (value: string) => void
  onBudgetMaxChange: (value: string) => void
  teamMembers: TeamMember[]
  sources: string[]
  industries: string[]
}

export function DashboardFilters({
  scoreFilter,
  sourceFilter,
  repFilter,
  tierFilter,
  priorityFilter,
  industryFilter,
  budgetMin,
  budgetMax,
  onScoreFilterChange,
  onSourceFilterChange,
  onRepFilterChange,
  onTierFilterChange,
  onPriorityFilterChange,
  onIndustryFilterChange,
  onBudgetMinChange,
  onBudgetMaxChange,
  teamMembers,
  sources,
  industries,
}: DashboardFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-1.5">
        <Label className="text-sm text-muted-foreground">Tier</Label>
        <Select value={tierFilter} onValueChange={onTierFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All tiers" />
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
        <Label className="text-sm text-muted-foreground">Priority</Label>
        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All priorities" />
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

      <div className="space-y-1.5">
        <Label className="text-sm text-muted-foreground">Industry</Label>
        <Select value={industryFilter} onValueChange={onIndustryFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All industries" />
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
        <Label className="text-sm text-muted-foreground">Source</Label>
        <Select value={sourceFilter} onValueChange={onSourceFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All sources" />
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

      <div className="space-y-1.5">
        <Label className="text-sm text-muted-foreground">Assigned Rep</Label>
        <Select value={repFilter} onValueChange={onRepFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All reps" />
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
        <Label className="text-sm text-muted-foreground">Score Range</Label>
        <Select value={scoreFilter} onValueChange={onScoreFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All scores" />
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

      <div className="space-y-1.5">
        <Label className="text-sm text-muted-foreground">Budget Min ($)</Label>
        <Input
          type="number"
          placeholder="0"
          value={budgetMin}
          onChange={(e) => onBudgetMinChange(e.target.value)}
          min={0}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm text-muted-foreground">Budget Max ($)</Label>
        <Input
          type="number"
          placeholder="No limit"
          value={budgetMax}
          onChange={(e) => onBudgetMaxChange(e.target.value)}
          min={0}
        />
      </div>
    </div>
  )
}
