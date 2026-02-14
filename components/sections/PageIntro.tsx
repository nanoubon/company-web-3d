'use client';

import { motion } from 'framer-motion';

type PageIntroProps = {
  title: string;
  subtitle: string;
  description: string;
  reduceMotion: boolean;
};

export default function PageIntro({ title, subtitle, description, reduceMotion }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-navy via-brand-blue to-[#3d6fbf] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute -left-24 top-10 h-60 w-60 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-64 w-64 rounded-full bg-orange-300/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.p
          className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {subtitle}
        </motion.p>
        <motion.h1
          className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="mt-5 max-w-2xl text-base leading-relaxed text-blue-100 sm:text-lg"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
