import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { SocialBrandIcon } from './SocialBrandIcon';

export function OfferRibbonAndSplash() {
  const { config } = useSiteContent();
  const [ribbonVisible, setRibbonVisible] = useState(true);
  const [splashOpen, setSplashOpen] = useState(false);

  const offer = config.megaOffer;
  const schedule = config.demoSchedule;
  const waNumber = config.socialLinks.whatsappNumber;
  const waDisplay = config.socialLinks.whatsappDisplay;
  const scorecardsUrl = config.awardsAndPictures.pteScorecardsUrl;

  if (!offer.enabled) {
    return null;
  }

  const pteOfferWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Assalam-o-Alaikum Sir Usman! I want to enroll in ${offer.title} (${offer.duration} · ${offer.frequency} ${offer.timings} · Discounted Fee ${offer.discountedFee}).`
  )}`;

  const demoTodayWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Assalam-o-Alaikum Sir Usman! I want to book my FREE DEMO CLASS TODAY.\nCourse: \nName: \nPreferred Campus (${schedule.campuses.slice(0, 2).join(' / ')}): `
  )}`;

  return (
    <>
      {/* Sleek Single-Line Promo Offer Ribbon at Very Top */}
      {ribbonVisible && (
        <div className="bg-gradient-to-r from-[#B9151B] via-[#DC1E25] to-[#0B2249] text-white border-b border-white/15">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2 text-[11px] sm:text-xs">
            <a
              href={pteOfferWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-2 min-w-0 hover:text-[#FBBF24] transition-colors"
            >
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FBBF24] text-[#0B2249] font-extrabold shrink-0">
                <Flame className="w-3 h-3" />
                MEGA OFFER
              </span>
              <span className="truncate font-semibold">{offer.ribbonText}</span>
            </a>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setSplashOpen(true)}
                className="px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-white font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                View Offer
              </button>
              <button
                type="button"
                aria-label="Dismiss offer ribbon"
                onClick={() => setRibbonVisible(false)}
                className="p-1 rounded hover:bg-white/15 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discreet Floating Left-Side Mega Offer Splash Trigger */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setSplashOpen(true)}
        aria-label="Open PTE Online Mega Offer & Free Demo Splash"
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0B2249] hover:bg-[#DC1E25] text-white border border-[#FBBF24] shadow-xl text-xs font-extrabold transition-colors cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-[#FBBF24]" />
        <span className="hidden sm:inline">Mega Offer: {offer.discountedFee}</span>
        <span className="sm:hidden">{offer.discountedFee} Offer</span>
      </motion.button>

      {/* Interactive Offer Splash Modal (Click Opens WhatsApp Directly) */}
      <AnimatePresence>
        {splashOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSplashOpen(false)}
            className="fixed inset-0 z-50 bg-[#071631]/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              {/* Top Splash Header */}
              <div className="bg-gradient-to-r from-[#0B2249] via-[#0B2249] to-[#DC1E25] text-white px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-bold text-[#FBBF24] uppercase tracking-wider">
                    {offer.badge}
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold">
                    {offer.title} &amp; Free Demo Today
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSplashOpen(false)}
                  aria-label="Close offer splash"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-4">
                  {/* Pricing Banner */}
                  <div className="rounded-xl bg-[#F5F7FB] border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Original Fee</p>
                      <p className="font-mono text-base font-bold text-slate-400 line-through">
                        {offer.originalFee}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#DC1E25]">Discounted Mega Offer</p>
                      <p className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0B2249] tabular-nums">
                        {offer.discountedFee}
                      </p>
                    </div>
                  </div>

                  {/* Schedule Summary */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-slate-500">Duration</p>
                      <p className="font-bold text-[#0B2249]">{offer.duration}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-slate-500">{offer.frequency}</p>
                      <p className="font-mono font-bold text-[#DC1E25]">{offer.timings}</p>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    {offer.inclusions.map((inc) => (
                      <li key={inc} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Free Demo & Timing Snapshot */}
                  <div className="p-3.5 rounded-xl bg-[#0B2249]/5 border border-[#0B2249]/15 text-xs space-y-1">
                    <p className="font-bold text-[#0B2249] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#DC1E25]" />
                      Free Demo Class Today · {schedule.campuses.slice(0, 2).join(' & ')}
                    </p>
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0B2249] shrink-0" />
                      <span>
                        Slots ({schedule.shahrahDays.join('/')}):{' '}
                        {schedule.timingSlots.slice(0, 4).join(' · ')}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <a
                      href={pteOfferWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
                    >
                      <SocialBrandIcon platform="whatsapp" className="w-4 h-4" />
                      Enroll {offer.discountedFee} Offer on WhatsApp
                    </a>
                    <a
                      href={demoTodayWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#DC1E25] hover:bg-[#B9151B] text-white text-xs sm:text-sm font-bold transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      Book Free Demo
                    </a>
                  </div>
                </div>

                {/* Real PTE Scorecards Visual */}
                <div className="md:col-span-5 space-y-2">
                  <a
                    href={pteOfferWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden border border-slate-200 hover:border-[#DC1E25] transition-colors shadow-sm"
                  >
                    <img
                      src={scorecardsUrl}
                      alt="Official Pearson PTE student score reports from SM Usman's Academy"
                      className="w-full h-auto object-cover"
                    />
                  </a>
                  <p className="text-[11px] text-center text-slate-500">
                    Real PTE Academic 89–90/90 Results · Tap above or message{' '}
                    <span className="font-mono font-bold text-[#0B2249]">{waDisplay}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
