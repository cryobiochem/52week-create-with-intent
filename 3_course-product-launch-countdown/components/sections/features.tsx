import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  Shield, 
  BarChart3, 
  Code2, 
  Users, 
  Globe,
  CreditCard,
  Mail,
  Layers
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description: "Get your SaaS up and running in minutes, not weeks. Pre-built templates and one-click deployment.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Built-in authentication, role-based access, and SOC 2 compliance out of the box.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track MRR, churn, LTV, and all the metrics that matter with beautiful real-time dashboards.",
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    description: "Stripe integration with support for trials, upgrades, downgrades, and proration.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Multi-tenant architecture with team invites, permissions, and organization switching.",
  },
  {
    icon: Mail,
    title: "Email Sequences",
    description: "Automated onboarding, lifecycle emails, and transactional notifications.",
  },
  {
    icon: Code2,
    title: "API First",
    description: "Well-documented REST and GraphQL APIs with rate limiting and versioning.",
  },
  {
    icon: Globe,
    title: "Global Edge Network",
    description: "Deploy to 200+ locations worldwide for sub-50ms latency everywhere.",
  },
  {
    icon: Layers,
    title: "Extensible Architecture",
    description: "Plugin system and webhooks to integrate with your favorite tools.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to launch
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Stop piecing together dozens of tools. LaunchPad gives you the complete stack to ship faster.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:border-primary/20">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
