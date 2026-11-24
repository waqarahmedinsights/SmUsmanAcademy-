import { useState } from 'react';
import { BookOpen, ChevronDown, Star, X, CheckSquare } from 'lucide-react';
import {
  FAQS,
  STUDENT_STORIES,
  STUDY_GUIDES,
  StudyGuide,
} from '../data/consultancyData';
import { ResilientImage } from './ResilientImage';

export function ProofAndStoriesSection() {
  const [openFaqId, setOpenFaqId] = useState<string>(FAQS[0].id);
  const [activeGuide, setActiveGuide] = useState<StudyGuide | null>(null);

  return (
    <>
      <section id="stories" className="py-16 lg:py-24 bg-[#F5F7FB] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[#DC1E25] mb-2">
                Student Voices &amp; Placements
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
                Trusted by Students Placed Across UK, Italy, and Germany
              </h2>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex items-center gap-4 self-start lg:self-auto">
              <div className="flex items-center gap-0.5 text-[#D4A017]" aria-label="4.9 out of 5 stars">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <Star key={idx} className="w-4 h-4 fill-[#D4A017] text-[#D4A017]" />
                ))}
              </div>
              <div className="text-xs">
                <p className="font-display font-bold text-[#0B2249]">
                  Rated Excellent · 4.9 / 5
                </p>
                <p className="text-slate-500">Verified Student Placements</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {STUDENT_STORIES.map((story) => (
              <article
                key={story.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <ResilientImage
                        src={story.portrait}
                        alt={`Portrait of ${story.studentName}`}
                        fallbackTitle={story.studentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-[#0B2249] truncate">
                        {story.studentName}
                      </h3>
                      <p className="text-xs text-slate-600 truncate">
                        {story.degree} · {story.university}
                      </p>
                      <p className="text-xs text-[#DC1E25] font-semibold mt-0.5">
                        {story.countryName} · {story.intakeYear}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-sm leading-relaxed">
                    <div>
                      <p className="font-semibold text-[#0B2249] mb-0.5">Challenge</p>
                      <p className="text-slate-600">{story.beforeSummary}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B2249] mb-0.5">Placement Outcome</p>
                      <p className="text-slate-700">{story.outcomeSummary}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <span className="font-semibold text-[#0B2249]">Compliance Note: </span>
                  <span>{story.advisorNote}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-10 border-t border-slate-200">
            <div className="lg:col-span-5">
              <p className="text-sm font-bold text-[#DC1E25] mb-2">
                Frequently Asked Questions
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B2249] mb-4">
                Clear Answers Before You Start
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                International admissions involve country-specific financial rules, language waivers,
                and embassy portals. Review our most frequently asked questions before booking your
                session.
              </p>
            </div>

            <div className="lg:col-span-7 divide-y divide-slate-200 bg-white border border-slate-200 rounded-2xl">
              {FAQS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="p-5 sm:p-6">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                      className="w-full flex items-start justify-between gap-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1E25] rounded"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#DC1E25] mb-1">
                          {faq.category}
                        </p>
                        <span className="font-display text-base font-bold text-[#0B2249]">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 shrink-0 mt-1 transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-bold text-[#DC1E25] mb-2">
              Resources &amp; Study Guides
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
              Prepare Your SOP, Credibility Interview &amp; Budget
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDY_GUIDES.map((guide) => (
              <article
                key={guide.id}
                className="bg-[#F5F7FB] border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:bg-white hover:border-[#0B2249]/40 transition-colors"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="font-bold text-[#DC1E25]">{guide.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{guide.readTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>{guide.updatedLabel}</span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#0B2249] mb-3 leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {guide.excerpt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveGuide(guide)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B2249] hover:text-[#DC1E25] transition-colors cursor-pointer self-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC1E25] rounded"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Full Guide
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {activeGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2249]/80 p-4 sm:p-6"
          onClick={() => setActiveGuide(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-bold text-[#DC1E25]">{activeGuide.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeGuide.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeGuide.updatedLabel}</span>
                </div>
                <h3
                  id="guide-modal-title"
                  className="font-display text-2xl font-bold text-[#0B2249]"
                >
                  {activeGuide.title}
                </h3>
              </div>

              <button
                type="button"
                aria-label="Close guide"
                onClick={() => setActiveGuide(null)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              {activeGuide.sections.map((section) => (
                <div key={section.heading}>
                  <h4 className="font-display text-base font-bold text-[#0B2249] mb-2">
                    {section.heading}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#F5F7FB] border border-slate-200 rounded-xl p-5 mb-6">
              <h4 className="font-display text-sm font-bold text-[#0B2249] mb-3">
                Pre-Submission Checklist
              </h4>
              <ul className="space-y-2">
                {activeGuide.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckSquare className="w-4 h-4 text-[#DC1E25] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0B2249] hover:bg-[#14336B] rounded-xl transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
