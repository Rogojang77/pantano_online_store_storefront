'use client';

import { useState } from 'react';
import { Share2, Copy, MessageCircle, Facebook, Mail } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url.startsWith('http')
    ? url
    : (url.startsWith('/') ? url : `/${url}`);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const text = encodeURIComponent(`${title} - ${shareUrl}`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
      } catch {
        // user cancelled or error
      }
    }
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400">
        <Share2 className="h-4 w-4" />
        Distribuie:
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={handleCopyLink}
          aria-label="Copiază link"
          title="Copiază link"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          asChild
        >
          <a
            href={`https://wa.me/?text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share pe WhatsApp"
            title="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          asChild
        >
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share pe Facebook"
            title="Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          asChild
        >
          <a
            href={`mailto:?subject=${encodedTitle}&body=${text}`}
            aria-label="Trimite prin email"
            title="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
        </Button>
      </div>
      {copied && (
        <span className="text-xs text-green-600 dark:text-green-400">
          Link copiat
        </span>
      )}
    </div>
  );
}
