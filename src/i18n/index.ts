import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import es from './locales/es.json';

type Lang = 'ko' | 'en' | 'ja' | 'zh' | 'es';

function detectLang(): Lang {
  // 1) 저장된 값 우선
  try {
    const stored = localStorage.getItem('workkit-lang');
    if (stored) {
      const lang = JSON.parse(stored)?.state?.lang;
      if (lang) return lang as Lang;
    }
  } catch { /* ignore */ }

  // 2) 브라우저 언어 기반 감지
  const nav = navigator.languages?.length ? navigator.languages[0] : navigator.language;
  const code = nav?.toLowerCase() ?? '';
  if (code.startsWith('ko')) return 'ko';
  if (code.startsWith('ja')) return 'ja';
  if (code.startsWith('zh')) return 'zh';
  if (code.startsWith('es')) return 'es';
  return 'en';
}

const savedLang = detectLang();

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
    ja: { translation: ja },
    zh: { translation: zh },
    es: { translation: es },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
