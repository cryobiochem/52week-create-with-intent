"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight, Zap, Users, TrendingUp, BarChart3, Target, Clock } from "lucide-react"

interface HeroSectionProps {
  onGetStarted: () => void
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                :]
              </div>
              <span className="text-xl font-bold">Bruno's Lead Scoring & Auto-Routing</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={onGetStarted} className="gap-2">
                Start Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm">
            Intelligent Lead Management
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Score, Route & Convert
            <span className="text-primary block mt-2">Your Leads Automatically</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Transform your sales pipeline with AI-powered lead scoring across 8 dimensions. Automatically route
            high-value prospects to the right sales rep at the right time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={onGetStarted} className="gap-2 text-lg px-8">
              <Zap className="h-5 w-5" />
              Start Now
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-lg px-8 bg-transparent" onClick={onGetStarted}>
              View Demo
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 px-4">
          <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">8-Dimension Scoring</h3>
            <p className="text-muted-foreground text-sm">
              Score leads across Budget, Industry, Location, Source, Company Size, Quality, Engagement & Velocity.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">5-Tier Classification</h3>
            <p className="text-muted-foreground text-sm">
              From Enterprise (170+) to Nurture (0-49), each lead gets the right priority and SLA.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Round-Robin</h3>
            <p className="text-muted-foreground text-sm">
              Automatically assign leads to the right rep based on tier, capacity, and current workload.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">SLA Management</h3>
            <p className="text-muted-foreground text-sm">
              Enterprise leads get same-day response. Every tier has clear response time expectations.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-violet-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Google Sheets Sync</h3>
            <p className="text-muted-foreground text-sm">
              Connect your spreadsheet and sync leads with custom column mapping. One-click import.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-rose-500/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Real-time Dashboard</h3>
            <p className="text-muted-foreground text-sm">
              Filter, sort, and analyze your pipeline. Export to CSV anytime with full score breakdown.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Lead Scoring & Auto-Router MVP</p>
            <p className="text-sm text-muted-foreground">Built for modern sales teams</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
