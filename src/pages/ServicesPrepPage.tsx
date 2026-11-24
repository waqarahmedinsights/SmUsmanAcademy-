import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ACADEMY_POSTER_IMAGE,
  JOURNEY_STEPS,
  PageRoute,
  SIR_USMAN_PORTRAIT_IMAGE,
  TEST_PREP_COURSES,
  TestPageSlug,
} from '../data/consultancyData';
import { PageBanner } from '../components/PageBanner';
import { TestBrandLogo } from '../components/TestBrandLogo';

interface ServicesPrepPageProps {
  onStartCheck: (note?: string) => void;
  onNavigate?: (page: PageRoute) => void;
}

const COURSE_TO_PAGE_SLUG: Record<string, TestPageSlug> = {
  ielts: 'test-ielts',
  pte: 'test-pte',
  duolingo: 'test-duolingo',
  toefl: 'test-toefl',
  oet: 'test-oet',
};

const SERVICE_FORMATS = [
  {
    id: 'regular',
    title: 'Regular & Fast-Track',
    badge: 'Daily Sessions',
    detail: 'Morning, afternoon, and evening batches designed for students and professionals.',
    schedule: '4 to 8 Weeks · Small Batch Mentoring',
  },
  {
    id: 'weekend',
    title: 'Weekend Coaching',
    badge: 'Sat & Sun',
    detail: 'Saturday & Sunday intensive sessions tailored for working applicants and university students.',
    schedule: 'Focused Skill Workshops + Weekly Feedback',
  },
  {
    id: 'booking',
    title: 'Exam Booking Desk',
    badge: 'Official Support',
    detail: 'Official registration assistance for British Council, IDP, PTE, and Duolingo test dates.',
    schedule: 'Zero Third-Party Hidden Markup',
  },
  {
    id: 'mocks',
    title: 'Mock Assessments',
    badge: 'Diagnostic Lab',
    detail: 'Full-length timed speaking, writing, reading, and listening evaluations with Sir Usman’s faculty.',
    schedule: 'Weekly Band Score Progression Tracking',
  },
];

export function ServicesPrepPage({ onStartCheck, onNavigate }: ServicesPrepPageProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(TEST_PREP_COURSES[0].id);
  const [activeFormatId, setActiveFormatId] = useState<string>(SERVICE_FORMATS[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const selectedCourse =
    TEST_PREP_COURSES.find((c) => c.id === selectedCourseId) ?? TEST_PREP_COURSES[0];
  const activeStep = JOURNEY_STEPS[activeStepIndex] ?? JOURNEY_STEPS[0];
  const targetTestSlug = COURSE_TO_PAGE_SLUG[selectedCourse.id] ?? 'test-ielts';

  return (
    <div>
      <PageBanner
        eyebrow="Services & SM Usman’s Academy Coaching · Est. 2007"
        title="Complete Admissions Guidance & English Test Preparation"
        description="Prepare for IELTS, PTE Academic, Duolingo, TOEFL iBT, OET, and Spoken English with British Council trained instructors—paired with zero-fee university admissions and visa compliance."
        primaryImage={ACADEMY_POSTER_IMAGE}
        primaryAlt="SM Usman's Academy On-Campus IELTS, PTE, TOEFL, Duolingo and OET Classes"
        secondaryImage={SIR_USMAN_PORTRAIT_IMAGE}
        secondaryAlt="Sir SM Usman teaching on-campus classes in Karachi"
        badgeTitle="British Council Partner"
        badgeSubtitle="On-Campus Karachi & Live Online"
        actions={
          <>
            <button
              type="button"
              onClick={() => onStartCheck()}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-md"
            >
              Book Free Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('book-exam')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#0B2249] bg-[#FBBF24] hover:bg-amber-300 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <CalendarCheck2 className="w-4 h-4" />
                Book Official Exam
              </button>
            )}
          </>
        }
      />

      {/* Interactive SM Usman's Academy Test Prep Studio */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#DC1E25] mb-2">
                Interactive Test Prep Explorer · Since 2007
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
                IELTS, PTE, Duolingo, TOEFL &amp; OET Preparation
              </h2>
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs font-semibold text-[#0B2249] self-start lg:self-auto">
              <Award className="w-4 h-4 text-[#D4A017]" />
              <span>British Council Highest Volume Contributor Award (South Region)</span>
            </div>
          </div>

          {/* Interactive 5-Course Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {TEST_PREP_COURSES.map((course, idx) => {
              const isSelected = course.id === selectedCourseId;
              return (
                <motion.button
                  key={course.id}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`relative text-left p-4 rounded-2xl border transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#0B2249] text-white border-[#0B2249] shadow-lg'
                      : 'bg-[#F5F7FB] text-[#0B2249] border-slate-200 hover:border-[#DC1E25]/50 hover:bg-white'
                  }`}
                >
                  <div className="space-y-2.5">
                    <TestBrandLogo
                      id={course.id as 'ielts' | 'pte' | 'duolingo' | 'toefl' | 'oet'}
                      size="sm"
                    />
                    <div>
                      <p
                        className={`font-mono text-[11px] font-bold mb-0.5 ${
                          isSelected ? 'text-[#FBBF24]' : 'text-[#DC1E25]'
                        }`}
                      >
                        {course.duration}
                      </p>
                      <h3 className="font-display text-base font-extrabold">{course.shortName}</h3>
                      <p
                        className={`text-xs mt-1 leading-snug ${
                          isSelected ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {course.targetOutcome}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      isSelected ? 'text-[#FBBF24]' : 'text-[#0B2249]'
                    }`}
                  >
                    {isSelected ? 'Viewing Syllabus' : 'Inspect Modules →'}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Animated Course Details & Syllabus Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCourse.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#F5F7FB] border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-bold text-[#DC1E25] uppercase tracking-wider">
                    {selectedCourse.targetOutcome}
                  </span>
                  <span aria-hidden="true" className="text-slate-400">
                    ·
                  </span>
                  <span className="font-mono text-slate-600 flex items-center gap-1.5 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedCourse.duration}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2249]">
                  {selectedCourse.name}
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-slate-500">
                  {selectedCourse.variants} · {selectedCourse.formats}
                </p>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {selectedCourse.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      onStartCheck(`Requesting Free Demo Class for: ${selectedCourse.name}`)
                    }
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                    Book Free {selectedCourse.shortName} Demo Class
                  </motion.button>

                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate(targetTestSlug)}
                      className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-[#0B2249] bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                    >
                      Open {selectedCourse.shortName} Page
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <span className="text-xs font-semibold text-[#0B2249] flex items-center gap-1.5">
                    <BookOpenCheck className="w-4 h-4 text-[#DC1E25]" />
                    Free Mock Evaluation Included
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
                <p className="font-display text-sm font-bold text-[#0B2249] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#DC1E25]" />
                  Core Training Modules ({selectedCourse.shortName})
                </p>
                <ul className="space-y-3">
                  {selectedCourse.modules.map((mod) => (
                    <li key={mod} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Class Formats & Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICE_FORMATS.map((item) => {
              const active = item.id === activeFormatId;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFormatId(item.id)}
                  className={`text-left rounded-2xl p-6 border transition-colors cursor-pointer flex flex-col justify-between gap-4 ${
                    active
                      ? 'bg-[#0B2249] text-white border-[#0B2249] shadow-lg'
                      : 'bg-[#F5F7FB] text-[#0B2249] border-slate-200 hover:border-[#0B2249]/40 hover:bg-white'
                  }`}
                >
                  <div>
                    <p
                      className={`font-mono text-[11px] font-bold mb-1.5 ${
                        active ? 'text-[#FBBF24]' : 'text-[#DC1E25]'
                      }`}
                    >
                      {item.badge}
                    </p>
                    <p className="font-display text-lg font-bold mb-2">{item.title}</p>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        active ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {item.detail}
                    </p>
                  </div>
                  <p
                    className={`pt-3 border-t text-xs font-semibold ${
                      active
                        ? 'border-white/15 text-[#FBBF24]'
                        : 'border-slate-200 text-[#0B2249]'
                    }`}
                  >
                    {item.schedule}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Study Abroad 5-Step Consultancy Process */}
      <section className="py-16 lg:py-20 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#DC1E25] mb-2">
                Interactive Consultancy Roadmap
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
                Zero-Fee University Admissions &amp; Visa Compliance
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Click any milestone below to inspect turnaround times and deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            {JOURNEY_STEPS.map((step, idx) => {
              const active = idx === activeStepIndex;
              return (
                <motion.button
                  key={step.number}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`text-left rounded-2xl p-5 border transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                    active
                      ? 'bg-[#0B2249] text-white border-[#0B2249] shadow-md'
                      : 'bg-white text-[#0B2249] border-slate-200 hover:border-[#DC1E25]/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-sm font-bold tabular-nums ${
                        active ? 'text-[#FBBF24]' : 'text-[#DC1E25]'
                      }`}
                    >
                      {step.number}.
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        active ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {step.turnaround}
                    </span>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold leading-snug">
                    {step.title}
                  </h3>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.number}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs"
            >
              <div className="max-w-3xl space-y-2.5">
                <p className="font-mono text-xs font-bold text-[#DC1E25] uppercase tracking-wider">
                  Step {activeStep.number} · {activeStep.turnaround}
                </p>
                <h3 className="font-display text-2xl font-extrabold text-[#0B2249]">
                  {activeStep.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {activeStep.description}
                </p>
                <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 pt-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Deliverable: {activeStep.deliverable}
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  onStartCheck(`Starting Step ${activeStep.number}: ${activeStep.title}`)
                }
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer shrink-0 self-start lg:self-center"
              >
                Start With Step {activeStep.number}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
