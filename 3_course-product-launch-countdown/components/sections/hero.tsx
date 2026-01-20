import { CountdownTimer } from "@/components/countdown-timer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Zap } from "lucide-react";
import Image from "next/image";

interface HeroProps {
  launchDate: Date;
}

export function Hero({ launchDate }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-24 md:pb-20 md:pt-32">
      {/* Artistic background with grid and gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute left-0 top-0 h-[600px] w-full bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
        <div className="absolute right-0 top-20 h-[400px] w-[600px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2 inline-flex">
              <Sparkles className="h-4 w-4" />
              Early Access Coming Soon
            </Badge>

            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Your Next
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Scientific AI Assistant
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-pretty text-base text-muted-foreground md:text-lg lg:mx-0">
              Accelerate your research with AI-powered analysis, automated literature reviews, and intelligent insights. 
              Transform months of work into days with cutting-edge machine learning.
            </p>

            <div className="mb-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">10x Faster Research</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Launching in
              </p>
              <CountdownTimer targetDate={launchDate} />
            </div>

            <div className="flex flex-col items-center gap-6 lg:items-start">
              <Button asChild className="h-12 px-8 text-base">
                <a href="#pricing">Get Started Now</a>
              </Button>
              <p className="text-sm text-muted-foreground">
                Join <span className="font-semibold text-foreground">1,200+</span> researchers already using SciAI
              </p>
            </div>
          </div>

          {/* Right Product Image */}
          <div className="relative">
            {/* Glowing effect behind image */}
            <div className="absolute inset-0 -z-10 scale-110 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />
            
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-4 shadow-2xl backdrop-blur-sm md:p-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src="/product-screen.jpg"
                  alt="Scientific AI Assistant Interface on iPad"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient for depth */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            </div>

            {/* Floating stats/badges */}
            <div className="absolute -left-4 top-1/4 rounded-lg border border-border bg-card/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            
            <div className="absolute -right-4 bottom-1/4 rounded-lg border border-border bg-card/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-accent">10x</div>
              <div className="text-xs text-muted-foreground">Faster</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
