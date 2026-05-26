"use client";

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Eye, Trash, Trash2 } from 'lucide-react';

interface CareerInquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  target_markets: string;
  current_role: string;
  current_industry: string;
  target_roles: string;
  target_industries: string;
  career_objectives: string;
  career_goals: string;
  skills: string;
  education_certifications: string;
  message: string;
  service_interest: string;
  budget_range: string;
  linkedin_info_requested: boolean;
  referral_source: string;
  converted_to_lead: boolean;
}

interface CareersTabProps {
  inquiries: CareerInquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<CareerInquiry[]>>;
}

export function CareersTab({ inquiries, setInquiries }: CareersTabProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [movingToCrm, setMovingToCrm] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [viewingInquiry, setViewingInquiry] = useState<CareerInquiry | null>(null);

  async function deleteCareer(id: string) {
    if (!confirm('Are you sure you want to delete this career inquiry?')) return;
    try {
      const { error } = await supabase.from('career_inquiries').delete().eq('id', id);
      if (error) throw error;
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (viewingInquiry?.id === id) {
        setViewingInquiry(null);
      }
      toast.success('Career inquiry deleted successfully');
    } catch (error: any) {
      console.error('Error deleting career inquiry:', error);
      toast.error(error.message || 'Failed to delete career inquiry');
    }
  }

  async function deleteSelectedCareers() {
    if (selectedCount === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedCount} selected career inquiries?`)) return;
    try {
      const idsToDelete = Array.from(selectedIds);
      const { error } = await supabase.from('career_inquiries').delete().in('id', idsToDelete);
      if (error) throw error;
      setInquiries((prev) => prev.filter((inq) => !selectedIds.has(inq.id)));
      setSelectedIds(new Set());
      toast.success('Selected career inquiries deleted successfully');
    } catch (error: any) {
      console.error('Error deleting selected career inquiries:', error);
      toast.error(error.message || 'Failed to delete selected career inquiries');
    }
  }

  const activeInquiries = inquiries.filter(inq => !inq.converted_to_lead);
  const selectedCount = selectedIds.size;

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  }

  async function moveSelectedToCrm() {
    if (selectedCount === 0) return;
    setMovingToCrm(true);
    setMoveError(null);

    const selectedInquiries = inquiries.filter((i) => selectedIds.has(i.id));
    let errorCount = 0;

    for (const inq of selectedInquiries) {
      // 1. Insert into leads
      const { error: insertError } = await supabase.from('leads').insert({
        name: inq.name,
        company: inq.company,
        email: inq.email,
        phone: inq.phone,
        message: inq.message,
        stage: 'New',
        target_markets: inq.target_markets,
        current_role: inq.current_role,
        current_industry: inq.current_industry,
        target_roles: inq.target_roles,
        target_industries: inq.target_industries,
        career_objectives: inq.career_objectives,
        career_goals: inq.career_goals,
        skills: inq.skills,
        education_certifications: inq.education_certifications,
        service_interest: inq.service_interest,
        budget_range: inq.budget_range,
        linkedin_info_requested: inq.linkedin_info_requested,
        referral_source: inq.referral_source
      });

      if (insertError) {
        console.error('Error moving inquiry to CRM:', insertError);
        errorCount++;
        continue;
      }

      // 2. Mark as converted
      const { error: updateError } = await supabase
        .from('career_inquiries')
        .update({ converted_to_lead: true })
        .eq('id', inq.id);

      if (updateError) {
        console.error('Error updating inquiry status:', updateError);
      }
    }

    if (errorCount > 0) {
      setMoveError(`Failed to move ${errorCount} inquiries.`);
      toast.error(`Failed to move ${errorCount} inquiries.`);
    } else {
      toast.success(`Moved ${selectedCount} inquiries to CRM.`);
    }

    // Update local state
    setInquiries((prev) =>
      prev.map((inq) =>
        selectedIds.has(inq.id) && errorCount === 0
          ? { ...inq, converted_to_lead: true }
          : inq
      )
    );
    setSelectedIds(new Set());
    setMovingToCrm(false);
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
        <div>
          <h3 className="text-lg font-semibold">Career Inquiries</h3>
          <p className="text-sm text-white/60">
            Manage detailed resume and career development requests.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span>{selectedCount} selected</span>
          <Button
            className="rounded-full bg-[#ff502e] px-4 py-2 text-xs font-semibold text-black hover:bg-[#ff6b49] disabled:bg-white/20 disabled:text-white/50"
            disabled={selectedCount === 0 || movingToCrm}
            onClick={moveSelectedToCrm}
          >
            {movingToCrm ? 'Moving…' : 'Move to CRM'}
          </Button>
          <Button
            className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
            disabled={selectedCount === 0}
            onClick={deleteSelectedCareers}
          >
            Delete Selected
          </Button>
        </div>
      </div>
      {moveError && <span className="text-xs text-red-300">{moveError}</span>}

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/40">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-3 py-3 text-left">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Role / Industry</th>
              <th className="px-4 py-3 text-left">Services</th>
              <th className="px-4 py-3 text-left">Details</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeInquiries.map((inq) => (
              <tr key={inq.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-3 py-3 align-top">
                  <Checkbox
                    checked={selectedIds.has(inq.id)}
                    onCheckedChange={() => toggleSelect(inq.id)}
                    className="h-4 w-4 border-white/30 data-[state=checked]:bg-white disabled:opacity-30"
                  />
                </td>
                <td className="px-4 py-3 align-top text-white/60">
                  {new Date(inq.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="font-medium">{inq.name}</div>
                  <div className="text-xs text-white/50">{inq.email}</div>
                  <div className="text-xs text-white/50">{inq.phone}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="text-white/80">{inq.current_role || '—'}</div>
                  <div className="text-xs text-white/50">{inq.current_industry}</div>
                </td>
                <td className="px-4 py-3 align-top text-[#ffb6a1] max-w-[200px] truncate">
                  {inq.service_interest}
                </td>
                <td className="px-4 py-3 align-top text-white/80 max-w-xs">
                  <div className="line-clamp-3 whitespace-pre-wrap text-xs">
                    {inq.message}
                  </div>
                </td>
                <td className="px-4 py-3 align-top text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => setViewingInquiry(inq)}
                      className="h-8 bg-[#ff502e] text-xs text-white hover:bg-[#ff502e]/90"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/40 hover:text-red-400"
                      onClick={() => deleteCareer(inq.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {activeInquiries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-white/50">
                  No active career inquiries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!viewingInquiry} onOpenChange={(open) => !open && setViewingInquiry(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl border-white/10 bg-[#050505] text-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Career Inquiry Details</DialogTitle>
            <DialogDescription className="text-white/60">
              Submitted on {viewingInquiry && new Date(viewingInquiry.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          {viewingInquiry && (
            <>
              <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
                <div className="grid gap-6 py-4">
                  {/* Personal Info */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Personal Information</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs text-white/50">Name</label>
                        <div className="text-sm">{viewingInquiry.name}</div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">Email</label>
                        <div className="text-sm">{viewingInquiry.email}</div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">Phone Number</label>
                        <div className="text-sm">{viewingInquiry.phone || '—'}</div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">Company/Organization</label>
                        <div className="text-sm">{viewingInquiry.company || '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Current Status</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs text-white/50">Current Job Title/Position</label>
                        <div className="text-sm">{viewingInquiry.current_role || '—'}</div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">Industry/Sector</label>
                        <div className="text-sm">{viewingInquiry.current_industry || '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Target Goals */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Target Goals</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-white/50">Share us the target markets you would like your resume to be focused on. Explain your requirement briefly for our research.</label>
                        <div className="text-sm whitespace-pre-wrap mt-1">{viewingInquiry.target_markets || '—'}</div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs text-white/50">What job title(s) are you targeting?</label>
                          <div className="text-sm mt-1">{viewingInquiry.target_roles || '—'}</div>
                        </div>
                        <div>
                          <label className="text-xs text-white/50">Which industry or industries are you interested in?</label>
                          <div className="text-sm mt-1">{viewingInquiry.target_industries || '—'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Career Details */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Career Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-white/50">Can you provide a brief summary of your career objectives and key strengths?</label>
                        <div className="text-sm whitespace-pre-wrap mt-1">{viewingInquiry.career_objectives || '—'}</div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">What are your primary career goals for the next 3-5 years?</label>
                        <div className="text-sm whitespace-pre-wrap mt-1">{viewingInquiry.career_goals || '—'}</div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">What hard skills (technical skills) and soft skills (interpersonal skills) do you possess relevant to your target job?</label>
                        <div className="text-sm whitespace-pre-wrap mt-1">{viewingInquiry.skills || '—'}</div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">List any certifications, licenses, professional training, and your educational background.</label>
                        <div className="text-sm whitespace-pre-wrap mt-1">{viewingInquiry.education_certifications || '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Service Interest */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Service Interest</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="text-xs text-white/50">What specific services are you interested in?</label>
                        <div className="text-sm mt-1">{viewingInquiry.service_interest || '—'}</div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">Would you like more information about our LinkedIn optimization service?</label>
                        <div className="text-sm mt-1">{viewingInquiry.linkedin_info_requested ? 'Yes' : 'No'}</div>
                      </div>
                      <div>
                        <label className="text-xs text-white/50">How did you hear about Core Craft?</label>
                        <div className="text-sm mt-1">{viewingInquiry.referral_source || '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Additional Information</h4>
                    <label className="text-xs text-white/50">Do you have any additional information or specific requests for your resume?</label>
                    <div className="text-sm whitespace-pre-wrap mt-1">{viewingInquiry.message || '—'}</div>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="mt-4 border-t border-white/10 pt-4 flex justify-between items-center">
                <Button
                  variant="ghost"
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300 mr-auto"
                  onClick={() => deleteCareer(viewingInquiry.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Inquiry
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 bg-transparent text-white hover:bg-white/10"
                  onClick={() => setViewingInquiry(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
