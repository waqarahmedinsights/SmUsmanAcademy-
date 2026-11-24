import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import {
  ACADEMY_LOGO_IMAGE,
  FACEBOOK_PAGE_URL,
  INSTAGRAM_PROFILE_URL,
  KARACHI_CAMPUSES,
  LEAD_EMAIL,
  PageRoute,
  WHATSAPP_DISPLAY,
  WHATSAPP_WA_NUMBER,
} from '../data/consultancyData';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
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
                src={ACADEMY_LOGO_IMAGE}
                alt="SMU Consultants Logo"
                className="h-12 w-12 object-contain rounded bg-white p-1 shrink-0"
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

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <a
                href={FACEBOOK_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 hover:text-[#FBBF24] transition-colors whitespace-nowrap"
              >
                Facebook Page
              </a>
              <span aria-hidden="true" className="text-slate-500">
                ·
              </span>
              <a
                href={INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 hover:text-[#FBBF24] transition-colors whitespace-nowrap"
              >
                Instagram (@smusmanacademy)
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
                  href={`https://wa.me/${WHATSAPP_WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </p>
              <p className="whitespace-nowrap">
                Helpline:{' '}
                <a href="tel:+923130240636" className="hover:text-[#FBBF24] transition-colors">
                  +92 313 0240636
                </a>
              </p>
            </div>
            <p className="text-xs text-slate-200">
              <a
                href={`mailto:${LEAD_EMAIL}`}
                className="inline-flex items-center gap-1.5 hover:text-[#FBBF24] transition-colors font-medium whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5 text-[#FBBF24]" />
                {LEAD_EMAIL}
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
            {KARACHI_CAMPUSES.map((campus) => (
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 SMU Consultants (smuconsultant.com &amp; ielts-smusman.com). All rights reserved.</p>
          <p>British Council Highest Volume Contributor Award · Est. 2007</p>
        </div>
      </div>
    </footer>
  );
}
