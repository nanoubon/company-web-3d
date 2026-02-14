'use client';

import { motion, useReducedMotion } from 'framer-motion';
import ContactSection from '@/components/sections/ContactSection';
import FooterSection from '@/components/sections/FooterSection';
import Navbar from '@/components/sections/Navbar';
import PageIntro from '@/components/sections/PageIntro';
import { contactInfo, navLinks, services } from '@/components/site/content';
import { reveal } from '@/components/site/motion';

export default function ContactPage() {
  const reducedMotionPreference = useReducedMotion();
  const reduceMotion = Boolean(reducedMotionPreference);
  const cardHover = reduceMotion ? undefined : { scale: 1.02, y: -4 };

  return (
    <main className="min-h-screen bg-[#eaedf4] text-slate-900">
      <Navbar navLinks={navLinks} reduceMotion={reduceMotion} />
      <PageIntro
        title="Start Your Project Conversation"
        subtitle="Contact"
        description="Sample contact channels and inquiry form for proposals, pre-construction planning, and bidding requests."
        reduceMotion={reduceMotion}
      />

      <section className="px-5 pt-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-5 md:grid-cols-3">
          {contactInfo.map((item, index) => (
            <motion.article
              key={item.title}
              {...reveal(reduceMotion, index * 0.05)}
              whileHover={cardHover}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-blue">{item.title}</p>
              <p className="mt-3 text-base font-semibold text-brand-navy">{item.value}</p>
              <p className="mt-2 text-sm text-slate-600">{item.helper}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <ContactSection reduceMotion={reduceMotion} />
      <FooterSection navLinks={navLinks} services={services} />
    </main>
  );
}
