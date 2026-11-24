import { ArrowRight, CheckCircle2, ExternalLink, GraduationCap, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import {
  CountryKey,
  JOURNEY_STEPS,
  KARACHI_CAMPUSES,
  PageRoute,
  STUDENT_STORIES,
} from '../data/consultancyData';
import { HeroSection } from '../components/HeroSection';
import { DestinationsSection } from '../components/DestinationsSection';
import { DemoBookingSection } from '../components/DemoBookingSection';
import { ResultsGallerySection } from '../components/ResultsGallerySection';
import { VideoTestimonialsSection } from '../components/VideoTestimonialsSection';
import { EligibilityAndCostCalculator } from '../components/EligibilityAndCostCalculator';
import { SocialFeedSection } from '../components/SocialFeedSection';
import { JournalSection } from '../components/JournalSection';
import { CampusLocationMap } from '../components/CampusLocationMap';
import { ResilientImage } from '../components/ResilientImage';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCountryForApplication: (country: CountryKey) => void;
  onApplyWithSummary: (country: CountryKey, summaryNote: string) => void;
}

export function HomePage({
  onNavigate,
  onSelectCountryForApplication,
  onApplyWithSummary,
}: HomePageProps) {
  return (
    <div>
      <HeroSection onStartEligibility={() => onNavigate('apply')} />

      <DestinationsSection
        onSelectCountryForApplication={onSelectCountryForApplication}
      />

      {/* IELTS, PTE, Duolingo, TOEFL & OET Free Demo Session Booking on Main Page */}
      <DemoBookingSection onNavigate={onNavigate} />

      {/* Authentic British Council Award, Sir Usman & Verified TRF Results Gallery */}
      <ResultsGallerySection onNavigate={onNavigate} />

      {/* Student Video Testimonials & Sir SM Usman YouTube Shorts */}
      <VideoTestimonialsSection />

      {/* Interactive Student Eligibility Checker & Year-1 Study Cost Calculator */}
      <EligibilityAndCostCalculator onApplyWithSummary={onApplyWithSummary} />

      {/* Live Facebook & Instagram Auto-Feed */}
      <SocialFeedSection />

      {/* Compact How It Works + Test Prep Bridge */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#DC1E25] mb-2">
                End-to-End Pathway
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
                From IELTS &amp; PTE Coaching to University Visa Approval
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0B2249] hover:text-[#DC1E25] transition-colors cursor-pointer self-start lg:self-auto"
            >
              View Interactive Services &amp; Test Prep
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {JOURNEY_STEPS.map((step, index) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -4 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => onNavigate('services')}
                className="bg-[#F5F7FB] hover:bg-white border border-slate-200 hover:border-[#0B2249]/40 rounded-2xl p-5 flex flex-col justify-between transition-colors cursor-pointer shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-sm font-bold text-[#DC1E25] tabular-nums">
                      {step.number}.
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                      {step.turnaround}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#0B2249] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.deliverable}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          {/* SM Usman's Academy Callout Banner */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="bg-[#0B2249] text-white rounded-2xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-md"
          >
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FBBF24]">
                <GraduationCap className="w-4 h-4" />
                <span>SM Usman’s Academy · Established 2007</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Need IELTS, PTE, Duolingo, TOEFL, or OET Before Applying?
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                Join British Council Highest Volume Contributor Award-winning classes across
                Gulshan, Shahrah-e-Faisal, Nazimabad, or live online—with free initial
                assessments and demo sessions.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('services')}
                className="px-5 py-3 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                Explore Test Prep
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('about')}
                className="px-5 py-3 text-sm font-semibold text-[#0B2249] bg-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                3 Karachi Campuses
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Editorial Placeholder Journal Dispatches */}
      <JournalSection
        onBookFromJournal={(topicNote) => onApplyWithSummary('uk', topicNote)}
      />

      {/* Interactive Karachi Campus Map & Real-Time Google Reviews */}
      <CampusLocationMap />

      {/* Featured Student Placements & Campus Strip */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#DC1E25] mb-2">
                Student Outcomes
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
                Recent Visa &amp; Scholarship Placements
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('guides')}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0B2249] hover:text-[#DC1E25] transition-colors cursor-pointer self-start lg:self-auto"
            >
              Read Student Stories &amp; Visa Guides
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {STUDENT_STORIES.map((story) => (
              <motion.article
                key={story.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-[#F5F7FB] hover:bg-white border border-slate-200 hover:border-[#0B2249]/40 rounded-2xl p-6 flex flex-col justify-between transition-colors shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <ResilientImage
                        src={story.portrait}
                        alt={story.studentName}
                        fallbackTitle={story.studentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-bold text-[#0B2249] truncate">
                        {story.studentName}
                      </h3>
                      <p className="text-xs text-slate-600 truncate">
                        {story.degree} · {story.university}
                      </p>
                      <p className="text-xs font-semibold text-[#DC1E25]">
                        {story.countryName}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {story.outcomeSummary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Placement · {story.intakeYear}</span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* 3 Campuses Summary Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 border-t border-slate-200">
            {KARACHI_CAMPUSES.map((campus) => (
              <motion.div
                key={campus.id}
                whileHover={{ y: -3 }}
                className="border border-slate-200 rounded-xl p-5 bg-[#F5F7FB] hover:bg-white flex flex-col justify-between gap-3 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#DC1E25] mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{campus.role}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#0B2249] mb-1">
                    {campus.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {campus.address}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
                  <p className="font-mono text-xs font-semibold text-[#0B2249] tabular-nums">
                    {campus.phone}
                  </p>
                  <a
                    href={campus.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#DC1E25] hover:underline"
                  >
                    Maps Pin
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
