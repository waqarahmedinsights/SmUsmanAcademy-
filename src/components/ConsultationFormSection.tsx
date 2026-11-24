import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Mail,
  MessageCircle,
} from 'lucide-react';
import {
  CountryKey,
  DESTINATIONS,
  LEAD_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_WA_NUMBER,
} from '../data/consultancyData';

interface ConsultationFormSectionProps {
  preselectedCountry: CountryKey;
  preselectedProgramTitle?: string;
}

interface FormState {
  country: CountryKey;
  studyLevel: string;
  discipline: string;
  intake: string;
  englishStatus: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

const COUNTRY_CHECKLISTS: Record<CountryKey, string[]> = {
  uk: [
    'Academic transcripts & degree/school certificates',
    'Valid passport bio-data page',
    'IELTS / English proficiency or MOI letter',
    'Updated CV & draft Statement of Purpose',
  ],
  germany: [
    'Notarized school & bachelor transcripts',
    'Passport scan & tabular CV',
    'IELTS / German language certificate (if applicable)',
    'APS / Uni-Assist document readiness summary',
  ],
  italy: [
    'Academic transcripts & syllabus descriptions (for Master’s)',
    'Passport copy & English proficiency proof',
    'Family income assessment readiness (for DSU scholarship)',
    'Universitaly pre-enrollment timeline check',
  ],
  cyprus: [
    'High school / university transcripts & certificates',
    'Valid passport scan (minimum 2 years validity)',
    'English proficiency or placement test booking',
    'Medical clearance & sponsor bank statement guidance',
  ],
};

const LEVEL_OPTIONS = [
  'Foundation Pathway',
  'Undergraduate (Bachelor’s)',
  'Postgraduate (Master’s / MBA)',
  'PhD / Research',
];

const DISCIPLINE_OPTIONS = [
  'Computer Science & AI',
  'Business & Finance',
  'Engineering',
  'Healthcare & Sciences',
  'Architecture & Humanities',
];

const ENGLISH_OPTIONS = [
  'IELTS / PTE / TOEFL Completed',
  'Medium of Instruction (MOI) Letter',
  'Need SMU IELTS / PTE Coaching',
  'Need University Placement Test',
];

export function ConsultationFormSection({
  preselectedCountry,
  preselectedProgramTitle,
}: ConsultationFormSectionProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>({
    country: preselectedCountry,
    studyLevel: 'Postgraduate (Master’s / MBA)',
    discipline: 'Computer Science & AI',
    intake: 'September / October 2026',
    englishStatus: 'IELTS / PTE / TOEFL Completed',
    fullName: '',
    email: '',
    phone: '',
    notes: preselectedProgramTitle ? `Interested in: ${preselectedProgramTitle}` : '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    referenceId: string;
    targetEmail: string;
    emailDelivered: boolean;
  } | null>(null);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      country: preselectedCountry,
      notes: preselectedProgramTitle
        ? `Interested in: ${preselectedProgramTitle}`
        : prev.notes,
    }));
  }, [preselectedCountry, preselectedProgramTitle]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!/^[+\d][\d\s()-]{7,18}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Please enter a valid WhatsApp or phone number.';
    }
    return nextErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'SMU Consultants Free Eligibility Check',
        }),
      });
      const data = (await resp.json()) as {
        ok?: boolean;
        referenceId?: string;
        targetEmail?: string;
        emailDelivered?: boolean;
        error?: string;
      };

      if (!resp.ok || !data.ok || !data.referenceId) {
        setSubmitError(
          data.error ||
            `Could not submit right now. Please WhatsApp ${WHATSAPP_DISPLAY} or email ${LEAD_EMAIL}.`
        );
        return;
      }

      setSubmittedResult({
        referenceId: data.referenceId,
        targetEmail: data.targetEmail || LEAD_EMAIL,
        emailDelivered: Boolean(data.emailDelivered),
      });
    } catch {
      setSubmitError(
        `Network error submitting your profile. Please send directly via WhatsApp ${WHATSAPP_DISPLAY} or ${LEAD_EMAIL}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDestinationName =
    DESTINATIONS.find((d) => d.id === form.country)?.name ?? 'United Kingdom';

  const summaryPlainText = [
    `SMU Consultants Inquiry (${submittedResult?.referenceId ?? 'New'})`,
    `Name: ${form.fullName}`,
    `Email: ${form.email}`,
    `Phone/WhatsApp: ${form.phone}`,
    `Destination: ${selectedDestinationName}`,
    `Level: ${form.studyLevel}`,
    `Subject: ${form.discipline}`,
    `Intake: ${form.intake}`,
    `English: ${form.englishStatus}`,
    form.notes ? `Notes: ${form.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const mailtoUrl = `mailto:${LEAD_EMAIL}?subject=${encodeURIComponent(
    `[SMU Study Check] ${form.fullName} — ${selectedDestinationName}`
  )}&body=${encodeURIComponent(summaryPlainText)}`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_WA_NUMBER}?text=${encodeURIComponent(
    summaryPlainText
  )}`;

  return (
    <section id="consultation" className="py-16 lg:py-24 bg-[#0B2249] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-sm font-bold text-[#FBBF24]">
              Tell Us About Yourself · Free Check
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]">
              Get Your 5-University Shortlist in 48 Hours
            </h2>
            <p className="text-base text-slate-200 leading-relaxed">
              Complete our quick 3-step assessment. Every submission is routed directly to{' '}
              <span className="font-semibold text-white">{LEAD_EMAIL}</span> and reviewed by an SMU
              Consultants advisor within one business day.
            </p>

            <div className="pt-5 border-t border-white/15 space-y-4">
              <div className="flex items-start gap-3">
                <FileCheck2 className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">
                    Initial Document Checklist ({selectedDestinationName})
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
                    {COUNTRY_CHECKLISTS[form.country].map((doc) => (
                      <li key={doc}>· {doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 text-xs text-slate-300 space-y-1.5">
                <p className="font-semibold text-white">
                  WhatsApp Desk: {WHATSAPP_DISPLAY} · Lead Email: {LEAD_EMAIL}
                </p>
                <p>Gulshan-e-Iqbal · North Nazimabad · Shahrah-e-Faisal</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-lg">
            {submittedResult ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">
                      Free Check Submitted · Reference {submittedResult.referenceId}
                    </p>
                    <h3 className="font-display text-2xl font-extrabold text-[#0B2249]">
                      Thank you, {form.fullName}
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {submittedResult.emailDelivered ? (
                    <>
                      Your profile has been emailed directly to{' '}
                      <span className="font-semibold text-[#0B2249]">
                        {submittedResult.targetEmail}
                      </span>
                      . An advisor will reach out on{' '}
                    </>
                  ) : (
                    <>
                      Your profile is logged with reference{' '}
                      <span className="font-mono font-semibold text-[#0B2249]">
                        {submittedResult.referenceId}
                      </span>{' '}
                      for{' '}
                      <span className="font-semibold text-[#0B2249]">
                        {submittedResult.targetEmail}
                      </span>
                      . You can also send it instantly via WhatsApp or Email below, and our team
                      will respond on{' '}
                    </>
                  )}
                  <span className="font-mono text-[#0B2249]">{form.phone}</span> and{' '}
                  <span className="font-medium text-[#0B2249]">{form.email}</span>.
                </p>

                <div className="bg-[#F5F7FB] border border-slate-200 rounded-xl p-5 space-y-2 text-sm">
                  <p className="font-bold text-[#0B2249]">Your Profile Summary</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <p>
                      <span className="text-slate-500">Destination:</span> {selectedDestinationName}
                    </p>
                    <p>
                      <span className="text-slate-500">Level:</span> {form.studyLevel}
                    </p>
                    <p>
                      <span className="text-slate-500">Subject:</span> {form.discipline}
                    </p>
                    <p>
                      <span className="text-slate-500">English:</span> {form.englishStatus}
                    </p>
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
                    Send via WhatsApp ({WHATSAPP_DISPLAY})
                  </a>

                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0B2249] hover:bg-[#DC1E25] rounded-xl transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Send via Email ({LEAD_EMAIL})
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedResult(null);
                      setStep(1);
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-[#0B2249] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Start Another Assessment
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between gap-2 pb-5 mb-6 border-b border-slate-200">
                  {[
                    { num: 1 as const, label: '01. Destination & Level' },
                    { num: 2 as const, label: '02. Subject & English' },
                    { num: 3 as const, label: '03. Contact Details' },
                  ].map((s) => (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setStep(s.num)}
                      className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap truncate ${
                        step === s.num
                          ? 'bg-[#0B2249] text-white'
                          : step > s.num
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:text-[#0B2249]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-bold text-[#0B2249] mb-3">
                          Which country would you like to study in?
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {DESTINATIONS.map((dest) => {
                            const selected = form.country === dest.id;
                            return (
                              <button
                                key={dest.id}
                                type="button"
                                onClick={() => setForm({ ...form, country: dest.id })}
                                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                                  selected
                                    ? 'bg-red-50 border-[#DC1E25] text-[#0B2249] font-bold'
                                    : 'bg-[#F5F7FB] border-slate-200 text-slate-700 hover:border-[#0B2249]/40'
                                }`}
                              >
                                <span className="block text-sm">{dest.name}</span>
                                <span className="block font-mono text-[11px] text-slate-500 mt-0.5 tabular-nums">
                                  {dest.tuitionRange.split(' ')[0]}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#0B2249] mb-3">
                          Select your target study level
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {LEVEL_OPTIONS.map((lvl) => {
                            const selected = form.studyLevel === lvl;
                            return (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => setForm({ ...form, studyLevel: lvl })}
                                className={`p-3.5 rounded-xl border text-left text-sm transition-colors cursor-pointer ${
                                  selected
                                    ? 'bg-red-50 border-[#DC1E25] text-[#0B2249] font-bold'
                                    : 'bg-[#F5F7FB] border-slate-200 text-slate-700 hover:border-[#0B2249]/40'
                                }`}
                              >
                                {lvl}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-2 px-6 py-3 min-h-11 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer"
                        >
                          Continue to Subject &amp; English
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="discipline"
                          className="block text-sm font-bold text-[#0B2249] mb-2"
                        >
                          Preferred Field of Study
                        </label>
                        <select
                          id="discipline"
                          value={form.discipline}
                          onChange={(e) => setForm({ ...form, discipline: e.target.value })}
                          className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white cursor-pointer"
                        >
                          {DISCIPLINE_OPTIONS.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#0B2249] mb-3">
                          Current English Proficiency Status
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {ENGLISH_OPTIONS.map((eng) => {
                            const selected = form.englishStatus === eng;
                            return (
                              <button
                                key={eng}
                                type="button"
                                onClick={() => setForm({ ...form, englishStatus: eng })}
                                className={`p-3.5 rounded-xl border text-left text-sm transition-colors cursor-pointer ${
                                  selected
                                    ? 'bg-red-50 border-[#DC1E25] text-[#0B2249] font-bold'
                                    : 'bg-[#F5F7FB] border-slate-200 text-slate-700 hover:border-[#0B2249]/40'
                                }`}
                              >
                                {eng}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="intake"
                          className="block text-sm font-bold text-[#0B2249] mb-2"
                        >
                          Target Intake
                        </label>
                        <select
                          id="intake"
                          value={form.intake}
                          onChange={(e) => setForm({ ...form, intake: e.target.value })}
                          className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white cursor-pointer"
                        >
                          <option>September / October 2026</option>
                          <option>January / February 2027</option>
                          <option>April / May 2027</option>
                          <option>September / October 2027</option>
                          <option>January / February 2028</option>
                          <option>April / May 2028</option>
                          <option>September / October 2028</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#0B2249] cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="inline-flex items-center gap-2 px-6 py-3 min-h-11 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer"
                        >
                          Continue to Contact Info
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-bold text-[#0B2249] mb-1.5"
                          >
                            Full Name *
                          </label>
                          <input
                            id="fullName"
                            type="text"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            placeholder="e.g. Ayesha Khan"
                            aria-invalid={Boolean(errors.fullName)}
                            className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white"
                          />
                          {errors.fullName && (
                            <p className="mt-1 text-xs text-red-700 font-medium">{errors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-bold text-[#0B2249] mb-1.5"
                          >
                            Email Address *
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="you@example.com"
                            aria-invalid={Boolean(errors.email)}
                            className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white"
                          />
                          {errors.email && (
                            <p className="mt-1 text-xs text-red-700 font-medium">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-bold text-[#0B2249] mb-1.5"
                        >
                          WhatsApp / Phone Number *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="0313-0240636"
                          aria-invalid={Boolean(errors.phone)}
                          className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-700 font-medium">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="notes"
                          className="block text-sm font-bold text-[#0B2249] mb-1.5"
                        >
                          Grades, GPA, or Preferred University (Optional)
                        </label>
                        <textarea
                          id="notes"
                          rows={2}
                          value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })}
                          placeholder="Share your latest qualification, percentage/GPA, or target city..."
                          className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white"
                        />
                      </div>

                      {submitError && (
                        <div
                          role="alert"
                          className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 font-medium"
                        >
                          {submitError}
                        </div>
                      )}

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#0B2249] cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-3.5 min-h-11 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] disabled:opacity-60 rounded-xl shadow-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1E25]"
                        >
                          {submitting
                            ? 'Sending to SMU Advisors...'
                            : 'Get My Free 48-Hour Shortlist'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
