import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Calendar, X } from 'lucide-react';
import { JOURNAL_ENTRIES, JournalEntry } from '../data/consultancyData';

interface JournalSectionProps {
  onBookFromJournal: (topicNote: string) => void;
}

export function JournalSection({ onBookFromJournal }: JournalSectionProps) {
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (!activeEntry) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveEntry(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeEntry]);

  return (
    <section className="py-16 lg:py-20 bg-[#F5F7FB] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#DC1E25] mb-2">
              SMU Editorial Journal · Placeholder Dispatches
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
              Admissions Briefings, Visa Timelines &amp; Test Prep Journal
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-sm">
            Curated journal slots ready for monthly student briefings, intake notices, and
            scholarship bulletins from SM Usman’s Academy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {JOURNAL_ENTRIES.map((entry, idx) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#0B2249]/40 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
                  <span className="font-bold text-[#DC1E25]">{entry.category}</span>
                  <span className="font-mono">{entry.readTime}</span>
                </div>

                <p className="font-mono text-[11px] uppercase tracking-wide text-slate-400 mb-2">
                  {entry.issueLabel}
                </p>

                <h3 className="font-display text-lg sm:text-xl font-bold text-[#0B2249] leading-snug mb-3">
                  {entry.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">{entry.summary}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {entry.publishedDate}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveEntry(entry)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2249] hover:text-[#DC1E25] transition-colors cursor-pointer"
                >
                  Read Journal
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {activeEntry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="journal-modal-title"
          className="fixed inset-0 z-50 bg-[#0B2249]/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveEntry(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
              <div>
                <p className="text-xs font-bold text-[#DC1E25] mb-1">
                  {activeEntry.issueLabel} · {activeEntry.category}
                </p>
                <h3
                  id="journal-modal-title"
                  className="font-display text-xl sm:text-2xl font-extrabold text-[#0B2249] leading-snug"
                >
                  {activeEntry.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5">
                  {activeEntry.publishedDate} · {activeEntry.readTime}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close journal article"
                onClick={() => setActiveEntry(null)}
                className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0B2249] hover:bg-slate-100 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed mb-8">
              {activeEntry.body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                <BookOpen className="w-4 h-4 text-[#0B2249]" />
                SMU Consultants Editorial Dispatch
              </span>

              <button
                type="button"
                onClick={() => {
                  const topic = `Journal Inquiry: ${activeEntry.title}`;
                  setActiveEntry(null);
                  onBookFromJournal(topic);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors cursor-pointer"
              >
                Discuss This Pathway With Advisor
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
