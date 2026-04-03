'use client';

import { useState, useEffect } from 'react';
import { useSurfaceTab, SurfaceHeader } from '@growsz/arcorc-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { workspaceContext } from '@/data/workspaceContext';
import { CalendarDays, Truck, Users, Clock } from 'lucide-react';

const OPS_TABS = [
  { id: 'schedule', label: 'Schedule', color: '#f97316' },
  { id: 'dispatch', label: 'Dispatch' },
  { id: 'crews', label: 'Crews' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'timeline', label: 'Timeline' },
];

interface ScheduleQuote {
  id: string;
  name: string;
  email: string;
  services: string;
  address: string;
  status: string;
  estimatedValue: number | null;
  assignedTo: string | null;
  followUpDue: string | null;
  createdAt: string;
  leadPriority: string | null;
}

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useSurfaceTab('schedule', ['schedule', 'dispatch', 'crews', 'fleet', 'timeline'] as const);
  const { operationsConfig } = workspaceContext;
  const [quotes, setQuotes] = useState<ScheduleQuote[]>([]);

  useEffect(() => {
    fetch('/api/crm?view=quotes')
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setQuotes(data); })
      .catch(() => {});
  }, []);

  const scheduledJobs = quotes.filter(q => ['scheduled', 'quoted', 'contacted'].includes(q.status));
  const activeJobs = quotes.filter(q => q.status === 'quoted' || q.status === 'contacted');
  const completedJobs = quotes.filter(q => q.status === 'paid' || q.status === 'invoiced');

  // Group jobs by assigned crew
  const crewJobs = new Map<string, ScheduleQuote[]>();
  for (const crew of operationsConfig.crews) {
    crewJobs.set(crew.name, []);
  }
  crewJobs.set('Unassigned', []);
  for (const q of scheduledJobs) {
    const crewName = q.assignedTo ?? 'Unassigned';
    const list = crewJobs.get(crewName) ?? crewJobs.get('Unassigned')!;
    list.push(q);
  }

  // Build a real activity timeline from recent quotes
  const timeline = quotes
    .slice(0, 10)
    .map(q => {
      const time = new Date(q.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const typeMap: Record<string, string> = {
        pending: 'New lead',
        contacted: 'Follow-up',
        quoted: 'Quote sent',
        invoiced: 'Invoiced',
        paid: 'Payment received',
      };
      return {
        time,
        event: `${typeMap[q.status] ?? q.status} — ${q.name} (${q.services.split(',')[0]})`,
        type: q.status,
      };
    });

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-7rem)]">
      <SurfaceHeader
        title="OPERATIONS"
        titleColor="#f97316"
        tabs={OPS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab as (tabId: string) => void}
        rightContent={
          <span className="text-[10px] text-muted-foreground/50">
            {operationsConfig.crews.length} crews · {scheduledJobs.length} active jobs
          </span>
        }
      />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            {/* Summary stats */}
            <div className="grid gap-3 md:grid-cols-4">
              <Card>
                <CardContent className="p-3 flex items-center gap-3">
                  <CalendarDays size={16} className="text-orange-500" />
                  <div>
                    <div className="text-lg font-bold">{scheduledJobs.length}</div>
                    <div className="text-[10px] text-muted-foreground">Active Jobs</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-3">
                  <Users size={16} className="text-blue-500" />
                  <div>
                    <div className="text-lg font-bold">{operationsConfig.crews.length}</div>
                    <div className="text-[10px] text-muted-foreground">Crews</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-3">
                  <Clock size={16} className="text-amber-500" />
                  <div>
                    <div className="text-lg font-bold">{activeJobs.length}</div>
                    <div className="text-[10px] text-muted-foreground">Pending Dispatch</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-3">
                  <Truck size={16} className="text-green-500" />
                  <div>
                    <div className="text-lg font-bold">{completedJobs.length}</div>
                    <div className="text-[10px] text-muted-foreground">Completed</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schedule by crew */}
            <h2 className="text-lg font-semibold">Schedule by Crew</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from(crewJobs.entries()).map(([crewName, jobs]) => (
                <Card key={crewName}>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs flex items-center justify-between">
                      <span>{crewName}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">{jobs.length} jobs</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    {jobs.length === 0 ? (
                      <div className="text-[10px] text-muted-foreground/50 py-2">No jobs assigned</div>
                    ) : (
                      <div className="space-y-1.5">
                        {jobs.slice(0, 5).map(job => (
                          <div key={job.id} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
                            <div>
                              <div className="text-xs font-medium">{job.name}</div>
                              <div className="text-[10px] text-muted-foreground">{job.services.split(',')[0]}</div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {job.estimatedValue && (
                                <span className="text-[10px] font-medium">${job.estimatedValue.toFixed(0)}</span>
                              )}
                              {job.leadPriority && (
                                <span className={`rounded-full px-1 py-0.5 text-[8px] font-medium ${
                                  job.leadPriority === 'hot' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                  job.leadPriority === 'warm' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-muted text-muted-foreground'
                                }`}>{job.leadPriority}</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {jobs.length > 5 && (
                          <div className="text-[10px] text-muted-foreground">+{jobs.length - 5} more</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-xs text-muted-foreground/50 mt-2">
              Min gap: {operationsConfig.schedulingRules.minGapMinutes}min | Travel buffer: {operationsConfig.schedulingRules.travelBufferMinutes}min | Max daily: {operationsConfig.schedulingRules.maxDailyJobs}
            </div>
          </div>
        )}
        {activeTab === 'dispatch' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Dispatch Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {operationsConfig.crews.map(crew => {
                const jobs = crewJobs.get(crew.name) ?? [];
                return (
                  <Card key={crew.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${jobs.length > 0 ? 'bg-orange-500' : 'bg-green-500'}`} />
                        <span className="font-medium text-sm">{crew.name}</span>
                        <span className={`ml-auto text-[10px] ${jobs.length > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                          {jobs.length > 0 ? `${jobs.length} assigned` : 'Available'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">Members: {crew.members.join(', ')}</div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {crew.specialties.map(s => (
                          <span key={s} className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px]">{s.replace(/-/g, ' ')}</span>
                        ))}
                      </div>
                      {jobs.length > 0 && (
                        <div className="border-t border-border/50 pt-2 space-y-1">
                          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Current Jobs</div>
                          {jobs.slice(0, 3).map(job => (
                            <div key={job.id} className="text-xs flex items-center justify-between">
                              <span>{job.name} — {job.services.split(',')[0]}</span>
                              {job.estimatedValue && <span className="font-medium">${job.estimatedValue.toFixed(0)}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Unassigned jobs */}
            {(crewJobs.get('Unassigned')?.length ?? 0) > 0 && (
              <Card>
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-sm text-amber-500">Unassigned Jobs ({crewJobs.get('Unassigned')!.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  <div className="space-y-2">
                    {crewJobs.get('Unassigned')!.map(job => (
                      <div key={job.id} className="flex items-center justify-between text-sm py-1 border-b border-border/30 last:border-0">
                        <div>
                          <span className="font-medium">{job.name}</span>
                          <span className="text-muted-foreground"> — {job.services.split(',')[0]}</span>
                        </div>
                        <span className="text-xs font-medium">{job.estimatedValue ? `$${job.estimatedValue.toFixed(0)}` : '—'}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        {activeTab === 'crews' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Crew Management</h2>
            {operationsConfig.crews.map(crew => {
              const jobs = crewJobs.get(crew.name) ?? [];
              const crewRevenue = jobs.reduce((sum, j) => sum + (j.estimatedValue ?? 0), 0);
              return (
                <Card key={crew.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="font-medium text-sm">{crew.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{jobs.length} jobs</span>
                        {crewRevenue > 0 && <span className="text-xs font-medium">${crewRevenue.toLocaleString()}</span>}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Members: {crew.members.join(', ')}</div>
                    <div className="text-xs text-muted-foreground">Specialties: {crew.specialties.map(s => s.replace(/-/g, ' ')).join(', ')}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        {activeTab === 'fleet' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Fleet Management</h2>
            {/* Fleet inventory linked to crews */}
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { id: 'v-1', name: 'Ford F-250 #1', type: 'Truck', assignedCrew: 'Crew Alpha', year: 2023, status: 'active', mileage: '24,850', nextService: '28,000 mi' },
                { id: 'v-2', name: 'Ford F-250 #2', type: 'Truck', assignedCrew: 'Crew Beta', year: 2022, status: 'active', mileage: '38,120', nextService: '40,000 mi' },
                { id: 'v-3', name: 'Enclosed Trailer', type: 'Trailer', assignedCrew: 'Crew Alpha', year: 2021, status: 'active', mileage: '—', nextService: 'Annual inspection due' },
                { id: 'v-4', name: 'Open Equipment Trailer', type: 'Trailer', assignedCrew: 'Crew Beta', year: 2020, status: 'maintenance', mileage: '—', nextService: 'Tire replacement' },
              ].map(vehicle => {
                const crewJobs_ = crewJobs.get(vehicle.assignedCrew) ?? [];
                return (
                  <Card key={vehicle.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                          <Truck size={18} className={vehicle.status === 'active' ? 'text-green-500' : 'text-amber-500'} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{vehicle.name}</div>
                          <div className="text-[10px] text-muted-foreground">{vehicle.type} · {vehicle.year}</div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          vehicle.status === 'active' ? 'bg-green-500/15 text-green-500' : 'bg-amber-500/15 text-amber-500'
                        }`}>{vehicle.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-muted-foreground">Assigned: </span>
                          <span className="font-medium">{vehicle.assignedCrew}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mileage: </span>
                          <span className="font-medium">{vehicle.mileage}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Service: </span>
                          <span className="font-medium">{vehicle.nextService}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Active Jobs: </span>
                          <span className="font-medium">{crewJobs_.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Equipment inventory */}
            <h3 className="text-sm font-semibold mt-2">Equipment</h3>
            <div className="grid gap-2 md:grid-cols-3">
              {[
                { name: 'Commercial Mowers (3)', status: 'active', crew: 'Shared' },
                { name: 'String Trimmers (4)', status: 'active', crew: 'Shared' },
                { name: 'Leaf Blowers (3)', status: 'active', crew: 'Shared' },
                { name: 'Chainsaw Set', status: 'active', crew: 'Crew Beta' },
                { name: 'Aerator', status: 'active', crew: 'Crew Alpha' },
                { name: 'Snow Plow Attachment', status: 'seasonal', crew: 'Crew Alpha' },
              ].map(eq => (
                <Card key={eq.name}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{eq.name}</span>
                      <span className={`text-[9px] px-1 py-0.5 rounded ${
                        eq.status === 'active' ? 'bg-green-500/15 text-green-500' : 'bg-blue-500/15 text-blue-500'
                      }`}>{eq.status}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{eq.crew}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'timeline' && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Activity Timeline</h2>
            {timeline.length > 0 ? timeline.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50">
                <span className="text-xs text-muted-foreground/50 w-20 shrink-0">{entry.time}</span>
                <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                  entry.type === 'paid' ? 'bg-green-400' :
                  entry.type === 'invoiced' ? 'bg-blue-400' :
                  entry.type === 'quoted' ? 'bg-purple-400' :
                  'bg-orange-400'
                }`} />
                <span className="text-sm text-foreground/80">{entry.event}</span>
              </div>
            )) : (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No activity yet. Quotes will populate the timeline.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
