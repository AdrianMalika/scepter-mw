'use client';

import React, { useState, useRef, useCallback, useId } from 'react';
import { Upload, X, GripVertical, AlertCircle, ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'products';

/**
 * Drag-and-drop + click-to-browse image uploader.
 * Uploads immediately to Supabase Storage on file selection.
 * Shows thumbnail grid with delete and drag-to-reorder.
 */
export default function ImageUploader({ images = [], onChange }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const fileInputRef = useRef(null);
  const inputId = useId();

  const uploadFiles = useCallback(async (files) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const supabase = createClient();
    if (!supabase) {
      setUploadError('Supabase is not configured.');
      return;
    }

    setUploading(true);
    setUploadError('');

    const newUrls = [...images];

    for (const file of imageFiles) {
      const ext = file.name.split('.').pop().toLowerCase();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, { cacheControl: '3600', upsert: false });

      if (error) {
        const isBucketMissing =
          error.message?.toLowerCase().includes('bucket') ||
          error.message?.toLowerCase().includes('not found') ||
          error.statusCode === 404 ||
          error.statusCode === 400;

        setUploadError(
          isBucketMissing
            ? 'Image storage is not set up yet. In your Supabase dashboard go to Storage → New bucket → name it "products" and set it to Public. Then try again.'
            : `Upload failed: ${error.message}`
        );
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
      newUrls.push(publicUrl);
    }

    onChange(newUrls);
    setUploading(false);
  }, [images, onChange]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDraggingOver(false);
      uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  const handleFileSelect = (e) => {
    uploadFiles(e.target.files);
    e.target.value = '';
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  // HTML5 drag-to-reorder within the thumbnail grid
  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = useCallback(
    (e, index) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === index) return;
      const reordered = [...images];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(index, 0, moved);
      onChange(reordered);
      setDragIndex(index);
    },
    [dragIndex, images, onChange]
  );
  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-wider text-white/60">
        Images
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
        aria-label="Upload images"
        className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed p-8 cursor-pointer select-none transition-colors
          ${isDraggingOver
            ? 'border-accent-orange bg-accent-orange/5'
            : 'border-white/15 hover:border-white/30'
          }
          ${uploading ? 'cursor-wait' : ''}`}
      >
        <Upload size={22} className="text-white/30" />
        <div className="text-center pointer-events-none">
          <p className="text-sm text-white/60">
            Drag images here or{' '}
            <span className="text-accent-orange">click to browse</span>
          </p>
          <p className="text-xs text-white/30 mt-1">JPG, PNG, WEBP — multiple files supported</p>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-navy-deep/80 flex items-center justify-center">
            <span className="text-sm text-accent-orange animate-pulse">Uploading…</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="sr-only"
        />
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="flex gap-2 items-start text-red-300 text-xs bg-red-950/30 border border-red-300/20 p-3">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Thumbnail grid */}
      {images.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((url, i) => (
              <div
                key={url + i}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                className={`relative group aspect-square border border-white/10 overflow-hidden bg-navy-panel transition-opacity
                  ${dragIndex === i ? 'opacity-40' : 'opacity-100'}`}
              >
                <img
                  src={url}
                  alt={`Image ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="hidden w-full h-full items-center justify-center text-white/20"
                  style={{ display: 'none' }}
                >
                  <ImageIcon size={20} />
                </div>

                {/* Hover controls */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical size={14} className="text-white/70" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-0.5"
                    aria-label="Remove image"
                  >
                    <X size={11} />
                  </button>
                </div>

                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-navy-deep/80 text-[10px] text-white/70 px-1.5 py-0.5 pointer-events-none">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
          {images.length > 1 && (
            <p className="text-[11px] text-white/30">Drag thumbnails to reorder — the first image is the cover photo shown in listings.</p>
          )}
        </>
      )}
    </div>
  );
}
