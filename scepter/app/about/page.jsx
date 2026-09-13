import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import CTASection from '@/components/CTASection';
import { getWhatsAppNumber } from '@/lib/whatsapp-server';

export default async function AboutPage() {
  const whatsAppNumber = await getWhatsAppNumber();

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-ink">
      <Navbar whatsAppNumber={whatsAppNumber} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-20">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'About' },
          ]}
        />

        <div className="my-8 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
            The Company
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-[0.08em] font-light text-navy-deep">
            About Scepter
          </h1>
          <p className="text-base text-ink/80 mt-4 leading-relaxed">
            Scepter is a Malawian furniture and interior design company. We design, manufacture, and install distinguished furniture — both ready-made pieces and fully custom work — for homes and businesses across Malawi.
          </p>
        </div>

        {/* Narrative columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">
          <div className="space-y-6">
            <h2 className="font-display text-2xl uppercase tracking-wide text-navy-deep">
              Design & Joinery Excellence
            </h2>
            <p className="text-sm text-ink/75 leading-relaxed">
              We approach each project as a union of architectural precision and tactile material warmth. Every piece is constructed to withstand demanding everyday use while maintaining an elegant, minimal silhouette.
            </p>
            <p className="text-sm text-ink/75 leading-relaxed">
              Instead of mass-produced flat-pack imports, Scepter invests in local fabrication, solid timber joinery, and durable upholstery.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-2xl uppercase tracking-wide text-navy-deep">
              Residential & Commercial Scale
            </h2>
            <p className="text-sm text-ink/75 leading-relaxed">
              Our production capabilities span both private residential interiors and large-scale corporate commissions. We regularly supply tailored furnishings for offices, banks, hotels, and other institutions across the country.
            </p>
            <p className="text-sm text-ink/75 leading-relaxed">
              Delivery available across Malawi. Delivery charges are based on location and distance.
            </p>
          </div>
        </div>

        {/* Key Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:p-12 bg-white border border-ink/10">
          <div>
            <h3 className="font-display text-lg uppercase tracking-wider text-navy-deep mb-2">
              Malawian Manufacture
            </h3>
            <p className="text-xs text-ink/70 leading-relaxed">
              Locally designed and built with pride, supporting regional craftsmanship and sustainable timber practices.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg uppercase tracking-wider text-navy-deep mb-2">
              Bespoke Flexibility
            </h3>
            <p className="text-xs text-ink/70 leading-relaxed">
              Custom dimensions and specifications for any architectural or interior layout.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg uppercase tracking-wider text-navy-deep mb-2">
              Direct Service
            </h3>
            <p className="text-xs text-ink/70 leading-relaxed">
              Transparent, one-on-one consultation through WhatsApp from inquiry to on-site assembly.
            </p>
          </div>
        </div>
      </main>

      <CTASection whatsAppNumber={whatsAppNumber} />
      <Footer />
    </div>
  );
}
