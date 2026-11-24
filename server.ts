import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const LEAD_RECEIVER_EMAIL = process.env.LEAD_RECEIVER_EMAIL || '88smusman@gmail.com';

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

const FEATURED_SOCIAL_POSTS: SocialPostItem[] = [
  {
    id: 'fb-ielts-batch',
    platform: 'facebook',
    author: "SM Usman's Academy",
    handle: 'facebook.com/ielts.preparation.karachi',
    postedAt: 'Latest Featured Update',
    category: 'On-Campus & Online Batches',
    caption:
      'New IELTS Academic, General Training, UKVI & PTE batches starting across Gulshan-e-Iqbal, North Nazimabad, and Shahrah-e-Faisal campuses. Book your free diagnostic assessment & demo class today! WhatsApp: +92 332 3502864.',
    permalink: 'https://www.facebook.com/ielts.preparation.karachi/',
    mediaUrl: '/assets/aistudio/images__1__019fbafc.jfif',
  },
  {
    id: 'ig-band-results',
    platform: 'instagram',
    author: 'SM Usman Academy',
    handle: '@smusmanacademy',
    postedAt: 'Recent Student Milestone',
    category: 'UK & Europe Admissions',
    caption:
      'Achieve Band 8.0–8.5 in IELTS and secure direct admissions with merit scholarships to partner universities in the UK, Germany, Italy & Cyprus. Zero agency fees for student profiling.',
    permalink: 'https://www.instagram.com/smusmanacademy',
    mediaUrl: '/src/assets/images/hero_student_portrait_1795499585372.jpg',
  },
  {
    id: 'fb-british-council',
    platform: 'facebook',
    author: "SM Usman's Academy",
    handle: 'facebook.com/ielts.preparation.karachi',
    postedAt: 'Academy Recognition',
    category: 'British Council Award',
    caption:
      'Honored with the British Council Highest Volume Contributor Award (South Region). Over 17 years of trusted English test coaching and international student guidance in Karachi.',
    permalink: 'https://www.facebook.com/ielts.preparation.karachi/',
    mediaUrl: '/src/assets/images/counsellor_advising_1795499585062.jpg',
  },
];

interface StoredLead {
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
}

const recentLeads: StoredLead[] = [];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // 1. Live Social Media Feed Endpoint (Meta Graph API + Featured Fallback)
  app.get('/api/social-feed', async (_req, res) => {
    const token = process.env.META_ACCESS_TOKEN?.trim();
    const fbPageId = process.env.FB_PAGE_ID?.trim();
    const igUserId = process.env.IG_USER_ID?.trim();

    if (token && (fbPageId || igUserId)) {
      try {
        const livePosts: SocialPostItem[] = [];

        if (fbPageId) {
          const fbUrl = `https://graph.facebook.com/v21.0/${encodeURIComponent(
            fbPageId
          )}/posts?fields=id,message,created_time,permalink_url,full_picture&limit=3&access_token=${encodeURIComponent(
            token
          )}`;
          const fbResp = await fetch(fbUrl);
          if (fbResp.ok) {
            const fbJson = (await fbResp.json()) as {
              data?: Array<{
                id: string;
                message?: string;
                created_time?: string;
                permalink_url?: string;
                full_picture?: string;
              }>;
            };
            for (const p of fbJson.data ?? []) {
              if (!p.message) continue;
              livePosts.push({
                id: `fb-${p.id}`,
                platform: 'facebook',
                author: "SM Usman's Academy",
                handle: 'facebook.com/ielts.preparation.karachi',
                postedAt: p.created_time
                  ? new Date(p.created_time).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Recent Post',
                category: 'Facebook Update',
                caption: p.message,
                permalink:
                  p.permalink_url || 'https://www.facebook.com/ielts.preparation.karachi/',
                mediaUrl: p.full_picture || '/assets/aistudio/images__1__019fbafc.jfif',
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
            const igJson = (await igResp.json()) as {
              data?: Array<{
                id: string;
                caption?: string;
                media_url?: string;
                thumbnail_url?: string;
                permalink?: string;
                timestamp?: string;
              }>;
            };
            for (const item of igJson.data ?? []) {
              livePosts.push({
                id: `ig-${item.id}`,
                platform: 'instagram',
                author: 'SM Usman Academy',
                handle: '@smusmanacademy',
                postedAt: item.timestamp
                  ? new Date(item.timestamp).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Recent Post',
                category: 'Instagram Update',
                caption: item.caption || 'Latest campus & IELTS highlight from @smusmanacademy',
                permalink: item.permalink || 'https://www.instagram.com/smusmanacademy',
                mediaUrl:
                  item.thumbnail_url ||
                  item.media_url ||
                  '/src/assets/images/hero_student_portrait_1795499585372.jpg',
              });
            }
          }
        }

        if (livePosts.length > 0) {
          return res.json({
            mode: 'live',
            syncedAt: new Date().toISOString(),
            posts: livePosts.slice(0, 6),
          });
        }
      } catch (err) {
        console.error('Meta Graph API sync error:', err);
      }
    }

    return res.json({
      mode: 'featured',
      syncedAt: new Date().toISOString(),
      posts: FEATURED_SOCIAL_POSTS,
    });
  });

  // 2. Lead Capture & Email Dispatch to 88smusman@gmail.com
  app.post('/api/leads', async (req, res) => {
    const body = req.body as Partial<StoredLead>;
    const fullName = String(body.fullName ?? '').trim();
    const email = String(body.email ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const country = String(body.country ?? 'uk').trim();
    const studyLevel = String(body.studyLevel ?? 'Postgraduate').trim();
    const discipline = String(body.discipline ?? 'General').trim();
    const intake = String(body.intake ?? 'Upcoming Intake').trim();
    const englishStatus = String(body.englishStatus ?? '').trim();
    const notes = String(body.notes ?? '').trim();
    const source = String(body.source ?? 'Website Consultation Form').trim();

    if (fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 7) {
      return res.status(400).json({
        ok: false,
        error: 'Valid full name, email address, and WhatsApp/phone number are required.',
      });
    }

    const referenceId = `SMU-${country.toUpperCase()}-${Math.floor(
      100000 + Math.random() * 899999
    )}`;
    const leadRecord: StoredLead = {
      referenceId,
      submittedAt: new Date().toISOString(),
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
    };

    recentLeads.unshift(leadRecord);
    if (recentLeads.length > 100) recentLeads.pop();

    let emailDelivered = false;
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    const smtpHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT || 465);

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"SMU Consultants Portal" <${smtpUser}>`,
          to: LEAD_RECEIVER_EMAIL,
          replyTo: email,
          subject: `[SMU Lead ${referenceId}] ${fullName} — ${country.toUpperCase()} (${studyLevel})`,
          text: [
            `New Student Inquiry (${referenceId})`,
            `Source: ${source}`,
            `Name: ${fullName}`,
            `Email: ${email}`,
            `WhatsApp / Phone: ${phone}`,
            `Target Country: ${country.toUpperCase()}`,
            `Study Level: ${studyLevel}`,
            `Discipline: ${discipline}`,
            `Target Intake: ${intake}`,
            englishStatus ? `English Status: ${englishStatus}` : '',
            notes ? `Notes: ${notes}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
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
              <tr><td><strong>Target Intake</strong></td><td>${escapeHtml(intake)}</td></tr>
              <tr><td><strong>English Status</strong></td><td>${escapeHtml(englishStatus || 'Not specified')}</td></tr>
              <tr><td><strong>Notes</strong></td><td>${escapeHtml(notes || 'None')}</td></tr>
            </table>
          `,
        });
        emailDelivered = true;
      } catch (mailError) {
        console.error('SMTP delivery error:', mailError);
      }
    }

    return res.json({
      ok: true,
      referenceId,
      targetEmail: LEAD_RECEIVER_EMAIL,
      emailDelivered,
    });
  });

  // 3. Server-Side Gemini AI Advisor Chatbot Proxy
  app.post('/api/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return res.status(503).json({
        error:
          'AI advisor is not configured yet. Please ensure GEMINI_API_KEY is set in Settings > Secrets, or message us directly on WhatsApp +92 332 3502864.',
      });
    }

    const { message, history } = req.body as {
      message?: string;
      history?: Array<{ role: 'user' | 'model'; text: string }>;
    };

    const cleanMessage = String(message ?? '').trim();
    if (!cleanMessage) {
      return res.status(400).json({ error: 'Please enter a question for the advisor.' });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const conversationContext = (history ?? [])
        .slice(-6)
        .map((turn) => `${turn.role === 'user' ? 'Student' : 'Advisor'}: ${turn.text}`)
        .join('\n');

      const prompt = conversationContext
        ? `${conversationContext}\nStudent: ${cleanMessage}`
        : cleanMessage;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction: `You are the official Study Abroad & IELTS Admissions AI Advisor for SMU Consultants (smuconsultant.com) and SM Usman's Academy (ielts-smusman.com), established in 2007 in Karachi, Pakistan.
Keep responses crisp, structured, friendly, and accurate (under 140 words unless detailed breakdown is requested).
Facts you must follow:
- Study Destinations (2026, 2027 & 2028 intakes open): United Kingdom (£13,500–£21,000/yr tuition, 2-year Graduate Route), Germany (€0 public university tuition to €12,500 private, €11,904 Blocked Account, 18-month Job Seeker visa), Italy (€1,200–€4,800/yr, DSU regional scholarships cover tuition/housing), Cyprus (€3,400–€7,800/yr, 5–7 day offers).
- Zero agency service fees for student counselling and partner university applications.
- Test Prep & Official Exam Registration at SM Usman's Academy: IELTS (Academic, General, UKVI, Life Skills A1 — British Council & IDP desk), PTE Academic, Duolingo English Test (DET), TOEFL iBT, OET Healthcare, and Spoken English — Regular, Fast-Track, Weekend, and Online batches. British Council Highest Volume Contributor Award (South Region).
- Karachi Campuses:
  1. Gulshan-e-Iqbal (Head Office): Office 108, 1st Floor, Gulshan Trade Centre, Block 5 (Above MCB Bank) — +92 332 3502864.
  2. Shahrah-e-Faisal: Office 111, 1st Floor, Marine Faisal Building, PECHS Block 6 (Main Nursery Bus Stop) — +92 313 0240636.
  3. North Nazimabad Campus: Alama Iqbal Town / Nazimabad Corridor — +92 311 2406781.
- Direct WhatsApp: +92 332 3502864 | Official Email: 88smusman@gmail.com.
Never invent fake partner guarantees or promise guaranteed visa outcomes. Always invite the student to book a free check, reserve a demo/exam slot, or message WhatsApp +92 332 3502864.`,
        },
      });

      const replyText =
        response.text?.trim() ||
        'I can help you compare UK, Germany, Italy, or Cyprus admissions (2026–2028) and IELTS/PTE/DET batches or exam bookings. Message WhatsApp +92 332 3502864 or email 88smusman@gmail.com.';

      return res.json({ reply: replyText });
    } catch (err) {
      console.error('Gemini API error:', err);
      const errMsg = err instanceof Error ? err.message : 'Unable to reach AI advisor.';
      return res.status(502).json({
        error: `AI advisor error: ${errMsg}. You can still reach our human advisors immediately on WhatsApp +92 332 3502864.`,
      });
    }
  });

  // 4. SEO Crawlers: robots.txt & sitemap.xml
  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL?.trim() || `${req.protocol}://${req.get('host')}`;
    res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (process.env.APP_URL?.trim() || `${req.protocol}://${req.get('host')}`).replace(
      /\/$/,
      ''
    );
    const routes = [
      '',
      '#destinations',
      '#services',
      '#book-exam',
      '#about',
      '#guides',
      '#apply',
      '#test-ielts',
      '#test-pte',
      '#test-duolingo',
      '#test-toefl',
      '#test-oet',
      '#test-english',
    ];
    const urlEntries = routes
      .map(
        (r) => `  <url>
    <loc>${baseUrl}/${r}</loc>
    <changefreq>weekly</changefreq>
    <priority>${r === '' ? '1.0' : '0.8'}</priority>
  </url>`
      )
      .join('\n');

    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`
    );
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SMU Consultants server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
