import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Language, Translation } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (zhOrTranslation: string | Translation, en?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (zhOrTranslation: string | Translation, en?: string): string => {
    if (typeof zhOrTranslation === 'object' && zhOrTranslation !== null) {
      return language === 'en' ? zhOrTranslation.zh : zhOrTranslation.en;
    }
    const zhStr = zhOrTranslation as string;
    return language === 'en' ? zhStr : (en || zhStr);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
