import { useMemo, useState } from 'react';
import { ArrowRight, Calculator, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CountryKey } from '../data/consultancyData';

interface EligibilityAndCostCalculatorProps {
  onApplyWithSummary: (country: CountryKey, summaryNote: string) => void;
}

const COUNTRY_COSTS: Record<
  CountryKey,
  {
    label: string;
    currency: string;
    pkrRate: number;
    tuitionByLevel: Record<'Foundation' | 'Undergraduate' | 'Postgraduate', number>;
    livingMonthly: Record<'University Dorm' | 'Shared Apartment' | 'Private Studio', number>;
    visaFee: number;
    visaMaintenanceNote: string;
  }
> = {
  uk: {
    label: 'United Kingdom',
    currency: '£',
    pkrRate: 356,
    tuitionByLevel: { Foundation: 13900, Undergraduate: 16500, Postgraduate: 17500 },
    livingMonthly: { 'University Dorm': 820, 'Shared Apartment': 690, 'Private Studio': 1150 },
    visaFee: 1266,
    visaMaintenanceNote: 'UKVI Maintenance: £1,023/mo outside London or £1,334/mo in London (9 months)',
  },
  germany: {
    label: 'Germany',
    currency: '€',
    pkrRate: 302,
    tuitionByLevel: { Foundation: 4500, Undergraduate: 640, Postgraduate: 680 },
    livingMonthly: { 'University Dorm': 420, 'Shared Apartment': 540, 'Private Studio': 880 },
    visaFee: 75,
    visaMaintenanceNote: 'Blocked Account (Sperrkonto): €11,904/year (€992/month)',
  },
  italy: {
    label: 'Italy',
    currency: '€',
    pkrRate: 302,
    tuitionByLevel: { Foundation: 4200, Undergraduate: 2400, Postgraduate: 2600 },
    livingMonthly: { 'University Dorm': 360, 'Shared Apartment': 480, 'Private Studio': 760 },
    visaFee: 50,
    visaMaintenanceNote: 'DSU Regional Scholarships may waive 100% tuition + provide housing stipend',
  },
  cyprus: {
    label: 'Cyprus',
    currency: '€',
    pkrRate: 302,
    tuitionByLevel: { Foundation: 3400, Undergraduate: 5400, Postgraduate: 6800 },
    livingMonthly: { 'University Dorm': 350, 'Shared Apartment': 450, 'Private Studio': 650 },
    visaFee: 140,
    visaMaintenanceNote: 'Flexible semester installments & up to 50% academic merit waiver',
  },
};

export function EligibilityAndCostCalculator({
  onApplyWithSummary,
}: EligibilityAndCostCalculatorProps) {
  const [activeTab, setActiveTab] = useState<'eligibility' | 'calculator'>('eligibility');

  // Eligibility Checker State
  const [qualification, setQualification] = useState<'Intermediate / A-Levels' | 'Bachelor (2/4-Year)'>(
    'Bachelor (2/4-Year)'
  );
  const [marksPercent, setMarksPercent] = useState<number>(68);
  const [gapYears, setGapYears] = useState<number>(1);
  const [englishTest, setEnglishTest] = useState<
    'IELTS 6.5+' | 'IELTS 5.5 - 6.0' | 'PTE / Duolingo' | 'MOI / Not Taken Yet'
  >('IELTS 6.5+');

  // Cost Calculator State
  const [calcCountry, setCalcCountry] = useState<CountryKey>('uk');
  const [calcLevel, setCalcLevel] = useState<'Foundation' | 'Undergraduate' | 'Postgraduate'>(
    'Postgraduate'
  );
  const [housingType, setHousingType] = useState<
    'University Dorm' | 'Shared Apartment' | 'Private Studio'
  >('Shared Apartment');
  const [scholarshipPct, setScholarshipPct] = useState<number>(15);

  const eligibilityResults = useMemo(() => {
    const isMastersTrack = qualification === 'Bachelor (2/4-Year)';
    const hasHighEnglish = englishTest === 'IELTS 6.5+' || englishTest === 'PTE / Duolingo';
    const hasModEnglish = englishTest === 'IELTS 5.5 - 6.0';
    const needsPrep = englishTest === 'MOI / Not Taken Yet';

    return [
      {
        country: 'uk' as CountryKey,
        name: 'United Kingdom',
        status:
          marksPercent >= 60 && hasHighEnglish && gapYears <= 5
            ? 'Direct Entry Eligible'
            : marksPercent >= 50
            ? 'Pre-Master’s / Foundation or MOI Pathway'
            : 'Foundation Pathway Recommended',
        recommendedPrep: needsPrep
          ? 'MOI Waiver Check or 4-Week IELTS UKVI Batch'
          : hasModEnglish
          ? 'Eligible for 5.5–6.0 Direct / Pre-Sessional'
          : 'Meets Direct UK University Entry',
      },
      {
        country: 'germany' as CountryKey,
        name: 'Germany',
        status:
          marksPercent >= 70 && isMastersTrack && hasHighEnglish
            ? 'Public & Applied Sciences Eligible'
            : marksPercent >= 58
            ? 'Applied Sciences / Studienkolleg Track'
            : 'Foundation Track Recommended',
        recommendedPrep: needsPrep
          ? 'IELTS Academic 6.5 Coaching Needed'
          : 'Meets English Track Requirements',
      },
      {
        country: 'italy' as CountryKey,
        name: 'Italy',
        status:
          marksPercent >= 62 && gapYears <= 5
            ? 'Direct + DSU Scholarship Eligible'
            : 'Public University / Foundation Review',
        recommendedPrep: needsPrep
          ? 'MOI Accepted by Select Universities / IELTS 6.0'
          : 'Meets Italian English-Taught Criteria',
      },
      {
        country: 'cyprus' as CountryKey,
        name: 'Cyprus',
        status:
          marksPercent >= 50 ? 'Fast-Track Direct Offer Eligible' : 'Foundation Entry Eligible',
        recommendedPrep: needsPrep
          ? 'University Internal English Placement Test'
          : 'Direct Offer in 5–7 Working Days',
      },
    ];
  }, [qualification, marksPercent, gapYears, englishTest]);

  const costBreakdown = useMemo(() => {
    const cfg = COUNTRY_COSTS[calcCountry];
    const baseTuition = cfg.tuitionByLevel[calcLevel];
    const netTuition = Math.round(baseTuition * (1 - scholarshipPct / 100));
    const annualLiving = cfg.livingMonthly[housingType] * 12;
    const totalYearOne = netTuition + annualLiving + cfg.visaFee;
    const totalPkrLakhs = ((totalYearOne * cfg.pkrRate) / 100000).toFixed(1);

    return {
      cfg,
      baseTuition,
      netTuition,
      annualLiving,
      totalYearOne,
      totalPkrLakhs,
    };
  }, [calcCountry, calcLevel, housingType, scholarshipPct]);

  return (
    <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#DC1E25] mb-2">
              Interactive Student Tools
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
              Check Country Eligibility &amp; Estimate Year-1 Study Costs
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Choose interactive student tool"
            className="inline-flex items-center gap-1 p-1.5 bg-[#F5F7FB] border border-slate-200 rounded-xl self-start lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'eligibility'}
              onClick={() => setActiveTab('eligibility')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'eligibility'
                  ? 'bg-[#0B2249] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0B2249]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Eligibility Checker
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'calculator'}
              onClick={() => setActiveTab('calculator')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'bg-[#DC1E25] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#0B2249]'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Cost Calculator
            </button>
          </div>
        </div>

        {activeTab === 'eligibility' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#F5F7FB] border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="lg:col-span-5 space-y-5 bg-white border border-slate-200 rounded-xl p-6">
              <div>
                <p className="text-sm font-bold text-[#0B2249] mb-2">Latest Qualification</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(['Intermediate / A-Levels', 'Bachelor (2/4-Year)'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQualification(q)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                        qualification === q
                          ? 'bg-[#0B2249] text-white border-[#0B2249]'
                          : 'bg-[#F5F7FB] text-slate-700 border-slate-200 hover:border-[#0B2249]/40'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <label htmlFor="marksRange" className="font-bold text-[#0B2249]">
                    Academic Score / Percentage
                  </label>
                  <span className="font-mono font-bold text-[#DC1E25] tabular-nums">
                    {marksPercent}%
                  </span>
                </div>
                <input
                  id="marksRange"
                  type="range"
                  min={45}
                  max={95}
                  value={marksPercent}
                  onChange={(e) => setMarksPercent(Number(e.target.value))}
                  className="w-full accent-[#DC1E25] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <label htmlFor="gapRange" className="font-bold text-[#0B2249]">
                    Study / Work Gap (Years)
                  </label>
                  <span className="font-mono font-bold text-[#0B2249] tabular-nums">
                    {gapYears} {gapYears === 1 ? 'Year' : 'Years'}
                  </span>
                </div>
                <input
                  id="gapRange"
                  type="range"
                  min={0}
                  max={8}
                  value={gapYears}
                  onChange={(e) => setGapYears(Number(e.target.value))}
                  className="w-full accent-[#0B2249] cursor-pointer"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-[#0B2249] mb-2">English Test Status</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    [
                      'IELTS 6.5+',
                      'IELTS 5.5 - 6.0',
                      'PTE / Duolingo',
                      'MOI / Not Taken Yet',
                    ] as const
                  ).map((eng) => (
                    <button
                      key={eng}
                      type="button"
                      onClick={() => setEnglishTest(eng)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors cursor-pointer ${
                        englishTest === eng
                          ? 'bg-red-50 text-[#0B2249] border-[#DC1E25]'
                          : 'bg-[#F5F7FB] text-slate-700 border-slate-200 hover:border-[#0B2249]/40'
                      }`}
                    >
                      {eng}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eligibilityResults.map((res) => (
                <div
                  key={res.country}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-display text-lg font-bold text-[#0B2249]">
                        {res.name}
                      </h3>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-sm font-bold text-[#DC1E25] mb-2">{res.status}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{res.recommendedPrep}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onApplyWithSummary(
                        res.country,
                        `Eligibility Result (${res.name}): ${qualification}, ${marksPercent}%, Gap ${gapYears}yr, ${englishTest} -> ${res.status}`
                      )
                    }
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-semibold text-white bg-[#0B2249] hover:bg-[#DC1E25] rounded-lg transition-colors cursor-pointer"
                  >
                    Send Profile for {res.name}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#F5F7FB] border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="lg:col-span-6 space-y-5 bg-white border border-slate-200 rounded-xl p-6">
              <div>
                <p className="text-sm font-bold text-[#0B2249] mb-2">Select Country</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['uk', 'germany', 'italy', 'cyprus'] as CountryKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCalcCountry(key)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        calcCountry === key
                          ? 'bg-[#0B2249] text-white border-[#0B2249]'
                          : 'bg-[#F5F7FB] text-slate-700 border-slate-200 hover:border-[#0B2249]/40'
                      }`}
                    >
                      {COUNTRY_COSTS[key].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-[#0B2249] mb-2">Degree Level</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Foundation', 'Undergraduate', 'Postgraduate'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCalcLevel(lvl)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        calcLevel === lvl
                          ? 'bg-[#DC1E25] text-white border-[#DC1E25]'
                          : 'bg-[#F5F7FB] text-slate-700 border-slate-200 hover:border-[#0B2249]/40'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-[#0B2249] mb-2">Accommodation Style</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['University Dorm', 'Shared Apartment', 'Private Studio'] as const).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHousingType(h)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        housingType === h
                          ? 'bg-[#0B2249] text-white border-[#0B2249]'
                          : 'bg-[#F5F7FB] text-slate-700 border-slate-200 hover:border-[#0B2249]/40'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <label htmlFor="scholarshipSlider" className="font-bold text-[#0B2249]">
                    Estimated Merit / DSU Scholarship Waiver
                  </label>
                  <span className="font-mono font-bold text-[#DC1E25] tabular-nums">
                    {scholarshipPct}%
                  </span>
                </div>
                <input
                  id="scholarshipSlider"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={scholarshipPct}
                  onChange={(e) => setScholarshipPct(Number(e.target.value))}
                  className="w-full accent-[#DC1E25] cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#0B2249] text-white rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider mb-2">
                  Year-1 Study Budget Estimate · {costBreakdown.cfg.label}
                </p>
                <div className="flex flex-wrap items-baseline gap-4 mb-6">
                  <p className="font-mono text-4xl sm:text-5xl font-extrabold text-white tabular-nums">
                    {costBreakdown.cfg.currency}
                    {costBreakdown.totalYearOne.toLocaleString()}
                  </p>
                  <p className="font-mono text-sm text-[#FBBF24] tabular-nums">
                    ≈ PKR {costBreakdown.totalPkrLakhs} Lakhs
                  </p>
                </div>

                <div className="space-y-3 border-t border-white/15 pt-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Net Annual Tuition ({calcLevel})</span>
                    <span className="font-mono font-bold tabular-nums">
                      {costBreakdown.cfg.currency}
                      {costBreakdown.netTuition.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">12-Month Living ({housingType})</span>
                    <span className="font-mono font-bold tabular-nums">
                      {costBreakdown.cfg.currency}
                      {costBreakdown.annualLiving.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Estimated Visa / Permit Fee</span>
                    <span className="font-mono font-bold tabular-nums">
                      {costBreakdown.cfg.currency}
                      {costBreakdown.cfg.visaFee.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/15">
                <p className="text-xs text-slate-300">{costBreakdown.cfg.visaMaintenanceNote}</p>
                <button
                  type="button"
                  onClick={() =>
                    onApplyWithSummary(
                      calcCountry,
                      `Cost Estimate (${costBreakdown.cfg.label} - ${calcLevel}): Net Tuition ${costBreakdown.cfg.currency}${costBreakdown.netTuition}, Total Year-1 ${costBreakdown.cfg.currency}${costBreakdown.totalYearOne}`
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer"
                >
                  Lock This Budget &amp; Request University Shortlist
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
