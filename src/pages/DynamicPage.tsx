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
    // 1. 设置网页标题 (优先使用 SEO 标题)
    const pageTitle = page.seo?.title?.[language as 'zh' | 'en'] || page.title[language as 'zh' | 'en'];
    document.title = pageTitle;

    // 2. 设置 Meta Description
    const metaDesc = page.seo?.description?.[language as 'zh' | 'en'];
    if (metaDesc) {
      let metaTag = document.querySelector('meta[name="description"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'description');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', metaDesc);
    }

    window.scrollTo(0, 0);
  }, [page, language]);

  return (
    <main className="min-h-screen">
      <DynamicPageRenderer language={language} schema={page} theme="light" />
    </main>
  );
}
