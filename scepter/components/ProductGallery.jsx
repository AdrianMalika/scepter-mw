'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function ProductGallery({ images = [], productName = 'Product' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  if (!images || images.length === 0) {
    return (
      <div className="aspect-4/3 w-full bg-warm-white border border-ink/10 flex items-center justify-center text-ink/40 text-xs tracking-wider uppercase">
        No images available
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main image container */}
      <div className="relative aspect-4/3 w-full bg-warm-white border border-ink/10 overflow-hidden select-none">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0.8, x: 20 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0.8, x: -20 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.18, ease: 'easeInOut' }
                : { type: 'spring', damping: 25, stiffness: 220 }
            }
            drag={shouldReduceMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            // Rubber-band resistance at the first/last image, not a hard stop
            dragElastic={
              currentIndex === 0
                ? { left: 0.6, right: 0.1 }
                : currentIndex === images.length - 1
                ? { left: 0.1, right: 0.6 }
                : 0.5
            }
            onDragEnd={(e, info) => {
              // Allow slight bounce only on a released flick, never on simple tap
              const swipeThreshold = 50;
              const velocityThreshold = 300;

              if (
                info.offset.x < -swipeThreshold ||
                info.velocity.x < -velocityThreshold
              ) {
                if (currentIndex < images.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                }
              } else if (
                info.offset.x > swipeThreshold ||
                info.velocity.x > velocityThreshold
              ) {
                if (currentIndex > 0) {
                  setCurrentIndex(currentIndex - 1);
                }
              }
            }}
            className="relative w-full h-full cursor-grab active:cursor-grabbing"
          >
            <Image
              src={images[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              fill
              priority={currentIndex === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cover badge on first image */}
        {currentIndex === 0 && (
          <div className="absolute top-3 left-3 bg-navy-deep/80 text-white text-[10px] uppercase tracking-widest px-2 py-1 font-medium select-none">
            Cover View
          </div>
        )}

        {/* Navigation arrows (desktop and accessibility) */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-3 pointer-events-none">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous image"
              className={`p-2 bg-white/90 border border-ink/10 text-navy-deep pointer-events-auto transition-opacity ${
                currentIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === images.length - 1}
              aria-label="Next image"
              className={`p-2 bg-white/90 border border-ink/10 text-navy-deep pointer-events-auto transition-opacity ${
                currentIndex === images.length - 1 ? 'opacity-0 cursor-default' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-4/3 w-16 md:w-20 shrink-0 border overflow-hidden transition-all ${
                currentIndex === idx
                  ? 'border-accent-orange ring-1 ring-accent-orange'
                  : 'border-ink/10 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
