import { useEffect } from 'react';
import { SEO_CONFIG } from '../../config/seoConfig';

interface SEOManagerProps {
  pagePath: string;
  seoData?: {
    title?: { zh: string; en: string };
    description?: { zh: string; en: string };
    keywords?: { zh: string; en: string };
    targetCountry?: string;
  };
  fallbackTitle: string;
  language: 'zh' | 'en';
}

/**
 * SEO & GEO 独立管理组件
 * 职责：统一管理所有页面的 Meta 标签、GEO 标签和 JSON-LD
 */
const SEOManager: React.FC<SEOManagerProps> = ({
  pagePath,
  seoData,
  fallbackTitle,
  language
}) => {

  useEffect(() => {
    // 1. 获取本地代码配置作为兜底
    const cleanPath = pagePath.replace(/^\//, '') || '';
    const override = SEO_CONFIG.pageOverrides[cleanPath as keyof typeof SEO_CONFIG.pageOverrides];

    // 2. 优先级：后台填写的 SEO > 代码覆盖配置 > 默认标题
    const finalTitle = seoData?.title?.[language] || override?.title[language] || fallbackTitle;
    const finalDesc = seoData?.description?.[language] || override?.description[language] || '';
    const finalKeywords = seoData?.keywords?.[language] || SEO_CONFIG.keywords.join(', ');
    const targetCountry = seoData?.targetCountry || override ? (cleanPath.split('-')[0].toUpperCase()) : 'Worldwide';

    // 2. 更新标题
    document.title = finalTitle;

    // 3. 更新 Meta 辅助函数
    const updateMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 4. 执行 Meta 更新
    updateMeta('description', finalDesc);
    updateMeta('keywords', finalKeywords);

    // GEO 标签
    const geo = SEO_CONFIG.company.address;
    updateMeta('geo.region', geo.region);
    updateMeta('geo.placename', geo.placename);
    updateMeta('geo.position', geo.position);
    updateMeta('ICBM', geo.position.replace(';', ', '));

    // 5. 注入 JSON-LD (结构化数据)
    let scriptTag = document.getElementById('seo-json-ld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WholesaleStore",
      "name": SEO_CONFIG.company.name,
      "description": finalDesc,
      "url": window.location.origin,
      "image": `${window.location.origin}/logo/logo.jpg`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": geo.placename,
        "addressRegion": "Guangdong",
        "addressCountry": geo.country,
        "streetAddress": geo.locality
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": SEO_CONFIG.company.coordinates.latitude,
        "longitude": SEO_CONFIG.company.coordinates.longitude
      },
      "areaServed": targetCountry !== 'Worldwide'
        ? ["Worldwide", targetCountry]
        : ["Worldwide", "USA", "Europe", "UK", "Australia"],
      "knowsAbout": ["Heavyweight Hoodies", "Streetwear Manufacturing", "Custom Apparel"]
    };
    scriptTag.text = JSON.stringify(structuredData);

    // 6. 自动注入 Canonical Tag (规范网址)
    const updateLinkRel = (rel: string, href?: string) => {
      const selector = `link[rel="${rel}"]`;
      let link = document.querySelector(selector);

      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href || '');
    };

    // 注入 Canonical 标签 (极其重要，防止内容重复惩罚)
    // 1. 优先使用环境变量中的站点域名，确保 www/非www、http/https 统一
    const siteBaseUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
    
    // 2. 规范化路径：确保以 / 开头，且非首页路径不以 / 结尾
    let normalizedPath = pagePath.startsWith('/') ? pagePath : `/${pagePath}`;
    if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
      normalizedPath = normalizedPath.slice(0, -1);
    }
    
    // 3. 特殊处理首页
    const finalCanonicalUrl = (pagePath === '' || pagePath === '/') 
      ? `${siteBaseUrl}/` 
      : `${siteBaseUrl}${normalizedPath}`;

    updateLinkRel('canonical', finalCanonicalUrl);

    return () => {
      // 卸载时不需要特别清理，因为这些是全局 header
    };
  }, [pagePath, seoData, fallbackTitle, language]);

  return null; // 不渲染任何 UI
};

export default SEOManager;
