import { ArrowRight, Award, ExternalLink, MapPin, Phone, Users } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ACADEMY_POSTER_IMAGE,
  BANNER_STUDY_CONSULTANCY_IMAGE,
  COUNSELLOR_ADVISING_IMAGE,
  FACEBOOK_PAGE_URL,
  INSTAGRAM_PROFILE_URL,
  KARACHI_CAMPUSES,
  PARTNER_UNIVERSITIES_STRIP,
  YOUTUBE_CHANNEL_SHORTS_URL,
} from '../data/consultancyData';
import { useSiteContent } from '../context/SiteContentContext';
import { PageBanner } from '../components/PageBanner';
import { ResilientImage } from '../components/ResilientImage';
import { CampusLocationMap } from '../components/CampusLocationMap';
import { SocialBrandIcon } from '../components/SocialBrandIcon';

interface AboutOfficesPageProps {
  onStartCheck: (note?: string) => void;
}

export function AboutOfficesPage({ onStartCheck }: AboutOfficesPageProps) {
  const { config } = useSiteContent();
  const social = config.socialLinks;
  const pics = config.awardsAndPictures;
  const campuses =
    config.campusLocations?.length ? config.campusLocations : KARACHI_CAMPUSES;

  return (
    <div>
      <PageBanner
        eyebrow="About SMU Consultants & SM Usman’s Academy · Est. 2007"
        title="Over 17 Years Guiding Students From Karachi to Global Campuses"
        description="Visit our Gulshan-e-Iqbal, Shahrah-e-Faisal, and Nazimabad branches for British Council recognized IELTS/PTE training and zero-fee global university admissions."
        primaryImage={pics.bannerStudyConsultancyUrl || BANNER_STUDY_CONSULTANCY_IMAGE}
        primaryAlt="SMU Consultants study abroad office advising session in Karachi"
        secondaryImage={pics.counsellorAdvisingUrl || COUNSELLOR_ADVISING_IMAGE}
        secondaryAlt="SMU admissions advisor guiding a student in Karachi"
        badgeTitle="3 Karachi Campuses"
        badgeSubtitle="Gulshan · Shahrah-e-Faisal · Nazimabad"
        actions={
          <>
            <button
              type="button"
              onClick={() => onStartCheck()}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              Book Campus Visit
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={social.facebookUrl || FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#1465D1] rounded-xl transition-colors"
            >
              <SocialBrandIcon platform="facebook" className="w-3.5 h-3.5" />
              Facebook
            </a>
            <a
              href={social.instagramUrl || INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#E1306C] to-[#C13584] hover:opacity-95 rounded-xl transition-opacity"
            >
              <SocialBrandIcon platform="instagram" className="w-3.5 h-3.5" />
              Instagram
            </a>
            <a
              href={social.youtubeShortsUrl || YOUTUBE_CHANNEL_SHORTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-white bg-[#FF0000] hover:bg-[#CC0000] rounded-xl transition-colors"
            >
              <SocialBrandIcon platform="youtube" className="w-3.5 h-3.5" />
              YouTube
            </a>
          </>
        }
      />

      {/* Story + Attached Academy Classroom Visual */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <p className="text-sm font-bold text-[#DC1E25] mb-2">
                Our Heritage · SM Usman’s Academy
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0B2249] mb-5">
                Led by Sir SM Usman &amp; British Council Trained Specialists
              </h2>
              <p className="text-base text-slate-700 leading-relaxed mb-5">
                Since 2007, SM Usman’s Academy has trained thousands of high-achieving IELTS, PTE,
                TOEFL, Duolingo, and OET candidates—routinely achieving 8.0 to 8.5 band outcomes and
                earning the British Council Highest Volume Contributor Award (South Region).
              </p>
              <p className="text-base text-slate-700 leading-relaxed mb-8">
                SMU Consultants extends that same academic rigor into international university
                admissions and student visa compliance across the United Kingdom, Germany, Italy,
                and Cyprus—so students prepare their English test and secure their university offer
                under one trusted roof.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div>
                <p className="font-mono text-2xl font-bold text-[#0B2249] tabular-nums">2007</p>
                <p className="text-xs text-slate-600">Established in Karachi</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-[#DC1E25] tabular-nums">3</p>
                <p className="text-xs text-slate-600">Accessible City Campuses</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-[#0B2249] tabular-nums">120+</p>
                <p className="text-xs text-slate-600">Partner Universities</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-12 gap-4 items-stretch">
            <div className="col-span-7 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <ResilientImage
                src={pics.academyPosterUrl || ACADEMY_POSTER_IMAGE}
                alt="Sir SM Usman teaching on-campus IELTS and study abroad preparation classes"
                fallbackTitle="Sir SM Usman On-Campus Classes"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-5 flex flex-col gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <ResilientImage
                  src={pics.counsellorAdvisingUrl || COUNSELLOR_ADVISING_IMAGE}
                  alt="University admissions advisor meeting with a prospective student"
                  fallbackTitle="1-on-1 Admissions Counselling"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#0B2249] text-white rounded-2xl p-5 space-y-2">
                <Award className="w-6 h-6 text-[#FBBF24]" />
                <p className="font-display text-sm font-bold">
                  British Council Recognized
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Highest Volume Contributor Award (South Region) for student English readiness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Google Maps & Live Google Reviews */}
      <CampusLocationMap />

      {/* 3 Karachi Campuses Detail */}
      <section className="py-16 lg:py-20 bg-[#F5F7FB] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-bold text-[#DC1E25] mb-2">
              Visit Us In Person
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249]">
              Our Three Karachi Campuses
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {campuses.map((campus) => (
              <motion.article
                key={campus.id}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200 hover:border-[#0B2249]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-[#DC1E25] mb-2">{campus.role}</p>
                  <h3 className="font-display text-xl font-bold text-[#0B2249] mb-3">
                    {campus.name}
                  </h3>
                  <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#0B2249] shrink-0 mt-1" />
                      <span>{campus.address}</span>
                    </p>
                    <p className="text-xs text-slate-500 pl-6">Landmark: {campus.landmark}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{campus.hours}</span>
                    <a
                      href={`tel:${campus.phone.replace(/[^\d+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 font-mono font-bold text-[#0B2249] hover:text-[#DC1E25] tabular-nums"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#DC1E25]" />
                      {campus.phone}
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onStartCheck(`Appointment requested at: ${campus.name}`)}
                      className="flex-1 py-2.5 text-xs font-semibold text-white bg-[#0B2249] hover:bg-[#DC1E25] rounded-xl transition-colors cursor-pointer"
                    >
                      Book Visit
                    </button>
                    <a
                      href={campus.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-3.5 py-2.5 text-xs font-semibold text-[#0B2249] bg-[#F5F7FB] hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
                    >
                      Google Pin
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Institutions Directory */}
      <section className="py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-bold text-[#DC1E25] mb-2">
            <Users className="w-4 h-4" />
            <span>Global University Network</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B2249] mb-6">
            Direct Partner Institutions Across UK, Germany, Italy &amp; Cyprus
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PARTNER_UNIVERSITIES_STRIP.map((uni) => (
              <motion.div
                key={uni}
                whileHover={{ y: -2 }}
                className="bg-[#F5F7FB] hover:bg-white border border-slate-200 hover:border-[#DC1E25]/40 rounded-xl p-4 font-display text-sm font-bold text-[#0B2249] text-center transition-colors"
              >
                {uni}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
