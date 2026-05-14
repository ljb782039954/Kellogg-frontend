import { api } from "../lib/api";
import type { SiteContent, CompanyInfo, HeaderContent, FooterContent, CustomPage, Language } from "../types";

export class SiteService {
  /**
   * 获取全站核心数据
   */
  static async getSiteData(Astro?: any): Promise<SiteContent & { exchangeRates: any }> {
    const [siteSettings, headerConfig, footerConfig, pagesData, exchangeRates] = await Promise.all([
      api.getConfig<CompanyInfo>("site_settings"),
      api.getConfig<HeaderContent>("header_config"),
      api.getConfig<FooterContent>("footer_config"),
      api.getConfig<CustomPage[]>("pages"),
      api.getConfig<any>("exchangeRates"),
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
      lang,
      exchangeRates
    };
  }
}
