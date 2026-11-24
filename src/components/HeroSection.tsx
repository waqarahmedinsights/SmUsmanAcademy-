import { motion } from 'motion/react';
import { ArrowRight, Phone, Star } from 'lucide-react';
import {
  COUNSELLOR_ADVISING_IMAGE,
  HERO_IMAGE,
  HERO_STUDENT_PORTRAIT,
  PARTNER_UNIVERSITIES_STRIP,
  TRUST_METRICS,
} from '../data/consultancyData';
import { ResilientImage } from './ResilientImage';
import { TestBrandLogo } from './TestBrandLogo';

interface HeroSectionProps {
  onStartEligibility: () => void;
}

export function HeroSection({ onStartEligibility }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-[#F5F7FB] via-white to-white border-b border-slate-200"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-[680px] h-[680px] text-[#0B2249]/5"
        viewBox="0 0 600 600"
        fill="none"
      >
        <circle cx="420" cy="180" r="240" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="420" cy="180" r="165" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between py-2"
          >
            <div>
              <p className="text-sm font-bold text-[#DC1E25] tracking-wide mb-3">
                British Council Trained Faculty · Zero Agency Fees
              </p>

              <h1
                className="font-display font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance] leading-[1.08] mb-5"
                style={{ fontSize: 'clamp(2.35rem, 4.2vw, 3.75rem)' }}
              >
                Study in the UK, Germany, Italy &amp; Cyprus With Confidence.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
                SMU Consultants guides ambitious students into 120+ accredited universities across
                Britain and Europe—combining IELTS, PTE, Duolingo &amp; OET preparation with a
                48-hour university shortlist and 98.4% visa compliance support.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-8">
                <button
                  type="button"
                  onClick={onStartEligibility}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 min-h-12 text-sm sm:text-base font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl shadow-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1E25]"
                >
                  Start Your Free Check
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://wa.me/923323502864?text=Assalam-o-Alaikum%20SMU%20Consultants!%20I%20would%20like%20guidance%20on%20admissions%20and%20IELTS%20classes."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-12 px-4 py-3 text-sm font-bold text-[#0B2249] hover:text-[#DC1E25] border border-slate-300 hover:border-[#0B2249] bg-white rounded-xl transition-colors whitespace-nowrap shrink-0 font-mono tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#25D366]" />
                  +92 332 3502864
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-0.5 text-[#D4A017]" aria-label="4.9 out of 5 rating">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[#D4A017] text-[#D4A017]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  <span className="font-mono font-bold text-[#0B2249] tabular-nums">4.9 / 5</span>{' '}
                  Student Satisfaction · <span className="font-semibold">1,400+</span> Visas Approved
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <a
                  href="https://www.facebook.com/ielts.preparation.karachi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0B2249] hover:text-[#DC1E25] transition-colors"
                >
                  Facebook
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="https://www.instagram.com/smusmanacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0B2249] hover:text-[#DC1E25] transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </motion.div>

          {/* Layered Editorial Multi-Photo Collage */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 grid grid-cols-12 gap-4 items-stretch min-h-[380px] lg:min-h-[470px]"
          >
            <div className="col-span-7 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
              <ResilientImage
                src={HERO_STUDENT_PORTRAIT}
                alt="Smiling international student carrying notebooks on a sunlit university campus"
                fallbackTitle="SMU Student Success"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2249]/90 via-[#0B2249]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="font-mono text-xs text-[#FBBF24] mb-1">2026 – 2028 INTAKES OPEN</p>
                <p className="font-display text-sm sm:text-base font-bold leading-snug">
                  Direct Admissions to 120+ UK &amp; European Campuses
                </p>
              </div>
            </div>

            <div className="col-span-5 flex flex-col gap-4">
              <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                <ResilientImage
                  src={COUNSELLOR_ADVISING_IMAGE}
                  alt="Study abroad advisor guiding a student through university shortlists"
                  fallbackTitle="1-on-1 Free Counselling"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2249]/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-display text-xs sm:text-sm font-bold">
                    IELTS · PTE · Admissions
                  </p>
                </div>
              </div>

              <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                <ResilientImage
                  src={HERO_IMAGE}
                  alt="International students walking through a historic European campus"
                  fallbackTitle="Global Student Community"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2249]/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="font-mono text-xs text-[#FBBF24] tabular-nums">98.4% VISA RATE</p>
                  <p className="font-display text-xs sm:text-sm font-bold">
                    CAS &amp; Embassy Prep
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Proof Bar in SMU Navy + Crimson + Gold */}
        <div className="mt-12 bg-[#0B2249] text-white rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 border-b-4 border-[#DC1E25]">
          {TRUST_METRICS.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <p className="font-mono text-2xl sm:text-3xl font-bold text-[#FBBF24] tabular-nums">
                {metric.value}
              </p>
              <p className="font-display text-sm sm:text-base font-bold text-white">
                {metric.label}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">{metric.detail}</p>
            </div>
          ))}
        </div>

        {/* Partner University Showcase Row — Clean Aligned Grid */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#DC1E25]">
            Selected Partner Network
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PARTNER_UNIVERSITIES_STRIP.map((uni) => (
              <div
                key={uni}
                className="bg-[#F5F7FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-display font-bold text-[#0B2249] text-left truncate"
              >
                {uni}
              </div>
            ))}
          </div>
        </div>

        {/* Official English Test Logos Strip */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B2249] shrink-0">
            Official Test Prep &amp; Exam Partners
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            {(
              [
                'ielts',
                'pte',
                'duolingo',
                'toefl',
                'oet',
                'british-council',
              ] as const
            ).map((brandId) => (
              <button
                key={brandId}
                type="button"
                aria-label={`View ${brandId} demo class`}
                onClick={() =>
                  document.getElementById('demo-booking')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="hover:-translate-y-0.5 transition-transform cursor-pointer rounded-xl"
              >
                <TestBrandLogo id={brandId} size="sm" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
