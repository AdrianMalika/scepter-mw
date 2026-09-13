import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import WhatsAppButton from '@/components/WhatsAppButton';
import CTASection from '@/components/CTASection';
import { getWhatsAppNumber } from '@/lib/whatsapp-server';

export default async function CustomFurniturePage() {
  const whatsAppNumber = await getWhatsAppNumber();

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-ink">
      <Navbar whatsAppNumber={whatsAppNumber} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-20">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Custom Furniture' },
          ]}
        />

        <div className="my-8 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
            Bespoke Joinery & Metalwork
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-[0.08em] font-light text-navy-deep">
            Custom Furniture
          </h1>
          <p className="text-sm md:text-base text-ink/75 mt-4 leading-relaxed">
            Every home and commercial project has distinctive spatial dimensions and design intentions. Scepter creates one-off bespoke commissions and tailored installations across Malawi.
          </p>
        </div>

        {/* The Custom Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-16">
          <div className="bg-white border border-ink/10 p-6">
            <span className="font-display text-2xl text-accent-orange font-light block mb-3">01</span>
            <h3 className="font-display text-lg uppercase tracking-wide text-navy-deep mb-2">
              Consultation
            </h3>
            <p className="text-xs text-ink/70 leading-relaxed">
              Share your room dimensions, sketches, reference photography, and timber preferences directly via WhatsApp.
            </p>
          </div>

          <div className="bg-white border border-ink/10 p-6">
            <span className="font-display text-2xl text-accent-orange font-light block mb-3">02</span>
            <h3 className="font-display text-lg uppercase tracking-wide text-navy-deep mb-2">
              Design & Quote
            </h3>
            <p className="text-xs text-ink/70 leading-relaxed">
              We provide itemised specifications, timber advice, and transparent pricing tailored to your requirements.
            </p>
          </div>

          <div className="bg-white border border-ink/10 p-6">
            <span className="font-display text-2xl text-accent-orange font-light block mb-3">03</span>
            <h3 className="font-display text-lg uppercase tracking-wide text-navy-deep mb-2">
              Crafting
            </h3>
            <p className="text-xs text-ink/70 leading-relaxed">
              Our Malawian artisans carefully cut, assemble, finish, and quality-inspect each custom piece.
            </p>
          </div>

          <div className="bg-white border border-ink/10 p-6">
            <span className="font-display text-2xl text-accent-orange font-light block mb-3">04</span>
            <h3 className="font-display text-lg uppercase tracking-wide text-navy-deep mb-2">
              Delivery & Fit
            </h3>
            <p className="text-xs text-ink/70 leading-relaxed">
              Delivery available across Malawi. Delivery charges are based on location and distance.
            </p>
          </div>
        </div>

        {/* Tailored Sectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          <div className="p-8 border border-ink/10 bg-white">
            <span className="text-xs uppercase tracking-widest text-accent-orange font-medium block mb-2">
              Residential Commissions
            </span>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] font-light text-navy-deep mb-4">
              Bespoke Homes & Apartments
            </h3>
            <p className="text-sm text-ink/70 leading-relaxed mb-4">
              Dining tables tailored to exact room dimensions, custom headboards, fitted walk-in closets, entertainment units, and exterior patio sets.
            </p>
            <WhatsAppButton
              number={whatsAppNumber}
              productName="Custom Residential Project"
              variant="link"
            >
              Discuss Home Commission
            </WhatsAppButton>
          </div>

          <div className="p-8 border border-ink/10 bg-white">
            <span className="text-xs uppercase tracking-widest text-accent-orange font-medium block mb-2">
              Institutional & Enterprise
            </span>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] font-light text-navy-deep mb-4">
              Commercial & Executive Spaces
            </h3>
            <p className="text-sm text-ink/70 leading-relaxed mb-4">
              Specialized desks, conference tables, executive reception counters, and acoustic banquettes designed specifically for offices, banks, hotels, and institutions across Malawi.
            </p>
            <WhatsAppButton
              number={whatsAppNumber}
              productName="Commercial Institutional Commission"
              variant="link"
            >
              Discuss Commercial Project
            </WhatsAppButton>
          </div>
        </div>
      </main>

      <CTASection
        headline="Have a custom furniture design in mind?"
        subheadline="Send your dimensions, drawings, or reference photos to our WhatsApp team for an initial consultation."
        whatsAppNumber={whatsAppNumber}
      />
      <Footer />
    </div>
  );
}
