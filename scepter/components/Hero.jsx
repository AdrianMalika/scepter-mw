'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import WhatsAppButton from './WhatsAppButton';

export default function Hero({ whatsAppNumber }) {
  const shouldReduceMotion = useReducedMotion();

  // The one orchestrated motion moment per page: only the hero animates on load.
  // Respect prefers-reduced-motion with plain opacity cross-fade (150-200ms)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0.18 }
        : {
            staggerChildren: 0.15,
            delayChildren: 0.1,
          },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0.18 }
        : { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-[85vh] flex items-center bg-navy-deep text-white overflow-hidden pt-20">
      {/* Subtle photographic dark overlay behind text */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/90 to-navy-panel/80 z-10 pointer-events-none" />

      {/* Hero content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl space-y-6"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <span className="text-xs uppercase tracking-[0.15em] text-accent-orange font-medium block">
              Handcrafted in Malawi
            </span>
            <div className="w-10 h-[1px] bg-accent-orange" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-[0.08em] font-light leading-[1.15] text-white"
          >
            Refined Living, Custom Made For Your Space.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-white/70 text-base sm:text-lg leading-relaxed font-normal"
          >
            From bespoke residences to executive office suites, Scepter designs,
            manufactures, and installs distinguished furniture tailored precisely
            to your interior requirements.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            {/* Primary CTA: solid navy-deep with white text or clean dark CTA */}
            <Link
              href="/furniture"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-navy-deep hover:bg-warm-white transition-colors text-xs uppercase tracking-widest font-medium interactive-card"
            >
              Explore Our Furniture
            </Link>

            {/* Secondary CTA */}
            <WhatsAppButton
              number={whatsAppNumber}
              className="border border-white/30 text-white bg-transparent hover:bg-white/10 text-xs uppercase tracking-widest font-medium"
            >
              Chat on WhatsApp
            </WhatsAppButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative hairline grid element */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block border-l border-white/5 pointer-events-none opacity-40">
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
      </div>
    </section>
  );
}
