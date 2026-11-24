import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import {
  ACADEMY_POSTER_IMAGE,
  KARACHI_CAMPUSES,
  LEAD_EMAIL,
  PageRoute,
  SHAHRAH_E_FAISAL_SCHEDULE,
  TEST_PREP_COURSES,
  TestPageSlug,
  WHATSAPP_DISPLAY,
  WHATSAPP_WA_NUMBER,
} from '../data/consultancyData';
import { ResilientImage } from './ResilientImage';
import { TestBrandLogo } from './TestBrandLogo';

interface DemoBookingSectionProps {
  onNavigate?: (page: PageRoute) => void;
}

const COURSE_TO_PAGE_SLUG: Record<string, TestPageSlug> = {
  ielts: 'test-ielts',
  pte: 'test-pte',
  duolingo: 'test-duolingo',
  toefl: 'test-toefl',
  oet: 'test-oet',
};

const DEMO_SLOTS = [
  'Shahrah-e-Faisal (Mon/Tue/Thu/Sat) · 12:00 PM – 1:30 PM',
  'Shahrah-e-Faisal (Mon/Tue/Thu/Sat) · 3:00 PM – 4:30 PM',
  'Shahrah-e-Faisal (Mon/Tue/Thu/Sat) · 4:30 PM – 6:00 PM',
  'Shahrah-e-Faisal (Mon/Tue/Thu/Sat) · 6:30 PM – 8:00 PM',
  'PTE Online Mega Offer (Mon/Wed/Fri) · 11:00 PM – 12:00 AM',
  'Morning Session (10:00 AM – 12:00 PM)',
  'Weekend Intensive (Saturday – Sunday)',
];

const MODE_OPTIONS = [
  ...KARACHI_CAMPUSES.map((c) => c.name.replace("SM Usman's Academy ", '')),
  'Live Online Demo (Zoom / Google Meet)',
];

export function DemoBookingSection({ onNavigate }: DemoBookingSectionProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ielts');
  const [selectedMode, setSelectedMode] = useState<string>(MODE_OPTIONS[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(DEMO_SLOTS[0]);
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookedRef, setBookedRef] = useState<{
    referenceId: string;
    emailDelivered: boolean;
  } | null>(null);

  const selectedCourse =
    TEST_PREP_COURSES.find((c) => c.id === selectedCourseId) ?? TEST_PREP_COURSES[0];

  const handleBookDemo = async (e: FormEvent) => {
    e.preventDefault();
    if (studentName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[+\d][\d\s()-]{7,18}$/.test(studentPhone.trim())) {
      setErrorMsg('Please enter a valid WhatsApp or phone number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    try {
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: studentName.trim(),
          email: studentEmail.trim(),
          phone: studentPhone.trim(),
          country: 'uk',
          studyLevel: `Free Demo Class — ${selectedCourse.name}`,
          discipline: selectedCourse.shortName,
          intake: selectedSlot,
          englishStatus: selectedMode,
          notes: `Free Demo Session Requested: ${selectedCourse.name} (${selectedCourse.variants}) | Campus/Mode: ${selectedMode} | Preferred Slot: ${selectedSlot}`,
          source: `Main Page Demo Session Booking (${selectedCourse.shortName})`,
        }),
      });

      const data = (await resp.json()) as {
        ok?: boolean;
        referenceId?: string;
        emailDelivered?: boolean;
        error?: string;
      };

      if (!resp.ok || !data.ok || !data.referenceId) {
        setErrorMsg(
          data.error ||
            `Could not confirm booking automatically. Please message WhatsApp ${WHATSAPP_DISPLAY}.`
        );
        return;
      }

      setBookedRef({
        referenceId: data.referenceId,
        emailDelivered: Boolean(data.emailDelivered),
      });
    } catch {
      setErrorMsg(
        `Connection interrupted. Please confirm your demo seat via WhatsApp ${WHATSAPP_DISPLAY}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const summaryText = [
    `Free Demo Booking (${bookedRef?.referenceId ?? 'SMU-DEMO'})`,
    `Course: ${selectedCourse.name}`,
    `Campus / Mode: ${selectedMode}`,
    `Slot: ${selectedSlot}`,
    `Name: ${studentName}`,
    `Phone: ${studentPhone}`,
    `Email: ${studentEmail}`,
  ].join('\n');

  const whatsappUrl = `https://wa.me/${WHATSAPP_WA_NUMBER}?text=${encodeURIComponent(summaryText)}`;
  const mailtoUrl = `mailto:${LEAD_EMAIL}?subject=${encodeURIComponent(
    `[Demo Booking] ${selectedCourse.shortName} — ${studentName}`
  )}&body=${encodeURIComponent(summaryText)}`;

  return (
    <section
      id="demo-booking"
      className="py-16 lg:py-24 bg-[#0B2249] text-white relative overflow-hidden border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
        >
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-[#FBBF24] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>SM Usman’s Academy · Official Test Preparation &amp; Free Demo</span>
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]">
              Book Your Free IELTS, PTE, Duolingo, TOEFL or OET Demo Session
            </h2>
          </div>

          <p className="text-sm text-slate-300 max-w-md">
            Click any official English test below to select your exam and reserve a live on-campus
            or online diagnostic class.
          </p>
        </motion.div>

        {/* Interactive Official English Test Logos Bar — Balanced Single 5-Column Row on Tablet/Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {TEST_PREP_COURSES.map((course) => {
            const active = course.id === selectedCourseId;
            return (
              <motion.button
                key={course.id}
                type="button"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCourseId(course.id)}
                className={`rounded-2xl p-4 border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  active
                    ? 'bg-white text-[#0B2249] border-[#FBBF24] ring-2 ring-[#FBBF24] shadow-xl'
                    : 'bg-[#071631] text-white border-white/15 hover:border-white/40 hover:bg-[#0D2A5C]'
                }`}
              >
                <div className="w-full flex items-center justify-start">
                  <TestBrandLogo
                    id={course.id as 'ielts' | 'pte' | 'duolingo' | 'toefl' | 'oet'}
                    size="md"
                  />
                </div>
                <div>
                  <p className="font-display text-sm font-extrabold">{course.shortName}</p>
                  <p
                    className={`text-[11px] leading-snug mt-0.5 ${
                      active ? 'text-[#DC1E25] font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {course.targetOutcome}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200"
          >
            {bookedRef ? (
              <div className="space-y-6 py-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">
                      Demo Seat Reserved · {bookedRef.referenceId}
                    </p>
                    <h3 className="font-display text-2xl font-extrabold text-[#0B2249]">
                      See You in Your {selectedCourse.shortName} Demo, {studentName}!
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {bookedRef.emailDelivered
                    ? `Your free demo reservation has been emailed directly to ${LEAD_EMAIL}.`
                    : `Your free demo request (${bookedRef.referenceId}) is logged for ${LEAD_EMAIL}.`}{' '}
                  Our academic coordinator will confirm your room or Zoom link on{' '}
                  <span className="font-mono font-semibold text-[#0B2249]">{studentPhone}</span>.
                </p>

                <div className="bg-[#F5F7FB] border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div>
                    <p className="text-slate-500">Program</p>
                    <p className="font-bold text-[#0B2249]">{selectedCourse.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Campus / Format</p>
                    <p className="font-bold text-[#0B2249]">{selectedMode}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Batch Slot</p>
                    <p className="font-bold text-[#0B2249]">{selectedSlot}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1EBE5B] rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Confirm on WhatsApp ({WHATSAPP_DISPLAY})
                  </a>

                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0B2249] hover:bg-[#DC1E25] rounded-xl transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email Copy ({LEAD_EMAIL})
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setBookedRef(null);
                      setStudentName('');
                      setStudentPhone('');
                      setStudentEmail('');
                    }}
                    className="px-4 py-2.5 text-sm font-semibold text-[#0B2249] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Book Another Demo
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookDemo} className="space-y-6" noValidate>
                {/* Selected Exam Summary */}
                <div className="bg-[#F5F7FB] border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <TestBrandLogo
                        id={selectedCourse.id as 'ielts' | 'pte' | 'duolingo' | 'toefl' | 'oet'}
                        size="md"
                      />
                      <span className="font-display text-lg font-extrabold text-[#0B2249]">
                        {selectedCourse.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 pt-1">
                      {selectedCourse.variants} · {selectedCourse.formats}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0 space-y-1">
                    <p className="font-mono text-xs font-bold text-[#DC1E25] tabular-nums">
                      {selectedCourse.duration}
                    </p>
                    <p className="text-xs font-semibold text-[#0B2249]">
                      {selectedCourse.targetOutcome}
                    </p>
                    {onNavigate && (
                      <div className="flex flex-wrap sm:justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate(COURSE_TO_PAGE_SLUG[selectedCourse.id] ?? 'test-ielts')
                          }
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0B2249] hover:text-[#DC1E25] underline cursor-pointer"
                        >
                          Full {selectedCourse.shortName} Page
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate('book-exam')}
                          className="text-xs font-bold text-[#DC1E25] hover:underline cursor-pointer"
                        >
                          · Book Official Exam
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Campus & Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="demoMode"
                      className="flex items-center gap-1.5 text-sm font-bold text-[#0B2249] mb-2"
                    >
                      <MapPin className="w-4 h-4 text-[#DC1E25]" />
                      2. Campus or Online Mode
                    </label>
                    <select
                      id="demoMode"
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white cursor-pointer"
                    >
                      {MODE_OPTIONS.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="demoSlot"
                      className="flex items-center gap-1.5 text-sm font-bold text-[#0B2249] mb-2"
                    >
                      <Clock className="w-4 h-4 text-[#DC1E25]" />
                      3. Preferred Batch Timing
                    </label>
                    <select
                      id="demoSlot"
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white cursor-pointer"
                    >
                      {DEMO_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="demoName"
                      className="block text-xs font-bold text-[#0B2249] mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="demoName"
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="demoPhone"
                      className="block text-xs font-bold text-[#0B2249] mb-1.5"
                    >
                      WhatsApp / Phone *
                    </label>
                    <input
                      id="demoPhone"
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="+92 332 3502864"
                      className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="demoEmail"
                      className="block text-xs font-bold text-[#0B2249] mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="demoEmail"
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p
                    role="alert"
                    className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-800"
                  >
                    {errorMsg}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <p className="text-xs text-slate-500">
                    Bookings go directly to <span className="font-semibold text-[#0B2249]">{LEAD_EMAIL}</span>
                  </p>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 min-h-11 text-sm font-semibold text-white bg-[#0B2249] hover:bg-[#DC1E25] disabled:opacity-60 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <CalendarCheck2 className="w-4 h-4 text-[#FBBF24]" />
                    {submitting
                      ? 'Booking Demo Seat...'
                      : `Book Free ${selectedCourse.shortName} Demo Session`}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>

          {/* Official On-Campus Classroom Poster Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 rounded-2xl overflow-hidden border border-white/15 bg-[#071631] flex flex-col justify-between shadow-xl"
          >
            <div className="aspect-[4/5] w-full overflow-hidden bg-slate-900">
              <ResilientImage
                src={ACADEMY_POSTER_IMAGE}
                alt="SM Usman's Academy On-Campus IELTS, PTE, TOEFL, Duolingo and OET Classes with Sir Usman"
                fallbackTitle="Sir SM Usman On-Campus Batches"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 space-y-2.5 border-t border-white/10">
              <p className="font-display text-sm font-bold text-[#FBBF24]">
                Free Speaking &amp; Writing Diagnostic
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Meet Sir SM Usman and British Council trained instructors for a baseline score
                assessment and personalized study schedule.
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-200 space-y-1">
                <p className="font-bold text-[#FBBF24]">
                  Shahrah-e-Faisal Days: {SHAHRAH_E_FAISAL_SCHEDULE.days.join(' · ')}
                </p>
                <p className="font-mono text-slate-300">
                  {SHAHRAH_E_FAISAL_SCHEDULE.timings.join(' | ')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
