/**
 * Insights Analytics API — Computes lead, customer, and business intelligence from real Quote data
 * GET /api/insights/analytics
 */

export const dynamic = 'force-dynamic';

import { db } from '@/lib/orcbase';

export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);

    const allQuotes = await db.quotes.findMany({ orderBy: { createdAt: 'desc' }, take: 500 });

    // ── Lead Insights ──────────────────────────────────────────────
    const scoreDistribution = [
      { range: '0-20', count: 0 },
      { range: '21-40', count: 0 },
      { range: '41-60', count: 0 },
      { range: '61-80', count: 0 },
      { range: '81-100', count: 0 },
    ];
    let totalScore = 0;
    let scoredCount = 0;

    for (const q of allQuotes) {
      if (q.leadScore != null) {
        scoredCount++;
        totalScore += q.leadScore;
        if (q.leadScore <= 20) scoreDistribution[0].count++;
        else if (q.leadScore <= 40) scoreDistribution[1].count++;
        else if (q.leadScore <= 60) scoreDistribution[2].count++;
        else if (q.leadScore <= 80) scoreDistribution[3].count++;
        else scoreDistribution[4].count++;
      }
    }

    const priorityBreakdown: Record<string, number> = {};
    for (const q of allQuotes) {
      const p = q.leadPriority ?? 'unscored';
      priorityBreakdown[p] = (priorityBreakdown[p] ?? 0) + 1;
    }

    const sourceBreakdown: Record<string, number> = {};
    for (const q of allQuotes) {
      const s = q.source ?? 'direct';
      sourceBreakdown[s] = (sourceBreakdown[s] ?? 0) + 1;
    }

    const topLeads = allQuotes
      .filter(q => q.leadScore != null)
      .sort((a, b) => (b.leadScore ?? 0) - (a.leadScore ?? 0))
      .slice(0, 5)
      .map(q => ({ name: q.name, email: q.email, score: q.leadScore, priority: q.leadPriority, value: q.estimatedValue }));

    // ── Customer Insights ──────────────────────────────────────────
    const customerMap = new Map<string, { count: number; totalValue: number; clv1: number; clv3: number; locations: Set<string>; sizes: string[] }>();
    for (const q of allQuotes) {
      const existing = customerMap.get(q.email);
      if (existing) {
        existing.count++;
        existing.totalValue += q.estimatedValue ?? 0;
        if (q.clvFirstYear) existing.clv1 = Math.max(existing.clv1, q.clvFirstYear);
        if (q.clvThreeYear) existing.clv3 = Math.max(existing.clv3, q.clvThreeYear);
        if (q.locationSlug) existing.locations.add(q.locationSlug);
        existing.sizes.push(q.propertySize);
      } else {
        customerMap.set(q.email, {
          count: 1,
          totalValue: q.estimatedValue ?? 0,
          clv1: q.clvFirstYear ?? 0,
          clv3: q.clvThreeYear ?? 0,
          locations: new Set(q.locationSlug ? [q.locationSlug] : []),
          sizes: [q.propertySize],
        });
      }
    }

    const customers = Array.from(customerMap.values());
    const repeatCustomers = customers.filter(c => c.count > 1).length;
    const avgClv1 = customers.length > 0 ? customers.reduce((s, c) => s + c.clv1, 0) / customers.length : 0;
    const avgClv3 = customers.length > 0 ? customers.reduce((s, c) => s + c.clv3, 0) / customers.length : 0;

    const sizeBreakdown: Record<string, number> = {};
    for (const q of allQuotes) {
      sizeBreakdown[q.propertySize] = (sizeBreakdown[q.propertySize] ?? 0) + 1;
    }

    const locationBreakdown: Record<string, number> = {};
    for (const q of allQuotes) {
      if (q.locationSlug) {
        locationBreakdown[q.locationSlug] = (locationBreakdown[q.locationSlug] ?? 0) + 1;
      }
    }

    // ── Business Intelligence ──────────────────────────────────────
    const mtdQuotes = allQuotes.filter(q => new Date(q.createdAt) >= monthStart);
    const lastMonthQuotes = allQuotes.filter(q => {
      const d = new Date(q.createdAt);
      return d >= lastMonthStart && d < monthStart;
    });
    const quarterQuotes = allQuotes.filter(q => new Date(q.createdAt) >= quarterStart);

    const mtdRevenue = mtdQuotes.reduce((s, q) => s + (q.estimatedValue ?? 0), 0);
    const lastMonthRevenue = lastMonthQuotes.reduce((s, q) => s + (q.estimatedValue ?? 0), 0);
    const quarterRevenue = quarterQuotes.reduce((s, q) => s + (q.estimatedValue ?? 0), 0);
    const avgQuoteValue = allQuotes.length > 0 ? allQuotes.reduce((s, q) => s + (q.estimatedValue ?? 0), 0) / allQuotes.length : 0;

    const statusBreakdown: Record<string, number> = {};
    for (const q of allQuotes) {
      statusBreakdown[q.status] = (statusBreakdown[q.status] ?? 0) + 1;
    }

    // Weekly velocity (last 8 weeks)
    const weeklyVelocity: Array<{ week: string; count: number; value: number }> = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      const weekQuotes = allQuotes.filter(q => {
        const d = new Date(q.createdAt);
        return d >= weekStart && d < weekEnd;
      });
      weeklyVelocity.push({
        week: `W-${i}`,
        count: weekQuotes.length,
        value: weekQuotes.reduce((s, q) => s + (q.estimatedValue ?? 0), 0),
      });
    }

    const promoUsage: Record<string, number> = {};
    for (const q of allQuotes) {
      if (q.promoCode) {
        promoUsage[q.promoCode] = (promoUsage[q.promoCode] ?? 0) + 1;
      }
    }

    const conversionRate = allQuotes.length > 0
      ? allQuotes.filter(q => ['invoiced', 'paid', 'won'].includes(q.status)).length / allQuotes.length
      : 0;

    return Response.json({
      leads: {
        scoreDistribution,
        avgScore: scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0,
        priorityBreakdown,
        sourceBreakdown,
        topLeads,
        totalLeads: allQuotes.length,
        hotLeads: priorityBreakdown['hot'] ?? 0,
      },
      customers: {
        totalUnique: customers.length,
        repeatCustomers,
        repeatRate: customers.length > 0 ? repeatCustomers / customers.length : 0,
        avgClv1: Math.round(avgClv1),
        avgClv3: Math.round(avgClv3),
        sizeBreakdown,
        locationBreakdown,
        topLocations: Object.entries(locationBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 8),
      },
      business: {
        mtdRevenue,
        lastMonthRevenue,
        quarterRevenue,
        avgQuoteValue: Math.round(avgQuoteValue),
        statusBreakdown,
        weeklyVelocity,
        promoUsage,
        conversionRate,
        totalQuotes: allQuotes.length,
        mtdQuotes: mtdQuotes.length,
      },
    });
  } catch (error) {
    console.error('[Insights Analytics] error:', error);
    return Response.json({
      leads: { scoreDistribution: [], avgScore: 0, priorityBreakdown: {}, sourceBreakdown: {}, topLeads: [], totalLeads: 0, hotLeads: 0 },
      customers: { totalUnique: 0, repeatCustomers: 0, repeatRate: 0, avgClv1: 0, avgClv3: 0, sizeBreakdown: {}, locationBreakdown: {}, topLocations: [] },
      business: { mtdRevenue: 0, lastMonthRevenue: 0, quarterRevenue: 0, avgQuoteValue: 0, statusBreakdown: {}, weeklyVelocity: [], promoUsage: {}, conversionRate: 0, totalQuotes: 0, mtdQuotes: 0 },
    });
  }
}
