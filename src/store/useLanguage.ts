import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';

type Lang = 'ko' | 'en' | 'ja' | 'zh' | 'es';

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      lang: (i18n.language as Lang) || 'en',
      setLang: (lang) => {
        i18n.changeLanguage(lang);
        set({ lang });
      },
    }),
    { name: 'workkit-lang' }
  )
);
