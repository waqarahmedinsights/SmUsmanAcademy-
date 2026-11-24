export type CountryKey = 'uk' | 'germany' | 'italy' | 'cyprus';

export interface DestinationProfile {
  id: CountryKey;
  name: string;
  shortLabel: string;
  tagline: string;
  summary: string;
  image: string;
  imageAlt: string;
  tuitionRange: string;
  livingEstimate: string;
  postStudyWork: string;
  intakes: string;
  visaRoute: string;
  languageRequirement: string;
  partnerUniversities: string[];
  popularFields: string[];
  highlights: string[];
}

export interface JourneyStep {
  number: string;
  title: string;
  turnaround: string;
  description: string;
  deliverable: string;
}

export interface ProgramEntry {
  id: string;
  title: string;
  country: CountryKey;
  countryName: string;
  university: string;
  level: 'Foundation' | 'Undergraduate' | 'Postgraduate';
  discipline: 'Business & Finance' | 'Computer Science & AI' | 'Engineering' | 'Healthcare & Sciences';
  duration: string;
  tuitionAnnual: string;
  intake: string;
  englishReq: string;
}

export interface StudentStory {
  id: string;
  studentName: string;
  originCity: string;
  university: string;
  countryName: string;
  degree: string;
  intakeYear: string;
  portrait: string;
  beforeSummary: string;
  outcomeSummary: string;
  advisorNote: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  category: string;
  answer: string;
}

export interface StudyGuide {
  id: string;
  title: string;
  category: string;
  readTime: string;
  updatedLabel: string;
  excerpt: string;
  sections: { heading: string; body: string }[];
  checklist: string[];
}

export const HERO_IMAGE = '/src/assets/images/hero_campus_students_1795499238123.jpg';
export const HERO_STUDENT_PORTRAIT = '/src/assets/images/hero_student_portrait_1795499585372.jpg';
export const COUNSELLOR_ADVISING_IMAGE = '/src/assets/images/counsellor_advising_1795499585062.jpg';

export const PARTNER_UNIVERSITIES_STRIP = [
  'University of Bologna',
  'University of Hertfordshire',
  'SRH Berlin University',
  'Sapienza University of Rome',
  'Coventry University',
  'Politecnico di Torino',
  'University of Nicosia',
  'UCLan Cyprus',
];

export const TRUST_METRICS = [
  {
    value: '120+',
    label: 'Partner Universities',
    detail: 'Direct admissions desks across UK & Europe',
  },
  {
    value: '98.4%',
    label: 'Visa Approval Rate',
    detail: 'Pre-submission compliance & interview checks',
  },
  {
    value: '48 Hours',
    label: 'Shortlist Delivery',
    detail: '5 matched university options after profiling',
  },
  {
    value: '£0 Fee',
    label: 'Student Counselling',
    detail: 'Transparent admissions with zero agency markup',
  },
];

export const DESTINATIONS: DestinationProfile[] = [
  {
    id: 'uk',
    name: 'United Kingdom',
    shortLabel: 'United Kingdom',
    tagline: '1-Year Master’s Degrees & Post-Study Graduate Route',
    summary:
      'Access globally ranked British institutions with fast-track one-year Master’s programmes, January and September intakes, and full Graduate Route work eligibility after completion.',
    image: '/src/assets/images/dest_united_kingdom_1795499238196.jpg',
    imageAlt: 'Historic sandstone British university quadrangle and library courtyard in daylight',
    tuitionRange: '£13,500 – £21,000 / yr',
    livingEstimate: '£1,023 – £1,334 / mo',
    postStudyWork: '2-Year Graduate Visa',
    intakes: 'Jan · May · Sep',
    visaRoute: 'UK Student Route (CAS & Credibility Interview)',
    languageRequirement: 'IELTS 6.0–6.5 or MOI Waiver (eligible boards)',
    partnerUniversities: [
      'University of Hertfordshire',
      'University of East London',
      'Coventry University',
      'University of Greenwich',
      'York St John University',
      'Ulster University',
    ],
    popularFields: ['MSc Data Science', 'MBA & Global Finance', 'Cyber Security', 'Public Health'],
    highlights: [
      'CAS interview mock coaching with compliance officers',
      'Merit scholarships between £1,500 and £4,000',
      'Pre-vetted student accommodation near campus',
    ],
  },
  {
    id: 'germany',
    name: 'Germany',
    shortLabel: 'Germany',
    tagline: 'Low-to-Zero Tuition Public & Applied Sciences Universities',
    summary:
      'Build an engineering, technology, or management career in Europe’s largest economy. We handle Uni-Assist filings, APS verification readiness, and blocked account setup from day one.',
    image: '/src/assets/images/dest_germany_1795499240047.jpg',
    imageAlt: 'Modern German engineering university glass atrium with timber walkways',
    tuitionRange: '€0 – €12,500 / yr',
    livingEstimate: '€992 / mo (Blocked Account)',
    postStudyWork: '18-Month Job Seeker Permit',
    intakes: 'Apr (Summer) · Oct (Winter)',
    visaRoute: 'German National Study Visa (Sperrkonto)',
    languageRequirement: 'IELTS 6.0+ (English tracks) or TestDaF / Goethe B2',
    partnerUniversities: [
      'SRH Berlin University of Applied Sciences',
      'IU International University',
      'Constructor University Bremen',
      'GISMA University of Applied Sciences',
      'EU Business School Munich',
      'Arden University Berlin',
    ],
    popularFields: ['Automotive Engineering', 'Artificial Intelligence', 'Supply Chain', 'Renewable Energy'],
    highlights: [
      'Full Uni-Assist & public university dossier preparation',
      'Blocked account & statutory health insurance guidance',
      'Up to 140 full days / 280 half days student work allowance',
    ],
  },
  {
    id: 'italy',
    name: 'Italy',
    shortLabel: 'Italy',
    tagline: 'Regional DSU Scholarships & Heritage Research Campuses',
    summary:
      'Study English-taught degrees in Rome, Milan, Bologna, and Turin with access to need-based DSU regional grants that cover tuition waivers, housing, and meal stipends.',
    image: '/src/assets/images/dest_italy_1795499239746.jpg',
    imageAlt: 'Sunlit Italian university colonnade and terracotta courtyard arches',
    tuitionRange: '€1,200 – €4,800 / yr',
    livingEstimate: '€700 – €950 / mo',
    postStudyWork: '12-Month Post-Study Permit',
    intakes: 'Sep / Oct Main Intake',
    visaRoute: 'Italian Type-D National Visa & Universitaly Pre-Enrollment',
    languageRequirement: 'IELTS 5.5–6.0 or Medium of Instruction letter',
    partnerUniversities: [
      'Sapienza University of Rome',
      'University of Bologna',
      'Politecnico di Torino',
      'University of Padua',
      'University of Milan',
      'LUISS Guido Carli',
    ],
    popularFields: ['Architecture & Design', 'Economics & Management', 'Biotechnology', 'Computer Engineering'],
    highlights: [
      'Universitaly portal & CIMEA comparability filing',
      'DSU regional scholarship & ISEE parificato paperwork',
      'Declaration of Value (DOV) embassy booking checklist',
    ],
  },
  {
    id: 'cyprus',
    name: 'Cyprus',
    shortLabel: 'Cyprus',
    tagline: 'Fast-Track EU Campus Admissions & Flexible Tuition Plans',
    summary:
      'An accessible English-medium Mediterranean higher education hub offering rolling admissions, straightforward visa approval timelines, and generous tuition installment options.',
    image: '/src/assets/images/dest_cyprus_1795499239818.jpg',
    imageAlt: 'Mediterranean international university campus in Cyprus with limestone walkways',
    tuitionRange: '€3,400 – €7,800 / yr',
    livingEstimate: '€550 – €750 / mo',
    postStudyWork: 'EU Career & Internship Pathways',
    intakes: 'Feb · Jun · Oct',
    visaRoute: 'Cyprus Entry Permit & Temporary Residence Registration',
    languageRequirement: 'IELTS 5.5+ or Internal University Placement Test',
    partnerUniversities: [
      'University of Nicosia',
      'European University Cyprus',
      'Frederick University',
      'University of Limassol',
      'Neapolis University Pafos',
      'UCLan Cyprus',
    ],
    popularFields: ['Hospitality & Tourism', 'Business Administration', 'Medicine & Nursing', 'Maritime Studies'],
    highlights: [
      'Rapid offer turnaround within 5 to 7 working days',
      'Up to 50% academic merit tuition waivers',
      'Direct airport pickup & on-campus residence allocation',
    ],
  },
];

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    number: '01',
    title: 'Free Academic & Budget Profiling',
    turnaround: '60-Minute Session',
    description:
      'Meet with an SMU Consultants advisor via video or in person. We audit your transcripts, English proficiency, study gaps, and total annual budget across UK, Germany, Italy, and Cyprus.',
    deliverable: 'Eligibility matrix & country cost comparison',
  },
  {
    number: '02',
    title: '48-Hour University Shortlist',
    turnaround: 'Within 2 Business Days',
    description:
      'Receive five curated degree programmes aligned with your academic background, scholarship eligibility, and post-study career goals—complete with exact entry criteria and deadlines.',
    deliverable: '5-university admission & scholarship roadmap',
  },
  {
    number: '03',
    title: 'Direct Admissions & SOP Editing',
    turnaround: '5–14 Days Offer Cycle',
    description:
      'We assemble your Statement of Purpose, CV, reference letters, and portal submissions (UCAS, Uni-Assist, Universitaly, or direct partner desks) so zero technical errors delay your offer.',
    deliverable: 'Conditional or unconditional offer letters',
  },
  {
    number: '04',
    title: 'Visa Compliance & Mock Interviews',
    turnaround: 'Pre-Filing Audit',
    description:
      'Dedicated compliance officers review bank statements, blocked accounts, CAS / DOV files, and conduct 1-on-1 mock credibility interviews to maximize approval confidence.',
    deliverable: 'Verified visa dossier & interview clearance',
  },
  {
    number: '05',
    title: 'Pre-Departure & Vetted Housing',
    turnaround: 'Before Arrival',
    description:
      'From booking verified purpose-built student accommodation near campus to arranging airport transfers, SIM cards, and arrival registration, we stay connected until you settle in.',
    deliverable: 'Confirmed accommodation & arrival briefing',
  },
];

export const PROGRAMS_CATALOG: ProgramEntry[] = [
  {
    id: 'uk-msc-ds',
    title: 'MSc Data Science & Analytics',
    country: 'uk',
    countryName: 'United Kingdom',
    university: 'University of Hertfordshire',
    level: 'Postgraduate',
    discipline: 'Computer Science & AI',
    duration: '12 Months',
    tuitionAnnual: '£16,450 / yr',
    intake: 'Sep / Jan',
    englishReq: 'IELTS 6.5 (no band < 5.5)',
  },
  {
    id: 'uk-mba-gf',
    title: 'MBA Global Business & Finance',
    country: 'uk',
    countryName: 'United Kingdom',
    university: 'Coventry University London',
    level: 'Postgraduate',
    discipline: 'Business & Finance',
    duration: '12 Months',
    tuitionAnnual: '£18,600 / yr',
    intake: 'Sep / Jan / May',
    englishReq: 'IELTS 6.5 or MOI Eligible',
  },
  {
    id: 'uk-bsc-cs',
    title: 'BSc (Hons) Computer Science',
    country: 'uk',
    countryName: 'United Kingdom',
    university: 'University of Greenwich',
    level: 'Undergraduate',
    discipline: 'Computer Science & AI',
    duration: '36 Months',
    tuitionAnnual: '£17,000 / yr',
    intake: 'Sep / Jan',
    englishReq: 'IELTS 6.0 (min 5.5)',
  },
  {
    id: 'uk-fdn-bus',
    title: 'International Foundation in Business',
    country: 'uk',
    countryName: 'United Kingdom',
    university: 'University of East London',
    level: 'Foundation',
    discipline: 'Business & Finance',
    duration: '9 Months',
    tuitionAnnual: '£13,900 / yr',
    intake: 'Sep / Jan',
    englishReq: 'IELTS 5.5 (min 5.5)',
  },
  {
    id: 'de-msc-ai',
    title: 'MSc Applied Artificial Intelligence',
    country: 'germany',
    countryName: 'Germany',
    university: 'SRH Berlin University',
    level: 'Postgraduate',
    discipline: 'Computer Science & AI',
    duration: '24 Months',
    tuitionAnnual: '€10,200 / yr',
    intake: 'Oct / Apr',
    englishReq: 'IELTS 6.5 / TOEFL 87',
  },
  {
    id: 'de-beng-auto',
    title: 'BEng Mechanical & Mobility Systems',
    country: 'germany',
    countryName: 'Germany',
    university: 'Public Partner Track (Uni-Assist)',
    level: 'Undergraduate',
    discipline: 'Engineering',
    duration: '36 Months',
    tuitionAnnual: '€0 Tuition (€320/sem fee)',
    intake: 'Oct (Winter)',
    englishReq: 'IELTS 6.0 / German B2',
  },
  {
    id: 'de-msc-eng',
    title: 'MSc Sustainable Energy Engineering',
    country: 'germany',
    countryName: 'Germany',
    university: 'Public Technical University Track',
    level: 'Postgraduate',
    discipline: 'Engineering',
    duration: '24 Months',
    tuitionAnnual: '€0 Tuition (€350/sem fee)',
    intake: 'Oct / Apr',
    englishReq: 'IELTS 6.5',
  },
  {
    id: 'de-mba-scm',
    title: 'MSc International Supply Chain',
    country: 'germany',
    countryName: 'Germany',
    university: 'GISMA Potsdam Campus',
    level: 'Postgraduate',
    discipline: 'Business & Finance',
    duration: '12–24 Months',
    tuitionAnnual: '€11,500 / yr',
    intake: 'Oct / Jan / Apr',
    englishReq: 'IELTS 6.0',
  },
  {
    id: 'it-msc-econ',
    title: 'MSc Economics & Data Analytics',
    country: 'italy',
    countryName: 'Italy',
    university: 'University of Bologna',
    level: 'Postgraduate',
    discipline: 'Business & Finance',
    duration: '24 Months',
    tuitionAnnual: '€2,800 / yr (DSU Waivable)',
    intake: 'Sep',
    englishReq: 'IELTS 6.0 / B2 Certificate',
  },
  {
    id: 'it-bsc-eng',
    title: 'BSc Computer & Automation Engineering',
    country: 'italy',
    countryName: 'Italy',
    university: 'Politecnico di Torino',
    level: 'Undergraduate',
    discipline: 'Engineering',
    duration: '36 Months',
    tuitionAnnual: '€2,600 / yr (Income Graded)',
    intake: 'Sep',
    englishReq: 'IELTS 5.5 + TIL-I Test',
  },
  {
    id: 'it-msc-bio',
    title: 'MSc Medical Biotechnology',
    country: 'italy',
    countryName: 'Italy',
    university: 'Sapienza University of Rome',
    level: 'Postgraduate',
    discipline: 'Healthcare & Sciences',
    duration: '24 Months',
    tuitionAnnual: '€1,500 / yr (DSU Eligible)',
    intake: 'Oct',
    englishReq: 'IELTS 6.0 or MOI',
  },
  {
    id: 'it-fdn-stem',
    title: 'Foundation Year Science & Engineering',
    country: 'italy',
    countryName: 'Italy',
    university: 'University of Padua',
    level: 'Foundation',
    discipline: 'Engineering',
    duration: '9 Months',
    tuitionAnnual: '€4,800 / yr',
    intake: 'Oct',
    englishReq: 'IELTS 5.5',
  },
  {
    id: 'cy-bsc-bus',
    title: 'BBA Business & Digital Marketing',
    country: 'cyprus',
    countryName: 'Cyprus',
    university: 'University of Nicosia',
    level: 'Undergraduate',
    discipline: 'Business & Finance',
    duration: '48 Months',
    tuitionAnnual: '€5,400 / yr (After Waiver)',
    intake: 'Feb / Oct',
    englishReq: 'IELTS 5.5 / Placement Test',
  },
  {
    id: 'cy-msc-cs',
    title: 'MSc Computer Science & Cyber Security',
    country: 'cyprus',
    countryName: 'Cyprus',
    university: 'UCLan Cyprus',
    level: 'Postgraduate',
    discipline: 'Computer Science & AI',
    duration: '12 Months',
    tuitionAnnual: '€7,200 / yr (Dual UK Degree)',
    intake: 'Sep / Jan',
    englishReq: 'IELTS 6.0',
  },
  {
    id: 'cy-bsc-health',
    title: 'BSc Nursing & Healthcare Management',
    country: 'cyprus',
    countryName: 'Cyprus',
    university: 'European University Cyprus',
    level: 'Undergraduate',
    discipline: 'Healthcare & Sciences',
    duration: '48 Months',
    tuitionAnnual: '€6,800 / yr',
    intake: 'Oct / Feb',
    englishReq: 'IELTS 5.5',
  },
  {
    id: 'cy-fdn-gen',
    title: 'English & Academic Foundation Pathway',
    country: 'cyprus',
    countryName: 'Cyprus',
    university: 'Frederick University',
    level: 'Foundation',
    discipline: 'Business & Finance',
    duration: '9 Months',
    tuitionAnnual: '€3,400 / yr',
    intake: 'Feb / Jun / Oct',
    englishReq: 'Internal Diagnostic Test',
  },
];

export const STUDENT_STORIES: StudentStory[] = [
  {
    id: 'story-1',
    studentName: 'Hamza Tariq',
    originCity: 'Lahore',
    university: 'University of Hertfordshire',
    countryName: 'United Kingdom',
    degree: 'MSc Data Science',
    intakeYear: 'September 2025',
    portrait: '/src/assets/images/student_story_1_1795499585370.jpg',
    beforeSummary: 'Concerned about a 2-year work gap and strict UK CAS credibility screening.',
    outcomeSummary: 'Secured an unconditional offer with a £2,000 tuition scholarship and UK Student Visa approval in 11 working days.',
    advisorNote: 'Two mock CAS credibility interviews resolved every financial and course-motivation question before embassy submission.',
  },
  {
    id: 'story-2',
    studentName: 'Amina Okafor',
    originCity: 'Abuja',
    university: 'University of Bologna',
    countryName: 'Italy',
    degree: 'MSc Economics & Management',
    intakeYear: 'October 2025',
    portrait: '/src/assets/images/student_story_2_1795499585959.jpg',
    beforeSummary: 'Needed an affordable European Master’s programme without high private tuition.',
    outcomeSummary: 'Matched with Bologna, guided through Universitaly pre-enrollment, and awarded a full regional DSU fee waiver plus accommodation grant.',
    advisorNote: 'Early CIMEA verification and income-bracket documentation cut four weeks off the embassy backlog.',
  },
  {
    id: 'story-3',
    studentName: 'Zainab Al-Mansoor',
    originCity: 'Karachi',
    university: 'SRH Berlin University',
    countryName: 'Germany',
    degree: 'MSc Computer Science',
    intakeYear: 'Winter 2025',
    portrait: '/src/assets/images/student_story_3_1795499586475.jpg',
    beforeSummary: 'Overwhelmed by German blocked account regulations and Uni-Assist document notarization.',
    outcomeSummary: 'Received admission in 18 days, opened a compliant Sperrkonto in 48 hours, and arrived in Berlin on schedule.',
    advisorNote: 'Structured step-by-step visa checklist ensured first-attempt German National Visa approval.',
  },
];

export const FAQS: FaqEntry[] = [
  {
    id: 'faq-1',
    category: 'Fees & Transparency',
    question: 'Does SMU Consultants charge a counselling or agency processing fee?',
    answer:
      'Academic counselling, university shortlisting, SOP reviews, and partner university admissions are completely free of agency service fees for students. You only pay official third-party costs such as embassy visa fees, university registration deposits where applicable, or national portal charges (e.g., Uni-Assist).',
  },
  {
    id: 'faq-2',
    category: 'United Kingdom',
    question: 'Can I apply to UK universities without an IELTS score?',
    answer:
      'Yes. Several UK partner universities accept an official Medium of Instruction (MOI) letter, WAEC/NECO English grades, or high school English scores (such as 70%+ in CBSE/ISC/HSSC) depending on your country and course level. We verify exact waiver eligibility during your free profiling session.',
  },
  {
    id: 'faq-3',
    category: 'Germany',
    question: 'How much money is required in a German Blocked Account (Sperrkonto)?',
    answer:
      'For standard German student visa filings, applicants must demonstrate €11,904 per year (€992 per month) in an approved blocked account. If you qualify for an official scholarship covering living costs, the blocked amount may be reduced or waived.',
  },
  {
    id: 'faq-4',
    category: 'Italy',
    question: 'How do Italian DSU regional scholarships work for international students?',
    answer:
      'Italian public universities determine tuition and regional DSU grants based on verified family income and asset documentation (ISEE Parificato). Qualifying students frequently receive a 100% tuition fee waiver, subsidized dormitory housing, and an annual living stipend.',
  },
  {
    id: 'faq-5',
    category: 'Cyprus',
    question: 'How fast can I receive an admission offer and visa decision for Cyprus?',
    answer:
      'Offer letters from partnered universities in Cyprus are typically issued within 5 to 7 working days once academic transcripts and passport scans are verified. Entry permit approvals generally take 3 to 5 weeks depending on intake volume.',
  },
];

export const STUDY_GUIDES: StudyGuide[] = [
  {
    id: 'guide-sop',
    title: 'Writing a High-Impact Statement of Purpose (SOP) for UK & Europe',
    category: 'Admissions Strategy',
    readTime: '5 min read',
    updatedLabel: 'Updated 2026',
    excerpt:
      'How admissions tutors and visa officers evaluate academic progression, module alignment, and realistic post-study career plans.',
    sections: [
      {
        heading: '1. Connect Prior Academics to Target Modules',
        body: 'Avoid generic praise about a country or campus city. Reference two or three specific modules from your chosen degree syllabus and explain how your undergraduate coursework or professional experience prepared you for them.',
      },
      {
        heading: '2. Explain Any Study Gaps Plainly',
        body: 'Both UKVI compliance officers and European admissions boards value chronological clarity. Account for every year since your last qualification with employment letters, internships, or certifications.',
      },
      {
        heading: '3. Articulate Return-Home & Career Value',
        body: 'Conclude with concrete roles, target employers or industries, and expected progression after graduation so your academic investment reads as coherent and well-researched.',
      },
    ],
    checklist: [
      'Word count kept between 550 and 800 words unless specified',
      'Exact programme title and university name double-checked',
      'Chronological explanation of any academic gap over 6 months',
      'Zero copied templates or AI-cliché phrasing',
    ],
  },
  {
    id: 'guide-uk-interview',
    title: 'Passing the UK CAS & Student Visa Credibility Interview',
    category: 'Visa Compliance',
    readTime: '6 min read',
    updatedLabel: 'Updated 2026',
    excerpt:
      'Essential questions asked by UK universities and UKVI officers regarding course modules, living budgets, and accommodation.',
    sections: [
      {
        heading: '1. Know Your Course Structure Cold',
        body: 'Interviewers routinely ask why you selected a specific university over cheaper or closer alternatives, and ask you to name core modules, credit structures, and assessment formats.',
      },
      {
        heading: '2. Demonstrate Full Financial Clarity',
        body: 'Be ready to state your exact annual tuition fee, deposit paid, sponsor relationship, and the required UKVI maintenance balance (£1,334/month in London or £1,023/month outside London for up to 9 months).',
      },
      {
        heading: '3. Confirm Realistic Accommodation & Commute Plans',
        body: 'State where you intend to live, expected monthly rent, and daily travel time to campus rather than giving vague answers.',
      },
    ],
    checklist: [
      'Memorized exact tuition fee, deposit, and remaining balance',
      'Reviewed at least 4 core modules on the university webpage',
      'Verified 28-day consecutive bank balance maturity rules',
      'Completed at least one timed mock interview with SMU Consultants',
    ],
  },
  {
    id: 'guide-europe-budget',
    title: 'Comparing Total Study Costs: UK vs. Germany vs. Italy vs. Cyprus',
    category: 'Financial Planning',
    readTime: '4 min read',
    updatedLabel: 'Updated 2026',
    excerpt:
      'A transparent breakdown of tuition benchmarks, blocked accounts, DSU waivers, and part-time work allowances across our four destinations.',
    sections: [
      {
        heading: '1. Total First-Year Outlay Matters More Than Sticker Tuition',
        body: 'While German public universities charge zero tuition, you must fund €11,904 upfront into a Blocked Account. Conversely, a 1-year UK Master’s costs more per year in tuition but allows you to enter the workforce 12 months earlier.',
      },
      {
        heading: '2. Scholarship & Waiver Windows Open Early',
        body: 'Italian DSU regional scholarships and UK merit awards operate on strict early deadlines—often 4 to 6 months before classes begin. Submitting complete transcripts early unlocks the widest funding pool.',
      },
      {
        heading: '3. Part-Time Work Should Supplement, Not Fund, Tuition',
        body: 'All four destinations permit part-time student work during term time, which reliably helps cover groceries and transit, but initial tuition and visa maintenance funds must be secured beforehand.',
      },
    ],
    checklist: [
      'Calculated 12 months of living expenses alongside Year 1 tuition',
      'Checked currency exchange buffer (5–8% recommended)',
      'Mapped scholarship deadlines prior to embassy filing',
      'Confirmed official bank statement or blocked account format',
    ],
  },
];

export type TestPageSlug =
  | 'test-ielts'
  | 'test-pte'
  | 'test-duolingo'
  | 'test-toefl'
  | 'test-oet'
  | 'test-english';

export type PageRoute =
  | 'home'
  | 'destinations'
  | 'services'
  | 'book-exam'
  | 'about'
  | 'guides'
  | 'apply'
  | 'admin'
  | TestPageSlug;

export const WHATSAPP_DISPLAY = '+92 332 3502864';
export const WHATSAPP_WA_NUMBER = '923323502864';
export const LEAD_EMAIL = '88smusman@gmail.com';
export const FACEBOOK_PAGE_URL = 'https://www.facebook.com/ielts.preparation.karachi/';
export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/smusmanacademy';
export const YOUTUBE_CHANNEL_SHORTS_URL = 'https://www.youtube.com/@smusmanacademy/shorts';

export interface CampusLocation {
  id: string;
  name: string;
  role: string;
  address: string;
  landmark: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  googlePlaceQuery: string;
}

export interface JournalEntry {
  id: string;
  issueLabel: string;
  category: string;
  title: string;
  summary: string;
  publishedDate: string;
  readTime: string;
  body: string[];
}

export interface TestPrepCourse {
  id: string;
  name: string;
  shortName: string;
  variants: string;
  formats: string;
  duration: string;
  targetOutcome: string;
  description: string;
  modules: string[];
}

export interface StudentResultCard {
  id: string;
  studentName: string;
  scoreLabel: string;
  testType: string;
  image: string;
  highlight: string;
}

export interface TestPageDetail {
  slug: TestPageSlug;
  shortLabel: string;
  title: string;
  subtitle: string;
  duration: string;
  targetScore: string;
  badgeColorClass: string;
  heroSummary: string;
  bannerImage: string;
  tracks: { name: string; audience: string; details: string }[];
  modules: { skill: string; focus: string }[];
  keyAdvantages: string[];
  batchOptions: string[];
}

export interface OfficialExamOption {
  id: string;
  name: string;
  shortName: string;
  bodyPartner: string;
  badgeColor: string;
  formats: string[];
  cities: string[];
  resultTurnaround: string;
  idRequirement: string;
  supportIncludes: string[];
  testPageSlug: TestPageSlug;
}

export const ACADEMY_POSTER_IMAGE = '/assets/aistudio/images__1__019fbafc.jfif';
export const ACADEMY_LOGO_IMAGE = '/assets/aistudio/images_e090a1db.jfif';
export const BRITISH_COUNCIL_AWARD_IMAGE = '/assets/smusman/british_council_award.jpg';
export const SIR_USMAN_PORTRAIT_IMAGE = '/assets/smusman/sir_usman_teacher.jpg';
export const BANNER_TEST_PREP_IMAGE = '/src/assets/images/banner_test_preparation_1795505668291.jpg';
export const BANNER_STUDY_CONSULTANCY_IMAGE =
  '/src/assets/images/banner_study_consultancy_1795505668360.jpg';
export const BANNER_OFFICIAL_EXAM_IMAGE =
  '/src/assets/images/banner_official_exam_booking_1795505669387.jpg';
export const BANNER_FREE_DEMO_IMAGE =
  '/src/assets/images/banner_free_demo_class_1795505669232.jpg';
export const PTE_SCORECARDS_IMAGE = '/assets/aistudio/image_918287d6.png';
export const PEARSON_CERTIFICATE_IMAGE = '/assets/aistudio/image_1e23e0c5.png';
export const PEARSON_RISING_STAR_TROPHY_IMAGE = '/assets/aistudio/image_3c3abb30.png';
export const PEARSON_RISING_STAR_STAGE_IMAGE = '/assets/aistudio/image_d103f58a.png';

export const PTE_ONLINE_MEGA_OFFER = {
  title: 'PTE Online Classes — Mega Offer',
  badge: 'Limited Time Offer · 60% OFF',
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
};

export const SHAHRAH_E_FAISAL_SCHEDULE = {
  campusName: 'Shahrah-e-Faisal Campus',
  days: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
  timings: [
    '12:00 PM – 1:30 PM',
    '3:00 PM – 4:30 PM',
    '4:30 PM – 6:00 PM',
    '6:30 PM – 8:00 PM',
  ],
};

export const KARACHI_CAMPUSES: CampusLocation[] = [
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
    address: 'Office No. 111, 1st Floor, Marine Faisal Building, PECHS Block 6, Shahrah-e-Faisal, Karachi',
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

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-uk-intake',
    issueLabel: 'Journal Dispatch 01 · Editorial Slot',
    category: 'United Kingdom',
    title: '2026 UK September & January Intake Timeline for Pakistani Applicants',
    summary:
      'Placeholder editorial briefing covering CAS issuance windows, 28-day bank maturity checks, and IELTS/MOI waiver universities.',
    publishedDate: 'November 2026',
    readTime: '4 min read',
    body: [
      'Applications for the main UK intake open 9 to 10 months ahead of course commencement. Submitting transcripts early gives students priority access to merit scholarships ranging between £1,500 and £4,000.',
      'Before your university issues a Confirmation of Acceptance for Studies (CAS), your sponsor bank statement must show the required tuition balance plus 9 months of UKVI living funds maintained consecutively for 28 full days.',
      'SMU Consultants conducts mock CAS credibility interviews at all three Karachi branches prior to visa submission.',
    ],
  },
  {
    id: 'journal-germany-italy',
    issueLabel: 'Journal Dispatch 02 · Editorial Slot',
    category: 'Germany & Italy',
    title: 'Zero-Tuition Germany vs. DSU Scholarship Italy: Choosing Your European Track',
    summary:
      'Placeholder editorial comparison on Blocked Account (€11,904) readiness, APS/Uni-Assist timelines, and Italian DSU regional grants.',
    publishedDate: 'November 2026',
    readTime: '5 min read',
    body: [
      'German public universities charge €0 tuition per year across engineering and data tracks, requiring only modest semester transit contributions and a compliant Blocked Account (€11,904/year).',
      'Italian public universities such as Bologna, Sapienza Rome, and Politecnico di Torino offer English-taught degrees paired with need-based DSU regional grants covering tuition waivers and housing stipends.',
      'Our advisors help students prepare notarized transcripts, CIMEA/DOV documents, and Universitaly filings well ahead of embassy bottlenecks.',
    ],
  },
  {
    id: 'journal-ielts-pte',
    issueLabel: 'Journal Dispatch 03 · Editorial Slot',
    category: 'Test Preparation',
    title: 'IELTS vs. PTE Academic vs. Duolingo: Which Score Matches Your University?',
    summary:
      'Placeholder coaching note from SM Usman’s Academy comparing acceptance rules, prep duration, and fast-track scoring strategies.',
    publishedDate: 'November 2026',
    readTime: '3 min read',
    body: [
      'IELTS Academic remains the universal benchmark accepted by 100% of partner institutions across the UK, Germany, Italy, and Cyprus, as well as UKVI visa routes.',
      'PTE Academic and Duolingo English Test provide rapid digital results within 48 hours and are widely accepted across UK and European partner universities for direct admissions.',
      'Take a free diagnostic test at Gulshan-e-Iqbal, North Nazimabad, or Shahrah-e-Faisal to choose the fastest route to your target score.',
    ],
  },
];

export const TEST_PREP_COURSES: TestPrepCourse[] = [
  {
    id: 'ielts',
    name: 'IELTS Preparation',
    shortName: 'IELTS',
    variants: 'Academic · General Training · UKVI · Life Skills A1',
    formats: 'Regular · Fast Track · Weekend · Online',
    duration: '4 – 8 Weeks',
    targetOutcome: 'Band 7.0 – 8.5 Target Coaching',
    description:
      'Led by Sir SM Usman and British Council trained faculty with daily speaking mock interviews, Writing Task 1 & 2 diagnostics, and official exam booking assistance.',
    modules: [
      'Daily 1-on-1 Speaking Cue Card & Part 3 Mock Interviews',
      'Task 1 & Task 2 Essay Line-by-Line Band Scoring Feedback',
      'Timed Cambridge Listening & Reading Speed Strategies',
    ],
  },
  {
    id: 'pte',
    name: 'PTE Academic',
    shortName: 'PTE Academic',
    variants: 'UKVI & General University Entry',
    formats: 'On-Campus Lab · Live Online · Fast Track',
    duration: '4 – 6 Weeks',
    targetOutcome: '65 – 79+ Score Strategy',
    description:
      'AI-scoring alignment drills for Repeat Sentence, Describe Image, Read Aloud, and Essay templates tailored for UK, Germany, and Cyprus university admissions.',
    modules: [
      'Read Aloud & Repeat Sentence Pronunciation Calibration',
      'Describe Image & Retell Lecture Structured Frameworks',
      'Full Computer-Delivered Scored Mock Tests',
    ],
  },
  {
    id: 'duolingo',
    name: 'Duolingo English Test',
    shortName: 'Duolingo (DET)',
    variants: 'Rapid Digital University Acceptance',
    formats: '2–4 Week Intensive · Online & On-Campus',
    duration: '2 – 4 Weeks',
    targetOutcome: '115 – 135+ Score Prep',
    description:
      'Focused adaptive test practice for fast-track university offers in the UK, Europe, and Cyprus with real-time timed mock evaluations and 48-hour official score readiness.',
    modules: [
      'Interactive Reading & Fill-in-the-Blanks Adaptive Drills',
      'Write About the Photo & Extended Speaking Prompts',
      'Proctored Test-Day Environment & Compliance Setup',
    ],
  },
  {
    id: 'toefl',
    name: 'TOEFL iBT',
    shortName: 'TOEFL iBT',
    variants: 'Academic University & Scholarship Entry',
    formats: 'Regular · Fast Track · Live Online',
    duration: '6 – 8 Weeks',
    targetOutcome: '95 – 110+ Score Target',
    description:
      'Structured academic reading, integrated university lecture note-taking, and timed speaking/writing rubrics for European and global research degrees.',
    modules: [
      'Academic Discussion & Integrated Writing Mastery',
      'Campus Conversation & Lecture Note-Taking Frameworks',
      'Section-by-Section Timed Full Practice Simulations',
    ],
  },
  {
    id: 'oet',
    name: 'OET Healthcare',
    shortName: 'OET',
    variants: 'Doctors · Nurses · Pharmacists · Dentistry',
    formats: 'Healthcare Batches · Weekend · Live Online',
    duration: '6 – 8 Weeks',
    targetOutcome: 'Grade B Readiness',
    description:
      'Specialized clinical communication coaching for doctors, nurses, and allied health professionals covering patient role-play cards and medical referral letters.',
    modules: [
      'Clinical Role-Play Cards (History & Empathy Scoring)',
      'Medical Referral, Discharge & Transfer Letter Writing',
      'Healthcare Consultation Listening & Reading Accuracy',
    ],
  },
];

export const STUDENT_RESULT_GALLERY: StudentResultCard[] = [
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
];

export const TEST_PAGES_DATA: Record<TestPageSlug, TestPageDetail> = {
  'test-ielts': {
    slug: 'test-ielts',
    shortLabel: 'IELTS',
    title: 'IELTS Preparation (Academic, General Training, UKVI & Life Skills)',
    subtitle: 'British Council Highest Volume Contributor Award Winner · Est. 2007',
    duration: '4 – 8 Weeks (Regular, Fast Track & Weekend)',
    targetScore: 'Band 7.0 – 8.5 Target Coaching',
    badgeColorClass: 'bg-[#E31837]',
    bannerImage: '/assets/smusman/british_council_award.jpg',
    heroSummary:
      'Master every question format across Listening, Academic/General Reading, Task 1 & 2 Writing, and 1-on-1 Speaking mock interviews with Sir SM Usman and British Council trained faculty across Karachi and online.',
    tracks: [
      {
        name: 'IELTS Academic',
        audience: 'University Undergraduate & Postgraduate Applicants',
        details:
          'Covers Academic Reading passages, Task 1 charts/maps/processes, formal Task 2 arguments, and structured Part 1–3 Speaking fluency for UK, Germany, Italy, and Cyprus offers.',
      },
      {
        name: 'IELTS General Training',
        audience: 'Skilled Immigration & Work Visa Candidates',
        details:
          'Focused training on formal/semi-formal letter writing, workplace reading accuracy, and CLB 9+ (8777) Band strategies.',
      },
      {
        name: 'IELTS UKVI & Life Skills (A1 / B1)',
        audience: 'UK Spouse, Dependent & Foundation Routes',
        details:
          'SELT-compliant preparation with stress-free speaking & listening partner practice and official British Council / IDP exam desk booking.',
      },
      {
        name: 'One Skill Retake Prep',
        audience: 'Candidates Upgrading a Single Module',
        details:
          'Pinpointed 2-week intensive clinic targeting strictly Writing or Speaking to push your Band 6.0/6.5 up to 7.0+ without repeating the whole test.',
      },
    ],
    modules: [
      {
        skill: 'Listening (40 Questions)',
        focus: 'Distractor trapping, map labelling, multiple-choice elimination, and spelling precision.',
      },
      {
        skill: 'Reading (3 Passages)',
        focus: 'True/False/Not Given logic, skimming & scanning under strict 60-minute pacing.',
      },
      {
        skill: 'Writing (Tasks 1 & 2)',
        focus: 'Daily checked scripts with line-by-line Task Response, Cohesion & Lexical Resource scoring.',
      },
      {
        skill: 'Speaking (Parts 1–3)',
        focus: 'Recorded 1-on-1 mock interviews with examiner feedback on fluency, pronunciation & idioms.',
      },
    ],
    keyAdvantages: [
      'Direct official British Council & IDP exam registration desk',
      'Weekly full-length Computer-Delivered & Paper-Based mock exams',
      'Small interactive batches with Sir SM Usman supervision',
      'Free Speaking & Writing diagnostic before batch enrollment',
    ],
    batchOptions: [
      'Regular Morning (Mon–Fri · 6 Weeks)',
      'Fast-Track Intensive (4 Weeks)',
      'Executive Evening (Mon–Thu · 6 Weeks)',
      'Weekend Batch (Sat–Sun)',
      'Live Interactive Online (Zoom)',
    ],
  },
  'test-pte': {
    slug: 'test-pte',
    shortLabel: 'PTE Academic',
    title: 'PTE Academic & PTE Core Computer-Delivered Training',
    subtitle: 'Pearson Rising Star Award 2025–2026 Winner · Fast 48-Hour Official Results',
    duration: '1 Month Mega Offer (12 Classes) or 4–6 Weeks Lab',
    targetScore: '65 – 90 Score Strategy (Real 89–90/90 Student Results)',
    badgeColorClass: 'bg-[#007FA3]',
    bannerImage: '/assets/aistudio/image_d103f58a.png',
    heroSummary:
      'Designed around Pearson’s automated scoring algorithm with dedicated microphone-pitch calibration, updated templates, test center-based mocks, and class recordings—with our limited-time Rs. 20,000/- Online Mega Offer.',
    tracks: [
      {
        name: 'PTE Online Mega Offer (Rs. 20,000/-)',
        audience: '1 Month · Mon, Wed, Fri · 11:00 PM – 12:00 AM',
        details:
          'Limited-time 60% discount from Rs. 50,000/- to Rs. 20,000/-. Includes 12 live 1-hour classes, updated templates, personalized feedback, test center-based mock test, recordings & 24/7 WhatsApp support.',
      },
      {
        name: 'PTE Academic & Core (On-Campus Karachi)',
        audience: 'Shahrah-e-Faisal (Mon/Tue/Thu/Sat) & Gulshan-e-Iqbal',
        details:
          'Full mastery of Read Aloud, Repeat Sentence, Describe Image, Retell Lecture, Summarize Written Text, and Fill in the Blanks across 12pm–1:30pm, 3pm–4:30pm, 4:30pm–6pm, and 6:30pm–8pm slots.',
      },
    ],
    modules: [
      {
        skill: 'Speaking & Fluency',
        focus: 'Oral fluency, pitch & pause timing for Read Aloud and Repeat Sentence memory.',
      },
      {
        skill: 'Writing & Summaries',
        focus: 'Zero-error spelling, Summarize Written Text one-sentence rules & academic essay clarity.',
      },
      {
        skill: 'Reading Collocations',
        focus: 'Reading & Writing Fill in the Blanks grammar patterns and Re-order Paragraphs.',
      },
      {
        skill: 'Write From Dictation',
        focus: 'High-weightage Write From Dictation & Highlight Incorrect Words speed training.',
      },
    ],
    keyAdvantages: [
      'Pearson Test of English Rising Star Award 2025–2026 recipient',
      'Students scoring 89–90/90 overall across Speaking, Listening & Writing',
      'Test center-based mock tests + class recordings included',
      'Official Pearson PTE test voucher & date booking support',
    ],
    batchOptions: [
      'PTE Online Mega Offer (1 Month · Rs. 20,000/-)',
      'Regular Classroom (4 – 6 Weeks)',
      'Fast-Track Intensive (4 Weeks)',
      'Executive Evening Batch',
      'Weekend Intensive (Sat – Sun)',
      'Live Interactive Online (Zoom)',
    ],
  },
  'test-duolingo': {
    slug: 'test-duolingo',
    shortLabel: 'Duolingo (DET)',
    title: 'Duolingo English Test (DET) Fast-Track Preparation',
    subtitle: 'Take From Home · Accepted Worldwide · Results in 48 Hours',
    duration: '2 – 4 Weeks Intensive',
    targetScore: '115 – 135+ Score Prep',
    badgeColorClass: 'bg-[#58CC02]',
    bannerImage: '/assets/aistudio/images__1__019fbafc.jfif',
    heroSummary:
      'Master Duolingo’s computer-adaptive item types including Interactive Reading, Fill in the Blanks, Listen and Type, and Extended Speaking so you unlock UK & European university offers fast.',
    tracks: [
      {
        name: 'Fast-Track 2-Week Crash Course',
        audience: 'Students Facing Upcoming Intake Deadlines',
        details:
          'Daily adaptive practice tests covering every DET task type plus room-compliance checks to prevent proctoring invalidation.',
      },
      {
        name: '4-Week Foundation + DET',
        audience: 'Students Building Core Vocabulary & Grammar',
        details:
          'Combines intermediate vocabulary expansion, dictation speed, and 5 full simulated DET mock exams.',
      },
    ],
    modules: [
      {
        skill: 'Literacy & Reading',
        focus: 'Complete the Words (C-Test) and Interactive Reading passage navigation.',
      },
      {
        skill: 'Comprehension & Dictation',
        focus: 'Listen and Type accuracy with multi-accent audio replay strategies.',
      },
      {
        skill: 'Production & Writing',
        focus: 'Write About the Photo & Interactive Writing argument depth.',
      },
      {
        skill: 'Speaking Sample',
        focus: 'Speak About the Photo and Read, Then Speak confidence without camera anxiety.',
      },
    ],
    keyAdvantages: [
      'Camera, room-lighting & proctoring rules checklist (zero cancellation risk)',
      'Official test fee payment guidance in Pakistan',
      '48-hour university score submission assistance',
      'Ideal fast alternative accepted by leading UK, Cyprus & European partners',
    ],
    batchOptions: [
      '2-Week Crash Course',
      '4-Week Comprehensive DET',
      '1-on-1 Online Coaching',
    ],
  },
  'test-toefl': {
    slug: 'test-toefl',
    shortLabel: 'TOEFL iBT',
    title: 'TOEFL iBT Academic University & Scholarship Preparation',
    subtitle: 'ETS North American & European Research University Benchmark',
    duration: '6 – 8 Weeks',
    targetScore: '95 – 110+ Score Target',
    badgeColorClass: 'bg-[#003087]',
    bannerImage: '/assets/smusman/result_band8_osama.jpg',
    heroSummary:
      'Comprehensive preparation for ETS TOEFL iBT’s streamlined 2-hour format: Academic Reading, University Lecture Listening, Independent/Integrated Speaking, and Academic Discussion Writing.',
    tracks: [
      {
        name: 'TOEFL iBT Standard Academic',
        audience: 'Bachelor’s, Master’s & PhD / Fulbright Candidates',
        details:
          'Deep focus on multi-speaker campus listening note-taking, integrated lecture-reading synthesis, and Academic Discussion timing.',
      },
      {
        name: 'TOEFL Home Edition Coaching',
        audience: 'Remote Test Takers',
        details:
          'Includes ETS ProctorU setup guidance alongside full timed mock tests.',
      },
    ],
    modules: [
      {
        skill: 'Academic Reading',
        focus: 'Inference, prose summary, and sentence insertion questions under 35-minute pacing.',
      },
      {
        skill: 'Lecture Listening',
        focus: 'Structured Cornell note-taking for professor lectures & academic advising dialogues.',
      },
      {
        skill: 'Integrated Speaking',
        focus: '15-second preparation / 45–60 second response synthesis without hesitation.',
      },
      {
        skill: 'Academic Discussion',
        focus: 'Concise 10-minute online forum contribution & Integrated Writing essay structure.',
      },
    ],
    keyAdvantages: [
      'Tailored for top US, UK & German research university minimums (100+)',
      'Scored speaking and writing rubric reviews every class',
      'Full ETS exam scheduling & profile assistance',
      'Available at Gulshan-e-Iqbal, Shahrah-e-Faisal, Nazimabad & Online',
    ],
    batchOptions: [
      '6-Week Morning / Evening',
      '8-Week Foundation + TOEFL',
      'Weekend & Live Online',
    ],
  },
  'test-oet': {
    slug: 'test-oet',
    shortLabel: 'OET',
    title: 'OET (Occupational English Test) for Doctors, Nurses & Pharmacists',
    subtitle: 'GMC UK, NMC, AHPRA & International Healthcare Licensing',
    duration: '6 – 8 Weeks',
    targetScore: 'Grade B / 350+ Readiness',
    badgeColorClass: 'bg-[#00857C]',
    bannerImage: '/assets/smusman/result_abdul_rab.jpg',
    heroSummary:
      'Specialized healthcare English training built around real clinical case notes, medical referral & discharge letters, and patient consultation role-play cards.',
    tracks: [
      {
        name: 'OET Medicine (Doctors)',
        audience: 'MBBS Graduates Pursuing PLAB / GMC UK',
        details:
          'Clinical letter writing from physician case notes plus empathetic patient consultation role-plays.',
      },
      {
        name: 'OET Nursing & Allied Health',
        audience: 'Nurses, Pharmacists & Dentists',
        details:
          'Ward handover listening, discharge/transfer letters, and clear layperson patient explanations.',
      },
    ],
    modules: [
      {
        skill: 'Medical Writing (45 mins)',
        focus: 'Case-note selection discipline, clinical tone, and referral/discharge letter precision.',
      },
      {
        skill: 'Patient Role-Play Speaking',
        focus: 'Structured empathy, signposting, information gathering & reassurance scoring.',
      },
      {
        skill: 'Healthcare Listening (Parts A–C)',
        focus: 'Consultation history gap-fills, workplace dialogues, and healthcare podcasts.',
      },
      {
        skill: 'Clinical Reading (Parts A–C)',
        focus: 'Rapid Part A medical dosing/guideline lookup and Part B/C policy comprehension.',
      },
    ],
    keyAdvantages: [
      'Profession-specific feedback for Doctors, Nurses & Pharmacists',
      'Daily checked medical referral letters with Grade B criteria checklists',
      'Flexible timings suited for house officers and hospital shift doctors',
      'Complete exam booking guidance at official Karachi centers',
    ],
    batchOptions: [
      'Doctor / Nurse Evening Batch',
      'Weekend Healthcare Intensive',
      '1-on-1 Online OET Mentoring',
    ],
  },
  'test-english': {
    slug: 'test-english',
    shortLabel: 'Spoken English',
    title: 'Spoken English, Grammar Foundation & Business Communication',
    subtitle: 'Build Real Fluency Before IELTS, University Interviews & Global Careers',
    duration: '4 – 12 Weeks (Beginner to Advanced)',
    targetScore: 'CEFR B2 / C1 Spoken Fluency',
    badgeColorClass: 'bg-[#0B2249]',
    bannerImage: '/assets/smusman/result_enaarah.jpg',
    heroSummary:
      'Ideal for students strengthening everyday spoken confidence, pronunciation, academic grammar, and university/embassy interview skills prior to starting IELTS or going abroad.',
    tracks: [
      {
        name: 'Spoken English & Fluency',
        audience: 'Students & Everyday Speakers',
        details:
          'Daily conversation workshops, hesitation removal, pronunciation drills, and practical vocabulary.',
      },
      {
        name: 'Pre-IELTS Grammar Bridge',
        audience: 'Applicants Aiming for Band 7.0+ Later',
        details:
          'Eliminates tense, clause, preposition, and article mistakes before entering our fast-track IELTS cohort.',
      },
      {
        name: 'UKVI / CAS Interview Communication',
        audience: 'Confirmed Offer Holders',
        details:
          'Clear, natural spoken articulation for university credibility and embassy visa interviews.',
      },
    ],
    modules: [
      {
        skill: 'Confidence & Conversation',
        focus: 'Interactive group discussions, role-plays, and presentation speaking daily.',
      },
      {
        skill: 'Functional Grammar',
        focus: 'Practical mastery of tenses, conditionals, passive voice & complex sentences.',
      },
      {
        skill: 'Pronunciation & Accent Clarity',
        focus: 'Word stress, sentence intonation, and clear international English articulation.',
      },
      {
        skill: 'Vocabulary & Writing Clarity',
        focus: 'Professional emails, SOP expression, and academic phrasing.',
      },
    ],
    keyAdvantages: [
      'Friendly zero-judgment classroom atmosphere across all 3 Karachi branches',
      'Level placement diagnostic on day one (Elementary, Intermediate, Upper)',
      'Direct progression pathway into IELTS Band 7.0+ batches',
      'Certificate of Completion from SM Usman’s Academy',
    ],
    batchOptions: [
      'Morning Fluency Batch',
      'Afternoon Student Batch',
      'Executive Evening Communication',
      'Live Online Spoken English',
    ],
  },
};

export const OFFICIAL_EXAM_BOOKING_OPTIONS: OfficialExamOption[] = [
  {
    id: 'ielts-bc',
    name: 'IELTS — British Council Official Registration',
    shortName: 'IELTS (British Council)',
    bodyPartner: 'British Council Authorized Desk',
    badgeColor: 'bg-[#E31837]',
    formats: [
      'Computer-Delivered IELTS (Results in 2–5 Days)',
      'Paper-Based IELTS Academic',
      'Paper-Based IELTS General Training',
      'IELTS for UKVI (SELT)',
      'IELTS Life Skills (A1 / B1)',
    ],
    cities: ['Karachi', 'Lahore', 'Islamabad', 'Multan / Faisalabad'],
    resultTurnaround: '2 – 5 Days (CD-IELTS) · 13 Days (Paper)',
    idRequirement: 'Original Valid Passport Required on Test Day',
    supportIncludes: [
      'Zero hidden service surcharge from SM Usman’s Academy desk',
      'Complimentary Speaking & Writing mock before your exam date',
      'Date selection & official confirmation TRF guidance',
    ],
    testPageSlug: 'test-ielts',
  },
  {
    id: 'ielts-idp',
    name: 'IELTS — IDP Official Registration',
    shortName: 'IELTS (IDP)',
    bodyPartner: 'IDP Education Test Support',
    badgeColor: 'bg-[#B9151B]',
    formats: [
      'IDP Computer-Delivered IELTS',
      'IDP Paper-Based IELTS Academic / General',
      'IELTS UKVI (Academic / General)',
      'IELTS One Skill Retake',
    ],
    cities: ['Karachi', 'Lahore', 'Islamabad'],
    resultTurnaround: '1 – 5 Days (CD-IELTS)',
    idRequirement: 'Original Valid Passport Required',
    supportIncludes: [
      'Priority slot lookup for Gulshan / Clifton / Shahrah-e-Faisal centers',
      'Free Computer-Delivered mock orientation session',
      'Fast e-TRF university score forwarding guidance',
    ],
    testPageSlug: 'test-ielts',
  },
  {
    id: 'pte-academic',
    name: 'PTE Academic / PTE Core Exam Booking',
    shortName: 'PTE Academic',
    bodyPartner: 'Pearson VUE Test Registration',
    badgeColor: 'bg-[#007FA3]',
    formats: [
      'PTE Academic (Global University & Visa)',
      'PTE Academic UKVI (SELT Approved)',
      'PTE Core',
    ],
    cities: ['Karachi (PECHS / Clifton)', 'Lahore', 'Islamabad'],
    resultTurnaround: 'Usually within 48 Hours',
    idRequirement: 'Original Valid Passport Required',
    supportIncludes: [
      'Discounted official PTE voucher verification & seat locking',
      'Headset & microphone lab trial prior to test day',
      'Direct score report transmission to partner universities',
    ],
    testPageSlug: 'test-pte',
  },
  {
    id: 'duolingo-det',
    name: 'Duolingo English Test (DET) Registration',
    shortName: 'Duolingo (DET)',
    bodyPartner: 'At-Home Adaptive Exam Support',
    badgeColor: 'bg-[#58CC02]',
    formats: [
      'Single Official Duolingo English Test',
      '2-Test Bundle Registration',
    ],
    cities: ['Take Online From Home (Pakistan & Worldwide)'],
    resultTurnaround: '48 Hours (Instant Unlimited University Sends)',
    idRequirement: 'Original Valid Passport or Smart CNIC',
    supportIncludes: [
      'Complete room, camera, lighting & browser audit before testing',
      'Card payment & USD checkout assistance at zero hassle',
      'Pre-exam full-length scored DET simulation',
    ],
    testPageSlug: 'test-duolingo',
  },
  {
    id: 'toefl-ibt',
    name: 'TOEFL iBT Exam Scheduling',
    shortName: 'TOEFL iBT',
    bodyPartner: 'ETS Official Test Registration',
    badgeColor: 'bg-[#003087]',
    formats: [
      'TOEFL iBT Test Center Exam',
      'TOEFL iBT Home Edition',
    ],
    cities: ['Karachi', 'Lahore', 'Islamabad', 'Online Home Edition'],
    resultTurnaround: '4 – 8 Days',
    idRequirement: 'Original Valid Passport Required',
    supportIncludes: [
      'ETS profile setup & 4 free university score recipient codes',
      'ProctorU checklist for Home Edition candidates',
      'Pre-test Academic Discussion & Speaking check',
    ],
    testPageSlug: 'test-toefl',
  },
  {
    id: 'oet-healthcare',
    name: 'OET (Occupational English Test) Booking',
    shortName: 'OET Healthcare',
    bodyPartner: 'Doctors · Nurses · Pharmacists · Dentistry',
    badgeColor: 'bg-[#00857C]',
    formats: [
      'OET on Computer (Test Venue)',
      'OET on Paper',
      'OET@Home',
    ],
    cities: ['Karachi', 'Lahore', 'Islamabad'],
    resultTurnaround: '10 – 16 Business Days',
    idRequirement: 'Original Valid Passport Required',
    supportIncludes: [
      'Profession-matched registration (Medicine / Nursing / Pharmacy)',
      'GMC / NMC / AHPRA verification code guidance',
      'Complimentary Role-Play & Referral Letter diagnostic',
    ],
    testPageSlug: 'test-oet',
  },
];

export interface YouTubeVideoItem {
  id: string;
  videoId: string;
  category: 'testimonial' | 'sir-usman';
  badge: string;
  title: string;
  summary: string;
  viewsLabel: string;
  youtubeUrl: string;
}

export const STUDENT_VIDEO_TESTIMONIALS: YouTubeVideoItem[] = [
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
];

export const SIR_USMAN_YOUTUBE_SHORTS: YouTubeVideoItem[] = [
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
];

export interface CyclingStudentTestimonial {
  id: string;
  studentName: string;
  scoreAchieved: string;
  testOrTrack: string;
  destinationOrCampus: string;
  intakeLabel: string;
  outcomeTag: string;
  quote: string;
  image: string;
}

export const CYCLING_STUDENT_TESTIMONIALS: CyclingStudentTestimonial[] = [
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
];




