import { ExternalLink, Mail, MapPin, MessageCircle } from 'lucide-react';
import {
  BANNER_FREE_DEMO_IMAGE,
  BANNER_STUDY_CONSULTANCY_IMAGE,
  CountryKey,
  KARACHI_CAMPUSES,
} from '../data/consultancyData';
import { useSiteContent } from '../context/SiteContentContext';
import { PageBanner } from '../components/PageBanner';
import { ConsultationFormSection } from '../components/ConsultationFormSection';

interface ApplyPageProps {
  preselectedCountry: CountryKey;
  preselectedProgramTitle?: string;
}

export function ApplyPage({
  preselectedCountry,
  preselectedProgramTitle,
}: ApplyPageProps) {
  const { config } = useSiteContent();
  const leadEmail = config.socialLinks.leadEmail;
  const waDisplay = config.socialLinks.whatsappDisplay;
  const waNumber = config.socialLinks.whatsappNumber;
  const pics = config.awardsAndPictures;
  const campuses =
    config.campusLocations?.length ? config.campusLocations : KARACHI_CAMPUSES;

  return (
    <div>
      <PageBanner
        eyebrow="Free Eligibility Assessment · 2026 – 2028 Intakes Open"
        title="Apply for Your 48-Hour University Shortlist & Free Demo Class"
        description={`Complete your 3-step student profile below. Every inquiry goes directly to ${leadEmail} and is reviewed personally by Sir Usman’s senior admissions & test-prep team.`}
        primaryImage={pics.bannerStudyConsultancyUrl || BANNER_STUDY_CONSULTANCY_IMAGE}
        primaryAlt="SMU Consultants study abroad advisor guiding a Pakistani student"
        secondaryImage={pics.bannerFreeDemoUrl || BANNER_FREE_DEMO_IMAGE}
        secondaryAlt="Live free English demo and admissions briefing seminar"
        badgeTitle="Zero Agency Fees"
        badgeSubtitle="UK · Germany · Italy · Cyprus · Test Prep"
      />

      <ConsultationFormSection
        preselectedCountry={preselectedCountry}
        preselectedProgramTitle={preselectedProgramTitle}
      />

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-[#0B2249]">
                Prefer an In-Person Assessment or Demo Class?
              </h2>
              <p className="text-sm text-slate-600">
                Walk into any of our three Karachi branches Monday through Saturday or contact{' '}
                <a href={`mailto:${leadEmail}`} className="font-semibold text-[#0B2249] underline">
                  {leadEmail}
                </a>
                .
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#1EBE5B] px-4 py-2 rounded-xl transition-colors tabular-nums"
              >
                <MessageCircle className="w-4 h-4" />
                {waDisplay}
              </a>
              <a
                href={`mailto:${leadEmail}`}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B2249] hover:text-[#DC1E25] px-3 py-2 border border-slate-300 rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4 text-[#DC1E25]" />
                {leadEmail}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campuses.map((c) => (
              <div
                key={c.id}
                className="bg-[#F5F7FB] border border-slate-200 rounded-xl p-4 text-xs space-y-2"
              >
                <p className="font-display text-sm font-bold text-[#0B2249] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#DC1E25]" />
                  {c.name}
                </p>
                <p className="text-slate-600">{c.address}</p>
                <div className="flex items-center justify-between pt-1">
                  <p className="font-mono font-semibold text-[#0B2249] tabular-nums">
                    {c.phone}
                  </p>
                  <a
                    href={c.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#DC1E25] hover:underline"
                  >
                    Google Pin
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
