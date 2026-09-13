import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import CategorySwitcher from '@/components/CategorySwitcher';
import Breadcrumb from '@/components/Breadcrumb';
import CTASection from '@/components/CTASection';
import { createPublicClient } from '@/lib/supabase/server';
import { getWhatsAppNumber } from '@/lib/whatsapp-server';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function FurniturePage() {
  const whatsAppNumber = await getWhatsAppNumber();
  const supabase = createPublicClient();

  let products = [];
  let categories = [];

  if (supabase) {
    try {
      const [prodRes, catRes] = await Promise.all([
        supabase
          .from('products')
          .select('id, slug, name, description, images, availability, category:categories(id, slug, name)')
          .order('name'),
        supabase.from('categories').select('id, slug, name, image').order('name'),
      ]);

      if (!prodRes.error && prodRes.data) {
        products = prodRes.data;
      }
      if (!catRes.error && catRes.data) {
        categories = catRes.data;
      }
    } catch {
      // Empty or error state handled gracefully
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-ink">
      <Navbar whatsAppNumber={whatsAppNumber} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-20">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Furniture' },
          ]}
        />

        <div className="my-8">
          <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
            The Scepter Catalogue
          </span>
          <h1 className="font-display text-4xl uppercase tracking-[0.08em] font-light text-navy-deep">
            All Furniture
          </h1>
          <p className="text-sm text-ink/70 mt-2 max-w-2xl">
            Explore our digital showroom collection of ready-made pieces and custom-built furnishings. All pieces are built to order or stocked in limited quantities.
          </p>
        </div>

        {/* Category switcher */}
        <CategorySwitcher categories={categories} currentSlug={null} />

        {/* Product listing */}
        {products.length > 0 ? (
          <ProductGrid>
            {products.map((product) => (
              <ProductCard
                key={product.id || product.slug}
                product={product}
                whatsAppNumber={whatsAppNumber}
              />
            ))}
          </ProductGrid>
        ) : (
          <div className="py-20 text-center border border-dashed border-ink/15 p-12 bg-white">
            <h3 className="font-display text-xl uppercase tracking-wider text-navy-deep mb-2">
              No Pieces Displayed Yet
            </h3>
            <p className="text-sm text-ink/60 max-w-md mx-auto">
              Our catalogue is being updated with our latest furniture designs. You can enquire directly via WhatsApp for specific commissions or custom orders.
            </p>
          </div>
        )}
      </main>

      <CTASection whatsAppNumber={whatsAppNumber} />
      <Footer />
    </div>
  );
}
