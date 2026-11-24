import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Flame,
  GraduationCap,
  Pause,
  Play,
  ShieldCheck,
} from 'lucide-react';
import {
  PageRoute,
} from '../data/consultancyData';
import { useSiteContent } from '../context/SiteContentContext';
import { ResilientImage } from './ResilientImage';

interface PromoBannerShowcaseProps {
  onNavigate: (page: PageRoute) => void;
}

type SlideId = 'pte-offer' | 'prep' | 'consultancy' | 'exam' | 'demo';

interface BannerSlide {
  id: SlideId;
  tabLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  highlightMetric: string;
  ctaLabel: string;
  ctaHref?: string;
  ctaAction?: () => void;
  secondaryLabel: string;
  secondaryAction: () => void;
}

const SLIDE_INTERVAL_MS = 5000;

export function PromoBannerShowcase({ onNavigate }: PromoBannerShowcaseProps) {
  const { config } = useSiteContent();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const offer = config.megaOffer;
  const pics = config.awardsAndPictures;
  const waNumber = config.socialLinks.whatsappNumber;

  const pteOfferWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Assalam-o-Alaikum Sir Usman! I want to enroll in ${offer.title} (${offer.duration} · ${offer.frequency} ${offer.timings} · Discounted Fee ${offer.discountedFee}).`
  )}`;

  const baseBanners: BannerSlide[] = [
    {
      id: 'pte-offer',
      tabLabel: '01. PTE Mega Offer',
      eyebrow: `${offer.badge} · Pearson Rising Star Award 2025–2026`,
      title: `${offer.title}: ${offer.discountedFee} (Was ${offer.originalFee})`,
      description:
        `${offer.duration} (${offer.classDuration}) on ${offer.frequency} · ${offer.timings} with ${offer.inclusions.join(', ')}.`,
      image: offer.imageUrl || pics.pearsonStageUrl,
      imageAlt: offer.title,
      highlightMetric: `${offer.discountedFee} · ${offer.timings}`,
      ctaLabel: 'Enroll on WhatsApp Now',
      ctaHref: pteOfferWaUrl,
      secondaryLabel: 'See Offer & Demo Timings',
      secondaryAction: () => {
        document.getElementById('pte-mega-offer')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'prep',
      tabLabel: '02. Test Preparation',
      eyebrow: 'SM Usman’s Academy · British Council Recognized Coaching',
      title: 'IELTS, PTE Academic, Duolingo, TOEFL & OET Classroom + Online Prep',
      description:
        'Master Band 7.5–8.5 speaking and writing strategies with Sir SM Usman and British Council trained instructors across Gulshan, Shahrah-e-Faisal, Nazimabad, and live Zoom batches.',
      image: pics.bannerTestPrepUrl,
      imageAlt: 'SM Usman Academy IELTS and PTE preparation classroom and computer lab',
      highlightMetric: 'Band 7.5 – 8.5 Target Coaching',
      ctaLabel: 'Explore All 6 Test Pages',
      ctaAction: () => onNavigate('services'),
      secondaryLabel: 'IELTS Course Details',
      secondaryAction: () => onNavigate('test-ielts'),
    },
    {
      id: 'consultancy',
      tabLabel: '03. Study Consultancy',
      eyebrow: 'SMU Consultants · 2026 – 2028 Intakes Open',
      title: 'Zero-Fee Admissions & Visa Filing for UK, Germany, Italy & Cyprus',
      description:
        'Personal SOP reviews, university shortlisting across 120+ direct partner institutions, German Blocked Account guidance, Italian DSU grants, and UK CAS mock credibility interviews.',
      image: pics.bannerStudyConsultancyUrl,
      imageAlt: 'SMU Consultants study abroad advisor guiding student in Karachi office',
      highlightMetric: 'Zero Agency Fees · 98.4% Visa Rate',
      ctaLabel: 'Explore Study Destinations',
      ctaAction: () => onNavigate('destinations'),
      secondaryLabel: 'Start Free Eligibility Check',
      secondaryAction: () => onNavigate('apply'),
    },
    {
      id: 'exam',
      tabLabel: '04. Official Exam Desk',
      eyebrow: 'Authorized Booking Support · 2026 – 2028 Dates',
      title: 'Book British Council IELTS, IDP, Pearson PTE, DET, TOEFL & OET Dates',
      description:
        'Reserve your official computer-delivered or paper-based exam date with zero hidden fee markup, priority seat checks, and a complimentary pre-exam Speaking & Writing mock assessment.',
      image: pics.bannerOfficialExamUrl,
      imageAlt: 'Modern computer-delivered English exam workstation and booking desk',
      highlightMetric: 'Same-Day Registration Assistance',
      ctaLabel: 'Open Official Book Exam Desk',
      ctaAction: () => onNavigate('book-exam'),
      secondaryLabel: 'Check Required Scores',
      secondaryAction: () => onNavigate('test-pte'),
    },
    {
      id: 'demo',
      tabLabel: '05. Free Demo Today',
      eyebrow: 'Live Diagnostic & Demo Classes Across Campuses',
      title: 'Attend a Free Live IELTS, PTE, Duolingo, TOEFL or OET Demo Class Today',
      description:
        `Experience live instruction with Sir Usman across ${config.demoSchedule.campuses.slice(0, 3).join(', ')} with complimentary baseline diagnostic feedback.`,
      image: pics.bannerFreeDemoUrl,
      imageAlt: 'Interactive free demo seminar and English workshop with students',
      highlightMetric: `${config.demoSchedule.timingSlots.length} Daily Timing Slots`,
      ctaLabel: 'Book Free Demo Seat',
      ctaAction: () => {
        document.getElementById('pte-mega-offer')?.scrollIntoView({ behavior: 'smooth' });
      },
      secondaryLabel: 'See Campus Locations',
      secondaryAction: () => onNavigate('about'),
    },
  ];

  const customSlides: BannerSlide[] = (config.customOffers ?? [])
    .filter((o) => o.enabled)
    .map((o, idx) => ({
      id: `custom-${o.id}` as SlideId,
      tabLabel: `0${6 + idx}. ${o.title.slice(0, 18)}`,
      eyebrow: `${o.badge} · SM Usman's Academy`,
      title: `${o.title}${o.discountedFee ? `: ${o.discountedFee}` : ''}${
        o.originalFee ? ` (Was ${o.originalFee})` : ''
      }`,
      description: `${[o.duration, o.frequency, o.timings, ...o.inclusions]
        .filter(Boolean)
        .join(' · ')}`,
      image: o.imageUrl || offer.imageUrl || pics.pteScorecardsUrl,
      imageAlt: o.title,
      highlightMetric: o.discountedFee || o.timings || o.badge,
      ctaLabel: 'Enroll on WhatsApp Now',
      ctaHref: `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Assalam-o-Alaikum Sir Usman! I want details for ${o.title} (${o.discountedFee || o.originalFee}).`
      )}`,
      secondaryLabel: 'See All Offers',
      secondaryAction: () => {
        document.getElementById('pte-mega-offer')?.scrollIntoView({ behavior: 'smooth' });
      },
    }));

  const banners: BannerSlide[] = [...baseBanners, ...customSlides];

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, banners.length]);

  const activeBanner = banners[activeIndex] ?? banners[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section
      className="py-12 lg:py-16 bg-white border-b border-slate-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-bold text-[#DC1E25] mb-1">
              Auto-Sliding Highlights · Preparation, Consultancy, Offers &amp; Exam Booking
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B2249]">
              Mega PTE Offer, Test Prep, Study Abroad &amp; Free Demos
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous highlight banner"
              className="w-9 h-9 rounded-xl bg-[#F5F7FB] hover:bg-[#0B2249] text-[#0B2249] hover:text-white border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Resume auto-sliding banners' : 'Pause auto-sliding banners'}
              className="w-9 h-9 rounded-xl bg-[#F5F7FB] hover:bg-[#0B2249] text-[#0B2249] hover:text-white border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next highlight banner"
              className="w-9 h-9 rounded-xl bg-[#F5F7FB] hover:bg-[#0B2249] text-[#0B2249] hover:text-white border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs font-bold text-[#0B2249] ml-1 tabular-nums">
              {activeIndex + 1} / {banners.length}
            </span>
          </div>
        </div>

        {/* Active Full-Width Auto-Sliding Visual Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-[#0B2249] border border-slate-200 shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBanner.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-[350px] lg:min-h-[410px] flex items-end"
            >
              <ResilientImage
                src={activeBanner.image}
                alt={activeBanner.imageAlt}
                fallbackTitle={activeBanner.title}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071631]/95 via-[#0B2249]/85 to-[#071631]/35" />

              <div className="relative z-10 w-full p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end text-white">
                <div className="lg:col-span-8 space-y-3">
                  <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FBBF24]">
                    {activeBanner.id === 'pte-offer' && <Flame className="w-4 h-4" />}
                    {activeBanner.id === 'prep' && <Award className="w-4 h-4" />}
                    {activeBanner.id === 'consultancy' && <ShieldCheck className="w-4 h-4" />}
                    {activeBanner.id === 'exam' && <CalendarCheck2 className="w-4 h-4" />}
                    {activeBanner.id === 'demo' && <GraduationCap className="w-4 h-4" />}
                    <span>{activeBanner.eyebrow}</span>
                  </p>

                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]">
                    {activeBanner.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                    {activeBanner.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {activeBanner.ctaHref ? (
                      <motion.a
                        href={activeBanner.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-md"
                      >
                        {activeBanner.ctaLabel}
                        <ArrowRight className="w-4 h-4" />
                      </motion.a>
                    ) : (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={activeBanner.ctaAction}
                        className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-md"
                      >
                        {activeBanner.ctaLabel}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    )}

                    <button
                      type="button"
                      onClick={activeBanner.secondaryAction}
                      className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-[#0B2249] bg-[#FBBF24] hover:bg-amber-300 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {activeBanner.secondaryLabel}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 lg:text-right">
                  <div className="inline-block bg-[#071631]/90 border border-white/15 rounded-xl px-4 py-3 text-left">
                    <p className="text-[11px] font-semibold text-slate-300">Program Highlight</p>
                    <p className="font-display text-sm sm:text-base font-extrabold text-[#FBBF24]">
                      {activeBanner.highlightMetric}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Animated Auto-Slide Progress Bar */}
          <div className="h-1 w-full bg-white/15 overflow-hidden">
            {!isPaused && (
              <motion.div
                key={`progress-${activeBanner.id}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_INTERVAL_MS / 1000, ease: 'linear' }}
                className="h-full bg-[#FBBF24] origin-left"
              />
            )}
          </div>
        </div>

        {/* Quick 5-Card Thumbnail Preview Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          {banners.map((card, idx) => {
            const active = idx === activeIndex;
            return (
              <motion.button
                key={card.id}
                type="button"
                whileHover={{ y: -3 }}
                onClick={() => setActiveIndex(idx)}
                className={`group rounded-xl overflow-hidden border text-left transition-all cursor-pointer flex items-center gap-3 p-2.5 ${
                  active
                    ? 'bg-[#0B2249] text-white border-[#0B2249] shadow-sm'
                    : 'bg-[#F5F7FB] text-[#0B2249] border-slate-200 hover:bg-white hover:border-[#DC1E25]/40'
                }`}
              >
                <div className="w-14 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                  <ResilientImage
                    src={card.image}
                    alt={card.tabLabel}
                    fallbackTitle={card.tabLabel}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs font-extrabold truncate">{card.tabLabel}</p>
                  <p
                    className={`text-[11px] truncate ${
                      active ? 'text-[#FBBF24]' : 'text-slate-600'
                    }`}
                  >
                    {card.highlightMetric}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
