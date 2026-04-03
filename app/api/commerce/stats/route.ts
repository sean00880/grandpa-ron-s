/**
 * Commerce Stats API — Revenue metrics from real quote data
 * GET /api/commerce/stats
 */

export const dynamic = 'force-dynamic';

import { db } from '@/lib/orcbase';

export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allQuotes, mtdRevenue, paidCount, outstandingData] = await Promise.all([
      db.quotes.findMany({
        where: { status: { in: ['invoiced', 'paid', 'quoted'] } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      db.quotes.aggregate({
        _sum: { estimatedValue: true },
        where: {
          status: { in: ['paid'] },
          createdAt: { gte: monthStart },
        },
      }),
      db.quotes.count({ where: { status: 'paid' } }),
      db.quotes.aggregate({
        _sum: { estimatedValue: true },
        where: { status: { in: ['invoiced', 'quoted'] } },
      }),
    ]);

    return Response.json({
      mtdRevenue: mtdRevenue._sum?.estimatedValue ?? 0,
      outstanding: outstandingData._sum?.estimatedValue ?? 0,
      paidCount,
      invoices: allQuotes.map(q => ({
        id: q.id,
        customer: q.name,
        email: q.email,
        amount: q.estimatedValue ?? 0,
        status: q.status,
        date: q.createdAt,
        services: q.services,
      })),
    });
  } catch (error) {
    console.error('[Commerce] Stats error:', error);
    return Response.json({ mtdRevenue: 0, outstanding: 0, paidCount: 0, invoices: [] });
  }
}
