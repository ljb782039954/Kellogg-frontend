import { api } from "./api";
import type { SiteContent, CompanyInfo, HeaderContent, FooterContent, CustomPage, Language } from "../types";

export async function getSiteData(Astro?: any): Promise<SiteContent> {
  const [siteSettings, headerConfig, footerConfig, pagesData] = await Promise.all([
    api.getConfig<CompanyInfo>("site_settings"),
    api.getConfig<HeaderContent>("header_config"),
    api.getConfig<FooterContent>("footer_config"),
    api.getConfig<CustomPage[]>("pages"),
  ]);

  if (!siteSettings || !headerConfig || !footerConfig || !pagesData) {
    throw new Error("Missing essential site data from API/KV");
  }

  // 语言检测逻辑
  let lang: Language = 'en';
  if (Astro) {
    const cookieLang = Astro.cookies.get('lang')?.value;
    const urlLang = Astro.url.searchParams.get('lang');
    lang = (urlLang || cookieLang || 'en') as Language;
  }

  return {
    companyInfo: siteSettings,
    header: headerConfig,
    footer: footerConfig,
    pages: pagesData,
    lang
  };
}
