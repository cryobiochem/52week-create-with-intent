"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "@/app/actions/waitlist";
import { CheckCircle, Loader2 } from "lucide-react";

export function WaitlistForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const response = await joinWaitlist(formData);
      setResult(response);
    });
  }

  if (result?.success) {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-accent/20 p-4 text-accent-foreground">
        <CheckCircle className="h-5 w-5 shrink-0 text-accent" />
        <span className="font-medium">{result.message}</span>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="w-full max-w-md space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="h-12 flex-1 bg-card"
          disabled={isPending}
        />
        <Button type="submit" size="lg" className="h-12 px-8" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            "Join Waitlist"
          )}
        </Button>
      </div>
      {result?.error && (
        <p className="text-sm text-destructive">{result.error}</p>
      )}
      <p className="text-center text-xs text-muted-foreground sm:text-left">
        No spam, ever. Unsubscribe anytime.
      </p>
    </form>
  );
}
