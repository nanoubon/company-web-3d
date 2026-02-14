'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ProjectItem } from '@/components/site/content';
import { reveal } from '@/components/site/motion';

type ProjectsSectionProps = {
  projects: readonly ProjectItem[];
  reduceMotion: boolean;
};

export default function ProjectsSection({ projects, reduceMotion }: ProjectsSectionProps) {
  const buttonHover = reduceMotion ? undefined : { scale: 1.02 };
  const cardHover = reduceMotion ? undefined : { scale: 1.02, y: -4 };

  return (
    <section id="projects" className="section-anchor px-5 pb-16 pt-16 sm:px-8 lg:px-10 lg:pt-20">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div className="text-center" {...reveal(reduceMotion)}>
          <h2 className="text-4xl font-semibold text-brand-navy">Our Projects</h2>
          <p className="mt-2 text-lg text-slate-600">Recent Work Showcase</p>
        </motion.div>

        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              {...reveal(reduceMotion, index * 0.05)}
              whileHover={cardHover}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-300/35"
            >
              <div className="relative h-56">
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div className="mt-8 text-center" {...reveal(reduceMotion, 0.12)}>
          <motion.a
            href="/projects"
            whileHover={buttonHover}
            className="inline-flex items-center rounded-md bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30"
          >
            View All Projects
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
