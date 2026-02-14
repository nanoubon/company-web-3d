'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Hero3D from '@/components/Hero3D';

type HeroSectionProps = {
  reduceMotion: boolean;
};

export default function HeroSection({ reduceMotion }: HeroSectionProps) {
  const buttonHover = reduceMotion ? undefined : { scale: 1.02 };

  return (
    <section
      id="top"
      className="section-anchor relative overflow-hidden px-5 pb-28 pt-14 sm:px-8 lg:px-10 lg:pb-32 lg:pt-20"
    >
      <div className="absolute inset-0">
        <Hero3D className="h-full border-0 bg-none shadow-none sm:h-full pointer-events-none rounded-none" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0f2e66]/62 via-[#1d4da0]/26 to-[#0b2454]/8" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/28 via-slate-900/2 to-transparent" />
      <div className="pointer-events-none absolute -left-20 top-20 h-52 w-52 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900/35 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="max-w-2xl py-8 sm:py-10 lg:py-14">
          <motion.h1
            className="max-w-xl text-4xl font-semibold leading-tight text-white drop-shadow-[0_8px_20px_rgba(15,23,42,0.4)] sm:text-6xl"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          >
            Building the Future with Excellence
          </motion.h1>

          <motion.p
            className="mt-4 text-lg font-medium text-white/95"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          >
            Professional Construction Solutions
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <motion.a
              whileHover={buttonHover}
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30"
            >
              Get a Quote
              <ChevronRight size={17} aria-hidden />
            </motion.a>
            <motion.a
              whileHover={buttonHover}
              href="/projects"
              className="inline-flex items-center rounded-md border border-white/55 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm"
            >
              View Projects
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
