import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, DataSync",
    content: "LaunchPad cut our time to market by 3 months. The billing integration alone saved us weeks of development.",
    initials: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "CTO, Flowwise",
    content: "The best investment we made for our startup. Went from idea to paying customers in just 6 weeks.",
    initials: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "Solo Founder, TaskMaster",
    content: "As a solo founder, I couldn't afford to waste time on infrastructure. LaunchPad let me focus on my users.",
    initials: "ER",
  },
  {
    name: "Alex Kim",
    role: "Co-founder, MetricHub",
    content: "The analytics dashboard is incredible. We finally understand our users without building custom tooling.",
    initials: "AK",
  },
  {
    name: "Jordan Taylor",
    role: "Engineering Lead, CloudScale",
    content: "Migrated from a custom stack and our deployment time went from hours to minutes. Game changer.",
    initials: "JT",
  },
  {
    name: "Priya Patel",
    role: "CEO, InvoiceFlow",
    content: "The team management features are exactly what we needed to scale from 5 to 50 customers.",
    initials: "PP",
  },
];

export function Testimonials() {
  return (
    <section className="bg-secondary/30 px-4 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Loved by founders
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Join thousands of founders who shipped faster with LaunchPad
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="border-border/50 bg-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
