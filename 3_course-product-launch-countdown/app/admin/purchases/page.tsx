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

const mockPurchases = [
  {
    id: 1,
    email: "researcher1@university.edu",
    product_id: "pro",
    amount: 9900,
    status: "completed",
    created_at: "2026-01-18T10:30:00Z",
  },
  {
    id: 2,
    email: "professor@institute.org",
    product_id: "scale",
    amount: 29900,
    status: "completed",
    created_at: "2026-01-17T14:20:00Z",
  },
  {
    id: 3,
    email: "startup@tech.com",
    product_id: "starter",
    amount: 2900,
    status: "completed",
    created_at: "2026-01-16T09:15:00Z",
  },
  {
    id: 4,
    email: "team@research.org",
    product_id: "pro",
    amount: 9900,
    status: "completed",
    created_at: "2026-01-15T16:45:00Z",
  },
  {
    id: 5,
    email: "lab@university.edu",
    product_id: "scale",
    amount: 29900,
    status: "pending",
    created_at: "2026-01-19T08:30:00Z",
  },
];

export default function PurchasesPage() {
  const purchases = mockPurchases;
  const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Purchases</h1>
        <p className="text-muted-foreground">View all customer purchases</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / 100).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${purchases.length > 0 ? ((totalRevenue / purchases.length) / 100).toFixed(2) : "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Purchases</CardTitle>
          <CardDescription>
            {purchases.length} total purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <p className="text-sm text-muted-foreground">No purchases yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">{purchase.email}</TableCell>
                    <TableCell>{purchase.product_id || "Launch Access"}</TableCell>
                    <TableCell>${(purchase.amount / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                        {purchase.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(purchase.created_at).toLocaleDateString()}
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
