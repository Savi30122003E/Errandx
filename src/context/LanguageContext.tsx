import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { getStoredLanguage, setStoredLanguage, TRANSLATIONS } from '../utils/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS.ta;
  formatTown: (text: string, townName?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode; currentTownName?: string }> = ({ 
  children,
  currentTownName = 'Your Town'
}) => {
  const [language, setLangState] = useState<Language>(() => getStoredLanguage());

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    setStoredLanguage(newLang);
  };

  const formatTown = (text: string, townName?: string): string => {
    const activeTown = townName || currentTownName || 'Your Town';
    return (text || '').replace(/\{townName\}/g, activeTown);
  };

  // Provide translations for active language
  const t = TRANSLATIONS[language] || TRANSLATIONS.ta;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatTown }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    const lang = getStoredLanguage();
    return {
      language: lang,
      setLanguage: () => {},
      t: TRANSLATIONS[lang] || TRANSLATIONS.ta,
      formatTown: (text: string, townName?: string) => 
        (text || '').replace(/\{townName\}/g, townName || 'Your Town')
    };
  }
  return context;
};
