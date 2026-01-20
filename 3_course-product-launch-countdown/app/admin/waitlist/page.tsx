"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockSubscribers = [
  {
    id: 1,
    email: "researcher1@university.edu",
    name: "Dr. Sarah Chen",
    source: "twitter",
    converted: true,
    created_at: "2026-01-15T10:30:00Z",
  },
  {
    id: 2,
    email: "scientist@lab.com",
    name: "John Smith",
    source: "direct",
    converted: false,
    created_at: "2026-01-16T09:15:00Z",
  },
  {
    id: 3,
    email: "phd.student@college.edu",
    name: "Emily Rodriguez",
    source: "google",
    converted: false,
    created_at: "2026-01-17T14:45:00Z",
  },
  {
    id: 4,
    email: "professor@institute.org",
    name: "Prof. Michael Johnson",
    source: "linkedin",
    converted: true,
    created_at: "2026-01-18T11:20:00Z",
  },
  {
    id: 5,
    email: "analyst@research.com",
    name: "Lisa Wang",
    source: "referral",
    converted: false,
    created_at: "2026-01-18T16:30:00Z",
  },
];

export default function WaitlistPage() {
  const subscribers = mockSubscribers;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Waitlist</h1>
        <p className="text-muted-foreground">Manage your waitlist subscribers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subscribers</CardTitle>
          <CardDescription>
            {subscribers.length} total subscribers on the waitlist
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subscribers yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>{subscriber.name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{subscriber.source || "direct"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={subscriber.converted ? "default" : "outline"}>
                        {subscriber.converted ? "Converted" : "Waiting"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(subscriber.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
