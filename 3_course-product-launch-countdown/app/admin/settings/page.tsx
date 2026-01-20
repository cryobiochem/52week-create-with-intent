"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface LaunchSettings {
  launch_date: string;
  early_bird_discount: number;
  early_bird_end_date: string;
  waitlist_open: boolean;
  announcement_message: string;
  pricing: {
    starter: { price: number; launchPrice: number };
    pro: { price: number; launchPrice: number };
    scale: { price: number; launchPrice: number };
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<LaunchSettings>({
    launch_date: "",
    early_bird_discount: 30,
    early_bird_end_date: "",
    waitlist_open: true,
    announcement_message: "",
    pricing: {
      starter: { price: 49, launchPrice: 29 },
      pro: { price: 149, launchPrice: 99 },
      scale: { price: 399, launchPrice: 299 },
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem("launchSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure pricing exists
        setSettings({
          launch_date: parsed.launch_date || "",
          early_bird_discount: parsed.early_bird_discount || 30,
          early_bird_end_date: parsed.early_bird_end_date || "",
          waitlist_open: parsed.waitlist_open ?? true,
          announcement_message: parsed.announcement_message || "",
          pricing: {
            starter: parsed.pricing?.starter || { price: 49, launchPrice: 29 },
            pro: parsed.pricing?.pro || { price: 149, launchPrice: 99 },
            scale: parsed.pricing?.scale || { price: 399, launchPrice: 299 },
          },
        });
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
    setLoading(false);
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      // Save to localStorage
      localStorage.setItem("launchSettings", JSON.stringify(settings));
      setMessage("Settings saved successfully");
      
      // Trigger page reload to update countdown
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setMessage("Error saving settings");
      console.error(error);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your launch campaign</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Launch Configuration</CardTitle>
          <CardDescription>Set up your launch dates and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="launch_date">Launch Date</Label>
              <Input
                id="launch_date"
                type="date"
                value={settings.launch_date}
                onChange={(e) => setSettings(prev => ({ ...prev, launch_date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="early_bird_end">Early Bird End Date</Label>
              <Input
                id="early_bird_end"
                type="date"
                value={settings.early_bird_end_date}
                onChange={(e) => setSettings(prev => ({ ...prev, early_bird_end_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Early Bird Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max="100"
              value={settings.early_bird_discount}
              onChange={(e) => setSettings(prev => ({ ...prev, early_bird_discount: parseInt(e.target.value) || 0 }))}
              className="max-w-[200px]"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="waitlist_open"
              checked={settings.waitlist_open}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, waitlist_open: checked }))}
            />
            <Label htmlFor="waitlist_open">Waitlist Open</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Configuration</CardTitle>
          <CardDescription>Set pricing for each plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Starter Plan</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="starter_price">Original Price ($)</Label>
                <Input
                  id="starter_price"
                  type="number"
                  min="0"
                  value={settings.pricing.starter.price}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      starter: { ...prev.pricing.starter, price: parseInt(e.target.value) || 0 }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="starter_launch_price">Launch Price ($)</Label>
                <Input
                  id="starter_launch_price"
                  type="number"
                  min="0"
                  value={settings.pricing.starter.launchPrice}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      starter: { ...prev.pricing.starter, launchPrice: parseInt(e.target.value) || 0 }
                    }
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Pro Plan</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pro_price">Original Price ($)</Label>
                <Input
                  id="pro_price"
                  type="number"
                  min="0"
                  value={settings.pricing.pro.price}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      pro: { ...prev.pricing.pro, price: parseInt(e.target.value) || 0 }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pro_launch_price">Launch Price ($)</Label>
                <Input
                  id="pro_launch_price"
                  type="number"
                  min="0"
                  value={settings.pricing.pro.launchPrice}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      pro: { ...prev.pricing.pro, launchPrice: parseInt(e.target.value) || 0 }
                    }
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Scale Plan</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scale_price">Original Price ($)</Label>
                <Input
                  id="scale_price"
                  type="number"
                  min="0"
                  value={settings.pricing.scale.price}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      scale: { ...prev.pricing.scale, price: parseInt(e.target.value) || 0 }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scale_launch_price">Launch Price ($)</Label>
                <Input
                  id="scale_launch_price"
                  type="number"
                  min="0"
                  value={settings.pricing.scale.launchPrice}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    pricing: {
                      ...prev.pricing,
                      scale: { ...prev.pricing.scale, launchPrice: parseInt(e.target.value) || 0 }
                    }
                  }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Customize messaging</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="announcement">Announcement Message</Label>
            <Textarea
              id="announcement"
              placeholder="Special announcement to show on the landing page..."
              value={settings.announcement_message}
              onChange={(e) => setSettings(prev => ({ ...prev, announcement_message: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
            {message && (
              <p className={`text-sm ${message.includes("Error") ? "text-destructive" : "text-accent"}`}>
                {message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
