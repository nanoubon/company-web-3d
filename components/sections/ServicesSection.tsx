'use client';

import { motion } from 'framer-motion';
import type { ServiceItem } from '@/components/site/content';
import { reveal } from '@/components/site/motion';

type ServicesSectionProps = {
  services: readonly ServiceItem[];
  reduceMotion: boolean;
  elevated?: boolean;
};

export default function ServicesSection({ services, reduceMotion, elevated = false }: ServicesSectionProps) {
  const cardHover = reduceMotion ? undefined : { scale: 1.02, y: -4 };
  const sectionClassName = elevated
    ? 'section-anchor relative z-10 -mt-16 px-5 sm:px-8 lg:px-10'
    : 'section-anchor px-5 py-16 sm:px-8 lg:px-10 lg:py-20';

  return (
    <section id="services" className={sectionClassName}>
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
        <div className="grid divide-y divide-slate-200 md:grid-cols-4 md:divide-x md:divide-y-0">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                {...reveal(reduceMotion, index * 0.04)}
                whileHover={cardHover}
                className="p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="text-base font-semibold text-brand-navy">{service.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
