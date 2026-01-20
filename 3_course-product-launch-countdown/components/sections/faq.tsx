import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "When does LaunchPad launch?",
    answer: "We're launching in February 2026. Join the waitlist to get early access and be the first to know when we go live.",
  },
  {
    question: "What happens after I join the waitlist?",
    answer: "You'll receive a confirmation email immediately, followed by exclusive updates about our progress, early access opportunities, and launch-day pricing that won't be available to the public.",
  },
  {
    question: "Can I migrate my existing SaaS to LaunchPad?",
    answer: "Yes! We provide migration tools and dedicated support for teams moving from custom stacks or other platforms. Most migrations take less than a week.",
  },
  {
    question: "Is there a free tier?",
    answer: "We offer a 14-day free trial for all plans. During launch week, waitlist members get an extended 30-day trial to fully explore the platform.",
  },
  {
    question: "What tech stack does LaunchPad use?",
    answer: "LaunchPad is built on Next.js, React, TypeScript, and deploys to Vercel's edge network. You get full access to customize and extend everything.",
  },
  {
    question: "Do I need technical skills to use LaunchPad?",
    answer: "LaunchPad is designed for developers and technical founders. Basic knowledge of React and TypeScript is recommended to get the most out of the platform.",
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If LaunchPad isn't the right fit for your project, we'll refund you in full, no questions asked.",
  },
  {
    question: "How is support handled?",
    answer: "All plans include email support. Pro and Scale plans get priority response times, and Scale includes a dedicated Slack channel with our engineering team.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="px-4 py-20 md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about LaunchPad
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
