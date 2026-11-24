import { ArrowRight } from 'lucide-react';
import { PageRoute } from '../data/consultancyData';
import { PageBanner } from '../components/PageBanner';
import { ResultsGallerySection } from '../components/ResultsGallerySection';
import { VideoTestimonialsSection } from '../components/VideoTestimonialsSection';
import { ProofAndStoriesSection } from '../components/ProofAndStoriesSection';

interface GuidesPageProps {
  onStartCheck: () => void;
  onNavigate: (page: PageRoute) => void;
}

export function GuidesPage({ onStartCheck, onNavigate }: GuidesPageProps) {
  return (
    <div>
      <PageBanner
        eyebrow="Student IELTS Results, Reviews & Visa Guides"
        title="Verified Student Scorecards & Practical Visa Preparation Guides"
        description="Inspect genuine British Council & IDP IELTS Test Report Forms from SM Usman’s Academy alongside verified UK, Germany, Italy, and Cyprus visa approvals."
        primaryImage="/assets/smusman/result_enaarah.jpg"
        primaryAlt="Verified Band 8.0 student TRF result at SM Usman's Academy"
        secondaryImage="/src/assets/images/student_story_1_1795499585370.jpg"
        secondaryAlt="Successful SMU graduate student portrait"
        badgeTitle="Band 7.5 – 8.5 Results"
        badgeSubtitle="98.4% Visa Compliance Success"
        actions={
          <button
            type="button"
            onClick={onStartCheck}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Start Free Check
            <ArrowRight className="w-4 h-4" />
          </button>
        }
      />

      <ResultsGallerySection onNavigate={onNavigate} pageTarget="guides" />

      <VideoTestimonialsSection pageTarget="guides" />

      <ProofAndStoriesSection />
    </div>
  );
}
