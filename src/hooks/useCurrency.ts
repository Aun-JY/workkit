import { useTranslation } from 'react-i18next';

interface CurrencyConfig {
  symbol: string;
  suffix: string;
  locale: string;
  defaultMonthly: number;
  defaultAnnual: number;
  defaultTotal: number;
  defaultDailyRate: number;
  workDays: number;
  taxRateLabel: string;
  defaultTaxRate: number;
  personLabel: string;
}

export const CURRENCY_CONFIG: Record<string, CurrencyConfig> = {
  ko: {
    symbol: '', suffix: '원', locale: 'ko-KR',
    defaultMonthly: 5000000, defaultAnnual: 40000000, defaultTotal: 100000, defaultDailyRate: 0,
    workDays: 22, taxRateLabel: '원천징수세율 (%)', defaultTaxRate: 3.3,
    personLabel: '명',
  },
  en: {
    symbol: '$', suffix: '', locale: 'en-US',
    defaultMonthly: 5000, defaultAnnual: 60000, defaultTotal: 200, defaultDailyRate: 0,
    workDays: 21, taxRateLabel: 'Self-employment tax (%)', defaultTaxRate: 15.3,
    personLabel: 'people',
  },
  ja: {
    symbol: '¥', suffix: '', locale: 'ja-JP',
    defaultMonthly: 500000, defaultAnnual: 5000000, defaultTotal: 10000, defaultDailyRate: 0,
    workDays: 20, taxRateLabel: '源泉徴収税率 (%)', defaultTaxRate: 10.21,
    personLabel: '名',
  },
  zh: {
    symbol: '¥', suffix: '', locale: 'zh-CN',
    defaultMonthly: 30000, defaultAnnual: 300000, defaultTotal: 2000, defaultDailyRate: 0,
    workDays: 22, taxRateLabel: '个税预扣率 (%)', defaultTaxRate: 3,
    personLabel: '人',
  },
  es: {
    symbol: '€', suffix: '', locale: 'es-ES',
    defaultMonthly: 3000, defaultAnnual: 36000, defaultTotal: 200, defaultDailyRate: 0,
    workDays: 22, taxRateLabel: 'Retención IRPF (%)', defaultTaxRate: 15,
    personLabel: 'personas',
  },
};

export const useCurrency = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];
  const cfg = CURRENCY_CONFIG[lang] ?? CURRENCY_CONFIG['ko'];

  const format = (n: number): string => {
    const rounded = Math.round(n);
    const abs = Math.abs(rounded).toLocaleString(cfg.locale);
    const sign = n < 0 ? '-' : '';
    if (cfg.symbol) return `${sign}${cfg.symbol}${abs}`;
    return `${sign}${abs}${cfg.suffix}`;
  };

  return { ...cfg, format, lang };
};
