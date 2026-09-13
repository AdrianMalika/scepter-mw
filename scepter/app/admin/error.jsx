'use client';

import React, { useEffect } from 'react';

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error('Admin area error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-navy-deep px-6 py-16 text-warm-white">
      <div className="mx-auto max-w-md border border-white/10 bg-navy-panel p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-accent-orange">
          Admin error
        </p>
        <h1 className="mt-3 font-display text-2xl font-light">
          The dashboard could not load.
        </h1>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 bg-accent-orange px-5 py-3 text-xs uppercase tracking-widest text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
