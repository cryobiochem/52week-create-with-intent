"use client";

import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Rocket, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createCheckoutSession } from "@/app/actions/checkout";
import Loading from "./loading";

const defaultPlans = {
  starter: {
    name: "Starter",
    price: 29,
    originalPrice: 49,
    features: [
      "10 research papers/month",
      "Basic AI analysis",
      "Literature search",
      "Email support",
      "Community access",
    ],
  },
  pro: {
    name: "Pro",
    price: 99,
    originalPrice: 149,
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
  scale: {
    name: "Scale",
    price: 299,
    originalPrice: 399,
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
};

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState(defaultPlans);

  useEffect(() => {
    const saved = localStorage.getItem("launchSettings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.pricing) {
          const updatedPlans = { ...defaultPlans };
          Object.keys(updatedPlans).forEach((key) => {
            const planKey = key as keyof typeof defaultPlans;
            if (settings.pricing[planKey]) {
              updatedPlans[planKey] = {
                ...updatedPlans[planKey],
                price: settings.pricing[planKey].launchPrice,
                originalPrice: settings.pricing[planKey].price,
              };
            }
          });
          setPlans(updatedPlans);
        }
      } catch (e) {
        console.error("Error loading pricing:", e);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent, planId: string, planPrice: number) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("productId", planId);
    formData.set("price", planPrice.toString());

    const result = await createCheckoutSession(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/20 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link 
          href="/" 
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to homepage
        </Link>

        <Suspense fallback={<Loading />}>
          <CheckoutContent email={email} setEmail={setEmail} error={error} loading={loading} handleSubmit={handleSubmit} plans={plans} />
        </Suspense>
      </div>
    </div>
  );
}

function CheckoutContent({ email, setEmail, error, loading, handleSubmit, plans }: any) {
  const searchParams = useSearchParams();
  const planId = (searchParams.get("plan") as keyof typeof plans) || "pro";
  const plan = plans[planId] || plans.pro;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>SciAI Assistant {plan.name}</CardTitle>
              <CardDescription>Monthly subscription</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-muted-foreground">/month</span>
            <Badge variant="secondary" className="ml-2">
              Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground line-through">
            Regular price: ${plan.originalPrice}/month
          </div>

          <div className="border-t border-border pt-6">
            <p className="mb-4 text-sm font-medium">What&apos;s included:</p>
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <Card>
        <CardHeader>
          <CardTitle>Complete your purchase</CardTitle>
          <CardDescription>
            Enter your email to proceed to secure checkout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, planId, plan.price)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                We&apos;ll send your receipt and login details here
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to checkout...
                </>
              ) : (
                `Subscribe for $${plan.price}/month`
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
              Cancel anytime. 30-day money-back guarantee.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
