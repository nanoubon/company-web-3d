'use client';

import { motion } from 'framer-motion';
import type { ServiceItem } from '@/components/site/content';
import { reveal } from '@/components/site/motion';

type SafetySectionProps = {
  safetyItems: readonly ServiceItem[];
  reduceMotion: boolean;
};

export default function SafetySection({ safetyItems, reduceMotion }: SafetySectionProps) {
  const cardHover = reduceMotion ? undefined : { scale: 1.02, y: -4 };

  return (
    <section id="safety" className="section-anchor px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div className="text-center" {...reveal(reduceMotion)}>
          <h2 className="text-4xl font-semibold text-brand-navy">Safety & Standards</h2>
          <p className="mt-2 text-lg text-slate-600">Prioritizing Safety on Every Site</p>
        </motion.div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-300/35">
          <div className="grid divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            {safetyItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  {...reveal(reduceMotion, index * 0.05)}
                  whileHover={cardHover}
                  className="p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue">
                      <Icon size={20} aria-hidden />
                    </span>
                    <h3 className="text-xl font-semibold text-brand-navy">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
