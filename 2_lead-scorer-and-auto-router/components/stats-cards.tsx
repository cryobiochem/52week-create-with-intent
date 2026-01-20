import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, UserCheck, AlertCircle } from "lucide-react"
import type { Lead, TeamMember } from "@/lib/types"

interface StatsCardsProps {
  leads: Lead[]
  teamMembers: TeamMember[]
}

export function StatsCards({ leads, teamMembers }: StatsCardsProps) {
  const totalLeads = leads.length
  const avgScore = leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length) : 0
  const assignedLeads = leads.filter((l) => l.assignedTo).length
  const unassignedLeads = totalLeads - assignedLeads

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      description: "Leads in the system",
    },
    {
      title: "Average Score",
      value: avgScore,
      icon: TrendingUp,
      description: "Points average",
    },
    {
      title: "Assigned",
      value: assignedLeads,
      icon: UserCheck,
      description: "Leads with reps",
    },
    {
      title: "Unassigned",
      value: unassignedLeads,
      icon: AlertCircle,
      description: "Need routing",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
