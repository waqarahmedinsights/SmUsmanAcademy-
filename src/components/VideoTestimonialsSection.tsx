import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, Play, Video, X, Youtube } from 'lucide-react';
import {
  SIR_USMAN_YOUTUBE_SHORTS,
  STUDENT_VIDEO_TESTIMONIALS,
  YOUTUBE_CHANNEL_SHORTS_URL,
  YouTubeVideoItem,
} from '../data/consultancyData';

export function VideoTestimonialsSection() {
  const [activeTab, setActiveTab] = useState<'testimonials' | 'sir-usman'>('testimonials');
  const [activeVideo, setActiveVideo] = useState<YouTubeVideoItem | null>(null);

  useEffect(() => {
    if (!activeVideo) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideo(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeVideo]);

  const videos =
    activeTab === 'testimonials' ? STUDENT_VIDEO_TESTIMONIALS : SIR_USMAN_YOUTUBE_SHORTS;

  return (
    <section
      id="video-testimonials"
      className="py-16 lg:py-20 bg-[#0B2249] text-white border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FBBF24] mb-2">
              <Youtube className="w-4 h-4 text-[#DC1E25]" />
              <span>@smusmanacademy · Student Testimonials &amp; Sir SM Usman Shorts</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]">
              Watch Real Student Video Testimonials &amp; Sir SM Usman Tips
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Hear directly from our Band 7.0 – 8.0+ IELTS achievers and watch Sir SM Usman’s
              official coaching Shorts straight from YouTube.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={YOUTUBE_CHANNEL_SHORTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors whitespace-nowrap"
            >
              <Youtube className="w-4 h-4" />
              Watch All @smusmanacademy Shorts
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('testimonials')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'testimonials'
                ? 'bg-[#FBBF24] text-[#0B2249] shadow-md'
                : 'bg-[#071631] text-slate-200 border border-white/15 hover:border-white/40'
            }`}
          >
            <Video className="w-4 h-4" />
            Student Video Testimonials ({STUDENT_VIDEO_TESTIMONIALS.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sir-usman')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'sir-usman'
                ? 'bg-[#FBBF24] text-[#0B2249] shadow-md'
                : 'bg-[#071631] text-slate-200 border border-white/15 hover:border-white/40'
            }`}
          >
            <Youtube className="w-4 h-4" />
            Sir SM Usman Shorts &amp; Tips ({SIR_USMAN_YOUTUBE_SHORTS.length})
          </button>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-[#071631] border border-white/15 hover:border-[#FBBF24] rounded-2xl overflow-hidden flex flex-col justify-between transition-colors shadow-md"
            >
              <div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(item)}
                  aria-label={`Play YouTube Short: ${item.title}`}
                  className="group relative block w-full aspect-[16/10] overflow-hidden bg-black cursor-pointer"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071631]/90 via-[#071631]/25 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-[#DC1E25] text-white text-[11px] font-bold shadow-sm">
                      {item.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 text-[#FBBF24] font-mono text-[11px] font-semibold">
                      {item.viewsLabel}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-[#DC1E25] group-hover:bg-[#FBBF24] text-white group-hover:text-[#0B2249] flex items-center justify-center shadow-xl transition-colors">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </span>
                  </div>
                </button>

                <div className="p-5 space-y-2">
                  <h3 className="font-display text-base sm:text-lg font-extrabold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveVideo(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FBBF24] hover:text-white transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Play Video Here
                </button>
                <a
                  href={item.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-[#FBBF24] transition-colors"
                >
                  Open YouTube
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Inline YouTube Short Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#071631] border border-white/20 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            >
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#FBBF24] truncate">
                    {activeVideo.badge}
                  </p>
                  <p className="font-display text-sm font-bold text-white truncate">
                    {activeVideo.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  aria-label="Close video player"
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-[9/16] max-h-[68vh] w-full bg-black mx-auto">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="p-3 bg-[#0B2249] flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-300 truncate">{activeVideo.viewsLabel}</span>
                <a
                  href={activeVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#FBBF24] hover:underline shrink-0"
                >
                  Watch on YouTube
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
