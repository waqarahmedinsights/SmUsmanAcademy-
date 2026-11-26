import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DEFAULT_SITE_CONFIG, SiteConfig } from '../data/siteConfigDefaults';
import { LeadToast, LeadToastPayload } from '../components/LeadToast';

export type SiteSyncEventType = 'config-updated' | 'lead-created';

export function broadcastSiteSync(type: SiteSyncEventType) {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel('smu-site-sync');
      ch.postMessage({ type, ts: Date.now() });
      ch.close();
    }
  } catch {
    // Ignore if BroadcastChannel unsupported
  }
}

export interface LeadToastTriggerInput {
  referenceId: string;
  title?: string;
  message: string;
  emailDelivered?: boolean;
}

interface SiteContentContextValue {
  config: SiteConfig;
  loading: boolean;
  refreshConfig: () => Promise<void>;
  setLiveConfig: (next: SiteConfig) => void;
  showLeadToast: (payload: LeadToastTriggerInput) => void;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  config: DEFAULT_SITE_CONFIG,
  loading: false,
  refreshConfig: async () => {},
  setLiveConfig: () => {},
  showLeadToast: () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [leadToast, setLeadToast] = useState<LeadToastPayload | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const dismissLeadToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setLeadToast(null);
  }, []);

  const showLeadToast = useCallback((payload: LeadToastTriggerInput) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    const id = `toast-${Date.now()}`;
    setLeadToast({ id, ...payload });
    toastTimerRef.current = window.setTimeout(() => {
      setLeadToast((prev) => (prev?.id === id ? null : prev));
      toastTimerRef.current = null;
    }, 6500);
  }, []);

  const refreshConfig = useCallback(async () => {
    try {
      const resp = await fetch(`/api/site-config?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (resp.ok) {
        const data = (await resp.json()) as { config?: SiteConfig };
        if (data.config) {
          setConfig(data.config);
        }
      }
    } catch {
      // Keep current config gracefully if network hiccups
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshConfig();

    const onFocus = () => refreshConfig();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshConfig();
      }
    };
    const onHashChange = () => {
      refreshConfig();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('hashchange', onHashChange);

    let ch: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        ch = new BroadcastChannel('smu-site-sync');
        ch.onmessage = (ev: MessageEvent<{ type?: SiteSyncEventType }>) => {
          if (ev.data?.type === 'config-updated') {
            refreshConfig();
          }
        };
      }
    } catch {
      // Ignore unsupported BroadcastChannel
    }

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('hashchange', onHashChange);
      ch?.close();
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, [refreshConfig]);

  const setLiveConfig = useCallback((next: SiteConfig) => {
    setConfig(next);
    broadcastSiteSync('config-updated');
  }, []);

  return (
    <SiteContentContext.Provider
      value={{
        config,
        loading,
        refreshConfig,
        setLiveConfig,
        showLeadToast,
      }}
    >
      {children}
      <LeadToast toast={leadToast} onDismiss={dismissLeadToast} />
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
