import React from 'react';

export default function PageLoading({ label = 'Loading showroom' }) {
  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-ink">
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-20">
        <div className="h-3 w-28 bg-ink/10 animate-pulse" />
        <div className="mt-8 h-10 w-64 max-w-full bg-ink/10 animate-pulse" />
        <p className="mt-4 text-xs uppercase tracking-[0.15em] text-ink/45">
          {label}
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white border border-ink/10">
              <div className="aspect-4/3 bg-ink/5 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-2/3 bg-ink/10 animate-pulse" />
                <div className="h-3 w-full bg-ink/10 animate-pulse" />
                <div className="h-3 w-4/5 bg-ink/10 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
