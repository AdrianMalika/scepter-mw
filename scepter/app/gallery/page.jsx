import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import CTASection from '@/components/CTASection';
import { createPublicClient } from '@/lib/supabase/server';
import { getWhatsAppNumber } from '@/lib/whatsapp-server';

export const revalidate = 60;

export default async function GalleryPage() {
  const whatsAppNumber = await getWhatsAppNumber();
  const supabase = createPublicClient();

  let galleryImages = [];

  if (supabase) {
    try {
      const { data } = await supabase
        .from('products')
        .select('name, images');
      if (data) {
        data.forEach((prod) => {
          if (prod.images && Array.isArray(prod.images)) {
            prod.images.forEach((img) => {
              galleryImages.push({
                url: img,
                title: prod.name,
              });
            });
          }
        });
      }
    } catch {
      // Graceful fallback
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-ink">
      <Navbar whatsAppNumber={whatsAppNumber} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-20">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Gallery' },
          ]}
        />

        <div className="my-8 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
            Showroom & Installations
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-[0.08em] font-light text-navy-deep">
            Project Gallery
          </h1>
          <p className="text-sm md:text-base text-ink/75 mt-4 leading-relaxed">
            A visual record of our manufactured furniture, custom residential spaces, and commercial installations completed across Malawi.
          </p>
        </div>

        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-12">
            {galleryImages.map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-4/3 bg-white border border-ink/10 overflow-hidden interactive-card"
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs uppercase tracking-wider text-white font-medium">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-4/3 bg-white border border-ink/10 flex flex-col items-center justify-center p-6 text-center"
              >
                <span className="text-xs uppercase tracking-widest text-ink/40 font-medium">
                  Installation Showcase #{i}
                </span>
                <p className="text-[11px] text-ink/50 mt-2">
                  Photographic records update with new project completions.
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      <CTASection whatsAppNumber={whatsAppNumber} />
      <Footer />
    </div>
  );
}
