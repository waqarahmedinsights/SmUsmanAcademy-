import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';
import { PageRoute } from '../data/consultancyData';
import {
  FAQ_TOPIC_OPTIONS,
  FaqCategory,
  FaqItem,
  normalizeFaqCategory,
} from '../data/siteConfigDefaults';
import { useSiteContent } from '../context/SiteContentContext';
import { SocialBrandIcon } from './SocialBrandIcon';

interface FaqSectionProps {
  onNavigate?: (page: PageRoute) => void;
  defaultTopic?: 'All' | FaqCategory;
}

const FAQ_FILTER_TOPICS: Array<'All' | FaqCategory> = ['All', ...FAQ_TOPIC_OPTIONS];

export function FaqSection({ onNavigate, defaultTopic = 'All' }: FaqSectionProps) {
  const { config, loading } = useSiteContent();

  const normalizedFaqs = useMemo<FaqItem[]>(() => {
    return (config.faqs ?? []).map((item) => ({
      ...item,
      category: normalizeFaqCategory(item.category, item.question),
    }));
  }, [config.faqs]);

  const waNumber = config.socialLinks.whatsappNumber;
  const waDisplay = config.socialLinks.whatsappDisplay;

  const [selectedCategory, setSelectedCategory] = useState<'All' | FaqCategory>(defaultTopic);
  const [openFaqId, setOpenFaqId] = useState<string | null>(normalizedFaqs[0]?.id ?? null);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { All: normalizedFaqs.length };
    for (const topic of FAQ_TOPIC_OPTIONS) {
      counts[topic] = 0;
    }
    for (const item of normalizedFaqs) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, [normalizedFaqs]);

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === 'All') return normalizedFaqs;
    return normalizedFaqs.filter((item) => item.category === selectedCategory);
  }, [normalizedFaqs, selectedCategory]);

  const groupedByTopic = useMemo(() => {
    if (selectedCategory !== 'All') {
      return [{ topic: selectedCategory, items: filteredFaqs }];
    }
    const groups: { topic: FaqCategory; items: FaqItem[] }[] = [];
    for (const topic of FAQ_TOPIC_OPTIONS) {
      const items = filteredFaqs.filter((f) => f.category === topic);
      if (items.length > 0) {
        groups.push({ topic, items });
      }
    }
    return groups;
  }, [filteredFaqs, selectedCategory]);

  const activeOpenId =
    openFaqId && filteredFaqs.some((f) => f.id === openFaqId)
      ? openFaqId
      : filteredFaqs[0]?.id ?? null;

  return (
    <section
      id="study-abroad-faqs"
      className="py-16 lg:py-20 bg-[#F5F7FB] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Sticky Summary & Topic Filter Controls */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div>
              <p className="text-sm font-bold text-[#DC1E25] mb-2">
                Student Advisory Desk · Categorized by Topic
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3">
                Filter questions by topic—General, UK, Germany, Italy, Cyprus, IELTS &amp; PTE, or
                Fees &amp; Scholarships—for instant answers.
              </p>
            </div>

            {/* Interactive Topic Filter Tabs */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Filter by Topic
              </p>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="FAQ topic filters">
                {FAQ_FILTER_TOPICS.map((topic) => {
                  const active = selectedCategory === topic;
                  const count = topicCounts[topic] ?? 0;
                  if (topic !== 'All' && count === 0) return null;
                  return (
                    <button
                      key={topic}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(topic)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#0B2249] text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-[#0B2249]/40 hover:text-[#0B2249]'
                      }`}
                    >
                      <span>{topic}</span>
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded tabular-nums ${
                          active ? 'bg-white/15 text-[#FBBF24]' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Guidance Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-[#DC1E25] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-base font-bold text-[#0B2249]">
                    Have a Specific Profile Question?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                    Speak directly with Sir SM Usman’s admissions team for a 1-on-1 profile review
                    for 2026–2028 intakes.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('apply')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC1E25] hover:bg-[#B9151B] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Free Eligibility Check
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    'Assalam-o-Alaikum SMU Consultants! I have a study abroad / IELTS-PTE question.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  <SocialBrandIcon platform="whatsapp" className="w-4 h-4" />
                  WhatsApp ({waDisplay})
                </a>
              </div>
            </div>
          </div>

          {/* Right Categorized Topic Accordion Groups */}
          <div className="lg:col-span-7 space-y-6">
            {loading && normalizedFaqs.length === 0 ? (
              <div className="space-y-3" aria-busy="true">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-20 rounded-2xl bg-white border border-slate-200 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
                <p className="font-display text-base font-bold text-[#0B2249]">
                  No questions listed under {selectedCategory} yet
                </p>
                <p className="text-xs sm:text-sm text-slate-600">
                  Switch back to All Topics or message our counsellors on WhatsApp ({waDisplay}).
                </p>
              </div>
            ) : (
              groupedByTopic.map((group) => (
                <div key={group.topic} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0B2249] uppercase tracking-wide flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DC1E25]" aria-hidden="true" />
                      <span>{group.topic}</span>
                    </h3>
                    <span className="font-mono text-xs text-slate-500 font-semibold tabular-nums">
                      {group.items.length} {group.items.length === 1 ? 'Question' : 'Questions'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {group.items.map((item, idx) => {
                      const isOpen = activeOpenId === item.id;
                      const indexLabel = String(idx + 1).padStart(2, '0');
                      return (
                        <div
                          key={item.id}
                          className={`bg-white rounded-2xl border transition-colors ${
                            isOpen
                              ? 'border-[#0B2249]/35 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={`faq-panel-${item.id}`}
                            onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                            className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-4 cursor-pointer"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <span className="font-mono font-bold text-[#DC1E25] tabular-nums">
                                  {indexLabel}.
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{item.category}</span>
                              </div>
                              <h4 className="font-display text-sm sm:text-base font-bold text-[#0B2249] leading-snug">
                                {item.question}
                              </h4>
                            </div>
                            <ChevronDown
                              className={`w-5 h-5 text-[#0B2249] shrink-0 mt-1 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-[#DC1E25]' : ''
                              }`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                id={`faq-panel-${item.id}`}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                                className="px-5 sm:px-6 pb-5 pt-1 border-t border-slate-100"
                              >
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                  {item.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
