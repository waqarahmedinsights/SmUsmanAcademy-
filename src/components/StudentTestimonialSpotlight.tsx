import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Pause,
  Play,
  Quote,
} from 'lucide-react';
import {
  PageRoute,
  PlacementTarget,
} from '../data/consultancyData';
import { filterItemsForPage } from '../data/siteConfigDefaults';
import { useSiteContent } from '../context/SiteContentContext';
import { ResilientImage } from './ResilientImage';

interface StudentTestimonialSpotlightProps {
  onNavigate: (page: PageRoute) => void;
  pageTarget?: PlacementTarget;
}

const SLIDE_INTERVAL_MS = 5500;

export function StudentTestimonialSpotlight({
  onNavigate,
  pageTarget = 'home',
}: StudentTestimonialSpotlightProps) {
  const { config } = useSiteContent();
  const stories = filterItemsForPage(config.textTestimonials, pageTarget, {
    onePerSegmentOnHome: pageTarget === 'home',
  });
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const total = stories.length;
  const safeIdx = total > 0 ? activeIdx % total : 0;
  const current = stories[safeIdx] ?? stories[0];

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIdx((prev) => (prev + 1) % total);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, total]);

  if (!current) {
    return null;
  }

  const goToIndex = (nextIdx: number) => {
    setDirection(nextIdx >= activeIdx ? 1 : -1);
    setActiveIdx(nextIdx);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % total);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 48 : -48,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -48 : 48,
      opacity: 0,
    }),
  };

  return (
    <section
      id="student-testimonials"
      className="py-16 lg:py-24 bg-[#F5F7FB] border-b border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#DC1E25] mb-2">
              Student Success Stories · Band Scores &amp; Global Admissions
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
              Verified Band Achievers &amp; University Visa Outcomes
            </h2>
          </div>

          {/* Playback & Step Controls */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Resume testimonial carousel' : 'Pause testimonial carousel'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#0B2249] bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[#DC1E25]" />
                  Auto-Play
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#0B2249]" />
                  Pause
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous student testimonial"
              className="p-2.5 rounded-xl bg-white hover:bg-[#0B2249] text-[#0B2249] hover:text-white border border-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next student testimonial"
              className="p-2.5 rounded-xl bg-[#0B2249] hover:bg-[#DC1E25] text-white transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* High-Impact Animated Spotlight Stage */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden"
        >
          {/* Auto-cycle Progress Bar */}
          <div className="h-1 w-full bg-slate-100 overflow-hidden">
            <motion.div
              key={`${activeIdx}-${isPaused ? 'paused' : 'running'}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isPaused ? 0 : 1 }}
              transition={{
                duration: isPaused ? 0.2 : SLIDE_INTERVAL_MS / 1000,
                ease: 'linear',
              }}
              className="h-full bg-[#DC1E25] origin-left"
            />
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
              >
                {/* Left Column: Student Portrait / Official TRF Photo */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-[#0B2249] aspect-[4/3] shadow-sm">
                    <ResilientImage
                      src={current.image}
                      alt={`${current.studentName} — ${current.scoreAchieved}`}
                      fallbackTitle={current.studentName}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071631]/95 via-[#071631]/60 to-transparent p-5 text-white">
                      <p className="font-mono text-xs font-bold text-[#FBBF24] tabular-nums">
                        {current.testOrTrack}
                      </p>
                      <p className="font-display text-2xl sm:text-3xl font-extrabold text-white tabular-nums mt-0.5">
                        {current.scoreAchieved}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Quote, Name, Score & Outcomes */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
                      <span className="inline-flex items-center gap-1.5 font-mono font-bold text-[#DC1E25] tabular-nums">
                        <Award className="w-4 h-4 text-[#D4A017]" />
                        {current.scoreAchieved}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{current.destinationOrCampus}</span>
                      <span aria-hidden="true">·</span>
                      <span>{current.intakeLabel}</span>
                    </div>

                    <div className="relative">
                      <Quote className="w-9 h-9 text-[#DC1E25]/20 mb-2" />
                      <blockquote className="font-display text-xl sm:text-2xl lg:text-[26px] font-bold text-[#0B2249] leading-snug">
                        “{current.quote}”
                      </blockquote>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-lg font-extrabold text-[#0B2249]">
                        {current.studentName}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{current.outcomeTag}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onNavigate('apply')}
                        className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Start Free Check
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('guides')}
                        className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0B2249] bg-[#F5F7FB] hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                      >
                        All Scorecards
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Student Switcher Rail */}
          <div className="px-6 sm:px-10 py-4 bg-[#F5F7FB] border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {stories.map((item, idx) => {
              const active = idx === safeIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={`text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0B2249] text-white border-[#0B2249] shadow-sm'
                      : 'bg-white text-[#0B2249] border-slate-200 hover:border-[#DC1E25]/50'
                  }`}
                >
                  <p className="font-display text-xs font-bold truncate">{item.studentName}</p>
                  <p
                    className={`font-mono text-[11px] font-semibold truncate tabular-nums ${
                      active ? 'text-[#FBBF24]' : 'text-[#DC1E25]'
                    }`}
                  >
                    {item.scoreAchieved}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
