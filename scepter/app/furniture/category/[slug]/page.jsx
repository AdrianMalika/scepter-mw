import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
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

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const whatsAppNumber = await getWhatsAppNumber();
  const supabase = createPublicClient();

  let category = null;
  let categories = [];
  let products = [];

  if (supabase) {
    try {
      const [catListRes, currentCatRes] = await Promise.all([
        supabase.from('categories').select('id, slug, name, image').order('name'),
        supabase.from('categories').select('id, slug, name, image').eq('slug', slug).single(),
      ]);

      if (catListRes.data) categories = catListRes.data;
      if (currentCatRes.data) {
        category = currentCatRes.data;
        const prodRes = await supabase
          .from('products')
          .select('id, slug, name, description, images, availability, category:categories(id, slug, name)')
          .eq('category_id', category.id)
          .order('name');
        if (prodRes.data) products = prodRes.data;
      }
    } catch {
      // Fallback
    }
  }

  // If database is active and category is not found
  if (supabase && !category && categories.length > 0) {
    notFound();
  }

  const categoryName = category?.name || slug.replace(/-/g, ' ');

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-ink">
      <Navbar whatsAppNumber={whatsAppNumber} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-20">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Furniture', href: '/furniture' },
            { label: categoryName },
          ]}
        />

        <div className="my-8">
          <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block mb-2">
            Category Showcase
          </span>
          <h1 className="font-display text-4xl uppercase tracking-[0.08em] font-light text-navy-deep capitalize">
            {categoryName}
          </h1>
          <p className="text-sm text-ink/70 mt-2 max-w-2xl">
            Explore our handcrafted {categoryName.toLowerCase()} designed for residences and institutional spaces.
          </p>
        </div>

        {/* Category switcher */}
        <CategorySwitcher categories={categories} currentSlug={slug} />

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
              No Pieces in this Category
            </h3>
            <p className="text-sm text-ink/60 max-w-md mx-auto mb-6">
              There are currently no items catalogued under this category. We design and build custom items upon request.
            </p>
            <Link
              href="/furniture"
              className="inline-block text-xs uppercase tracking-widest font-medium border border-navy-deep text-navy-deep px-5 py-2.5 hover:bg-navy-deep hover:text-white transition-colors"
            >
              Browse Other Categories
            </Link>
          </div>
        )}
      </main>

      <CTASection whatsAppNumber={whatsAppNumber} />
      <Footer />
    </div>
  );
}
