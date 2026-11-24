import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { CountryKey, DESTINATIONS } from '../data/consultancyData';
import { ResilientImage } from './ResilientImage';

interface DestinationsSectionProps {
  onSelectCountryForApplication: (country: CountryKey) => void;
}

export function DestinationsSection({ onSelectCountryForApplication }: DestinationsSectionProps) {
  const [activeId, setActiveId] = useState<CountryKey>('uk');
  const activeDestination =
    DESTINATIONS.find((dest) => dest.id === activeId) ?? DESTINATIONS[0];

  return (
    <section id="destinations" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#DC1E25] mb-2">
              Where Would You Like to Study?
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
              Explore Our Four Core Study Destinations
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-md">
            Select any country card below to compare tuition benchmarks, intakes, post-study work
            visas, and partner universities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {DESTINATIONS.map((dest) => {
            const isSelected = dest.id === activeId;
            return (
              <motion.button
                key={dest.id}
                type="button"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setActiveId(dest.id)}
                aria-pressed={isSelected}
                className={`group text-left rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1E25] ${
                  isSelected
                    ? 'border-[#0B2249] ring-2 ring-[#0B2249] bg-[#0B2249] text-white shadow-lg'
                    : 'border-slate-200 bg-[#F5F7FB] hover:border-[#0B2249]/40 hover:bg-white text-[#0B2249] hover:shadow-md'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200">
                  <ResilientImage
                    src={dest.image}
                    alt={dest.imageAlt}
                    fallbackTitle={dest.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-display text-lg font-bold">{dest.name}</h3>
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        isSelected ? 'text-[#FBBF24]' : 'text-[#0B2249]'
                      }`}
                    >
                      {dest.intakes.split('·')[0].trim()}
                    </span>
                  </div>
                  <p
                    className={`font-mono text-xs tabular-nums mb-2 ${
                      isSelected ? 'text-slate-200' : 'text-slate-600'
                    }`}
                  >
                    Tuition: {dest.tuitionRange}
                  </p>
                  <p
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-[#FBBF24]' : 'text-[#DC1E25]'
                    }`}
                  >
                    {isSelected ? 'Viewing Details Below' : 'View Requirements →'}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          key={activeDestination.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch bg-[#F5F7FB] border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10"
        >
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-200">
              <ResilientImage
                src={activeDestination.image}
                alt={activeDestination.imageAlt}
                fallbackTitle={`${activeDestination.name} Universities`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white border border-slate-200 rounded-xl p-5">
              <div>
                <p className="text-xs text-slate-500 mb-1">Annual Tuition</p>
                <p className="font-mono text-sm font-bold text-[#0B2249] tabular-nums">
                  {activeDestination.tuitionRange}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Living Benchmark</p>
                <p className="font-mono text-sm font-bold text-[#0B2249] tabular-nums">
                  {activeDestination.livingEstimate}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Post-Study Work</p>
                <p className="text-sm font-semibold text-slate-900">
                  {activeDestination.postStudyWork}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Intakes</p>
                <p className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                  {activeDestination.intakes}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-3">
                <span className="font-bold text-[#DC1E25]">{activeDestination.name}</span>
                <span aria-hidden="true">·</span>
                <span>{activeDestination.visaRoute}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B2249] mb-4">
                {activeDestination.tagline}
              </h3>

              <p className="text-base text-slate-700 leading-relaxed mb-6">
                {activeDestination.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h4 className="font-display text-sm font-bold text-[#0B2249] mb-3">
                    SMU Compliance &amp; Support
                  </h4>
                  <ul className="space-y-2.5">
                    {activeDestination.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-[#DC1E25] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h4 className="font-display text-sm font-bold text-[#0B2249] mb-3">
                    Partner Universities
                  </h4>
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {activeDestination.partnerUniversities.map((uni) => (
                      <li key={uni} className="truncate">
                        {uni}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-slate-600">
                <span className="font-semibold text-[#0B2249]">English Requirement: </span>
                <span>{activeDestination.languageRequirement}</span>
              </div>

              <button
                type="button"
                onClick={() => onSelectCountryForApplication(activeDestination.id)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-11 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1E25]"
              >
                Apply for {activeDestination.shortLabel}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
