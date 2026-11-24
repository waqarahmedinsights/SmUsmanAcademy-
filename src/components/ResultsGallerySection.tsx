import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, Expand, Sparkles, X } from 'lucide-react';
import {
  PageRoute,
  StudentResultCard,
} from '../data/consultancyData';
import { useSiteContent } from '../context/SiteContentContext';
import { ResilientImage } from './ResilientImage';

interface ResultsGallerySectionProps {
  onNavigate: (page: PageRoute) => void;
}

export function ResultsGallerySection({ onNavigate }: ResultsGallerySectionProps) {
  const { config } = useSiteContent();
  const pics = config.awardsAndPictures;
  const resultCards = config.resultCards;
  const [selectedResult, setSelectedResult] = useState<StudentResultCard | null>(null);

  useEffect(() => {
    if (!selectedResult) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedResult(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedResult]);

  return (
    <section className="py-16 lg:py-24 bg-[#F5F7FB] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* British Council & Pearson PTE Award Recognition Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm"
        >
          <div className="lg:col-span-6 space-y-4">
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#DC1E25]">
              <Award className="w-4 h-4 text-[#D4A017]" />
              <span>British Council &amp; Pearson PTE Partner Awards · Est. 2007</span>
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
              British Council Award &amp; Pearson PTE Rising Star Award 2025–2026
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Recognized by British Council (Highest Volume Contributor, South Region) and Pearson
              Test of English (Rising Star Award 2025–2026). Sir SM Usman and our certified faculty
              help students score Band 7.5–8.5 IELTS, 89–90/90 PTE, 125+ Duolingo, and Grade B OET.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                { label: 'PTE 90/90 & Band 8.5', sub: 'Verified Score Reports' },
                { label: 'Rising Star 2025–26', sub: 'Official Pearson Award' },
                { label: 'South Region Award', sub: 'British Council Partner' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#F5F7FB] border border-slate-200 rounded-xl p-3"
                >
                  <p className="font-display text-xs sm:text-sm font-bold text-[#0B2249]">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-500">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('test-ielts')}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer"
              >
                Explore IELTS Page
              </button>
                <button
                type="button"
                onClick={() => onNavigate('test-pte')}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#0B2249] bg-[#FBBF24] hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
              >
                PTE {config.megaOffer.discountedFee} Offer
              </button>
              <button
                type="button"
                onClick={() => onNavigate('services')}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#0B2249] bg-[#F5F7FB] hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                All 6 Test Courses
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-12 gap-3 items-stretch">
            <div className="col-span-7 space-y-3">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                <ResilientImage
                  src={pics.britishCouncilAwardUrl}
                  alt="SM Usman's Academy receiving British Council Highest Volume Contributor Award South Region"
                  fallbackTitle="British Council Award Ceremony"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                  <ResilientImage
                    src={pics.pearsonTrophyUrl}
                    alt="Pearson Test of English Rising Star Award 2025-2026 Trophy for SM Usman's Academy"
                    fallbackTitle="Pearson Rising Star Award"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                  <ResilientImage
                    src={pics.pearsonStageUrl}
                    alt="Sir SM Usman receiving Pearson Rising Star Award on stage"
                    fallbackTitle="Pearson Partner Ceremony"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-5 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs relative min-h-[260px]">
              <ResilientImage
                src={pics.sirUsmanPortraitUrl}
                alt="Sir SM Usman IELTS Trainer in Karachi"
                fallbackTitle="Sir SM Usman"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B2249]/95 via-[#0B2249]/50 to-transparent p-3.5 text-white">
                <p className="font-display text-xs sm:text-sm font-bold">Sir SM Usman</p>
                <p className="text-[11px] text-[#FBBF24]">Lead IELTS &amp; PTE Mentor</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verified Student IELTS Result Scorecards Gallery */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#DC1E25] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Real Verified Student Scorecards · ielts-smusman.com</span>
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
              Our Students’ Official IELTS Results &amp; Top Band Achievers
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-sm">
            Click any student scorecard below to inspect the official Test Report Form (TRF)
            highlight in full resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resultCards.map((res, idx) => (
            <motion.button
              key={res.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedResult(res)}
              className="group text-left bg-white border border-slate-200 hover:border-[#DC1E25] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <ResilientImage
                  src={res.image}
                  alt={`${res.studentName} ${res.scoreLabel} official result`}
                  fallbackTitle={res.studentName}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#0B2249]/85 text-white flex items-center justify-center opacity-90 group-hover:bg-[#DC1E25] transition-colors">
                  <Expand className="w-4 h-4" />
                </span>
              </div>

              <div className="p-5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#DC1E25]">
                    {res.scoreLabel}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{res.testType}</span>
                </div>
                <h3 className="font-display text-base font-bold text-[#0B2249]">
                  {res.studentName}
                </h3>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {res.highlight}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Result Inspection */}
      {selectedResult && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedResult.studentName} official scorecard`}
          className="fixed inset-0 z-50 bg-[#0B2249]/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedResult(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-[#0B2249] text-white flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-[#FBBF24] font-bold">
                  {selectedResult.scoreLabel} · {selectedResult.testType}
                </p>
                <h3 className="font-display text-lg font-extrabold">{selectedResult.studentName}</h3>
              </div>
              <button
                type="button"
                aria-label="Close scorecard viewer"
                onClick={() => setSelectedResult(null)}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-slate-100 flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={selectedResult.image}
                alt={`${selectedResult.studentName} scorecard`}
                className="max-h-[62vh] w-auto rounded-xl border border-slate-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
