import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';
import { ResilientImage } from './ResilientImage';

interface PageBannerProps {
  eyebrow: string;
  title: string;
  description?: string;
  primaryImage: string;
  primaryAlt: string;
  secondaryImage?: string;
  secondaryAlt?: string;
  badgeTitle?: string;
  badgeSubtitle?: string;
  actions?: ReactNode;
}

export function PageBanner({
  eyebrow,
  title,
  description,
  primaryImage,
  primaryAlt,
  secondaryImage,
  secondaryAlt,
  badgeTitle = 'SM Usman’s Academy · Est. 2007',
  badgeSubtitle = 'British Council Recognized Training & Admissions',
  actions,
}: PageBannerProps) {
  return (
    <section className="relative overflow-hidden bg-[#0B2249] text-white py-10 lg:py-14 border-b-4 border-[#DC1E25]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-24 w-[520px] h-[520px] text-white/5"
        viewBox="0 0 500 500"
        fill="none"
      >
        <circle cx="280" cy="220" r="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="280" cy="220" r="145" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-4"
        >
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FBBF24] tracking-wide">
            <Award className="w-4 h-4 shrink-0" />
            <span>{eyebrow}</span>
          </p>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-white [text-wrap:balance] leading-[1.12]">
            {title}
          </h1>

          {description && (
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

          {actions && <div className="pt-2 flex flex-wrap items-center gap-3">{actions}</div>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 grid grid-cols-12 gap-3 items-stretch"
        >
          <div
            className={`${
              secondaryImage ? 'col-span-7' : 'col-span-12'
            } relative rounded-2xl overflow-hidden border border-white/15 bg-[#071631] aspect-[4/3] shadow-xl`}
          >
            <ResilientImage
              src={primaryImage}
              alt={primaryAlt}
              fallbackTitle={badgeTitle}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071631]/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3.5 right-3.5">
              <p className="font-mono text-[11px] font-bold text-[#FBBF24] truncate">{badgeTitle}</p>
              <p className="text-xs font-semibold text-white truncate">{badgeSubtitle}</p>
            </div>
          </div>

          {secondaryImage && (
            <div className="col-span-5 relative rounded-2xl overflow-hidden border border-white/15 bg-[#071631] aspect-[4/5] sm:aspect-auto shadow-xl">
              <ResilientImage
                src={secondaryImage}
                alt={secondaryAlt || primaryAlt}
                fallbackTitle="SMU Consultants"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071631]/75 via-transparent to-transparent" />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
