'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/app/admin/lib/slugify';
import TagInput from './TagInput';
import ImageUploader from './ImageUploader';

const AVAILABILITY_OPTIONS = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'made-to-order', label: 'Made to Order' },
  { value: 'on-request', label: 'On Request' },
];

const EMPTY_FORM = {
  name: '',
  category: '',
  description: '',
  images: [],
  materials: [],
  colours: [],
  dimensions: '',
  customisation_options: [],
  availability: 'on-request',
  featured: false,
};

/**
 * Add / Edit product drawer.
 * Props:
 *  - product: existing product object (null for new)
 *  - categories: array of category objects
 *  - onClose: () => void
 *  - onSaved: (product) => void
 */
export default function ProductForm({ product, categories = [], onClose, onSaved }) {
  const isEditing = Boolean(product?.id);

  const [form, setForm] = useState(() =>
    isEditing
      ? {
          name: product.name || '',
          category: product.category?.id || product.category || '',
          description: product.description || '',
          images: product.images || [],
          materials: product.materials || [],
          colours: product.colours || [],
          dimensions: product.dimensions || '',
          customisation_options: product.customisation_options || [],
          availability: product.availability || 'on-request',
          featured: product.featured || false,
        }
      : { ...EMPTY_FORM }
  );

  const [errors, setErrors] = useState({});
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const [saveError, setSaveError] = useState('');

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const derivedSlug = isEditing ? product.slug : slugify(form.name);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateField = (field, value) => {
    if (field === 'name' && !String(value).trim()) return 'Product name is required.';
    if (field === 'category' && !value) return 'Please select a category.';
    return '';
  };

  const handleBlur = (field) => {
    const err = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validate = () => {
    const newErrors = {};
    ['name', 'category'].forEach((f) => {
      const err = validateField(f, form[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaveState('saving');
    setSaveError('');

    const supabase = createClient();
    if (!supabase) {
      setSaveState('error');
      setSaveError('Supabase is not configured.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category || null,
      description: form.description.trim() || null,
      images: form.images,
      materials: form.materials,
      colours: form.colours,
      dimensions: form.dimensions.trim() || null,
      customisation_options: form.customisation_options,
      availability: form.availability,
      featured: form.featured,
    };

    let result;
    if (isEditing) {
      const updateResult = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id);

      if (updateResult.error) {
        setSaveState('error');
        setSaveError(updateResult.error.message || 'Something went wrong. Please try again.');
        return;
      }

      result = await supabase
        .from('products')
        .select('*, category:categories(id, slug, name)')
        .eq('id', product.id)
        .maybeSingle();

      if (!result.data && !result.error) {
        setSaveState('error');
        setSaveError('The product was not found after saving. Please refresh and try again.');
        return;
      }
    } else {
      result = await supabase
        .from('products')
        .insert({ ...payload, slug: derivedSlug })
        .select('*, category:categories(id, slug, name)')
        .single();
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
        className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-navy-panel border-l border-white/10 flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={isEditing ? 'Edit Product' : 'Add Product'}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0">
          <div>
            <p className="text-xs uppercase tracking-wider text-accent-orange">
              {isEditing ? 'Edit' : 'New'}
            </p>
            <h2 className="font-display text-xl font-light text-white mt-0.5">
              {isEditing ? 'Edit Product' : 'Add Product'}
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

        {/* Scrollable form body */}
        <form
          id="product-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-7"
        >
          {/* ── ESSENTIALS ── */}
          <fieldset className="space-y-5">
            <legend className="text-[10px] uppercase tracking-widest text-white/30 pb-2 border-b border-white/10 w-full">
              Essential Details
            </legend>

            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-white/60">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="e.g. Modern Lounge Chair"
                className={`w-full bg-navy-deep border px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-accent-orange
                  ${errors.name ? 'border-red-400' : 'border-white/15'}`}
              />
              {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
              {form.name && !errors.name && (
                <p className="text-[11px] text-white/30">
                  URL: /furniture/product/{derivedSlug}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-white/60">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                onBlur={() => handleBlur('category')}
                className={`w-full bg-navy-deep border px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent-orange appearance-none
                  ${errors.category ? 'border-red-400' : 'border-white/15'}
                  ${!form.category ? 'text-white/40' : 'text-white'}`}
              >
                <option value="" disabled>Select a category…</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-[11px] text-red-400">{errors.category}</p>}
              {categories.length === 0 && (
                <p className="text-[11px] text-amber-400">No categories yet — add one in the Categories tab first.</p>
              )}
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-white/60">
                Availability
              </label>
              <div className="flex border border-white/15 overflow-hidden">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('availability', opt.value)}
                    className={`flex-1 py-2.5 text-xs uppercase tracking-wider transition-colors
                      ${form.availability === opt.value
                        ? 'bg-accent-orange text-white'
                        : 'bg-navy-deep text-white/50 hover:text-white hover:bg-white/5'
                      }
                      not-first:border-l not-first:border-white/15`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/60">Featured</p>
                <p className="text-[11px] text-white/30 mt-0.5">Show on the homepage showcase</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.featured}
                onClick={() => set('featured', !form.featured)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0
                  ${form.featured ? 'bg-accent-orange' : 'bg-white/15'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform
                    ${form.featured ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </fieldset>

          {/* ── DESCRIPTION ── */}
          <fieldset className="space-y-5">
            <legend className="text-[10px] uppercase tracking-widest text-white/30 pb-2 border-b border-white/10 w-full">
              Description
            </legend>
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-white/60">
                Description <span className="text-white/30 normal-case tracking-normal text-[11px]">(optional)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe this piece — materials, style, intended use…"
                rows={4}
                className="w-full bg-navy-deep border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-accent-orange resize-none"
              />
            </div>
          </fieldset>

          {/* ── IMAGES ── */}
          <fieldset className="space-y-5">
            <legend className="text-[10px] uppercase tracking-widest text-white/30 pb-2 border-b border-white/10 w-full">
              Images
            </legend>
            <ImageUploader
              images={form.images}
              onChange={(imgs) => set('images', imgs)}
            />
          </fieldset>

          {/* ── ADDITIONAL DETAILS ── */}
          <fieldset className="space-y-5">
            <legend className="text-[10px] uppercase tracking-widest text-white/30 pb-2 border-b border-white/10 w-full">
              Additional Details <span className="normal-case tracking-normal font-sans text-[10px]">(optional)</span>
            </legend>

            {/* Materials */}
            <TagInput
              label="Materials"
              tags={form.materials}
              onChange={(v) => set('materials', v)}
              placeholder="e.g. Hardwood frame"
              helper="Press Enter or comma to add each material"
            />

            {/* Colours */}
            <TagInput
              label="Available Colours"
              tags={form.colours}
              onChange={(v) => set('colours', v)}
              placeholder="e.g. Charcoal"
              helper="Press Enter or comma to add each colour"
            />

            {/* Dimensions */}
            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-white/60">Dimensions</label>
              <input
                type="text"
                value={form.dimensions}
                onChange={(e) => set('dimensions', e.target.value)}
                placeholder="e.g. 80 × 78 × 85 cm"
                className="w-full bg-navy-deep border border-white/15 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-accent-orange"
              />
              <p className="text-[11px] text-white/30">Width × Depth × Height, or however you measure it</p>
            </div>

            {/* Customisation Options */}
            <TagInput
              label="Customisation Options"
              tags={form.customisation_options}
              onChange={(v) => set('customisation_options', v)}
              placeholder="e.g. Fabric colour"
              helper="Options customers can request when ordering"
            />
          </fieldset>
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
              form="product-form"
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
              {saveState === 'saved' && 'Saved successfully'}
              {saveState === 'error' && 'Try Again'}
              {saveState === 'idle' && 'Save product'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
