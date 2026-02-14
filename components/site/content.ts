import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, Building2, Factory, Hammer, HardHat, ShieldCheck } from 'lucide-react';

export type NavLink = {
  label: string;
  href: string;
};

export type ServiceItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ProjectItem = {
  title: string;
  imageSrc: string;
  imageAlt: string;
};

export type ServiceDetailItem = {
  title: string;
  summary: string;
  timeline: string;
  deliverables: readonly string[];
};

export type ProjectCaseStudy = {
  title: string;
  location: string;
  category: string;
  delivery: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
};

export type CompanyStat = {
  label: string;
  value: string;
  note: string;
};

export type SafetyProgram = {
  title: string;
  detail: string;
  metric: string;
};

export type ContactInfo = {
  title: string;
  value: string;
  helper: string;
};

export const navLinks: readonly NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Safety', href: '/safety' },
  { label: 'Contact', href: '/contact' }
];

export const services: readonly ServiceItem[] = [
  {
    title: 'Building Construction',
    description: 'High-rise and mixed-use structures with efficient delivery.',
    icon: Building2
  },
  {
    title: 'Civil Engineering',
    description: 'Site, road, and infrastructure systems built for durability.',
    icon: HardHat
  },
  {
    title: 'Industrial Projects',
    description: 'Production and logistics facilities with robust standards.',
    icon: Factory
  },
  {
    title: 'Renovation & Interiors',
    description: 'Functional upgrades with modern interior execution.',
    icon: Hammer
  }
];

export const projects: readonly ProjectItem[] = [
  {
    title: 'Modern Office Tower',
    imageSrc: '/images/project-office.jpg',
    imageAlt: 'Modern office tower development'
  },
  {
    title: 'Luxury Residential Villa',
    imageSrc: '/images/project-villa.jpg',
    imageAlt: 'Luxury residential villa exterior'
  },
  {
    title: 'Industrial Warehouse',
    imageSrc: '/images/project-warehouse.jpg',
    imageAlt: 'Industrial warehouse and loading docks'
  }
];

export const safetyItems: readonly ServiceItem[] = [
  {
    title: 'Certified Professionals',
    description: 'Licensed supervisors and certified teams on every project.',
    icon: BadgeCheck
  },
  {
    title: 'Safety First',
    description: 'Strict site protocols with routine inspections and briefings.',
    icon: HardHat
  },
  {
    title: 'Quality Assurance',
    description: 'Milestone-based quality checks from start to handover.',
    icon: ShieldCheck
  }
];

export const serviceDetails: readonly ServiceDetailItem[] = [
  {
    title: 'Building Construction',
    summary:
      'Complete structural delivery for office towers, mixed-use blocks, and hospitality developments.',
    timeline: 'Average timeline: 14-24 months',
    deliverables: ['Design coordination', 'Concrete frame & facade', 'MEP integration', 'Final handover']
  },
  {
    title: 'Civil Engineering',
    summary: 'Infrastructure execution for roads, drainage, utilities, and large site-preparation packages.',
    timeline: 'Average timeline: 6-16 months',
    deliverables: ['Site grading', 'Drainage systems', 'Roadworks', 'Public utility connections']
  },
  {
    title: 'Industrial Projects',
    summary: 'Factory and logistics builds optimized for operational efficiency and safety compliance.',
    timeline: 'Average timeline: 10-20 months',
    deliverables: ['Plant foundations', 'Steel erection', 'Warehouse envelopes', 'Commissioning support']
  },
  {
    title: 'Renovation & Interiors',
    summary: 'Interior and renovation programs that upgrade performance while preserving ongoing operations.',
    timeline: 'Average timeline: 3-9 months',
    deliverables: ['Space planning', 'Interior fit-out', 'Retrofit systems', 'Snagging & quality closeout']
  }
];

export const projectCaseStudies: readonly ProjectCaseStudy[] = [
  {
    title: 'Hudson Square Office Tower',
    location: 'New York, NY',
    category: 'Commercial High-Rise',
    delivery: 'Completed in 22 months',
    summary:
      '45-floor office tower with high-performance facade, premium lobby program, and smart building systems.',
    imageSrc: '/images/project-office.jpg',
    imageAlt: 'Completed commercial office tower in city district'
  },
  {
    title: 'Westbrook Residential Estate',
    location: 'Austin, TX',
    category: 'Luxury Residential',
    delivery: 'Completed in 12 months',
    summary:
      'Custom villa development with structural steel accents, climate-optimized glazing, and landscaped frontage.',
    imageSrc: '/images/project-villa.jpg',
    imageAlt: 'Luxury residential estate with warm evening lighting'
  },
  {
    title: 'Summit Logistics Hub',
    location: 'Phoenix, AZ',
    category: 'Industrial & Warehouse',
    delivery: 'Completed in 11 months',
    summary:
      'Large-span warehouse and loading facility designed for multi-tenant logistics and high vehicle turnover.',
    imageSrc: '/images/project-warehouse.jpg',
    imageAlt: 'Modern industrial warehouse and loading bays'
  }
];

export const companyStats: readonly CompanyStat[] = [
  { label: 'Years of Experience', value: '18+', note: 'Across residential, commercial, and industrial sectors' },
  { label: 'Projects Delivered', value: '240+', note: 'From design-build packages to full EPC collaboration' },
  { label: 'On-Time Delivery Rate', value: '96%', note: 'Milestone-driven execution with weekly QA tracking' },
  { label: 'Safety Training Hours', value: '12,500+', note: 'Annual workforce training and certification refresh' }
];

export const safetyPrograms: readonly SafetyProgram[] = [
  {
    title: 'Daily Risk Assessment',
    detail: 'Pre-shift hazard reviews with supervisor sign-off before every critical task.',
    metric: 'Conducted 6 days/week on all active sites'
  },
  {
    title: 'Permit-to-Work System',
    detail: 'High-risk jobs are controlled by documented permits and time-bound approvals.',
    metric: '100% compliance on confined-space and hot-work activities'
  },
  {
    title: 'Quality Hold Points',
    detail: 'Inspection gates are embedded in each phase before work can proceed.',
    metric: 'Average rework kept below 2.1% of package value'
  }
];

export const contactInfo: readonly ContactInfo[] = [
  {
    title: 'Head Office',
    value: '28 Builder Avenue, New York, NY',
    helper: 'Open Mon - Sat, 8:00 AM - 6:00 PM'
  },
  {
    title: 'Phone',
    value: '+1 (212) 555-0144',
    helper: 'Sales and project consultation'
  },
  {
    title: 'Email',
    value: 'hello@elevatebuild.com',
    helper: 'RFP and tender submissions'
  }
];

export const aboutImageSrc = '/images/about-team.jpg';
