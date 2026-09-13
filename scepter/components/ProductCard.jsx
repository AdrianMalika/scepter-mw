'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WhatsAppButton from './WhatsAppButton';

export default function ProductCard({ product, whatsAppNumber }) {
  if (!product) return null;

  // The first image is the cover
  const coverImage = product.images && product.images.length > 0
    ? product.images[0]
    : null;

  const availabilityLabels = {
    'in-stock': 'In Stock',
    'made-to-order': 'Made to Order',
    'on-request': 'On Request',
  };

  return (
    <div className="group flex flex-col bg-white border border-ink/10 overflow-hidden transition-colors hover:border-ink/20 interactive-card">
      {/* Product Image */}
      <Link
        href={`/furniture/product/${product.slug}`}
        className="relative aspect-4/3 w-full bg-warm-white overflow-hidden block"
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 text-xs tracking-wider uppercase">
            No Image Available
          </div>
        )}

        {/* Availability tag */}
        {product.availability && (
          <div className="absolute top-3 left-3 bg-warm-white/90 backdrop-blur-xs border border-ink/10 px-2 py-1 text-[10px] uppercase tracking-widest font-medium text-ink">
            {availabilityLabels[product.availability] || product.availability}
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {product.category?.name && (
            <span className="text-[11px] uppercase tracking-wider text-accent-orange font-medium block mb-1">
              {product.category.name}
            </span>
          )}
          <Link href={`/furniture/product/${product.slug}`}>
            <h3 className="font-display text-lg tracking-wide text-navy-deep group-hover:text-accent-orange transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="text-xs text-ink/70 mt-2 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Action / Quote */}
        <div className="mt-5 pt-4 border-t border-ink/5 flex items-center justify-between">
          <span className="text-xs tracking-wide text-ink/60 font-medium">
            Price on Request
          </span>
          <WhatsAppButton
            number={whatsAppNumber}
            productName={product.name}
            variant="link"
          >
            Request Quote
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
