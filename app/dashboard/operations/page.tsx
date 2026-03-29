'use client';

import { useState } from 'react';
import { useSurfaceTab, SurfaceHeader } from '@growsz/arcorc-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { workspaceContext } from '@/data/workspaceContext';

const OPS_TABS = [
  { id: 'schedule', label: 'Schedule', color: '#f97316' },
  { id: 'dispatch', label: 'Dispatch' },
  { id: 'crews', label: 'Crews' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'timeline', label: 'Timeline' },
];

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useSurfaceTab('schedule', ['schedule', 'dispatch', 'crews', 'fleet', 'timeline'] as const);
  const { operationsConfig } = workspaceContext;

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      <SurfaceHeader
        title="OPERATIONS"
        titleColor="#f97316"
        tabs={OPS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rightContent={
          <span className="text-[10px] text-muted-foreground/50">
            {operationsConfig.crews.length} crews
          </span>
        }
      />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'crews' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Crew Management</h2>
            {operationsConfig.crews.map(crew => (
              <Card key={crew.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-medium text-sm">{crew.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Members: {crew.members.join(', ')}</div>
                  <div className="text-xs text-muted-foreground">Specialties: {crew.specialties.map(s => s.replace(/-/g, ' ')).join(', ')}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {activeTab === 'schedule' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Weekly Schedule</h2>
            <div className="grid grid-cols-5 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                <Card key={day}>
                  <CardHeader className="p-3 pb-1"><CardTitle className="text-xs">{day}</CardTitle></CardHeader>
                  <CardContent className="p-3 pt-0">
                    {operationsConfig.crews.map(crew => (
                      <div key={crew.id} className="text-[10px] text-muted-foreground py-0.5 border-b border-border/50 last:border-0">
                        <span className="font-medium">{crew.name}</span>
                        <div className="text-muted-foreground/50">{operationsConfig.schedulingRules.maxDailyJobs} jobs max</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-xs text-muted-foreground/50 mt-2">
              Min gap: {operationsConfig.schedulingRules.minGapMinutes}min | Travel buffer: {operationsConfig.schedulingRules.travelBufferMinutes}min
            </div>
          </div>
        )}
        {activeTab === 'dispatch' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Dispatch Board</h2>
            <div className="grid grid-cols-2 gap-3">
              {operationsConfig.crews.map(crew => (
                <Card key={crew.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-medium text-sm">{crew.name}</span>
                      <span className="ml-auto text-[10px] text-green-500">Available</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Members: {crew.members.join(', ')}</div>
                    <div className="mt-2 text-xs">
                      {crew.specialties.map(s => (
                        <span key={s} className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] mr-1 mb-1">{s.replace(/-/g, ' ')}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'fleet' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Fleet</h2>
            <div className="grid grid-cols-3 gap-3">
              {['Truck 1 — Mowing Crew', 'Truck 2 — Landscaping Crew', 'Trailer — Equipment'].map(v => (
                <Card key={v}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚛</span>
                      <div>
                        <div className="font-medium text-sm">{v}</div>
                        <div className="text-[10px] text-green-500">Active</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'timeline' && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Activity Timeline</h2>
            {[
              { time: '9:00 AM', event: 'Mowing crew dispatched to Upper Arlington', type: 'dispatch' },
              { time: '10:30 AM', event: 'Quote #2847 — mulching estimate sent', type: 'quote' },
              { time: '11:15 AM', event: 'Landscaping crew completed Pickerington job', type: 'complete' },
              { time: '1:00 PM', event: 'New lead — commercial property inquiry', type: 'lead' },
              { time: '2:30 PM', event: 'Snow removal crew pre-season check', type: 'maintenance' },
            ].map((entry, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground/50 w-16 shrink-0">{entry.time}</span>
                <span className="h-2 w-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <span className="text-sm text-foreground/80">{entry.event}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
