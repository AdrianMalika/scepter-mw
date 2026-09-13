'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Package, FolderOpen, Image, Settings } from 'lucide-react';
import ProductsPanel from './products/ProductsPanel';
import CategoriesPanel from './categories/CategoriesPanel';
import GalleryPanel from './gallery/GalleryPanel';
import SettingsPanel from './settings/SettingsPanel';

const TABS = [
  { id: 'products', label: 'Products', Icon: Package },
  { id: 'categories', label: 'Categories', Icon: FolderOpen },
  { id: 'gallery', label: 'Gallery', Icon: Image },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export default function AdminDashboard({ email }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = async () => {
    setLogoutError('');
    setIsLoggingOut(true);
    const supabase = createClient();
    if (!supabase) {
      setLogoutError('Supabase is not configured.');
      setIsLoggingOut(false);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLogoutError(error.message || 'Unable to sign out. Please try again.');
      setIsLoggingOut(false);
      return;
    }
    router.replace('/admin/login');
    router.refresh();
  };

  const ActivePanel = {
    products: ProductsPanel,
    categories: CategoriesPanel,
    gallery: GalleryPanel,
    settings: SettingsPanel,
  }[activeTab];

  return (
    <div className="admin-shell min-h-screen bg-navy-deep text-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-navy-deep/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-accent-orange font-medium">Scepter MW</span>
            <span className="text-white/20">/</span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/60">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-white/40 truncate max-w-[200px]">{email}</span>
            {logoutError && (
              <span className="text-xs text-red-400">{logoutError}</span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-xs uppercase tracking-widest text-white/50 border border-white/15 px-3 py-1.5 hover:border-white/30 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoggingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar nav — desktop */}
        <nav className="hidden md:flex flex-col w-52 shrink-0 border-r border-white/10 bg-navy-panel/50 py-6 px-3">
          <p className="text-[10px] uppercase tracking-widest text-white/25 px-3 mb-3">Management</p>
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left w-full
                ${activeTab === id
                  ? 'text-white bg-accent-orange/15 border-l-2 border-accent-orange'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }`}
            >
              <Icon size={16} className={activeTab === id ? 'text-accent-orange' : 'text-white/30'} />
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-navy-panel border-t border-white/10 flex">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] uppercase tracking-wider transition-colors
                ${activeTab === id ? 'text-accent-orange' : 'text-white/40 hover:text-white/60'}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-8 py-8 pb-24 md:pb-8 min-w-0">
          {ActivePanel && <ActivePanel />}
        </main>
      </div>
    </div>
  );
}
