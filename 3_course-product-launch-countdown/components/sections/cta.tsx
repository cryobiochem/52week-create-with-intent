import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section id="waitlist" className="bg-primary px-4 py-20 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
          Ready to ship faster?
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-primary-foreground/80">
          Get started today with exclusive launch pricing. 
          Transform your research workflow with AI-powered analysis.
        </p>
        <div className="flex justify-center">
          <Button asChild className="h-12 px-8 text-base bg-background text-foreground hover:bg-background/90">
            <a href="#pricing">Get Started Now</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
