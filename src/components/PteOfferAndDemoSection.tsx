import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';
import { broadcastSiteSync, useSiteContent } from '../context/SiteContentContext';
import { getScheduleForCampus } from '../data/siteConfigDefaults';
import { SocialBrandIcon } from './SocialBrandIcon';
import { TestBrandLogo } from './TestBrandLogo';
import { ResilientImage } from './ResilientImage';

const DEMO_COURSES = [
  'PTE Academic (Online Mega Offer - Rs. 20,000)',
  'IELTS (Academic / General / UKVI)',
  'PTE Academic (On-Campus)',
  'Duolingo English Test (DET)',
  'TOEFL iBT',
  'OET Healthcare',
  'Spoken English',
];

export function PteOfferAndDemoSection() {
  const { config, showLeadToast } = useSiteContent();
  const megaOffer = config.megaOffer;
  const customOffers = (config.customOffers ?? []).filter((o) => o.enabled);
  const campuses =
    config.campusSchedules.length > 0
      ? config.campusSchedules.map((c) => c.campusName)
      : config.demoSchedule.campuses;
  const waNumber = config.socialLinks.whatsappNumber;
  const waDisplay = config.socialLinks.whatsappDisplay;
  const leadEmail = config.socialLinks.leadEmail;
  const pics = config.awardsAndPictures;

  const [selectedCampus, setSelectedCampus] = useState(
    campuses[0] || 'Gulshan-e-Iqbal Campus (Head Office)'
  );
  const activeSchedule = getScheduleForCampus(config, selectedCampus);
  const activeDays = activeSchedule.days;
  const timingSlots = activeSchedule.timingSlots;

  const [selectedTiming, setSelectedTiming] = useState(timingSlots[0] || '12:00 PM – 1:30 PM');
  const [selectedCourse, setSelectedCourse] = useState(DEMO_COURSES[0]);
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [submittingDemo, setSubmittingDemo] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [demoBooked, setDemoBooked] = useState<{
    referenceId: string;
    emailDelivered: boolean;
  } | null>(null);

  useEffect(() => {
    if (campuses.length > 0 && !campuses.includes(selectedCampus)) {
      setSelectedCampus(campuses[0]);
    }
  }, [campuses, selectedCampus]);

  useEffect(() => {
    if (timingSlots.length > 0 && !timingSlots.includes(selectedTiming)) {
      setSelectedTiming(timingSlots[0]);
    }
  }, [timingSlots, selectedTiming]);

  const handleSubmitQuickDemo = async (e: FormEvent) => {
    e.preventDefault();
    if (studentName.trim().length < 2) {
      setDemoError('Please enter your full name.');
      return;
    }
    if (!/^[+\d][\d\s()-]{7,18}$/.test(studentPhone.trim())) {
      setDemoError('Please enter a valid WhatsApp or phone number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail.trim())) {
      setDemoError('Please enter a valid email address.');
      return;
    }

    setDemoError(null);
    setSubmittingDemo(true);
    try {
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: studentName.trim(),
          email: studentEmail.trim(),
          phone: studentPhone.trim(),
          country: 'uk',
          studyLevel: `Free Demo Today — ${selectedCourse}`,
          discipline: selectedCourse,
          intake: `${activeDays.join('/')} · ${selectedTiming}`,
          englishStatus: selectedCampus,
          notes: `Free On-Campus / Live Demo Seat Requested: ${selectedCourse} | Campus: ${selectedCampus} | Days: ${activeDays.join('/')} | Timing: ${selectedTiming}`,
          source: 'Mega Offer & Free Demo Today Card',
        }),
      });
      const data = (await resp.json()) as {
        ok?: boolean;
        referenceId?: string;
        emailDelivered?: boolean;
        error?: string;
      };
      if (!resp.ok || !data.ok || !data.referenceId) {
        setDemoError(
          data.error || `Could not confirm booking. Please message WhatsApp ${waDisplay}.`
        );
        return;
      }
      broadcastSiteSync('lead-created');
      showLeadToast({
        referenceId: data.referenceId,
        title: 'Demo Seat Received!',
        message: `Seat request for ${selectedCourse} at ${selectedCampus} (${selectedTiming}) has been recorded.`,
        emailDelivered: Boolean(data.emailDelivered),
      });
      setDemoBooked({
        referenceId: data.referenceId,
        emailDelivered: Boolean(data.emailDelivered),
      });
    } catch {
      setDemoError(`Connection error. Please confirm via WhatsApp ${waDisplay}.`);
    } finally {
      setSubmittingDemo(false);
    }
  };

  const enrollOfferWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Assalam-o-Alaikum Sir Usman! I want to enroll in ${megaOffer.title}:\n- Duration: ${megaOffer.duration} (${megaOffer.classDuration})\n- Schedule: ${megaOffer.frequency} (${megaOffer.timings})\n- Discounted Fee: ${megaOffer.discountedFee} (instead of ${megaOffer.originalFee})\nPlease share admission details.`
  )}`;

  const confirmDemoWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `FREE DEMO CLASS TODAY (${demoBooked?.referenceId ?? 'New'}) — Seat Confirmation\nCourse: ${selectedCourse}\nName: ${
      studentName.trim() || 'Student Inquiry'
    }\nPhone: ${studentPhone.trim() || 'N/A'}\nEmail: ${studentEmail.trim() || 'N/A'}\nPreferred Campus / Location: ${selectedCampus}\nPreferred Timing Slot: ${selectedTiming}`
  )}`;

  return (
    <section
      id="pte-mega-offer"
      className="py-16 lg:py-20 bg-gradient-to-b from-[#071631] to-[#0B2249] text-white border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Row: PTE Online Mega Offer + Free Demo Today & Campus Timings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Card: PTE Online Mega Offer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6 bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FBBF24] flex flex-col justify-between"
          >
            <div>
              {/* Offer Ribbon Header */}
              <div className="bg-gradient-to-r from-[#DC1E25] to-[#B9151B] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-5 h-5 text-[#FBBF24]" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#FBBF24]">
                      {megaOffer.badge}
                    </p>
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold">
                      {megaOffer.title}
                    </h2>
                  </div>
                </div>
                <TestBrandLogo id="pte" size="sm" />
              </div>

              {megaOffer.imageUrl && (
                <a
                  href={enrollOfferWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full aspect-[16/7] overflow-hidden bg-slate-100 border-b border-slate-200 group"
                >
                  <ResilientImage
                    src={megaOffer.imageUrl}
                    alt={megaOffer.title}
                    fallbackTitle={megaOffer.title}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </a>
              )}

              <div className="p-6 sm:p-7 space-y-5">
                {/* Pricing Banner */}
                <div className="rounded-xl bg-[#F5F7FB] border border-slate-200 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Original Fee</p>
                    <p className="font-mono text-lg font-bold text-slate-400 line-through tabular-nums">
                      {megaOffer.originalFee}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#DC1E25]">Discounted Mega Fee</p>
                    <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#0B2249] tabular-nums">
                      {megaOffer.discountedFee}
                    </p>
                  </div>
                </div>

                {/* Course Schedule Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-slate-200">
                    <p className="text-slate-500 text-xs">Duration</p>
                    <p className="font-bold text-[#0B2249] mt-0.5">
                      {megaOffer.duration}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-slate-200">
                    <p className="text-slate-500 text-xs">Class Duration</p>
                    <p className="font-bold text-[#0B2249] mt-0.5">
                      {megaOffer.classDuration}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F5F7FB] border border-slate-200">
                    <p className="text-slate-500 text-xs">Frequency</p>
                    <p className="font-bold text-[#0B2249] mt-0.5">
                      {megaOffer.frequency}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-red-50 border border-[#DC1E25]/25">
                    <p className="text-[#DC1E25] text-xs font-semibold">Online Timings</p>
                    <p className="font-mono font-extrabold text-[#0B2249] mt-0.5">
                      {megaOffer.timings}
                    </p>
                  </div>
                </div>

                {/* What's Included */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0B2249] mb-2.5">
                    What’s Included in This Batch
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                    {megaOffer.inclusions.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-7 pb-6 pt-2 space-y-3">
              <motion.a
                href={enrollOfferWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white font-display text-sm sm:text-base font-extrabold shadow-md transition-colors"
              >
                <SocialBrandIcon platform="whatsapp" className="w-5 h-5" />
                Enroll Now on WhatsApp ({megaOffer.discountedFee} Offer)
              </motion.a>
              <p className="text-[11px] text-center text-slate-500">
                Tap to open WhatsApp ({waDisplay}) directly with Sir SM Usman’s Admissions Desk
              </p>
            </div>
          </motion.div>

          {/* Right Card: FREE DEMO CLASS TODAY + Shahrah-e-Faisal Exact Days & Timings */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="lg:col-span-6 bg-[#071631] border border-white/15 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl space-y-6"
          >
            <div className="space-y-5">
              <div>
                <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FBBF24] mb-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>FREE DEMO CLASS TODAY · Meet Sir Usman</span>
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  Reserve Your Free On-Campus Demo Seat Today
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  Join a live diagnostic demo session with Sir SM Usman and experience personalized
                  speaking, reading, and writing coaching.
                </p>
              </div>

              {/* Available Campuses / Location Selector Above */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#DC1E25]" />
                  Campus / Location (Select One)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {campuses.map((campus) => {
                    const active = selectedCampus === campus;
                    return (
                      <button
                        key={campus}
                        type="button"
                        onClick={() => setSelectedCampus(campus)}
                        className={`px-3.5 py-2.5 rounded-xl border text-left text-xs font-bold transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                          active
                            ? 'bg-[#DC1E25] text-white border-[#DC1E25] shadow-sm'
                            : 'bg-white/5 text-slate-200 border-white/15 hover:border-white/40'
                        }`}
                      >
                        <span className="truncate">{campus}</span>
                        {active && <CheckCircle2 className="w-4 h-4 text-[#FBBF24] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Timing Slots Cleanly Below Location */}
              <div className="rounded-xl bg-white/5 border border-white/15 p-4 space-y-3">
                <div>
                  <p className="text-xs font-bold text-[#FBBF24] mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Preferred Timing Slot (Select One):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {timingSlots.map((slot) => {
                      const active = selectedTiming === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTiming(slot)}
                          className={`px-3 py-2 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#FBBF24] text-[#0B2249] shadow-xs'
                              : 'bg-[#0B2249] text-slate-200 border border-white/15 hover:border-white/40'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FBBF24]" />
                    <span>{selectedCampus} Days:</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                    {activeDays.map((day) => (
                      <span
                        key={day}
                        className="px-2 py-0.5 rounded bg-[#0B2249] border border-white/20 text-white"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Demo Seat Portal Form (Saves to Admin Leads + Sends Email) */}
              {demoBooked ? (
                <div className="rounded-xl bg-emerald-950/70 border border-emerald-400/50 p-4 space-y-3">
                  <p className="font-mono text-xs font-bold text-[#FBBF24]">
                    Reference {demoBooked.referenceId}
                  </p>
                  <p className="font-display text-base font-bold text-white">
                    Demo Seat Confirmed for {selectedCourse}!
                  </p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {demoBooked.emailDelivered
                      ? `Recorded in SMU Admin Portal and emailed to ${leadEmail}.`
                      : `Recorded in SMU Admin Portal. Coordinator will confirm via ${studentPhone}.`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={confirmDemoWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-bold"
                    >
                      <SocialBrandIcon platform="whatsapp" className="w-4 h-4" />
                      Send on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setDemoBooked(null)}
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                    >
                      Book Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuickDemo} noValidate className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="quickDemoCourse" className="block text-xs font-bold text-slate-300 mb-1">
                        Course
                      </label>
                      <select
                        id="quickDemoCourse"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-11 text-xs sm:text-sm bg-[#0B2249] border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FBBF24] cursor-pointer"
                      >
                        {DEMO_COURSES.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="quickDemoName" className="block text-xs font-bold text-slate-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        id="quickDemoName"
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-3.5 py-2.5 min-h-11 text-xs sm:text-sm bg-[#0B2249] border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
                      />
                    </div>

                    <div>
                      <label htmlFor="quickDemoPhone" className="block text-xs font-bold text-slate-300 mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        id="quickDemoPhone"
                        type="tel"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="+92 3XX XXXXXXX"
                        className="w-full px-3.5 py-2.5 min-h-11 text-xs sm:text-sm bg-[#0B2249] border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
                      />
                    </div>

                    <div>
                      <label htmlFor="quickDemoEmail" className="block text-xs font-bold text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        id="quickDemoEmail"
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="student@email.com"
                        className="w-full px-3.5 py-2.5 min-h-11 text-xs sm:text-sm bg-[#0B2249] border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
                      />
                    </div>
                  </div>

                  {demoError && (
                    <p role="alert" className="text-xs font-semibold text-red-300">
                      {demoError}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <motion.button
                      type="submit"
                      disabled={submittingDemo}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#FBBF24] hover:bg-amber-300 disabled:opacity-60 text-[#0B2249] font-display text-xs sm:text-sm font-extrabold shadow-md transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {submittingDemo ? 'Booking Demo...' : 'Confirm Free Demo Seat →'}
                    </motion.button>
                    <a
                      href={confirmDemoWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs sm:text-sm font-bold transition-colors whitespace-nowrap"
                    >
                      <SocialBrandIcon platform="whatsapp" className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Dynamic Additional Admin Offers */}
        {customOffers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customOffers.map((offer) => {
              const waOfferHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                `Assalam-o-Alaikum Sir Usman! I want to enroll in ${offer.title} (${offer.discountedFee || offer.originalFee} · ${offer.frequency} ${offer.timings}).`
              )}`;
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-xl border border-[#FBBF24]/70 flex flex-col justify-between"
                >
                  <div>
                    <div className="bg-[#0B2249] text-white px-5 py-3.5 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#FBBF24]">
                          {offer.badge}
                        </p>
                        <h3 className="font-display text-lg font-extrabold">{offer.title}</h3>
                      </div>
                      {offer.discountedFee && (
                        <span className="font-mono text-base font-extrabold text-[#FBBF24] tabular-nums shrink-0">
                          {offer.discountedFee}
                        </span>
                      )}
                    </div>

                    {offer.imageUrl && (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                        <ResilientImage
                          src={offer.imageUrl}
                          alt={offer.title}
                          fallbackTitle={offer.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    )}

                    <div className="p-5 space-y-3 text-xs sm:text-sm">
                      {(offer.originalFee || offer.discountedFee) && (
                        <div className="flex items-center justify-between bg-[#F5F7FB] border border-slate-200 rounded-xl px-4 py-2.5">
                          {offer.originalFee && (
                            <span className="font-mono text-slate-400 line-through font-bold">
                              {offer.originalFee}
                            </span>
                          )}
                          <span className="font-mono text-xl font-extrabold text-[#DC1E25]">
                            {offer.discountedFee || offer.originalFee}
                          </span>
                        </div>
                      )}

                      {(offer.duration || offer.frequency || offer.timings) && (
                        <p className="text-xs text-slate-600">
                          {[offer.duration, offer.classDuration, offer.frequency, offer.timings]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}

                      {offer.inclusions.length > 0 && (
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {offer.inclusions.map((inc, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <a
                      href={waOfferHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs sm:text-sm font-bold transition-colors"
                    >
                      <SocialBrandIcon platform="whatsapp" className="w-4 h-4" />
                      Enroll on WhatsApp
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Authentic Pearson PTE Rising Star Award & 90/90 Scorecards Showcase */}
        <div className="bg-white/5 border border-white/15 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FBBF24] mb-1">
                <Award className="w-4 h-4" />
                <span>Pearson Test of English · Rising Star Award 2025–2026</span>
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Verified PTE 89–90/90 Scorecards &amp; Official Pearson Partner Awards
              </h3>
            </div>
            <a
              href={enrollOfferWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-bold whitespace-nowrap self-start md:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Claim {megaOffer.discountedFee} PTE Offer
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                img: pics.pteScorecardsUrl,
                title: 'Real PTE Academic 90/90 & 89 Results',
                caption: 'Shahbaz (90), Nabeel (90), Rida (90), Tasneem (89)',
              },
              {
                img: pics.pearsonTrophyUrl,
                title: 'Pearson Rising Star Award 2025–2026',
                caption: 'Awarded to SM Usman’s Academy — Stronger Together',
              },
              {
                img: pics.pearsonStageUrl,
                title: 'Sir SM Usman Receiving Pearson Trophy',
                caption: 'Official Pearson PTE Annual Event Ceremony',
              },
              {
                img: pics.pearsonCertificateUrl,
                title: 'Pearson PTE Partners Certificate',
                caption: 'Official PTE Partners Annual Event Gathering, Lahore',
              },
            ].map((card, idx) => (
              <motion.a
                key={card.title}
                href={enrollOfferWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-[#071631] border border-white/15 hover:border-[#FBBF24] rounded-xl overflow-hidden flex flex-col justify-between transition-colors"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <ResilientImage
                    src={card.img}
                    alt={card.title}
                    fallbackTitle={card.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 space-y-1">
                  <h4 className="font-display text-xs sm:text-sm font-bold text-white leading-snug">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-slate-300">{card.caption}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
