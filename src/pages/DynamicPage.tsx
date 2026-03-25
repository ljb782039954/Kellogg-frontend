import { useEffect } from 'react';
import type { CustomPage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import DynamicPageRenderer from '../components/DynamicRenderer/DynamicPageRenderer';

interface DynamicPageProps {
  page: CustomPage;
}

export default function DynamicPage({ page }: DynamicPageProps) {
  const { language } = useLanguage();

  useEffect(() => {
    // Update document title and scroll to top on nav
    document.title = page.title[language as 'zh' | 'en'];
    window.scrollTo(0, 0);
  }, [page.title, language]);

  return (
    <main className="min-h-screen">
      <DynamicPageRenderer language={language} schema={page} theme="light" />
    </main>
  );
}
