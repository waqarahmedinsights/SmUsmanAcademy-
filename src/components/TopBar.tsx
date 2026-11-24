import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { PageRoute, TestPageSlug } from '../data/consultancyData';
import { useSiteContent } from '../context/SiteContentContext';

interface TopBarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

const TEST_SUBMENU: { id: TestPageSlug; label: string; tag: string }[] = [
  { id: 'test-ielts', label: 'IELTS (Academic & UKVI)', tag: 'Band 8.0+' },
  { id: 'test-pte', label: 'PTE Academic & Core', tag: '65 – 79+' },
  { id: 'test-duolingo', label: 'Duolingo English Test', tag: '115 – 135+' },
  { id: 'test-toefl', label: 'TOEFL iBT', tag: '95 – 110+' },
  { id: 'test-oet', label: 'OET Healthcare', tag: 'Grade B' },
  { id: 'test-english', label: 'Spoken English', tag: 'Fluency' },
];

export function TopBar({ currentPage, onNavigate }: TopBarProps) {
  const { config } = useSiteContent();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [testDropdownOpen, setTestDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTestDropdownOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTestDropdownOpen(false);
    };
    window.addEventListener('mousedown', onOutsideClick);
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('mousedown', onOutsideClick);
      window.removeEventListener('keydown', onEsc);
    };
  }, []);

  const handleNav = (page: PageRoute) => {
    setMobileOpen(false);
    setTestDropdownOpen(false);
    onNavigate(page);
  };

  const isServicesOrTest = currentPage === 'services' || currentPage.startsWith('test-');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 lg:gap-6">
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DC1E25] rounded text-left"
        >
          <img
            src={config.awardsAndPictures.academyLogoUrl}
            alt="SM Usman's Academy & SMU Consultants Original Logo"
            className="h-12 w-12 object-contain rounded-lg border border-slate-200 bg-white p-0.5 shrink-0 shadow-xs"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base lg:text-xl font-extrabold tracking-tight text-[#0B2249]">
              SMU Consultants
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#DC1E25]">
              SM Usman’s Academy · Est. 2007
            </span>
          </span>
        </button>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-3.5 lg:gap-5 text-xs lg:text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => handleNav('home')}
            aria-current={currentPage === 'home' ? 'page' : undefined}
            className={`whitespace-nowrap shrink-0 py-1.5 transition-colors cursor-pointer rounded ${
              currentPage === 'home'
                ? 'text-[#0B2249] font-bold underline underline-offset-8 decoration-2 decoration-[#DC1E25]'
                : 'hover:text-[#0B2249] hover:underline underline-offset-8 decoration-[#DC1E25]/50'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNav('destinations')}
            aria-current={currentPage === 'destinations' ? 'page' : undefined}
            className={`whitespace-nowrap shrink-0 py-1.5 transition-colors cursor-pointer rounded ${
              currentPage === 'destinations'
                ? 'text-[#0B2249] font-bold underline underline-offset-8 decoration-2 decoration-[#DC1E25]'
                : 'hover:text-[#0B2249] hover:underline underline-offset-8 decoration-[#DC1E25]/50'
            }`}
          >
            Destinations
          </button>

          {/* Services & Test Prep Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={testDropdownOpen}
              onClick={() => setTestDropdownOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1.5 transition-colors cursor-pointer rounded ${
                isServicesOrTest
                  ? 'text-[#0B2249] font-bold underline underline-offset-8 decoration-2 decoration-[#DC1E25]'
                  : 'hover:text-[#0B2249]'
              }`}
            >
              <span>Test Prep</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  testDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {testDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
                <button
                  type="button"
                  onClick={() => handleNav('services')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    currentPage === 'services'
                      ? 'bg-[#0B2249] text-white'
                      : 'text-[#0B2249] hover:bg-[#F5F7FB]'
                  }`}
                >
                  <span>All Services &amp; Admissions</span>
                  <span className="text-[#DC1E25]">Overview</span>
                </button>
                <div className="my-1.5 border-t border-slate-100" />
                {TEST_SUBMENU.map((test) => {
                  const active = currentPage === test.id;
                  return (
                    <button
                      key={test.id}
                      type="button"
                      onClick={() => handleNav(test.id)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                        active
                          ? 'bg-[#DC1E25] text-white'
                          : 'text-slate-700 hover:bg-[#F5F7FB] hover:text-[#0B2249]'
                      }`}
                    >
                      <span>{test.label}</span>
                      <span
                        className={`font-mono text-[10px] ${
                          active ? 'text-[#FBBF24]' : 'text-slate-400'
                        }`}
                      >
                        {test.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNav('book-exam')}
            aria-current={currentPage === 'book-exam' ? 'page' : undefined}
            className={`whitespace-nowrap shrink-0 py-1.5 transition-colors cursor-pointer rounded ${
              currentPage === 'book-exam'
                ? 'text-[#0B2249] font-bold underline underline-offset-8 decoration-2 decoration-[#DC1E25]'
                : 'hover:text-[#0B2249] hover:underline underline-offset-8 decoration-[#DC1E25]/50'
            }`}
          >
            Book Exam
          </button>

          <button
            type="button"
            onClick={() => handleNav('about')}
            aria-current={currentPage === 'about' ? 'page' : undefined}
            className={`whitespace-nowrap shrink-0 py-1.5 transition-colors cursor-pointer rounded ${
              currentPage === 'about'
                ? 'text-[#0B2249] font-bold underline underline-offset-8 decoration-2 decoration-[#DC1E25]'
                : 'hover:text-[#0B2249] hover:underline underline-offset-8 decoration-[#DC1E25]/50'
            }`}
          >
            About &amp; Offices
          </button>

          <button
            type="button"
            onClick={() => handleNav('guides')}
            aria-current={currentPage === 'guides' ? 'page' : undefined}
            className={`whitespace-nowrap shrink-0 py-1.5 transition-colors cursor-pointer rounded ${
              currentPage === 'guides'
                ? 'text-[#0B2249] font-bold underline underline-offset-8 decoration-2 decoration-[#DC1E25]'
                : 'hover:text-[#0B2249] hover:underline underline-offset-8 decoration-[#DC1E25]/50'
            }`}
          >
            Results &amp; Guides
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('apply')}
            className={`hidden sm:inline-flex items-center justify-center px-4 lg:px-5 py-2.5 text-xs lg:text-sm font-semibold rounded-lg shadow-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1E25] ${
              currentPage === 'apply'
                ? 'bg-[#0B2249] text-white'
                : 'bg-[#DC1E25] hover:bg-[#B9151B] text-white'
            }`}
          >
            Start Free Check
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-[#0B2249] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1.5 max-h-[82vh] overflow-y-auto">
          {[
            { id: 'home' as PageRoute, label: 'Home' },
            { id: 'destinations' as PageRoute, label: 'Destinations' },
            { id: 'services' as PageRoute, label: 'Services & Test Prep' },
            { id: 'book-exam' as PageRoute, label: 'Book Official Exam' },
            { id: 'about' as PageRoute, label: 'About & Offices' },
            { id: 'guides' as PageRoute, label: 'Results & Guides' },
          ].map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left flex items-center min-h-11 px-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0B2249] text-white'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="pt-2 pb-1 border-t border-slate-100">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#DC1E25] mb-1">
              Test Preparation Pages
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {TEST_SUBMENU.map((test) => (
                <button
                  key={test.id}
                  type="button"
                  onClick={() => handleNav(test.id)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentPage === test.id
                      ? 'bg-[#DC1E25] text-white'
                      : 'bg-[#F5F7FB] text-[#0B2249] hover:bg-slate-200'
                  }`}
                >
                  {test.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNav('apply')}
            className="w-full min-h-11 px-4 py-2.5 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-lg transition-colors cursor-pointer mt-2"
          >
            Start Free Check
          </button>
        </div>
      )}
    </header>
  );
}
