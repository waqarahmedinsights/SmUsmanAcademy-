import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Mail,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import {
  PageRoute,
  TEST_PAGES_DATA,
  TestPageSlug,
} from '../data/consultancyData';
import { broadcastSiteSync, useSiteContent } from '../context/SiteContentContext';
import { filterItemsForPage, getScheduleForCampus } from '../data/siteConfigDefaults';
import { PteOfferAndDemoSection } from '../components/PteOfferAndDemoSection';
import { VideoTestimonialsSection } from '../components/VideoTestimonialsSection';
import { ResilientImage } from '../components/ResilientImage';
import { TestBrandLogo } from '../components/TestBrandLogo';

interface TestDetailPageProps {
  slug: TestPageSlug;
  onNavigate: (page: PageRoute) => void;
}

const ALL_TEST_TABS: { slug: TestPageSlug; label: string }[] = [
  { slug: 'test-ielts', label: 'IELTS' },
  { slug: 'test-pte', label: 'PTE Academic' },
  { slug: 'test-duolingo', label: 'Duolingo (DET)' },
  { slug: 'test-toefl', label: 'TOEFL iBT' },
  { slug: 'test-oet', label: 'OET Healthcare' },
  { slug: 'test-english', label: 'Spoken English' },
];

const EXAMISM_VOUCHER_LINKS: Partial<Record<TestPageSlug, string>> = {
  'test-ielts': 'https://smusman.examism.com/vouchers/ielts',
  'test-pte': 'https://smusman.examism.com/vouchers/pte',
  'test-duolingo': 'https://smusman.examism.com/vouchers/det',
  'test-toefl': 'https://smusman.examism.com/vouchers/arnotoefl',
  'test-oet': 'https://smusman.examism.com/vouchers/arnooet',
};

export function TestDetailPage({ slug, onNavigate }: TestDetailPageProps) {
  const { config } = useSiteContent();
  const data = TEST_PAGES_DATA[slug];
  const campuses =
    config.campusSchedules.length > 0
      ? config.campusSchedules.map((c) => c.campusName)
      : config.demoSchedule.campuses;

  const [selectedTrackIdx, setSelectedTrackIdx] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState(data.batchOptions[0]);
  const [campusMode, setCampusMode] = useState(campuses[0] || 'Gulshan-e-Iqbal Campus (Head Office)');

  const activeCampusSchedule = getScheduleForCampus(config, campusMode);
  const activeDays = activeCampusSchedule.days;
  const timingSlots = activeCampusSchedule.timingSlots;

  const [selectedSlot, setSelectedSlot] = useState(timingSlots[0] || '12:00 PM – 1:30 PM');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bookedRef, setBookedRef] = useState<string | null>(null);

  useEffect(() => {
    setSelectedBatch(TEST_PAGES_DATA[slug].batchOptions[0]);
    setSelectedTrackIdx(0);
    setBookedRef(null);
  }, [slug]);

  useEffect(() => {
    if (campuses.length > 0 && !campuses.includes(campusMode)) {
      setCampusMode(campuses[0]);
    }
  }, [campuses, campusMode]);

  useEffect(() => {
    if (timingSlots.length > 0 && !timingSlots.includes(selectedSlot)) {
      setSelectedSlot(timingSlots[0]);
    }
  }, [timingSlots, selectedSlot]);

  const activeTrack = data.tracks[selectedTrackIdx] ?? data.tracks[0];
  const waNumber = config.socialLinks.whatsappNumber;
  const waDisplay = config.socialLinks.whatsappDisplay;
  const leadEmail = config.socialLinks.leadEmail;

  const handleBookTestDemo = async (e: FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!/^[+\d][\d\s()-]{7,18}$/.test(phone.trim())) {
      setFormError('Please enter a valid WhatsApp or phone number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address.');
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
          studyLevel: `${data.shortLabel} — ${activeTrack.name}`,
          discipline: data.shortLabel,
          intake: `${selectedBatch} · ${selectedSlot}`,
          englishStatus: campusMode,
          notes: `Dedicated Test Page Inquiry: ${data.title} | Track: ${activeTrack.name} | Batch: ${selectedBatch} | Location: ${campusMode} | Timing Slot: ${selectedSlot}`,
          source: `${data.shortLabel} Dedicated Test Page`,
        }),
      });
      const result = (await resp.json()) as {
        ok?: boolean;
        referenceId?: string;
        error?: string;
      };
      if (!resp.ok || !result.ok || !result.referenceId) {
        setFormError(
          result.error ||
            `Could not submit automatically. Please message WhatsApp ${waDisplay}.`
        );
        return;
      }
      broadcastSiteSync('lead-created');
      setBookedRef(result.referenceId);
    } catch {
      setFormError(`Connection error. Please reach us on WhatsApp ${waDisplay}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Quick Test Switcher Strip */}
      <div className="bg-[#071631] border-b border-white/10 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider">
            SM Usman’s Academy Test Pages
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {ALL_TEST_TABS.map((tab) => {
              const active = tab.slug === slug;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => {
                    setSelectedTrackIdx(0);
                    setBookedRef(null);
                    onNavigate(tab.slug);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#DC1E25] text-white'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page Hero */}
      <section className="bg-[#0B2249] text-white py-12 lg:py-16 border-b-4 border-[#DC1E25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-8 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-3.5">
              <TestBrandLogo
                id={
                  slug.replace('test-', '') as
                    | 'ielts'
                    | 'pte'
                    | 'duolingo'
                    | 'toefl'
                    | 'oet'
                    | 'english'
                }
                size="lg"
              />
              <span className="text-xs sm:text-sm font-bold text-[#FBBF24]">
                {data.subtitle}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white [text-wrap:balance]">
              {data.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
              {data.heroSummary}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-2 font-mono font-bold text-[#FBBF24]">
                <Clock className="w-4 h-4" />
                {data.duration}
              </span>
              <span className="inline-flex items-center gap-2 font-semibold text-white">
                <Award className="w-4 h-4 text-[#FBBF24]" />
                {data.targetScore}
              </span>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('book-exam')}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-[#0B2249] bg-[#FBBF24] hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
              >
                <CalendarCheck2 className="w-4 h-4" />
                Book Official {data.shortLabel} Exam Date
              </button>
              {EXAMISM_VOUCHER_LINKS[slug] && (
                <a
                  href={EXAMISM_VOUCHER_LINKS[slug]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Buy {data.shortLabel} Voucher
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
              >
                Compare All Courses
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden border border-white/15 aspect-[4/5] bg-[#071631]">
              <ResilientImage
                src={data.bannerImage || config.awardsAndPictures.britishCouncilAwardUrl}
                alt={`${data.shortLabel} preparation banner at SM Usman's Academy`}
                fallbackTitle={data.shortLabel}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/15 aspect-[4/5] bg-[#071631]">
              <ResilientImage
                src={config.awardsAndPictures.sirUsmanPortraitUrl}
                alt="Sir SM Usman IELTS Trainer"
                fallbackTitle="Sir SM Usman"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tracks & Curriculum Modules */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <p className="text-sm font-bold text-[#DC1E25] mb-2">
                  Interactive Course Tracks
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2249] mb-5">
                  Select Your {data.shortLabel} Specialization
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {data.tracks.map((track, idx) => {
                    const active = idx === selectedTrackIdx;
                    return (
                      <motion.button
                        key={track.name}
                        type="button"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTrackIdx(idx)}
                        className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#0B2249] text-white border-[#0B2249] shadow-md'
                            : 'bg-[#F5F7FB] text-[#0B2249] border-slate-200 hover:border-[#DC1E25]/50'
                        }`}
                      >
                        <p className="font-display text-base font-bold">{track.name}</p>
                        <p
                          className={`text-xs mt-1 ${
                            active ? 'text-[#FBBF24]' : 'text-slate-500'
                          }`}
                        >
                          {track.audience}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTrack.name}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-[#F5F7FB] border border-slate-200 rounded-2xl p-6 space-y-2"
                  >
                    <p className="font-display text-lg font-bold text-[#0B2249]">
                      {activeTrack.name} — Curriculum Scope
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">{activeTrack.details}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 4 Skill Modules */}
              <div>
                <h3 className="font-display text-xl font-bold text-[#0B2249] flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-[#DC1E25]" />
                  Skill-by-Skill Training Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.modules.map((mod) => (
                    <motion.div
                      key={mod.skill}
                      whileHover={{ y: -3 }}
                      className="bg-[#F5F7FB] hover:bg-white border border-slate-200 rounded-xl p-5 transition-colors"
                    >
                      <p className="font-display text-sm font-bold text-[#DC1E25] mb-1.5">
                        {mod.skill}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {mod.focus}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Key Advantages */}
              <div className="bg-[#0B2249] text-white rounded-2xl p-6 space-y-3">
                <p className="font-display text-base font-bold text-[#FBBF24] flex items-center gap-2">
                  <BookOpenCheck className="w-4 h-4" />
                  Why Students Choose SM Usman’s Academy for {data.shortLabel}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-200">
                  {data.keyAdvantages.map((adv) => (
                    <li key={adv} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Direct Demo Booking Sidebar */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-[#F5F7FB] border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <p className="text-xs font-bold text-[#DC1E25] uppercase tracking-wider mb-1">
                  Free Diagnostic &amp; Demo Class
                </p>
                <h3 className="font-display text-2xl font-extrabold text-[#0B2249] mb-4">
                  Reserve Your {data.shortLabel} Seat
                </h3>

                {bookedRef ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                      <p className="font-mono text-xs font-bold">Reference {bookedRef}</p>
                      <p className="text-sm font-bold">
                        Demo booked for {activeTrack.name}!
                      </p>
                      <p className="text-xs">
                        Location: <strong>{campusMode}</strong> · Timing: <strong>{selectedSlot}</strong>
                      </p>
                      <p className="text-xs">
                        Sent to {leadEmail}. Our coordinator will message {phone}.
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                        `Booked ${data.shortLabel} Demo (${bookedRef}) for ${activeTrack.name} — Location: ${campusMode}, Timing: ${selectedSlot} — ${fullName}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1EBE5B] rounded-xl"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Confirm on WhatsApp ({waDisplay})
                    </a>
                    <a
                      href={`mailto:${leadEmail}`}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-[#0B2249] bg-white border border-slate-300 rounded-xl"
                    >
                      <Mail className="w-4 h-4" />
                      {leadEmail}
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleBookTestDemo} className="space-y-4" noValidate>
                    <div>
                      <label
                        htmlFor="testBatchSelect"
                        className="block text-xs font-bold text-[#0B2249] mb-1.5"
                      >
                        Preferred Batch Format
                      </label>
                      <select
                        id="testBatchSelect"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-white border border-slate-300 rounded-xl text-[#0B2249]"
                      >
                        {data.batchOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="testCampusSelect"
                        className="block text-xs font-bold text-[#0B2249] mb-1.5"
                      >
                        Campus / Location
                      </label>
                      <select
                        id="testCampusSelect"
                        value={campusMode}
                        onChange={(e) => setCampusMode(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-white border border-slate-300 rounded-xl text-[#0B2249]"
                      >
                        {campuses.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="testTimingSelect"
                        className="block text-xs font-bold text-[#0B2249] mb-1.5"
                      >
                        Preferred Timing Slot
                      </label>
                      <select
                        id="testTimingSelect"
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-white border border-slate-300 rounded-xl text-[#0B2249]"
                      >
                        {timingSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Days ({campusMode}):{' '}
                        <span className="font-semibold text-[#0B2249]">
                          {activeDays.join(' · ')}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label htmlFor="tName" className="block text-xs font-bold text-[#0B2249] mb-1">
                        Full Name *
                      </label>
                      <input
                        id="tName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-white border border-slate-300 rounded-xl text-[#0B2249]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tPhone"
                        className="block text-xs font-bold text-[#0B2249] mb-1"
                      >
                        WhatsApp / Phone *
                      </label>
                      <input
                        id="tPhone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 332 3502864"
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-white border border-slate-300 rounded-xl text-[#0B2249]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tEmail"
                        className="block text-xs font-bold text-[#0B2249] mb-1"
                      >
                        Email Address *
                      </label>
                      <input
                        id="tEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-white border border-slate-300 rounded-xl text-[#0B2249]"
                      />
                    </div>

                    {formError && (
                      <p role="alert" className="text-xs font-medium text-red-700">
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] disabled:opacity-60 rounded-xl transition-colors cursor-pointer"
                    >
                      <CalendarCheck2 className="w-4 h-4" />
                      {submitting ? 'Booking...' : `Book Free ${data.shortLabel} Demo`}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {slug === 'test-pte' && <PteOfferAndDemoSection />}

      {/* Page-Specific Student Videos & Sir Usman Shorts */}
      <VideoTestimonialsSection pageTarget={slug} />

      {/* Page-Specific Verified Student Scorecards */}
      {(() => {
        const pageResults = filterItemsForPage(config.resultCards, slug);
        if (pageResults.length === 0) return null;
        return (
          <section className="py-12 bg-[#F5F7FB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B2249]">
                  Verified {data.shortLabel} Results from SM Usman’s Academy
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('guides')}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#DC1E25] hover:underline cursor-pointer"
                >
                  View Full Results &amp; Stories
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {pageResults.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      <ResilientImage
                        src={item.image}
                        alt={item.studentName}
                        fallbackTitle={item.studentName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-mono text-xs font-bold text-[#DC1E25]">
                        {item.scoreLabel}
                      </p>
                      <p className="font-display text-xs font-bold text-[#0B2249] truncate">
                        {item.studentName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}
    </div>
  );
}
