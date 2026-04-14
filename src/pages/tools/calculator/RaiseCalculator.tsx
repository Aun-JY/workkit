import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useCurrency } from '../../../hooks/useCurrency';

// Korean net pay calculation (for KO only)
const calcKRNet = (annual: number) => {
  const monthly = annual / 12;
  const pension = Math.min(monthly * 0.045, 235800);
  const health = monthly * 0.03545;
  const ltc = health * 0.1295;
  const employment = monthly * 0.009;
  const taxable = monthly - 100000;
  let tax = 0;
  if (taxable > 1060000 && taxable <= 1500000) tax = (taxable - 1060000) * 0.06;
  else if (taxable > 1500000 && taxable <= 3000000) tax = 26400 + (taxable - 1500000) * 0.15;
  else if (taxable > 3000000) tax = 251400 + (taxable - 3000000) * 0.24;
  tax = Math.max(0, tax - 150000 / 12);
  const localTax = tax * 0.1;
  const deductions = pension + health + ltc + employment + tax + localTax;
  return monthly - deductions;
};

export const RaiseCalculator: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.raiseCalc.name'));
  const { format, defaultAnnual, lang, symbol } = useCurrency();

  const [before, setBefore] = useState(defaultAnnual);
  const [rate, setRate] = useState(5);

  const after = Math.round(before * (1 + rate / 100));

  // For KO, show net pay; for others, show gross monthly
  const isKR = lang === 'ko';
  const netBefore = isKR ? calcKRNet(before) : before / 12;
  const netAfter = isKR ? calcKRNet(after) : after / 12;
  const diff = netAfter - netBefore;

  const annualLabel = symbol
    ? t('calculator.raiseCalc.annualSalarySymbol', { symbol })
    : t('calculator.raiseCalc.annualSalary');
  const monthlyLabel = isKR ? t('calculator.raiseCalc.perMonthNet') : '/mo';
  const annualSubLabel = isKR ? t('calculator.raiseCalc.annual') : 'Annual';
  const diffLabel = isKR ? t('calculator.raiseCalc.monthlyNetDiff') : 'Monthly difference';

  return (
    <ToolLayout toolId="raise-calc" category="calculator"
      breadcrumbs={[{ label: t('categories.calculator'), path: '/category/calculator' }, { label: t('tools.raiseCalc.name') }]}>
      <ToolHeader toolId="raise-calc" category="calculator" nameKey="tools.raiseCalc.name" descKey="tools.raiseCalc.desc" />

      <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>{annualLabel}</label>
          <input type="number" value={before} onChange={e => setBefore(Number(e.target.value))}
            step={defaultAnnual / 40} min={0}
            style={{ width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '15px', color: 'var(--text)', outline: 'none', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)' }}>
              {t('calculator.raiseCalc.raiseRate')}
            </label>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '20px', color: 'var(--accent)' }}>{rate}%</span>
          </div>
          <input type="range" min={1} max={50} value={rate} onChange={e => setRate(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { label: t('calculator.raiseCalc.before'), annual: before, net: netBefore, accent: false },
          { label: t('calculator.raiseCalc.after'), annual: after, net: netAfter, accent: true },
        ].map(c => (
          <div key={c.label} style={{ background: c.accent ? 'var(--accent)' : 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: c.accent ? 'rgba(255,255,255,0.8)' : 'var(--muted)', marginBottom: '12px' }}>{c.label}</div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '28px', color: c.accent ? '#fff' : 'var(--text)', marginBottom: '4px' }}>
              {format(Math.round(c.net))}<span style={{ fontSize: '14px', fontWeight: 600 }}>{monthlyLabel}</span>
            </div>
            <div style={{ fontSize: '13px', color: c.accent ? 'rgba(255,255,255,0.7)' : 'var(--muted)' }}>{annualSubLabel} {format(c.annual)}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: diff > 0 ? 'var(--green-soft)' : 'var(--surface2)',
        border: `2px solid ${diff > 0 ? 'var(--green-border)' : 'var(--border)'}`,
        borderRadius: '16px', padding: '20px', textAlign: 'center', marginTop: '16px',
      }}>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--muted)' }}>
          {diffLabel}:{' '}
        </span>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: 'var(--green)' }}>
          +{format(Math.round(diff))}
        </span>
      </div>

      {!isKR && (
        <div style={{ fontSize: '12px', color: 'var(--muted2)', marginTop: '12px', textAlign: 'center', lineHeight: 1.6 }}>
          * Showing gross monthly salary. Use the Salary Calculator for net pay after taxes.
        </div>
      )}
    </ToolLayout>
  );
};
