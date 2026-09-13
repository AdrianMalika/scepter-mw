'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/app/admin/lib/slugify';

/**
 * Add / Edit category drawer.
 * Props:
 *  - category: existing category object (null for new)
 *  - onClose: () => void
 *  - onSaved: (category) => void
 */
export default function CategoryForm({ category, onClose, onSaved }) {
  const isEditing = Boolean(category?.id);

  const [name, setName] = useState(category?.name || '');
  const [imageUrl, setImageUrl] = useState(category?.image || '');
  const [nameError, setNameError] = useState('');
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const [saveError, setSaveError] = useState('');

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const derivedSlug = slugify(name);

  const validateName = (value) => {
    if (!value.trim()) { setNameError('Category name is required.'); return false; }
    setNameError('');
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateName(name)) return;
    setSaveState('saving');
    setSaveError('');

    const supabase = createClient();
    if (!supabase) {
      setSaveState('error');
      setSaveError('Supabase is not configured.');
      return;
    }

    const payload = {
      name: name.trim(),
      slug: isEditing ? category.slug : derivedSlug,
      image: imageUrl.trim() || null,
    };

    let result;
    if (isEditing) {
      result = await supabase.from('categories').update(payload).eq('id', category.id).select().single();
    } else {
      result = await supabase.from('categories').insert(payload).select().single();
    }

    if (result.error) {
      setSaveState('error');
      setSaveError(result.error.message || 'Something went wrong. Please try again.');
      return;
    }

    setSaveState('saved');
    setTimeout(() => {
      onSaved(result.data);
      onClose();
    }, 800);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-navy-panel border-l border-white/10 flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? 'Edit Category' : 'Add Category'}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0">
          <div>
            <p className="text-xs uppercase tracking-wider text-accent-orange">
              {isEditing ? 'Edit' : 'New'}
            </p>
            <h2 className="font-display text-xl font-light text-white mt-0.5">
              {isEditing ? 'Edit Category' : 'Add Category'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-white/60">
              Category Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameError) validateName(e.target.value); }}
              onBlur={(e) => validateName(e.target.value)}
              placeholder="e.g. Chairs"
              className={`w-full bg-navy-deep border px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-accent-orange
                ${nameError ? 'border-red-400' : 'border-white/15'}`}
            />
            {nameError && <p className="text-[11px] text-red-400">{nameError}</p>}
            {name && !nameError && (
              <p className="text-[11px] text-white/30">Slug: {derivedSlug}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-white/60">
              Category Image URL <span className="text-white/30 normal-case tracking-normal text-[11px]">(optional)</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-navy-deep border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-accent-orange"
            />
            <p className="text-[11px] text-white/30">
              Paste a direct image URL. This image appears on the homepage category cards.
            </p>
            {imageUrl && (
              <div className="mt-2 aspect-video w-full overflow-hidden border border-white/10 bg-navy-deep">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                />
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4 shrink-0 space-y-3">
          {saveState === 'error' && (
            <p className="text-xs text-red-400">{saveError}</p>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/15 px-4 py-2.5 text-xs uppercase tracking-wider text-white/60 hover:text-white hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={undefined}
              onClick={handleSave}
              disabled={saveState === 'saving' || saveState === 'saved'}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider transition-colors
                ${saveState === 'saved'
                  ? 'bg-green-700 text-white cursor-default'
                  : saveState === 'error'
                  ? 'bg-red-700 hover:bg-red-600 text-white'
                  : 'bg-accent-orange hover:bg-accent-orange/90 text-white disabled:opacity-60 disabled:cursor-wait'
                }`}
            >
              {saveState === 'saving' && <Loader2 size={14} className="animate-spin" />}
              {saveState === 'saving' && 'Saving…'}
              {saveState === 'saved' && '✓ Saved'}
              {saveState === 'error' && 'Try Again'}
              {saveState === 'idle' && (isEditing ? 'Save Changes' : 'Add Category')}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
