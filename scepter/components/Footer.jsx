import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white border-t border-navy-panel">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Narrative */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Logo variant="dark" width={175} height={40} />
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">
              Design, manufacture, and installation of premium furniture for residences and institutions across Malawi.
            </p>
          </div>

          {/* Catalogue Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-accent-orange mb-4">
              Catalogue
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/furniture" className="hover:text-white transition-colors">
                  All Furniture
                </Link>
              </li>
              <li>
                <Link href="/furniture/category/chairs" className="hover:text-white transition-colors">
                  Chairs
                </Link>
              </li>
              <li>
                <Link href="/furniture/category/tables" className="hover:text-white transition-colors">
                  Tables
                </Link>
              </li>
              <li>
                <Link href="/furniture/category/sofas-couches" className="hover:text-white transition-colors">
                  Sofas & Couches
                </Link>
              </li>
              <li>
                <Link href="/furniture/category/office-furniture" className="hover:text-white transition-colors">
                  Office Furniture
                </Link>
              </li>
              <li>
                <Link href="/custom-furniture" className="hover:text-white transition-colors">
                  Custom Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio & Info */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-accent-orange mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Scepter
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Project Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Enquiries
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-white/40 hover:text-white/70 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery & Enquiries */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-accent-orange mb-4">
              Delivery Information
            </h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Delivery available across Malawi. Delivery charges are based on location and distance.
            </p>
            <p className="text-xs text-white/50 pt-2">
              All pieces are handcrafted or made-to-order. Prices provided on request via WhatsApp enquiry.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} Scepter. All rights reserved.</p>
          <p>Handcrafted & Installed across Malawi</p>
        </div>
      </div>
    </footer>
  );
}
