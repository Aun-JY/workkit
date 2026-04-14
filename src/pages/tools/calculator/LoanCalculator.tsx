import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

type RepayType = 'equal-installment' | 'equal-principal';

interface Inputs {
  loanAmount: number;
  annualRate: number;
  months: number;
  repayType: RepayType;
}

interface MonthRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface Result {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: MonthRow[];
}

function calculate(inputs: Inputs): Result {
  const { loanAmount, annualRate, months, repayType } = inputs;
  const r = annualRate / 100 / 12;
  const schedule: MonthRow[] = [];
  let balance = loanAmount;

  if (repayType === 'equal-installment') {
    // 원리금균등: EMI = P * r(1+r)^n / ((1+r)^n - 1)
    const emi = r === 0
      ? loanAmount / months
      : (loanAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);

    for (let i = 1; i <= months; i++) {
      const interest = balance * r;
      const principal = emi - interest;
      balance = Math.max(0, balance - principal);
      schedule.push({ month: i, payment: emi, principal, interest, balance });
    }

    const totalPayment = emi * months;
    return { monthlyPayment: emi, totalPayment, totalInterest: totalPayment - loanAmount, schedule };
  } else {
    // 원금균등: 매월 원금 = P/n, 이자 = 잔액 * r
    const principalPerMonth = loanAmount / months;
    let totalPayment = 0;

    for (let i = 1; i <= months; i++) {
      const interest = balance * r;
      const payment = principalPerMonth + interest;
      balance = Math.max(0, balance - principalPerMonth);
      totalPayment += payment;
      schedule.push({ month: i, payment, principal: principalPerMonth, interest, balance });
    }

    return { monthlyPayment: schedule[0].payment, totalPayment, totalInterest: totalPayment - loanAmount, schedule };
  }
}

const fmtNum = (n: number) => Math.round(n).toLocaleString();

export const LoanCalculator: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.loanCalc.name'));
  const fmt = (n: number) => fmtNum(n) + t('calculator.loanCalc.currencyUnit');

  const [inputs, setInputs] = useState<Inputs>({
    loanAmount: 100000000,
    annualRate: 4.5,
    months: 60,
    repayType: 'equal-installment',
  });
  const [result, setResult] = useState<Result | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

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
    <ToolLayout toolId="loan-calc" category="calculator"
      breadcrumbs={[{ label: t('categories.calculator'), path: '/category/calculator' }, { label: t('tools.loanCalc.name') }]}>
      <ToolHeader toolId="loan-calc" category="calculator" nameKey="tools.loanCalc.name" descKey="tools.loanCalc.desc" />

      <style>{`
        .loan-input:focus { border-color: var(--accent) !important; }
        .loan-seg:hover { opacity: 0.85; }
        @media (max-width: 680px) { .loan-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="loan-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Inputs */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '16px', color: 'var(--text)', margin: 0 }}>
            {t('calculator.loanCalc.inputTitle')}
          </h3>

          <div>
            <label style={labelStyle}>{t('calculator.loanCalc.repayType')}</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {([
                ['equal-installment', t('calculator.loanCalc.equalInstallment')],
                ['equal-principal', t('calculator.loanCalc.equalPrincipal')],
              ] as [RepayType, string][]).map(([type, label]) => (
                <button key={type} className="loan-seg"
                  onClick={() => setInputs(p => ({ ...p, repayType: type }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '12px', border: '2px solid',
                    borderColor: inputs.repayType === type ? 'var(--accent)' : 'var(--border)',
                    background: inputs.repayType === type ? 'var(--accent-soft)' : 'var(--surface2)',
                    color: inputs.repayType === type ? 'var(--accent)' : 'var(--muted)',
                    fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>{t('calculator.loanCalc.loanAmountLabel')}</label>
            <input className="loan-input" type="number" style={inputStyle}
              value={inputs.loanAmount}
              onChange={e => setInputs(p => ({ ...p, loanAmount: Number(e.target.value) }))}
              min={0} step={1000000}
            />
            <span style={{ fontSize: '12px', color: 'var(--muted2)', marginTop: '4px', display: 'block' }}>
              {(inputs.loanAmount / 100000000).toFixed(2)}{t('calculator.loanCalc.billionUnit')}
            </span>
          </div>

          <div>
            <label style={labelStyle}>{t('calculator.loanCalc.annualRate')}</label>
            <input className="loan-input" type="number" style={inputStyle}
              value={inputs.annualRate}
              onChange={e => setInputs(p => ({ ...p, annualRate: Number(e.target.value) }))}
              min={0} max={30} step={0.1}
            />
          </div>

          <div>
            <label style={labelStyle}>{t('calculator.loanCalc.loanPeriod')}</label>
            <select className="loan-input" style={{ ...inputStyle, cursor: 'pointer' }}
              value={inputs.months}
              onChange={e => setInputs(p => ({ ...p, months: Number(e.target.value) }))}
            >
              {[12, 24, 36, 60, 84, 120, 180, 240, 300, 360].map(m => {
                const yrs = t('calculator.loanCalc.periodYear', { n: m / 12 });
                return <option key={m} value={m}>{yrs} ({t('calculator.loanCalc.periodMonth', { n: m })})</option>;
              })}
            </select>
          </div>

          <button onClick={() => { setResult(calculate(inputs)); setShowSchedule(false); }}
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
              <div style={{ background: 'var(--accent)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginBottom: '8px' }}>
                  {inputs.repayType === 'equal-installment'
                    ? t('calculator.loanCalc.monthlyPaymentEqual')
                    : t('calculator.loanCalc.firstMonthPayment')}
                </div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '32px', color: '#fff', marginBottom: '10px' }}>
                  {fmt(result.monthlyPayment)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: t('calculator.loanCalc.loanPrincipal'), value: fmt(inputs.loanAmount) },
                  { label: t('calculator.loanCalc.totalInterest'), value: fmt(result.totalInterest), color: 'var(--accent)' },
                  { label: t('calculator.loanCalc.totalRepayment'), value: fmt(result.totalPayment), bold: true },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    background: 'var(--surface)', border: '2px solid var(--border)',
                    borderRadius: '14px', padding: '14px 18px',
                  }}>
                    <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: '15px', color: (item as any).color || 'var(--text)', fontWeight: (item as any).bold ? 800 : 700, fontFamily: 'Nunito, sans-serif' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowSchedule(v => !v)}
                style={{
                  padding: '10px', background: 'var(--surface2)', border: '2px solid var(--border)',
                  borderRadius: '12px', fontFamily: 'Nunito, sans-serif', fontWeight: 700,
                  fontSize: '14px', color: 'var(--text)', cursor: 'pointer',
                }}
              >
                {showSchedule ? t('calculator.loanCalc.hideSchedule') : t('calculator.loanCalc.showSchedule')}
              </button>

              {showSchedule && (
                <div style={{ maxHeight: '320px', overflowY: 'auto', border: '2px solid var(--border)', borderRadius: '14px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface2)', position: 'sticky', top: 0 }}>
                        {[
                          t('calculator.loanCalc.scheduleMonth'),
                          t('calculator.loanCalc.schedulePayment'),
                          t('calculator.loanCalc.schedulePrincipal'),
                          t('calculator.loanCalc.scheduleInterest'),
                          t('calculator.loanCalc.scheduleBalance'),
                        ].map(h => (
                          <th key={h} style={{ padding: '10px 8px', textAlign: 'right', fontFamily: 'Nunito, sans-serif', color: 'var(--muted)', fontWeight: 700, borderBottom: '2px solid var(--border)' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row, i) => (
                        <tr key={row.month} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)' }}>
                          <td style={{ padding: '8px', textAlign: 'right', color: 'var(--muted)' }}>{row.month}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text)', fontWeight: 600 }}>{Math.round(row.payment).toLocaleString()}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: 'var(--blue)' }}>{Math.round(row.principal).toLocaleString()}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: 'var(--accent)' }}>{Math.round(row.interest).toLocaleString()}</td>
                          <td style={{ padding: '8px', textAlign: 'right', color: 'var(--muted)' }}>{Math.round(row.balance).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ fontSize: '11px', color: 'var(--muted2)', lineHeight: 1.6, background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '12px', padding: '12px 14px' }}>
                {t('calculator.loanCalc.disclaimer')}
              </div>
            </>
          ) : (
            <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏠</div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>{t('calculator.loanCalc.emptyPrompt')}</div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};
