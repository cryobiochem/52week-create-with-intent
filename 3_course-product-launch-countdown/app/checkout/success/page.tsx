import { handleCheckoutSuccess } from "@/app/actions/checkout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let email = "";
  if (sessionId) {
    const result = await handleCheckoutSuccess(sessionId);
    if (result.success && result.email) {
      email = result.email;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/20 px-4">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for subscribing to LaunchPad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {email && (
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to <strong>{email}</strong>
            </p>
          )}
          
          <div className="rounded-lg bg-secondary/50 p-4 text-left">
            <p className="mb-2 text-sm font-medium">What happens next?</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>1. Check your email for login credentials</li>
              <li>2. Access your dashboard to get started</li>
              <li>3. Follow our quick-start guide</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/">Back to Homepage</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
