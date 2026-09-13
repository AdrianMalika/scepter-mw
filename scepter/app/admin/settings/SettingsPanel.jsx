'use client';

import React from 'react';
import { Info, Phone } from 'lucide-react';

export default function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-light tracking-wide text-white">Settings</h2>
        <p className="mt-1 text-sm text-white/50">Showroom contact and display settings.</p>
      </div>

      <div className="flex gap-3 border border-accent-orange/30 bg-accent-orange/5 p-4">
        <Info size={16} className="shrink-0 mt-0.5 text-accent-orange" />
        <div className="text-sm text-white/80 space-y-2">
          <p className="font-medium text-white">Settings are not yet stored in the database.</p>
          <p>
            Your current values are application defaults. To make them editable from this
            dashboard, a <code className="bg-white/10 px-1 py-0.5 text-xs">settings</code> table
            needs to be created in Supabase first.
          </p>
        </div>
      </div>

      <div className="border border-white/10 bg-navy-panel">
        <div className="border-b border-white/10 px-5 py-3">
          <p className="text-xs uppercase tracking-wider text-white/40">Current values (read-only)</p>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div className="flex items-start gap-3">
            <Phone size={16} className="shrink-0 mt-0.5 text-white/40" />
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">WhatsApp Number</p>
              <p className="text-sm text-white font-mono">+265 889 545 477</p>
              <p className="text-xs text-white/30 mt-1">This is the number customers reach when they tap &quot;Request Quote&quot;.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-white/10 bg-navy-panel px-5 py-4 space-y-2">
        <p className="text-xs uppercase tracking-wider text-white/40">How to enable editable settings</p>
        <p className="text-sm text-white/70 leading-relaxed">
          Create a <code className="bg-white/10 px-1 py-0.5 text-xs">settings</code> table in Supabase with columns{' '}
          <code className="bg-white/10 px-1 py-0.5 text-xs">key</code> (text, primary key) and{' '}
          <code className="bg-white/10 px-1 py-0.5 text-xs">value</code> (text). Then insert a row with{' '}
          <code className="bg-white/10 px-1 py-0.5 text-xs">key = &apos;whatsapp_number&apos;</code> and your number as the value.
          The settings form can be built here once that table exists.
        </p>
      </div>
    </div>
  );
}
