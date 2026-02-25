import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || `Check out "${title}" on Oraino Music!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const share = (platform: string) => {
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      instagram: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`,
    };
    window.open(urls[platform], '_blank');
    setOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
        <Share2 className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 bg-popover border border-border rounded-xl p-3 shadow-lg min-w-[160px] z-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Share</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
          </div>
          <div className="space-y-1">
            <button onClick={() => share('whatsapp')} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">WhatsApp</button>
            <button onClick={() => share('facebook')} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">Facebook</button>
            <button onClick={() => share('instagram')} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">Instagram</button>
            <button onClick={handleCopy} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors flex items-center gap-2">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
