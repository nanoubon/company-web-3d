'use client';

import { Building2, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import type { NavLink, ServiceItem } from '@/components/site/content';

type FooterSectionProps = {
  navLinks: readonly NavLink[];
  services: readonly ServiceItem[];
};

export default function FooterSection({ navLinks, services }: FooterSectionProps) {
  return (
    <footer className="bg-[#0b2454] px-5 pb-8 pt-14 text-white sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-orange text-white">
                <Building2 size={20} aria-hidden />
              </span>
              <span className="text-lg font-semibold tracking-[0.16em]">ELEVATE BUILD</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-200">
              Professional construction partner for commercial, residential, and industrial developments.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>
                <Link className="transition hover:text-white" href="/">
                  Home
                </Link>
              </li>
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link className="transition hover:text-white" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">Core Services</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {services.map((service) => (
                <li key={service.title}>{service.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">Contact Info</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-brand-orange" aria-hidden />
                28 Builder Avenue, New York, NY
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 text-brand-orange" aria-hidden />
                +1 (212) 555-0144
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 text-brand-orange" aria-hidden />
                hello@elevatebuild.com
              </li>
              <li className="flex items-start gap-2">
                <Clock3 size={16} className="mt-0.5 text-brand-orange" aria-hidden />
                Mon - Sat, 8:00 AM - 6:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/15 pt-6 text-sm text-slate-300 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Elevate Build Construction Co. All rights reserved.</p>
          <Link href="/#top" className="text-slate-100 transition hover:text-white">
            Back to top
          </Link>
        </div>
      </div>
    </footer>
  );
}
