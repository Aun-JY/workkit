import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

type CountryKey = 'KR' | 'US' | 'JP' | 'CN' | 'ES';

interface CountryOTConfig {
  flag: string;
  label: string;
  wageLabel: string;
  defaultWage: number;
  currency: string;
  overtimeRate: number;    // 연장 배율
  nightRate: number;       // 야간 가산 배율
  holidayRate: number;     // 휴일 배율
  overtimeLabel: string;
  nightLabel: string;
  holidayLabel: string;
  note: string;
}

const CONFIGS: Record<CountryKey, CountryOTConfig> = {
  KR: {
    flag: '🇰🇷', label: '한국', wageLabel: '시급 (원)', defaultWage: 9860, currency: '원',
    overtimeRate: 1.5, nightRate: 0.5, holidayRate: 1.5,
    overtimeLabel: '연장 근무 (×1.5)', nightLabel: '야간 가산 (×0.5 추가)', holidayLabel: '휴일 근무 (×1.5)',
    note: '근로기준법 기준: 연장·휴일 1.5배, 야간(22시~06시) 0.5배 가산. 5인 미만 사업장은 다를 수 있습니다.',
  },
  US: {
    flag: '🇺🇸', label: 'USA', wageLabel: 'Hourly Rate (USD)', defaultWage: 17, currency: '$',
    overtimeRate: 1.5, nightRate: 0, holidayRate: 1.5,
    overtimeLabel: 'Overtime (×1.5, >40h/wk)', nightLabel: 'Night Differential (×0)', holidayLabel: 'Holiday Pay (×1.5)',
    note: 'FLSA: 1.5× for hours over 40/week. Night & holiday rates may vary by employer.',
  },
  JP: {
    flag: '🇯🇵', label: '日本', wageLabel: '時給 (円)', defaultWage: 1100, currency: '円',
    overtimeRate: 1.25, nightRate: 0.25, holidayRate: 1.35,
    overtimeLabel: '時間外 (×1.25)', nightLabel: '深夜 (×0.25加算)', holidayLabel: '休日 (×1.35)',
    note: '労働基準法: 時間外25%増、深夜(22時〜5時)25%増、法定休日35%増。',
  },
  CN: {
    flag: '🇨🇳', label: '中国', wageLabel: '时薪 (元)', defaultWage: 25, currency: '元',
    overtimeRate: 1.5, nightRate: 0, holidayRate: 3,
    overtimeLabel: '延长工时 (×1.5)', nightLabel: '夜班 (×0)', holidayLabel: '法定节假日 (×3)',
    note: '劳动法: 平日加班1.5倍，休息日加班2倍，法定节假日3倍。',
  },
  ES: {
    flag: '🇪🇸', label: 'España', wageLabel: 'Tarifa hora (EUR)', defaultWage: 10, currency: '€',
    overtimeRate: 1.5, nightRate: 0.25, holidayRate: 1.75,
    overtimeLabel: 'Horas extra (×1.5)', nightLabel: 'Nocturno (×0.25 adicional)', holidayLabel: 'Festivo (×1.75)',
    note: 'ET: horas extra mínimo al 25% sobre el ordinario. Convenio colectivo puede ser mayor.',
  },
};

const LANG_TO_COUNTRY: Record<string, CountryKey> = { ko: 'KR', en: 'US', ja: 'JP', zh: 'CN', es: 'ES' };

export const OvertimeCalculator: React.FC = () => {
  const { t, i18n } = useTranslation();
  usePageTitle(t('tools.overtime.name'));

  const lang = i18n.language.split('-')[0];
  const defaultCountry = LANG_TO_COUNTRY[lang] ?? 'KR';
  const [country, setCountry] = useState<CountryKey>(defaultCountry);
  const cfg = CONFIGS[country];

  const [hourlyWage, setHourlyWage] = useState(cfg.defaultWage);
  const [regularHours, setRegularHours] = useState(8);
  const [overtimeHours, setOvertimeHours] = useState(2);
  const [nightHours, setNightHours] = useState(0);
  const [holidayHours, setHolidayHours] = useState(0);

  const handleCountryChange = (c: CountryKey) => {
    setCountry(c);
    setHourlyWage(CONFIGS[c].defaultWage);
  };

  const regularPay = hourlyWage * regularHours;
  const overtimePay = hourlyWage * cfg.overtimeRate * overtimeHours;
  const nightPay = hourlyWage * cfg.nightRate * nightHours;
  const holidayPay = hourlyWage * cfg.holidayRate * holidayHours;
  const total = regularPay + overtimePay + nightPay + holidayPay;

  const fmt = (n: number) => {
    const rounded = Math.round(n);
    return cfg.currency === '원' || cfg.currency === '円' || cfg.currency === '元'
      ? rounded.toLocaleString() + cfg.currency
      : cfg.currency + rounded.toLocaleString();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)',
    borderRadius: '12px', padding: '10px 14px', fontSize: '15px', color: 'var(--text)',
    outline: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700,
  };

  return (
    <ToolLayout toolId="overtime" category="calculator"
      breadcrumbs={[{ label: t('categories.calculator'), path: '/category/calculator' }, { label: t('tools.overtime.name') }]}>
      <ToolHeader toolId="overtime" category="calculator" nameKey="tools.overtime.name" descKey="tools.overtime.desc" />

      <style>{`@media (max-width: 640px) { .ot-layout { grid-template-columns: 1fr !important; } }`}</style>

      {/* Country selector */}
      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {(Object.keys(CONFIGS) as CountryKey[]).map(c => (
          <button key={c} onClick={() => handleCountryChange(c)}
            style={{
              padding: '7px 14px', borderRadius: '999px', border: '2px solid',
              borderColor: country === c ? 'var(--accent)' : 'var(--border)',
              background: country === c ? 'var(--accent-soft)' : 'var(--surface)',
              color: country === c ? 'var(--accent)' : 'var(--muted)',
              fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {CONFIGS[c].flag} {CONFIGS[c].label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="ot-layout">
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: cfg.wageLabel, value: hourlyWage, set: setHourlyWage, step: 1 },
            { label: t('calculator.overtimeCalc.regularHours'), value: regularHours, set: setRegularHours, step: 0.5 },
            { label: cfg.overtimeLabel, value: overtimeHours, set: setOvertimeHours, step: 0.5 },
            ...(cfg.nightRate > 0 ? [{ label: cfg.nightLabel, value: nightHours, set: setNightHours, step: 0.5 }] : []),
            { label: cfg.holidayLabel, value: holidayHours, set: setHolidayHours, step: 0.5 },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>{f.label}</label>
              <input type="number" value={f.value} min={0} step={f.step}
                onChange={e => f.set(Number(e.target.value))}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: t('calculator.overtimeCalc.basicPay'), value: regularPay, show: true },
            { label: cfg.overtimeLabel, value: overtimePay, show: overtimeHours > 0 },
            { label: cfg.nightLabel, value: nightPay, show: cfg.nightRate > 0 && nightHours > 0 },
            { label: cfg.holidayLabel, value: holidayPay, show: holidayHours > 0 },
          ].filter(i => i.show).map(item => (
            <div key={item.label} style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '14px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--muted)' }}>{item.label}</span>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '16px', color: 'var(--text)' }}>{fmt(item.value)}</span>
            </div>
          ))}
          <div style={{ background: 'var(--accent)', borderRadius: '16px', padding: '20px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '15px', color: '#fff' }}>{t('calculator.overtimeCalc.total')}</span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '24px', color: '#fff' }}>{fmt(total)}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted2)', lineHeight: 1.6, background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '12px', padding: '12px 14px' }}>
            ※ {cfg.note}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
