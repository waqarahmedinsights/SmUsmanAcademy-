import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_SITE_CONFIG, SiteConfig } from '../data/siteConfigDefaults';

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

interface SiteContentContextValue {
  config: SiteConfig;
  loading: boolean;
  refreshConfig: () => Promise<void>;
  setLiveConfig: (next: SiteConfig) => void;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  config: DEFAULT_SITE_CONFIG,
  loading: false,
  refreshConfig: async () => {},
  setLiveConfig: () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);

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
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
