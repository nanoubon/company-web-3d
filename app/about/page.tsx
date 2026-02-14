'use client';

import { motion, useReducedMotion } from 'framer-motion';
import AboutSection from '@/components/sections/AboutSection';
import FooterSection from '@/components/sections/FooterSection';
import Navbar from '@/components/sections/Navbar';
import PageIntro from '@/components/sections/PageIntro';
import { companyStats, navLinks, services } from '@/components/site/content';
import { reveal } from '@/components/site/motion';

export default function AboutPage() {
  const reducedMotionPreference = useReducedMotion();
  const reduceMotion = Boolean(reducedMotionPreference);
  const cardHover = reduceMotion ? undefined : { scale: 1.02, y: -4 };

  return (
    <main className="min-h-screen bg-[#eaedf4] text-slate-900">
      <Navbar navLinks={navLinks} reduceMotion={reduceMotion} />
      <PageIntro
        title="Experienced Builders Backed by Process"
        subtitle="About"
        description="Sample company profile data for team experience, delivery performance, and on-site safety culture."
        reduceMotion={reduceMotion}
      />

      <AboutSection reduceMotion={reduceMotion} />

      <section className="px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="mx-auto w-full max-w-7xl">
          <motion.h2 className="text-3xl font-semibold text-brand-navy" {...reveal(reduceMotion)}>
            Company Snapshot
          </motion.h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {companyStats.map((stat, index) => (
              <motion.article
                key={stat.label}
                {...reveal(reduceMotion, index * 0.05)}
                whileHover={cardHover}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-blue">{stat.label}</p>
                <p className="mt-3 text-4xl font-semibold text-brand-navy">{stat.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{stat.note}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <FooterSection navLinks={navLinks} services={services} />
    </main>
  );
}
