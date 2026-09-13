import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import ProductGrid from '@/components/ProductGrid';
import CTASection from '@/components/CTASection';
import { createPublicClient } from '@/lib/supabase/server';
import { getWhatsAppNumber } from '@/lib/whatsapp-server';

export const revalidate = 60;

export default async function HomePage() {
  const whatsAppNumber = await getWhatsAppNumber();
  const supabase = createPublicClient();

  let featuredProducts = [];
  let categories = [];

  if (supabase) {
    try {
      const [featRes, catRes] = await Promise.all([
        supabase
          .from('products')
          .select('id, slug, name, description, images, availability, category:categories(id, slug, name)')
          .eq('featured', true)
          .limit(6),
        supabase.from('categories').select('id, slug, name, image').order('name'),
      ]);

      if (!featRes.error && featRes.data) {
        featuredProducts = featRes.data;
      }
      if (!catRes.error && catRes.data) {
        categories = catRes.data;
      }
    } catch {
      // Graceful fallback for empty or unconfigured database
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-ink">
      <Navbar whatsAppNumber={whatsAppNumber} />

      <main className="flex-1">
        {/* 1. Hero */}
        <Hero whatsAppNumber={whatsAppNumber} />

        {/* 2. Featured Furniture */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-ink/10 pb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
                Handcrafted Showcase
              </span>
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-[0.08em] font-light text-navy-deep">
                Featured Furniture
              </h2>
            </div>
            <Link
              href="/furniture"
              className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-medium text-navy-deep hover:text-accent-orange transition-colors inline-flex items-center gap-1.5"
            >
              View Full Collection
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <ProductGrid>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                  whatsAppNumber={whatsAppNumber}
                />
              ))}
            </ProductGrid>
          ) : (
            <div className="py-16 text-center border border-dashed border-ink/15 p-8 bg-white">
              <p className="text-sm text-ink/60">
                Our curated showroom collection is currently being updated.
              </p>
              <Link
                href="/furniture"
                className="mt-4 inline-block text-xs uppercase tracking-widest font-medium border border-navy-deep text-navy-deep px-5 py-2.5 hover:bg-navy-deep hover:text-white transition-colors"
              >
                Browse All Pieces
              </Link>
            </div>
          )}
        </section>

        {/* 3. Shop by Category */}
        <section className="py-20 px-6 bg-navy-deep text-white">
          <div className="max-w-7xl mx-auto w-full">
            <div className="mb-12 border-b border-white/10 pb-6">
              <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
                Curated Spaces
              </span>
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-[0.08em] font-light text-white">
                Shop By Category
              </h2>
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <CategoryCard key={cat.id || cat.slug} category={cat} />
                ))}
                {/* Dedicated Custom Furniture Card */}
                <Link
                  href="/custom-furniture"
                  className="group relative block aspect-3/2 overflow-hidden bg-navy-panel border border-white/10 interactive-card"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/60 to-transparent flex flex-col justify-end p-6">
                    <span className="text-[10px] uppercase tracking-widest text-accent-orange font-medium">
                      Bespoke Commissions
                    </span>
                    <h3 className="font-display text-xl font-light uppercase tracking-[0.1em] text-white group-hover:text-accent-orange transition-colors mt-1">
                      Custom Furniture
                    </h3>
                    <span className="text-xs uppercase tracking-widest text-white/60 mt-2 inline-flex items-center gap-1">
                      Start Custom Order
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {['Chairs', 'Tables', 'Beds', 'Sofas & Couches', 'Wardrobes', 'TV Stands', 'Office Furniture', 'Outdoor Furniture'].map((name) => (
                  <div key={name} className="p-8 border border-white/10 bg-navy-panel/40">
                    <h3 className="font-display text-lg uppercase tracking-wider text-white">
                      {name}
                    </h3>
                    <p className="text-xs text-white/50 mt-2">
                      Ready-made & bespoke designs
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. Custom Furniture Callout */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full">
          <div className="border border-ink/10 bg-white p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block">
                Bespoke Joinery & Fabrication
              </span>
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-[0.08em] font-light text-navy-deep">
                Custom Furniture Designed For Your Exact Dimensions
              </h2>
              <p className="text-ink/75 text-sm md:text-base leading-relaxed">
                Whether creating a distinctive dining centerpiece, custom architectural wardrobes, or an executive boardroom table, our craftsmen design and build to your exacting specifications and material selections.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/custom-furniture"
                className="inline-block px-8 py-4 bg-navy-deep text-white hover:bg-navy-panel transition-colors text-xs uppercase tracking-widest font-medium interactive-card"
              >
                Learn About Custom Work
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Residential & Commercial */}
        <section className="py-20 px-6 bg-warm-white border-y border-ink/10">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
                Tailored Spaces
              </span>
              <h2 className="font-display text-3xl md:text-4xl uppercase tracking-[0.08em] font-light text-navy-deep">
                Residential & Commercial Solutions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Residential Block */}
              <div className="bg-white border border-ink/10 p-8 md:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs uppercase tracking-widest text-accent-orange font-medium block">
                    For Homeowners
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-[0.08em] font-light text-navy-deep">
                    Residential Interiors
                  </h3>
                  <p className="text-ink/70 text-sm leading-relaxed">
                    Designed for lasting warmth, comfort, and timeless elegance. We craft complete living room suites, solid timber dining tables, bespoke bedroom sets, and built-in wardrobes that elevate everyday living spaces across Malawi.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-ink/10">
                  <Link
                    href="/furniture"
                    className="text-xs uppercase tracking-widest font-medium text-navy-deep hover:text-accent-orange transition-colors inline-flex items-center gap-1.5"
                  >
                    Explore Home Furniture
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Commercial Block */}
              <div className="bg-white border border-ink/10 p-8 md:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs uppercase tracking-widest text-accent-orange font-medium block">
                    Institutional & Enterprise
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-[0.08em] font-light text-navy-deep">
                    Commercial Furnishings
                  </h3>
                  <p className="text-ink/70 text-sm leading-relaxed">
                    Purpose-built furniture engineered for rigorous institutional and corporate demands. We design, build, and install durable, prestigious furniture systems specifically for offices, banks, hotels, and institutions across Malawi.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-ink/10">
                  <Link
                    href="/furniture/category/office-furniture"
                    className="text-xs uppercase tracking-widest font-medium text-navy-deep hover:text-accent-orange transition-colors inline-flex items-center gap-1.5"
                  >
                    View Commercial & Office Range
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Why Choose Us */}
        <section className="py-20 px-6 max-w-7xl mx-auto w-full">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
              Our Principles
            </span>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-[0.08em] font-light text-navy-deep">
              Why Choose Scepter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-ink/10 bg-white">
              <span className="font-display text-2xl text-accent-orange font-light block mb-2">01</span>
              <h3 className="font-display text-lg uppercase tracking-wide text-navy-deep mb-2">
                Local Craftsmanship
              </h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Precision manufacturing by skilled local artisans who understand Malawian hardwoods, materials, and architectural aesthetics.
              </p>
            </div>

            <div className="p-6 border border-ink/10 bg-white">
              <span className="font-display text-2xl text-accent-orange font-light block mb-2">02</span>
              <h3 className="font-display text-lg uppercase tracking-wide text-navy-deep mb-2">
                Bespoke Customization
              </h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                Every residential or commercial commission can be tailored in dimensions, finish, timber selection, and upholstery.
              </p>
            </div>

            <div className="p-6 border border-ink/10 bg-white">
              <span className="font-display text-2xl text-accent-orange font-light block mb-2">03</span>
              <h3 className="font-display text-lg uppercase tracking-wide text-navy-deep mb-2">
                End-to-End Installation
              </h3>
              <p className="text-xs text-ink/70 leading-relaxed">
                From initial consultation to on-site delivery and professional assembly anywhere across the country.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Gallery Preview */}
        <section className="py-20 px-6 bg-navy-deep text-white">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
                  Completed Projects
                </span>
                <h2 className="font-display text-3xl md:text-4xl uppercase tracking-[0.08em] font-light text-white">
                  Gallery Preview
                </h2>
              </div>
              <Link
                href="/gallery"
                className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-medium text-white/80 hover:text-accent-orange transition-colors inline-flex items-center gap-1.5"
              >
                View Complete Gallery
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square bg-navy-panel border border-white/10 flex items-center justify-center p-4 text-center">
                  <span className="text-xs uppercase tracking-widest text-white/40">
                    Scepter Installation #{item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Delivery Info */}
        <section className="py-16 px-6 max-w-7xl mx-auto w-full">
          <div className="bg-white border border-ink/10 p-8 md:p-12 text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-accent-orange font-medium block">
              Nationwide Service
            </span>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] font-light text-navy-deep">
              Delivery Information
            </h3>
            <p className="text-sm md:text-base text-ink/80 leading-relaxed font-medium">
              Delivery available across Malawi. Delivery charges are based on location and distance.
            </p>
            <p className="text-xs text-ink/50 pt-2">
              Our team manages secure transport and careful assembly on arrival for all residential and institutional orders.
            </p>
          </div>
        </section>

        {/* 9. WhatsApp CTA Section */}
        <CTASection whatsAppNumber={whatsAppNumber} />
      </main>

      <Footer />
    </div>
  );
}
