import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductGallery from '@/components/ProductGallery';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import CTASection from '@/components/CTASection';
import { createPublicClient } from '@/lib/supabase/server';
import { getWhatsAppNumber } from '@/lib/whatsapp-server';

export const revalidate = 60;

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const whatsAppNumber = await getWhatsAppNumber();
  const supabase = createPublicClient();

  let product = null;
  let relatedProducts = [];

  if (supabase) {
    try {
      const prodRes = await supabase
        .from('products')
        .select('id, slug, name, description, images, availability, dimensions, materials, colours, customisation_options, category_id, category:categories(id, slug, name)')
        .eq('slug', slug)
        .single();

      if (prodRes.data) {
        product = prodRes.data;

        if (product.category_id) {
          const relRes = await supabase
            .from('products')
            .select('id, slug, name, description, images, availability, category:categories(id, slug, name)')
            .eq('category_id', product.category_id)
            .neq('id', product.id)
            .limit(3);
          if (relRes.data) relatedProducts = relRes.data;
        }
      }
    } catch {
      // Fallback
    }
  }

  if (supabase && !product) {
    notFound();
  }

  // Graceful fallback for mock preview if database isn't populated
  const displayProduct = product || {
    name: slug.replace(/-/g, ' ').toUpperCase(),
    description:
      'Distinguished furniture piece designed and manufactured by Scepter. Built using premium joinery and durable finishes.',
    availability: 'made-to-order',
    dimensions: 'Custom specifications upon request',
    materials: ['Solid Hardwood', 'Precision Hardware'],
    colours: ['Natural Timber', 'Espresso Stain'],
    customisation_options: ['Bespoke dimensions', 'Fabric & leather selection'],
    images: [],
    category: { name: 'Furniture', slug: 'furniture' },
  };

  const availabilityLabels = {
    'in-stock': 'In Stock',
    'made-to-order': 'Made to Order',
    'on-request': 'On Request',
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-ink">
      <Navbar whatsAppNumber={whatsAppNumber} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-20">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Furniture', href: '/furniture' },
            ...(displayProduct.category
              ? [
                  {
                    label: displayProduct.category.name,
                    href: `/furniture/category/${displayProduct.category.slug}`,
                  },
                ]
              : []),
            { label: displayProduct.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          {/* Gallery: 7 cols */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={displayProduct.images || []}
              productName={displayProduct.name}
            />
          </div>

          {/* Details & WhatsApp CTA: 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {displayProduct.category?.name && (
                <Link
                  href={`/furniture/category/${displayProduct.category.slug}`}
                  className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium hover:underline block"
                >
                  {displayProduct.category.name}
                </Link>
              )}

              <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-[0.08em] font-light text-navy-deep">
                {displayProduct.name}
              </h1>

              {/* Price on Request Notice */}
              <div className="border-y border-ink/10 py-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-ink/50 block">
                    Pricing
                  </span>
                  <span className="font-display text-xl uppercase tracking-wider text-navy-deep">
                    Price on Request
                  </span>
                </div>
                {displayProduct.availability && (
                  <span className="bg-navy-deep text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-medium">
                    {availabilityLabels[displayProduct.availability] || displayProduct.availability}
                  </span>
                )}
              </div>

              {/* Description */}
              {displayProduct.description && (
                <p className="text-sm text-ink/80 leading-relaxed font-normal">
                  {displayProduct.description}
                </p>
              )}

              {/* Specifications: Materials, Dimensions, Colours */}
              <div className="space-y-4 pt-2">
                {displayProduct.dimensions && (
                  <div className="border-b border-ink/5 pb-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-ink/60 block mb-1">
                      Dimensions
                    </span>
                    <span className="text-sm text-ink font-normal">
                      {displayProduct.dimensions}
                    </span>
                  </div>
                )}

                {displayProduct.materials && displayProduct.materials.length > 0 && (
                  <div className="border-b border-ink/5 pb-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-ink/60 block mb-1">
                      Materials
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {displayProduct.materials.map((mat, i) => (
                        <span
                          key={i}
                          className="text-xs bg-ink/5 text-ink px-2.5 py-1 border border-ink/10"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {displayProduct.colours && displayProduct.colours.length > 0 && (
                  <div className="border-b border-ink/5 pb-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-ink/60 block mb-1">
                      Available Colours & Finishes
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {displayProduct.colours.map((col, i) => (
                        <span
                          key={i}
                          className="text-xs bg-ink/5 text-ink px-2.5 py-1 border border-ink/10"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {displayProduct.customisation_options &&
                  displayProduct.customisation_options.length > 0 && (
                    <div className="border-b border-ink/5 pb-3">
                      <span className="text-xs font-medium uppercase tracking-wider text-accent-orange block mb-1">
                        Customisation Options
                      </span>
                      <ul className="list-disc list-inside text-xs text-ink/80 space-y-1">
                        {displayProduct.customisation_options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>

            {/* Primary Action */}
            <div className="space-y-3 pt-6 border-t border-ink/10">
              <WhatsAppButton
                number={whatsAppNumber}
                productName={displayProduct.name}
                className="w-full text-center py-4 text-xs uppercase tracking-widest font-medium"
              >
                Enquire via WhatsApp
              </WhatsAppButton>
              <p className="text-[11px] text-ink/50 text-center">
                Chat directly with our design and quoting team to confirm dimensions, timber finishes, and delivery charges.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-28 border-t border-ink/10 pt-16">
            <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
              Complementary Designs
            </span>
            <h2 className="font-display text-2xl uppercase tracking-[0.08em] font-light text-navy-deep mb-8">
              Related Pieces
            </h2>
            <ProductGrid>
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id || rel.slug}
                  product={rel}
                  whatsAppNumber={whatsAppNumber}
                />
              ))}
            </ProductGrid>
          </section>
        )}
      </main>

      <CTASection whatsAppNumber={whatsAppNumber} />
      <Footer />
    </div>
  );
}
