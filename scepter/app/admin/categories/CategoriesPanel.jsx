'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ImageIcon, Loader2, FolderOpen, AlertTriangle, Search, X as XIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import CategoryForm from './CategoryForm';

export default function CategoriesPanel() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formTarget, setFormTarget] = useState(null); // null = closed, {} = new, {id,...} = edit
  const [formOpen, setFormOpen] = useState(false);
  // deleteId: id pending confirmation, or null
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) { setError('Supabase is not configured.'); setLoading(false); return; }
    setLoading(true);
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('id, category'),
    ]);
    if (catRes.error) { setError(catRes.error.message); setLoading(false); return; }
    setCategories(catRes.data || []);
    setProducts(prodRes.data || []);
    setLoading(false);
  }, []);

  // The loader synchronizes the panel with Supabase when the section mounts.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // Count products per category
  const productCount = (catId) => products.filter((p) => p.category === catId).length;
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const openAdd = () => { setFormTarget({}); setFormOpen(true); };
  const openEdit = (cat) => { setFormTarget(cat); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setFormTarget(null); };

  const handleSaved = (saved) => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [...prev, saved].sort((a, b) => a.name.localeCompare(b.name));
    });
  };

  const handleDelete = async (catId) => {
    const count = productCount(catId);
    if (count > 0) {
      // warn instead of deleting
      return;
    }
    setDeleting(true);
    const supabase = createClient();
    const { error: delErr } = await supabase.from('categories').delete().eq('id', catId);
    if (delErr) {
      setError(delErr.message);
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== catId));
    }
    setConfirmDeleteId(null);
    setDeleting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-light tracking-wide text-white">Categories</h2>
          <p className="mt-1 text-sm text-white/50">Organise products into showroom categories.</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 bg-accent-orange hover:bg-accent-orange/90 text-white px-4 py-2.5 text-xs uppercase tracking-wider transition-colors shrink-0"
        >
          <Plus size={14} />
          Add Category
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories…"
          aria-label="Search categories"
          className="w-full bg-navy-panel border border-white/10 pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-accent-orange/60 transition-colors"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            aria-label="Clear category search"
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
          <span className="text-sm">Loading categories…</span>
        </div>
      )}

      {/* Empty */}
      {!loading && categories.length === 0 && (
        <div className="py-20 text-center border border-dashed border-white/10">
          <FolderOpen size={32} className="mx-auto text-white/20 mb-3" />
          <p className="text-sm text-white/40">No categories yet.</p>
          <button type="button" onClick={openAdd} className="mt-3 text-xs text-accent-orange hover:underline">
            Add your first category
          </button>
        </div>
      )}

      {/* List */}
      {!loading && categories.length > 0 && filteredCategories.length === 0 && (
        <div className="border border-dashed border-white/10 py-12 text-center">
          <p className="text-sm text-white/40">No categories match &ldquo;{search}&rdquo;.</p>
          <button type="button" onClick={() => setSearch('')} className="mt-2 text-xs text-accent-orange hover:underline">
            Clear search
          </button>
        </div>
      )}

      {!loading && filteredCategories.length > 0 && (
        <div className="border border-white/10 divide-y divide-white/5">
          {filteredCategories.map((cat) => {
            const count = productCount(cat.id);
            const isConfirming = confirmDeleteId === cat.id;
            const hasProducts = count > 0;

            return (
              <div
                key={cat.id}
                className="flex items-center gap-4 px-4 py-4 bg-navy-panel hover:bg-white/[0.02] transition-colors"
              >
                {/* Image */}
                <div className="shrink-0 w-10 h-10 border border-white/10 bg-navy-deep overflow-hidden flex items-center justify-center">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={16} className="text-white/20" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{cat.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {count} product{count !== 1 ? 's' : ''} · slug: {cat.slug}
                  </p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2">
                  {isConfirming ? (
                    hasProducts ? (
                      // Cannot delete — has products
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/30 border border-amber-400/20 px-3 py-1.5">
                          <AlertTriangle size={12} />
                          <span>{count} product{count !== 1 ? 's' : ''} still in this category — reassign them before deleting.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1.5 text-xs text-white/60 border border-white/15 hover:border-white/30 transition-colors"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      // Confirm delete
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-white/60">Delete <strong className="text-white">{cat.name}</strong>?</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          disabled={deleting}
                          className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white transition-colors disabled:opacity-60"
                        >
                          {deleting ? 'Deleting…' : 'Yes, delete'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1.5 text-white/60 border border-white/15 hover:border-white/30 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => openEdit(cat)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 border border-white/15 hover:border-white/30 hover:text-white transition-colors"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(cat.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/40 border border-white/10 hover:border-red-400/40 hover:text-red-400 transition-colors"
                        aria-label={`Delete ${cat.name}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Category form drawer */}
      {formOpen && (
        <CategoryForm
          category={formTarget?.id ? formTarget : null}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
