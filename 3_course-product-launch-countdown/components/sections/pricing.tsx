"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";

const defaultPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individual researchers",
    price: 49,
    launchPrice: 29,
    features: [
      "10 research papers/month",
      "Basic AI analysis",
      "Literature search",
      "Email support",
      "Community access",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For research teams and labs",
    price: 149,
    launchPrice: 99,
    popular: true,
    features: [
      "Unlimited research papers",
      "Advanced AI analysis",
      "Custom datasets",
      "Priority support",
      "API access",
      "Team collaboration (5 seats)",
      "Export to all formats",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    description: "For institutions and enterprises",
    price: 399,
    launchPrice: 299,
    features: [
      "Everything in Pro",
      "Enterprise AI models",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "Unlimited team seats",
      "White-label option",
    ],
  },
];

export function Pricing() {
  const [plans, setPlans] = useState(defaultPlans);

  useEffect(() => {
    // Load pricing from localStorage
    const saved = localStorage.getItem("launchSettings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.pricing) {
          setPlans(defaultPlans.map(plan => ({
            ...plan,
            price: settings.pricing[plan.id]?.price || plan.price,
            launchPrice: settings.pricing[plan.id]?.launchPrice || plan.launchPrice,
          })));
        }
      } catch (e) {
        console.error("Error loading pricing:", e);
      }
    }
  }, []);
  return (
    <section id="pricing" className="px-4 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4">
            Limited Time Offer
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Launch Week Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Join the waitlist to lock in our exclusive launch pricing. These rates will never be this low again.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">${plan.launchPrice}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      ${plan.price}/month
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Save {Math.round(((plan.price - plan.launchPrice) / plan.price) * 100)}%
                    </Badge>
                  </div>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link href={`/checkout?plan=${plan.id}`}>Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
