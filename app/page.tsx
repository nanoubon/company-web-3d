'use client';

import { useReducedMotion } from 'framer-motion';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import FooterSection from '@/components/sections/FooterSection';
import HeroSection from '@/components/sections/HeroSection';
import Navbar from '@/components/sections/Navbar';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SafetySection from '@/components/sections/SafetySection';
import ServicesSection from '@/components/sections/ServicesSection';
import { navLinks, projects, safetyItems, services } from '@/components/site/content';

export default function HomePage() {
  const reducedMotionPreference = useReducedMotion();
  const reduceMotion = Boolean(reducedMotionPreference);

  return (
    <main className="min-h-screen bg-[#eaedf4] text-slate-900">
      <Navbar navLinks={navLinks} reduceMotion={reduceMotion} />
      <HeroSection reduceMotion={reduceMotion} />
      <ServicesSection services={services} reduceMotion={reduceMotion} elevated />
      <ProjectsSection projects={projects} reduceMotion={reduceMotion} />
      <AboutSection reduceMotion={reduceMotion} />
      <SafetySection safetyItems={safetyItems} reduceMotion={reduceMotion} />
      <ContactSection reduceMotion={reduceMotion} />
      <FooterSection navLinks={navLinks} services={services} />
    </main>
  );
}
