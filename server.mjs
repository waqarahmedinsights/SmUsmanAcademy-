// server.ts
import express from "express";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// src/data/siteConfigDefaults.ts
var FAQ_TOPIC_OPTIONS = [
  "General",
  "UK",
  "Germany",
  "Italy",
  "Cyprus",
  "IELTS & PTE",
  "Fees & Scholarships"
];
function normalizeFaqCategory(raw, questionText = "") {
  const val = String(raw ?? "").trim();
  if (FAQ_TOPIC_OPTIONS.includes(val)) {
    return val;
  }
  const combined = `${val} ${questionText}`.toLowerCase();
  if (combined.includes("uk") || combined.includes("cas") || combined.includes("britain")) {
    return "UK";
  }
  if (combined.includes("german") || combined.includes("sperrkonto") || combined.includes("uni-assist")) {
    return "Germany";
  }
  if (combined.includes("italy") || combined.includes("dsu") || combined.includes("universitaly")) {
    return "Italy";
  }
  if (combined.includes("cyprus")) {
    return "Cyprus";
  }
  if (combined.includes("ielts") || combined.includes("pte") || combined.includes("duolingo") || combined.includes("demo")) {
    return "IELTS & PTE";
  }
  if (combined.includes("fee") || combined.includes("scholarship") || combined.includes("cost")) {
    return "Fees & Scholarships";
  }
  return "General";
}
function extractYouTubeVideoId(input) {
  const raw = input.trim();
  if (!raw) return "";
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (url.pathname.includes("/shorts/")) {
      const id = url.pathname.split("/shorts/")[1]?.split("/")[0]?.split("?")[0];
      if (id) return id;
    }
    if (url.pathname.includes("/embed/")) {
      const id = url.pathname.split("/embed/")[1]?.split("/")[0]?.split("?")[0];
      if (id) return id;
    }
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      if (id) return id;
    }
    const v = url.searchParams.get("v");
    if (v) return v;
  } catch {
  }
  const match = raw.match(/(?:shorts\/|youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? "";
}
var DEFAULT_CAMPUS_SCHEDULES = [
  {
    id: "campus-gulshan",
    campusName: "Gulshan-e-Iqbal Campus (Head Office)",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timingSlots: [
      "12:00 PM \u2013 1:30 PM",
      "3:00 PM \u2013 4:30 PM",
      "5:00 PM \u2013 6:30 PM",
      "7:00 PM \u2013 8:30 PM"
    ]
  },
  {
    id: "campus-shahrah",
    campusName: "Shahrah-e-Faisal Campus",
    days: ["Monday", "Tuesday", "Thursday", "Saturday"],
    timingSlots: [
      "12:00 PM \u2013 1:30 PM",
      "3:00 PM \u2013 4:30 PM",
      "4:30 PM \u2013 6:00 PM",
      "6:30 PM \u2013 8:00 PM"
    ]
  },
  {
    id: "campus-nazimabad",
    campusName: "North Nazimabad Campus",
    days: ["Monday", "Wednesday", "Friday", "Saturday"],
    timingSlots: [
      "12:00 PM \u2013 1:30 PM",
      "3:30 PM \u2013 5:00 PM",
      "6:00 PM \u2013 7:30 PM"
    ]
  },
  {
    id: "campus-online",
    campusName: "Live Online Class (Zoom / Meet)",
    days: ["Monday", "Wednesday", "Friday"],
    timingSlots: [
      "11:00 PM \u2013 12:00 AM (PTE Online)",
      "8:00 PM \u2013 9:30 PM",
      "4:00 PM \u2013 5:30 PM"
    ]
  }
];
var DEFAULT_CAMPUS_LOCATIONS = [
  {
    id: "gulshan",
    name: "SM Usman's Academy (Gulshan Campus)",
    role: "Head Office \xB7 Admissions & Test Prep",
    address: "Office No. 108, 1st Floor, Gulshan Trade Centre, Block 5, Gulshan-e-Iqbal, Karachi",
    landmark: "Above MCB Bank, near Gulshan Chowrangi",
    hours: "Mon \u2013 Sat \xB7 09:30 \u2013 20:30",
    phone: "+92 332 3502864",
    lat: 24.9235146,
    lng: 67.0919263,
    mapsUrl: "https://maps.app.goo.gl/JQsoVLEGtfYMPYg86",
    googlePlaceQuery: "SM Usman's Academy Gulshan Campus Karachi"
  },
  {
    id: "shahrah",
    name: "SM Usman's Academy (Shahra-E-Faisal)",
    role: "Visa Compliance & Executive Batches",
    address: "Office No. 111, 1st Floor, Marine Faisal Building, PECHS Block 6, Shahrah-e-Faisal, Karachi",
    landmark: "Main Nursery Bus Stop, Above Bank of Punjab",
    hours: "Mon, Tue, Thu, Sat \xB7 12:00 PM \u2013 8:00 PM",
    phone: "+92 313 0240636",
    lat: 24.8585321,
    lng: 67.0601707,
    mapsUrl: "https://maps.app.goo.gl/UEqZqVDhLw27YUwU6",
    googlePlaceQuery: "SM Usman's Academy Shahra-E-Faisal Karachi"
  },
  {
    id: "nazimabad",
    name: "SM Usman's Academy (Nazimabad Campus)",
    role: "Academic Counselling & Coaching",
    address: "Alama Iqbal Town / Nazimabad Campus, Karachi",
    landmark: "Near Jinnah Polytechnic & Main Nazimabad Corridor",
    hours: "Mon \u2013 Sat \xB7 10:00 \u2013 20:00",
    phone: "+92 311 2406781",
    lat: 24.9263839,
    lng: 67.0279388,
    mapsUrl: "https://maps.app.goo.gl/38T9JaKyYiuUkRUR6",
    googlePlaceQuery: "SM Usman's Academy Nazimabad Karachi"
  }
];
var DEFAULT_FAQS = [
  {
    id: "faq-zero-fee",
    category: "General",
    question: "Does SMU Consultants charge any agency or counselling fee for university admissions?",
    answer: "No. Our study abroad counselling, course shortlisting, university application submission, SOP review, and visa filing support for partner institutions in the UK, Germany, Italy, and Cyprus carry zero agency service fee. Students only pay official university application fees (where applicable) and embassy charges directly."
  },
  {
    id: "faq-visa-docs",
    category: "General",
    question: "What documents are required to start my 2026\u20132028 study abroad assessment?",
    answer: "To begin your free eligibility check, bring or send scanned copies of your Matric/O-Level & Inter/A-Level transcripts, Bachelor degree & mark sheets (for Master applicants), valid passport, updated CV, and any existing IELTS/PTE/DET score (or MOI letter). You can submit your details on the Apply page in under 2 minutes."
  },
  {
    id: "faq-uk-gap",
    category: "UK",
    question: "Can I apply to UK universities with a study gap or without IELTS?",
    answer: "Yes. Many UK partner universities accept up to 2\u20135 years of verified work experience or study gap with a strong Statement of Purpose. Depending on your intermediate or bachelor marks (typically 70%+ in English), several universities also accept MOI (Medium of Instruction), PTE Academic, Duolingo English Test (DET), or an internal English test."
  },
  {
    id: "faq-uk-cas-bank",
    category: "UK",
    question: "What is the UK 28-day bank statement rule and CAS credibility interview?",
    answer: "For UK Student Route visas, tuition balance plus 9 months of UKVI living funds must remain untouched in the student or parent bank account for at least 28 consecutive days prior to CAS/visa filing. SMU Consultants conducts mock CAS credibility interviews at all Karachi branches so you clear university screening on the first attempt."
  },
  {
    id: "faq-germany-tuition",
    category: "Germany",
    question: "How does zero-tuition public university admission in Germany work for Pakistani students?",
    answer: "German public universities generally charge \u20AC0 tuition per semester (only a \u20AC150\u2013\u20AC350 semester contribution covering transport). To qualify for the German student visa, students demonstrate financial sustenance via an official Blocked Account (Sperrkonto \u2014 approx. \u20AC11,904/year). We handle Uni-Assist, VPD evaluation, APS/embassy prep, and Blocked Account setup."
  },
  {
    id: "faq-italy-dsu",
    category: "Italy",
    question: "What is the Italy DSU regional scholarship and can it cover living costs?",
    answer: "DSU (Diritto allo Studio Universitario) scholarships in Italy are merit- and income-based regional grants that can provide a 100% university tuition fee waiver, subsidized/free accommodation or meal vouchers, plus an annual cash stipend of \u20AC6,000\u2013\u20AC7,500 depending on the region (such as Lombardy, Emilia-Romagna, Lazio, or Piedmont)."
  },
  {
    id: "faq-cyprus-timeline",
    category: "Cyprus",
    question: "How fast can I get an offer letter and student visa for Cyprus?",
    answer: "Cyprus admissions move very quickly\u2014most accredited colleges and universities issue conditional or unconditional offer letters within 5 to 7 working days. With low initial tuition deposits (\u20AC3,400\u2013\u20AC7,800/year options) and streamlined attestation, it is an ideal option for students seeking fast-track European admissions."
  },
  {
    id: "faq-pte-vs-ielts",
    category: "IELTS & PTE",
    question: "Should I take IELTS Academic, PTE Academic, or Duolingo English Test (DET)?",
    answer: "IELTS Academic/UKVI is universally accepted across UK, Europe, Australia, and Canada. PTE Academic is 100% computer-scored with fast 48-hour results and strong UKVI/Australian/European acceptance\u2014making our Rs. 20,000 PTE Online Mega Offer popular for quick score targets. Duolingo (DET) is ideal for rapid home testing if accepted by your shortlisted university. Join a free diagnostic demo so Sir SM Usman can recommend the fastest score path for you."
  },
  {
    id: "faq-free-demo",
    category: "IELTS & PTE",
    question: "How do I join a free demo class at Gulshan, Shahrah-e-Faisal, Nazimabad, or Online?",
    answer: "Simply choose your preferred Campus / Location in the Free Demo section above\u2014the available class days and timing slots for that campus will appear automatically underneath. Submit your name and WhatsApp number and our coordinator will confirm your seat immediately."
  },
  {
    id: "faq-scholarships-merit",
    category: "Fees & Scholarships",
    question: "What merit scholarships and fee discounts are available for 2026\u20132028 intakes?",
    answer: "UK partner universities routinely grant automatic \xA31,500\u2013\xA35,000 merit bursaries for strong GPAs; Germany offers \u20AC0 public university tuition; Italy provides up to 100% DSU fee waivers plus accommodation/stipend; and SM Usman\u2019s Academy currently offers the PTE Online Mega Offer at Rs. 20,000/- (60% off Rs. 50,000/-)."
  }
];
var DEFAULT_SITE_CONFIG = {
  updatedAt: "2026-11-24T00:00:00.000Z",
  socialLinks: {
    facebookUrl: "https://www.facebook.com/ielts.preparation.karachi/",
    instagramUrl: "https://www.instagram.com/smusmanacademy",
    youtubeChannelUrl: "https://www.youtube.com/@smusmanacademy",
    youtubeShortsUrl: "https://www.youtube.com/@smusmanacademy/shorts",
    whatsappDisplay: "+92 332 3502864",
    whatsappNumber: "923323502864",
    helplinePhone: "+92 313 0240636",
    leadEmail: "88smusman@gmail.com"
  },
  megaOffer: {
    enabled: true,
    ribbonText: "PTE Online Classes: Rs. 20,000/- (instead of Rs. 50,000) \xB7 Mon/Wed/Fri 11 PM\u201312 AM \xB7 Free Demo Today",
    badge: "Limited Time Offer \xB7 60% OFF",
    title: "PTE Online Classes \u2014 Mega Offer",
    duration: "1 Month (12 Classes)",
    classDuration: "1 Hour / Class",
    frequency: "3 Days / Week (Mon, Wed, Fri)",
    timings: "11:00 PM \u2013 12:00 AM",
    originalFee: "Rs. 50,000/-",
    discountedFee: "Rs. 20,000/-",
    imageUrl: "/assets/aistudio/image_918287d6.png",
    inclusions: [
      "Updated Templates & Scoring Tips",
      "Personalized 1-on-1 Feedback",
      "Test Center-Based Mock Test",
      "Recorded Sessions Access",
      "24/7 WhatsApp Assistance"
    ]
  },
  customOffers: [],
  campusSchedules: DEFAULT_CAMPUS_SCHEDULES,
  campusLocations: DEFAULT_CAMPUS_LOCATIONS,
  demoSchedule: {
    campuses: DEFAULT_CAMPUS_SCHEDULES.map((c) => c.campusName),
    shahrahDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
    timingSlots: [
      "12:00 PM \u2013 1:30 PM",
      "3:00 PM \u2013 4:30 PM",
      "4:30 PM \u2013 6:00 PM",
      "6:30 PM \u2013 8:00 PM",
      "11:00 PM \u2013 12:00 AM (PTE Online)"
    ]
  },
  awardsAndPictures: {
    academyLogoUrl: "/src/assets/images/smu_consultant_colorful_logo_1795697898742.jpg",
    sirUsmanPortraitUrl: "/assets/smusman/sir_usman_teacher.jpg",
    britishCouncilAwardUrl: "/assets/smusman/british_council_award.jpg",
    pearsonTrophyUrl: "/assets/aistudio/image_3c3abb30.png",
    pearsonStageUrl: "/assets/aistudio/image_d103f58a.png",
    pearsonCertificateUrl: "/assets/aistudio/image_1e23e0c5.png",
    pteScorecardsUrl: "/assets/aistudio/image_918287d6.png",
    academyPosterUrl: "/assets/aistudio/images__1__019fbafc.jfif",
    heroStudentUrl: "/src/assets/images/hero_student_portrait_1795499585372.jpg",
    counsellorAdvisingUrl: "/src/assets/images/counsellor_advising_1795499585062.jpg",
    heroCampusUrl: "/src/assets/images/hero_campus_students_1795499238123.jpg",
    bannerTestPrepUrl: "/src/assets/images/banner_test_preparation_1795505668291.jpg",
    bannerStudyConsultancyUrl: "/src/assets/images/banner_study_consultancy_1795505668360.jpg",
    bannerOfficialExamUrl: "/src/assets/images/banner_official_exam_booking_1795505669387.jpg",
    bannerFreeDemoUrl: "/src/assets/images/banner_free_demo_class_1795505669232.jpg"
  },
  studentTestimonialVideos: [
    {
      id: "testi-band8",
      videoId: "Ha9ALk_Bg7c",
      category: "testimonial",
      badge: "Band 8.0 Student Review",
      title: "IELTS Candidate Sharing Her Band 8.0 Experience",
      summary: "Hear directly from a Band 8.0 IELTS achiever trained under Sir SM Usman in Karachi on mock scoring and Speaking feedback.",
      viewsLabel: "1.4K+ views",
      youtubeUrl: "https://youtube.com/shorts/Ha9ALk_Bg7c",
      segment: "ielts",
      visibleOnPages: ["home", "test-ielts", "guides"]
    },
    {
      id: "testi-karachi-32k",
      videoId: "07n-N-nXTbw",
      category: "testimonial",
      badge: "Student Success Story",
      title: "Highly Satisfied IELTS Candidate Sharing Her Experience",
      summary: "On-campus student testimonial covering daily Writing correction, Listening drills, and British Council exam confidence.",
      viewsLabel: "32K+ views",
      youtubeUrl: "https://youtube.com/shorts/07n-N-nXTbw",
      segment: "ielts",
      visibleOnPages: ["test-ielts", "guides"]
    },
    {
      id: "testi-band7-plus",
      videoId: "X811QMH_1Ug",
      category: "testimonial",
      badge: "Band 7.0+ Achiever",
      title: "IELTS Preparation in Karachi \u2014 Band 7 & Above Review",
      summary: "Candidate story highlighting structured Speaking & Reading score progression from SM Usman\u2019s Academy.",
      viewsLabel: "1.3K+ views",
      youtubeUrl: "https://youtube.com/shorts/X811QMH_1Ug",
      segment: "ielts",
      visibleOnPages: ["test-ielts", "guides"]
    }
  ],
  sirUsmanShorts: [
    {
      id: "sir-ai-examiner",
      videoId: "UXq-Jao8GK8",
      category: "sir-usman",
      badge: "IELTS Exam Update",
      title: "IELTS Speaking & Writing: Checked by AI or Human Examiners?",
      summary: "Sir SM Usman explains official IELTS marking standards and what Pakistani test-takers must prepare for in 2026\u20132028.",
      viewsLabel: "@smusmanacademy",
      youtubeUrl: "https://youtube.com/shorts/UXq-Jao8GK8",
      segment: "ielts",
      visibleOnPages: ["home", "test-ielts", "guides"]
    },
    {
      id: "sir-reading-headings",
      videoId: "NRGysrh0NSU",
      category: "sir-usman",
      badge: "Reading Strategy",
      title: "IELTS Reading List of Headings \u2014 Best Tips & Tricks",
      summary: "Practical elimination method taught by Sir SM Usman to solve Academic Reading paragraph headings accurately.",
      viewsLabel: "626+ views",
      youtubeUrl: "https://youtube.com/shorts/NRGysrh0NSU",
      segment: "ielts",
      visibleOnPages: ["test-ielts", "guides"]
    },
    {
      id: "sir-writing-tip",
      videoId: "jEvz5YIoTA8",
      category: "sir-usman",
      badge: "Writing Task Tip",
      title: "Important IELTS Writing Score Tip by Sir SM Usman",
      summary: "Avoid the common Task 2 cohesion and lexical errors that hold back candidates between Band 6.5 and 7.5+.",
      viewsLabel: "713+ views",
      youtubeUrl: "https://youtube.com/shorts/jEvz5YIoTA8",
      segment: "ielts",
      visibleOnPages: ["test-ielts", "guides"]
    },
    {
      id: "sir-pte-meetup",
      videoId: "VbbCxkA-sEo",
      category: "sir-usman",
      badge: "Pearson PTE Meet-up",
      title: "Pearson PTE Annual Meet-up 2026 in Lahore, Pakistan",
      summary: "Official Pearson PTE updates and partner insights shared by SM Usman\u2019s Academy leadership.",
      viewsLabel: "@smusmanacademy",
      youtubeUrl: "https://youtube.com/shorts/VbbCxkA-sEo",
      segment: "pte",
      visibleOnPages: ["home", "test-pte", "guides"]
    },
    {
      id: "sir-ttt-certified",
      videoId: "-s-NOw9OLKw",
      category: "sir-usman",
      badge: "British Council TTT",
      title: "IELTS Coaching with British Council TTT Certified Instructor",
      summary: "Explore small-group and 1-on-1 training across Gulshan, Shahrah-e-Faisal, Nazimabad, and live online batches.",
      viewsLabel: "1.6K+ views",
      youtubeUrl: "https://youtube.com/shorts/-s-NOw9OLKw",
      segment: "ielts",
      visibleOnPages: ["test-ielts", "guides"]
    },
    {
      id: "sir-multi-tests",
      videoId: "qd_OaBKI_ck",
      category: "sir-usman",
      badge: "IELTS \xB7 PTE \xB7 Duolingo",
      title: "IELTS, PTE & Duolingo Preparation with Sir SM Usman",
      summary: "Pick the right English test for UK, Germany, Italy, or Cyprus admissions and book a free demo session.",
      viewsLabel: "@smusmanacademy",
      youtubeUrl: "https://youtube.com/shorts/qd_OaBKI_ck",
      segment: "duolingo",
      visibleOnPages: ["home", "test-ielts", "test-pte", "test-duolingo", "guides"]
    }
  ],
  textTestimonials: [
    {
      id: "cyc-pte-90",
      studentName: "Shahbaz \xB7 Nabeel \xB7 Rida \xB7 Tasneem",
      scoreAchieved: "PTE 89 \u2013 90 / 90",
      testOrTrack: "Pearson PTE Academic \xB7 Rising Star Academy",
      destinationOrCampus: "Karachi & Live Online Batch",
      intakeLabel: "Verified Pearson Scorecards",
      outcomeTag: "90/90 Overall PTE Scores \xB7 UK & Global Study Ready",
      quote: "With Sir SM Usman\u2019s updated PTE templates, test center-based mock simulations, and 1-on-1 feedback, our candidates achieved 89 and 90 out of 90 across Speaking, Listening, Reading, and Writing.",
      image: "/assets/aistudio/image_918287d6.png",
      segment: "pte",
      visibleOnPages: ["home", "test-pte", "guides"]
    },
    {
      id: "cyc-osama",
      studentName: "Osama Bin Tariq",
      scoreAchieved: "IELTS Band 8.0",
      testOrTrack: "IELTS Academic \xB7 Verified TRF",
      destinationOrCampus: "Gulshan-e-Iqbal Campus, Karachi",
      intakeLabel: "2026 Intake Achiever",
      outcomeTag: "Top Band 8.0 Score \xB7 UK MSc Shortlist",
      quote: "Daily Speaking mock sessions and line-by-line Writing Task 2 feedback with Sir SM Usman pushed my score from a 6.5 baseline straight to an official Band 8.0.",
      image: "/assets/smusman/result_band8_osama.jpg",
      segment: "ielts",
      visibleOnPages: ["home", "test-ielts", "guides"]
    },
    {
      id: "cyc-enaarah",
      studentName: "Enaarah Ali",
      scoreAchieved: "IELTS Band 8.0",
      testOrTrack: "IELTS Academic \xB7 Verified TRF",
      destinationOrCampus: "Karachi On-Campus Batch",
      intakeLabel: "2026 Verified Result",
      outcomeTag: "Band 8.0 Overall \xB7 British Council Exam",
      quote: "Sir Usman\u2019s Reading elimination strategy and structured cue-card drills removed my exam anxiety completely. I walked into the British Council hall fully prepared.",
      image: "/assets/smusman/result_enaarah.jpg",
      segment: "ielts",
      visibleOnPages: ["test-ielts", "guides"]
    },
    {
      id: "cyc-abdul-rab",
      studentName: "Abdul Rab",
      scoreAchieved: "IELTS Band 7.5+",
      testOrTrack: "Fast-Track IELTS Batch",
      destinationOrCampus: "Shahrah-e-Faisal & Online",
      intakeLabel: "Fast-Track Graduate",
      outcomeTag: "Band 7.5+ Overall \xB7 University Admission",
      quote: "Within four weeks of intensive Writing clinics and full computer-delivered mocks, I cleared my target university English condition on my very first attempt.",
      image: "/assets/smusman/result_abdul_rab.jpg",
      segment: "ielts",
      visibleOnPages: ["test-ielts", "guides"]
    },
    {
      id: "cyc-hamza",
      studentName: "Hamza Tariq",
      scoreAchieved: "Band 7.5 \xB7 \xA32,000 Scholarship",
      testOrTrack: "MSc Data Science \xB7 United Kingdom",
      destinationOrCampus: "University of Hertfordshire, UK",
      intakeLabel: "UK Admission & Visa",
      outcomeTag: "UK Visa Approved in 11 Working Days",
      quote: "SMU Consultants handled my IELTS readiness, SOP refinement, and two mock CAS credibility interviews\u2014I secured a \xA32,000 scholarship and UK visa in 11 days.",
      image: "/src/assets/images/student_story_1_1795499585370.jpg",
      segment: "consultancy",
      visibleOnPages: ["home", "guides"]
    },
    {
      id: "cyc-amina",
      studentName: "Amina Okafor",
      scoreAchieved: "IELTS 7.5 \xB7 100% DSU Grant",
      testOrTrack: "MSc Economics \xB7 Italy Track",
      destinationOrCampus: "University of Bologna, Italy",
      intakeLabel: "European Scholarship Track",
      outcomeTag: "Full Regional Tuition Waiver + Housing",
      quote: "From CIMEA document verification and Universitaly pre-enrollment to my regional DSU scholarship filing, the advisory team guided every single deadline clearly.",
      image: "/src/assets/images/student_story_2_1795499585959.jpg",
      segment: "consultancy",
      visibleOnPages: ["guides"]
    },
    {
      id: "cyc-zainab",
      studentName: "Zainab Al-Mansoor",
      scoreAchieved: "IELTS 7.5 \xB7 18-Day Offer",
      testOrTrack: "MSc Computer Science \xB7 Germany",
      destinationOrCampus: "SRH Berlin University, Germany",
      intakeLabel: "Germany Study Track",
      outcomeTag: "First-Attempt German Student Visa",
      quote: "I was overwhelmed by Uni-Assist notarization and Sperrkonto rules. SMU Consultants organized my entire file in days and got my German visa approved first try.",
      image: "/src/assets/images/student_story_3_1795499586475.jpg",
      segment: "consultancy",
      visibleOnPages: ["guides"]
    }
  ],
  resultCards: [
    {
      id: "res-pte-90-batch",
      studentName: "Shahbaz (90) \xB7 Nabeel (90) \xB7 Rida (90) \xB7 Tasneem (89)",
      scoreLabel: "PTE 89 \u2013 90 / 90",
      testType: "Pearson PTE Academic",
      image: "/assets/aistudio/image_918287d6.png",
      highlight: "Official Pearson PTE Score Reports \xB7 SM Usman\u2019s Academy Achievers",
      segment: "pte",
      visibleOnPages: ["home", "test-pte", "guides"]
    },
    {
      id: "res-osama",
      studentName: "Osama Bin Tariq",
      scoreLabel: "Overall Band 8.0",
      testType: "IELTS Academic",
      image: "/assets/smusman/result_band8_osama.jpg",
      highlight: "Verified TRF Result \xB7 Top Achiever at SM Usman\u2019s Academy",
      segment: "ielts",
      visibleOnPages: ["home", "test-ielts", "guides"]
    },
    {
      id: "res-abdul-rab",
      studentName: "Abdul Rab",
      scoreLabel: "Band 7.5+ Overall",
      testType: "IELTS Academic",
      image: "/assets/smusman/result_abdul_rab.jpg",
      highlight: "Fast-Track Batch Graduate \xB7 Verified Official Scorecard",
      segment: "ielts",
      visibleOnPages: ["test-ielts", "guides"]
    },
    {
      id: "res-enaarah",
      studentName: "Enaarah Ali",
      scoreLabel: "Band 8.0 Overall",
      testType: "IELTS Academic",
      image: "/assets/smusman/result_enaarah.jpg",
      highlight: "Gulshan Campus Student \xB7 Verified TRF Certificate",
      segment: "ielts",
      visibleOnPages: ["test-ielts", "guides"]
    },
    {
      id: "res-pearson-trophy",
      studentName: "Pearson Rising Star Award 2025\u20132026",
      scoreLabel: "Partner Excellence Award",
      testType: "Pearson Test of English",
      image: "/assets/aistudio/image_3c3abb30.png",
      highlight: "Stronger Together Trophy Awarded to SM Usman\u2019s Academy",
      segment: "pte",
      visibleOnPages: ["test-pte", "guides"]
    },
    {
      id: "res-student-1",
      studentName: "SMU High Achiever 01",
      scoreLabel: "Band 7.5 \u2013 8.0",
      testType: "IELTS Academic / UKVI",
      image: "/assets/smusman/result_student_1.jpg",
      highlight: "Verified British Council / IDP Test Report Form",
      segment: "ielts",
      visibleOnPages: ["test-ielts", "guides"]
    }
  ],
  faqs: DEFAULT_FAQS
};
function buildFaqChatReply(rawQuery, config) {
  const q = rawQuery.trim().toLowerCase();
  const wa = config.socialLinks.whatsappDisplay;
  const email = config.socialLinks.leadEmail;
  const offer = config.megaOffer;
  if (!q) {
    return `Assalam-o-Alaikum! Ask about UK, Germany, Italy, Cyprus admissions, IELTS/PTE batches (${offer.discountedFee} Mega Offer), campuses, or exam vouchers. You can also message WhatsApp ${wa}.`;
  }
  const stopWords = /* @__PURE__ */ new Set([
    "what",
    "which",
    "when",
    "where",
    "with",
    "about",
    "from",
    "your",
    "have",
    "does",
    "need",
    "explain",
    "tell",
    "how",
    "for",
    "the",
    "and",
    "are",
    "can"
  ]);
  const tokens = q.replace(/[^\w\s]/g, " ").split(/\s+/).filter((w) => w.length >= 2 && !stopWords.has(w));
  const scoredFaqs = (config.faqs ?? []).map((faq) => {
    const hay = `${faq.category} ${faq.question} ${faq.answer}`.toLowerCase();
    let score = 0;
    for (const tok of tokens) {
      if (faq.question.toLowerCase().includes(tok)) score += 3;
      else if (faq.category.toLowerCase().includes(tok)) score += 2;
      else if (hay.includes(tok)) score += 1;
    }
    return { faq, score };
  }).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score);
  if (q.includes("campus") || q.includes("location") || q.includes("address") || q.includes("gulshan") || q.includes("shahrah") || q.includes("nazimabad") || q.includes("timing") || q.includes("batch")) {
    const branches = (config.campusLocations ?? []).map((c) => `\u2022 ${c.name}: ${c.address} (${c.hours} \xB7 ${c.phone})`).join("\n");
    const firstSched = config.campusSchedules[0];
    const timingHint = firstSched ? `
Sample Timings (${firstSched.campusName} \xB7 ${firstSched.days.join("/")}): ${firstSched.timingSlots.slice(0, 4).join(", ")}.` : "";
    return `SM Usman's Academy Karachi Campuses:
${branches}${timingHint}

Book your free demo on WhatsApp ${wa}.`;
  }
  if (q.includes("offer") || q.includes("20,000") || q.includes("20000") || q.includes("discount") || q.includes("promo")) {
    return `${offer.title} (${offer.badge}): ${offer.discountedFee} instead of ${offer.originalFee} \u2014 ${offer.duration} (${offer.classDuration}), ${offer.frequency}, ${offer.timings}. Includes: ${offer.inclusions.slice(0, 3).join(", ")}. Message WhatsApp ${wa} to reserve your seat.`;
  }
  if (q.includes("voucher") || q.includes("examism") || q.includes("book exam") || q.includes("exam date") || q.includes("register")) {
    return `You can book your official IELTS, PTE, Duolingo (DET), TOEFL, or OET exam seat on our Book Exam page\u2014or directly purchase discounted exam & practice vouchers from SM Usman's Examism Store (https://smusman.examism.com/). Assistance desk: WhatsApp ${wa}.`;
  }
  if (scoredFaqs.length > 0) {
    const best = scoredFaqs[0].faq;
    const second = scoredFaqs[1] && scoredFaqs[1].score >= 3 ? scoredFaqs[1].faq : null;
    if (second) {
      return `[${best.category}] ${best.question}
${best.answer}

[${second.category}] ${second.question}
${second.answer}

Need personal guidance? WhatsApp ${wa} or email ${email}.`;
    }
    return `[${best.category}] ${best.question}
${best.answer}

For 1-on-1 profile assessment, message WhatsApp ${wa} or use Start Free Check.`;
  }
  const topPreview = (config.faqs ?? []).slice(0, 3).map((f) => `\u2022 ${f.question}`).join("\n");
  return `Here are popular topics I can answer right away:
${topPreview}
\u2022 Campus Locations, Batch Timings & ${offer.discountedFee} PTE Offer
\u2022 Official Exam Booking & Vouchers (smusman.examism.com)

Ask any question above, or message our team directly on WhatsApp ${wa} / ${email}.`;
}

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PORT = Number(process.env.PORT || 3e3);
var DATA_DIR = path.resolve(__dirname, "data");
var UPLOADS_DIR = path.resolve(__dirname, "public", "uploads");
var SITE_CONFIG_FILE = path.resolve(DATA_DIR, "site-config.json");
var LEADS_FILE = path.resolve(DATA_DIR, "leads.json");
var ADMIN_AUTH_FILE = path.resolve(DATA_DIR, "admin-auth.json");
var SMTP_CONFIG_FILE = path.resolve(DATA_DIR, "smtp-config.json");
var SESSION_SIGNING_KEY = process.env.ADMIN_SESSION_SECRET?.trim() || crypto.randomBytes(32).toString("hex");
function resolveInsideDir(baseDir, fileName) {
  const safeBase = path.basename(fileName);
  const resolved = path.resolve(baseDir, safeBase);
  if (!resolved.startsWith(baseDir + path.sep)) {
    throw new Error("Invalid file path");
  }
  return resolved;
}
async function ensureStorageDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}
function isSafeUrlOrPath(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("/")) {
    return !trimmed.startsWith("//");
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
function sanitizeUrl(raw, fallback) {
  const val = String(raw ?? "").trim();
  return val && isSafeUrlOrPath(val) ? val : fallback;
}
async function readSiteConfig() {
  try {
    const raw = await fs.readFile(SITE_CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    const legacyCampuses = Array.isArray(parsed.demoSchedule?.campuses) ? parsed.demoSchedule.campuses : DEFAULT_SITE_CONFIG.demoSchedule.campuses;
    const legacyDays = Array.isArray(parsed.demoSchedule?.shahrahDays) ? parsed.demoSchedule.shahrahDays : DEFAULT_SITE_CONFIG.demoSchedule.shahrahDays;
    const legacyTimings = Array.isArray(parsed.demoSchedule?.timingSlots) ? parsed.demoSchedule.timingSlots : DEFAULT_SITE_CONFIG.demoSchedule.timingSlots;
    const campusSchedules = Array.isArray(parsed.campusSchedules) && parsed.campusSchedules.length > 0 ? parsed.campusSchedules.map((c, idx) => ({
      id: String(c.id || `campus-${idx}`),
      campusName: String(c.campusName || `Campus ${idx + 1}`).trim(),
      days: Array.isArray(c.days) && c.days.length > 0 ? c.days : legacyDays,
      timingSlots: Array.isArray(c.timingSlots) && c.timingSlots.length > 0 ? c.timingSlots : legacyTimings
    })) : legacyCampuses.map((name, idx) => {
      const matched = DEFAULT_SITE_CONFIG.campusSchedules.find(
        (d) => d.campusName.toLowerCase() === name.toLowerCase()
      );
      return {
        id: matched?.id || `campus-${idx}`,
        campusName: name,
        days: matched?.days ?? legacyDays,
        timingSlots: matched?.timingSlots ?? legacyTimings
      };
    });
    return {
      updatedAt: parsed.updatedAt || DEFAULT_SITE_CONFIG.updatedAt,
      socialLinks: {
        ...DEFAULT_SITE_CONFIG.socialLinks,
        ...parsed.socialLinks ?? {}
      },
      megaOffer: {
        ...DEFAULT_SITE_CONFIG.megaOffer,
        ...parsed.megaOffer ?? {},
        imageUrl: sanitizeUrl(
          parsed.megaOffer?.imageUrl ?? DEFAULT_SITE_CONFIG.megaOffer.imageUrl,
          DEFAULT_SITE_CONFIG.megaOffer.imageUrl
        ),
        inclusions: Array.isArray(parsed.megaOffer?.inclusions) ? parsed.megaOffer.inclusions : DEFAULT_SITE_CONFIG.megaOffer.inclusions
      },
      customOffers: Array.isArray(parsed.customOffers) ? parsed.customOffers : DEFAULT_SITE_CONFIG.customOffers,
      campusSchedules,
      campusLocations: Array.isArray(parsed.campusLocations) && parsed.campusLocations.length > 0 ? parsed.campusLocations.map((loc, idx) => ({
        id: String(loc.id || `branch-${idx}`),
        name: String(loc.name || `Campus ${idx + 1}`).trim(),
        role: String(loc.role || "Study Abroad & Test Prep").trim(),
        address: String(loc.address || "").trim(),
        landmark: String(loc.landmark || "").trim(),
        hours: String(loc.hours || "").trim(),
        phone: String(loc.phone || "").trim(),
        lat: Number.isFinite(Number(loc.lat)) ? Number(loc.lat) : 24.9235146,
        lng: Number.isFinite(Number(loc.lng)) ? Number(loc.lng) : 67.0919263,
        mapsUrl: sanitizeUrl(loc.mapsUrl || "", DEFAULT_CAMPUS_LOCATIONS[0].mapsUrl),
        googlePlaceQuery: String(loc.googlePlaceQuery || loc.name || "").trim()
      })) : DEFAULT_CAMPUS_LOCATIONS,
      demoSchedule: {
        campuses: campusSchedules.map((c) => c.campusName),
        shahrahDays: campusSchedules[0]?.days ?? legacyDays,
        timingSlots: Array.from(
          new Set(campusSchedules.flatMap((c) => c.timingSlots))
        )
      },
      awardsAndPictures: {
        ...DEFAULT_SITE_CONFIG.awardsAndPictures,
        ...parsed.awardsAndPictures ?? {}
      },
      studentTestimonialVideos: Array.isArray(parsed.studentTestimonialVideos) ? parsed.studentTestimonialVideos : DEFAULT_SITE_CONFIG.studentTestimonialVideos,
      sirUsmanShorts: Array.isArray(parsed.sirUsmanShorts) ? parsed.sirUsmanShorts : DEFAULT_SITE_CONFIG.sirUsmanShorts,
      textTestimonials: Array.isArray(parsed.textTestimonials) ? parsed.textTestimonials : DEFAULT_SITE_CONFIG.textTestimonials,
      resultCards: Array.isArray(parsed.resultCards) ? parsed.resultCards : DEFAULT_SITE_CONFIG.resultCards,
      faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs.map((f, idx) => ({
        id: String(f.id || `faq-${idx}`),
        category: normalizeFaqCategory(f.category, f.question),
        question: String(f.question || "").trim(),
        answer: String(f.answer || "").trim()
      })) : DEFAULT_SITE_CONFIG.faqs
    };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}
async function writeSiteConfig(config) {
  await ensureStorageDirs();
  await fs.writeFile(SITE_CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}
async function readLeads() {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
async function writeLeads(leads) {
  await ensureStorageDirs();
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads.slice(0, 500), null, 2), "utf-8");
}
async function readAdminAuth() {
  try {
    const raw = await fs.readFile(ADMIN_AUTH_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.salt && parsed.passwordHash) {
      return {
        salt: parsed.salt,
        passwordHash: parsed.passwordHash,
        updatedAt: parsed.updatedAt || ""
      };
    }
    return null;
  } catch {
    return null;
  }
}
async function writeAdminAuth(record) {
  await ensureStorageDirs();
  await fs.writeFile(ADMIN_AUTH_FILE, JSON.stringify(record, null, 2), "utf-8");
}
async function readSmtpSettings() {
  const envUser = process.env.SMTP_USER?.trim() || "";
  const envPass = process.env.SMTP_PASS?.trim() || "";
  const envHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const envPort = Number(process.env.SMTP_PORT || 465);
  try {
    const raw = await fs.readFile(SMTP_CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    const user = String(parsed.user ?? envUser).trim();
    const pass = String(parsed.pass ?? envPass).trim();
    const port = Number(parsed.port || envPort || 465);
    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : Boolean(user && pass),
      host: String(parsed.host || envHost || "smtp.gmail.com").trim(),
      port,
      secure: typeof parsed.secure === "boolean" ? parsed.secure : port === 465,
      user,
      pass,
      fromName: String(parsed.fromName || "SMU Consultants Portal").trim(),
      updatedAt: String(parsed.updatedAt || ""),
      usingEnvFallback: Boolean(!parsed.user && envUser && !parsed.pass && envPass)
    };
  } catch {
    return {
      enabled: Boolean(envUser && envPass),
      host: envHost,
      port: envPort,
      secure: envPort === 465,
      user: envUser,
      pass: envPass,
      fromName: "SMU Consultants Portal",
      updatedAt: "",
      usingEnvFallback: Boolean(envUser && envPass)
    };
  }
}
async function writeSmtpSettings(record) {
  await ensureStorageDirs();
  await fs.writeFile(SMTP_CONFIG_FILE, JSON.stringify(record, null, 2), "utf-8");
}
function hashPasswordScrypt(password, saltHex) {
  return crypto.scryptSync(password, saltHex, 64);
}
function verifyScryptPassword(password, record) {
  const computed = hashPasswordScrypt(password, record.salt);
  const stored = Buffer.from(record.passwordHash, "hex");
  if (computed.length !== stored.length) return false;
  return crypto.timingSafeEqual(computed, stored);
}
function verifyEnvPassword(candidate, envPass) {
  const a = Buffer.from(candidate, "utf8");
  const b = Buffer.from(envPass, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
function issueAdminBearerToken() {
  const payload = {
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + 12 * 60 * 60 * 1e3,
    nonce: crypto.randomBytes(8).toString("hex")
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SIGNING_KEY).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}
function verifyAdminBearerToken(token) {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [encoded, sig] = parts;
  const expectedSig = crypto.createHmac("sha256", SESSION_SIGNING_KEY).update(encoded).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    return payload.role === "admin" && typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Admin authentication required." });
  }
  const token = authHeader.slice(7).trim();
  if (!verifyAdminBearerToken(token)) {
    return res.status(401).json({ ok: false, error: "Session expired or invalid. Please log in again." });
  }
  next();
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
async function startServer() {
  await ensureStorageDirs();
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use("/uploads", express.static(UPLOADS_DIR));
  app.get("/api/site-config", async (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    const config = await readSiteConfig();
    res.json({ ok: true, config });
  });
  app.get("/api/admin/auth/status", async (req, res) => {
    const envPassword = process.env.ADMIN_PASSWORD?.trim();
    const stored = await readAdminAuth();
    const authHeader = req.headers.authorization || "";
    const authenticated = authHeader.startsWith("Bearer ") && verifyAdminBearerToken(authHeader.slice(7).trim());
    res.json({
      ok: true,
      initialized: Boolean(envPassword || stored),
      usingEnvSecret: Boolean(envPassword),
      authenticated
    });
  });
  app.post("/api/admin/auth/setup", async (req, res) => {
    const envPassword = process.env.ADMIN_PASSWORD?.trim();
    if (envPassword) {
      return res.status(409).json({
        ok: false,
        error: "Admin password is already configured via server environment."
      });
    }
    const existing = await readAdminAuth();
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: "Admin account is already initialized. Please sign in."
      });
    }
    const password = String(req.body?.password ?? "");
    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        error: "Please choose an admin password of at least 6 characters."
      });
    }
    const salt = crypto.randomBytes(16).toString("hex");
    const hashHex = hashPasswordScrypt(password, salt).toString("hex");
    await writeAdminAuth({
      salt,
      passwordHash: hashHex,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const token = issueAdminBearerToken();
    return res.json({ ok: true, token });
  });
  app.post("/api/admin/auth/login", async (req, res) => {
    const password = String(req.body?.password ?? "");
    if (!password) {
      return res.status(400).json({ ok: false, error: "Password is required." });
    }
    const envPassword = process.env.ADMIN_PASSWORD?.trim();
    if (envPassword) {
      if (!verifyEnvPassword(password, envPassword)) {
        return res.status(401).json({ ok: false, error: "Incorrect admin password." });
      }
      return res.json({ ok: true, token: issueAdminBearerToken() });
    }
    const stored = await readAdminAuth();
    if (!stored) {
      return res.status(400).json({
        ok: false,
        error: "Admin account not set up yet. Create your password first."
      });
    }
    if (!verifyScryptPassword(password, stored)) {
      return res.status(401).json({ ok: false, error: "Incorrect admin password." });
    }
    return res.json({ ok: true, token: issueAdminBearerToken() });
  });
  app.post("/api/admin/auth/change-password", requireAdminAuth, async (req, res) => {
    const envPassword = process.env.ADMIN_PASSWORD?.trim();
    if (envPassword) {
      return res.status(400).json({
        ok: false,
        error: "ADMIN_PASSWORD is managed via Settings > Secrets. Update it there."
      });
    }
    const newPassword = String(req.body?.newPassword ?? "");
    if (newPassword.length < 6) {
      return res.status(400).json({
        ok: false,
        error: "New password must be at least 6 characters."
      });
    }
    const salt = crypto.randomBytes(16).toString("hex");
    const hashHex = hashPasswordScrypt(newPassword, salt).toString("hex");
    await writeAdminAuth({
      salt,
      passwordHash: hashHex,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return res.json({ ok: true });
  });
  app.get("/api/admin/leads", requireAdminAuth, async (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    const leads = await readLeads();
    res.json({ ok: true, leads });
  });
  app.get("/api/admin/smtp", requireAdminAuth, async (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    const smtp = await readSmtpSettings();
    const cfg = await readSiteConfig();
    res.json({
      ok: true,
      smtp: {
        enabled: smtp.enabled,
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        user: smtp.user,
        hasPassword: Boolean(smtp.pass),
        fromName: smtp.fromName,
        updatedAt: smtp.updatedAt,
        usingEnvFallback: smtp.usingEnvFallback,
        receiverEmail: process.env.LEAD_RECEIVER_EMAIL?.trim() || cfg.socialLinks.leadEmail
      }
    });
  });
  app.put("/api/admin/smtp", requireAdminAuth, async (req, res) => {
    const body = req.body;
    const current = await readSmtpSettings();
    const port = Number(body.port ?? current.port) || 587;
    const secure = port === 465 ? true : port === 587 ? false : Boolean(body.secure);
    const nextRecord = {
      enabled: typeof body.enabled === "boolean" ? body.enabled : current.enabled,
      host: String(body.host ?? current.host).trim() || "mail.smuconsultant.com",
      port,
      secure,
      user: String(body.user ?? current.user).trim(),
      pass: typeof body.pass === "string" && body.pass.trim().length > 0 ? body.pass.trim() : current.pass,
      fromName: String(body.fromName ?? current.fromName).trim() || "SMU Consultants Portal",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await writeSmtpSettings(nextRecord);
    return res.json({
      ok: true,
      smtp: {
        enabled: nextRecord.enabled,
        host: nextRecord.host,
        port: nextRecord.port,
        secure: nextRecord.secure,
        user: nextRecord.user,
        hasPassword: Boolean(nextRecord.pass),
        fromName: nextRecord.fromName,
        updatedAt: nextRecord.updatedAt
      }
    });
  });
  app.post("/api/admin/smtp/test", requireAdminAuth, async (req, res) => {
    const smtp = await readSmtpSettings();
    const cfg = await readSiteConfig();
    const body = req.body;
    const receiverEmail = String(body?.testTo || "").trim() || process.env.LEAD_RECEIVER_EMAIL?.trim() || cfg.socialLinks.leadEmail || "88smusman@gmail.com";
    if (!smtp.user || !smtp.pass) {
      return res.status(400).json({
        ok: false,
        error: "Enter SMTP Email and Password first, then click Save SMTP Settings."
      });
    }
    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465 ? true : smtp.port === 587 ? false : smtp.secure,
        auth: {
          user: smtp.user,
          pass: smtp.pass
        }
      });
      await transporter.sendMail({
        from: `"${smtp.fromName}" <${smtp.user}>`,
        to: receiverEmail,
        subject: `[SMU Test Email] Lead Routing Verified (${(/* @__PURE__ */ new Date()).toLocaleTimeString()})`,
        text: `Your SMU Consultants Admin SMTP email setup works cleanly! New student leads submitted on the website will arrive at ${receiverEmail}.`,
        html: `<p><strong>SMU Consultants SMTP Test Passed!</strong></p><p>New student leads submitted on your website will automatically arrive at <strong>${escapeHtml(receiverEmail)}</strong>.</p>`
      });
      return res.json({
        ok: true,
        message: `Test email delivered successfully to ${receiverEmail}!`
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "SMTP connection failed.";
      return res.status(502).json({
        ok: false,
        error: `SMTP Error: ${msg} (Check host, port 587 STARTTLS / 465 SSL, username & password.)`
      });
    }
  });
  app.patch("/api/admin/leads/:referenceId", requireAdminAuth, async (req, res) => {
    const referenceId = String(req.params.referenceId ?? "").trim();
    const status = req.body?.status;
    const validStatuses = [
      "New",
      "Contacted",
      "Demo Scheduled",
      "Enrolled"
    ];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ ok: false, error: "Invalid lead status." });
    }
    const leads = await readLeads();
    const idx = leads.findIndex((l) => l.referenceId === referenceId);
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: "Lead not found." });
    }
    leads[idx] = { ...leads[idx], status };
    await writeLeads(leads);
    return res.json({ ok: true, lead: leads[idx] });
  });
  app.delete("/api/admin/leads/:referenceId", requireAdminAuth, async (req, res) => {
    const referenceId = String(req.params.referenceId ?? "").trim();
    const leads = await readLeads();
    const filtered = leads.filter((l) => l.referenceId !== referenceId);
    await writeLeads(filtered);
    return res.json({ ok: true });
  });
  app.put("/api/admin/config", requireAdminAuth, async (req, res) => {
    const body = req.body?.config;
    if (!body || typeof body !== "object") {
      return res.status(400).json({ ok: false, error: "Invalid configuration payload." });
    }
    const current = await readSiteConfig();
    const sanitizedSocial = {
      facebookUrl: sanitizeUrl(
        body.socialLinks?.facebookUrl ?? current.socialLinks.facebookUrl,
        current.socialLinks.facebookUrl
      ),
      instagramUrl: sanitizeUrl(
        body.socialLinks?.instagramUrl ?? current.socialLinks.instagramUrl,
        current.socialLinks.instagramUrl
      ),
      youtubeChannelUrl: sanitizeUrl(
        body.socialLinks?.youtubeChannelUrl ?? current.socialLinks.youtubeChannelUrl,
        current.socialLinks.youtubeChannelUrl
      ),
      youtubeShortsUrl: sanitizeUrl(
        body.socialLinks?.youtubeShortsUrl ?? current.socialLinks.youtubeShortsUrl,
        current.socialLinks.youtubeShortsUrl
      ),
      whatsappDisplay: String(
        body.socialLinks?.whatsappDisplay ?? current.socialLinks.whatsappDisplay
      ).trim(),
      whatsappNumber: String(
        body.socialLinks?.whatsappNumber ?? current.socialLinks.whatsappNumber
      ).replace(/[^\d]/g, "").trim(),
      helplinePhone: String(
        body.socialLinks?.helplinePhone ?? current.socialLinks.helplinePhone
      ).trim(),
      leadEmail: String(body.socialLinks?.leadEmail ?? current.socialLinks.leadEmail).trim()
    };
    const rawAwards = body.awardsAndPictures ?? current.awardsAndPictures;
    const sanitizedAwards = {
      academyLogoUrl: sanitizeUrl(rawAwards.academyLogoUrl, current.awardsAndPictures.academyLogoUrl),
      sirUsmanPortraitUrl: sanitizeUrl(
        rawAwards.sirUsmanPortraitUrl,
        current.awardsAndPictures.sirUsmanPortraitUrl
      ),
      britishCouncilAwardUrl: sanitizeUrl(
        rawAwards.britishCouncilAwardUrl,
        current.awardsAndPictures.britishCouncilAwardUrl
      ),
      pearsonTrophyUrl: sanitizeUrl(
        rawAwards.pearsonTrophyUrl,
        current.awardsAndPictures.pearsonTrophyUrl
      ),
      pearsonStageUrl: sanitizeUrl(
        rawAwards.pearsonStageUrl,
        current.awardsAndPictures.pearsonStageUrl
      ),
      pearsonCertificateUrl: sanitizeUrl(
        rawAwards.pearsonCertificateUrl,
        current.awardsAndPictures.pearsonCertificateUrl
      ),
      pteScorecardsUrl: sanitizeUrl(
        rawAwards.pteScorecardsUrl,
        current.awardsAndPictures.pteScorecardsUrl
      ),
      academyPosterUrl: sanitizeUrl(
        rawAwards.academyPosterUrl,
        current.awardsAndPictures.academyPosterUrl
      ),
      heroStudentUrl: sanitizeUrl(rawAwards.heroStudentUrl, current.awardsAndPictures.heroStudentUrl),
      counsellorAdvisingUrl: sanitizeUrl(
        rawAwards.counsellorAdvisingUrl,
        current.awardsAndPictures.counsellorAdvisingUrl
      ),
      heroCampusUrl: sanitizeUrl(rawAwards.heroCampusUrl, current.awardsAndPictures.heroCampusUrl),
      bannerTestPrepUrl: sanitizeUrl(
        rawAwards.bannerTestPrepUrl,
        current.awardsAndPictures.bannerTestPrepUrl
      ),
      bannerStudyConsultancyUrl: sanitizeUrl(
        rawAwards.bannerStudyConsultancyUrl,
        current.awardsAndPictures.bannerStudyConsultancyUrl
      ),
      bannerOfficialExamUrl: sanitizeUrl(
        rawAwards.bannerOfficialExamUrl,
        current.awardsAndPictures.bannerOfficialExamUrl
      ),
      bannerFreeDemoUrl: sanitizeUrl(
        rawAwards.bannerFreeDemoUrl,
        current.awardsAndPictures.bannerFreeDemoUrl
      )
    };
    const validSegments = /* @__PURE__ */ new Set([
      "ielts",
      "pte",
      "duolingo",
      "toefl",
      "oet",
      "english",
      "consultancy"
    ]);
    const validPages = /* @__PURE__ */ new Set([
      "home",
      "test-ielts",
      "test-pte",
      "test-duolingo",
      "test-toefl",
      "test-oet",
      "test-english",
      "guides"
    ]);
    const sanitizeSegment = (val) => typeof val === "string" && validSegments.has(val) ? val : void 0;
    const sanitizePages = (val) => Array.isArray(val) ? val.filter(
      (p) => typeof p === "string" && validPages.has(p)
    ) : void 0;
    const sanitizeVideos = (list, category, fallback) => {
      if (!Array.isArray(list)) return fallback;
      return list.map((v, idx) => {
        const url = sanitizeUrl(v.youtubeUrl || "", "");
        const vid = extractYouTubeVideoId(url || v.videoId || "") || v.videoId;
        return {
          id: String(v.id || `${category}-${Date.now()}-${idx}`),
          videoId: vid,
          category,
          badge: String(v.badge || "YouTube Short").trim(),
          title: String(v.title || "SM Usman Academy Video").trim(),
          summary: String(v.summary || "").trim(),
          viewsLabel: String(v.viewsLabel || "@smusmanacademy").trim(),
          youtubeUrl: url || (vid ? `https://youtube.com/shorts/${vid}` : ""),
          segment: sanitizeSegment(v.segment),
          visibleOnPages: sanitizePages(v.visibleOnPages)
        };
      }).filter((v) => v.videoId);
    };
    const sanitizedCampusSchedules = Array.isArray(body.campusSchedules) ? body.campusSchedules.map((c, idx) => ({
      id: String(c.id || `campus-${Date.now()}-${idx}`),
      campusName: String(c.campusName || "").trim(),
      days: Array.isArray(c.days) ? c.days.map((d) => String(d).trim()).filter(Boolean) : [],
      timingSlots: Array.isArray(c.timingSlots) ? c.timingSlots.map((t) => String(t).trim()).filter(Boolean) : []
    })).filter((c) => c.campusName.length > 0) : current.campusSchedules;
    const sanitizedLocations = Array.isArray(body.campusLocations) ? body.campusLocations.map((loc, idx) => ({
      id: String(loc.id || `branch-${Date.now()}-${idx}`),
      name: String(loc.name || "").trim(),
      role: String(loc.role || "Study Abroad & Test Prep").trim(),
      address: String(loc.address || "").trim(),
      landmark: String(loc.landmark || "").trim(),
      hours: String(loc.hours || "").trim(),
      phone: String(loc.phone || "").trim(),
      lat: Number.isFinite(Number(loc.lat)) ? Number(loc.lat) : 24.9235146,
      lng: Number.isFinite(Number(loc.lng)) ? Number(loc.lng) : 67.0919263,
      mapsUrl: sanitizeUrl(loc.mapsUrl || "", DEFAULT_CAMPUS_LOCATIONS[0].mapsUrl),
      googlePlaceQuery: String(loc.googlePlaceQuery || loc.name || "").trim()
    })).filter((loc) => loc.name.length > 0) : current.campusLocations;
    const updatedConfig = {
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      socialLinks: sanitizedSocial,
      megaOffer: {
        enabled: typeof body.megaOffer?.enabled === "boolean" ? body.megaOffer.enabled : current.megaOffer.enabled,
        ribbonText: String(body.megaOffer?.ribbonText ?? current.megaOffer.ribbonText).trim(),
        badge: String(body.megaOffer?.badge ?? current.megaOffer.badge).trim(),
        title: String(body.megaOffer?.title ?? current.megaOffer.title).trim(),
        duration: String(body.megaOffer?.duration ?? current.megaOffer.duration).trim(),
        classDuration: String(
          body.megaOffer?.classDuration ?? current.megaOffer.classDuration
        ).trim(),
        frequency: String(body.megaOffer?.frequency ?? current.megaOffer.frequency).trim(),
        timings: String(body.megaOffer?.timings ?? current.megaOffer.timings).trim(),
        originalFee: String(body.megaOffer?.originalFee ?? current.megaOffer.originalFee).trim(),
        discountedFee: String(
          body.megaOffer?.discountedFee ?? current.megaOffer.discountedFee
        ).trim(),
        imageUrl: sanitizeUrl(
          body.megaOffer?.imageUrl ?? current.megaOffer.imageUrl,
          current.megaOffer.imageUrl
        ),
        inclusions: Array.isArray(body.megaOffer?.inclusions) ? body.megaOffer.inclusions.map((i) => String(i).trim()).filter(Boolean) : current.megaOffer.inclusions
      },
      customOffers: Array.isArray(body.customOffers) ? body.customOffers.map((o, idx) => ({
        id: String(o.id || `offer-${Date.now()}-${idx}`),
        enabled: typeof o.enabled === "boolean" ? o.enabled : true,
        badge: String(o.badge || "Special Offer").trim(),
        title: String(o.title || "New Course Offer").trim(),
        duration: String(o.duration || "").trim(),
        classDuration: String(o.classDuration || "").trim(),
        frequency: String(o.frequency || "").trim(),
        timings: String(o.timings || "").trim(),
        originalFee: String(o.originalFee || "").trim(),
        discountedFee: String(o.discountedFee || "").trim(),
        imageUrl: sanitizeUrl(o.imageUrl || "", current.awardsAndPictures.pteScorecardsUrl),
        inclusions: Array.isArray(o.inclusions) ? o.inclusions.map((i) => String(i).trim()).filter(Boolean) : []
      })).filter((o) => o.title.length > 0) : current.customOffers,
      campusSchedules: sanitizedCampusSchedules,
      campusLocations: sanitizedLocations.length > 0 ? sanitizedLocations : current.campusLocations,
      demoSchedule: {
        campuses: sanitizedCampusSchedules.map((c) => c.campusName),
        shahrahDays: sanitizedCampusSchedules[0]?.days.length > 0 ? sanitizedCampusSchedules[0].days : current.demoSchedule.shahrahDays,
        timingSlots: Array.from(
          new Set(sanitizedCampusSchedules.flatMap((c) => c.timingSlots))
        )
      },
      awardsAndPictures: sanitizedAwards,
      studentTestimonialVideos: sanitizeVideos(
        body.studentTestimonialVideos,
        "testimonial",
        current.studentTestimonialVideos
      ),
      sirUsmanShorts: sanitizeVideos(
        body.sirUsmanShorts,
        "sir-usman",
        current.sirUsmanShorts
      ),
      textTestimonials: Array.isArray(body.textTestimonials) ? body.textTestimonials.map((t, idx) => ({
        id: String(t.id || `story-${Date.now()}-${idx}`),
        studentName: String(t.studentName || "Student Achiever").trim(),
        scoreAchieved: String(t.scoreAchieved || "").trim(),
        testOrTrack: String(t.testOrTrack || "").trim(),
        destinationOrCampus: String(t.destinationOrCampus || "").trim(),
        intakeLabel: String(t.intakeLabel || "").trim(),
        outcomeTag: String(t.outcomeTag || "").trim(),
        quote: String(t.quote || "").trim(),
        image: sanitizeUrl(t.image || "", current.awardsAndPictures.pteScorecardsUrl),
        segment: sanitizeSegment(t.segment),
        visibleOnPages: sanitizePages(t.visibleOnPages)
      })) : current.textTestimonials,
      resultCards: Array.isArray(body.resultCards) ? body.resultCards.map((r, idx) => ({
        id: String(r.id || `res-${Date.now()}-${idx}`),
        studentName: String(r.studentName || "Student Scorecard").trim(),
        scoreLabel: String(r.scoreLabel || "").trim(),
        testType: String(r.testType || "").trim(),
        image: sanitizeUrl(r.image || "", current.awardsAndPictures.pteScorecardsUrl),
        highlight: String(r.highlight || "").trim(),
        segment: sanitizeSegment(r.segment),
        visibleOnPages: sanitizePages(r.visibleOnPages)
      })) : current.resultCards,
      faqs: Array.isArray(body.faqs) ? body.faqs.map((f, idx) => ({
        id: String(f.id || `faq-${Date.now()}-${idx}`),
        category: normalizeFaqCategory(f.category, f.question),
        question: String(f.question || "").trim(),
        answer: String(f.answer || "").trim()
      })).filter((f) => f.question.length > 0 && f.answer.length > 0) : current.faqs
    };
    await writeSiteConfig(updatedConfig);
    return res.json({ ok: true, config: updatedConfig });
  });
  app.post("/api/admin/reset-config", requireAdminAuth, async (_req, res) => {
    const resetCopy = {
      ...DEFAULT_SITE_CONFIG,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await writeSiteConfig(resetCopy);
    return res.json({ ok: true, config: resetCopy });
  });
  app.post("/api/admin/upload", requireAdminAuth, async (req, res) => {
    const body = req.body;
    const mimeMap = {
      "image/png": ".png",
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/webp": ".webp",
      "image/gif": ".gif"
    };
    const mime = String(body.mimeType ?? "").toLowerCase();
    const ext = mimeMap[mime];
    if (!ext) {
      return res.status(400).json({
        ok: false,
        error: "Only PNG, JPG, WEBP, or GIF images are allowed."
      });
    }
    const base64Clean = String(body.dataBase64 ?? "").replace(/^data:image\/\w+;base64,/, "");
    if (!base64Clean) {
      return res.status(400).json({ ok: false, error: "Image file data is empty." });
    }
    const buffer = Buffer.from(base64Clean, "base64");
    if (buffer.length > 6 * 1024 * 1024) {
      return res.status(400).json({
        ok: false,
        error: "Image size must be 6 MB or smaller."
      });
    }
    const safeFileName = `smu-${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    const targetPath = resolveInsideDir(UPLOADS_DIR, safeFileName);
    await fs.writeFile(targetPath, buffer);
    return res.json({
      ok: true,
      url: `/uploads/${safeFileName}`
    });
  });
  app.get("/api/social-feed", async (_req, res) => {
    const siteCfg = await readSiteConfig();
    const fbLink = siteCfg.socialLinks.facebookUrl;
    const igLink = siteCfg.socialLinks.instagramUrl;
    const featuredSocialPosts = [
      {
        id: "fb-ielts-batch",
        platform: "facebook",
        author: "SM Usman's Academy",
        handle: "facebook.com/ielts.preparation.karachi",
        postedAt: "Latest Featured Update",
        category: "On-Campus & Online Batches",
        caption: `New IELTS, PTE (${siteCfg.megaOffer.discountedFee} Mega Offer), Duolingo & OET batches starting across Gulshan, Shahrah-e-Faisal, and Nazimabad. WhatsApp: ${siteCfg.socialLinks.whatsappDisplay}.`,
        permalink: fbLink,
        mediaUrl: siteCfg.awardsAndPictures.academyPosterUrl
      },
      {
        id: "ig-band-results",
        platform: "instagram",
        author: "SM Usman Academy",
        handle: "@smusmanacademy",
        postedAt: "Recent Student Milestone",
        category: "UK & Europe Admissions",
        caption: "Achieve Band 8.0\u20138.5 in IELTS or 89\u201390/90 in PTE and secure direct admissions with merit scholarships to partner universities in the UK, Germany, Italy & Cyprus.",
        permalink: igLink,
        mediaUrl: siteCfg.awardsAndPictures.heroStudentUrl
      },
      {
        id: "fb-british-council",
        platform: "facebook",
        author: "SM Usman's Academy",
        handle: "facebook.com/ielts.preparation.karachi",
        postedAt: "Academy Recognition",
        category: "British Council & Pearson Awards",
        caption: "Honored with the British Council Highest Volume Contributor Award (South Region) and Pearson PTE Rising Star Award 2025\u20132026.",
        permalink: fbLink,
        mediaUrl: siteCfg.awardsAndPictures.counsellorAdvisingUrl
      }
    ];
    const token = process.env.META_ACCESS_TOKEN?.trim();
    const fbPageId = process.env.FB_PAGE_ID?.trim();
    const igUserId = process.env.IG_USER_ID?.trim();
    if (token && (fbPageId || igUserId)) {
      try {
        const livePosts = [];
        if (fbPageId) {
          const fbUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(
            fbPageId
          )}/posts?fields=id,message,created_time,permalink_url,full_picture&limit=3&access_token=${encodeURIComponent(
            token
          )}`;
          const fbResp = await fetch(fbUrl);
          if (fbResp.ok) {
            const fbJson = await fbResp.json();
            for (const p of fbJson.data ?? []) {
              if (!p.message) continue;
              livePosts.push({
                id: `fb-${p.id}`,
                platform: "facebook",
                author: "SM Usman's Academy",
                handle: "facebook.com/ielts.preparation.karachi",
                postedAt: p.created_time ? new Date(p.created_time).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }) : "Recent Post",
                category: "Facebook Update",
                caption: p.message,
                permalink: p.permalink_url || fbLink,
                mediaUrl: p.full_picture || siteCfg.awardsAndPictures.academyPosterUrl
              });
            }
          }
        }
        if (igUserId) {
          const igUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(
            igUserId
          )}/media?fields=id,caption,media_url,thumbnail_url,permalink,timestamp&limit=3&access_token=${encodeURIComponent(
            token
          )}`;
          const igResp = await fetch(igUrl);
          if (igResp.ok) {
            const igJson = await igResp.json();
            for (const item of igJson.data ?? []) {
              livePosts.push({
                id: `ig-${item.id}`,
                platform: "instagram",
                author: "SM Usman Academy",
                handle: "@smusmanacademy",
                postedAt: item.timestamp ? new Date(item.timestamp).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }) : "Recent Post",
                category: "Instagram Update",
                caption: item.caption || "Latest campus & IELTS highlight from @smusmanacademy",
                permalink: item.permalink || igLink,
                mediaUrl: item.thumbnail_url || item.media_url || siteCfg.awardsAndPictures.heroStudentUrl
              });
            }
          }
        }
        if (livePosts.length > 0) {
          return res.json({
            mode: "live",
            syncedAt: (/* @__PURE__ */ new Date()).toISOString(),
            posts: livePosts.slice(0, 6)
          });
        }
      } catch (err) {
        console.error("Meta Graph API sync error:", err);
      }
    }
    return res.json({
      mode: "featured",
      syncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      posts: featuredSocialPosts
    });
  });
  app.post("/api/leads", async (req, res) => {
    const siteCfg = await readSiteConfig();
    const receiverEmail = process.env.LEAD_RECEIVER_EMAIL?.trim() || siteCfg.socialLinks.leadEmail || "88smusman@gmail.com";
    const body = req.body;
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const country = String(body.country ?? "uk").trim();
    const studyLevel = String(body.studyLevel ?? "Postgraduate").trim();
    const discipline = String(body.discipline ?? "General").trim();
    const intake = String(body.intake ?? "Upcoming Intake").trim();
    const englishStatus = String(body.englishStatus ?? "").trim();
    const notes = String(body.notes ?? "").trim();
    const source = String(body.source ?? "Website Consultation Form").trim();
    if (fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 7) {
      return res.status(400).json({
        ok: false,
        error: "Valid full name, email address, and WhatsApp/phone number are required."
      });
    }
    const referenceId = `SMU-${country.toUpperCase()}-${Math.floor(
      1e5 + Math.random() * 899999
    )}`;
    const leadRecord = {
      referenceId,
      submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
      fullName,
      email,
      phone,
      country,
      studyLevel,
      discipline,
      intake,
      englishStatus,
      notes,
      source,
      status: "New"
    };
    const smtp = await readSmtpSettings();
    let emailDelivered = false;
    let emailError;
    if (smtp.enabled && smtp.user && smtp.pass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port,
          secure: smtp.port === 465 ? true : smtp.port === 587 ? false : smtp.secure,
          auth: {
            user: smtp.user,
            pass: smtp.pass
          }
        });
        await transporter.sendMail({
          from: `"${smtp.fromName}" <${smtp.user}>`,
          to: receiverEmail,
          ...smtp.user.toLowerCase() !== receiverEmail.toLowerCase() ? { bcc: smtp.user } : {},
          replyTo: email,
          subject: `[SMU Lead ${referenceId}] ${fullName} \u2014 ${country.toUpperCase()} (${studyLevel})`,
          text: [
            `New Student Inquiry (${referenceId})`,
            `Source: ${source}`,
            `Name: ${fullName}`,
            `Email: ${email}`,
            `WhatsApp / Phone: ${phone}`,
            `Target Country: ${country.toUpperCase()}`,
            `Study Level: ${studyLevel}`,
            `Discipline: ${discipline}`,
            `Target Intake / Slot: ${intake}`,
            englishStatus ? `English Status / Campus: ${englishStatus}` : "",
            notes ? `Notes: ${notes}` : ""
          ].filter(Boolean).join("\n"),
          html: `
            <h2>New SMU Consultants Inquiry (${escapeHtml(referenceId)})</h2>
            <p><strong>Source:</strong> ${escapeHtml(source)}</p>
            <table cellpadding="6" border="1" style="border-collapse:collapse;">
              <tr><td><strong>Full Name</strong></td><td>${escapeHtml(fullName)}</td></tr>
              <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
              <tr><td><strong>WhatsApp / Phone</strong></td><td>${escapeHtml(phone)}</td></tr>
              <tr><td><strong>Destination</strong></td><td>${escapeHtml(country.toUpperCase())}</td></tr>
              <tr><td><strong>Study Level</strong></td><td>${escapeHtml(studyLevel)}</td></tr>
              <tr><td><strong>Discipline</strong></td><td>${escapeHtml(discipline)}</td></tr>
              <tr><td><strong>Intake / Slot</strong></td><td>${escapeHtml(intake)}</td></tr>
              <tr><td><strong>English / Campus</strong></td><td>${escapeHtml(englishStatus || "Not specified")}</td></tr>
              <tr><td><strong>Notes</strong></td><td>${escapeHtml(notes || "None")}</td></tr>
            </table>
          `
        });
        emailDelivered = true;
      } catch (mailError) {
        console.error("SMTP delivery error:", mailError);
        emailError = mailError instanceof Error ? mailError.message : "SMTP delivery failed";
      }
    } else {
      emailError = "SMTP email not configured yet in Admin \u2192 Email & SMTP Setup";
    }
    leadRecord.emailDelivered = emailDelivered;
    if (emailError) leadRecord.emailError = emailError;
    const leads = await readLeads();
    leads.unshift(leadRecord);
    await writeLeads(leads);
    return res.json({
      ok: true,
      referenceId,
      targetEmail: receiverEmail,
      emailDelivered
    });
  });
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    const cleanMessage = String(message ?? "").trim();
    if (!cleanMessage) {
      return res.status(400).json({ error: "Please enter a question for the advisor." });
    }
    const siteCfg = await readSiteConfig();
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return res.json({
        reply: buildFaqChatReply(cleanMessage, siteCfg),
        mode: "faq"
      });
    }
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const conversationContext = (history ?? []).slice(-6).map((turn) => `${turn.role === "user" ? "Student" : "Advisor"}: ${turn.text}`).join("\n");
      const prompt = conversationContext ? `${conversationContext}
Student: ${cleanMessage}` : cleanMessage;
      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction: `You are the official Study Abroad & IELTS Admissions AI Advisor for SMU Consultants (smuconsultant.com) and SM Usman's Academy (ielts-smusman.com), established in 2007 in Karachi, Pakistan.
Keep responses crisp, structured, friendly, and accurate (under 140 words unless detailed breakdown is requested).
Facts you must follow:
- Study Destinations (2026, 2027 & 2028 intakes open): United Kingdom (\xA313,500\u2013\xA321,000/yr tuition, 2-year Graduate Route), Germany (\u20AC0 public university tuition to \u20AC12,500 private, \u20AC11,904 Blocked Account, 18-month Job Seeker visa), Italy (\u20AC1,200\u2013\u20AC4,800/yr, DSU regional scholarships cover tuition/housing), Cyprus (\u20AC3,400\u2013\u20AC7,800/yr, 5\u20137 day offers).
- Active Offer: ${siteCfg.megaOffer.title} (${siteCfg.megaOffer.discountedFee}, original ${siteCfg.megaOffer.originalFee}) \u2014 ${siteCfg.megaOffer.duration}, ${siteCfg.megaOffer.frequency}, ${siteCfg.megaOffer.timings}.
- Zero agency service fees for student counselling and partner university applications.
- Test Prep & Official Exam Registration at SM Usman's Academy: IELTS (Academic, General, UKVI, Life Skills A1 \u2014 British Council & IDP desk), PTE Academic (Pearson Rising Star Award 2025-2026), Duolingo English Test (DET), TOEFL iBT, OET Healthcare, and Spoken English. Direct vouchers: https://smusman.examism.com/.
- Karachi Campuses:
  1. Gulshan-e-Iqbal (Head Office): Office 108, 1st Floor, Gulshan Trade Centre, Block 5 (Above MCB Bank) \u2014 ${siteCfg.socialLinks.whatsappDisplay}.
  2. Shahrah-e-Faisal: Office 111, 1st Floor, Marine Faisal Building, PECHS Block 6 (Main Nursery Bus Stop) \u2014 ${siteCfg.socialLinks.helplinePhone}.
  3. North Nazimabad Campus: Alama Iqbal Town / Nazimabad Corridor \u2014 +92 311 2406781.
- Direct WhatsApp: ${siteCfg.socialLinks.whatsappDisplay} | Official Email: ${siteCfg.socialLinks.leadEmail}.
Never invent fake partner guarantees or promise guaranteed visa outcomes.`
        }
      });
      const replyText = response.text?.trim() || buildFaqChatReply(cleanMessage, siteCfg);
      return res.json({ reply: replyText, mode: "ai" });
    } catch (err) {
      console.error("Gemini API error (serving FAQ fallback):", err);
      return res.json({
        reply: buildFaqChatReply(cleanMessage, siteCfg),
        mode: "faq"
      });
    }
  });
  app.get("/robots.txt", (req, res) => {
    const baseUrl = process.env.APP_URL?.trim() || `${req.protocol}://${req.get("host")}`;
    res.type("text/plain").send(`User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`);
  });
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = (process.env.APP_URL?.trim() || `${req.protocol}://${req.get("host")}`).replace(
      /\/$/,
      ""
    );
    const routes = [
      "",
      "#destinations",
      "#services",
      "#book-exam",
      "#about",
      "#guides",
      "#apply",
      "#test-ielts",
      "#test-pte",
      "#test-duolingo",
      "#test-toefl",
      "#test-oet",
      "#test-english"
    ];
    const urlEntries = routes.map(
      (r) => `  <url>
    <loc>${baseUrl}/${r}</loc>
    <changefreq>weekly</changefreq>
    <priority>${r === "" ? "1.0" : "0.8"}</priority>
  </url>`
    ).join("\n");
    res.type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`
    );
  });
  if (process.env.NODE_ENV === "production") {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SMU Consultants server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
