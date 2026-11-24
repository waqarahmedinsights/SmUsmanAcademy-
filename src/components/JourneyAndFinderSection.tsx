import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Search } from 'lucide-react';
import {
  COUNSELLOR_ADVISING_IMAGE,
  CountryKey,
  JOURNEY_STEPS,
  PROGRAMS_CATALOG,
  ProgramEntry,
} from '../data/consultancyData';
import { ResilientImage } from './ResilientImage';

interface JourneyAndFinderSectionProps {
  onApplyWithProgram: (program: ProgramEntry) => void;
  onStartCheck: () => void;
}

const COUNTRY_FILTERS: { id: 'all' | CountryKey; label: string }[] = [
  { id: 'all', label: 'All Countries' },
  { id: 'uk', label: 'United Kingdom' },
  { id: 'germany', label: 'Germany' },
  { id: 'italy', label: 'Italy' },
  { id: 'cyprus', label: 'Cyprus' },
];

const LEVEL_FILTERS: ('All Levels' | ProgramEntry['level'])[] = [
  'All Levels',
  'Foundation',
  'Undergraduate',
  'Postgraduate',
];

const DISCIPLINE_FILTERS: ('All Disciplines' | ProgramEntry['discipline'])[] = [
  'All Disciplines',
  'Business & Finance',
  'Computer Science & AI',
  'Engineering',
  'Healthcare & Sciences',
];

export function JourneyAndFinderSection({
  onApplyWithProgram,
  onStartCheck,
}: JourneyAndFinderSectionProps) {
  const [countryFilter, setCountryFilter] = useState<'all' | CountryKey>('all');
  const [levelFilter, setLevelFilter] = useState<'All Levels' | ProgramEntry['level']>('All Levels');
  const [disciplineFilter, setDisciplineFilter] = useState<
    'All Disciplines' | ProgramEntry['discipline']
  >('All Disciplines');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrograms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PROGRAMS_CATALOG.filter((prog) => {
      if (countryFilter !== 'all' && prog.country !== countryFilter) return false;
      if (levelFilter !== 'All Levels' && prog.level !== levelFilter) return false;
      if (disciplineFilter !== 'All Disciplines' && prog.discipline !== disciplineFilter)
        return false;
      if (
        query &&
        !prog.title.toLowerCase().includes(query) &&
        !prog.university.toLowerCase().includes(query) &&
        !prog.countryName.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });
  }, [countryFilter, levelFilter, disciplineFilter, searchQuery]);

  const resetFilters = () => {
    setCountryFilter('all');
    setLevelFilter('All Levels');
    setDisciplineFilter('All Disciplines');
    setSearchQuery('');
  };

  return (
    <>
      <section id="about" className="py-16 lg:py-24 bg-[#F5F7FB] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch mb-16">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 bg-white min-h-[300px]">
              <ResilientImage
                src={COUNSELLOR_ADVISING_IMAGE}
                alt="SMU Consultants advisor reviewing international university applications with a student"
                fallbackTitle="Dedicated Admissions Advisors"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between py-2">
              <div>
                <p className="text-sm font-bold text-[#DC1E25] mb-2">
                  Who We Are · SM Usman’s Academy &amp; Consultants
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance] mb-5">
                  British Council Trained Faculty &amp; Zero-Fee Admissions
                </h2>
                <p className="text-base text-slate-700 leading-relaxed mb-6">
                  Applying abroad should never feel like guesswork. Across our campuses in
                  Gulshan-e-Iqbal, North Nazimabad, and Shahrah-e-Faisal, SMU pairs IELTS, PTE,
                  TOEFL, Duolingo, and OET coaching with direct university admissions across the
                  UK, Germany, Italy, and Cyprus.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    'Free 60-minute academic & budget evaluation via video or on campus',
                    'British Council trained English & test preparation faculty (IELTS / PTE / OET)',
                    'Direct admissions channels with 120+ universities across UK & Europe',
                    'Mock CAS & embassy credibility interviews led by compliance specialists',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm sm:text-base text-slate-800">
                      <CheckCircle2 className="w-5 h-5 text-[#DC1E25] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onStartCheck}
                  className="inline-flex items-center gap-2 px-6 py-3.5 min-h-11 text-sm font-semibold text-white bg-[#0B2249] hover:bg-[#14336B] rounded-xl transition-colors cursor-pointer"
                >
                  Book Your Free 60-Min Session
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div id="journey" className="pt-8 border-t border-slate-200">
            <div className="max-w-2xl mb-10">
              <p className="text-sm font-bold text-[#DC1E25] mb-2">
                How It Works
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
                Five Structured Steps From Free Check to Campus Arrival
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
              {JOURNEY_STEPS.map((step, idx) => {
                const spanClass = idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
                return (
                  <article
                    key={step.number}
                    className={`${spanClass} bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#0B2249]/40 transition-colors`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="font-mono text-base font-bold text-[#DC1E25] tabular-nums">
                          {step.number}.
                        </span>
                        <span className="font-mono text-xs text-slate-500 tabular-nums">
                          {step.turnaround}
                        </span>
                      </div>

                      <h4 className="font-display text-xl font-bold text-[#0B2249] mb-3">
                        {step.title}
                      </h4>

                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                        {step.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                      <span className="font-semibold text-[#0B2249]">Deliverable: </span>
                      <span>{step.deliverable}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="finder" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#DC1E25] mb-2">
                Interactive Course Explorer
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
                Compare Degree Pathways, Tuition &amp; Entry Criteria
              </h2>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course or university..."
                aria-label="Search degree programmes or universities"
                className="w-full pl-10 pr-4 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DC1E25] focus:bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-2">Destination:</span>
              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F5F7FB] rounded-xl border border-slate-200">
                {COUNTRY_FILTERS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCountryFilter(c.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      countryFilter === c.id
                        ? 'bg-[#0B2249] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#0B2249]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F5F7FB] rounded-xl border border-slate-200">
                  {LEVEL_FILTERS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        levelFilter === lvl
                          ? 'bg-[#DC1E25] text-white shadow-sm'
                          : 'text-slate-600 hover:text-[#0B2249]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

                <select
                  aria-label="Filter by academic discipline"
                  value={disciplineFilter}
                  onChange={(e) =>
                    setDisciplineFilter(
                      e.target.value as 'All Disciplines' | ProgramEntry['discipline']
                    )
                  }
                  className="px-3.5 py-2 text-xs font-semibold bg-[#F5F7FB] border border-slate-200 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25] cursor-pointer"
                >
                  {DISCIPLINE_FILTERS.map((disc) => (
                    <option key={disc} value={disc}>
                      {disc}
                    </option>
                  ))}
                </select>
              </div>

              <p className="font-mono text-xs text-slate-500 tabular-nums">
                Showing {filteredPrograms.length} of {PROGRAMS_CATALOG.length} pathways
              </p>
            </div>
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="bg-[#F5F7FB] border border-slate-200 rounded-2xl p-10 text-center">
              <p className="font-display text-lg font-bold text-[#0B2249] mb-2">
                No matching programmes in this filter view
              </p>
              <p className="text-sm text-slate-600 mb-5">
                Reset filters or request a custom 5-university shortlist from our advisors within 48 hours.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0B2249] hover:bg-[#14336B] rounded-xl transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-[#F5F7FB] hover:bg-white border border-slate-200 hover:border-[#0B2249]/40 rounded-2xl p-6 transition-colors duration-150 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-bold text-[#DC1E25]">{prog.countryName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{prog.level}</span>
                      <span aria-hidden="true">·</span>
                      <span>{prog.discipline}</span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-[#0B2249] mb-1">
                      {prog.title}
                    </h3>
                    <p className="text-sm text-slate-600">{prog.university}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
                      <div>
                        <span className="text-slate-500">Tuition: </span>
                        <span className="font-mono font-bold text-[#0B2249] tabular-nums">
                          {prog.tuitionAnnual}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Intake: </span>
                        <span className="font-mono font-semibold text-slate-800 tabular-nums">
                          {prog.intake}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">English: </span>
                        <span className="text-slate-800">{prog.englishReq}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onApplyWithProgram(prog)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0B2249] hover:bg-[#DC1E25] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Check Eligibility
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
