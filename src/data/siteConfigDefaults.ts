import type {
  CampusLocation,
  ContentSegment,
  CyclingStudentTestimonial,
  PlacementTarget,
  StudentResultCard,
  YouTubeVideoItem,
} from './consultancyData';

export interface SocialLinksConfig {
  facebookUrl: string;
  instagramUrl: string;
  youtubeChannelUrl: string;
  youtubeShortsUrl: string;
  whatsappDisplay: string;
  whatsappNumber: string;
  helplinePhone: string;
  leadEmail: string;
}

export interface MegaOfferConfig {
  enabled: boolean;
  ribbonText: string;
  badge: string;
  title: string;
  duration: string;
  classDuration: string;
  frequency: string;
  timings: string;
  originalFee: string;
  discountedFee: string;
  imageUrl: string;
  inclusions: string[];
}

export interface DynamicOfferItem {
  id: string;
  enabled: boolean;
  badge: string;
  title: string;
  duration: string;
  classDuration: string;
  frequency: string;
  timings: string;
  originalFee: string;
  discountedFee: string;
  imageUrl: string;
  inclusions: string[];
}

export interface CampusScheduleItem {
  id: string;
  campusName: string;
  days: string[];
  timingSlots: string[];
}

export interface DemoScheduleConfig {
  campuses: string[];
  shahrahDays: string[];
  timingSlots: string[];
}

export type FaqCategory =
  | 'General'
  | 'UK'
  | 'Germany'
  | 'Italy'
  | 'Cyprus'
  | 'IELTS & PTE'
  | 'Fees & Scholarships';

export const FAQ_TOPIC_OPTIONS: FaqCategory[] = [
  'General',
  'UK',
  'Germany',
  'Italy',
  'Cyprus',
  'IELTS & PTE',
  'Fees & Scholarships',
];

export function normalizeFaqCategory(raw?: string, questionText = ''): FaqCategory {
  const val = String(raw ?? '').trim();
  if ((FAQ_TOPIC_OPTIONS as string[]).includes(val)) {
    return val as FaqCategory;
  }
  const combined = `${val} ${questionText}`.toLowerCase();
  if (combined.includes('uk') || combined.includes('cas') || combined.includes('britain')) {
    return 'UK';
  }
  if (combined.includes('german') || combined.includes('sperrkonto') || combined.includes('uni-assist')) {
    return 'Germany';
  }
  if (combined.includes('italy') || combined.includes('dsu') || combined.includes('universitaly')) {
    return 'Italy';
  }
  if (combined.includes('cyprus')) {
    return 'Cyprus';
  }
  if (
    combined.includes('ielts') ||
    combined.includes('pte') ||
    combined.includes('duolingo') ||
    combined.includes('demo')
  ) {
    return 'IELTS & PTE';
  }
  if (combined.includes('fee') || combined.includes('scholarship') || combined.includes('cost')) {
    return 'Fees & Scholarships';
  }
  return 'General';
}

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

export interface AwardsAndPicturesConfig {
  academyLogoUrl: string;
  sirUsmanPortraitUrl: string;
  britishCouncilAwardUrl: string;
  pearsonTrophyUrl: string;
  pearsonStageUrl: string;
  pearsonCertificateUrl: string;
  pteScorecardsUrl: string;
  academyPosterUrl: string;
  heroStudentUrl: string;
  counsellorAdvisingUrl: string;
  heroCampusUrl: string;
  bannerTestPrepUrl: string;
  bannerStudyConsultancyUrl: string;
  bannerOfficialExamUrl: string;
  bannerFreeDemoUrl: string;
}

export interface SiteConfig {
  updatedAt: string;
  socialLinks: SocialLinksConfig;
  megaOffer: MegaOfferConfig;
  customOffers: DynamicOfferItem[];
  campusSchedules: CampusScheduleItem[];
  campusLocations: CampusLocation[];
  demoSchedule: DemoScheduleConfig;
  awardsAndPictures: AwardsAndPicturesConfig;
  studentTestimonialVideos: YouTubeVideoItem[];
  sirUsmanShorts: YouTubeVideoItem[];
  textTestimonials: CyclingStudentTestimonial[];
  resultCards: StudentResultCard[];
  faqs: FaqItem[];
}

export interface StoredLeadRecord {
  referenceId: string;
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  studyLevel: string;
  discipline: string;
  intake: string;
  englishStatus?: string;
  notes?: string;
  source?: string;
  status?: 'New' | 'Contacted' | 'Demo Scheduled' | 'Enrolled';
  emailDelivered?: boolean;
  emailError?: string;
}

export function extractYouTubeVideoId(input: string): string {
  const raw = input.trim();
  if (!raw) return '';
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    if (url.pathname.includes('/shorts/')) {
      const id = url.pathname.split('/shorts/')[1]?.split('/')[0]?.split('?')[0];
      if (id) return id;
    }
    if (url.pathname.includes('/embed/')) {
      const id = url.pathname.split('/embed/')[1]?.split('/')[0]?.split('?')[0];
      if (id) return id;
    }
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace(/^\//, '').split('/')[0];
      if (id) return id;
    }
    const v = url.searchParams.get('v');
    if (v) return v;
  } catch {
    // Fallback regex extraction
  }

  const match = raw.match(/(?:shorts\/|youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? '';
}

export function getScheduleForCampus(
  config: SiteConfig,
  campusName: string
): { days: string[]; timingSlots: string[] } {
  const schedules = config.campusSchedules ?? [];
  const exact = schedules.find(
    (s) => s.campusName.trim().toLowerCase() === campusName.trim().toLowerCase()
  );
  if (exact) {
    return {
      days: exact.days.length > 0 ? exact.days : config.demoSchedule.shahrahDays,
      timingSlots:
        exact.timingSlots.length > 0 ? exact.timingSlots : config.demoSchedule.timingSlots,
    };
  }
  const fallback = schedules[0];
  return {
    days: fallback?.days.length ? fallback.days : config.demoSchedule.shahrahDays,
    timingSlots:
      fallback?.timingSlots.length ? fallback.timingSlots : config.demoSchedule.timingSlots,
  };
}

export interface SegmentedEntry {
  segment?: ContentSegment;
  visibleOnPages?: PlacementTarget[];
  testType?: string;
  badge?: string;
  title?: string;
  testOrTrack?: string;
}

export function inferContentSegment(item: SegmentedEntry): ContentSegment {
  if (item.segment) return item.segment;
  const text = `${item.testType || ''} ${item.badge || ''} ${item.title || ''} ${
    item.testOrTrack || ''
  }`.toLowerCase();
  if (text.includes('pte') || text.includes('pearson')) return 'pte';
  if (text.includes('duolingo') || text.includes('det')) return 'duolingo';
  if (text.includes('toefl')) return 'toefl';
  if (text.includes('oet')) return 'oet';
  if (text.includes('spoken') || text.includes('grammar')) return 'english';
  if (
    text.includes('ielts') ||
    text.includes('trf') ||
    text.includes('band ') ||
    text.includes('british council')
  ) {
    return 'ielts';
  }
  return 'consultancy';
}

const TEST_PAGE_TO_SEGMENT: Partial<Record<PlacementTarget, ContentSegment>> = {
  'test-ielts': 'ielts',
  'test-pte': 'pte',
  'test-duolingo': 'duolingo',
  'test-toefl': 'toefl',
  'test-oet': 'oet',
  'test-english': 'english',
};

export function filterItemsForPage<T extends SegmentedEntry>(
  items: T[],
  targetPage: PlacementTarget,
  options?: { onePerSegmentOnHome?: boolean }
): T[] {
  const testSegment = TEST_PAGE_TO_SEGMENT[targetPage];

  if (testSegment) {
    return items.filter((item) => {
      if (Array.isArray(item.visibleOnPages) && item.visibleOnPages.length > 0) {
        return item.visibleOnPages.includes(targetPage);
      }
      return inferContentSegment(item) === testSegment;
    });
  }

  const eligible = items.filter((item) => {
    if (Array.isArray(item.visibleOnPages) && item.visibleOnPages.length > 0) {
      return item.visibleOnPages.includes(targetPage);
    }
    return true;
  });

  if (targetPage === 'home' && options?.onePerSegmentOnHome) {
    const picked: T[] = [];
    const seenSegments = new Set<ContentSegment>();
    for (const item of eligible) {
      const seg = inferContentSegment(item);
      if (!seenSegments.has(seg)) {
        seenSegments.add(seg);
        picked.push(item);
      }
    }
    return picked.length > 0 ? picked : eligible.slice(0, 3);
  }

  return eligible;
}

export const DEFAULT_CAMPUS_SCHEDULES: CampusScheduleItem[] = [
  {
    id: 'campus-gulshan',
    campusName: 'Gulshan-e-Iqbal Campus (Head Office)',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timingSlots: [
      '12:00 PM – 1:30 PM',
      '3:00 PM – 4:30 PM',
      '5:00 PM – 6:30 PM',
      '7:00 PM – 8:30 PM',
    ],
  },
  {
    id: 'campus-shahrah',
    campusName: 'Shahrah-e-Faisal Campus',
    days: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
    timingSlots: [
      '12:00 PM – 1:30 PM',
      '3:00 PM – 4:30 PM',
      '4:30 PM – 6:00 PM',
      '6:30 PM – 8:00 PM',
    ],
  },
  {
    id: 'campus-nazimabad',
    campusName: 'North Nazimabad Campus',
    days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timingSlots: [
      '12:00 PM – 1:30 PM',
      '3:30 PM – 5:00 PM',
      '6:00 PM – 7:30 PM',
    ],
  },
  {
    id: 'campus-online',
    campusName: 'Live Online Class (Zoom / Meet)',
    days: ['Monday', 'Wednesday', 'Friday'],
    timingSlots: [
      '11:00 PM – 12:00 AM (PTE Online)',
      '8:00 PM – 9:30 PM',
      '4:00 PM – 5:30 PM',
    ],
  },
];

export const DEFAULT_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'gulshan',
    name: "SM Usman's Academy (Gulshan Campus)",
    role: 'Head Office · Admissions & Test Prep',
    address: 'Office No. 108, 1st Floor, Gulshan Trade Centre, Block 5, Gulshan-e-Iqbal, Karachi',
    landmark: 'Above MCB Bank, near Gulshan Chowrangi',
    hours: 'Mon – Sat · 09:30 – 20:30',
    phone: '+92 332 3502864',
    lat: 24.9235146,
    lng: 67.0919263,
    mapsUrl: 'https://maps.app.goo.gl/JQsoVLEGtfYMPYg86',
    googlePlaceQuery: "SM Usman's Academy Gulshan Campus Karachi",
  },
  {
    id: 'shahrah',
    name: "SM Usman's Academy (Shahra-E-Faisal)",
    role: 'Visa Compliance & Executive Batches',
    address:
      'Office No. 111, 1st Floor, Marine Faisal Building, PECHS Block 6, Shahrah-e-Faisal, Karachi',
    landmark: 'Main Nursery Bus Stop, Above Bank of Punjab',
    hours: 'Mon, Tue, Thu, Sat · 12:00 PM – 8:00 PM',
    phone: '+92 313 0240636',
    lat: 24.8585321,
    lng: 67.0601707,
    mapsUrl: 'https://maps.app.goo.gl/UEqZqVDhLw27YUwU6',
    googlePlaceQuery: "SM Usman's Academy Shahra-E-Faisal Karachi",
  },
  {
    id: 'nazimabad',
    name: "SM Usman's Academy (Nazimabad Campus)",
    role: 'Academic Counselling & Coaching',
    address: 'Alama Iqbal Town / Nazimabad Campus, Karachi',
    landmark: 'Near Jinnah Polytechnic & Main Nazimabad Corridor',
    hours: 'Mon – Sat · 10:00 – 20:00',
    phone: '+92 311 2406781',
    lat: 24.9263839,
    lng: 67.0279388,
    mapsUrl: 'https://maps.app.goo.gl/38T9JaKyYiuUkRUR6',
    googlePlaceQuery: "SM Usman's Academy Nazimabad Karachi",
  },
];

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-zero-fee',
    category: 'General',
    question: 'Does SMU Consultants charge any agency or counselling fee for university admissions?',
    answer:
      'No. Our study abroad counselling, course shortlisting, university application submission, SOP review, and visa filing support for partner institutions in the UK, Germany, Italy, and Cyprus carry zero agency service fee. Students only pay official university application fees (where applicable) and embassy charges directly.',
  },
  {
    id: 'faq-visa-docs',
    category: 'General',
    question: 'What documents are required to start my 2026–2028 study abroad assessment?',
    answer:
      'To begin your free eligibility check, bring or send scanned copies of your Matric/O-Level & Inter/A-Level transcripts, Bachelor degree & mark sheets (for Master applicants), valid passport, updated CV, and any existing IELTS/PTE/DET score (or MOI letter). You can submit your details on the Apply page in under 2 minutes.',
  },
  {
    id: 'faq-uk-gap',
    category: 'UK',
    question: 'Can I apply to UK universities with a study gap or without IELTS?',
    answer:
      'Yes. Many UK partner universities accept up to 2–5 years of verified work experience or study gap with a strong Statement of Purpose. Depending on your intermediate or bachelor marks (typically 70%+ in English), several universities also accept MOI (Medium of Instruction), PTE Academic, Duolingo English Test (DET), or an internal English test.',
  },
  {
    id: 'faq-uk-cas-bank',
    category: 'UK',
    question: 'What is the UK 28-day bank statement rule and CAS credibility interview?',
    answer:
      'For UK Student Route visas, tuition balance plus 9 months of UKVI living funds must remain untouched in the student or parent bank account for at least 28 consecutive days prior to CAS/visa filing. SMU Consultants conducts mock CAS credibility interviews at all Karachi branches so you clear university screening on the first attempt.',
  },
  {
    id: 'faq-germany-tuition',
    category: 'Germany',
    question: 'How does zero-tuition public university admission in Germany work for Pakistani students?',
    answer:
      'German public universities generally charge €0 tuition per semester (only a €150–€350 semester contribution covering transport). To qualify for the German student visa, students demonstrate financial sustenance via an official Blocked Account (Sperrkonto — approx. €11,904/year). We handle Uni-Assist, VPD evaluation, APS/embassy prep, and Blocked Account setup.',
  },
  {
    id: 'faq-italy-dsu',
    category: 'Italy',
    question: 'What is the Italy DSU regional scholarship and can it cover living costs?',
    answer:
      'DSU (Diritto allo Studio Universitario) scholarships in Italy are merit- and income-based regional grants that can provide a 100% university tuition fee waiver, subsidized/free accommodation or meal vouchers, plus an annual cash stipend of €6,000–€7,500 depending on the region (such as Lombardy, Emilia-Romagna, Lazio, or Piedmont).',
  },
  {
    id: 'faq-cyprus-timeline',
    category: 'Cyprus',
    question: 'How fast can I get an offer letter and student visa for Cyprus?',
    answer:
      'Cyprus admissions move very quickly—most accredited colleges and universities issue conditional or unconditional offer letters within 5 to 7 working days. With low initial tuition deposits (€3,400–€7,800/year options) and streamlined attestation, it is an ideal option for students seeking fast-track European admissions.',
  },
  {
    id: 'faq-pte-vs-ielts',
    category: 'IELTS & PTE',
    question: 'Should I take IELTS Academic, PTE Academic, or Duolingo English Test (DET)?',
    answer:
      'IELTS Academic/UKVI is universally accepted across UK, Europe, Australia, and Canada. PTE Academic is 100% computer-scored with fast 48-hour results and strong UKVI/Australian/European acceptance—making our Rs. 20,000 PTE Online Mega Offer popular for quick score targets. Duolingo (DET) is ideal for rapid home testing if accepted by your shortlisted university. Join a free diagnostic demo so Sir SM Usman can recommend the fastest score path for you.',
  },
  {
    id: 'faq-free-demo',
    category: 'IELTS & PTE',
    question: 'How do I join a free demo class at Gulshan, Shahrah-e-Faisal, Nazimabad, or Online?',
    answer:
      'Simply choose your preferred Campus / Location in the Free Demo section above—the available class days and timing slots for that campus will appear automatically underneath. Submit your name and WhatsApp number and our coordinator will confirm your seat immediately.',
  },
  {
    id: 'faq-scholarships-merit',
    category: 'Fees & Scholarships',
    question: 'What merit scholarships and fee discounts are available for 2026–2028 intakes?',
    answer:
      'UK partner universities routinely grant automatic £1,500–£5,000 merit bursaries for strong GPAs; Germany offers €0 public university tuition; Italy provides up to 100% DSU fee waivers plus accommodation/stipend; and SM Usman’s Academy currently offers the PTE Online Mega Offer at Rs. 20,000/- (60% off Rs. 50,000/-).',
  },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  updatedAt: '2026-11-24T00:00:00.000Z',
  socialLinks: {
    facebookUrl: 'https://www.facebook.com/ielts.preparation.karachi/',
    instagramUrl: 'https://www.instagram.com/smusmanacademy',
    youtubeChannelUrl: 'https://www.youtube.com/@smusmanacademy',
    youtubeShortsUrl: 'https://www.youtube.com/@smusmanacademy/shorts',
    whatsappDisplay: '+92 332 3502864',
    whatsappNumber: '923323502864',
    helplinePhone: '+92 313 0240636',
    leadEmail: '88smusman@gmail.com',
  },
  megaOffer: {
    enabled: true,
    ribbonText:
      'PTE Online Classes: Rs. 20,000/- (instead of Rs. 50,000) · Mon/Wed/Fri 11 PM–12 AM · Free Demo Today',
    badge: 'Limited Time Offer · 60% OFF',
    title: 'PTE Online Classes — Mega Offer',
    duration: '1 Month (12 Classes)',
    classDuration: '1 Hour / Class',
    frequency: '3 Days / Week (Mon, Wed, Fri)',
    timings: '11:00 PM – 12:00 AM',
    originalFee: 'Rs. 50,000/-',
    discountedFee: 'Rs. 20,000/-',
    imageUrl: '/assets/aistudio/image_918287d6.png',
    inclusions: [
      'Updated Templates & Scoring Tips',
      'Personalized 1-on-1 Feedback',
      'Test Center-Based Mock Test',
      'Recorded Sessions Access',
      '24/7 WhatsApp Assistance',
    ],
  },
  customOffers: [],
  campusSchedules: DEFAULT_CAMPUS_SCHEDULES,
  campusLocations: DEFAULT_CAMPUS_LOCATIONS,
  demoSchedule: {
    campuses: DEFAULT_CAMPUS_SCHEDULES.map((c) => c.campusName),
    shahrahDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
    timingSlots: [
      '12:00 PM – 1:30 PM',
      '3:00 PM – 4:30 PM',
      '4:30 PM – 6:00 PM',
      '6:30 PM – 8:00 PM',
      '11:00 PM – 12:00 AM (PTE Online)',
    ],
  },
  awardsAndPictures: {
    academyLogoUrl: '/src/assets/images/smu_consultants_logo_1795521921070.jpg',
    sirUsmanPortraitUrl: '/assets/smusman/sir_usman_teacher.jpg',
    britishCouncilAwardUrl: '/assets/smusman/british_council_award.jpg',
    pearsonTrophyUrl: '/assets/aistudio/image_3c3abb30.png',
    pearsonStageUrl: '/assets/aistudio/image_d103f58a.png',
    pearsonCertificateUrl: '/assets/aistudio/image_1e23e0c5.png',
    pteScorecardsUrl: '/assets/aistudio/image_918287d6.png',
    academyPosterUrl: '/assets/aistudio/images__1__019fbafc.jfif',
    heroStudentUrl: '/src/assets/images/hero_student_portrait_1795499585372.jpg',
    counsellorAdvisingUrl: '/src/assets/images/counsellor_advising_1795499585062.jpg',
    heroCampusUrl: '/src/assets/images/hero_campus_students_1795499238123.jpg',
    bannerTestPrepUrl: '/src/assets/images/banner_test_preparation_1795505668291.jpg',
    bannerStudyConsultancyUrl: '/src/assets/images/banner_study_consultancy_1795505668360.jpg',
    bannerOfficialExamUrl: '/src/assets/images/banner_official_exam_booking_1795505669387.jpg',
    bannerFreeDemoUrl: '/src/assets/images/banner_free_demo_class_1795505669232.jpg',
  },
  studentTestimonialVideos: [
    {
      id: 'testi-band8',
      videoId: 'Ha9ALk_Bg7c',
      category: 'testimonial',
      badge: 'Band 8.0 Student Review',
      title: 'IELTS Candidate Sharing Her Band 8.0 Experience',
      summary:
        'Hear directly from a Band 8.0 IELTS achiever trained under Sir SM Usman in Karachi on mock scoring and Speaking feedback.',
      viewsLabel: '1.4K+ views',
      youtubeUrl: 'https://youtube.com/shorts/Ha9ALk_Bg7c',
      segment: 'ielts',
      visibleOnPages: ['home', 'test-ielts', 'guides'],
    },
    {
      id: 'testi-karachi-32k',
      videoId: '07n-N-nXTbw',
      category: 'testimonial',
      badge: 'Student Success Story',
      title: 'Highly Satisfied IELTS Candidate Sharing Her Experience',
      summary:
        'On-campus student testimonial covering daily Writing correction, Listening drills, and British Council exam confidence.',
      viewsLabel: '32K+ views',
      youtubeUrl: 'https://youtube.com/shorts/07n-N-nXTbw',
      segment: 'ielts',
      visibleOnPages: ['test-ielts', 'guides'],
    },
    {
      id: 'testi-band7-plus',
      videoId: 'X811QMH_1Ug',
      category: 'testimonial',
      badge: 'Band 7.0+ Achiever',
      title: 'IELTS Preparation in Karachi — Band 7 & Above Review',
      summary:
        'Candidate story highlighting structured Speaking & Reading score progression from SM Usman’s Academy.',
      viewsLabel: '1.3K+ views',
      youtubeUrl: 'https://youtube.com/shorts/X811QMH_1Ug',
      segment: 'ielts',
      visibleOnPages: ['test-ielts', 'guides'],
    },
  ],
  sirUsmanShorts: [
    {
      id: 'sir-ai-examiner',
      videoId: 'UXq-Jao8GK8',
      category: 'sir-usman',
      badge: 'IELTS Exam Update',
      title: 'IELTS Speaking & Writing: Checked by AI or Human Examiners?',
      summary:
        'Sir SM Usman explains official IELTS marking standards and what Pakistani test-takers must prepare for in 2026–2028.',
      viewsLabel: '@smusmanacademy',
      youtubeUrl: 'https://youtube.com/shorts/UXq-Jao8GK8',
      segment: 'ielts',
      visibleOnPages: ['home', 'test-ielts', 'guides'],
    },
    {
      id: 'sir-reading-headings',
      videoId: 'NRGysrh0NSU',
      category: 'sir-usman',
      badge: 'Reading Strategy',
      title: 'IELTS Reading List of Headings — Best Tips & Tricks',
      summary:
        'Practical elimination method taught by Sir SM Usman to solve Academic Reading paragraph headings accurately.',
      viewsLabel: '626+ views',
      youtubeUrl: 'https://youtube.com/shorts/NRGysrh0NSU',
      segment: 'ielts',
      visibleOnPages: ['test-ielts', 'guides'],
    },
    {
      id: 'sir-writing-tip',
      videoId: 'jEvz5YIoTA8',
      category: 'sir-usman',
      badge: 'Writing Task Tip',
      title: 'Important IELTS Writing Score Tip by Sir SM Usman',
      summary:
        'Avoid the common Task 2 cohesion and lexical errors that hold back candidates between Band 6.5 and 7.5+.',
      viewsLabel: '713+ views',
      youtubeUrl: 'https://youtube.com/shorts/jEvz5YIoTA8',
      segment: 'ielts',
      visibleOnPages: ['test-ielts', 'guides'],
    },
    {
      id: 'sir-pte-meetup',
      videoId: 'VbbCxkA-sEo',
      category: 'sir-usman',
      badge: 'Pearson PTE Meet-up',
      title: 'Pearson PTE Annual Meet-up 2026 in Lahore, Pakistan',
      summary:
        'Official Pearson PTE updates and partner insights shared by SM Usman’s Academy leadership.',
      viewsLabel: '@smusmanacademy',
      youtubeUrl: 'https://youtube.com/shorts/VbbCxkA-sEo',
      segment: 'pte',
      visibleOnPages: ['home', 'test-pte', 'guides'],
    },
    {
      id: 'sir-ttt-certified',
      videoId: '-s-NOw9OLKw',
      category: 'sir-usman',
      badge: 'British Council TTT',
      title: 'IELTS Coaching with British Council TTT Certified Instructor',
      summary:
        'Explore small-group and 1-on-1 training across Gulshan, Shahrah-e-Faisal, Nazimabad, and live online batches.',
      viewsLabel: '1.6K+ views',
      youtubeUrl: 'https://youtube.com/shorts/-s-NOw9OLKw',
      segment: 'ielts',
      visibleOnPages: ['test-ielts', 'guides'],
    },
    {
      id: 'sir-multi-tests',
      videoId: 'qd_OaBKI_ck',
      category: 'sir-usman',
      badge: 'IELTS · PTE · Duolingo',
      title: 'IELTS, PTE & Duolingo Preparation with Sir SM Usman',
      summary:
        'Pick the right English test for UK, Germany, Italy, or Cyprus admissions and book a free demo session.',
      viewsLabel: '@smusmanacademy',
      youtubeUrl: 'https://youtube.com/shorts/qd_OaBKI_ck',
      segment: 'duolingo',
      visibleOnPages: ['home', 'test-ielts', 'test-pte', 'test-duolingo', 'guides'],
    },
  ],
  textTestimonials: [
    {
      id: 'cyc-pte-90',
      studentName: 'Shahbaz · Nabeel · Rida · Tasneem',
      scoreAchieved: 'PTE 89 – 90 / 90',
      testOrTrack: 'Pearson PTE Academic · Rising Star Academy',
      destinationOrCampus: 'Karachi & Live Online Batch',
      intakeLabel: 'Verified Pearson Scorecards',
      outcomeTag: '90/90 Overall PTE Scores · UK & Global Study Ready',
      quote:
        'With Sir SM Usman’s updated PTE templates, test center-based mock simulations, and 1-on-1 feedback, our candidates achieved 89 and 90 out of 90 across Speaking, Listening, Reading, and Writing.',
      image: '/assets/aistudio/image_918287d6.png',
      segment: 'pte',
      visibleOnPages: ['home', 'test-pte', 'guides'],
    },
    {
      id: 'cyc-osama',
      studentName: 'Osama Bin Tariq',
      scoreAchieved: 'IELTS Band 8.0',
      testOrTrack: 'IELTS Academic · Verified TRF',
      destinationOrCampus: 'Gulshan-e-Iqbal Campus, Karachi',
      intakeLabel: '2026 Intake Achiever',
      outcomeTag: 'Top Band 8.0 Score · UK MSc Shortlist',
      quote:
        'Daily Speaking mock sessions and line-by-line Writing Task 2 feedback with Sir SM Usman pushed my score from a 6.5 baseline straight to an official Band 8.0.',
      image: '/assets/smusman/result_band8_osama.jpg',
      segment: 'ielts',
      visibleOnPages: ['home', 'test-ielts', 'guides'],
    },
    {
      id: 'cyc-enaarah',
      studentName: 'Enaarah Ali',
      scoreAchieved: 'IELTS Band 8.0',
      testOrTrack: 'IELTS Academic · Verified TRF',
      destinationOrCampus: 'Karachi On-Campus Batch',
      intakeLabel: '2026 Verified Result',
      outcomeTag: 'Band 8.0 Overall · British Council Exam',
      quote:
        'Sir Usman’s Reading elimination strategy and structured cue-card drills removed my exam anxiety completely. I walked into the British Council hall fully prepared.',
      image: '/assets/smusman/result_enaarah.jpg',
      segment: 'ielts',
      visibleOnPages: ['test-ielts', 'guides'],
    },
    {
      id: 'cyc-abdul-rab',
      studentName: 'Abdul Rab',
      scoreAchieved: 'IELTS Band 7.5+',
      testOrTrack: 'Fast-Track IELTS Batch',
      destinationOrCampus: 'Shahrah-e-Faisal & Online',
      intakeLabel: 'Fast-Track Graduate',
      outcomeTag: 'Band 7.5+ Overall · University Admission',
      quote:
        'Within four weeks of intensive Writing clinics and full computer-delivered mocks, I cleared my target university English condition on my very first attempt.',
      image: '/assets/smusman/result_abdul_rab.jpg',
      segment: 'ielts',
      visibleOnPages: ['test-ielts', 'guides'],
    },
    {
      id: 'cyc-hamza',
      studentName: 'Hamza Tariq',
      scoreAchieved: 'Band 7.5 · £2,000 Scholarship',
      testOrTrack: 'MSc Data Science · United Kingdom',
      destinationOrCampus: 'University of Hertfordshire, UK',
      intakeLabel: 'UK Admission & Visa',
      outcomeTag: 'UK Visa Approved in 11 Working Days',
      quote:
        'SMU Consultants handled my IELTS readiness, SOP refinement, and two mock CAS credibility interviews—I secured a £2,000 scholarship and UK visa in 11 days.',
      image: '/src/assets/images/student_story_1_1795499585370.jpg',
      segment: 'consultancy',
      visibleOnPages: ['home', 'guides'],
    },
    {
      id: 'cyc-amina',
      studentName: 'Amina Okafor',
      scoreAchieved: 'IELTS 7.5 · 100% DSU Grant',
      testOrTrack: 'MSc Economics · Italy Track',
      destinationOrCampus: 'University of Bologna, Italy',
      intakeLabel: 'European Scholarship Track',
      outcomeTag: 'Full Regional Tuition Waiver + Housing',
      quote:
        'From CIMEA document verification and Universitaly pre-enrollment to my regional DSU scholarship filing, the advisory team guided every single deadline clearly.',
      image: '/src/assets/images/student_story_2_1795499585959.jpg',
      segment: 'consultancy',
      visibleOnPages: ['guides'],
    },
    {
      id: 'cyc-zainab',
      studentName: 'Zainab Al-Mansoor',
      scoreAchieved: 'IELTS 7.5 · 18-Day Offer',
      testOrTrack: 'MSc Computer Science · Germany',
      destinationOrCampus: 'SRH Berlin University, Germany',
      intakeLabel: 'Germany Study Track',
      outcomeTag: 'First-Attempt German Student Visa',
      quote:
        'I was overwhelmed by Uni-Assist notarization and Sperrkonto rules. SMU Consultants organized my entire file in days and got my German visa approved first try.',
      image: '/src/assets/images/student_story_3_1795499586475.jpg',
      segment: 'consultancy',
      visibleOnPages: ['guides'],
    },
  ],
  resultCards: [
    {
      id: 'res-pte-90-batch',
      studentName: 'Shahbaz (90) · Nabeel (90) · Rida (90) · Tasneem (89)',
      scoreLabel: 'PTE 89 – 90 / 90',
      testType: 'Pearson PTE Academic',
      image: '/assets/aistudio/image_918287d6.png',
      highlight: 'Official Pearson PTE Score Reports · SM Usman’s Academy Achievers',
      segment: 'pte',
      visibleOnPages: ['home', 'test-pte', 'guides'],
    },
    {
      id: 'res-osama',
      studentName: 'Osama Bin Tariq',
      scoreLabel: 'Overall Band 8.0',
      testType: 'IELTS Academic',
      image: '/assets/smusman/result_band8_osama.jpg',
      highlight: 'Verified TRF Result · Top Achiever at SM Usman’s Academy',
      segment: 'ielts',
      visibleOnPages: ['home', 'test-ielts', 'guides'],
    },
    {
      id: 'res-abdul-rab',
      studentName: 'Abdul Rab',
      scoreLabel: 'Band 7.5+ Overall',
      testType: 'IELTS Academic',
      image: '/assets/smusman/result_abdul_rab.jpg',
      highlight: 'Fast-Track Batch Graduate · Verified Official Scorecard',
      segment: 'ielts',
      visibleOnPages: ['test-ielts', 'guides'],
    },
    {
      id: 'res-enaarah',
      studentName: 'Enaarah Ali',
      scoreLabel: 'Band 8.0 Overall',
      testType: 'IELTS Academic',
      image: '/assets/smusman/result_enaarah.jpg',
      highlight: 'Gulshan Campus Student · Verified TRF Certificate',
      segment: 'ielts',
      visibleOnPages: ['test-ielts', 'guides'],
    },
    {
      id: 'res-pearson-trophy',
      studentName: 'Pearson Rising Star Award 2025–2026',
      scoreLabel: 'Partner Excellence Award',
      testType: 'Pearson Test of English',
      image: '/assets/aistudio/image_3c3abb30.png',
      highlight: 'Stronger Together Trophy Awarded to SM Usman’s Academy',
      segment: 'pte',
      visibleOnPages: ['test-pte', 'guides'],
    },
    {
      id: 'res-student-1',
      studentName: 'SMU High Achiever 01',
      scoreLabel: 'Band 7.5 – 8.0',
      testType: 'IELTS Academic / UKVI',
      image: '/assets/smusman/result_student_1.jpg',
      highlight: 'Verified British Council / IDP Test Report Form',
      segment: 'ielts',
      visibleOnPages: ['test-ielts', 'guides'],
    },
  ],
  faqs: DEFAULT_FAQS,
};
