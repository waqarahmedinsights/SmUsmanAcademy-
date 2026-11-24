import type {
  CyclingStudentTestimonial,
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
  inclusions: string[];
}

export interface DemoScheduleConfig {
  campuses: string[];
  shahrahDays: string[];
  timingSlots: string[];
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
  demoSchedule: DemoScheduleConfig;
  awardsAndPictures: AwardsAndPicturesConfig;
  studentTestimonialVideos: YouTubeVideoItem[];
  sirUsmanShorts: YouTubeVideoItem[];
  textTestimonials: CyclingStudentTestimonial[];
  resultCards: StudentResultCard[];
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
    inclusions: [
      'Updated Templates & Scoring Tips',
      'Personalized 1-on-1 Feedback',
      'Test Center-Based Mock Test',
      'Recorded Sessions Access',
      '24/7 WhatsApp Assistance',
    ],
  },
  demoSchedule: {
    campuses: [
      'Gulshan-e-Iqbal Campus (Head Office)',
      'Shahrah-e-Faisal Campus',
      'North Nazimabad Campus',
      'Live Online Class (Zoom / Meet)',
    ],
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
    academyLogoUrl: '/assets/aistudio/images_e090a1db.jfif',
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
    },
    {
      id: 'res-osama',
      studentName: 'Osama Bin Tariq',
      scoreLabel: 'Overall Band 8.0',
      testType: 'IELTS Academic',
      image: '/assets/smusman/result_band8_osama.jpg',
      highlight: 'Verified TRF Result · Top Achiever at SM Usman’s Academy',
    },
    {
      id: 'res-abdul-rab',
      studentName: 'Abdul Rab',
      scoreLabel: 'Band 7.5+ Overall',
      testType: 'IELTS Academic',
      image: '/assets/smusman/result_abdul_rab.jpg',
      highlight: 'Fast-Track Batch Graduate · Verified Official Scorecard',
    },
    {
      id: 'res-enaarah',
      studentName: 'Enaarah Ali',
      scoreLabel: 'Band 8.0 Overall',
      testType: 'IELTS Academic',
      image: '/assets/smusman/result_enaarah.jpg',
      highlight: 'Gulshan Campus Student · Verified TRF Certificate',
    },
    {
      id: 'res-pearson-trophy',
      studentName: 'Pearson Rising Star Award 2025–2026',
      scoreLabel: 'Partner Excellence Award',
      testType: 'Pearson Test of English',
      image: '/assets/aistudio/image_3c3abb30.png',
      highlight: 'Stronger Together Trophy Awarded to SM Usman’s Academy',
    },
    {
      id: 'res-student-1',
      studentName: 'SMU High Achiever 01',
      scoreLabel: 'Band 7.5 – 8.0',
      testType: 'IELTS Academic / UKVI',
      image: '/assets/smusman/result_student_1.jpg',
      highlight: 'Verified British Council / IDP Test Report Form',
    },
  ],
};
