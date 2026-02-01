"use client";

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabaseClient';
import {
  DynamicResumeForm,
  type ResumeFormQuestion,
  type ResumeFormValues,
} from '@/components/resume-form/dynamic-resume-form';

interface CareerFormContainerProps {
  onSuccess?: () => void;
  className?: string;
}

const initialState = {
  target_markets: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  current_role: '',
  current_industry: '',
  target_roles: '',
  target_industries: '',
  career_objectives: '',
  career_goals: '',
  skills: '',
  education_certifications: '',
  additional_info: '',
  service_interest: [] as string[],
  linkedin_info_requested: 'no',
  referral_source: '',
};

const serviceOptions = [
  'ATS-Proof Resumes',
  'Expert Career Development',
  'LinkedIn Optimization',
  'All of the above',
  'Other',
];

const fallbackQuestions: ResumeFormQuestion[] = [
  {
    field_key: 'target_markets',
    label:
      'Share us the target markets you would like your resume to be focused on. Explain your requirement briefly for our research.',
    field_type: 'textarea',
    required: true,
    options: null,
    order_index: 10,
    active: true,
  },
  { field_key: 'name', label: 'Name', field_type: 'text', required: true, options: null, order_index: 20, active: true },
  { field_key: 'email', label: 'Email', field_type: 'email', required: true, options: null, order_index: 30, active: true },
  { field_key: 'phone', label: 'Phone Number', field_type: 'text', required: true, options: null, order_index: 40, active: true },
  { field_key: 'company', label: 'Company/Organization (if applicable)', field_type: 'text', required: false, options: null, order_index: 50, active: true },
  { field_key: 'current_role', label: 'Current Job Title/Position', field_type: 'text', required: false, options: null, order_index: 60, active: true },
  { field_key: 'current_industry', label: 'Industry/Sector', field_type: 'text', required: false, options: null, order_index: 70, active: true },
  { field_key: 'target_roles', label: 'What job title(s) are you targeting?', field_type: 'text', required: false, options: null, order_index: 80, active: true },
  { field_key: 'target_industries', label: 'Which industry or industries are you interested in?', field_type: 'text', required: false, options: null, order_index: 90, active: true },
  {
    field_key: 'career_objectives',
    label: 'Can you provide a brief summary of your career objectives and key strengths?',
    field_type: 'textarea',
    required: false,
    options: null,
    order_index: 100,
    active: true,
  },
  {
    field_key: 'career_goals',
    label: 'What are your primary career goals for the next 3-5 years?',
    field_type: 'textarea',
    required: false,
    options: null,
    order_index: 110,
    active: true,
  },
  {
    field_key: 'skills',
    label: 'What hard skills (technical skills) and soft skills (interpersonal skills) do you possess relevant to your target job?',
    field_type: 'textarea',
    required: false,
    options: null,
    order_index: 120,
    active: true,
  },
  {
    field_key: 'education_certifications',
    label:
      'List any certifications, licenses, professional training, and your educational background (degrees, institutions, and graduation dates). Include any relevant coursework or academic projects.',
    field_type: 'textarea',
    required: false,
    options: null,
    order_index: 130,
    active: true,
  },
  {
    field_key: 'additional_info',
    label:
      'Do you have any additional information or specific requests for your resume, including preferences for the design or format, and any particular keywords or phrases you believe should be included?',
    field_type: 'textarea',
    required: false,
    options: null,
    order_index: 140,
    active: true,
  },
  {
    field_key: 'service_interest',
    label: 'What specific services are you interested in? (Check all that apply)',
    field_type: 'checkbox_group',
    required: false,
    options: serviceOptions,
    order_index: 150,
    active: true,
  },
  {
    field_key: 'linkedin_info_requested',
    label: 'Would you like more information about our LinkedIn optimization service?',
    field_type: 'radio',
    required: false,
    options: ['yes', 'no'],
    order_index: 160,
    active: true,
  },
  { field_key: 'referral_source', label: 'How did you hear about Core Craft?', field_type: 'text', required: false, options: null, order_index: 170, active: true },
];

export function CareerFormContainer({ onSuccess, className }: CareerFormContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const [questions, setQuestions] = useState<ResumeFormQuestion[] | null>(null);
  const activeQuestions = useMemo(() => {
    const list = (questions && questions.length ? questions : fallbackQuestions).filter((q) => q.active);
    return [...list].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }, [questions]);

  useEffect(() => {
    let ignore = false;
    async function loadQuestions() {
      const { data, error } = await supabase
        .from('resume_form_questions')
        .select('*')
        .order('order_index', { ascending: true });
      if (ignore) return;
      if (error) {
        console.warn('Failed to load resume form questions, falling back to defaults.', error);
        setQuestions(null);
        return;
      }
      setQuestions((data ?? []) as ResumeFormQuestion[]);
    }
    loadQuestions();
    return () => {
      ignore = true;
    };
  }, []);

  function toDynamicValues(): ResumeFormValues {
    return {
      target_markets: formData.target_markets,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      current_role: formData.current_role,
      current_industry: formData.current_industry,
      target_roles: formData.target_roles,
      target_industries: formData.target_industries,
      career_objectives: formData.career_objectives,
      career_goals: formData.career_goals,
      skills: formData.skills,
      education_certifications: formData.education_certifications,
      additional_info: formData.additional_info,
      service_interest: formData.service_interest,
      linkedin_info_requested: formData.linkedin_info_requested,
      referral_source: formData.referral_source,
    };
  }

  function fromDynamicValues(values: ResumeFormValues) {
    setFormData((prev) => ({
      ...prev,
      target_markets: typeof values.target_markets === 'string' ? values.target_markets : prev.target_markets,
      name: typeof values.name === 'string' ? values.name : prev.name,
      email: typeof values.email === 'string' ? values.email : prev.email,
      phone: typeof values.phone === 'string' ? values.phone : prev.phone,
      company: typeof values.company === 'string' ? values.company : prev.company,
      current_role: typeof values.current_role === 'string' ? values.current_role : prev.current_role,
      current_industry: typeof values.current_industry === 'string' ? values.current_industry : prev.current_industry,
      target_roles: typeof values.target_roles === 'string' ? values.target_roles : prev.target_roles,
      target_industries: typeof values.target_industries === 'string' ? values.target_industries : prev.target_industries,
      career_objectives: typeof values.career_objectives === 'string' ? values.career_objectives : prev.career_objectives,
      career_goals: typeof values.career_goals === 'string' ? values.career_goals : prev.career_goals,
      skills: typeof values.skills === 'string' ? values.skills : prev.skills,
      education_certifications:
        typeof values.education_certifications === 'string' ? values.education_certifications : prev.education_certifications,
      additional_info: typeof values.additional_info === 'string' ? values.additional_info : prev.additional_info,
      service_interest: Array.isArray(values.service_interest) ? values.service_interest : prev.service_interest,
      linkedin_info_requested:
        typeof values.linkedin_info_requested === 'string' ? values.linkedin_info_requested : prev.linkedin_info_requested,
      referral_source: typeof values.referral_source === 'string' ? values.referral_source : prev.referral_source,
    }));
  }

  async function submitDynamic(values: ResumeFormValues) {
    setIsLoading(true);

    try {
      const knownKeys = new Set([
        'target_markets',
        'name',
        'email',
        'phone',
        'company',
        'current_role',
        'current_industry',
        'target_roles',
        'target_industries',
        'career_objectives',
        'career_goals',
        'skills',
        'education_certifications',
        'additional_info',
        'service_interest',
        'linkedin_info_requested',
        'referral_source',
      ]);

      const extra: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(values)) {
        if (!knownKeys.has(k)) extra[k] = v;
      }

      const serviceInterest = Array.isArray(values.service_interest) ? values.service_interest : [];
      const linkedinRaw = typeof values.linkedin_info_requested === 'string' ? values.linkedin_info_requested : 'no';

      const { error } = await supabase.from('career_inquiries').insert({
        target_markets: typeof values.target_markets === 'string' ? values.target_markets : '',
        name: typeof values.name === 'string' ? values.name : '',
        email: typeof values.email === 'string' ? values.email : '',
        phone: typeof values.phone === 'string' ? values.phone : '',
        company: typeof values.company === 'string' ? values.company : '',
        current_role: typeof values.current_role === 'string' ? values.current_role : '',
        current_industry: typeof values.current_industry === 'string' ? values.current_industry : '',
        target_roles: typeof values.target_roles === 'string' ? values.target_roles : '',
        target_industries: typeof values.target_industries === 'string' ? values.target_industries : '',
        career_objectives: typeof values.career_objectives === 'string' ? values.career_objectives : '',
        career_goals: typeof values.career_goals === 'string' ? values.career_goals : '',
        skills: typeof values.skills === 'string' ? values.skills : '',
        education_certifications:
          typeof values.education_certifications === 'string' ? values.education_certifications : '',
        message: typeof values.additional_info === 'string' ? values.additional_info : '',
        service_interest: serviceInterest.join(', '),
        linkedin_info_requested: linkedinRaw === 'yes',
        referral_source: typeof values.referral_source === 'string' ? values.referral_source : '',
        extra_answers: extra,
      });

      if (error) throw error;

      toast.success('Request submitted successfully!', {
        description: "We'll get back to you shortly.",
      });
      setFormData(initialState);
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong.', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DynamicResumeForm
      questions={activeQuestions}
      value={toDynamicValues()}
      onChange={fromDynamicValues}
      onValidationError={(message) => toast.error(message)}
      onSubmit={submitDynamic}
      submitLabel={isLoading ? 'Submitting…' : 'Submit Request'}
      showSubmit
      disabled={isLoading}
      className={className}
    />
  );
}
