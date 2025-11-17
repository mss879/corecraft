"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STAGES = ['New', 'Qualified', 'Proposal', 'Won', 'Lost'] as const;
const stageAccent: Record<(typeof STAGES)[number], string> = {
  New: '#ff8468',
  Qualified: '#ffb347',
  Proposal: '#ffd479',
  Won: '#85ffbd',
  Lost: '#7f8ea3',
};

interface Inquiry {
  id: string;
  created_at: string;
  name: string;
  company: string;
  email: string;
  message: string;
  converted_to_lead: boolean;
}

interface Lead {
  id: string;
  created_at: string;
  name: string;
  company: string;
  email: string;
  stage: (typeof STAGES)[number];
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'crm'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newLead, setNewLead] = useState({ name: '', company: '', email: '' });
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [addingLead, setAddingLead] = useState(false);
  const [selectedInquiryIds, setSelectedInquiryIds] = useState<Set<string>>(new Set());
  const [movingToCrm, setMovingToCrm] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);
  const pipelineContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function load() {
      const { data: inquiriesData } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      setInquiries((inquiriesData ?? []) as Inquiry[]);
      setLeads((leadsData ?? []) as Lead[]);
    }
    load();
  }, []);

  const selectedCount = selectedInquiryIds.size;
  const allSelectableIds = useMemo(
    () => inquiries.filter((inq) => !inq.converted_to_lead).map((inq) => inq.id),
    [inquiries]
  );

  function toggleSelect(id: string) {
    setSelectedInquiryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedInquiryIds((prev) => {
      if (prev.size === allSelectableIds.length) {
        return new Set();
      }
      return new Set(allSelectableIds);
    });
  }

  async function moveSelectedToCrm() {
    if (!selectedCount) return;
    setMovingToCrm(true);
    setMoveError(null);
    const itemsToMove = inquiries.filter((inq) => selectedInquiryIds.has(inq.id) && !inq.converted_to_lead);
    if (!itemsToMove.length) {
      setMovingToCrm(false);
      return;
    }

    const payload = itemsToMove.map((inq) => ({
      name: inq.name,
      company: inq.company,
      email: inq.email,
      stage: 'New' as const,
    }));

    const { data, error } = await supabase.from('leads').insert(payload).select();
    if (error) {
      setMoveError(error.message);
      setMovingToCrm(false);
      return;
    }

    await supabase
      .from('inquiries')
      .update({ converted_to_lead: true })
      .in('id', itemsToMove.map((inq) => inq.id));

    if (data) {
      setLeads((prev) => [...(data as Lead[]), ...prev]);
    }
    setInquiries((prev) =>
      prev.map((inq) =>
        selectedInquiryIds.has(inq.id)
          ? {
              ...inq,
              converted_to_lead: true,
            }
          : inq
      )
    );
    setSelectedInquiryIds(new Set());
    setMovingToCrm(false);
  }

  async function addLead() {
    if (!newLead.name) return;
    setAddingLead(true);
    const { data, error } = await supabase
      .from('leads')
      .insert({ ...newLead, stage: 'New' })
      .select()
      .single();
    setAddingLead(false);
    if (!error && data) {
      setLeads((prev) => [data as Lead, ...prev]);
      setNewLead({ name: '', company: '', email: '' });
      setIsAddLeadOpen(false);
    }
  }

  async function moveLead(id: string, stage: Lead['stage']) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
    await supabase.from('leads').update({ stage }).eq('id', id);
  }

  function onDragStart(e: React.DragEvent<HTMLDivElement>, id: string) {
    e.dataTransfer.setData('text/plain', id);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>, stage: Lead['stage']) {
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    moveLead(id, stage);
  }

  function allowDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  const handlePipelineDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const container = pipelineContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const threshold = Math.min(120, rect.width / 4);
    const deltaLeft = event.clientX - rect.left;
    const deltaRight = rect.right - event.clientX;

    if (deltaLeft < threshold) {
      container.scrollBy({ left: -20, behavior: 'smooth' });
    } else if (deltaRight < threshold) {
      container.scrollBy({ left: 20, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_40px_100px_-80px_rgba(0,0,0,0.9)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Operations overview</p>
            <h2 className="text-3xl font-semibold">CoreCraft Admin Dashboard</h2>
            <p className="text-sm text-white/60">
              Review website inquiries or glide deals across the CRM pipeline without leaving this surface.
            </p>
          </div>
          <Button
            className="h-11 rounded-full border border-white/20 bg-white/10 px-8 text-white hover:bg-white/20"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/admin';
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-[999px] border border-white/10 bg-white/5 p-2 text-sm">
        {[{ id: 'inquiries', label: 'Website inquiries' }, { id: 'crm', label: 'Simple CRM' }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'inquiries' | 'crm')}
            className={`rounded-full px-5 py-2 font-medium transition ${
              activeTab === tab.id
                ? 'bg-white text-black shadow'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'inquiries' && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Website inquiries</h3>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            <Checkbox
              checked={selectedInquiryIds.size > 0 && selectedInquiryIds.size === allSelectableIds.length}
              onCheckedChange={() => toggleSelectAll()}
              className="h-4 w-4 border-white/30 data-[state=checked]:bg-white"
              aria-label="Select all"
            />
            <span>{selectedCount} selected</span>
            <Button
              className="rounded-full bg-[#ff502e] px-4 py-2 text-xs font-semibold text-black hover:bg-[#ff6b49] disabled:bg-white/20 disabled:text-white/50"
              disabled={selectedCount === 0 || movingToCrm}
              onClick={moveSelectedToCrm}
            >
              {movingToCrm ? 'Moving…' : 'Move to CRM'}
            </Button>
            {moveError && <span className="text-xs text-red-300">{moveError}</span>}
          </div>
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/40">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th className="px-3 py-3 text-left">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Message</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-3 py-3 align-top">
                      <Checkbox
                        checked={selectedInquiryIds.has(inq.id)}
                        onCheckedChange={() => toggleSelect(inq.id)}
                        disabled={inq.converted_to_lead}
                        className="h-4 w-4 border-white/30 data-[state=checked]:bg-white disabled:opacity-30"
                        aria-label={`Select inquiry from ${inq.name}`}
                      />
                    </td>
                    <td className="px-4 py-3 align-top text-white/60">
                      {new Date(inq.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 align-top">{inq.name}</td>
                    <td className="px-4 py-3 align-top text-white/80">{inq.company || '—'}</td>
                    <td className="px-4 py-3 align-top text-[#ffb6a1]">{inq.email}</td>
                    <td className="px-4 py-3 align-top text-white/80 max-w-xl whitespace-pre-wrap">
                      {inq.message}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {inq.converted_to_lead ? (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                          In CRM
                        </span>
                      ) : (
                        <span className="text-xs text-white/50">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-white/50">
                      No inquiries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'crm' && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Simple CRM</h3>
                <p className="text-sm text-white/60">Keep the pipeline tidy and add fresh leads only when you need them.</p>
              </div>
              <Button
                className="h-12 rounded-2xl bg-[#ff502e] px-6 text-base font-semibold text-black hover:bg-[#ff6b49]"
                onClick={() => setIsAddLeadOpen(true)}
              >
                Add lead
              </Button>
            </div>
          </div>

          <Dialog open={isAddLeadOpen} onOpenChange={(open) => setIsAddLeadOpen(open)}>
            <DialogContent className="border-white/10 bg-[#050505] text-white sm:rounded-3xl">
              <DialogHeader>
                <DialogTitle>Add lead</DialogTitle>
                <DialogDescription className="text-white/60">
                  Capture the basics so you can track progress across the stages.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="lead-name" className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    Name
                  </label>
                  <Input
                    id="lead-name"
                    placeholder="Lead name"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="lead-company" className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    Company
                  </label>
                  <Input
                    id="lead-company"
                    placeholder="Optional"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="lead-email" className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    Email
                  </label>
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="name@company.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  className="text-white"
                  onClick={() => setIsAddLeadOpen(false)}
                  disabled={addingLead}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#ff502e] px-6 text-black hover:bg-[#ff6b49]"
                  onClick={addLead}
                  disabled={addingLead || !newLead.name}
                >
                  {addingLead ? 'Saving…' : 'Add lead'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div
            ref={pipelineContainerRef}
            className="hide-scrollbar flex gap-5 overflow-x-auto pb-2"
            onDragOver={handlePipelineDragOver}
          >
            {STAGES.map((stage) => (
              <div
                key={stage}
                className="flex min-w-[260px] flex-1 flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:min-w-[300px]"
                onDrop={(e) => onDrop(e, stage)}
                onDragOver={allowDrop}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.35em] text-white/50">
                  <span>{stage}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px]"
                    style={{
                      backgroundColor: `${stageAccent[stage]}20`,
                      color: stageAccent[stage],
                    }}
                  >
                    {leads.filter((l) => l.stage === stage).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {leads
                    .filter((l) => l.stage === stage)
                    .map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, lead.id)}
                        className="cursor-move rounded-2xl border border-white/10 bg-black/60 p-4 text-sm shadow-[0_20px_40px_-40px_rgba(0,0,0,0.8)]"
                      >
                        <div className="flex items-center justify-between">
                          <p className="mr-3 text-base font-semibold uppercase leading-tight text-white break-words">
                            {lead.name}
                          </p>
                          <span className="text-[11px] text-white/40">{new Date(lead.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-1 text-white/70 text-sm leading-tight break-words">
                          {lead.company || 'Company TBD'}
                        </p>
                        <p className="text-white/60 text-xs break-words">{lead.email || 'No email provided'}</p>
                      </div>
                    ))}
                  {leads.filter((l) => l.stage === stage).length === 0 && (
                    <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-center text-xs text-white/40">
                      Drop leads here
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
