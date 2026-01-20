"use client";

import { useState } from "react";
import { emailTemplates, renderEmailTemplate } from "@/lib/email-templates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const templateNames = {
  welcome: "Day 1: Welcome",
  problem: "Day 3: Problem Agitation",
  socialProof: "Day 5: Social Proof",
  launch: "Day 7: Launch",
  lastChance: "Day 8: Last Chance",
};

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof emailTemplates>("welcome");

  const template = emailTemplates[selectedTemplate];
  const rendered = renderEmailTemplate(template, {
    name: "John",
    checkout_url: "/checkout?plan=pro",
    unsubscribe_url: "#unsubscribe",
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="text-muted-foreground">Preview your 5-email launch sequence</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(emailTemplates) as Array<keyof typeof emailTemplates>).map((key) => (
          <Button
            key={key}
            variant={selectedTemplate === key ? "default" : "outline"}
            onClick={() => setSelectedTemplate(key)}
            size="sm"
          >
            {templateNames[key]}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Email Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Subject Line</p>
              <p className="font-medium">{rendered.subject}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preheader</p>
              <p className="text-sm">{rendered.preheader}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sequence Position</p>
              <Badge variant="secondary">{templateNames[selectedTemplate]}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tips</CardTitle>
            <CardDescription>Best practices for this email</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTemplate === "welcome" && (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Send immediately after signup</li>
                <li>Set expectations for what comes next</li>
                <li>Build anticipation for the launch</li>
              </ul>
            )}
            {selectedTemplate === "problem" && (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Highlight the pain points your audience faces</li>
                <li>Use specific numbers and statistics</li>
                <li>Make them feel understood</li>
              </ul>
            )}
            {selectedTemplate === "socialProof" && (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Use real testimonials with names and roles</li>
                <li>Include specific results when possible</li>
                <li>Variety of use cases builds credibility</li>
              </ul>
            )}
            {selectedTemplate === "launch" && (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Clear pricing with visible savings</li>
                <li>Strong call-to-action button</li>
                <li>Create urgency with deadline</li>
              </ul>
            )}
            {selectedTemplate === "lastChance" && (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Highest urgency messaging</li>
                <li>Recap key benefits quickly</li>
                <li>Make the deadline crystal clear</li>
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Preview</CardTitle>
          <CardDescription>How the email will look in inboxes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              srcDoc={rendered.body}
              className="h-[600px] w-full"
              title="Email Preview"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
