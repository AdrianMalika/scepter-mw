import React from 'react';
import Link from 'next/link';

export default function Breadcrumb({ items }) {
  // items: array of { label: string, href?: string }
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center space-x-2 text-xs uppercase tracking-wider">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="text-ink/30 mx-2 select-none" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span className="font-medium text-ink" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-ink/60 hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
