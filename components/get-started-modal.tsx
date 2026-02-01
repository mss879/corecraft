"use client";

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CareerFormContainer } from '@/components/career-form-container';

interface GetStartedModalProps {
  children: React.ReactNode;
}

export function GetStartedModal({ children }: GetStartedModalProps) {
  const [open, setOpen] = useState(false);

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

        <CareerFormContainer 
          onSuccess={() => setOpen(false)}
          className="mt-4"
        />
      </DialogContent>
    </Dialog>
  );
}