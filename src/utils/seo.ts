import { PageRoute } from '../data/consultancyData';

interface RouteSeoMeta {
  title: string;
  description: string;
}

const ROUTE_SEO_META: Record<PageRoute, RouteSeoMeta> = {
  home: {
    title: 'SMU Consultants & SM Usman’s Academy | IELTS & Study Abroad',
    description:
      'Study in UK, Germany, Italy & Cyprus with zero agency fees (2026–2028 intakes). British Council awarded IELTS, PTE, Duolingo, TOEFL & OET coaching in Karachi.',
  },
  destinations: {
    title: 'Study Abroad Destinations: UK, Germany, Italy & Cyprus | SMU',
    description:
      'Compare 2026–2028 tuition, scholarships, blocked accounts, and post-study work visas across the UK, Germany, Italy, and Cyprus with SMU Consultants.',
  },
  services: {
    title: 'IELTS, PTE, Duolingo, TOEFL & OET Coaching | SM Usman’s Academy',
    description:
      'British Council awarded English test preparation and end-to-end university admissions services across Gulshan, Shahrah-e-Faisal, Nazimabad, and online.',
  },
  'book-exam': {
    title: 'Book Official IELTS, PTE, Duolingo, TOEFL & OET Exam | SMU',
    description:
      'Register your official British Council IELTS, IDP IELTS, PTE Academic, Duolingo DET, TOEFL iBT, or OET exam seat (2026–2028) with free mock diagnostics.',
  },
  about: {
    title: 'About SMU Consultants & Karachi Campuses | Est. 2007',
    description:
      'Visit SM Usman’s Academy in Gulshan-e-Iqbal, Shahrah-e-Faisal, and Nazimabad. Over 17 years of British Council recognized test prep and 98.4% visa guidance.',
  },
  guides: {
    title: 'Student IELTS Results, Reviews & Visa Guides | SMU Consultants',
    description:
      'Inspect verified Band 8.0+ IELTS TRF scorecards, student visa success stories, and practical 2026–2028 study abroad preparation checklists.',
  },
  apply: {
    title: 'Free Eligibility Check & 2026–2028 University Shortlist | SMU',
    description:
      'Submit your profile for a free 48-hour university shortlist across UK, Germany, Italy & Cyprus or book a demo session for IELTS, PTE, Duolingo, or OET.',
  },
  admin: {
    title: 'Admin CMS & Leads Portal | SMU Consultants & SM Usman’s Academy',
    description:
      'Manage leads, social media links, testimonial videos, PTE mega offers, timing slots, and academy awards & pictures.',
  },
  'test-ielts': {
    title: 'IELTS Preparation Karachi & Online (Academic, UKVI, GT) | SMU',
    description:
      'Score Band 7.0–8.5 in IELTS Academic, General Training, UKVI & Life Skills with Sir SM Usman and British Council trained instructors. Book your free demo.',
  },
  'test-pte': {
    title: 'PTE Academic & PTE Core Coaching Karachi | SM Usman’s Academy',
    description:
      'Achieve 65–79+ in PTE Academic with AI-aligned speaking, Repeat Sentence, Describe Image & scored computer lab mocks across 3 Karachi campuses.',
  },
  'test-duolingo': {
    title: 'Duolingo English Test (DET) Fast-Track Prep | SM Usman’s Academy',
    description:
      'Score 115–135+ in 2–4 weeks with adaptive Duolingo DET mock drills, proctoring room compliance checks, and fast-track UK & European admissions.',
  },
  'test-toefl': {
    title: 'TOEFL iBT Preparation Karachi & Online | SM Usman’s Academy',
    description:
      'Target 95–110+ on TOEFL iBT with structured lecture note-taking, integrated speaking synthesis, and Academic Discussion coaching in Karachi.',
  },
  'test-oet': {
    title: 'OET Coaching for Doctors, Nurses & Pharmacists | SMU Karachi',
    description:
      'Achieve Grade B in OET Medicine, Nursing & Pharmacy with daily medical referral letter reviews and clinical patient role-play coaching.',
  },
  'test-english': {
    title: 'Spoken English & Grammar Foundation Course | SM Usman’s Academy',
    description:
      'Build spoken fluency, grammar confidence, pronunciation, and CAS/visa interview readiness across Gulshan, Shahrah-e-Faisal, Nazimabad, and online.',
  },
};

function upsertMeta(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applySeoForPage(page: PageRoute) {
  const meta = ROUTE_SEO_META[page] ?? ROUTE_SEO_META.home;
  document.title = meta.title;

  upsertMeta('meta[name="description"]', 'name', 'description', meta.description);
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);

  const canonicalUrl = `${window.location.origin}${window.location.pathname}${
    page === 'home' ? '' : `#${page}`
  }`;
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

  let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;
}
