import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SiteContent, CompanyInfo, HeaderContent, FooterContent, CustomPage } from '../types';
import { api } from '../lib/api';

interface ContentContextType {
  content: SiteContent | null;
  isLoading: boolean;
  error: Error | null;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        siteSettings,
        headerConfig,
        footerConfig,
        pagesData,
      ] = await Promise.all([
        api.getConfig<CompanyInfo>('site_settings'),
        api.getConfig<HeaderContent>('header_config'),
        api.getConfig<FooterContent>('footer_config'),
        api.getConfig<CustomPage[]>('pages'),
      ]);

      setContent({
        companyInfo: siteSettings as CompanyInfo,
        header: headerConfig as HeaderContent,
        footer: footerConfig as FooterContent,
        pages: pagesData as CustomPage[],
      });
    } catch (err) {
      console.error('Failed to fetch site content:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch content'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        error,
        refreshContent: fetchContent
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
