'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import FooterSection from '@/components/sections/FooterSection';
import Navbar from '@/components/sections/Navbar';
import PageIntro from '@/components/sections/PageIntro';
import ProjectsSection from '@/components/sections/ProjectsSection';
import { projectCaseStudies, navLinks, projects, services } from '@/components/site/content';
import { reveal } from '@/components/site/motion';

export default function ProjectsPage() {
  const reducedMotionPreference = useReducedMotion();
  const reduceMotion = Boolean(reducedMotionPreference);
  const cardHover = reduceMotion ? undefined : { scale: 1.02, y: -4 };

  return (
    <main className="min-h-screen bg-[#eaedf4] text-slate-900">
      <Navbar navLinks={navLinks} reduceMotion={reduceMotion} />
      <PageIntro
        title="Our Construction Project Portfolio"
        subtitle="Projects"
        description="Sample project data showing delivery style, site conditions, and scope complexity across multiple sectors."
        reduceMotion={reduceMotion}
      />

      <ProjectsSection projects={projects} reduceMotion={reduceMotion} />

      <section className="px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="mx-auto grid w-full max-w-7xl gap-6">
          {projectCaseStudies.map((study, index) => (
            <motion.article
              key={study.title}
              {...reveal(reduceMotion, index * 0.06)}
              whileHover={cardHover}
              className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card lg:grid-cols-[1.05fr_1fr]"
            >
              <div className="relative min-h-[260px]">
                <Image src={study.imageSrc} alt={study.imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-brand-navy">{study.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{study.summary}</p>
                <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-slate-900">Location:</span> {study.location}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Category:</span> {study.category}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-semibold text-slate-900">Delivery:</span> {study.delivery}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div className="mx-auto mt-10 w-full max-w-7xl text-center" {...reveal(reduceMotion, 0.16)}>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-md bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
          >
            Discuss Your Next Project
          </Link>
        </motion.div>
      </section>

      <FooterSection navLinks={navLinks} services={services} />
    </main>
  );
}
