"use client";

import { useEffect, useMemo, useState } from 'react';
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

interface Testimonial {
  id: string;
  created_at: string;
  quote: string;
  name: string | null;
  role: string | null;
  avatar_url: string | null;
  rating: number;
  published: boolean;
}

export function TestimonialsTab() {
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const [form, setForm] = useState<Partial<Testimonial>>({
    quote: '',
    name: '',
    role: '',
    rating: 5,
    published: true,
  });

  const [creatingRequest, setCreatingRequest] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...testimonials].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [testimonials]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!mounted) return;
      if (!error) {
        setTestimonials((data ?? []) as Testimonial[]);
      }
      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  function openAdd() {
    setEditing(null);
    setForm({
      quote: '',
      name: '',
      role: '',
      rating: 5,
      published: true,
    });
    setIsEditorOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({
      quote: t.quote,
      name: t.name ?? '',
      role: t.role ?? '',
      rating: t.rating ?? 5,
      published: t.published ?? true,
    });
    setIsEditorOpen(true);
  }

  async function save() {
    const quote = String(form.quote ?? '').trim();
    if (!quote) return;

    setSaving(true);
    try {
      if (editing) {
        const payload = {
          quote,
          name: String(form.name ?? '').trim() || null,
          role: String(form.role ?? '').trim() || null,
          rating: Number(form.rating ?? 5),
          variant: 'accent',
          published: Boolean(form.published),
        };

        const { data, error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editing.id)
          .select()
          .single();

        if (error) throw error;
        setTestimonials((prev) => prev.map((t) => (t.id === editing.id ? (data as Testimonial) : t)));
      } else {
        const payload = {
          quote,
          name: String(form.name ?? '').trim() || null,
          role: String(form.role ?? '').trim() || null,
          rating: Number(form.rating ?? 5),
          variant: 'accent',
          published: Boolean(form.published),
        };

        const { data, error } = await supabase.from('testimonials').insert(payload).select().single();
        if (error) throw error;
        setTestimonials((prev) => [(data as Testimonial), ...prev]);
      }

      setIsEditorOpen(false);
      setEditing(null);
    } catch (err) {
      console.error('Error saving testimonial:', err);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  }

  async function togglePublished(t: Testimonial, next: boolean) {
    setTestimonials((prev) => prev.map((x) => (x.id === t.id ? { ...x, published: next } : x)));
    const { error } = await supabase.from('testimonials').update({ published: next }).eq('id', t.id);
    if (error) {
      setTestimonials((prev) => prev.map((x) => (x.id === t.id ? { ...x, published: t.published } : x)));
    }
  }

  async function askForTestimonial() {
    setCreatingRequest(true);
    try {
      const { data, error } = await supabase
        .from('testimonial_requests')
        .insert({})
        .select('token')
        .single();

      if (error) throw error;
      const token = (data as any)?.token as string;
      const url = `${window.location.origin}/testimonial?token=${encodeURIComponent(token)}`;
      setShareUrl(url);
    } catch (err) {
      console.error('Error creating testimonial request:', err);
    } finally {
      setCreatingRequest(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Testimonials</h3>
          <p className="text-sm text-white/60">Add, edit, and publish client testimonials. Use share links to collect new ones.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="h-11 rounded-full border border-white/20 bg-white/10 px-6 text-white hover:bg-white/20"
            onClick={askForTestimonial}
            disabled={creatingRequest}
          >
            {creatingRequest ? 'Creating…' : 'Ask for testimonial'}
          </Button>
          <Button
            className="h-11 rounded-full bg-[#ff502e] px-6 font-semibold text-black hover:bg-[#ff6b49]"
            onClick={openAdd}
          >
            Add testimonial
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/40">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Quote</th>
              <th className="px-4 py-3 text-left">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-white/50">Loading…</td>
              </tr>
            ) : (
              <>
                {sorted.map((t) => (
                  <tr key={t.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 align-top text-white/60">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 align-top text-white/80">
                      <div className="max-w-2xl space-y-2">
                        {(t.name || t.role) && (
                          <div className="text-xs text-white/60">
                            {t.name && <span className="font-medium text-white/80">{t.name}</span>}
                            {t.name && t.role && <span className="text-white/40"> · </span>}
                            {t.role && <span className="text-white/60">{t.role}</span>}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap text-xs line-clamp-3">{t.quote}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <Switch checked={t.published} onCheckedChange={(v) => togglePublished(t, Boolean(v))} />
                        <span className="text-xs text-white/60">{t.published ? 'Published' : 'Hidden'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="h-8 bg-white/10 text-xs text-white hover:bg-white/20"
                          onClick={() => openEdit(t)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 bg-[#ff502e] text-xs text-white hover:bg-[#ff502e]/90"
                          onClick={() => remove(t.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-white/50">No testimonials yet.</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isEditorOpen} onOpenChange={(open) => !open && setIsEditorOpen(false)}>
        <DialogContent className="max-w-2xl border-white/10 bg-[#050505] text-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{editing ? 'Edit testimonial' : 'Add testimonial'}</DialogTitle>
            <DialogDescription className="text-white/60">
              {editing ? 'Update the testimonial content and publishing status.' : 'Create a new testimonial entry.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label className="text-xs text-white/60">Quote</Label>
              <Textarea
                value={String(form.quote ?? '')}
                onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
                className="min-h-[120px] border-white/10 bg-black/40 text-white"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-xs text-white/60">Name (optional)</Label>
                <Input
                  value={String(form.name ?? '')}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="border-white/10 bg-black/40 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs text-white/60">Company (optional)</Label>
                <Input
                  value={String(form.role ?? '')}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  className="border-white/10 bg-black/40 text-white"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-white/60">Rating</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={Number(form.rating ?? 5)}
                onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                className="border-white/10 bg-black/40 text-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={Boolean(form.published)}
                onCheckedChange={(v) => setForm((p) => ({ ...p, published: Boolean(v) }))}
              />
              <span className="text-sm text-white/70">Published</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="h-11 rounded-full bg-[#ff502e] px-8 font-semibold text-black hover:bg-[#ff6b49]"
              onClick={save}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!shareUrl} onOpenChange={(open) => !open && setShareUrl(null)}>
        <DialogContent className="max-w-xl border-white/10 bg-[#050505] text-white sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Share testimonial link</DialogTitle>
            <DialogDescription className="text-white/60">Send this URL to your client so they can submit a testimonial.</DialogDescription>
          </DialogHeader>

          {shareUrl && (
            <div className="grid gap-3 py-2">
              <Input value={shareUrl} readOnly className="border-white/10 bg-black/40 text-white" />
              <Button
                className="h-11 rounded-full bg-[#ff502e] px-6 font-semibold text-black hover:bg-[#ff6b49]"
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl);
                }}
              >
                Copy link
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
