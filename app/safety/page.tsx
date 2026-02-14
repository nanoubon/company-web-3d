'use client';

import { motion, useReducedMotion } from 'framer-motion';
import FooterSection from '@/components/sections/FooterSection';
import Navbar from '@/components/sections/Navbar';
import PageIntro from '@/components/sections/PageIntro';
import SafetySection from '@/components/sections/SafetySection';
import { navLinks, safetyItems, safetyPrograms, services } from '@/components/site/content';
import { reveal } from '@/components/site/motion';

export default function SafetyPage() {
  const reducedMotionPreference = useReducedMotion();
  const reduceMotion = Boolean(reducedMotionPreference);
  const cardHover = reduceMotion ? undefined : { scale: 1.02, y: -4 };

  return (
    <main className="min-h-screen bg-[#eaedf4] text-slate-900">
      <Navbar navLinks={navLinks} reduceMotion={reduceMotion} />
      <PageIntro
        title="Safety Standards Embedded in Every Work Package"
        subtitle="Safety"
        description="Sample compliance and QA practices designed to protect crews, ensure quality, and reduce site risk."
        reduceMotion={reduceMotion}
      />

      <SafetySection safetyItems={safetyItems} reduceMotion={reduceMotion} />

      <section className="px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-3">
          {safetyPrograms.map((program, index) => (
            <motion.article
              key={program.title}
              {...reveal(reduceMotion, index * 0.06)}
              whileHover={cardHover}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
            >
              <h2 className="text-xl font-semibold text-brand-navy">{program.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{program.detail}</p>
              <p className="mt-4 rounded-md bg-brand-blue/10 px-3 py-2 text-sm font-medium text-brand-blue">
                {program.metric}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <FooterSection navLinks={navLinks} services={services} />
    </main>
  );
}
