import { ExternalLink, Lock, Mail, MapPin, Phone } from 'lucide-react';
import {
  KARACHI_CAMPUSES,
  PageRoute,
} from '../data/consultancyData';
import { useSiteContent } from '../context/SiteContentContext';
import { SocialBrandIcon } from './SocialBrandIcon';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { config } = useSiteContent();
  const social = config.socialLinks;
  const logoUrl = config.awardsAndPictures.academyLogoUrl;
  const campuses =
    config.campusLocations?.length ? config.campusLocations : KARACHI_CAMPUSES;

  return (
    <footer className="bg-[#071631] text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        {/* Top Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          <div className="md:col-span-4 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-3 cursor-pointer text-left"
            >
              <img
                src={logoUrl}
                alt="SM Usman Consultants Official Logo"
                referrerPolicy="no-referrer"
                className="h-12 w-12 object-contain rounded-lg bg-white p-0.5 shrink-0"
              />
              <span className="font-display text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
                SMU Consultants
              </span>
            </button>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Founded in 2007 as SM Usman’s Academy &amp; Study Abroad Consultants — British Council
              Awarded IELTS, PTE, Duolingo, TOEFL &amp; OET coaching paired with direct admissions
              across the UK, Germany, Italy, and Cyprus.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold pt-1">
              <a
                href={social.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SM Usman's Academy Facebook Page"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2] hover:bg-[#1465D1] text-white transition-colors whitespace-nowrap"
              >
                <SocialBrandIcon platform="facebook" className="w-3.5 h-3.5" />
                Facebook
              </a>
              <a
                href={social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SM Usman's Academy Instagram"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#E1306C] to-[#C13584] hover:opacity-90 text-white transition-opacity whitespace-nowrap"
              >
                <SocialBrandIcon platform="instagram" className="w-3.5 h-3.5" />
                Instagram
              </a>
              <a
                href={social.youtubeShortsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SM Usman's Academy YouTube Shorts"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF0000] hover:bg-[#CC0000] text-white transition-colors whitespace-nowrap"
              >
                <SocialBrandIcon platform="youtube" className="w-3.5 h-3.5" />
                YouTube
              </a>
              <a
                href={`https://wa.me/${social.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Advisory Desk"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5B] text-white transition-colors whitespace-nowrap"
              >
                <SocialBrandIcon platform="whatsapp" className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3 text-sm">
            <p className="font-display font-bold text-white">Explore Pages</p>
            <ul className="space-y-2">
              {[
                { page: 'home' as PageRoute, label: 'Home' },
                { page: 'destinations' as PageRoute, label: 'Destinations' },
                { page: 'services' as PageRoute, label: 'Services & Prep' },
                { page: 'book-exam' as PageRoute, label: 'Book Official Exam' },
                { page: 'about' as PageRoute, label: 'About & Campuses' },
                { page: 'guides' as PageRoute, label: 'Guides & Results' },
                { page: 'apply' as PageRoute, label: 'Free Eligibility Check' },
              ].map((item) => (
                <li key={item.page}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.page)}
                    className="text-left text-slate-300 hover:text-[#FBBF24] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3 text-sm">
            <p className="font-display font-bold text-white">Test Preparation Pages</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
              {[
                { page: 'test-ielts' as PageRoute, label: 'IELTS (Academic & UKVI)' },
                { page: 'test-pte' as PageRoute, label: 'PTE Academic & Core' },
                { page: 'test-duolingo' as PageRoute, label: 'Duolingo English Test' },
                { page: 'test-toefl' as PageRoute, label: 'TOEFL iBT' },
                { page: 'test-oet' as PageRoute, label: 'OET Healthcare' },
                { page: 'test-english' as PageRoute, label: 'Spoken English Course' },
              ].map((item) => (
                <li key={item.page}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.page)}
                    className="text-left text-slate-300 hover:text-[#FBBF24] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3 text-sm">
            <p className="font-display font-bold text-white">Direct Contact &amp; Booking</p>
            <div className="space-y-1.5 font-mono text-xs sm:text-sm text-white font-semibold tabular-nums">
              <p className="whitespace-nowrap">
                WhatsApp:{' '}
                <a
                  href={`https://wa.me/${social.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline"
                >
                  {social.whatsappDisplay}
                </a>
              </p>
              <p className="whitespace-nowrap">
                Helpline:{' '}
                <a
                  href={`tel:${social.helplinePhone.replace(/[^\d+]/g, '')}`}
                  className="hover:text-[#FBBF24] transition-colors"
                >
                  {social.helplinePhone}
                </a>
              </p>
            </div>
            <p className="text-xs text-slate-200">
              <a
                href={`mailto:${social.leadEmail}`}
                className="inline-flex items-center gap-1.5 hover:text-[#FBBF24] transition-colors font-medium whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5 text-[#FBBF24]" />
                {social.leadEmail}
              </a>
            </p>
            <div className="pt-1 flex flex-col items-start gap-2">
              <button
                type="button"
                onClick={() => onNavigate('apply')}
                className="text-left text-xs font-bold text-[#FBBF24] hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                Book Campus or Video Session (2026–2028) →
              </button>
              <button
                type="button"
                onClick={() => onNavigate('book-exam')}
                className="text-left text-xs font-bold text-white hover:text-[#DC1E25] transition-colors cursor-pointer whitespace-nowrap"
              >
                Register Official IELTS / PTE / DET Exam →
              </button>
            </div>
          </div>
        </div>

        {/* All 3 Karachi Campus Addresses Listed Separately */}
        <div className="space-y-4 pb-8 border-b border-white/10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">
            Our Three Karachi Campus Addresses
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campuses.map((campus) => (
              <div
                key={campus.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-[#FBBF24] uppercase tracking-wide">
                    {campus.role}
                  </p>
                  <h3 className="font-display text-sm font-bold text-white">{campus.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#DC1E25] shrink-0 mt-0.5" />
                    <span>{campus.address}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 pl-5">{campus.landmark}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                  <a
                    href={`tel:${campus.phone.replace(/[^\d+]/g, '')}`}
                    className="inline-flex items-center gap-1 font-mono font-semibold text-white hover:text-[#FBBF24] whitespace-nowrap tabular-nums"
                  >
                    <Phone className="w-3 h-3 text-[#25D366]" />
                    {campus.phone}
                  </a>
                  <a
                    href={campus.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#FBBF24] hover:underline whitespace-nowrap"
                  >
                    Google Map
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 SMU Consultants (smuconsultant.com &amp; ielts-smusman.com). All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>British Council Highest Volume Contributor Award · Est. 2007</span>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <span>
              Developed by{' '}
              <a
                href="http://appsnation.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#FBBF24] hover:text-white underline transition-colors"
              >
                AppsNation
              </a>
            </span>
            <span aria-hidden="true" className="text-slate-600">
              ·
            </span>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1 font-semibold text-slate-300 hover:text-[#FBBF24] transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              Admin Panel
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
