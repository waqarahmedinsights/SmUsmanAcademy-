import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_SITE_CONFIG, SiteConfig } from '../data/siteConfigDefaults';

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
      const resp = await fetch('/api/site-config');
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
  }, [refreshConfig]);

  return (
    <SiteContentContext.Provider
      value={{
        config,
        loading,
        refreshConfig,
        setLiveConfig: setConfig,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
