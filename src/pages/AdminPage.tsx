import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  ExternalLink,
  Flame,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  MessageSquareQuote,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Share2,
  Shield,
  Trash2,
  Upload,
  Users,
  Video,
  X,
} from 'lucide-react';
import { PageRoute, StudentResultCard, YouTubeVideoItem, CyclingStudentTestimonial } from '../data/consultancyData';
import {
  AwardsAndPicturesConfig,
  extractYouTubeVideoId,
  SiteConfig,
  StoredLeadRecord,
} from '../data/siteConfigDefaults';
import { useSiteContent } from '../context/SiteContentContext';
import { ResilientImage } from '../components/ResilientImage';

interface AdminPageProps {
  onNavigate: (page: PageRoute) => void;
}

type AdminTab =
  | 'dashboard'
  | 'leads'
  | 'social'
  | 'offer'
  | 'videos'
  | 'stories'
  | 'media'
  | 'settings';

const NAV_ITEMS: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Student Leads', icon: Users },
  { id: 'social', label: 'Social Media Links', icon: Share2 },
  { id: 'offer', label: 'Mega Offer & Timings', icon: Flame },
  { id: 'videos', label: 'Video Testimonials', icon: Video },
  { id: 'stories', label: 'Student Stories', icon: MessageSquareQuote },
  { id: 'media', label: 'Pictures & Awards', icon: ImageIcon },
  { id: 'settings', label: 'Security & Reset', icon: Shield },
];

const PICTURE_FIELD_META: {
  key: keyof AwardsAndPicturesConfig;
  label: string;
  hint: string;
}[] = [
  { key: 'academyLogoUrl', label: 'Academy Main Logo', hint: 'Top bar & footer brand mark' },
  { key: 'sirUsmanPortraitUrl', label: 'Sir SM Usman Portrait', hint: 'Hero & trainer bio panels' },
  { key: 'britishCouncilAwardUrl', label: 'British Council Award Photo', hint: 'South Region recognition ceremony' },
  { key: 'pearsonTrophyUrl', label: 'Pearson Rising Star Trophy', hint: '2025–2026 crystal trophy close-up' },
  { key: 'pearsonStageUrl', label: 'Pearson Award Stage Photo', hint: 'Sir Usman receiving award on stage' },
  { key: 'pearsonCertificateUrl', label: 'Pearson Partners Certificate', hint: 'Official certificate gathering' },
  { key: 'pteScorecardsUrl', label: 'PTE 90/90 Scorecards Collage', hint: 'Mega offer splash & gallery' },
  { key: 'academyPosterUrl', label: 'Academy On-Campus Poster', hint: 'Demo booking right showcase' },
  { key: 'heroStudentUrl', label: 'Home Hero Main Student', hint: 'Primary portrait card' },
  { key: 'counsellorAdvisingUrl', label: 'Counsellor Advising Photo', hint: 'Hero collage top-right' },
  { key: 'heroCampusUrl', label: 'Hero University Campus', hint: 'Hero collage bottom-right' },
  { key: 'bannerTestPrepUrl', label: 'Banner: Test Preparation', hint: 'Auto-slider slide #2' },
  { key: 'bannerStudyConsultancyUrl', label: 'Banner: Study Consultancy', hint: 'Auto-slider slide #3' },
  { key: 'bannerOfficialExamUrl', label: 'Banner: Official Exam Desk', hint: 'Auto-slider slide #4' },
  { key: 'bannerFreeDemoUrl', label: 'Banner: Free Demo Today', hint: 'Auto-slider slide #5' },
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const { config, setLiveConfig, refreshConfig } = useSiteContent();

  // Bearer token kept strictly in component React memory (never persisted in browser storage)
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(true);
  const [usingEnvSecret, setUsingEnvSecret] = useState(false);

  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Admin Workspace State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [draft, setDraft] = useState<SiteConfig>(config);
  const [dirty, setDirty] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  // Leads State
  const [leads, setLeads] = useState<StoredLeadRecord[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('All');
  const [confirmDeleteRef, setConfirmDeleteRef] = useState<string | null>(null);

  // Settings / Password Change / Reset
  const [newPassword, setNewPassword] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  // Keep draft synced when config loads initially if not edited yet
  useEffect(() => {
    if (!dirty) {
      setDraft(config);
    }
  }, [config, dirty]);

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    setAuthChecking(true);
    try {
      const resp = await fetch('/api/admin/auth/status');
      if (resp.ok) {
        const data = (await resp.json()) as {
          initialized?: boolean;
          usingEnvSecret?: boolean;
        };
        setAuthInitialized(Boolean(data.initialized));
        setUsingEnvSecret(Boolean(data.usingEnvSecret));
      }
    } catch {
      setAuthError('Unable to reach server. Make sure server is running.');
    } finally {
      setAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const fetchLeads = useCallback(
    async (tokenOverride?: string) => {
      const tok = tokenOverride || bearerToken;
      if (!tok) return;
      setLeadsLoading(true);
      try {
        const resp = await fetch('/api/admin/leads', {
          headers: { Authorization: `Bearer ${tok}` },
        });
        if (resp.status === 401) {
          setBearerToken(null);
          return;
        }
        if (resp.ok) {
          const data = (await resp.json()) as { leads?: StoredLeadRecord[] };
          setLeads(Array.isArray(data.leads) ? data.leads : []);
        }
      } catch {
        showToast('error', 'Failed to fetch student leads.');
      } finally {
        setLeadsLoading(false);
      }
    },
    [bearerToken, showToast]
  );

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authInitialized) {
      if (passwordInput.length < 6) {
        setAuthError('Please choose a password of at least 6 characters.');
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setAuthError('Passwords do not match.');
        return;
      }
    } else if (!passwordInput) {
      setAuthError('Please enter your admin password.');
      return;
    }

    setAuthSubmitting(true);
    try {
      const endpoint = authInitialized ? '/api/admin/auth/login' : '/api/admin/auth/setup';
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = (await resp.json()) as { ok?: boolean; token?: string; error?: string };
      if (!resp.ok || !data.ok || !data.token) {
        setAuthError(data.error || 'Authentication failed.');
        return;
      }
      setBearerToken(data.token);
      setAuthInitialized(true);
      setPasswordInput('');
      setConfirmPasswordInput('');
      await fetchLeads(data.token);
      await refreshConfig();
    } catch {
      setAuthError('Network error connecting to admin server.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const updateDraft = (updater: (prev: SiteConfig) => SiteConfig) => {
    setDraft((prev) => updater(prev));
    setDirty(true);
  };

  const handleSaveConfig = async () => {
    if (!bearerToken) return;
    setSavingConfig(true);
    try {
      const resp = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ config: draft }),
      });
      if (resp.status === 401) {
        setBearerToken(null);
        return;
      }
      const data = (await resp.json()) as { ok?: boolean; config?: SiteConfig; error?: string };
      if (!resp.ok || !data.ok || !data.config) {
        showToast('error', data.error || 'Could not save changes.');
        return;
      }
      setDraft(data.config);
      setLiveConfig(data.config);
      setDirty(false);
      showToast('success', 'All changes saved and published live on website!');
    } catch {
      showToast('error', 'Failed to connect to server while saving.');
    } finally {
      setSavingConfig(false);
    }
  };

  const uploadImageAndApply = async (
    file: File,
    slotKey: string,
    onUrlReady: (uploadedUrl: string) => void
  ) => {
    if (!bearerToken) return;
    if (file.size > 6 * 1024 * 1024) {
      showToast('error', 'Please select an image smaller than 6 MB.');
      return;
    }
    setUploadingKey(slotKey);
    try {
      const dataBase64 = await fileToBase64(file);
      const resp = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          dataBase64,
        }),
      });
      const data = (await resp.json()) as { ok?: boolean; url?: string; error?: string };
      if (!resp.ok || !data.ok || !data.url) {
        showToast('error', data.error || 'Upload failed.');
        return;
      }
      onUrlReady(data.url);
      showToast('success', 'Image uploaded! Click "Save & Publish Changes" to go live.');
    } catch {
      showToast('error', 'Error reading or uploading image.');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleUpdateLeadStatus = async (
    referenceId: string,
    status: NonNullable<StoredLeadRecord['status']>
  ) => {
    if (!bearerToken) return;
    try {
      const resp = await fetch(`/api/admin/leads/${encodeURIComponent(referenceId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = (await resp.json()) as { ok?: boolean; lead?: StoredLeadRecord };
      if (resp.ok && data.ok && data.lead) {
        setLeads((prev) =>
          prev.map((l) => (l.referenceId === referenceId ? (data.lead as StoredLeadRecord) : l))
        );
        showToast('success', `Updated lead ${referenceId} to "${status}".`);
      }
    } catch {
      showToast('error', 'Could not update lead status.');
    }
  };

  const handleDeleteLead = async (referenceId: string) => {
    if (!bearerToken) return;
    try {
      const resp = await fetch(`/api/admin/leads/${encodeURIComponent(referenceId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      if (resp.ok) {
        setLeads((prev) => prev.filter((l) => l.referenceId !== referenceId));
        setConfirmDeleteRef(null);
        showToast('success', `Deleted lead ${referenceId}.`);
      }
    } catch {
      showToast('error', 'Could not delete lead.');
    }
  };

  const handleExportLeadsCsv = () => {
    const header = [
      'Reference ID',
      'Date',
      'Full Name',
      'Phone / WhatsApp',
      'Email',
      'Destination',
      'Program / Study Level',
      'Timing / Intake',
      'Campus / Mode',
      'Source',
      'Status',
      'Notes',
    ];
    const escapeCsv = (val: string) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = leads.map((l) => [
      l.referenceId,
      l.submittedAt,
      l.fullName,
      l.phone,
      l.email,
      l.country,
      l.studyLevel,
      l.intake,
      l.englishStatus || '',
      l.source || '',
      l.status || 'New',
      l.notes || '',
    ]);
    const csv = [header, ...rows].map((r) => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smu-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!bearerToken) return;
    if (newPassword.length < 6) {
      showToast('error', 'New password must be at least 6 characters.');
      return;
    }
    try {
      const resp = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = (await resp.json()) as { ok?: boolean; error?: string };
      if (!resp.ok || !data.ok) {
        showToast('error', data.error || 'Could not update password.');
        return;
      }
      setNewPassword('');
      showToast('success', 'Admin password updated successfully.');
    } catch {
      showToast('error', 'Connection error updating password.');
    }
  };

  const handleResetConfig = async () => {
    if (!bearerToken) return;
    try {
      const resp = await fetch('/api/admin/reset-config', {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      const data = (await resp.json()) as { ok?: boolean; config?: SiteConfig };
      if (resp.ok && data.ok && data.config) {
        setDraft(data.config);
        setLiveConfig(data.config);
        setDirty(false);
        setConfirmReset(false);
        showToast('success', 'Website configuration restored to original defaults.');
      }
    } catch {
      showToast('error', 'Failed to reset configuration.');
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus =
      leadStatusFilter === 'All' || (lead.status || 'New') === leadStatusFilter;
    const q = leadSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      lead.fullName.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      lead.studyLevel.toLowerCase().includes(q) ||
      lead.referenceId.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // 1. Auth Loading / Login Screen
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#071631] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#FBBF24] animate-spin mx-auto" />
          <p className="font-display text-lg font-bold">Loading SMU Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!bearerToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071631] via-[#0B2249] to-[#071631] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-[#0B2249] text-white px-6 py-5 border-b-4 border-[#DC1E25] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#FBBF24]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#FBBF24] uppercase tracking-wider">
                  SMU Consultants · CMS
                </p>
                <h1 className="font-display text-lg font-extrabold">
                  {authInitialized ? 'Admin Panel Sign In' : 'First-Time Admin Setup'}
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
            >
              Back to Site
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {authInitialized
                ? 'Sign in to manage social media links, YouTube Shorts, Mega Offers, student leads, awards, and campus timings.'
                : 'Set your initial Admin Panel password (minimum 6 characters). Once saved, your admin account will be protected by password login.'}
            </p>

            <div>
              <label htmlFor="adminPassInput" className="block text-xs font-bold text-[#0B2249] mb-1.5">
                {authInitialized ? 'Admin Password' : 'Create Admin Password'}
              </label>
              <input
                id="adminPassInput"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (min 6 chars)"
                className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25]"
              />
            </div>

            {!authInitialized && (
              <div>
                <label
                  htmlFor="adminPassConfirm"
                  className="block text-xs font-bold text-[#0B2249] mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="adminPassConfirm"
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2.5 min-h-11 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249] focus:outline-none focus:ring-2 focus:ring-[#DC1E25]"
                />
              </div>
            )}

            {authError && (
              <p
                role="alert"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700"
              >
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-3 min-h-11 rounded-xl bg-[#DC1E25] hover:bg-[#B9151B] disabled:opacity-60 text-white font-display text-sm font-bold transition-colors cursor-pointer"
            >
              {authSubmitting
                ? 'Please wait...'
                : authInitialized
                  ? 'Sign In to Admin Panel'
                  : 'Create Password & Enter Admin'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated Full Admin Shell with Left-Side Navigation Menu
  const newLeadCount = leads.filter((l) => !l.status || l.status === 'New').length;

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col lg:flex-row">
      {/* Left-Side Navigation Menu (Desktop Sticky Sidebar) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#071631] text-white flex flex-col justify-between border-r border-white/10 transition-transform duration-200 lg:static lg:translate-x-0 shrink-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={draft.awardsAndPictures.academyLogoUrl}
                alt="SMU Logo"
                className="w-10 h-10 rounded-lg bg-white p-0.5 object-contain shrink-0"
              />
              <div className="min-w-0">
                <p className="font-display text-sm font-extrabold text-white truncate">
                  SMU Admin Panel
                </p>
                <p className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-wider">
                  Easy Website Control
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close admin sidebar"
              className="lg:hidden p-1.5 rounded-lg bg-white/10 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Left Menu Links */}
          <nav className="p-3 space-y-1 flex-1" aria-label="Admin sections">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileNavOpen(false);
                    if (item.id === 'leads') fetchLeads();
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#DC1E25] text-white shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#FBBF24]' : ''}`} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.id === 'leads' && leads.length > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-[#FBBF24] text-[#0B2249] font-mono text-[10px] font-extrabold">
                      {leads.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#FBBF24]" />
            View Live Website
          </button>
          <button
            type="button"
            onClick={() => setBearerToken(null)}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-transparent hover:bg-red-500/20 text-xs font-semibold text-slate-300 hover:text-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Admin Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-[#0B2249] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-display text-base sm:text-lg font-extrabold text-[#0B2249] truncate">
                {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Edit any detail below and click Save &amp; Publish to update the live site immediately.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {dirty && (
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold">
                Unsaved changes
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={savingConfig}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer ${
                dirty
                  ? 'bg-[#DC1E25] hover:bg-[#B9151B] text-white'
                  : 'bg-[#0B2249] hover:bg-[#DC1E25] text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              {savingConfig ? 'Saving...' : 'Save & Publish'}
            </button>
          </div>
        </header>

        {/* Feedback Toast */}
        {toast && (
          <div
            role="status"
            className={`mx-4 sm:mx-6 lg:mx-8 mt-4 px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {toast.text}
            </span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 rounded hover:bg-black/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active Tab Workspace */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl w-full">
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-xs">
                  <p className="text-xs font-bold text-slate-500">Total Student Leads</p>
                  <p className="font-mono text-3xl font-extrabold text-[#0B2249]">{leads.length}</p>
                  <p className="text-xs font-semibold text-[#DC1E25]">
                    {newLeadCount} new inquiries awaiting contact
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-xs">
                  <p className="text-xs font-bold text-slate-500">Active PTE Mega Offer</p>
                  <p className="font-mono text-3xl font-extrabold text-[#0B2249]">
                    {draft.megaOffer.discountedFee}
                  </p>
                  <p className="text-xs font-semibold text-emerald-700">
                    {draft.megaOffer.enabled ? 'Visible on website' : 'Hidden on website'}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-xs">
                  <p className="text-xs font-bold text-slate-500">Video Testimonials &amp; Shorts</p>
                  <p className="font-mono text-3xl font-extrabold text-[#0B2249]">
                    {draft.studentTestimonialVideos.length + draft.sirUsmanShorts.length}
                  </p>
                  <p className="text-xs text-slate-500">YouTube Shorts cards active</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-xs">
                  <p className="text-xs font-bold text-slate-500">Awards &amp; Scorecards</p>
                  <p className="font-mono text-3xl font-extrabold text-[#0B2249]">
                    {draft.resultCards.length}
                  </p>
                  <p className="text-xs text-slate-500">Verified TRF &amp; Pearson awards</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="font-display text-lg font-extrabold text-[#0B2249]">
                  Quick Management Shortcuts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      tab: 'leads' as AdminTab,
                      title: 'View & Export Leads',
                      desc: 'Check new IELTS/PTE demo bookings & study abroad inquiries.',
                    },
                    {
                      tab: 'social' as AdminTab,
                      title: 'Update Social Links',
                      desc: 'Change Facebook, Instagram, YouTube, WhatsApp & lead email.',
                    },
                    {
                      tab: 'offer' as AdminTab,
                      title: 'Edit Offers & Timings',
                      desc: 'Modify Rs. 20,000 PTE offer, ribbon text, campuses & timing slots.',
                    },
                    {
                      tab: 'videos' as AdminTab,
                      title: 'Add YouTube Videos',
                      desc: 'Paste YouTube Shorts links for testimonials & Sir Usman tips.',
                    },
                    {
                      tab: 'media' as AdminTab,
                      title: 'Upload Pictures & Awards',
                      desc: 'Upload new photos, banners, Pearson awards & student TRF scorecards.',
                    },
                    {
                      tab: 'stories' as AdminTab,
                      title: 'Manage Student Stories',
                      desc: 'Update scrolling student achiever stories & quotes.',
                    },
                  ].map((card) => (
                    <button
                      key={card.tab}
                      type="button"
                      onClick={() => setActiveTab(card.tab)}
                      className="text-left p-4 rounded-xl bg-[#F5F7FB] hover:bg-[#0B2249] text-[#0B2249] hover:text-white border border-slate-200 transition-colors cursor-pointer group"
                    >
                      <p className="font-display text-sm font-bold">{card.title}</p>
                      <p className="text-xs text-slate-600 group-hover:text-slate-300 mt-1">
                        {card.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. STUDENT LEADS */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 flex flex-wrap items-center gap-2.5">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      placeholder="Search student name, phone, course, or ref ID..."
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F5F7FB] border border-slate-200 rounded-xl text-[#0B2249]"
                    />
                  </div>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs sm:text-sm bg-[#F5F7FB] border border-slate-200 rounded-xl font-semibold text-[#0B2249] cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Demo Scheduled">Demo Scheduled</option>
                    <option value="Enrolled">Enrolled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fetchLeads()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#0B2249] hover:bg-slate-100 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${leadsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button
                    type="button"
                    onClick={handleExportLeadsCsv}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B2249] hover:bg-[#DC1E25] text-white text-xs font-bold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>
              </div>

              {filteredLeads.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-display text-base font-bold text-[#0B2249]">
                    No leads match this filter yet
                  </p>
                  <p className="text-xs text-slate-500">
                    Every demo booking, exam inquiry, and free eligibility form submitted on the site
                    is stored here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLeads.map((lead) => {
                    const cleanWaPhone = lead.phone.replace(/[^\d]/g, '');
                    return (
                      <div
                        key={lead.referenceId}
                        className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono font-bold text-[#DC1E25]">
                              {lead.referenceId}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500">
                              {new Date(lead.submittedAt).toLocaleString()}
                            </span>
                            {lead.source && (
                              <span className="px-2 py-0.5 rounded bg-[#F5F7FB] text-[#0B2249] font-semibold">
                                {lead.source}
                              </span>
                            )}
                          </div>

                          <p className="font-display text-base font-extrabold text-[#0B2249]">
                            {lead.fullName}{' '}
                            <span className="font-mono text-xs font-semibold text-slate-600">
                              · {lead.phone} · {lead.email}
                            </span>
                          </p>

                          <p className="text-xs text-slate-700">
                            <strong className="text-[#0B2249]">{lead.studyLevel}</strong>
                            {lead.englishStatus ? ` · Location: ${lead.englishStatus}` : ''}
                            {lead.intake ? ` · Slot/Intake: ${lead.intake}` : ''}
                          </p>
                          {lead.notes && (
                            <p className="text-xs text-slate-500 break-words">{lead.notes}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <select
                            value={lead.status || 'New'}
                            onChange={(e) =>
                              handleUpdateLeadStatus(
                                lead.referenceId,
                                e.target.value as NonNullable<StoredLeadRecord['status']>
                              )
                            }
                            className="px-3 py-2 rounded-xl border border-slate-300 bg-[#F5F7FB] text-xs font-bold text-[#0B2249] cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Demo Scheduled">Demo Scheduled</option>
                            <option value="Enrolled">Enrolled</option>
                          </select>

                          {cleanWaPhone.length >= 7 && (
                            <a
                              href={`https://wa.me/${cleanWaPhone}?text=${encodeURIComponent(
                                `Assalam-o-Alaikum ${lead.fullName}! Thank you for contacting SMU Consultants / SM Usman's Academy (${lead.referenceId}).`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-bold whitespace-nowrap"
                            >
                              WhatsApp Reply
                            </a>
                          )}

                          {confirmDeleteRef === lead.referenceId ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteLead(lead.referenceId)}
                                className="px-2.5 py-2 rounded-xl bg-[#DC1E25] text-white text-xs font-bold cursor-pointer"
                              >
                                Confirm Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteRef(null)}
                                className="px-2.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              aria-label={`Delete lead ${lead.referenceId}`}
                              onClick={() => setConfirmDeleteRef(lead.referenceId)}
                              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-[#DC1E25] hover:border-red-200 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. SOCIAL MEDIA LINKS */}
          {activeTab === 'social' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
              <div>
                <h2 className="font-display text-lg font-extrabold text-[#0B2249]">
                  Social Media Links, WhatsApp &amp; Contact Routing
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Updates header, footer, video section, offer cards, social feed, and floating WhatsApp button.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'facebookUrl' as const, label: 'Facebook Page URL' },
                  { key: 'instagramUrl' as const, label: 'Instagram Profile URL' },
                  { key: 'youtubeChannelUrl' as const, label: 'YouTube Channel URL' },
                  { key: 'youtubeShortsUrl' as const, label: 'YouTube Shorts URL' },
                  { key: 'whatsappDisplay' as const, label: 'WhatsApp Display Text (e.g. +92 332 3502864)' },
                  { key: 'whatsappNumber' as const, label: 'WhatsApp Digits Only (e.g. 923323502864)' },
                  { key: 'helplinePhone' as const, label: 'Secondary Helpline Phone' },
                  { key: 'leadEmail' as const, label: 'Official Lead Receiver Email' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-bold text-[#0B2249] mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={draft.socialLinks[field.key]}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            [field.key]: val,
                          },
                        }));
                      }}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MEGA OFFER & DEMO TIMINGS */}
          {activeTab === 'offer' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-[#0B2249]">
                      Mega Offer &amp; Top Promo Ribbon
                    </h2>
                    <p className="text-xs text-slate-500">
                      Controls the top promo ribbon, floating offer button, modal splash, and PTE offer banner.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-[#F5F7FB] border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0B2249]">
                    <input
                      type="checkbox"
                      checked={draft.megaOffer.enabled}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          megaOffer: { ...prev.megaOffer, enabled: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 accent-[#DC1E25]"
                    />
                    Enable Offer Ribbon &amp; Splash
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#0B2249] mb-1.5">
                      Top Ribbon Scrolling / Banner Text
                    </label>
                    <input
                      type="text"
                      value={draft.megaOffer.ribbonText}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          megaOffer: { ...prev.megaOffer, ribbonText: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                    />
                  </div>

                  {[
                    { key: 'title' as const, label: 'Offer Title' },
                    { key: 'badge' as const, label: 'Offer Badge Label' },
                    { key: 'originalFee' as const, label: 'Original Fee' },
                    { key: 'discountedFee' as const, label: 'Discounted Fee' },
                    { key: 'duration' as const, label: 'Course Duration' },
                    { key: 'classDuration' as const, label: 'Class Duration' },
                    { key: 'frequency' as const, label: 'Frequency' },
                    { key: 'timings' as const, label: 'Timings' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-bold text-[#0B2249] mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={draft.megaOffer[field.key]}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => ({
                            ...prev,
                            megaOffer: { ...prev.megaOffer, [field.key]: val },
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#0B2249]">What’s Included Checklist</p>
                    <button
                      type="button"
                      onClick={() =>
                        updateDraft((prev) => ({
                          ...prev,
                          megaOffer: {
                            ...prev.megaOffer,
                            inclusions: [...prev.megaOffer.inclusions, 'New Benefit'],
                          },
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#DC1E25] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {draft.megaOffer.inclusions.map((inc, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={inc}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft((prev) => ({
                              ...prev,
                              megaOffer: {
                                ...prev.megaOffer,
                                inclusions: prev.megaOffer.inclusions.map((item, i) =>
                                  i === idx ? val : item
                                ),
                              },
                            }));
                          }}
                          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateDraft((prev) => ({
                              ...prev,
                              megaOffer: {
                                ...prev.megaOffer,
                                inclusions: prev.megaOffer.inclusions.filter((_, i) => i !== idx),
                              },
                            }))
                          }
                          className="p-2 text-slate-400 hover:text-[#DC1E25] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Campuses & Timing Slots */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                <h2 className="font-display text-lg font-extrabold text-[#0B2249]">
                  Campuses &amp; Preferred Timing Slots
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campuses */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#0B2249]">Campus / Location Options</p>
                      <button
                        type="button"
                        onClick={() =>
                          updateDraft((prev) => ({
                            ...prev,
                            demoSchedule: {
                              ...prev.demoSchedule,
                              campuses: [...prev.demoSchedule.campuses, 'New Campus'],
                            },
                          }))
                        }
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#DC1E25] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Campus
                      </button>
                    </div>
                    {draft.demoSchedule.campuses.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={c}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft((prev) => ({
                              ...prev,
                              demoSchedule: {
                                ...prev.demoSchedule,
                                campuses: prev.demoSchedule.campuses.map((item, i) =>
                                  i === idx ? val : item
                                ),
                              },
                            }));
                          }}
                          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateDraft((prev) => ({
                              ...prev,
                              demoSchedule: {
                                ...prev.demoSchedule,
                                campuses: prev.demoSchedule.campuses.filter((_, i) => i !== idx),
                              },
                            }))
                          }
                          className="p-2 text-slate-400 hover:text-[#DC1E25] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Timing Slots */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#0B2249]">
                        Timing Slots (Shown Below Location)
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          updateDraft((prev) => ({
                            ...prev,
                            demoSchedule: {
                              ...prev.demoSchedule,
                              timingSlots: [...prev.demoSchedule.timingSlots, '8:00 PM – 9:30 PM'],
                            },
                          }))
                        }
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#DC1E25] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Timing Slot
                      </button>
                    </div>
                    {draft.demoSchedule.timingSlots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={slot}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft((prev) => ({
                              ...prev,
                              demoSchedule: {
                                ...prev.demoSchedule,
                                timingSlots: prev.demoSchedule.timingSlots.map((item, i) =>
                                  i === idx ? val : item
                                ),
                              },
                            }));
                          }}
                          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateDraft((prev) => ({
                              ...prev,
                              demoSchedule: {
                                ...prev.demoSchedule,
                                timingSlots: prev.demoSchedule.timingSlots.filter(
                                  (_, i) => i !== idx
                                ),
                              },
                            }))
                          }
                          className="p-2 text-slate-400 hover:text-[#DC1E25] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. VIDEO TESTIMONIALS & SIR USMAN SHORTS */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              {(
                [
                  {
                    field: 'studentTestimonialVideos' as const,
                    heading: 'Student Video Testimonials (YouTube Shorts / Videos)',
                    category: 'testimonial' as const,
                  },
                  {
                    field: 'sirUsmanShorts' as const,
                    heading: 'Sir SM Usman Shorts & Coaching Tips',
                    category: 'sir-usman' as const,
                  },
                ] as const
              ).map((group) => (
                <div
                  key={group.field}
                  className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-lg font-extrabold text-[#0B2249]">
                      {group.heading}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        const newVid: YouTubeVideoItem = {
                          id: `${group.category}-${Date.now()}`,
                          videoId: 'Ha9ALk_Bg7c',
                          category: group.category,
                          badge: 'New Video',
                          title: 'New YouTube Testimonial / Tip',
                          summary: 'Add description here.',
                          viewsLabel: '@smusmanacademy',
                          youtubeUrl: 'https://youtube.com/shorts/Ha9ALk_Bg7c',
                        };
                        updateDraft((prev) => ({
                          ...prev,
                          [group.field]: [newVid, ...prev[group.field]],
                        }));
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B2249] hover:bg-[#DC1E25] text-white text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add YouTube Video
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {draft[group.field].map((video, idx) => (
                      <div
                        key={video.id}
                        className="p-4 rounded-xl bg-[#F5F7FB] border border-slate-200 space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-24 h-16 rounded-lg object-cover bg-slate-900 shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <label className="block text-[11px] font-bold text-[#0B2249]">
                              Paste YouTube URL or Shorts Link
                            </label>
                            <input
                              type="text"
                              value={video.youtubeUrl}
                              onChange={(e) => {
                                const url = e.target.value;
                                const extracted = extractYouTubeVideoId(url);
                                updateDraft((prev) => ({
                                  ...prev,
                                  [group.field]: prev[group.field].map((item, i) =>
                                    i === idx
                                      ? {
                                          ...item,
                                          youtubeUrl: url,
                                          videoId: extracted || item.videoId,
                                        }
                                      : item
                                  ),
                                }));
                              }}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                            />
                            <p className="font-mono text-[10px] text-slate-500">
                              Detected Video ID: <strong>{video.videoId || 'Invalid link'}</strong>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              updateDraft((prev) => ({
                                ...prev,
                                [group.field]: prev[group.field].filter((_, i) => i !== idx),
                              }))
                            }
                            aria-label="Delete video"
                            className="p-1.5 text-slate-400 hover:text-[#DC1E25] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Title"
                            value={video.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => ({
                                ...prev,
                                [group.field]: prev[group.field].map((item, i) =>
                                  i === idx ? { ...item, title: val } : item
                                ),
                              }));
                            }}
                            className="col-span-2 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                          />
                          <input
                            type="text"
                            placeholder="Badge (e.g. Band 8.0 Review)"
                            value={video.badge}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => ({
                                ...prev,
                                [group.field]: prev[group.field].map((item, i) =>
                                  i === idx ? { ...item, badge: val } : item
                                ),
                              }));
                            }}
                            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                          />
                          <input
                            type="text"
                            placeholder="Views label"
                            value={video.viewsLabel}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => ({
                                ...prev,
                                [group.field]: prev[group.field].map((item, i) =>
                                  i === idx ? { ...item, viewsLabel: val } : item
                                ),
                              }));
                            }}
                            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                          />
                          <textarea
                            rows={2}
                            placeholder="Short description"
                            value={video.summary}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => ({
                                ...prev,
                                [group.field]: prev[group.field].map((item, i) =>
                                  i === idx ? { ...item, summary: val } : item
                                ),
                              }));
                            }}
                            className="col-span-2 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 6. TEXT STUDENT STORIES */}
          {activeTab === 'stories' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-extrabold text-[#0B2249]">
                    Student Success Stories Carousel
                  </h2>
                  <p className="text-xs text-slate-500">
                    Controls the rotating student testimonials spotlight on the home page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newStory: CyclingStudentTestimonial = {
                      id: `story-${Date.now()}`,
                      studentName: 'New Student Achiever',
                      scoreAchieved: 'IELTS Band 8.0',
                      testOrTrack: 'IELTS Academic',
                      destinationOrCampus: 'Gulshan Campus, Karachi',
                      intakeLabel: '2026 Verified Result',
                      outcomeTag: 'Band 8.0 · Direct Admission Ready',
                      quote: 'Great coaching and personalized Speaking & Writing feedback!',
                      image: draft.awardsAndPictures.pteScorecardsUrl,
                    };
                    updateDraft((prev) => ({
                      ...prev,
                      textTestimonials: [newStory, ...prev.textTestimonials],
                    }));
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B2249] hover:bg-[#DC1E25] text-white text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Student Story
                </button>
              </div>

              <div className="space-y-4">
                {draft.textTestimonials.map((story, idx) => (
                  <div
                    key={story.id}
                    className="p-4 rounded-xl bg-[#F5F7FB] border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
                  >
                    <div className="md:col-span-3 space-y-2">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-white">
                        <ResilientImage
                          src={story.image}
                          alt={story.studentName}
                          fallbackTitle={story.studentName}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2249] hover:bg-[#DC1E25] text-white text-xs font-bold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingKey === `story-${story.id}` ? 'Uploading...' : 'Upload Photo'}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="hidden"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            uploadImageAndApply(f, `story-${story.id}`, (url) => {
                              updateDraft((prev) => ({
                                ...prev,
                                textTestimonials: prev.textTestimonials.map((s, i) =>
                                  i === idx ? { ...s, image: url } : s
                                ),
                              }));
                            });
                          }}
                        />
                      </label>
                    </div>

                    <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Student Name"
                        value={story.studentName}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => ({
                            ...prev,
                            textTestimonials: prev.textTestimonials.map((s, i) =>
                              i === idx ? { ...s, studentName: val } : s
                            ),
                          }));
                        }}
                        className="px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg font-bold text-[#0B2249]"
                      />
                      <input
                        type="text"
                        placeholder="Score Achieved (e.g. Band 8.0)"
                        value={story.scoreAchieved}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => ({
                            ...prev,
                            textTestimonials: prev.textTestimonials.map((s, i) =>
                              i === idx ? { ...s, scoreAchieved: val } : s
                            ),
                          }));
                        }}
                        className="px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                      />
                      <input
                        type="text"
                        placeholder="Track / Exam"
                        value={story.testOrTrack}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => ({
                            ...prev,
                            textTestimonials: prev.textTestimonials.map((s, i) =>
                              i === idx ? { ...s, testOrTrack: val } : s
                            ),
                          }));
                        }}
                        className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                      />
                      <input
                        type="text"
                        placeholder="Campus or University"
                        value={story.destinationOrCampus}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => ({
                            ...prev,
                            textTestimonials: prev.textTestimonials.map((s, i) =>
                              i === idx ? { ...s, destinationOrCampus: val } : s
                            ),
                          }));
                        }}
                        className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                      />
                      <input
                        type="text"
                        placeholder="Outcome Tag"
                        value={story.outcomeTag}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => ({
                            ...prev,
                            textTestimonials: prev.textTestimonials.map((s, i) =>
                              i === idx ? { ...s, outcomeTag: val } : s
                            ),
                          }));
                        }}
                        className="sm:col-span-2 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                      />
                      <textarea
                        rows={2}
                        placeholder="Student Quote"
                        value={story.quote}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => ({
                            ...prev,
                            textTestimonials: prev.textTestimonials.map((s, i) =>
                              i === idx ? { ...s, quote: val } : s
                            ),
                          }));
                        }}
                        className="sm:col-span-2 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                      />
                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            updateDraft((prev) => ({
                              ...prev,
                              textTestimonials: prev.textTestimonials.filter((_, i) => i !== idx),
                            }))
                          }
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#DC1E25] hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove Story
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PICTURES, AWARDS & RESULT SCORECARDS */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Website Pictures & Awards Uploader */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                <div>
                  <h2 className="font-display text-lg font-extrabold text-[#0B2249]">
                    Academy Pictures, Logo, Banners &amp; Award Photos
                  </h2>
                  <p className="text-xs text-slate-500">
                    Click “Upload New Picture” on any card to replace an award photo, banner, or logo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PICTURE_FIELD_META.map((item) => {
                    const currentUrl = draft.awardsAndPictures[item.key];
                    const busy = uploadingKey === `pic-${item.key}`;
                    return (
                      <div
                        key={item.key}
                        className="p-4 rounded-xl bg-[#F5F7FB] border border-slate-200 space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="aspect-[16/10] rounded-lg overflow-hidden bg-white border border-slate-200">
                            <ResilientImage
                              src={currentUrl}
                              alt={item.label}
                              fallbackTitle={item.label}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div>
                            <p className="font-display text-xs sm:text-sm font-bold text-[#0B2249]">
                              {item.label}
                            </p>
                            <p className="text-[11px] text-slate-500">{item.hint}</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          <input
                            type="text"
                            value={currentUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => ({
                                ...prev,
                                awardsAndPictures: {
                                  ...prev.awardsAndPictures,
                                  [item.key]: val,
                                },
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 text-[11px] bg-white border border-slate-300 rounded-lg text-slate-700 font-mono"
                          />
                          <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B2249] hover:bg-[#DC1E25] text-white text-xs font-bold cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            {busy ? 'Uploading...' : 'Upload New Picture'}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/gif"
                              className="hidden"
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                uploadImageAndApply(f, `pic-${item.key}`, (url) => {
                                  updateDraft((prev) => ({
                                    ...prev,
                                    awardsAndPictures: {
                                      ...prev.awardsAndPictures,
                                      [item.key]: url,
                                    },
                                  }));
                                });
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Result Scorecards & Awards Gallery */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-[#0B2249] flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#DC1E25]" />
                      Student Scorecards &amp; Award Cards Gallery
                    </h2>
                    <p className="text-xs text-slate-500">
                      Displayed across the Results Gallery and Test Detail pages.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newCard: StudentResultCard = {
                        id: `res-${Date.now()}`,
                        studentName: 'New Student Scorecard',
                        scoreLabel: 'Band 8.0 / PTE 85+',
                        testType: 'IELTS / PTE Academic',
                        image: draft.awardsAndPictures.pteScorecardsUrl,
                        highlight: 'Verified Official Score Report · SM Usman’s Academy',
                      };
                      updateDraft((prev) => ({
                        ...prev,
                        resultCards: [newCard, ...prev.resultCards],
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B2249] hover:bg-[#DC1E25] text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Scorecard / Award Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {draft.resultCards.map((card, idx) => (
                    <div
                      key={card.id}
                      className="p-4 rounded-xl bg-[#F5F7FB] border border-slate-200 flex gap-3 items-start"
                    >
                      <div className="w-28 space-y-2 shrink-0">
                        <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-white">
                          <ResilientImage
                            src={card.image}
                            alt={card.studentName}
                            fallbackTitle={card.studentName}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <label className="w-full inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-[#0B2249] hover:bg-[#DC1E25] text-white text-[11px] font-bold cursor-pointer">
                          <Upload className="w-3 h-3" />
                          {uploadingKey === `res-${card.id}` ? '...' : 'Upload'}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            className="hidden"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              uploadImageAndApply(f, `res-${card.id}`, (url) => {
                                updateDraft((prev) => ({
                                  ...prev,
                                  resultCards: prev.resultCards.map((r, i) =>
                                    i === idx ? { ...r, image: url } : r
                                  ),
                                }));
                              });
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex-1 space-y-2 min-w-0">
                        <input
                          type="text"
                          value={card.studentName}
                          placeholder="Student Name / Award Title"
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft((prev) => ({
                              ...prev,
                              resultCards: prev.resultCards.map((r, i) =>
                                i === idx ? { ...r, studentName: val } : r
                              ),
                            }));
                          }}
                          className="w-full px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={card.scoreLabel}
                            placeholder="Score Label"
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => ({
                                ...prev,
                                resultCards: prev.resultCards.map((r, i) =>
                                  i === idx ? { ...r, scoreLabel: val } : r
                                ),
                              }));
                            }}
                            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                          />
                          <input
                            type="text"
                            value={card.testType}
                            placeholder="Test Type"
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => ({
                                ...prev,
                                resultCards: prev.resultCards.map((r, i) =>
                                  i === idx ? { ...r, testType: val } : r
                                ),
                              }));
                            }}
                            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                          />
                        </div>
                        <input
                          type="text"
                          value={card.highlight}
                          placeholder="Highlight subtitle"
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft((prev) => ({
                              ...prev,
                              resultCards: prev.resultCards.map((r, i) =>
                                i === idx ? { ...r, highlight: val } : r
                              ),
                            }));
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-[#0B2249]"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              updateDraft((prev) => ({
                                ...prev,
                                resultCards: prev.resultCards.filter((_, i) => i !== idx),
                              }))
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC1E25] hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Delete Card
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. SECURITY & RESET */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <h2 className="font-display text-lg font-extrabold text-[#0B2249]">
                  Update Admin Password
                </h2>
                {usingEnvSecret ? (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Your password is managed via the <code className="font-mono font-bold">ADMIN_PASSWORD</code> environment secret in Settings → Secrets. Update it there and restart the server.
                  </p>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <label className="block text-xs font-bold text-[#0B2249]">
                      New Admin Password (min 6 characters)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F5F7FB] border border-slate-300 rounded-xl text-[#0B2249]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[#0B2249] hover:bg-[#DC1E25] text-white text-xs sm:text-sm font-bold cursor-pointer"
                    >
                      Save New Password
                    </button>
                  </form>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <h2 className="font-display text-lg font-extrabold text-[#0B2249]">
                  Reset Content to Defaults
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Restores all offers, timings, social links, banners, videos, and award images back to
                  their original defaults (stored leads are not deleted).
                </p>
                {confirmReset ? (
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleResetConfig}
                      className="px-4 py-2.5 rounded-xl bg-[#DC1E25] text-white text-xs font-bold cursor-pointer"
                    >
                      Yes, Reset Content
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-[#0B2249] text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-300 text-[#DC1E25] hover:bg-red-50 text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Content to Defaults
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
