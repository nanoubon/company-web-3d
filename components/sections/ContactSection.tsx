'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { reveal } from '@/components/site/motion';

type ContactSectionProps = {
  reduceMotion: boolean;
};

export default function ContactSection({ reduceMotion }: ContactSectionProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const buttonHover = reduceMotion ? undefined : { scale: 1.02 };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="section-anchor bg-[#f4f6fb] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <motion.div {...reveal(reduceMotion)}>
          <h2 className="text-5xl font-semibold text-brand-navy">Contact Us</h2>
          <h3 className="mt-4 text-4xl font-semibold text-brand-navy/90">Get in Touch Now!</h3>
          <p className="mt-5 max-w-md text-lg text-slate-600">
            Tell us about your construction goals and our team will respond with the right plan and timeline.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          {...reveal(reduceMotion, 0.05)}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-300/35"
        >
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={(event) => {
                setSubmitted(false);
                setForm((current) => ({ ...current, name: event.target.value }));
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-blue"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(event) => {
                setSubmitted(false);
                setForm((current) => ({ ...current, email: event.target.value }));
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-blue"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={(event) => {
                setSubmitted(false);
                setForm((current) => ({ ...current, message: event.target.value }));
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-blue"
            />
          </div>

          <motion.button
            whileHover={buttonHover}
            type="submit"
            className="inline-flex items-center rounded-md bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white"
          >
            Submit
          </motion.button>

          {submitted && (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              Thank you! Your message has been sent successfully.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
