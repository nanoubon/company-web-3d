'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import FooterSection from '@/components/sections/FooterSection';
import Navbar from '@/components/sections/Navbar';
import PageIntro from '@/components/sections/PageIntro';
import ServicesSection from '@/components/sections/ServicesSection';
import { reveal } from '@/components/site/motion';
import { navLinks, serviceDetails, services } from '@/components/site/content';

export default function ServicesPage() {
  const reducedMotionPreference = useReducedMotion();
  const reduceMotion = Boolean(reducedMotionPreference);
  const cardHover = reduceMotion ? undefined : { scale: 1.02, y: -4 };

  return (
    <main className="min-h-screen bg-[#eaedf4] text-slate-900">
      <Navbar navLinks={navLinks} reduceMotion={reduceMotion} />
      <PageIntro
        title="Professional Construction Services"
        subtitle="Services"
        description="Sample service scope and delivery standards used across our commercial, residential, and industrial work."
        reduceMotion={reduceMotion}
      />
      <ServicesSection services={services} reduceMotion={reduceMotion} />

      <section className="px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-2">
          {serviceDetails.map((item, index) => (
            <motion.article
              key={item.title}
              {...reveal(reduceMotion, index * 0.05)}
              whileHover={cardHover}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
            >
              <h2 className="text-2xl font-semibold text-brand-navy">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.summary}</p>
              <p className="mt-4 text-sm font-semibold text-brand-blue">{item.timeline}</p>
              <ul className="mt-4 space-y-2">
                {item.deliverables.map((deliverable) => (
                  <li key={deliverable} className="text-sm text-slate-700">
                    - {deliverable}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <motion.div className="mx-auto mt-10 w-full max-w-7xl text-center" {...reveal(reduceMotion, 0.12)}>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-md bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
          >
            Request Service Consultation
          </Link>
        </motion.div>
      </section>

      <FooterSection navLinks={navLinks} services={services} />
    </main>
  );
}
