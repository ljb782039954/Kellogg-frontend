import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Globe, Share2, Menu, X, Coins } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { $currency, $rates } from '../lib/currency';
import { CurrencyService } from '../services/currencyService';
import { t } from '../utils/common';
import type { CompanyInfo, HeaderContent, Language } from '../types';

export interface HeaderProps {
  header: HeaderContent;
  companyInfo: CompanyInfo;
  lang: Language;
  pathname: string;
  initialRates?: Record<string, number> | null;
}

export default function Header({ 
  header, 
  companyInfo, 
  lang, 
  pathname,
  initialRates = null
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currency = useStore($currency);
  const rates = useStore($rates);

  // 初始化逻辑转移到 Service
  useEffect(() => {
    CurrencyService.initRates(initialRates);
    CurrencyService.autoDetectCurrency();
  }, [initialRates]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 样式定义
  const style = {
    bg: 'bg-white/95 backdrop-blur-md shadow-sm',
    text: 'text-gray-800',
    border: 'border-gray-100',
  };

  const handleShare = () => {
    const url = window.location.origin;
    const title = t(companyInfo.name, lang);
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => copyToClipboard(url));
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(lang === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
    });
  };

  const switchLanguage = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    document.cookie = `lang=${newLang};path=/;max-age=31536000`;
    window.location.reload();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${style.bg}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            {companyInfo.logo && (
              <img src={companyInfo.logo} alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            )}
            <span className={`text-base md:text-lg lg:text-xl font-bold tracking-wider ${style.text}`}>
              {t(companyInfo.name, lang)}
            </span>
          </a>

          {/* Desktop Navigation , 最多显示5个，剩下的用 ... */}
          <nav className="hidden md:flex items-center gap-8">
            {header.navItems.map((item, index) => {
              if (index < 5) {
                return (
                  <div key={item.href}>
                    <a
                      href={item.href}
                      className={`text-sm font-medium ${style.text} ${
                        pathname === item.href ? 'opacity-100' : 'opacity-70'
                  } hover:opacity-100 transition-opacity`}
                >
                  {t(item.name, lang)}
                </a>
              </div>
                );
              }
              return null;
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${style.text} border ${style.border}`}>
              <Coins className="w-4 h-4" />
              <select
                value={currency}
                onChange={(e) => CurrencyService.switchCurrency(e.target.value)}
                className="bg-transparent appearance-none border-none outline-none cursor-pointer px-1"
              >
                {(rates ? Object.keys(rates) : ['USD', 'CNY']).map(cur => (
                  <option key={cur} value={cur} className="text-gray-900 bg-white">{cur}</option>
                ))}
              </select>
            </div>

            <button onClick={switchLanguage} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${style.text} border ${style.border}`}>
              <Globe className="w-4 h-4" />
              {lang === 'zh' ? '中文' : 'EN'}
            </button>

            <button onClick={handleShare} className={`p-2 rounded-full ${style.text} border ${style.border}`}>
              <Share2 className="w-4 h-4" />
            </button>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2 ${style.text}`}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className={`md:hidden ${style.bg} border-t ${style.border} overflow-hidden`}>
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-6">
              {header.navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-bold ${style.text} ${pathname === item.href ? 'opacity-100' : 'opacity-70'}`}>
                  {t(item.name, lang)}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                 <div className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-2xl ${style.text} border ${style.border}`}>
                    <Coins className="w-5 h-5" />
                    <select
                      value={currency}
                      onChange={(e) => CurrencyService.switchCurrency(e.target.value)}
                      className="bg-transparent appearance-none border-none outline-none cursor-pointer font-bold"
                    >
                      {(rates ? Object.keys(rates) : ['USD', 'CNY']).map(cur => (
                        <option key={cur} value={cur} className="text-gray-900 bg-white">{cur}</option>
                      ))}
                    </select>
                 </div>
              </div>
            </nav>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
