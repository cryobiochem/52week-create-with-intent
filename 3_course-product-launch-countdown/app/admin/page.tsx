"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, CreditCard, TrendingUp } from "lucide-react";

// Mock data for demo purposes
const stats = {
  waitlistCount: 1247,
  purchaseCount: 89,
  emailCount: 423,
  totalRevenue: 8811, // in dollars
};

const recentSignups = [
  { id: 1, email: "researcher1@university.edu", created_at: "2026-01-19T10:30:00Z" },
  { id: 2, email: "scientist@lab.com", created_at: "2026-01-19T09:15:00Z" },
  { id: 3, email: "phd.student@college.edu", created_at: "2026-01-19T08:45:00Z" },
  { id: 4, email: "professor@institute.org", created_at: "2026-01-18T22:30:00Z" },
  { id: 5, email: "analyst@research.com", created_at: "2026-01-18T20:10:00Z" },
];

export default function AdminDashboard() {

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your launch campaign</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Waitlist Signups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waitlistCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.purchaseCount}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.emailCount}</div>
            <p className="text-xs text-muted-foreground">Campaign emails</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Signups</CardTitle>
          <CardDescription>Latest waitlist subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          {recentSignups.length === 0 ? (
            <p className="text-sm text-muted-foreground">No signups yet</p>
          ) : (
            <div className="space-y-4">
              {recentSignups.map((signup) => (
                <div key={signup.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{signup.email}</p>
                    {signup.name && (
                      <p className="text-xs text-muted-foreground">{signup.name}</p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(signup.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
