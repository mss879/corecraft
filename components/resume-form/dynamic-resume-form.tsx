"use client";

import { useEffect, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export type ResumeFormFieldType = 'text' | 'email' | 'textarea' | 'checkbox_group' | 'radio';

export interface ResumeFormQuestion {
  id?: string;
  field_key: string;
  label: string;
  field_type: ResumeFormFieldType;
  required: boolean;
  options?: unknown;
  order_index: number;
  active: boolean;
}

type FormValue = string | string[];
export type ResumeFormValues = Record<string, FormValue>;

function normalizeOptions(options: unknown): string[] {
  if (!options) return [];
  if (Array.isArray(options)) return options.map(String).map((o) => o.trim()).filter(Boolean);
  return [];
}

function getInitialValueForType(fieldType: ResumeFormFieldType): FormValue {
  if (fieldType === 'checkbox_group') return [];
  return '';
}

function validateRequired(questions: ResumeFormQuestion[], values: ResumeFormValues) {
  const activeQuestions = questions.filter((q) => q.active);
  for (const q of activeQuestions) {
    if (!q.required) continue;
    const value = values[q.field_key];
    if (q.field_type === 'checkbox_group') {
      const list = Array.isArray(value) ? value : [];
      if (list.length === 0) return { ok: false as const, fieldKey: q.field_key, label: q.label };
    } else {
      const str = typeof value === 'string' ? value.trim() : '';
      if (!str) return { ok: false as const, fieldKey: q.field_key, label: q.label };
    }
  }
  return { ok: true as const };
}

interface DynamicResumeFormProps {
  questions: ResumeFormQuestion[];
  value?: ResumeFormValues;
  onChange?: (next: ResumeFormValues) => void;
  onSubmit?: (values: ResumeFormValues) => Promise<void> | void;
  onValidationError?: (message: string, fieldKey: string) => void;
  submitLabel?: string;
  showSubmit?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DynamicResumeForm({
  questions,
  value,
  onChange,
  onSubmit,
  onValidationError,
  submitLabel = 'Submit',
  showSubmit = false,
  disabled = false,
  className,
}: DynamicResumeFormProps) {
  const activeOrderedQuestions = useMemo(() => {
    return [...questions]
      .filter((q) => q.active)
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }, [questions]);

  const [internalValues, setInternalValues] = useState<ResumeFormValues>({});
  const [submitting, setSubmitting] = useState(false);

  const values = value ?? internalValues;

  useEffect(() => {
    const base = { ...(value ?? internalValues) };
    for (const q of activeOrderedQuestions) {
      if (base[q.field_key] === undefined) {
        base[q.field_key] = getInitialValueForType(q.field_type);
      }
    }
    if (!value) {
      setInternalValues(base);
    } else {
      onChange?.(base);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrderedQuestions.length]);

  function setField(fieldKey: string, fieldValue: FormValue) {
    const next = { ...values, [fieldKey]: fieldValue };
    if (value) {
      onChange?.(next);
    } else {
      setInternalValues(next);
      onChange?.(next);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onSubmit) return;
    const validation = validateRequired(activeOrderedQuestions, values);
    if (!validation.ok) {
      onValidationError?.(`Missing required field: ${validation.label}`, validation.fieldKey);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-6">
        {activeOrderedQuestions.map((q) => {
          const isGroup = q.field_type === 'checkbox_group' || q.field_type === 'radio';
          const options = normalizeOptions(q.options);
          const fieldValue = values[q.field_key];

          if (q.field_type === 'textarea') {
            return (
              <div key={q.field_key} className="space-y-2">
                <Label htmlFor={q.field_key} className="text-white/80">
                  {q.label}
                </Label>
                <Textarea
                  id={q.field_key}
                  name={q.field_key}
                  required={q.required}
                  disabled={disabled || submitting}
                  value={typeof fieldValue === 'string' ? fieldValue : ''}
                  onChange={(e) => setField(q.field_key, e.target.value)}
                  className="min-h-[80px] border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
                />
              </div>
            );
          }

          if (q.field_type === 'checkbox_group') {
            const list = Array.isArray(fieldValue) ? fieldValue : [];
            return (
              <div key={q.field_key} className="space-y-3">
                <Label className="text-white/80">{q.label}</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.map((opt) => (
                    <div key={opt} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${q.field_key}:${opt}`}
                        checked={list.includes(opt)}
                        disabled={disabled || submitting}
                        onCheckedChange={(checked) => {
                          const next = checked
                            ? [...list, opt]
                            : list.filter((item) => item !== opt);
                          setField(q.field_key, next);
                        }}
                        className="border-white/30 data-[state=checked]:bg-[#ff502e] data-[state=checked]:border-[#ff502e]"
                      />
                      <Label htmlFor={`${q.field_key}:${opt}`} className="text-sm font-normal text-white/70 cursor-pointer">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (q.field_type === 'radio') {
            const current = typeof fieldValue === 'string' ? fieldValue : '';
            return (
              <div key={q.field_key} className="space-y-3">
                <Label className="text-white/80">{q.label}</Label>
                <RadioGroup
                  value={current}
                  onValueChange={(v) => setField(q.field_key, v)}
                  className="flex flex-wrap gap-4"
                >
                  {options.map((opt) => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={opt}
                        id={`${q.field_key}:${opt}`}
                        disabled={disabled || submitting}
                        className="border-white/30 text-[#ff502e]"
                      />
                      <Label htmlFor={`${q.field_key}:${opt}`} className="text-white/70">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            );
          }

          // text/email
          return (
            <div key={q.field_key} className="space-y-2">
              <Label htmlFor={q.field_key} className="text-white/80">
                {q.label}
              </Label>
              <Input
                id={q.field_key}
                name={q.field_key}
                type={q.field_type === 'email' ? 'email' : 'text'}
                required={q.required}
                disabled={disabled || submitting}
                value={typeof fieldValue === 'string' ? fieldValue : ''}
                onChange={(e) => setField(q.field_key, e.target.value)}
                className="border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
          );
        })}
      </div>

      {showSubmit && (
        <Button
          type="submit"
          disabled={disabled || submitting}
          className="mt-6 w-full bg-[#ff502e] text-white hover:bg-[#ff502e]/90"
        >
          {submitting ? 'Submitting…' : submitLabel}
        </Button>
      )}
    </form>
  );
}
