'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavLink } from '@/components/site/content';

const MotionLink = motion(Link);

type NavbarProps = {
  navLinks: readonly NavLink[];
  reduceMotion: boolean;
};

export default function Navbar({ navLinks, reduceMotion }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const buttonHover = reduceMotion ? undefined : { scale: 1.02 };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur-md">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
          <div className="grid h-10 w-10 place-items-center rounded-md bg-brand-blue text-white">
            <Building2 size={20} aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-brand-blue">ELEVATE BUILD</p>
            <p className="text-xs text-slate-500">Construction Co.</p>
          </div>
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
          {navLinks.map((item) => (
            <li key={item.href}>
              <Link
                className={[
                  'transition hover:text-brand-blue',
                  pathname === item.href ? 'text-brand-blue' : ''
                ]
                  .filter(Boolean)
                  .join(' ')}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <MotionLink
            href="/contact"
            whileHover={buttonHover}
            className="rounded-md bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/35"
          >
            Get a Quote
          </MotionLink>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          className="rounded-md border border-slate-300 p-2 text-slate-700 lg:hidden"
          onClick={() => setMobileMenuOpen((current) => !current)}
          type="button"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div id="mobile-nav" className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
          <ul className="space-y-3">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  className="block rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 block rounded-md bg-brand-orange px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Get a Quote
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
