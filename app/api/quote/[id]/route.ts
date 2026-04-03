/**
 * Quote PATCH API — Update quote fields (status, assignedTo, followUpDue, etc.)
 * PATCH /api/quote/[id]
 */

import { db } from '@/lib/orcbase';
import { z } from 'zod';

const UpdateSchema = z.object({
  status: z.string().optional(),
  assignedTo: z.string().nullable().optional(),
  followUpDue: z.string().nullable().optional(),
  leadPriority: z.string().optional(),
  recommendedAction: z.string().nullable().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: 'Invalid update data', details: parsed.error.flatten() }, { status: 400 });
    }

    const existing = await db.quotes.findUnique({ id });
    if (!existing) {
      return Response.json({ error: 'Quote not found' }, { status: 404 });
    }

    const updated = await db.quotes.update({ id }, parsed.data);
    return Response.json(updated);
  } catch (error) {
    console.error('[Quote PATCH] error:', error);
    return Response.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}
