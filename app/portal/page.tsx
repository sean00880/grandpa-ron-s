import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ClipboardList, CreditCard, CalendarDays, Sprout } from "lucide-react"

export const metadata = {
  title: "Customer Portal",
  description: "Track your quotes, payments, and scheduled services.",
}

/**
 * C2 Customer Portal — Section 23.
 *
 * Customer-facing dashboard with quote tracking, payment history,
 * service scheduling, and property audit history.
 *
 * Role: customer (C2). Read access to own data only.
 * Permissions governed by the same unified system (Section 23).
 */
export default function CustomerPortalPage() {
  // In production, this pulls customer data via auth session
  return (
    <div className="min-h-screen bg-background">
      {/* Portal Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Sprout className="h-6 w-6 text-green-600" />
            <div>
              <h1 className="text-lg font-semibold">Customer Portal</h1>
              <p className="text-xs text-muted-foreground">Grandpa Ron&apos;s Lawns &amp; Landscape</p>
            </div>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground">Track your quotes, payments, and services.</p>
        </div>

        {/* Portal Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                <CardTitle>My Quotes</CardTitle>
              </div>
              <CardDescription>View and track your quote requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                Enter your email to view your quotes.
              </div>
              <div className="mt-4">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                <button className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                  Look Up Quotes
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Payment History</CardTitle>
              </div>
              <CardDescription>View invoices and payment status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                Payment history will appear here once you have invoices.
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Payments are processed securely via Stripe.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Service Schedule</CardTitle>
              </div>
              <CardDescription>Upcoming and past service appointments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                No scheduled services yet.
              </div>
              <Link
                href="/quote"
                className="mt-3 inline-block text-sm text-primary hover:underline"
              >
                Request a new service quote →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Property Audits</CardTitle>
              </div>
              <CardDescription>AI-powered property assessments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                Previous AI property audits will appear here.
              </div>
              <Link
                href="/quote"
                className="mt-3 inline-block text-sm text-primary hover:underline"
              >
                Get a free AI property audit →
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
