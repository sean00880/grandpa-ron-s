import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, ClipboardList, DollarSign, Users, BarChart3, CreditCard } from "lucide-react"
import { db } from "@/lib/orcbase"
import Link from "next/link"

export const metadata = {
  title: "Mission Control",
}

/**
 * Dashboard Overview — Real Prisma data replacing mock values.
 * Section 22: Business/Lead/Customer insights.
 * Section 25: Intent-oriented Mission Control.
 */
export default async function DashboardPage() {
  // Real data from Prisma
  // Orcbase adapter — gracefully returns defaults when DB unavailable
  let pendingQuotes = 0, totalQuotes = 0, hotLeads = 0, monthlyRevenue = 0, uniqueCustomerCount = 0;
  let recentQuotes: Awaited<ReturnType<typeof db.quotes.findMany>> = [];

  try {
    [pendingQuotes, totalQuotes, hotLeads, recentQuotes] = await Promise.all([
      db.quotes.count({ where: { status: 'pending' } }),
      db.quotes.count(),
      db.quotes.count({ where: { leadPriority: 'hot' } }),
      db.quotes.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          services: true,
          locationSlug: true,
          status: true,
          leadPriority: true,
          leadScore: true,
          estimatedValue: true,
          createdAt: true,
        },
      }),
    ]);

    const revenueData = await db.quotes.aggregate({
      _sum: { estimatedValue: true },
      where: {
        status: { in: ['quoted', 'completed', 'invoiced', 'paid'] },
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    });
    monthlyRevenue = revenueData._sum?.estimatedValue ?? 0;

    const customers = await db.quotes.groupBy({
      by: ['email'],
      _count: true,
    });
    uniqueCustomerCount = customers.length;
  } catch {
    // DB unavailable — render with zeros (Orcbase adapter handles gracefully)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
          <p className="text-muted-foreground">
            Business intelligence powered by WebDevOS.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/insights"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Insights
          </Link>
          <Link
            href="/dashboard/crm"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium"
          >
            <Users className="h-3.5 w-3.5" />
            CRM
          </Link>
        </div>
      </div>

      {/* Stats Grid — Real data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingQuotes}</div>
            <p className="text-xs text-muted-foreground">
              {totalQuotes} total quotes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomerCount}</div>
            <p className="text-xs text-muted-foreground">
              unique by email
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (MTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              from quoted estimates
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotLeads}</div>
            <p className="text-xs text-muted-foreground">
              high-priority follow-ups
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quotes — Real Prisma data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
            <CardDescription>
              Latest quote requests from the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuotes.length > 0 ? (
                recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{quote.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {quote.services.split(',').slice(0, 2).join(', ')}
                        {quote.locationSlug ? ` — ${quote.locationSlug}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {quote.leadScore !== null && (
                        <span className="text-xs text-muted-foreground">
                          Score: {quote.leadScore}
                        </span>
                      )}
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        quote.leadPriority === 'hot'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : quote.leadPriority === 'warm'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-primary/10 text-primary'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No quotes yet. Share your quote page to get started.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions — Replace mock schedule with actionable cards */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and navigation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'View All Quotes', href: '/dashboard/crm', icon: ClipboardList },
                { label: 'Lead Insights', href: '/dashboard/insights', icon: BarChart3 },
                { label: 'Operations', href: '/dashboard/operations', icon: CalendarDays },
                { label: 'AI Property Audit', href: '/quote', icon: Users },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
                >
                  <action.icon className="h-4 w-4 text-muted-foreground" />
                  {action.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
