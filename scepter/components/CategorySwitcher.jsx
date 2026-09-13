'use client';

import React from 'react';
import Link from 'next/link';

export default function CategorySwitcher({ categories, currentSlug }) {
  return (
    <div className="w-full border-b border-ink/10 mb-8 overflow-x-auto no-scrollbar">
      <div className="flex items-center space-x-6 min-w-max py-3 px-1">
        <Link
          href="/furniture"
          className={`relative pb-2 text-sm tracking-wide transition-colors ${
            !currentSlug
              ? 'font-medium text-navy-deep'
              : 'font-normal text-ink/70 hover:text-navy-deep'
          }`}
        >
          All Furniture
          {!currentSlug && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-orange" />
          )}
        </Link>

        {categories?.map((cat) => {
          const isActive = currentSlug === cat.slug;
          return (
            <Link
              key={cat.id || cat.slug}
              href={`/furniture/category/${cat.slug}`}
              className={`relative pb-2 text-sm tracking-wide transition-colors ${
                isActive
                  ? 'font-medium text-navy-deep'
                  : 'font-normal text-ink/70 hover:text-navy-deep'
              }`}
            >
              {cat.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-orange" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
