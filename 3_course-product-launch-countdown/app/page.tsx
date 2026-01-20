"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Pricing } from "@/components/sections/pricing";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [launchDate, setLaunchDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  useEffect(() => {
    // Load launch date from localStorage
    const saved = localStorage.getItem("launchSettings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.launch_date) {
          setLaunchDate(new Date(settings.launch_date));
        }
      } catch (e) {
        console.error("Error loading launch date:", e);
      }
    }
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero launchDate={launchDate} />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
