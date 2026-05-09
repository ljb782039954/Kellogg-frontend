import { useState, useEffect } from 'react';
import type { CustomPage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import DynamicPageRenderer from '../components/DynamicRenderer/DynamicPageRenderer';
import SEOManager from '../components/seo/SEOManager';
import { api } from '../lib/api';
import { Loader2 } from 'lucide-react';

interface DynamicPageProps {
  page: CustomPage;
}

export default function DynamicPage({ page }: DynamicPageProps) {
  const { language } = useLanguage();
  const [fullPage, setFullPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getPageById(page.id)
      .then(data => {
        if (mounted) {
          setFullPage(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load full page details:', err);
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [page.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load page content.
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <SEOManager
        pagePath={page.path}
        seoData={page.seo || fullPage.seo}
        fallbackTitle={page.title?.[language as 'zh' | 'en'] || fullPage.title?.[language as 'zh' | 'en']}
        language={language as 'zh' | 'en'}
      />
      <DynamicPageRenderer language={language} schema={fullPage} theme="light" />
    </main>
  );
}
