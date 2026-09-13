import React from 'react';

export default function ProductGrid({ children, className = '' }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 ${className}`}
    >
      {children}
    </div>
  );
}
