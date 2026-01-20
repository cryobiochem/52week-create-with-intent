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

const mockEmails = [
  {
    id: 1,
    recipient_email: "researcher1@university.edu",
    subject: "Welcome to SciAI Assistant!",
    status: "sent",
    opened: true,
    clicked: true,
    sent_at: "2026-01-18T10:00:00Z",
  },
  {
    id: 2,
    recipient_email: "professor@institute.org",
    subject: "Launch Week Special Offer",
    status: "sent",
    opened: true,
    clicked: false,
    sent_at: "2026-01-17T14:30:00Z",
  },
  {
    id: 3,
    recipient_email: "scientist@lab.com",
    subject: "Your AI Research Assistant Awaits",
    status: "sent",
    opened: false,
    clicked: false,
    sent_at: "2026-01-16T09:00:00Z",
  },
  {
    id: 4,
    recipient_email: "phd.student@college.edu",
    subject: "Early Access Invitation",
    status: "sent",
    opened: true,
    clicked: true,
    sent_at: "2026-01-15T11:15:00Z",
  },
  {
    id: 5,
    recipient_email: "analyst@research.com",
    subject: "Launch Countdown: 2 Days Left!",
    status: "pending",
    opened: false,
    clicked: false,
    sent_at: "2026-01-19T08:00:00Z",
  },
];

export default function EmailsPage() {
  const emails = mockEmails;

  const sentCount = emails.filter(e => e.status === "sent").length;
  const openedCount = emails.filter(e => e.opened).length;
  const clickedCount = emails.filter(e => e.clicked).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Email Logs</h1>
        <p className="text-muted-foreground">Track your email campaign performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Opened</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openedCount}</div>
            <p className="text-xs text-muted-foreground">
              {sentCount > 0 ? ((openedCount / sentCount) * 100).toFixed(1) : 0}% open rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clicked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clickedCount}</div>
            <p className="text-xs text-muted-foreground">
              {sentCount > 0 ? ((clickedCount / sentCount) * 100).toFixed(1) : 0}% click rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emails.filter(e => e.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email History</CardTitle>
          <CardDescription>
            {emails.length} total emails in the log
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emails.length === 0 ? (
            <p className="text-sm text-muted-foreground">No emails sent yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Opened</TableHead>
                  <TableHead>Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell className="font-medium">{email.recipient_email}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{email.subject}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{email.email_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={email.status === "sent" ? "default" : "outline"}>
                        {email.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {email.opened ? (
                        <Badge variant="default">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {email.sent_at ? new Date(email.sent_at).toLocaleDateString() : "-"}
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
