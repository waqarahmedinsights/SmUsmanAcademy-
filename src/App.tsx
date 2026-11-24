import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CountryKey, PageRoute, ProgramEntry, TestPageSlug } from './data/consultancyData';
import { applySeoForPage } from './utils/seo';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { ChatbotAndWhatsApp } from './components/ChatbotAndWhatsApp';
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { ServicesPrepPage } from './pages/ServicesPrepPage';
import { BookExamPage } from './pages/BookExamPage';
import { AboutOfficesPage } from './pages/AboutOfficesPage';
import { GuidesPage } from './pages/GuidesPage';
import { ApplyPage } from './pages/ApplyPage';
import { TestDetailPage } from './pages/TestDetailPage';

const TEST_PAGE_SLUGS: TestPageSlug[] = [
  'test-ielts',
  'test-pte',
  'test-duolingo',
  'test-toefl',
  'test-oet',
  'test-english',
];

const VALID_PAGES: PageRoute[] = [
  'home',
  'destinations',
  'services',
  'book-exam',
  'about',
  'guides',
  'apply',
  ...TEST_PAGE_SLUGS,
];

function getInitialPage(): PageRoute {
  const hash = window.location.hash.replace('#', '') as PageRoute;
  return VALID_PAGES.includes(hash) ? hash : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(getInitialPage);
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>('uk');
  const [selectedProgramTitle, setSelectedProgramTitle] = useState<string | undefined>(
    undefined
  );
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    applySeoForPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash.replace('#', '') as PageRoute;
      if (VALID_PAGES.includes(next)) {
        setCurrentPage(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
    };
  }, []);

  const navigate = (page: PageRoute) => {
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCountryForApplication = (country: CountryKey) => {
    setSelectedCountry(country);
    setSelectedProgramTitle(undefined);
    navigate('apply');
  };

  const handleApplyWithProgram = (program: ProgramEntry) => {
    setSelectedCountry(program.country);
    setSelectedProgramTitle(`${program.title} — ${program.university}`);
    navigate('apply');
  };

  const handleApplyWithSummary = (country: CountryKey, summaryNote: string) => {
    setSelectedCountry(country);
    setSelectedProgramTitle(summaryNote);
    navigate('apply');
  };

  const handleStartCheckWithNote = (note?: string) => {
    setSelectedProgramTitle(note);
    navigate('apply');
  };

  const isTestDetailPage = currentPage.startsWith('test-');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {mapsQuotaExceeded && (
        <div
          role="alert"
          className="sticky top-0 z-50 bg-amber-50 border-b border-amber-300 text-amber-950 px-4 py-2.5 text-xs sm:text-sm text-center font-medium"
        >
          Google Maps API quota exceeded or key restricted. See{' '}
          <a
            href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-[#0B2249] hover:text-[#DC1E25]"
          >
            Google Maps AI Studio Quota Guide
          </a>{' '}
          to review project quota limits.
        </div>
      )}

      <TopBar currentPage={currentPage} onNavigate={navigate} />

      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 16, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.995 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentPage === 'home' && (
              <HomePage
                onNavigate={navigate}
                onSelectCountryForApplication={handleSelectCountryForApplication}
                onApplyWithSummary={handleApplyWithSummary}
              />
            )}

            {currentPage === 'destinations' && (
              <DestinationsPage
                onSelectCountryForApplication={handleSelectCountryForApplication}
                onApplyWithProgram={handleApplyWithProgram}
                onStartCheck={() => handleStartCheckWithNote()}
              />
            )}

            {currentPage === 'services' && (
              <ServicesPrepPage
                onStartCheck={handleStartCheckWithNote}
                onNavigate={navigate}
              />
            )}

            {currentPage === 'book-exam' && <BookExamPage onNavigate={navigate} />}

            {currentPage === 'about' && (
              <AboutOfficesPage onStartCheck={handleStartCheckWithNote} />
            )}

            {currentPage === 'guides' && (
              <GuidesPage
                onStartCheck={() => handleStartCheckWithNote()}
                onNavigate={navigate}
              />
            )}

            {currentPage === 'apply' && (
              <ApplyPage
                preselectedCountry={selectedCountry}
                preselectedProgramTitle={selectedProgramTitle}
              />
            )}

            {isTestDetailPage && (
              <TestDetailPage
                slug={currentPage as TestPageSlug}
                onNavigate={navigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={navigate} />
      <ChatbotAndWhatsApp />
    </div>
  );
}
