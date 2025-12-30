"use client";

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';

interface GetStartedModalProps {
  children: React.ReactNode;
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

export function GetStartedModal({ children }: GetStartedModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean, value: string) => {
    setFormData((prev) => {
      const current = prev.service_interest;
      if (checked) {
        return { ...prev, service_interest: [...current, value] };
      } else {
        return { ...prev, service_interest: current.filter((item) => item !== value) };
      }
    });
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, linkedin_info_requested: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('career_inquiries').insert({
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
        message: formData.additional_info, // Mapping additional_info to message
        service_interest: formData.service_interest.join(', '),
        linkedin_info_requested: formData.linkedin_info_requested === 'yes',
        referral_source: formData.referral_source,
      });

      if (error) throw error;

      toast.success('Request submitted successfully!', {
        description: "We'll get back to you shortly.",
      });
      setOpen(false);
      setFormData(initialState);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong.', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-2 border-white/20 bg-black/80 text-white backdrop-blur-2xl shadow-2xl shadow-black/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Start Your Journey
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Please fill out the form below to help us understand your career goals.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Target Markets */}
          <div className="space-y-2">
            <Label htmlFor="target_markets" className="text-white/80">
              Share us the target markets you would like your resume to be focused on. Explain your requirement briefly for our research.
            </Label>
            <Textarea
              id="target_markets"
              name="target_markets"
              required
              value={formData.target_markets}
              onChange={handleInputChange}
              className="min-h-[80px] border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
            />
          </div>

          {/* Personal Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80">Name</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-white/80">Company/Organization <span className="text-white/40">(if applicable)</span></Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
          </div>

          {/* Current Role & Industry */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current_role" className="text-white/80">Current Job Title/Position</Label>
              <Input
                id="current_role"
                name="current_role"
                value={formData.current_role}
                onChange={handleInputChange}
                className="border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_industry" className="text-white/80">Industry/Sector</Label>
              <Input
                id="current_industry"
                name="current_industry"
                value={formData.current_industry}
                onChange={handleInputChange}
                className="border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
          </div>

          {/* Target Role & Industry */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="target_roles" className="text-white/80">What job title(s) are you targeting?</Label>
              <Input
                id="target_roles"
                name="target_roles"
                value={formData.target_roles}
                onChange={handleInputChange}
                className="border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_industries" className="text-white/80">Which industry or industries are you interested in?</Label>
              <Input
                id="target_industries"
                name="target_industries"
                value={formData.target_industries}
                onChange={handleInputChange}
                className="border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
          </div>

          {/* Career Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="career_objectives" className="text-white/80">Can you provide a brief summary of your career objectives and key strengths?</Label>
              <Textarea
                id="career_objectives"
                name="career_objectives"
                value={formData.career_objectives}
                onChange={handleInputChange}
                className="min-h-[80px] border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="career_goals" className="text-white/80">What are your primary career goals for the next 3-5 years?</Label>
              <Textarea
                id="career_goals"
                name="career_goals"
                value={formData.career_goals}
                onChange={handleInputChange}
                className="min-h-[80px] border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-white/80">What hard skills (technical skills) and soft skills (interpersonal skills) do you possess relevant to your target job?</Label>
              <Textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="min-h-[80px] border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education_certifications" className="text-white/80">List any certifications, licenses, professional training, and your educational background (degrees, institutions, and graduation dates). Include any relevant coursework or academic projects.</Label>
              <Textarea
                id="education_certifications"
                name="education_certifications"
                value={formData.education_certifications}
                onChange={handleInputChange}
                className="min-h-[100px] border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-2">
            <Label htmlFor="additional_info" className="text-white/80">Do you have any additional information or specific requests for your resume, including preferences for the design or format, and any particular keywords or phrases you believe should be included?</Label>
            <Textarea
              id="additional_info"
              name="additional_info"
              value={formData.additional_info}
              onChange={handleInputChange}
              className="min-h-[80px] border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
            />
          </div>

          {/* Services */}
          <div className="space-y-3">
            <Label className="text-white/80">What specific services are you interested in? (Check all that apply)</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {serviceOptions.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.service_interest.includes(service)}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, service)}
                    className="border-white/30 data-[state=checked]:bg-[#ff502e] data-[state=checked]:border-[#ff502e]"
                  />
                  <Label htmlFor={service} className="text-sm font-normal text-white/70 cursor-pointer">
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* LinkedIn Info */}
          <div className="space-y-3">
            <Label className="text-white/80">Would you like more information about our LinkedIn optimization service?</Label>
            <RadioGroup
              value={formData.linkedin_info_requested}
              onValueChange={handleRadioChange}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="linkedin-yes" className="border-white/30 text-[#ff502e]" />
                <Label htmlFor="linkedin-yes" className="text-white/70">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="linkedin-no" className="border-white/30 text-[#ff502e]" />
                <Label htmlFor="linkedin-no" className="text-white/70">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Referral */}
          <div className="space-y-2">
            <Label htmlFor="referral_source" className="text-white/80">How did you hear about Core Craft?</Label>
            <Input
              id="referral_source"
              name="referral_source"
              value={formData.referral_source}
              onChange={handleInputChange}
              className="border-white/10 bg-white/5 text-white focus:border-[#ff502e]/50 focus:ring-[#ff502e]/20"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ff502e] text-white hover:bg-[#ff502e]/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}