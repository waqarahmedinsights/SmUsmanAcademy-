import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import {
  BANNER_OFFICIAL_EXAM_IMAGE,
  BANNER_TEST_PREP_IMAGE,
  OFFICIAL_EXAM_BOOKING_OPTIONS,
  PageRoute,
} from '../data/consultancyData';
import { broadcastSiteSync, useSiteContent } from '../context/SiteContentContext';
import { PageBanner } from '../components/PageBanner';
import { TestBrandLogo } from '../components/TestBrandLogo';

interface BookExamPageProps {
  onNavigate: (page: PageRoute) => void;
}

const TARGET_YEARS = ['2026', '2027', '2028'];

const EXAMISM_STORE_CATEGORIES: { id: string; label: string; url: string }[] = [
  { id: 'all', label: 'All Storefront', url: 'https://smusman.examism.com/' },
  { id: 'pte', label: 'PTE Academic Vouchers', url: 'https://smusman.examism.com/vouchers/pte' },
  { id: 'ielts', label: 'IELTS Vouchers', url: 'https://smusman.examism.com/vouchers/ielts' },
  { id: 'det', label: 'Duolingo (DET) Vouchers', url: 'https://smusman.examism.com/vouchers/det' },
  { id: 'apeuni', label: 'APEUni PTE Practice', url: 'https://smusman.examism.com/vouchers/apeuni' },
  { id: 'alfa', label: 'Alfa PTE Practice', url: 'https://smusman.examism.com/vouchers/alfa' },
  { id: 'arno', label: 'Arno IELTS / OET / TOEFL', url: 'https://smusman.examism.com/vouchers/arnoielts' },
];

function getBrandIdFromExam(
  examId: string
): 'ielts' | 'pte' | 'duolingo' | 'toefl' | 'oet' {
  if (examId.includes('pte')) return 'pte';
  if (examId.includes('duolingo')) return 'duolingo';
  if (examId.includes('toefl')) return 'toefl';
  if (examId.includes('oet')) return 'oet';
  return 'ielts';
}

export function BookExamPage({ onNavigate }: BookExamPageProps) {
  const { config, showLeadToast } = useSiteContent();
  const leadEmail = config.socialLinks.leadEmail;
  const waDisplay = config.socialLinks.whatsappDisplay;
  const waNumber = config.socialLinks.whatsappNumber;
  const pics = config.awardsAndPictures;

  const [selectedExamId, setSelectedExamId] = useState(OFFICIAL_EXAM_BOOKING_OPTIONS[0].id);
  const selectedExam =
    OFFICIAL_EXAM_BOOKING_OPTIONS.find((e) => e.id === selectedExamId) ??
    OFFICIAL_EXAM_BOOKING_OPTIONS[0];

  const [format, setFormat] = useState(selectedExam.formats[0]);
  const [city, setCity] = useState(selectedExam.cities[0]);
  const [preferredYear, setPreferredYear] = useState('2026');
  const [preferredDate, setPreferredDate] = useState('2026-12-15');
  const [passportReady, setPassportReady] = useState('Original Valid Passport Available');
  const [includeFreeMock, setIncludeFreeMock] = useState(true);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bookedRef, setBookedRef] = useState<{
    referenceId: string;
    emailDelivered: boolean;
  } | null>(null);
  const [activeStoreCategory, setActiveStoreCategory] = useState(EXAMISM_STORE_CATEGORIES[0]);
  const [showLiveStoreFrame, setShowLiveStoreFrame] = useState(true);

  const handleSelectExam = (examId: string) => {
    const next =
      OFFICIAL_EXAM_BOOKING_OPTIONS.find((e) => e.id === examId) ??
      OFFICIAL_EXAM_BOOKING_OPTIONS[0];
    setSelectedExamId(examId);
    setFormat(next.formats[0]);
    setCity(next.cities[0]);
    setBookedRef(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      setFormError('Please enter your full name exactly as shown on your passport.');
      return;
    }
    if (!/^[+\d][\d\s()-]{7,18}$/.test(phone.trim())) {
      setFormError('Please enter a valid WhatsApp or mobile number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address for booking confirmation.');
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          country: 'uk',
          studyLevel: `Official Exam Booking — ${selectedExam.shortName}`,
          discipline: format,
          intake: `Target Year ${preferredYear} · Preferred Date: ${preferredDate}`,
          englishStatus: passportReady,
          notes: `Official Exam Desk Request: ${selectedExam.name} | Format: ${format} | Test City: ${city} | Preferred Date: ${preferredDate} (${preferredYear}) | ID Status: ${passportReady} | Include Free Pre-Exam Mock Assessment: ${
            includeFreeMock ? 'Yes' : 'No'
          }`,
          source: `Official Book Exam Desk (${selectedExam.shortName})`,
        }),
      });

      const result = (await resp.json()) as {
        ok?: boolean;
        referenceId?: string;
        emailDelivered?: boolean;
        error?: string;
      };

      if (!resp.ok || !result.ok || !result.referenceId) {
        setFormError(
          result.error ||
            `Could not submit exam booking automatically. Please message WhatsApp ${waDisplay}.`
        );
        return;
      }

      broadcastSiteSync('lead-created');
      showLeadToast({
        referenceId: result.referenceId,
        title: 'Exam Request Received!',
        message: `Your ${selectedExam.shortName} registration request for ${preferredDate} (${city}) has been logged.`,
        emailDelivered: Boolean(result.emailDelivered),
      });
      setBookedRef({
        referenceId: result.referenceId,
        emailDelivered: Boolean(result.emailDelivered),
      });
    } catch {
      setFormError(`Network issue. Please confirm directly on WhatsApp ${waDisplay}.`);
    } finally {
      setSubmitting(false);
    }
  };

  const summaryPlainText = [
    `Official Exam Registration Request (${bookedRef?.referenceId ?? 'SMU-EXAM'})`,
    `Exam: ${selectedExam.name}`,
    `Format: ${format}`,
    `Test City: ${city}`,
    `Preferred Date: ${preferredDate} (Year ${preferredYear})`,
    `ID Status: ${passportReady}`,
    `Free Mock Included: ${includeFreeMock ? 'Yes' : 'No'}`,
    `Candidate: ${fullName} | ${phone} | ${email}`,
  ].join('\n');

  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    summaryPlainText
  )}`;
  const mailtoUrl = `mailto:${leadEmail}?subject=${encodeURIComponent(
    `[Official Exam Booking] ${selectedExam.shortName} — ${fullName}`
  )}&body=${encodeURIComponent(summaryPlainText)}`;

  return (
    <div>
      <PageBanner
        eyebrow="Official Test Registration Desk · British Council & Pearson Partner"
        title="Book Your Official IELTS, PTE, Duolingo, TOEFL or OET Exam Date"
        description="Reserve your official test seat through SM Usman’s Academy with zero agency surcharge, 2026–2028 flexible scheduling, and a complimentary pre-exam Speaking & Writing evaluation."
        primaryImage={pics.bannerOfficialExamUrl || BANNER_OFFICIAL_EXAM_IMAGE}
        primaryAlt="Official computer-delivered IELTS and PTE exam booking desk and testing workstations"
        secondaryImage={pics.bannerTestPrepUrl || BANNER_TEST_PREP_IMAGE}
        secondaryAlt="Test preparation and pre-exam diagnostic lab"
        badgeTitle="Zero Hidden Fee Exam Desk"
        badgeSubtitle="Karachi · Lahore · Islamabad · Home Proctored"
        actions={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                document.getElementById('direct-exam-store')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Direct Buy Discounted Vouchers
            </button>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-[#0B2249] bg-[#FBBF24] hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
            >
              Need Coaching First? View Test Prep
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Interactive Exam Board Selection + Booking Form */}
      <section className="py-14 lg:py-20 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-bold text-[#DC1E25] mb-1.5">
              Step 1 · Select Your Exam Board
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2249]">
              Choose Which Official Test You Want to Register For
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {OFFICIAL_EXAM_BOOKING_OPTIONS.map((exam) => {
              const active = exam.id === selectedExamId;
              return (
                <motion.button
                  key={exam.id}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectExam(exam.id)}
                  className={`text-left rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    active
                      ? 'bg-[#0B2249] text-white border-[#0B2249] shadow-lg ring-2 ring-[#DC1E25]'
                      : 'bg-white text-[#0B2249] border-slate-200 hover:border-[#DC1E25]/50'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <TestBrandLogo id={getBrandIdFromExam(exam.id)} size="sm" />
                      <span
                        className={`text-[11px] font-mono font-semibold ${
                          active ? 'text-[#FBBF24]' : 'text-slate-500'
                        }`}
                      >
                        {exam.bodyPartner}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-extrabold">{exam.name}</h3>
                  </div>

                  <p
                    className={`text-xs flex items-center gap-1.5 ${
                      active ? 'text-slate-200' : 'text-slate-600'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                    Results: {exam.resultTurnaround}
                  </p>
                </motion.button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Booking Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              {bookedRef ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-xs font-bold text-emerald-700 uppercase">
                        Exam Desk Request Logged · {bookedRef.referenceId}
                      </p>
                      <h3 className="font-display text-2xl font-extrabold text-[#0B2249]">
                        We Received Your {selectedExam.shortName} Date Request!
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {bookedRef.emailDelivered
                      ? `Your official test booking summary has been delivered to ${leadEmail}.`
                      : `Your request (${bookedRef.referenceId}) is ready for ${leadEmail}.`}{' '}
                    Our exam coordinator will verify live seat availability for{' '}
                    <span className="font-mono font-bold text-[#0B2249]">{preferredDate}</span> in{' '}
                    <span className="font-bold text-[#0B2249]">{city}</span> and contact you on{' '}
                    <span className="font-mono font-bold text-[#0B2249]">{phone}</span>.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1EBE5B] rounded-xl transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Confirm Seat on WhatsApp ({waDisplay})
                    </a>

                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0B2249] hover:bg-[#DC1E25] rounded-xl transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Email Booking ({leadEmail})
                    </a>

                    <button
                      type="button"
                      onClick={() => setBookedRef(null)}
                      className="px-4 py-3 text-sm font-semibold text-[#0B2249] bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                    >
                      Book Another Exam
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <p className="text-xs font-bold text-[#DC1E25] uppercase tracking-wider mb-1">
                      Step 2 · Seat Scheduling (2026 – 2028 Dates Open)
                    </p>
                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B2249]">
                      Register for {selectedExam.shortName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="examFormat"
                        className="block text-xs font-bold text-[#0B2249] mb-1.5"
                      >
                        Test Module / Format
                      </label>
                      <select
                        id="examFormat"
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                      >
                        {selectedExam.formats.map((fmt) => (
                          <option key={fmt} value={fmt}>
                            {fmt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="examCity"
                        className="block text-xs font-bold text-[#0B2249] mb-1.5"
                      >
                        Preferred Test City / Mode
                      </label>
                      <select
                        id="examCity"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                      >
                        {selectedExam.cities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-[#0B2249] mb-1.5">
                        Exam Target Year (Up to 2028)
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {TARGET_YEARS.map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => {
                              setPreferredYear(yr);
                              setPreferredDate(`${yr}-${preferredDate.slice(5)}`);
                            }}
                            className={`py-2.5 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                              preferredYear === yr
                                ? 'bg-[#0B2249] text-white border-[#0B2249]'
                                : 'bg-[#F5F7FB] text-[#0B2249] border-slate-300 hover:border-[#DC1E25]'
                            }`}
                          >
                            {yr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="examDate"
                        className="block text-xs font-bold text-[#0B2249] mb-1.5"
                      >
                        Preferred Exam Date (2026 – 2028)
                      </label>
                      <input
                        id="examDate"
                        type="date"
                        min="2026-11-24"
                        max="2028-12-31"
                        value={preferredDate}
                        onChange={(e) => {
                          setPreferredDate(e.target.value);
                          const yr = e.target.value.slice(0, 4);
                          if (TARGET_YEARS.includes(yr)) setPreferredYear(yr);
                        }}
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="passportStatus"
                      className="block text-xs font-bold text-[#0B2249] mb-1.5"
                    >
                      Passport / ID Document Readiness
                    </label>
                    <select
                      id="passportStatus"
                      value={passportReady}
                      onChange={(e) => setPassportReady(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                    >
                      <option value="Original Valid Passport Available">
                        Original Valid Passport Available
                      </option>
                      <option value="Passport Applied / Renewal in Process">
                        Passport Applied / Renewal in Process
                      </option>
                      <option value="Smart CNIC Available (Duolingo DET)">
                        Smart CNIC Available (Duolingo DET)
                      </option>
                    </select>
                  </div>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeFreeMock}
                      onChange={(e) => setIncludeFreeMock(e.target.checked)}
                      className="mt-0.5 accent-[#DC1E25]"
                    />
                    <span className="text-xs text-[#0B2249] font-medium leading-relaxed">
                      Include a <span className="font-bold">FREE pre-exam Speaking &amp; Writing evaluation</span>{' '}
                      at Gulshan-e-Iqbal, Shahrah-e-Faisal, Nazimabad, or online before finalizing my test seat.
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <label htmlFor="exName" className="block text-xs font-bold text-[#0B2249] mb-1">
                        Full Name (As Per Passport) *
                      </label>
                      <input
                        id="exName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                      />
                    </div>
                    <div>
                      <label htmlFor="exPhone" className="block text-xs font-bold text-[#0B2249] mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        id="exPhone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 332 3502864"
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                      />
                    </div>
                    <div>
                      <label htmlFor="exEmail" className="block text-xs font-bold text-[#0B2249] mb-1">
                        Email Address *
                      </label>
                      <input
                        id="exEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                      />
                    </div>
                  </div>

                  {formError && (
                    <p
                      role="alert"
                      className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-800"
                    >
                      {formError}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-slate-500">
                      Desk confirmation dispatched via <span className="font-semibold text-[#0B2249]">{leadEmail}</span>
                    </p>
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] disabled:opacity-60 rounded-xl transition-colors cursor-pointer"
                    >
                      <CalendarCheck2 className="w-4 h-4" />
                      {submitting ? 'Submitting Seat Request...' : `Request ${selectedExam.shortName} Exam Booking`}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>

            {/* Official Desk Details Card */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-[#0B2249] text-white rounded-2xl p-6 sm:p-8 space-y-4">
                <span
                  className={`${selectedExam.badgeColor} inline-block px-3 py-1 rounded-lg text-xs font-extrabold text-white`}
                >
                  {selectedExam.bodyPartner}
                </span>
                <h3 className="font-display text-2xl font-extrabold">{selectedExam.name}</h3>
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-200 pt-2 border-t border-white/15">
                  <p className="flex items-start gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                    <span>{selectedExam.idRequirement}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                    <span>Test Cities: {selectedExam.cities.join(' · ')}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-white/15 space-y-2">
                  <p className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider">
                    Included With Your Registration
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {selectedExam.supportIncludes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => onNavigate(selectedExam.testPageSlug)}
                    className="inline-flex items-center gap-2 w-full justify-center py-3 text-xs sm:text-sm font-semibold text-[#0B2249] bg-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Open {selectedExam.shortName} Preparation Page
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Direct Purchase & Discounted Vouchers Store (Examism) */}
      <section
        id="direct-exam-store"
        className="py-14 lg:py-20 bg-white border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#DC1E25] mb-2">
                <Sparkles className="w-4 h-4" />
                Instant Online Purchase · Official SM Usman Voucher Store
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2249] [text-wrap:balance]">
                Prefer Instant Self-Checkout? Buy Discounted Vouchers Directly
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                Alongside our assisted seat-booking desk above, you can browse discounted PTE,
                IELTS, Duolingo (DET), APEUni, Alfa PTE, and Arno practice vouchers directly inside
                our live Examism storefront and receive your voucher code right after checkout.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowLiveStoreFrame((prev) => !prev)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-[#0B2249] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {showLiveStoreFrame ? 'Hide Embedded Store' : 'Load Live Store Inside Page'}
              </button>
              <a
                href={activeStoreCategory.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2249] hover:bg-[#DC1E25] text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-[#FBBF24]" />
                Open Store in Full Tab
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Direct Store Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {EXAMISM_STORE_CATEGORIES.map((cat) => {
              const active = activeStoreCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveStoreCategory(cat);
                    setShowLiveStoreFrame(true);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#DC1E25] text-white shadow-xs'
                      : 'bg-[#F5F7FB] text-[#0B2249] border border-slate-200 hover:border-[#0B2249]/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Live Embedded Storefront Container */}
          {showLiveStoreFrame && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
              <div className="bg-[#0B2249] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="font-semibold truncate">
                    Live Store: {activeStoreCategory.label} ({activeStoreCategory.url})
                  </span>
                </div>
                <a
                  href={activeStoreCategory.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#FBBF24] hover:underline shrink-0"
                >
                  Open Checkout Full-Screen
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <iframe
                key={activeStoreCategory.url}
                src={activeStoreCategory.url}
                title={`SM Usman Examism Store — ${activeStoreCategory.label}`}
                loading="lazy"
                className="w-full h-[760px] bg-white border-0"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
