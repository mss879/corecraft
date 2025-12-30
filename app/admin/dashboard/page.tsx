"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

import { CareersTab } from './careers-tab';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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

interface Lead {
  id: string;
  created_at: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  stage: (typeof STAGES)[number];
  message?: string;
  service_interest?: string;
  budget_range?: string;
  target_markets?: string;
  current_role?: string;
  current_industry?: string;
  target_roles?: string;
  target_industries?: string;
  career_objectives?: string;
  career_goals?: string;
  skills?: string;
  education_certifications?: string;
  linkedin_info_requested?: boolean;
  referral_source?: string;
}

interface Blog {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  published: boolean;
  author: string;
}

interface Project {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  image_url: string;
  logo_url: string;
  image_position: string;
  achievements: { value: string; label: string }[];
  services: string[];
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'careers' | 'crm' | 'blogs' | 'projects'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [careerInquiries, setCareerInquiries] = useState<CareerInquiry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [newLead, setNewLead] = useState({ name: '', company: '', email: '' });
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [addingLead, setAddingLead] = useState(false);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  
  const [selectedInquiryIds, setSelectedInquiryIds] = useState<Set<string>>(new Set());
  const [movingToCrm, setMovingToCrm] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);
  const pipelineContainerRef = useRef<HTMLDivElement | null>(null);

  // Blog state
  const [isAddBlogOpen, setIsAddBlogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: false,
    author: ''
  });
  const [savingBlog, setSavingBlog] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Project state
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    slug: '',
    image_url: '',
    logo_url: '',
    image_position: 'center center',
    achievements: [],
    services: []
  });
  const [savingProject, setSavingProject] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: inquiriesData } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      const { data: careerData } = await supabase.from('career_inquiries').select('*').order('created_at', { ascending: false });
      const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      const { data: blogsData } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      
      setInquiries((inquiriesData ?? []) as Inquiry[]);
      setCareerInquiries((careerData ?? []) as CareerInquiry[]);
      setLeads((leadsData ?? []) as Lead[]);
      setBlogs((blogsData ?? []) as Blog[]);
      setProjects((projectsData ?? []) as Project[]);
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

  // Blog functions
  function openAddBlog() {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image_url: '',
      published: false,
      author: ''
    });
    setIsAddBlogOpen(true);
  }

  function openEditBlog(blog: Blog) {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      image_url: blog.image_url,
      published: blog.published,
      author: blog.author
    });
    setIsAddBlogOpen(true);
  }

  async function saveBlog() {
    if (!blogForm.title || !blogForm.slug) return;
    setSavingBlog(true);

    try {
      if (editingBlog) {
        const { data, error } = await supabase
          .from('blogs')
          .update(blogForm)
          .eq('id', editingBlog.id)
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          setBlogs(prev => prev.map(b => b.id === editingBlog.id ? (data as Blog) : b));
        }
      } else {
        const { data, error } = await supabase
          .from('blogs')
          .insert(blogForm)
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          setBlogs(prev => [data as Blog, ...prev]);
        }
      }
      setIsAddBlogOpen(false);
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setSavingBlog(false);
    }
  }

  async function deleteBlog(id: string) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
      
      setBlogForm({ ...blogForm, image_url: data.publicUrl });
    } catch (error) {
      alert('Error uploading image!');
      console.log(error);
    } finally {
      setUploading(false);
    }
  }

  // Project functions
  function openAddProject() {
    setEditingProject(null);
    setProjectForm({
      title: '',
      slug: '',
      image_url: '',
      logo_url: '',
      image_position: 'center center',
      achievements: [],
      services: []
    });
    setIsAddProjectOpen(true);
  }

  function openEditProject(project: Project) {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      slug: project.slug,
      image_url: project.image_url,
      logo_url: project.logo_url,
      image_position: project.image_position,
      achievements: project.achievements,
      services: project.services
    });
    setIsAddProjectOpen(true);
  }

  async function saveProject() {
    if (!projectForm.title || !projectForm.slug) return;
    setSavingProject(true);

    try {
      if (editingProject) {
        const { data, error } = await supabase
          .from('projects')
          .update(projectForm)
          .eq('id', editingProject.id)
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          setProjects(prev => prev.map(p => p.id === editingProject.id ? (data as Project) : p));
        }
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert(projectForm)
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          setProjects(prev => [data as Project, ...prev]);
        }
      }
      setIsAddProjectOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSavingProject(false);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_40px_100px_-80px_rgba(0,0,0,0.9)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Operations overview</p>
            <h2 className="text-3xl font-semibold">CoreCraft Admin Dashboard</h2>
            <p className="text-sm text-white/60">
              Review website inquiries, glide deals across the CRM pipeline, or manage your blog and projects.
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
        {[
          { id: 'inquiries', label: 'Website inquiries' }, 
          { id: 'careers', label: 'Career Inquiries' },
          { id: 'crm', label: 'Simple CRM' },
          { id: 'blogs', label: 'Blog Posts' },
          { id: 'projects', label: 'Projects' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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

      {activeTab === 'careers' && (
        <CareersTab inquiries={careerInquiries} setInquiries={setCareerInquiries} />
      )}

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
                        className="group relative cursor-move rounded-2xl border border-white/10 bg-black/60 p-4 text-sm shadow-[0_20px_40px_-40px_rgba(0,0,0,0.8)] hover:border-white/20"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          {lead.current_role ? (
                            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                              Career
                            </span>
                          ) : lead.message ? (
                            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-300">
                              Website
                            </span>
                          ) : (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/50">
                              Manual
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-white/40 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingLead(lead);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
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

          <Dialog open={!!viewingLead} onOpenChange={(open) => !open && setViewingLead(null)}>
            <DialogContent className="max-h-[90vh] max-w-3xl border-white/10 bg-[#050505] text-white sm:rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Lead Details</DialogTitle>
                <DialogDescription className="text-white/60">
                  {viewingLead?.current_role ? 'Career Inquiry' : 'Lead Information'} • Created on {viewingLead && new Date(viewingLead.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              {viewingLead && (
                <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                  <div className="grid gap-6 py-4">
                    {/* Basic Info */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Contact Information</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs text-white/50">Name</label>
                          <div className="text-sm">{viewingLead.name}</div>
                        </div>
                        <div>
                          <label className="text-xs text-white/50">Email</label>
                          <div className="text-sm">{viewingLead.email}</div>
                        </div>
                        <div>
                          <label className="text-xs text-white/50">Phone</label>
                          <div className="text-sm">{viewingLead.phone || '—'}</div>
                        </div>
                        <div>
                          <label className="text-xs text-white/50">Company</label>
                          <div className="text-sm">{viewingLead.company || '—'}</div>
                        </div>
                      </div>
                    </div>

                    {(viewingLead.current_role || viewingLead.target_markets || viewingLead.target_roles || viewingLead.skills) ? (
                      <>
                        {/* Career Specific Sections */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Current Status</h4>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="text-xs text-white/50">Current Role</label>
                              <div className="text-sm">{viewingLead.current_role || '—'}</div>
                            </div>
                            <div>
                              <label className="text-xs text-white/50">Industry</label>
                              <div className="text-sm">{viewingLead.current_industry || '—'}</div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Target Goals</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-white/50">Target Markets</label>
                              <div className="text-sm whitespace-pre-wrap mt-1">{viewingLead.target_markets || '—'}</div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="text-xs text-white/50">Target Roles</label>
                                <div className="text-sm mt-1">{viewingLead.target_roles || '—'}</div>
                              </div>
                              <div>
                                <label className="text-xs text-white/50">Target Industries</label>
                                <div className="text-sm mt-1">{viewingLead.target_industries || '—'}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Career Details</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-white/50">Objectives</label>
                              <div className="text-sm whitespace-pre-wrap mt-1">{viewingLead.career_objectives || '—'}</div>
                            </div>
                            <div>
                              <label className="text-xs text-white/50">Goals</label>
                              <div className="text-sm whitespace-pre-wrap mt-1">{viewingLead.career_goals || '—'}</div>
                            </div>
                            <div>
                              <label className="text-xs text-white/50">Skills</label>
                              <div className="text-sm whitespace-pre-wrap mt-1">{viewingLead.skills || '—'}</div>
                            </div>
                            <div>
                              <label className="text-xs text-white/50">Education</label>
                              <div className="text-sm whitespace-pre-wrap mt-1">{viewingLead.education_certifications || '—'}</div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}

                    {/* Additional Info / Message */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">
                        {viewingLead.current_role ? 'Additional Information' : 'Message'}
                      </h4>
                      <div className="text-sm whitespace-pre-wrap">{viewingLead.message || '—'}</div>
                    </div>

                    {/* Service Interest */}
                    {(viewingLead.service_interest || viewingLead.budget_range || viewingLead.linkedin_info_requested !== undefined) && (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#ff502e]">Service Details</h4>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {viewingLead.service_interest && (
                            <div className="sm:col-span-2">
                              <label className="text-xs text-white/50">Interested Services</label>
                              <div className="text-sm mt-1">{viewingLead.service_interest}</div>
                            </div>
                          )}
                          {viewingLead.budget_range && (
                            <div>
                              <label className="text-xs text-white/50">Budget Range</label>
                              <div className="text-sm mt-1">{viewingLead.budget_range}</div>
                            </div>
                          )}
                          {viewingLead.linkedin_info_requested !== undefined && (
                            <div>
                              <label className="text-xs text-white/50">LinkedIn Info Requested</label>
                              <div className="text-sm mt-1">{viewingLead.linkedin_info_requested ? 'Yes' : 'No'}</div>
                            </div>
                          )}
                          {viewingLead.referral_source && (
                            <div>
                              <label className="text-xs text-white/50">Source</label>
                              <div className="text-sm mt-1">{viewingLead.referral_source}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </DialogContent>
          </Dialog>
        </section>
      )}

      {activeTab === 'blogs' && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Blog Posts</h3>
                <p className="text-sm text-white/60">Manage your blog content and publications.</p>
              </div>
              <Button
                className="h-12 rounded-2xl bg-[#ff502e] px-6 text-base font-semibold text-black hover:bg-[#ff6b49]"
                onClick={openAddBlog}
              >
                New Post
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div key={blog.id} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10">
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${blog.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-white/40">{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
                <h4 className="mb-2 text-xl font-bold text-white">{blog.title}</h4>
                <p className="mb-4 line-clamp-2 text-sm text-white/60">{blog.excerpt}</p>
                <div className="mt-auto flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/10"
                    onClick={() => openEditBlog(blog)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/10 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => deleteBlog(blog.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
                <p className="text-white/40">No blog posts yet. Create your first one!</p>
              </div>
            )}
          </div>

          <Dialog open={isAddBlogOpen} onOpenChange={setIsAddBlogOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#050505] text-white sm:max-w-[800px] sm:rounded-3xl">
              <DialogHeader>
                <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'New Blog Post'}</DialogTitle>
                <DialogDescription className="text-white/60">
                  Create or edit your blog content.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    className="h-20 border-white/10 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <div className="bg-white text-black rounded-md overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={blogForm.content || ''}
                      onChange={(value) => setBlogForm({ ...blogForm, content: value })}
                      className="h-[300px] mb-12"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                          ['link', 'image'],
                          ['clean']
                        ],
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="image">Cover Image</Label>
                    <div className="flex flex-col gap-4">
                      {blogForm.image_url && (
                        <div className="relative h-40 w-full overflow-hidden rounded-lg border border-white/10">
                          <img 
                            src={blogForm.image_url} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={() => setBlogForm({ ...blogForm, image_url: '' })}
                            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="border-white/10 bg-white/5 text-white file:text-white"
                      />
                      {uploading && <p className="text-sm text-white/60">Uploading...</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={blogForm.published}
                    onCheckedChange={(checked) => setBlogForm({ ...blogForm, published: checked })}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  className="text-white"
                  onClick={() => setIsAddBlogOpen(false)}
                  disabled={savingBlog}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#ff502e] px-6 text-black hover:bg-[#ff6b49]"
                  onClick={saveBlog}
                  disabled={savingBlog || !blogForm.title}
                >
                  {savingBlog ? 'Saving…' : 'Save Post'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      )}

      {activeTab === 'projects' && (
        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Projects</h3>
                <p className="text-sm text-white/60">Manage your portfolio projects.</p>
              </div>
              <Button
                className="h-12 rounded-2xl bg-[#ff502e] px-6 text-base font-semibold text-black hover:bg-[#ff6b49]"
                onClick={openAddProject}
              >
                New Project
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs text-white/40">{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg">
                  <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
                </div>
                <h4 className="mb-2 text-xl font-bold text-white">{project.title}</h4>
                <div className="mt-auto flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/10"
                    onClick={() => openEditProject(project)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/10 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
                <p className="text-white/40">No projects yet. Create your first one!</p>
              </div>
            )}
          </div>

          <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#050505] text-white sm:max-w-[800px] sm:rounded-3xl">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'New Project'}</DialogTitle>
                <DialogDescription className="text-white/60">
                  Create or edit your project details.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="project-title">Title</Label>
                    <Input
                      id="project-title"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-slug">Slug</Label>
                    <Input
                      id="project-slug"
                      value={projectForm.slug}
                      onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="project-image">Image URL</Label>
                    <Input
                      id="project-image"
                      value={projectForm.image_url}
                      onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-logo">Logo URL</Label>
                    <Input
                      id="project-logo"
                      value={projectForm.logo_url}
                      onChange={(e) => setProjectForm({ ...projectForm, logo_url: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-position">Image Position (CSS)</Label>
                  <Input
                    id="project-position"
                    value={projectForm.image_position}
                    onChange={(e) => setProjectForm({ ...projectForm, image_position: e.target.value })}
                    className="border-white/10 bg-white/5 text-white"
                    placeholder="center center"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-services">Services (comma separated)</Label>
                  <Input
                    id="project-services"
                    value={projectForm.services?.join(', ') || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, services: e.target.value.split(',').map(s => s.trim()) })}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Achievements (3 items)</Label>
                  {[0, 1, 2].map(i => (
                    <div key={i} className="flex gap-2">
                      <Input 
                        placeholder="Value (e.g. 70%)" 
                        value={projectForm.achievements?.[i]?.value || ''}
                        onChange={e => {
                          const newAchievements = [...(projectForm.achievements || [])];
                          if (!newAchievements[i]) newAchievements[i] = { value: '', label: '' };
                          newAchievements[i].value = e.target.value;
                          setProjectForm({ ...projectForm, achievements: newAchievements });
                        }}
                        className="border-white/10 bg-white/5 text-white"
                      />
                      <Input 
                        placeholder="Label (e.g. Increase in Sales)" 
                        value={projectForm.achievements?.[i]?.label || ''}
                        onChange={e => {
                          const newAchievements = [...(projectForm.achievements || [])];
                          if (!newAchievements[i]) newAchievements[i] = { value: '', label: '' };
                          newAchievements[i].label = e.target.value;
                          setProjectForm({ ...projectForm, achievements: newAchievements });
                        }}
                        className="border-white/10 bg-white/5 text-white"
                      />
                    </div>
                  ))}
                </div>

              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  className="text-white"
                  onClick={() => setIsAddProjectOpen(false)}
                  disabled={savingProject}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#ff502e] px-6 text-black hover:bg-[#ff6b49]"
                  onClick={saveProject}
                  disabled={savingProject || !projectForm.title}
                >
                  {savingProject ? 'Saving…' : 'Save Project'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      )}
    </div>
  );
}
