import { Badge } from "@/components/ui/badge"
import { getScoreTier, getTierInfo } from "@/lib/scoring"

interface ScoreBadgeProps {
  score: number
  showTier?: boolean
}

export function ScoreBadge({ score, showTier = false }: ScoreBadgeProps) {
  const tier = getScoreTier(score)
  const tierInfo = getTierInfo(score)

  const variants: Record<typeof tier, string> = {
    enterprise:
      "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800",
    high: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    qualified: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    warm: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    nurture:
      "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800",
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Badge className={`${variants[tier]} border`} variant="secondary">
        {score} pts
      </Badge>
      {showTier && <span className="text-xs text-muted-foreground">{tierInfo.tier}</span>}
    </div>
  )
}

export function TierBadge({ tier }: { tier: string }) {
  const tierColors: Record<string, string> = {
    ENTERPRISE: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    "HIGH VALUE": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    QUALIFIED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "WARM LEAD": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    NURTURE: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  }

  return (
    <Badge className={tierColors[tier] || "bg-muted"} variant="secondary">
      {tier}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  const priorityColors: Record<string, string> = {
    URGENT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    NORMAL: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    LOW: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  }

  return (
    <Badge className={priorityColors[priority] || "bg-muted"} variant="secondary">
      {priority}
    </Badge>
  )
}
