'use client';

import React from 'react';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export default function WhatsAppButton({
  number,
  productName,
  variant = 'primary', // 'primary' | 'secondary' | 'link'
  className = '',
  children,
}) {
  const href = buildWhatsAppLink(number, productName);

  if (variant === 'link') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-accent-orange font-medium text-sm hover:underline ${className}`}
      >
        {children || 'Request a Quote'}
      </a>
    );
  }

  if (variant === 'secondary') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center px-6 py-3 border border-navy-deep text-navy-deep bg-transparent hover:bg-navy-deep/5 transition-colors text-sm font-medium tracking-wide ${className}`}
      >
        {children || 'Chat on WhatsApp'}
      </a>
    );
  }

  // Primary variant: solid navy-deep with white text, NO orange background
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center px-6 py-3 bg-navy-deep text-white hover:bg-navy-panel transition-colors text-sm font-medium tracking-wide ${className}`}
    >
      {children || 'Chat on WhatsApp'}
    </a>
  );
}
