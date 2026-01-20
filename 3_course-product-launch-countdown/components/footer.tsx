import { Brain, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Admin Panel Section */}
        <div className="mb-10 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Admin Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your launch settings, emails, and waitlist
                </p>
              </div>
            </div>
            <Button asChild variant="default">
              <Link href="/admin">Access Admin Panel</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">SciAI Assistant</span>
          </div>
          
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SciAI Assistant. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
