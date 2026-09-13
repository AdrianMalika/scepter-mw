'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ImageIcon, Loader2 } from 'lucide-react';

export default function GalleryPanel() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) {
        setError('Supabase is not configured.');
        setLoading(false);
        return;
      }
      const { data, error: err } = await supabase
        .from('products')
        .select('id, name, images')
        .not('images', 'is', null);

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      // Flatten all images with their product name for context
      const flat = (data || []).flatMap((product) =>
        (product.images || []).map((url) => ({ url, productName: product.name, productId: product.id }))
      );
      setImages(flat);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-light tracking-wide text-white">Gallery</h2>
        <p className="mt-1 text-sm text-white/50">Images currently attached to your products.</p>
      </div>

      {/* Info notice — no gallery table */}
      <div className="flex gap-3 border border-white/10 bg-navy-panel p-4 text-sm text-white/70">
        <ImageIcon size={16} className="shrink-0 mt-0.5 text-white/40" />
        <p>
          There is no standalone gallery table yet — these images come from your product catalogue.
          To add or remove an image, edit the product it belongs to.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-white/40">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span className="text-sm">Loading images…</span>
        </div>
      )}

      {error && !loading && (
        <div className="border border-red-300/20 bg-red-950/20 p-4 text-sm text-red-300">{error}</div>
      )}

      {!loading && !error && images.length === 0 && (
        <div className="py-20 text-center border border-dashed border-white/10">
          <ImageIcon size={32} className="mx-auto text-white/20 mb-3" />
          <p className="text-sm text-white/40">No images uploaded yet.</p>
          <p className="text-xs text-white/25 mt-1">
            Add images to products in the Products tab — they will appear here.
          </p>
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="group relative aspect-square bg-navy-panel border border-white/10 overflow-hidden">
              <img
                src={img.url}
                alt={img.productName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/90 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[11px] text-white/80 truncate">{img.productName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length > 0 && (
        <p className="text-xs text-white/30">{images.length} image{images.length !== 1 ? 's' : ''} across all products.</p>
      )}
    </div>
  );
}
