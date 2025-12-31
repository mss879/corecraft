"use client";

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import emailjs from '@emailjs/browser';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';

const initialState = {
  name: '',
  company: '',
  email: '',
  message: '',
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [formState, setFormState] = useState(initialState);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField = (field: keyof typeof formState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    try {
      // Save to Supabase
      const { error: supabaseError } = await supabase.from('inquiries').insert({
        name: formState.name,
        company: formState.company,
        email: formState.email,
        message: formState.message,
      });

      if (supabaseError) {
        setErrorMessage(supabaseError.message);
        setStatus('error');
        return;
      }

      // Send email via EmailJS
      await emailjs.send(
        'service_j8qlez4',
        'template_hszc9nl',
        {
          name: formState.name,
          company: formState.company,
          email: formState.email,
          message: formState.message,
        },
        'ZWFeg9HvmUmAkjDtb'
      );

      setFormState(initialState);
      setStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
      setStatus('error');
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#111]">
            Your name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter full name"
            value={formState.name}
            onChange={updateField('name')}
            className="h-14 rounded-xl border-[#ececec] bg-[#fafafa] text-base placeholder:text-[#a0a0a0] focus-visible:ring-[#ff502e]"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#111]">
            Company name
          </label>
          <Input
            id="company"
            name="company"
            type="text"
            required
            placeholder="Enter company name"
            value={formState.company}
            onChange={updateField('company')}
            className="h-14 rounded-xl border-[#ececec] bg-[#fafafa] text-base placeholder:text-[#a0a0a0] focus-visible:ring-[#ff502e]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#111]">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter email address"
          value={formState.email}
          onChange={updateField('email')}
          className="h-14 rounded-xl border-[#ececec] bg-[#fafafa] text-base placeholder:text-[#a0a0a0] focus-visible:ring-[#ff502e]"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#111]">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Tell us about your vision"
          value={formState.message}
          onChange={updateField('message')}
          className="min-h-[180px] rounded-2xl border-[#ececec] bg-[#fafafa] pb-4 pt-3 text-base placeholder:text-[#a0a0a0] focus-visible:ring-[#ff502e]"
        />
      </div>

      {status === 'success' && (
        <p className="rounded-2xl border border-green-600/30 bg-green-500/10 px-4 py-3 text-sm text-green-700" role="status">
          Message received. Our team will respond shortly.
        </p>
      )}
      {status === 'error' && errorMessage && (
        <p className="rounded-2xl border border-red-600/30 bg-red-500/10 px-4 py-3 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[#7a7a7a]">
          By submitting this form you agree to our{' '}
          <a
            href="https://mandala.framer.website/legal/terms-of-service?utm_source=framer"
            className="font-medium text-black underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </a>{' '}
          and{' '}
          <a
            href="https://mandala.framer.website/legal/privacy-policy?utm_source=framer"
            className="font-medium text-black underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group inline-flex items-center justify-center gap-3 rounded-full border border-[#dcdcdc] px-7 py-3 text-base font-semibold text-black transition-colors duration-300 hover:border-[#ff502e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff502e]/70 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : 'Submit'}
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ff502e] text-black transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </div>
    </form>
  );
}
