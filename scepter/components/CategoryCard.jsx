import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      href={`/furniture/category/${category.slug}`}
      className="group relative block aspect-3/2 overflow-hidden bg-navy-deep border border-ink/10 interactive-card"
    >
      {category.image ? (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center opacity-85 group-hover:scale-103 group-hover:opacity-75 transition-all duration-300"
        />
      ) : (
        <div className="w-full h-full bg-navy-panel/40 flex items-center justify-center text-white/20 text-xs tracking-wider uppercase">
          {category.name}
        </div>
      )}

      {/* Photographic dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-transparent flex flex-col justify-end p-6">
        <h3 className="font-display text-xl font-light uppercase tracking-[0.1em] text-white group-hover:text-accent-orange transition-colors">
          {category.name}
        </h3>
        <span className="text-xs uppercase tracking-widest text-white/60 mt-1 inline-flex items-center gap-1">
          Explore Category
          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
