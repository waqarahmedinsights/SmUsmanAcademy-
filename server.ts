import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  buildFaqChatReply,
  DEFAULT_CAMPUS_LOCATIONS,
  DEFAULT_SITE_CONFIG,
  extractYouTubeVideoId,
  normalizeFaqCategory,
  type SiteConfig,
  type StoredLeadRecord,
} from './src/data/siteConfigDefaults.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');
const SITE_CONFIG_FILE = path.resolve(DATA_DIR, 'site-config.json');
const LEADS_FILE = path.resolve(DATA_DIR, 'leads.json');
const ADMIN_AUTH_FILE = path.resolve(DATA_DIR, 'admin-auth.json');
const SMTP_CONFIG_FILE = path.resolve(DATA_DIR, 'smtp-config.json');

// Session signing key kept strictly in process memory or env var (never hardcoded or written to disk)
const SESSION_SIGNING_KEY =
  process.env.ADMIN_SESSION_SECRET?.trim() || crypto.randomBytes(32).toString('hex');

interface AdminAuthRecord {
  salt: string;
  passwordHash: string;
  updatedAt: string;
}

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

function resolveInsideDir(baseDir: string, fileName: string): string {
  const safeBase = path.basename(fileName);
  const resolved = path.resolve(baseDir, safeBase);
  if (!resolved.startsWith(baseDir + path.sep)) {
    throw new Error('Invalid file path');
  }
  return resolved;
}

async function ensureStorageDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

function isSafeUrlOrPath(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('/')) {
    return !trimmed.startsWith('//');
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function sanitizeUrl(raw: string, fallback: string): string {
  const val = String(raw ?? '').trim();
  return val && isSafeUrlOrPath(val) ? val : fallback;
}

async function readSiteConfig(): Promise<SiteConfig> {
  try {
    const raw = await fs.readFile(SITE_CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<SiteConfig>;
    const legacyCampuses = Array.isArray(parsed.demoSchedule?.campuses)
      ? parsed.demoSchedule.campuses
      : DEFAULT_SITE_CONFIG.demoSchedule.campuses;
    const legacyDays = Array.isArray(parsed.demoSchedule?.shahrahDays)
      ? parsed.demoSchedule.shahrahDays
      : DEFAULT_SITE_CONFIG.demoSchedule.shahrahDays;
    const legacyTimings = Array.isArray(parsed.demoSchedule?.timingSlots)
      ? parsed.demoSchedule.timingSlots
      : DEFAULT_SITE_CONFIG.demoSchedule.timingSlots;

    const campusSchedules =
      Array.isArray(parsed.campusSchedules) && parsed.campusSchedules.length > 0
        ? parsed.campusSchedules.map((c, idx) => ({
            id: String(c.id || `campus-${idx}`),
            campusName: String(c.campusName || `Campus ${idx + 1}`).trim(),
            days: Array.isArray(c.days) && c.days.length > 0 ? c.days : legacyDays,
            timingSlots:
              Array.isArray(c.timingSlots) && c.timingSlots.length > 0
                ? c.timingSlots
                : legacyTimings,
          }))
        : legacyCampuses.map((name, idx) => {
            const matched = DEFAULT_SITE_CONFIG.campusSchedules.find(
              (d) => d.campusName.toLowerCase() === name.toLowerCase()
            );
            return {
              id: matched?.id || `campus-${idx}`,
              campusName: name,
              days: matched?.days ?? legacyDays,
              timingSlots: matched?.timingSlots ?? legacyTimings,
            };
          });

    return {
      updatedAt: parsed.updatedAt || DEFAULT_SITE_CONFIG.updatedAt,
      socialLinks: {
        ...DEFAULT_SITE_CONFIG.socialLinks,
        ...(parsed.socialLinks ?? {}),
      },
      megaOffer: {
        ...DEFAULT_SITE_CONFIG.megaOffer,
        ...(parsed.megaOffer ?? {}),
        imageUrl: sanitizeUrl(
          parsed.megaOffer?.imageUrl ?? DEFAULT_SITE_CONFIG.megaOffer.imageUrl,
          DEFAULT_SITE_CONFIG.megaOffer.imageUrl
        ),
        inclusions: Array.isArray(parsed.megaOffer?.inclusions)
          ? parsed.megaOffer.inclusions
          : DEFAULT_SITE_CONFIG.megaOffer.inclusions,
      },
      customOffers: Array.isArray(parsed.customOffers)
        ? parsed.customOffers
        : DEFAULT_SITE_CONFIG.customOffers,
      campusSchedules,
      campusLocations:
        Array.isArray(parsed.campusLocations) && parsed.campusLocations.length > 0
          ? parsed.campusLocations.map((loc, idx) => ({
              id: String(loc.id || `branch-${idx}`),
              name: String(loc.name || `Campus ${idx + 1}`).trim(),
              role: String(loc.role || 'Study Abroad & Test Prep').trim(),
              address: String(loc.address || '').trim(),
              landmark: String(loc.landmark || '').trim(),
              hours: String(loc.hours || '').trim(),
              phone: String(loc.phone || '').trim(),
              lat: Number.isFinite(Number(loc.lat)) ? Number(loc.lat) : 24.9235146,
              lng: Number.isFinite(Number(loc.lng)) ? Number(loc.lng) : 67.0919263,
              mapsUrl: sanitizeUrl(loc.mapsUrl || '', DEFAULT_CAMPUS_LOCATIONS[0].mapsUrl),
              googlePlaceQuery: String(loc.googlePlaceQuery || loc.name || '').trim(),
            }))
          : DEFAULT_CAMPUS_LOCATIONS,
      demoSchedule: {
        campuses: campusSchedules.map((c) => c.campusName),
        shahrahDays: campusSchedules[0]?.days ?? legacyDays,
        timingSlots: Array.from(
          new Set(campusSchedules.flatMap((c) => c.timingSlots))
        ),
      },
      awardsAndPictures: {
        ...DEFAULT_SITE_CONFIG.awardsAndPictures,
        ...(parsed.awardsAndPictures ?? {}),
      },
      studentTestimonialVideos: Array.isArray(parsed.studentTestimonialVideos)
        ? parsed.studentTestimonialVideos
        : DEFAULT_SITE_CONFIG.studentTestimonialVideos,
      sirUsmanShorts: Array.isArray(parsed.sirUsmanShorts)
        ? parsed.sirUsmanShorts
        : DEFAULT_SITE_CONFIG.sirUsmanShorts,
      textTestimonials: Array.isArray(parsed.textTestimonials)
        ? parsed.textTestimonials
        : DEFAULT_SITE_CONFIG.textTestimonials,
      resultCards: Array.isArray(parsed.resultCards)
        ? parsed.resultCards
        : DEFAULT_SITE_CONFIG.resultCards,
      faqs:
        Array.isArray(parsed.faqs) && parsed.faqs.length > 0
          ? parsed.faqs.map((f, idx) => ({
              id: String(f.id || `faq-${idx}`),
              category: normalizeFaqCategory(f.category, f.question),
              question: String(f.question || '').trim(),
              answer: String(f.answer || '').trim(),
            }))
          : DEFAULT_SITE_CONFIG.faqs,
    };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

async function writeSiteConfig(config: SiteConfig): Promise<void> {
  await ensureStorageDirs();
  await fs.writeFile(SITE_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

async function readLeads(): Promise<StoredLeadRecord[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredLeadRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeLeads(leads: StoredLeadRecord[]): Promise<void> {
  await ensureStorageDirs();
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads.slice(0, 500), null, 2), 'utf-8');
}

async function readAdminAuth(): Promise<AdminAuthRecord | null> {
  try {
    const raw = await fs.readFile(ADMIN_AUTH_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<AdminAuthRecord>;
    if (parsed.salt && parsed.passwordHash) {
      return {
        salt: parsed.salt,
        passwordHash: parsed.passwordHash,
        updatedAt: parsed.updatedAt || '',
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function writeAdminAuth(record: AdminAuthRecord): Promise<void> {
  await ensureStorageDirs();
  await fs.writeFile(ADMIN_AUTH_FILE, JSON.stringify(record, null, 2), 'utf-8');
}

interface SmtpSettingsRecord {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  updatedAt: string;
}

async function readSmtpSettings(): Promise<SmtpSettingsRecord & { usingEnvFallback: boolean }> {
  const envUser = process.env.SMTP_USER?.trim() || '';
  const envPass = process.env.SMTP_PASS?.trim() || '';
  const envHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
  const envPort = Number(process.env.SMTP_PORT || 465);

  try {
    const raw = await fs.readFile(SMTP_CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<SmtpSettingsRecord>;
    const user = String(parsed.user ?? envUser).trim();
    const pass = String(parsed.pass ?? envPass).trim();
    const port = Number(parsed.port || envPort || 465);
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : Boolean(user && pass),
      host: String(parsed.host || envHost || 'smtp.gmail.com').trim(),
      port,
      secure: typeof parsed.secure === 'boolean' ? parsed.secure : port === 465,
      user,
      pass,
      fromName: String(parsed.fromName || 'SMU Consultants Portal').trim(),
      updatedAt: String(parsed.updatedAt || ''),
      usingEnvFallback: Boolean(!parsed.user && envUser && !parsed.pass && envPass),
    };
  } catch {
    return {
      enabled: Boolean(envUser && envPass),
      host: envHost,
      port: envPort,
      secure: envPort === 465,
      user: envUser,
      pass: envPass,
      fromName: 'SMU Consultants Portal',
      updatedAt: '',
      usingEnvFallback: Boolean(envUser && envPass),
    };
  }
}

async function writeSmtpSettings(record: SmtpSettingsRecord): Promise<void> {
  await ensureStorageDirs();
  await fs.writeFile(SMTP_CONFIG_FILE, JSON.stringify(record, null, 2), 'utf-8');
}

function hashPasswordScrypt(password: string, saltHex: string): Buffer {
  return crypto.scryptSync(password, saltHex, 64);
}

function verifyScryptPassword(password: string, record: AdminAuthRecord): boolean {
  const computed = hashPasswordScrypt(password, record.salt);
  const stored = Buffer.from(record.passwordHash, 'hex');
  if (computed.length !== stored.length) return false;
  return crypto.timingSafeEqual(computed, stored);
}

function verifyEnvPassword(candidate: string, envPass: string): boolean {
  const a = Buffer.from(candidate, 'utf8');
  const b = Buffer.from(envPass, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function issueAdminBearerToken(): string {
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 12 * 60 * 60 * 1000,
    nonce: crypto.randomBytes(8).toString('hex'),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SIGNING_KEY)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyAdminBearerToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [encoded, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SIGNING_KEY)
    .update(encoded)
    .digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return payload.role === 'admin' && typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, error: 'Admin authentication required.' });
  }
  const token = authHeader.slice(7).trim();
  if (!verifyAdminBearerToken(token)) {
    return res.status(401).json({ ok: false, error: 'Session expired or invalid. Please log in again.' });
  }
  next();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function startServer() {
  await ensureStorageDirs();
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Serve uploaded images safely in both dev & production
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Public Site Config Read Endpoint (CMS-backed, always fresh)
  app.get('/api/site-config', async (_req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    const config = await readSiteConfig();
    res.json({ ok: true, config });
  });

  // Admin Auth Status & Setup/Login Routes
  app.get('/api/admin/auth/status', async (req, res) => {
    const envPassword = process.env.ADMIN_PASSWORD?.trim();
    const stored = await readAdminAuth();
    const authHeader = req.headers.authorization || '';
    const authenticated =
      authHeader.startsWith('Bearer ') && verifyAdminBearerToken(authHeader.slice(7).trim());

    res.json({
      ok: true,
      initialized: Boolean(envPassword || stored),
      usingEnvSecret: Boolean(envPassword),
      authenticated,
    });
  });

  app.post('/api/admin/auth/setup', async (req, res) => {
    const envPassword = process.env.ADMIN_PASSWORD?.trim();
    if (envPassword) {
      return res.status(409).json({
        ok: false,
        error: 'Admin password is already configured via server environment.',
      });
    }
    const existing = await readAdminAuth();
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: 'Admin account is already initialized. Please sign in.',
      });
    }

    const password = String((req.body as { password?: string })?.password ?? '');
    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        error: 'Please choose an admin password of at least 6 characters.',
      });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashHex = hashPasswordScrypt(password, salt).toString('hex');
    await writeAdminAuth({
      salt,
      passwordHash: hashHex,
      updatedAt: new Date().toISOString(),
    });

    const token = issueAdminBearerToken();
    return res.json({ ok: true, token });
  });

  app.post('/api/admin/auth/login', async (req, res) => {
    const password = String((req.body as { password?: string })?.password ?? '');
    if (!password) {
      return res.status(400).json({ ok: false, error: 'Password is required.' });
    }

    const envPassword = process.env.ADMIN_PASSWORD?.trim();
    if (envPassword) {
      if (!verifyEnvPassword(password, envPassword)) {
        return res.status(401).json({ ok: false, error: 'Incorrect admin password.' });
      }
      return res.json({ ok: true, token: issueAdminBearerToken() });
    }

    const stored = await readAdminAuth();
    if (!stored) {
      return res.status(400).json({
        ok: false,
        error: 'Admin account not set up yet. Create your password first.',
      });
    }

    if (!verifyScryptPassword(password, stored)) {
      return res.status(401).json({ ok: false, error: 'Incorrect admin password.' });
    }

    return res.json({ ok: true, token: issueAdminBearerToken() });
  });

  app.post('/api/admin/auth/change-password', requireAdminAuth, async (req, res) => {
    const envPassword = process.env.ADMIN_PASSWORD?.trim();
    if (envPassword) {
      return res.status(400).json({
        ok: false,
        error: 'ADMIN_PASSWORD is managed via Settings > Secrets. Update it there.',
      });
    }

    const newPassword = String((req.body as { newPassword?: string })?.newPassword ?? '');
    if (newPassword.length < 6) {
      return res.status(400).json({
        ok: false,
        error: 'New password must be at least 6 characters.',
      });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashHex = hashPasswordScrypt(newPassword, salt).toString('hex');
    await writeAdminAuth({
      salt,
      passwordHash: hashHex,
      updatedAt: new Date().toISOString(),
    });
    return res.json({ ok: true });
  });

  // Protected Admin Leads Endpoints
  app.get('/api/admin/leads', requireAdminAuth, async (_req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    const leads = await readLeads();
    res.json({ ok: true, leads });
  });

  // Protected Admin SMTP Email Setup Endpoints
  app.get('/api/admin/smtp', requireAdminAuth, async (_req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
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
        receiverEmail: process.env.LEAD_RECEIVER_EMAIL?.trim() || cfg.socialLinks.leadEmail,
      },
    });
  });

  app.put('/api/admin/smtp', requireAdminAuth, async (req, res) => {
    const body = req.body as Partial<SmtpSettingsRecord>;
    const current = await readSmtpSettings();
    const port = Number(body.port ?? current.port) || 587;
    const secure = port === 465 ? true : port === 587 ? false : Boolean(body.secure);
    const nextRecord: SmtpSettingsRecord = {
      enabled: typeof body.enabled === 'boolean' ? body.enabled : current.enabled,
      host: String(body.host ?? current.host).trim() || 'mail.smuconsultant.com',
      port,
      secure,
      user: String(body.user ?? current.user).trim(),
      pass:
        typeof body.pass === 'string' && body.pass.trim().length > 0
          ? body.pass.trim()
          : current.pass,
      fromName: String(body.fromName ?? current.fromName).trim() || 'SMU Consultants Portal',
      updatedAt: new Date().toISOString(),
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
        updatedAt: nextRecord.updatedAt,
      },
    });
  });

  app.post('/api/admin/smtp/test', requireAdminAuth, async (req, res) => {
    const smtp = await readSmtpSettings();
    const cfg = await readSiteConfig();
    const body = req.body as { testTo?: string };
    const receiverEmail =
      String(body?.testTo || '').trim() ||
      process.env.LEAD_RECEIVER_EMAIL?.trim() ||
      cfg.socialLinks.leadEmail ||
      '88smusman@gmail.com';

    if (!smtp.user || !smtp.pass) {
      return res.status(400).json({
        ok: false,
        error: 'Enter SMTP Email and Password first, then click Save SMTP Settings.',
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465 ? true : smtp.port === 587 ? false : smtp.secure,
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
      });
      await transporter.sendMail({
        from: `"${smtp.fromName}" <${smtp.user}>`,
        to: receiverEmail,
        subject: `[SMU Test Email] Lead Routing Verified (${new Date().toLocaleTimeString()})`,
        text: `Your SMU Consultants Admin SMTP email setup works cleanly! New student leads submitted on the website will arrive at ${receiverEmail}.`,
        html: `<p><strong>SMU Consultants SMTP Test Passed!</strong></p><p>New student leads submitted on your website will automatically arrive at <strong>${escapeHtml(receiverEmail)}</strong>.</p>`,
      });
      return res.json({
        ok: true,
        message: `Test email delivered successfully to ${receiverEmail}!`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'SMTP connection failed.';
      return res.status(502).json({
        ok: false,
        error: `SMTP Error: ${msg} (Check host, port 587 STARTTLS / 465 SSL, username & password.)`,
      });
    }
  });

  app.patch('/api/admin/leads/:referenceId', requireAdminAuth, async (req, res) => {
    const referenceId = String(req.params.referenceId ?? '').trim();
    const status = (req.body as { status?: StoredLeadRecord['status'] })?.status;
    const validStatuses: Array<StoredLeadRecord['status']> = [
      'New',
      'Contacted',
      'Demo Scheduled',
      'Enrolled',
    ];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ ok: false, error: 'Invalid lead status.' });
    }

    const leads = await readLeads();
    const idx = leads.findIndex((l) => l.referenceId === referenceId);
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: 'Lead not found.' });
    }
    leads[idx] = { ...leads[idx], status };
    await writeLeads(leads);
    return res.json({ ok: true, lead: leads[idx] });
  });

  app.delete('/api/admin/leads/:referenceId', requireAdminAuth, async (req, res) => {
    const referenceId = String(req.params.referenceId ?? '').trim();
    const leads = await readLeads();
    const filtered = leads.filter((l) => l.referenceId !== referenceId);
    await writeLeads(filtered);
    return res.json({ ok: true });
  });

  // Protected Admin Config Update Endpoint
  app.put('/api/admin/config', requireAdminAuth, async (req, res) => {
    const body = (req.body as { config?: Partial<SiteConfig> })?.config;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ ok: false, error: 'Invalid configuration payload.' });
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
      )
        .replace(/[^\d]/g, '')
        .trim(),
      helplinePhone: String(
        body.socialLinks?.helplinePhone ?? current.socialLinks.helplinePhone
      ).trim(),
      leadEmail: String(body.socialLinks?.leadEmail ?? current.socialLinks.leadEmail).trim(),
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
      ),
    };

    const validSegments = new Set([
      'ielts',
      'pte',
      'duolingo',
      'toefl',
      'oet',
      'english',
      'consultancy',
    ]);
    const validPages = new Set([
      'home',
      'test-ielts',
      'test-pte',
      'test-duolingo',
      'test-toefl',
      'test-oet',
      'test-english',
      'guides',
    ]);
    const sanitizeSegment = (val: unknown) =>
      typeof val === 'string' && validSegments.has(val)
        ? (val as SiteConfig['resultCards'][number]['segment'])
        : undefined;
    const sanitizePages = (val: unknown) =>
      Array.isArray(val)
        ? (val.filter(
            (p): p is NonNullable<SiteConfig['resultCards'][number]['visibleOnPages']>[number] =>
              typeof p === 'string' && validPages.has(p)
          ))
        : undefined;

    const sanitizeVideos = (
      list: SiteConfig['studentTestimonialVideos'] | undefined,
      category: 'testimonial' | 'sir-usman',
      fallback: SiteConfig['studentTestimonialVideos']
    ) => {
      if (!Array.isArray(list)) return fallback;
      return list
        .map((v, idx) => {
          const url = sanitizeUrl(v.youtubeUrl || '', '');
          const vid = extractYouTubeVideoId(url || v.videoId || '') || v.videoId;
          return {
            id: String(v.id || `${category}-${Date.now()}-${idx}`),
            videoId: vid,
            category,
            badge: String(v.badge || 'YouTube Short').trim(),
            title: String(v.title || 'SM Usman Academy Video').trim(),
            summary: String(v.summary || '').trim(),
            viewsLabel: String(v.viewsLabel || '@smusmanacademy').trim(),
            youtubeUrl: url || (vid ? `https://youtube.com/shorts/${vid}` : ''),
            segment: sanitizeSegment(v.segment),
            visibleOnPages: sanitizePages(v.visibleOnPages),
          };
        })
        .filter((v) => v.videoId);
    };

    const sanitizedCampusSchedules = Array.isArray(body.campusSchedules)
      ? body.campusSchedules
          .map((c, idx) => ({
            id: String(c.id || `campus-${Date.now()}-${idx}`),
            campusName: String(c.campusName || '').trim(),
            days: Array.isArray(c.days)
              ? c.days.map((d) => String(d).trim()).filter(Boolean)
              : [],
            timingSlots: Array.isArray(c.timingSlots)
              ? c.timingSlots.map((t) => String(t).trim()).filter(Boolean)
              : [],
          }))
          .filter((c) => c.campusName.length > 0)
      : current.campusSchedules;

    const sanitizedLocations = Array.isArray(body.campusLocations)
      ? body.campusLocations
          .map((loc, idx) => ({
            id: String(loc.id || `branch-${Date.now()}-${idx}`),
            name: String(loc.name || '').trim(),
            role: String(loc.role || 'Study Abroad & Test Prep').trim(),
            address: String(loc.address || '').trim(),
            landmark: String(loc.landmark || '').trim(),
            hours: String(loc.hours || '').trim(),
            phone: String(loc.phone || '').trim(),
            lat: Number.isFinite(Number(loc.lat)) ? Number(loc.lat) : 24.9235146,
            lng: Number.isFinite(Number(loc.lng)) ? Number(loc.lng) : 67.0919263,
            mapsUrl: sanitizeUrl(loc.mapsUrl || '', DEFAULT_CAMPUS_LOCATIONS[0].mapsUrl),
            googlePlaceQuery: String(loc.googlePlaceQuery || loc.name || '').trim(),
          }))
          .filter((loc) => loc.name.length > 0)
      : current.campusLocations;

    const updatedConfig: SiteConfig = {
      updatedAt: new Date().toISOString(),
      socialLinks: sanitizedSocial,
      megaOffer: {
        enabled:
          typeof body.megaOffer?.enabled === 'boolean'
            ? body.megaOffer.enabled
            : current.megaOffer.enabled,
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
        inclusions: Array.isArray(body.megaOffer?.inclusions)
          ? body.megaOffer.inclusions.map((i) => String(i).trim()).filter(Boolean)
          : current.megaOffer.inclusions,
      },
      customOffers: Array.isArray(body.customOffers)
        ? body.customOffers
            .map((o, idx) => ({
              id: String(o.id || `offer-${Date.now()}-${idx}`),
              enabled: typeof o.enabled === 'boolean' ? o.enabled : true,
              badge: String(o.badge || 'Special Offer').trim(),
              title: String(o.title || 'New Course Offer').trim(),
              duration: String(o.duration || '').trim(),
              classDuration: String(o.classDuration || '').trim(),
              frequency: String(o.frequency || '').trim(),
              timings: String(o.timings || '').trim(),
              originalFee: String(o.originalFee || '').trim(),
              discountedFee: String(o.discountedFee || '').trim(),
              imageUrl: sanitizeUrl(o.imageUrl || '', current.awardsAndPictures.pteScorecardsUrl),
              inclusions: Array.isArray(o.inclusions)
                ? o.inclusions.map((i) => String(i).trim()).filter(Boolean)
                : [],
            }))
            .filter((o) => o.title.length > 0)
        : current.customOffers,
      campusSchedules: sanitizedCampusSchedules,
      campusLocations:
        sanitizedLocations.length > 0 ? sanitizedLocations : current.campusLocations,
      demoSchedule: {
        campuses: sanitizedCampusSchedules.map((c) => c.campusName),
        shahrahDays:
          sanitizedCampusSchedules[0]?.days.length > 0
            ? sanitizedCampusSchedules[0].days
            : current.demoSchedule.shahrahDays,
        timingSlots: Array.from(
          new Set(sanitizedCampusSchedules.flatMap((c) => c.timingSlots))
        ),
      },
      awardsAndPictures: sanitizedAwards,
      studentTestimonialVideos: sanitizeVideos(
        body.studentTestimonialVideos,
        'testimonial',
        current.studentTestimonialVideos
      ),
      sirUsmanShorts: sanitizeVideos(
        body.sirUsmanShorts,
        'sir-usman',
        current.sirUsmanShorts
      ),
      textTestimonials: Array.isArray(body.textTestimonials)
        ? body.textTestimonials.map((t, idx) => ({
            id: String(t.id || `story-${Date.now()}-${idx}`),
            studentName: String(t.studentName || 'Student Achiever').trim(),
            scoreAchieved: String(t.scoreAchieved || '').trim(),
            testOrTrack: String(t.testOrTrack || '').trim(),
            destinationOrCampus: String(t.destinationOrCampus || '').trim(),
            intakeLabel: String(t.intakeLabel || '').trim(),
            outcomeTag: String(t.outcomeTag || '').trim(),
            quote: String(t.quote || '').trim(),
            image: sanitizeUrl(t.image || '', current.awardsAndPictures.pteScorecardsUrl),
            segment: sanitizeSegment(t.segment),
            visibleOnPages: sanitizePages(t.visibleOnPages),
          }))
        : current.textTestimonials,
      resultCards: Array.isArray(body.resultCards)
        ? body.resultCards.map((r, idx) => ({
            id: String(r.id || `res-${Date.now()}-${idx}`),
            studentName: String(r.studentName || 'Student Scorecard').trim(),
            scoreLabel: String(r.scoreLabel || '').trim(),
            testType: String(r.testType || '').trim(),
            image: sanitizeUrl(r.image || '', current.awardsAndPictures.pteScorecardsUrl),
            highlight: String(r.highlight || '').trim(),
            segment: sanitizeSegment(r.segment),
            visibleOnPages: sanitizePages(r.visibleOnPages),
          }))
        : current.resultCards,
      faqs: Array.isArray(body.faqs)
        ? body.faqs
            .map((f, idx) => ({
              id: String(f.id || `faq-${Date.now()}-${idx}`),
              category: normalizeFaqCategory(f.category, f.question),
              question: String(f.question || '').trim(),
              answer: String(f.answer || '').trim(),
            }))
            .filter((f) => f.question.length > 0 && f.answer.length > 0)
        : current.faqs,
    };

    await writeSiteConfig(updatedConfig);
    return res.json({ ok: true, config: updatedConfig });
  });

  app.post('/api/admin/reset-config', requireAdminAuth, async (_req, res) => {
    const resetCopy: SiteConfig = {
      ...DEFAULT_SITE_CONFIG,
      updatedAt: new Date().toISOString(),
    };
    await writeSiteConfig(resetCopy);
    return res.json({ ok: true, config: resetCopy });
  });

  // Protected Image Upload Endpoint (Stores safely under /public/uploads/)
  app.post('/api/admin/upload', requireAdminAuth, async (req, res) => {
    const body = req.body as {
      fileName?: string;
      mimeType?: string;
      dataBase64?: string;
    };

    const mimeMap: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };

    const mime = String(body.mimeType ?? '').toLowerCase();
    const ext = mimeMap[mime];
    if (!ext) {
      return res.status(400).json({
        ok: false,
        error: 'Only PNG, JPG, WEBP, or GIF images are allowed.',
      });
    }

    const base64Clean = String(body.dataBase64 ?? '').replace(/^data:image\/\w+;base64,/, '');
    if (!base64Clean) {
      return res.status(400).json({ ok: false, error: 'Image file data is empty.' });
    }

    const buffer = Buffer.from(base64Clean, 'base64');
    if (buffer.length > 6 * 1024 * 1024) {
      return res.status(400).json({
        ok: false,
        error: 'Image size must be 6 MB or smaller.',
      });
    }

    const safeFileName = `smu-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    const targetPath = resolveInsideDir(UPLOADS_DIR, safeFileName);
    await fs.writeFile(targetPath, buffer);

    return res.json({
      ok: true,
      url: `/uploads/${safeFileName}`,
    });
  });

  // 1. Live Social Media Feed Endpoint (Meta Graph API + Dynamic Social Config Links)
  app.get('/api/social-feed', async (_req, res) => {
    const siteCfg = await readSiteConfig();
    const fbLink = siteCfg.socialLinks.facebookUrl;
    const igLink = siteCfg.socialLinks.instagramUrl;

    const featuredSocialPosts: SocialPostItem[] = [
      {
        id: 'fb-ielts-batch',
        platform: 'facebook',
        author: "SM Usman's Academy",
        handle: 'facebook.com/ielts.preparation.karachi',
        postedAt: 'Latest Featured Update',
        category: 'On-Campus & Online Batches',
        caption: `New IELTS, PTE (${siteCfg.megaOffer.discountedFee} Mega Offer), Duolingo & OET batches starting across Gulshan, Shahrah-e-Faisal, and Nazimabad. WhatsApp: ${siteCfg.socialLinks.whatsappDisplay}.`,
        permalink: fbLink,
        mediaUrl: siteCfg.awardsAndPictures.academyPosterUrl,
      },
      {
        id: 'ig-band-results',
        platform: 'instagram',
        author: 'SM Usman Academy',
        handle: '@smusmanacademy',
        postedAt: 'Recent Student Milestone',
        category: 'UK & Europe Admissions',
        caption:
          'Achieve Band 8.0–8.5 in IELTS or 89–90/90 in PTE and secure direct admissions with merit scholarships to partner universities in the UK, Germany, Italy & Cyprus.',
        permalink: igLink,
        mediaUrl: siteCfg.awardsAndPictures.heroStudentUrl,
      },
      {
        id: 'fb-british-council',
        platform: 'facebook',
        author: "SM Usman's Academy",
        handle: 'facebook.com/ielts.preparation.karachi',
        postedAt: 'Academy Recognition',
        category: 'British Council & Pearson Awards',
        caption:
          'Honored with the British Council Highest Volume Contributor Award (South Region) and Pearson PTE Rising Star Award 2025–2026.',
        permalink: fbLink,
        mediaUrl: siteCfg.awardsAndPictures.counsellorAdvisingUrl,
      },
    ];

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
                permalink: p.permalink_url || fbLink,
                mediaUrl: p.full_picture || siteCfg.awardsAndPictures.academyPosterUrl,
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
                permalink: item.permalink || igLink,
                mediaUrl:
                  item.thumbnail_url ||
                  item.media_url ||
                  siteCfg.awardsAndPictures.heroStudentUrl,
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
      posts: featuredSocialPosts,
    });
  });

  // 2. Lead Capture, Persistent Storage & Email Dispatch
  app.post('/api/leads', async (req, res) => {
    const siteCfg = await readSiteConfig();
    const receiverEmail =
      process.env.LEAD_RECEIVER_EMAIL?.trim() ||
      siteCfg.socialLinks.leadEmail ||
      '88smusman@gmail.com';

    const body = req.body as Partial<StoredLeadRecord>;
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
    const leadRecord: StoredLeadRecord = {
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
      status: 'New',
    };

    const smtp = await readSmtpSettings();
    let emailDelivered = false;
    let emailError: string | undefined;

    if (smtp.enabled && smtp.user && smtp.pass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port,
          secure: smtp.port === 465 ? true : smtp.port === 587 ? false : smtp.secure,
          auth: {
            user: smtp.user,
            pass: smtp.pass,
          },
        });

        await transporter.sendMail({
          from: `"${smtp.fromName}" <${smtp.user}>`,
          to: receiverEmail,
          ...(smtp.user.toLowerCase() !== receiverEmail.toLowerCase() ? { bcc: smtp.user } : {}),
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
            `Target Intake / Slot: ${intake}`,
            englishStatus ? `English Status / Campus: ${englishStatus}` : '',
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
              <tr><td><strong>Intake / Slot</strong></td><td>${escapeHtml(intake)}</td></tr>
              <tr><td><strong>English / Campus</strong></td><td>${escapeHtml(englishStatus || 'Not specified')}</td></tr>
              <tr><td><strong>Notes</strong></td><td>${escapeHtml(notes || 'None')}</td></tr>
            </table>
          `,
        });
        emailDelivered = true;
      } catch (mailError) {
        console.error('SMTP delivery error:', mailError);
        emailError = mailError instanceof Error ? mailError.message : 'SMTP delivery failed';
      }
    } else {
      emailError = 'SMTP email not configured yet in Admin → Email & SMTP Setup';
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
      emailDelivered,
    });
  });

  // 3. Server-Side AI Advisor + Fixed FAQ Fallback Proxy
  app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body as {
      message?: string;
      history?: Array<{ role: 'user' | 'model'; text: string }>;
    };

    const cleanMessage = String(message ?? '').trim();
    if (!cleanMessage) {
      return res.status(400).json({ error: 'Please enter a question for the advisor.' });
    }

    const siteCfg = await readSiteConfig();
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return res.json({
        reply: buildFaqChatReply(cleanMessage, siteCfg),
        mode: 'faq',
      });
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
- Active Offer: ${siteCfg.megaOffer.title} (${siteCfg.megaOffer.discountedFee}, original ${siteCfg.megaOffer.originalFee}) — ${siteCfg.megaOffer.duration}, ${siteCfg.megaOffer.frequency}, ${siteCfg.megaOffer.timings}.
- Zero agency service fees for student counselling and partner university applications.
- Test Prep & Official Exam Registration at SM Usman's Academy: IELTS (Academic, General, UKVI, Life Skills A1 — British Council & IDP desk), PTE Academic (Pearson Rising Star Award 2025-2026), Duolingo English Test (DET), TOEFL iBT, OET Healthcare, and Spoken English. Direct vouchers: https://smusman.examism.com/.
- Karachi Campuses:
  1. Gulshan-e-Iqbal (Head Office): Office 108, 1st Floor, Gulshan Trade Centre, Block 5 (Above MCB Bank) — ${siteCfg.socialLinks.whatsappDisplay}.
  2. Shahrah-e-Faisal: Office 111, 1st Floor, Marine Faisal Building, PECHS Block 6 (Main Nursery Bus Stop) — ${siteCfg.socialLinks.helplinePhone}.
  3. North Nazimabad Campus: Alama Iqbal Town / Nazimabad Corridor — +92 311 2406781.
- Direct WhatsApp: ${siteCfg.socialLinks.whatsappDisplay} | Official Email: ${siteCfg.socialLinks.leadEmail}.
Never invent fake partner guarantees or promise guaranteed visa outcomes.`,
        },
      });

      const replyText =
        response.text?.trim() || buildFaqChatReply(cleanMessage, siteCfg);

      return res.json({ reply: replyText, mode: 'ai' });
    } catch (err) {
      console.error('Gemini API error (serving FAQ fallback):', err);
      return res.json({
        reply: buildFaqChatReply(cleanMessage, siteCfg),
        mode: 'faq',
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
    const { createServer: createViteServer } = await import('vite');
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
