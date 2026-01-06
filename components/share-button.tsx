'use client';

import { useMemo } from 'react';
import { toast } from 'sonner';
import { Share2, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ShareButtonProps = {
  title?: string;
  text?: string;
  /** If provided, share this path instead of the current URL (e.g. `/blog/my-post`). */
  path?: string;
  className?: string;
};

export function ShareButton({ title, text, path, className }: ShareButtonProps) {
  const url = useMemo(() => {
    if (typeof window === 'undefined') return '';
    if (path) return new URL(path, window.location.origin).toString();
    return window.location.href;
  }, [path]);

  const shareText = useMemo(() => {
    const parts = [title, text, url].filter((p) => typeof p === 'string' && p.trim().length > 0);
    return parts.join('\n');
  }, [title, text, url]);

  const copyLink = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const nativeShare = async () => {
    if (!url) return;

    if (!('share' in navigator)) {
      toast.message('Sharing not supported here', {
        description: 'Use Copy link or a social share option.',
      });
      return;
    }

    try {
      // Some browsers require at least one of title/text/url.
      await navigator.share({ title, text, url });
    } catch {
      // User cancellation throws on some browsers; keep it quiet.
    }
  };

  const open = (targetUrl: string) => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const openX = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title ? title : ''
    )}&url=${encodeURIComponent(url)}`;
    open(shareUrl);
  };

  const openLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    open(shareUrl);
  };

  const openFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    open(shareUrl);
  };

  const openWhatsApp = () => {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    open(shareUrl);
  };

  const disabled = !url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn('gap-2', className)}
          disabled={disabled}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            nativeShare();
          }}
          disabled={disabled}
        >
          Share…
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            copyLink();
          }}
          disabled={disabled}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            openX();
          }}
          disabled={disabled}
        >
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            openLinkedIn();
          }}
          disabled={disabled}
        >
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            openFacebook();
          }}
          disabled={disabled}
        >
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            openWhatsApp();
          }}
          disabled={disabled}
        >
          Share on WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
