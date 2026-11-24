import { ArrowRight } from 'lucide-react';
import {
  BANNER_STUDY_CONSULTANCY_IMAGE,
  CountryKey,
  DESTINATIONS,
  ProgramEntry,
} from '../data/consultancyData';
import { PageBanner } from '../components/PageBanner';
import { DestinationsSection } from '../components/DestinationsSection';
import { JourneyAndFinderSection } from '../components/JourneyAndFinderSection';
import { ResilientImage } from '../components/ResilientImage';

interface DestinationsPageProps {
  onSelectCountryForApplication: (country: CountryKey) => void;
  onApplyWithProgram: (program: ProgramEntry) => void;
  onStartCheck: () => void;
}

export function DestinationsPage({
  onSelectCountryForApplication,
  onApplyWithProgram,
  onStartCheck,
}: DestinationsPageProps) {
  return (
    <div>
      <PageBanner
        eyebrow="Study Destinations · 2026 – 2028 Intakes Open"
        title="Compare Tuition, Visas & Work Rights Across Four Countries"
        description="Explore accredited degree pathways across the United Kingdom, Germany, Italy, and Cyprus—backed by transparent tuition estimates, scholarships, and visa compliance support."
        primaryImage="/src/assets/images/dest_united_kingdom_1795499238196.jpg"
        primaryAlt="Historic British university campus courtyard"
        secondaryImage="/src/assets/images/dest_germany_1795499240047.jpg"
        secondaryAlt="Modern German engineering university atrium"
        badgeTitle="120+ Partner Universities"
        badgeSubtitle="UK · Germany · Italy · Cyprus"
        actions={
          <button
            type="button"
            onClick={onStartCheck}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Start Free Shortlist Check
            <ArrowRight className="w-4 h-4" />
          </button>
        }
      />

      <DestinationsSection
        onSelectCountryForApplication={onSelectCountryForApplication}
      />

      {/* Side-by-Side Comparison Matrix */}
      <section className="py-14 lg:py-16 bg-[#F5F7FB] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <p className="text-sm font-bold text-[#DC1E25] mb-2">
              Quick Comparison Matrix
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2249]">
              Side-by-Side Cost &amp; Post-Study Work Summary
            </h2>
          </div>

          <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-200 bg-[#0B2249] text-white text-xs uppercase tracking-wider">
                  <th className="py-4 px-5 font-semibold">Destination</th>
                  <th className="py-4 px-5 font-semibold">Annual Tuition</th>
                  <th className="py-4 px-5 font-semibold">Living Estimate</th>
                  <th className="py-4 px-5 font-semibold">Post-Study Stay</th>
                  <th className="py-4 px-5 font-semibold">Main Intakes</th>
                  <th className="py-4 px-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {DESTINATIONS.map((d) => (
                  <tr key={d.id} className="hover:bg-[#F5F7FB] transition-colors">
                    <td className="py-4 px-5 font-display font-bold text-[#0B2249]">
                      {d.name}
                    </td>
                    <td className="py-4 px-5 font-mono text-xs font-semibold text-slate-800 tabular-nums">
                      {d.tuitionRange}
                    </td>
                    <td className="py-4 px-5 font-mono text-xs text-slate-600 tabular-nums">
                      {d.livingEstimate}
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-medium">
                      {d.postStudyWork}
                    </td>
                    <td className="py-4 px-5 font-mono text-xs text-slate-600 tabular-nums">
                      {d.intakes}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectCountryForApplication(d.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-lg transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <JourneyAndFinderSection
        onApplyWithProgram={onApplyWithProgram}
        onStartCheck={onStartCheck}
      />

      <section className="py-12 lg:py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden bg-[#0B2249] text-white grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-md">
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-3">
              <p className="text-xs font-bold text-[#FBBF24]">
                Free 1-on-1 Admissions &amp; Visa Consultancy · 2026 – 2028
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Get Your Personalized 5-University Shortlist in 48 Hours
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed max-w-2xl">
                Meet our Karachi advisors in Gulshan, Shahrah-e-Faisal, or Nazimabad—or join via
                video call—for zero-fee university applications, SOP reviews, and visa compliance.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onStartCheck}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer"
                >
                  Book Free Consultancy Session
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 min-h-[210px] bg-[#071631]">
              <ResilientImage
                src={BANNER_STUDY_CONSULTANCY_IMAGE}
                alt="SMU Consultants study abroad advisor session"
                fallbackTitle="Study Abroad Consultancy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
