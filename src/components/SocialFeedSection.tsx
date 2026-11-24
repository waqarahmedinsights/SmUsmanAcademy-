import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { FACEBOOK_PAGE_URL, INSTAGRAM_PROFILE_URL } from '../data/consultancyData';
import { ResilientImage } from './ResilientImage';

interface SocialPostItem {
  id: string;
  platform: 'facebook' | 'instagram';
  author: string;
  handle: string;
  postedAt: string;
  caption: string;
  permalink: string;
  mediaUrl: string;
  category: string;
}

interface SocialFeedResponse {
  mode: 'live' | 'featured';
  syncedAt: string;
  posts: SocialPostItem[];
}

export function SocialFeedSection() {
  const [posts, setPosts] = useState<SocialPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const resp = await fetch('/api/social-feed');
      if (resp.ok) {
        const data = (await resp.json()) as SocialFeedResponse;
        setPosts(data.posts);
      }
    } catch {
      // Fail gracefully without breaking layout
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFeed(false);
    const intervalId = window.setInterval(() => {
      loadFeed(false);
    }, 60000);
    return () => window.clearInterval(intervalId);
  }, [loadFeed]);

  return (
    <section className="py-16 lg:py-20 bg-[#F5F7FB] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#DC1E25] mb-2">
              Social Media Auto-Feed · Facebook &amp; Instagram
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B2249] [text-wrap:balance]">
              Latest Updates From SM Usman’s Academy &amp; Consultants
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#1465D1] rounded-xl transition-colors whitespace-nowrap"
            >
              Facebook Page
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#DC1E25] hover:bg-[#B9151B] rounded-xl transition-colors whitespace-nowrap"
            >
              @smusmanacademy
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => loadFeed(true)}
              aria-label="Sync latest social posts"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#0B2249] bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Sync Posts
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 h-80 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#0B2249]/40 transition-colors shadow-xs"
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <ResilientImage
                      src={post.mediaUrl}
                      alt={post.category}
                      fallbackTitle={post.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                      <span
                        className={`font-bold ${
                          post.platform === 'facebook' ? 'text-[#1877F2]' : 'text-[#DC1E25]'
                        }`}
                      >
                        {post.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.postedAt}</span>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">
                      {post.caption}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500 truncate">{post.handle}</span>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#0B2249] hover:text-[#DC1E25] shrink-0"
                  >
                    View Post
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
