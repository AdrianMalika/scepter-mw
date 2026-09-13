'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        setErrorMsg('Supabase is not configured. Please ensure environment variables are present.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid login credentials.');
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during authentication.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white px-6">
      <div className="w-full max-w-md bg-white border border-ink/10 p-8 sm:p-10 shadow-xs">
        <div className="mb-8 text-center flex flex-col items-center">
          <Logo variant="light" width={175} height={40} className="mb-3" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-accent-orange font-medium block">
            Admin Portal
          </span>
          <p className="text-xs text-ink/60 mt-1">
            Catalogue and product management
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-xs text-red-800">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-ink/70 font-medium mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@scepter.mw"
              className="w-full px-3.5 py-2.5 bg-warm-white border border-ink/15 text-sm text-ink focus:outline-hidden focus:border-navy-deep"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-ink/70 font-medium mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-warm-white border border-ink/15 text-sm text-ink focus:outline-hidden focus:border-navy-deep"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-navy-deep text-white hover:bg-navy-panel transition-colors text-xs uppercase tracking-widest font-medium disabled:opacity-60"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-ink/10 text-center">
          <Link
            href="/"
            className="text-xs text-ink/60 hover:text-navy-deep transition-colors"
          >
            ← Return to Showroom
          </Link>
        </div>
      </div>
    </div>
  );
}
