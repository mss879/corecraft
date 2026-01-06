"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

import type { ResumeFormFieldType, ResumeFormQuestion } from '@/components/resume-form/dynamic-resume-form';
import { DynamicResumeForm } from '@/components/resume-form/dynamic-resume-form';

type DbQuestion = ResumeFormQuestion & {
  id: string;
  created_at: string;
  updated_at: string;
};

const fieldTypes: { value: ResumeFormFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'checkbox_group', label: 'Checkbox group' },
  { value: 'radio', label: 'Radio' },
];

function slugifyKeyPart(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
}

function generateFieldKeyFromLabel(label: string) {
  const base = slugifyKeyPart(label) || 'question';
  const rand = Math.random().toString(36).slice(2, 8);
  return `q_${base}_${rand}`;
}

function optionsToText(options: unknown): string {
  if (!options) return '';
  if (Array.isArray(options)) return options.map(String).join('\n');
  return '';
}

function textToOptions(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

const emptyDraft = {
  label: '',
  field_type: 'text' as ResumeFormFieldType,
  required: false,
  optionsText: '',
  active: true,
};

export function ResumeFormTab() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<DbQuestion[]>([]);
  const dragIdRef = useRef<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ ...emptyDraft });

  async function reload() {
    setLoading(true);
    const { data, error } = await supabase
      .from('resume_form_questions')
      .select('*')
      .order('order_index', { ascending: true });
    setLoading(false);
    if (error) {
      console.error(error);
      toast.error('Failed to load resume form questions.');
      return;
    }
    setQuestions((data ?? []) as DbQuestion[]);
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previewQuestions = useMemo(() => {
    return questions.map((q) => ({
      id: q.id,
      field_key: q.field_key,
      label: q.label,
      field_type: q.field_type,
      required: q.required,
      options: q.options,
      order_index: q.order_index,
      active: q.active,
    }));
  }, [questions]);

  async function persistOrder(next: DbQuestion[]) {
    // Reindex so we keep stable gaps for future inserts.
    const reindexed = next.map((q, idx) => ({ ...q, order_index: (idx + 1) * 10 }));
    setQuestions(reindexed);

    // Persist updates (small list; keep it simple)
    for (const q of reindexed) {
      const { error } = await supabase
        .from('resume_form_questions')
        .update({ order_index: q.order_index })
        .eq('id', q.id);
      if (error) {
        console.error(error);
        toast.error('Failed to save order.');
        return;
      }
    }
    toast.success('Order updated.');
  }

  function moveQuestion(dragId: string, dropId: string) {
    if (dragId === dropId) return;
    const current = [...questions].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    const fromIndex = current.findIndex((q) => q.id === dragId);
    const toIndex = current.findIndex((q) => q.id === dropId);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...current];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    persistOrder(next);
  }

  function openAdd() {
    setEditingId(null);
    setDraft({ ...emptyDraft });
    setEditorOpen(true);
  }

  function openEdit(q: DbQuestion) {
    setEditingId(q.id);
    setDraft({
      label: q.label,
      field_type: q.field_type,
      required: q.required,
      optionsText: optionsToText(q.options),
      active: q.active,
    });
    setEditorOpen(true);
  }

  async function removeQuestion(q: DbQuestion) {
    const ok = confirm(`Delete question "${q.field_key}"?`);
    if (!ok) return;
    const { error } = await supabase.from('resume_form_questions').delete().eq('id', q.id);
    if (error) {
      console.error(error);
      toast.error('Failed to delete question.');
      return;
    }
    toast.success('Question deleted.');
    setQuestions((prev) => prev.filter((x) => x.id !== q.id));
  }

  async function save() {
    if (!draft.label.trim()) {
      toast.error('Label is required.');
      return;
    }

    if ((draft.field_type === 'checkbox_group' || draft.field_type === 'radio') && textToOptions(draft.optionsText).length === 0) {
      toast.error('Options are required for this field type.');
      return;
    }

    const existing = editingId ? questions.find((q) => q.id === editingId) : null;
    const fieldKey = editingId ? existing?.field_key : generateFieldKeyFromLabel(draft.label.trim());

    if (!fieldKey) {
      toast.error('Failed to generate a field key.');
      return;
    }

    const payload = {
      field_key: fieldKey,
      label: draft.label.trim(),
      field_type: draft.field_type,
      required: !!draft.required,
      options:
        draft.field_type === 'checkbox_group' || draft.field_type === 'radio'
          ? textToOptions(draft.optionsText)
          : null,
      order_index:
        editingId
          ? (existing?.order_index ?? 0)
          : Math.max(0, ...questions.map((q) => q.order_index ?? 0)) + 10,
      active: !!draft.active,
    };

    setSaving(true);
    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('resume_form_questions')
          .update(payload)
          .eq('id', editingId)
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setQuestions((prev) => prev.map((q) => (q.id === editingId ? (data as DbQuestion) : q)));
        }
        toast.success('Question updated.');
      } else {
        const { data, error } = await supabase
          .from('resume_form_questions')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setQuestions((prev) => [...prev, data as DbQuestion].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)));
        }
        toast.success('Question added.');
      }

      setEditorOpen(false);
      setEditingId(null);
      setDraft({ ...emptyDraft });
    } catch (e) {
      console.error(e);
      toast.error('Failed to save question. (Tip: if you added the same label twice very quickly, try again.)');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Resume Form</h3>
          <p className="text-sm text-white/60">
            Edit the questions shown in the Resume/LinkedIn get-started form.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="h-11 rounded-2xl bg-white/10 px-5 text-sm text-white hover:bg-white/20"
            onClick={reload}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </Button>
          <Button
            className="h-11 rounded-2xl bg-[#ff502e] px-5 text-sm font-semibold text-black hover:bg-[#ff6b49]"
            onClick={openAdd}
          >
            Add question
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40">
          <div className="border-b border-white/10 bg-white/5 px-5 py-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Questions</h4>
          </div>
          <ScrollArea className="h-[520px]">
            <div className="divide-y divide-white/5">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="px-5 py-4"
                  draggable
                  onDragStart={() => {
                    dragIdRef.current = q.id;
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={() => {
                    if (!dragIdRef.current) return;
                    moveQuestion(dragIdRef.current, q.id);
                    dragIdRef.current = null;
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-medium">{q.label}</span>
                        {!q.active && (
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">Hidden</span>
                        )}
                        {q.required && (
                          <span className="rounded-full bg-[#ff502e]/20 px-2 py-0.5 text-xs text-[#ffb6a1]">Required</span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-white/50">
                        <span className="text-white/60">Type:</span> {q.field_type} · <span className="text-white/60">Drag</span> to reorder
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 bg-white/10 text-xs text-white hover:bg-white/20"
                        onClick={() => openEdit(q)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-white/10 text-xs text-white hover:bg-white/20"
                        onClick={() => removeQuestion(q)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && questions.length === 0 && (
                <div className="px-5 py-10 text-center text-sm text-white/50">
                  No questions yet.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40">
          <div className="border-b border-white/10 bg-white/5 px-5 py-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Preview</h4>
          </div>
          <div className="p-5">
            <ScrollArea className="h-[520px] pr-4">
              <DynamicResumeForm
                questions={previewQuestions}
                showSubmit={false}
                disabled
                className="space-y-6"
              />
              <p className="mt-4 text-xs text-white/40">
                Preview is read-only here; the live website form will reflect these questions.
              </p>
            </ScrollArea>
          </div>
        </div>
      </div>

      <Dialog open={editorOpen} onOpenChange={(open) => setEditorOpen(open)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/10 bg-[#050505] text-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit question' : 'Add question'}</DialogTitle>
            <DialogDescription className="text-white/60">
              Questions you add here are saved to Supabase immediately. New/custom questions will be stored in submissions under <span className="text-white">extra_answers</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-white/80">Label</Label>
              <Textarea
                value={draft.label}
                onChange={(e) => setDraft((p) => ({ ...p, label: e.target.value }))}
                className="min-h-[80px] rounded-2xl border-white/10 bg-white/5 text-white"
                placeholder="Question text shown to users"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/80">Field type</Label>
                <Select
                  value={draft.field_type}
                  onValueChange={(v) => setDraft((p) => ({ ...p, field_type: v as ResumeFormFieldType }))}
                >
                  <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                Drag & drop questions in the list to change their order.
              </div>
            </div>

            {(draft.field_type === 'checkbox_group' || draft.field_type === 'radio') && (
              <div className="space-y-2">
                <Label className="text-white/80">Options (one per line)</Label>
                <Textarea
                  value={draft.optionsText}
                  onChange={(e) => setDraft((p) => ({ ...p, optionsText: e.target.value }))}
                  className="min-h-[90px] rounded-2xl border-white/10 bg-white/5 text-white"
                  placeholder="Option 1\nOption 2"
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Required</p>
                  <p className="text-xs text-white/50">User must answer</p>
                </div>
                <Switch checked={draft.required} onCheckedChange={(v) => setDraft((p) => ({ ...p, required: v }))} />
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-white/50">Show on website</p>
                </div>
                <Switch checked={draft.active} onCheckedChange={(v) => setDraft((p) => ({ ...p, active: v }))} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              className="text-white"
              onClick={() => setEditorOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#ff502e] px-6 text-black hover:bg-[#ff6b49]"
              onClick={save}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
