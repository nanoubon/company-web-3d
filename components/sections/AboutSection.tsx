'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { aboutImageSrc } from '@/components/site/content';
import { reveal } from '@/components/site/motion';

type AboutSectionProps = {
  reduceMotion: boolean;
};

export default function AboutSection({ reduceMotion }: AboutSectionProps) {
  const buttonHover = reduceMotion ? undefined : { scale: 1.02 };

  return (
    <section id="about" className="section-anchor bg-[#f5f7fb] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <motion.div {...reveal(reduceMotion)}>
          <h2 className="text-5xl font-semibold text-brand-navy">About Us</h2>
          <h3 className="mt-4 text-4xl font-semibold text-brand-navy/90">Experienced & Trusted Builders</h3>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Our mission is to deliver dependable construction outcomes with proven engineering practices,
            transparent communication, and disciplined execution on every site.
          </p>
          <motion.a
            href="/about"
            whileHover={buttonHover}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white"
          >
            Learn More
            <ChevronRight size={16} aria-hidden />
          </motion.a>
        </motion.div>

        <motion.div
          {...reveal(reduceMotion, 0.06)}
          className="relative min-h-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-300/35"
        >
          <Image
            src={aboutImageSrc}
            alt="Construction team on project site"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-900/65 to-transparent" />
          <div className="absolute bottom-5 left-5 rounded-lg bg-white/90 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-blue">Field Engineering Team</p>
            <p className="mt-1 text-sm text-slate-600">Planning and supervision on site</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
