'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus, Search, Pencil, Trash2, Star, Loader2, Package, ImageIcon, X as XIcon
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ProductForm from './ProductForm';

const AVAILABILITY_LABELS = {
  'in-stock': 'In Stock',
  'made-to-order': 'Made to Order',
  'on-request': 'On Request',
};

const AVAILABILITY_COLORS = {
  'in-stock': 'bg-green-900/50 text-green-300 border-green-700/30',
  'made-to-order': 'bg-amber-900/30 text-amber-300 border-amber-700/30',
  'on-request': 'bg-white/5 text-white/50 border-white/10',
};

export default function ProductsPanel() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add new
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) { setError('Supabase is not configured.'); setLoading(false); return; }
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase
        .from('products')
        .select('*, category:categories(id, slug, name)')
        .order('name'),
      supabase.from('categories').select('*').order('name'),
    ]);
    if (prodRes.error) { setError(prodRes.error.message); setLoading(false); return; }
    setProducts(prodRes.data || []);
    setCategories(catRes.data || []);
    setLoading(false);
  }, []);

  // The loader synchronizes the panel with Supabase when the section mounts.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // Live search filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  const openAdd = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (product) => { setEditTarget(product); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditTarget(null); };

  const handleSaved = (saved) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [...prev, saved].sort((a, b) => a.name.localeCompare(b.name));
    });
  };

  const handleDelete = async (productId) => {
    setDeleting(true);
    const supabase = createClient();
    const { error: delErr } = await supabase.from('products').delete().eq('id', productId);
    if (delErr) {
      setError(delErr.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
    setConfirmDeleteId(null);
    setDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-light tracking-wide text-white">Products</h2>
          <p className="mt-1 text-sm text-white/50">
            {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} in your catalogue`}
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 bg-accent-orange hover:bg-accent-orange/90 text-white px-4 py-2.5 text-xs uppercase tracking-wider transition-colors shrink-0"
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name…"
          className="w-full bg-navy-panel border border-white/10 pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-accent-orange/60 transition-colors"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            <XIcon size={14} />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-300/20 bg-red-950/20 p-3 text-sm text-red-300">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-white/40">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span className="text-sm">Loading products…</span>
        </div>
      )}

      {/* Empty state — no products at all */}
      {!loading && products.length === 0 && (
        <div className="py-20 text-center border border-dashed border-white/10">
          <Package size={32} className="mx-auto text-white/20 mb-3" />
          <p className="text-sm text-white/40">No products yet.</p>
          <button type="button" onClick={openAdd} className="mt-3 text-xs text-accent-orange hover:underline">
            Add your first product
          </button>
        </div>
      )}

      {/* Empty state — search returned nothing */}
      {!loading && products.length > 0 && filtered.length === 0 && (
        <div className="py-12 text-center border border-dashed border-white/10">
          <p className="text-sm text-white/40">No products match &ldquo;{search}&rdquo;.</p>
          <button type="button" onClick={() => setSearch('')} className="mt-2 text-xs text-accent-orange hover:underline">
            Clear search
          </button>
        </div>
      )}

      {/* Product list */}
      {!loading && filtered.length > 0 && (
        <div className="border border-white/10 divide-y divide-white/5 overflow-hidden">
          {/* Table header — desktop only */}
          <div className="hidden sm:grid grid-cols-[48px_1fr_140px_120px_40px_auto] gap-4 items-center px-4 py-2 bg-navy-deep">
            <div />
            <p className="text-[10px] uppercase tracking-wider text-white/30">Name</p>
            <p className="text-[10px] uppercase tracking-wider text-white/30">Category</p>
            <p className="text-[10px] uppercase tracking-wider text-white/30">Availability</p>
            <p className="text-[10px] uppercase tracking-wider text-white/30 text-center">★</p>
            <p className="text-[10px] uppercase tracking-wider text-white/30">Actions</p>
          </div>

          {filtered.map((product) => {
            const coverImage = product.images?.[0];
            const catName = product.category?.name || '—';
            const isConfirming = confirmDeleteId === product.id;

            return (
              <div
                key={product.id}
                className="bg-navy-panel hover:bg-white/[0.02] transition-colors"
              >
                {/* Main row */}
                <div className="grid grid-cols-[48px_1fr] sm:grid-cols-[48px_1fr_140px_120px_40px_auto] gap-4 items-center px-4 py-3">
                  {/* Thumbnail */}
                  <div className="w-10 h-10 shrink-0 border border-white/10 bg-navy-deep overflow-hidden flex items-center justify-center">
                    {coverImage ? (
                      <img src={coverImage} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={16} className="text-white/20" />
                    )}
                  </div>

                  {/* Name + mobile meta */}
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{product.name}</p>
                    {/* Mobile-only metadata */}
                    <div className="sm:hidden mt-1 flex flex-wrap gap-2 items-center">
                      <span className="text-xs text-white/40">{catName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 border ${AVAILABILITY_COLORS[product.availability] || AVAILABILITY_COLORS['on-request']}`}>
                        {AVAILABILITY_LABELS[product.availability] || product.availability}
                      </span>
                      {product.featured && <Star size={12} className="text-accent-orange fill-accent-orange" />}
                    </div>
                  </div>

                  {/* Category — desktop */}
                  <p className="hidden sm:block text-xs text-white/50 truncate">{catName}</p>

                  {/* Availability badge — desktop */}
                  <div className="hidden sm:flex">
                    <span className={`text-[10px] px-2 py-1 border ${AVAILABILITY_COLORS[product.availability] || AVAILABILITY_COLORS['on-request']}`}>
                      {AVAILABILITY_LABELS[product.availability] || product.availability}
                    </span>
                  </div>

                  {/* Featured star — desktop */}
                  <div className="hidden sm:flex items-center justify-center">
                    {product.featured && (
                      <Star size={14} className="text-accent-orange fill-accent-orange" aria-label="Featured" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 col-start-2 sm:col-start-auto justify-end sm:justify-start">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 border border-white/15 hover:border-white/30 hover:text-white transition-colors"
                    >
                      <Pencil size={11} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(product.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white/30 border border-white/10 hover:border-red-400/40 hover:text-red-400 transition-colors"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                {/* Inline delete confirmation row */}
                {isConfirming && (
                  <div className="px-4 py-3 border-t border-white/5 bg-navy-deep/50 flex items-center gap-3">
                    <p className="text-xs text-white/70 flex-1">
                      Delete <strong className="text-white">{product.name}</strong>? This cannot be undone.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting}
                      className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs transition-colors disabled:opacity-60"
                    >
                      {deleting ? 'Deleting…' : 'Yes, delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1.5 text-xs text-white/50 border border-white/15 hover:border-white/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Form drawer */}
      {formOpen && (
        <ProductForm
          product={editTarget}
          categories={categories}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
