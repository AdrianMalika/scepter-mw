import React from 'react';
import WhatsAppButton from './WhatsAppButton';

export default function CTASection({
  headline = 'Ready to elevate your living or workspace?',
  subheadline = 'Get in touch with our design and manufacturing team directly on WhatsApp to discuss pieces, bespoke commissions, and quotes.',
  whatsAppNumber,
}) {
  return (
    <section className="bg-navy-deep text-white py-20 px-6 border-t border-navy-panel">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <span className="text-xs uppercase tracking-widest text-accent-orange font-medium block">
          Direct Showroom Consultation
        </span>
        <h2 className="font-display text-3xl md:text-4xl uppercase tracking-[0.1em] font-light text-white leading-tight">
          {headline}
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          {subheadline}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <WhatsAppButton
            number={whatsAppNumber}
            className="border border-white/20 bg-white/10 hover:bg-white/20 text-white"
          >
            Chat on WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
