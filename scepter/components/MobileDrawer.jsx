'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import WhatsAppButton from './WhatsAppButton';
import Logo from './Logo';

export default function MobileDrawer({ isOpen, onClose, navLinks, whatsAppNumber }) {
  const pathname = usePathname();
  const drawerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Keyboard navigation: Escape key to close, focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus on close button
    const closeBtn = drawerRef.current?.querySelector('button');
    closeBtn?.focus();

    // Prevent body scrolling when open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Spring transition: critically-damped spring (damping 0.8, response 0.3)
  // In Framer Motion: type "spring", damping: 28, stiffness: 220 or custom physics
  // With prefers-reduced-motion: plain opacity cross-fade (150-200ms)
  const springTransition = shouldReduceMotion
    ? { duration: 0.18, ease: 'easeInOut' }
    : {
        type: 'spring',
        damping: 26,
        stiffness: 240,
        mass: 0.8,
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop: dim the page, tap-to-close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black"
            aria-hidden="true"
          />

          {/* Drawer container: Solid navy-deep or warm-white background (no blur/translucence) */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
            animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
            transition={springTransition}
            drag={shouldReduceMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.7 }} // rubber-band resistance
            onDragEnd={(e, info) => {
              // 1:1 drag-to-dismiss: if dragged right with positive offset or velocity, dismiss
              if (info.offset.x > 80 || info.velocity.x > 400) {
                onClose();
              }
            }}
            className="relative z-10 w-full max-w-xs h-full bg-warm-white text-ink shadow-2xl flex flex-col justify-between border-l border-ink/10"
          >
            {/* Header: Brand mark + close button */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-ink/10">
              <Logo variant="light" width={140} height={32} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-2 -mr-2 text-ink hover:text-navy-panel"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-6 py-8 overflow-y-auto space-y-6">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));

                return (
                  <div key={link.href} className="relative">
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`block py-1 text-base tracking-wide transition-colors ${
                        isActive ? 'font-medium text-navy-deep' : 'font-normal text-ink/80'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {isActive && (
                      <span className="block w-6 h-[2px] bg-accent-orange mt-1" />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* WhatsApp CTA at bottom of drawer, separated from nav list */}
            <div className="p-6 border-t border-ink/10 bg-warm-white">
              <WhatsAppButton
                number={whatsAppNumber}
                className="w-full text-center"
              >
                Chat on WhatsApp
              </WhatsAppButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
