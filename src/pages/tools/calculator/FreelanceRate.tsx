import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useCurrency } from '../../../hooks/useCurrency';

export const FreelanceRate: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.freelanceRate.name'));
  const { format, defaultMonthly, workDays, taxRateLabel, defaultTaxRate, symbol, suffix } = useCurrency();

  const [monthly, setMonthly] = useState(defaultMonthly);
  const [days, setDays] = useState(workDays);
  const [hours, setHours] = useState(8);
  const [taxRate, setTaxRate] = useState(defaultTaxRate);

  const daily = monthly / days;
  const hourly = daily / hours;
  const afterTax = monthly * (1 - taxRate / 100);

  const monthlyLabel = symbol
    ? t('calculator.freelanceRate.monthlyTargetSymbol', { symbol })
    : t('calculator.freelanceRate.monthlyTargetSuffix', { suffix });

  return (
    <ToolLayout toolId="freelance-rate" category="calculator"
      breadcrumbs={[{ label: t('categories.calculator'), path: '/category/calculator' }, { label: t('tools.freelanceRate.name') }]}>
      <ToolHeader toolId="freelance-rate" category="calculator" nameKey="tools.freelanceRate.name" descKey="tools.freelanceRate.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="fr-layout">
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>
              {monthlyLabel}
            </label>
            <input type="number" value={monthly} min={1} step={monthly >= 10000 ? 500000 : monthly >= 100 ? 100 : 10}
              onChange={e => setMonthly(Number(e.target.value))}
              style={{ width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '15px', color: 'var(--text)', outline: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>
              {t('calculator.freelanceRate.workingDays')}
            </label>
            <input type="number" value={days} min={1} max={31} step={1}
              onChange={e => setDays(Number(e.target.value))}
              style={{ width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '15px', color: 'var(--text)', outline: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>
              {t('calculator.freelanceRate.workingHours')}
            </label>
            <input type="number" value={hours} min={1} max={24} step={1}
              onChange={e => setHours(Number(e.target.value))}
              style={{ width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '15px', color: 'var(--text)', outline: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)' }}>{taxRateLabel}</label>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: 'var(--accent)' }}>{taxRate.toFixed(1)}%</span>
            </div>
            <input type="range" min={0} max={40} step={0.1} value={taxRate}
              onChange={e => setTaxRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: t('calculator.freelanceRate.monthlyGross'), value: format(monthly), color: 'var(--muted)', big: false },
            { label: t('calculator.freelanceRate.dailyRate'), value: format(daily), color: 'var(--blue)', big: false },
            { label: t('calculator.freelanceRate.hourlyRate'), value: format(hourly), color: 'var(--green)', big: false },
            { label: t('calculator.freelanceRate.monthlyAfterTax'), value: format(afterTax), color: 'var(--accent)', big: true },
          ].map(c => (
            <div key={c.label} style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '16px', padding: c.big ? '20px' : '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: '14px', color: 'var(--muted)' }}>{c.label}</span>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: c.big ? '22px' : '16px', color: c.color }}>{c.value}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .fr-layout { grid-template-columns: 1fr !important; } }`}</style>
    </ToolLayout>
  );
};
