'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileDrawer from './MobileDrawer';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/furniture', label: 'Furniture' },
  { href: '/custom-furniture', label: 'Custom' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar({ whatsAppNumber }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileHidden, setIsMobileHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const hamburgerBtnRef = useRef(null);

  // Monitor scroll for desktop solid header and mobile hide-on-scroll-down/reappear-on-scroll-up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Transparent-over-hero -> solid on scroll
      setIsScrolled(currentScrollY > 40);

      // Mobile header: hides on scroll-down, reappears immediately on scroll-up (tied directly to scroll delta, no debounce)
      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollYRef.current) {
          // scrolling down
          setIsMobileHidden(true);
        } else {
          // scrolling up
          setIsMobileHidden(false);
        }
      } else {
        setIsMobileHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Return focus to hamburger button on close
    setTimeout(() => {
      hamburgerBtnRef.current?.focus();
    }, 50);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isMobileHidden ? '-translate-y-full md:translate-y-0' : 'translate-y-0'
        } ${
          isScrolled
            ? 'bg-warm-white/95 backdrop-blur-sm border-b border-ink/10 shadow-xs'
            : 'bg-warm-white/80 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Scepter Brand Logo */}
          <Link href="/" className="group flex items-center">
            <Logo variant="light" width={168} height={38} priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-sm tracking-wide transition-all ${
                    isActive
                      ? 'font-medium text-navy-deep'
                      : 'font-normal text-ink/80 hover:text-navy-deep'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-orange" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Link
                href="/furniture"
                className="text-xs uppercase tracking-widest font-medium border border-navy-deep text-navy-deep px-4 py-2 hover:bg-navy-deep hover:text-white transition-colors"
              >
                Catalogue
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              ref={hamburgerBtnRef}
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-2 -mr-2 text-ink hover:text-navy-deep focus:outline-hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        navLinks={NAV_LINKS}
        whatsAppNumber={whatsAppNumber}
      />
    </>
  );
}
