import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getWhatsAppNumber } from '@/lib/whatsapp-server';

export default async function ContactPage() {
  const whatsAppNumber = await getWhatsAppNumber();

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-ink">
      <Navbar whatsAppNumber={whatsAppNumber} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-20">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact' },
          ]}
        />

        <div className="my-8 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-[0.08em] font-light text-navy-deep">
            Contact & Consultation
          </h1>
          <p className="text-sm md:text-base text-ink/75 mt-4 leading-relaxed">
            All customer inquiries, custom order consultations, and pricing quotes are handled directly through WhatsApp for prompt, personal service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
          {/* WhatsApp Direct Contact Block */}
          <div className="bg-navy-deep text-white p-8 md:p-12 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-accent-orange font-medium block">
                Primary Channel
              </span>
              <h2 className="font-display text-2xl uppercase tracking-[0.08em] font-light text-white">
                WhatsApp Direct Consultation
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Connect directly with our team to discuss piece availability, dimensions, timber options, and custom bespoke specifications.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
              <WhatsAppButton
                number={whatsAppNumber}
                className="w-full text-center bg-white text-navy-deep hover:bg-warm-white"
              >
                Chat on WhatsApp Now
              </WhatsAppButton>
              <p className="text-[11px] text-white/40 text-center">
                Available during standard business hours across Malawi.
              </p>
            </div>
          </div>

          {/* Delivery and Business Scope Information */}
          <div className="bg-white border border-ink/10 p-8 md:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-accent-orange font-medium block mb-1">
                  Delivery Coverage
                </span>
                <h3 className="font-display text-lg uppercase tracking-wide text-navy-deep">
                  Malawi Nationwide
                </h3>
                <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                  Delivery available across Malawi. Delivery charges are based on location and distance.
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-accent-orange font-medium block mb-1">
                  Commercial & Institutional Inquiries
                </span>
                <h3 className="font-display text-lg uppercase tracking-wide text-navy-deep">
                  Offices, Banks, Hotels & Institutions
                </h3>
                <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                  For tenders, corporate furniture refits, and multi-unit production, please connect via WhatsApp to arrange an on-site consultation or technical specification review.
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-accent-orange font-medium block mb-1">
                  Pricing Policy
                </span>
                <h3 className="font-display text-lg uppercase tracking-wide text-navy-deep">
                  Price on Request
                </h3>
                <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                  Because dimensions, material options, and joinery finishes can be customized, all pricing is provided on request tailored to your specific requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
