import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

type SavingsType = 'deposit' | 'installment';
type InterestType = 'simple' | 'compound';

interface Inputs {
  savingsType: SavingsType;
  interestType: InterestType;
  principal: number;
  monthlyDeposit: number;
  annualRate: number;
  months: number;
}

interface Result {
  maturityAmount: number;
  totalPrincipal: number;
  totalInterest: number;
  taxAmount: number;
  afterTaxAmount: number;
}

function calculate(inputs: Inputs): Result {
  const { savingsType, interestType, principal, monthlyDeposit, annualRate, months } = inputs;
  const r = annualRate / 100;
  const monthlyRate = r / 12;
  let maturityAmount = 0;
  let totalPrincipal = 0;

  if (savingsType === 'deposit') {
    // 예금: 거치식
    totalPrincipal = principal;
    if (interestType === 'simple') {
      maturityAmount = principal * (1 + r * (months / 12));
    } else {
      maturityAmount = principal * Math.pow(1 + monthlyRate, months);
    }
  } else {
    // 적금: 적립식 (매월 납입)
    totalPrincipal = monthlyDeposit * months;
    if (interestType === 'simple') {
      // 월복리 적금 (간이: 매월 납입금에 단리 이자)
      let total = 0;
      for (let i = 1; i <= months; i++) {
        const remainMonths = months - i + 1;
        total += monthlyDeposit * (1 + r * (remainMonths / 12));
      }
      maturityAmount = total;
    } else {
      // 복리 적금
      let total = 0;
      for (let i = 1; i <= months; i++) {
        const remainMonths = months - i + 1;
        total += monthlyDeposit * Math.pow(1 + monthlyRate, remainMonths);
      }
      maturityAmount = total;
    }
  }

  const totalInterest = maturityAmount - totalPrincipal;
  // 이자소득세 15.4% (소득세 14% + 지방소득세 1.4%)
  const taxAmount = Math.max(0, totalInterest) * 0.154;
  const afterTaxAmount = maturityAmount - taxAmount;

  return { maturityAmount, totalPrincipal, totalInterest, taxAmount, afterTaxAmount };
}

const fmtNum = (n: number) => Math.round(n).toLocaleString();

export const SavingsCalculator: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.savingsCalc.name'));
  const fmt = (n: number) => fmtNum(n) + t('calculator.savingsCalc.currencyUnit');

  const [inputs, setInputs] = useState<Inputs>({
    savingsType: 'installment',
    interestType: 'compound',
    principal: 10000000,
    monthlyDeposit: 300000,
    annualRate: 3.5,
    months: 12,
  });
  const [result, setResult] = useState<Result | null>(null);

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 700,
    color: 'var(--muted)', marginBottom: '6px',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: 'var(--surface)', border: '2px solid var(--border)',
    borderRadius: '14px', color: 'var(--text)', fontSize: '15px',
    fontFamily: 'Nunito Sans, sans-serif', boxSizing: 'border-box', outline: 'none',
  };

  return (
    <ToolLayout toolId="savings-calc" category="calculator"
      breadcrumbs={[{ label: t('categories.calculator'), path: '/category/calculator' }, { label: t('tools.savingsCalc.name') }]}>
      <ToolHeader toolId="savings-calc" category="calculator" nameKey="tools.savingsCalc.name" descKey="tools.savingsCalc.desc" />

      <style>{`
        .sav-input:focus { border-color: var(--accent) !important; }
        .seg-btn { transition: all 0.15s; }
        .seg-btn:hover { opacity: 0.85; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }} className="salary-main-grid">
        {/* Left: Inputs */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '16px', color: 'var(--text)', margin: 0 }}>
            {t('calculator.savingsCalc.inputTitle')}
          </h3>

          {/* 예금 / 적금 */}
          <div>
            <label style={labelStyle}>{t('calculator.savingsCalc.productType')}</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['installment', 'deposit'] as SavingsType[]).map(type => (
                <button key={type} className="seg-btn"
                  onClick={() => setInputs(p => ({ ...p, savingsType: type }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px', border: '2px solid',
                    borderColor: inputs.savingsType === type ? 'var(--accent)' : 'var(--border)',
                    background: inputs.savingsType === type ? 'var(--accent-soft)' : 'var(--surface2)',
                    color: inputs.savingsType === type ? 'var(--accent)' : 'var(--muted)',
                    fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  {type === 'installment' ? t('calculator.savingsCalc.installment') : t('calculator.savingsCalc.deposit')}
                </button>
              ))}
            </div>
          </div>

          {/* 단리 / 복리 */}
          <div>
            <label style={labelStyle}>{t('calculator.savingsCalc.interestType')}</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['simple', 'compound'] as InterestType[]).map(type => (
                <button key={type} className="seg-btn"
                  onClick={() => setInputs(p => ({ ...p, interestType: type }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px', border: '2px solid',
                    borderColor: inputs.interestType === type ? 'var(--green)' : 'var(--border)',
                    background: inputs.interestType === type ? 'var(--green-soft)' : 'var(--surface2)',
                    color: inputs.interestType === type ? 'var(--green)' : 'var(--muted)',
                    fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  }}
                >
                  {type === 'simple' ? t('calculator.savingsCalc.simple') : t('calculator.savingsCalc.compound')}
                </button>
              ))}
            </div>
          </div>

          {/* 금액 */}
          {inputs.savingsType === 'deposit' ? (
            <div>
              <label style={labelStyle}>{t('calculator.savingsCalc.principalLabel')}</label>
              <input className="sav-input" type="number" style={inputStyle}
                value={inputs.principal}
                onChange={e => setInputs(p => ({ ...p, principal: Number(e.target.value) }))}
                min={0} step={100000}
              />
            </div>
          ) : (
            <div>
              <label style={labelStyle}>{t('calculator.savingsCalc.monthlyDepositLabel')}</label>
              <input className="sav-input" type="number" style={inputStyle}
                value={inputs.monthlyDeposit}
                onChange={e => setInputs(p => ({ ...p, monthlyDeposit: Number(e.target.value) }))}
                min={0} step={10000}
              />
            </div>
          )}

          {/* 금리 */}
          <div>
            <label style={labelStyle}>{t('calculator.savingsCalc.annualRate')}</label>
            <input className="sav-input" type="number" style={inputStyle}
              value={inputs.annualRate}
              onChange={e => setInputs(p => ({ ...p, annualRate: Number(e.target.value) }))}
              min={0} max={50} step={0.1}
            />
          </div>

          {/* 기간 */}
          <div>
            <label style={labelStyle}>{t('calculator.savingsCalc.period')}</label>
            <select className="sav-input" style={{ ...inputStyle, cursor: 'pointer' }}
              value={inputs.months}
              onChange={e => setInputs(p => ({ ...p, months: Number(e.target.value) }))}
            >
              {[3, 6, 12, 18, 24, 36, 48, 60].map(m => {
                const yrs = m >= 12 ? t('calculator.savingsCalc.periodYear', { n: m / 12 }) : '';
                const mos = m % 12 !== 0 ? t('calculator.savingsCalc.periodMonth', { n: m % 12 }) : '';
                return <option key={m} value={m}>{[yrs, mos].filter(Boolean).join(' ')} ({t('calculator.savingsCalc.periodMonth', { n: m })})</option>;
              })}
            </select>
          </div>

          <button onClick={() => setResult(calculate(inputs))}
            style={{
              width: '100%', padding: '13px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: '999px', fontFamily: 'Nunito, sans-serif',
              fontWeight: 800, fontSize: '16px', cursor: 'pointer', marginTop: '4px',
            }}
          >
            {t('common.calculate')}
          </button>
        </div>

        {/* Right: Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {result ? (
            <>
              {/* Hero */}
              <div style={{ background: 'var(--accent)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginBottom: '8px' }}>
                  {t('calculator.savingsCalc.afterTaxMaturity')}
                </div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '32px', color: '#fff', marginBottom: '10px' }}>
                  {fmt(result.afterTaxAmount)}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  ({t('calculator.savingsCalc.beforeTax')} {fmt(result.maturityAmount)})
                </div>
              </div>

              {/* Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: t('calculator.savingsCalc.totalPrincipal'), value: fmt(result.totalPrincipal), color: 'var(--text)' },
                  { label: t('calculator.savingsCalc.interestEarned'), value: '+' + fmt(result.totalInterest), color: 'var(--green)' },
                  { label: t('calculator.savingsCalc.interestTax'), value: '-' + fmt(result.taxAmount), color: 'var(--accent)' },
                  { label: t('calculator.savingsCalc.afterTaxAmount'), value: fmt(result.afterTaxAmount), color: 'var(--blue)', bold: true },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'var(--surface)', border: '2px solid var(--border)',
                    borderRadius: '14px', padding: '14px 18px',
                  }}>
                    <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: '15px', color: item.color, fontWeight: (item as any).bold ? 800 : 700, fontFamily: 'Nunito, sans-serif' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '11px', color: 'var(--muted2)', lineHeight: 1.6, background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '12px', padding: '12px 14px' }}>
                {t('calculator.savingsCalc.taxNote')}
              </div>
            </>
          ) : (
            <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏦</div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>{t('calculator.savingsCalc.emptyPrompt')}</div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};
