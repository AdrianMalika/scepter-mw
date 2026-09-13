'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const SECTIONS = [
  {
    title: 'Products',
    description: 'Manage furniture pieces and catalogue details.',
  },
  {
    title: 'Categories',
    description: 'Organise products into showroom categories.',
  },
  {
    title: 'Gallery',
    description: 'Review images used across the public gallery.',
  },
  {
    title: 'Settings',
    description: 'Manage showroom contact and display settings.',
  },
];

export default function AdminDashboard({ email }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogout = async () => {
    setErrorMessage('');
    setIsLoggingOut(true);

    const supabase = createClient();
    if (!supabase) {
      setErrorMessage('Supabase is not configured.');
      setIsLoggingOut(false);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      setErrorMessage(error.message || 'Unable to sign out. Please try again.');
      setIsLoggingOut(false);
      return;
    }

    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-navy-deep text-warm-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-orange">
              Scepter MW
            </p>
            <h1 className="mt-2 font-display text-3xl font-light tracking-[0.08em] sm:text-4xl">
              Admin
            </h1>
            <p className="mt-2 text-sm text-white/60">{email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="border border-white/20 px-5 py-2.5 text-xs uppercase tracking-widest text-white transition-colors hover:border-accent-orange hover:text-accent-orange disabled:cursor-wait disabled:opacity-60"
          >
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </header>

        {errorMessage && (
          <div className="mt-6 border border-red-300/30 bg-red-950/30 p-3 text-sm text-red-100">
            {errorMessage}
          </div>
        )}

        <section className="flex-1 py-12">
          <p className="text-xs uppercase tracking-[0.18em] text-accent-orange">
            Showroom management
          </p>
          <h2 className="mt-3 font-display text-2xl font-light tracking-wide text-white">
            Scepter MW Admin
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {SECTIONS.map((section) => (
              <div
                key={section.title}
                className="border border-white/10 bg-navy-panel p-6"
              >
                <h3 className="font-display text-xl font-light tracking-wide text-white">
                  {section.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {section.description}
                </p>
                <span className="mt-6 inline-block text-[10px] uppercase tracking-widest text-accent-orange">
                  Coming soon
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
