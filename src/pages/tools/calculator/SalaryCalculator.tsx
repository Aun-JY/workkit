import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

// ─── Country configs ────────────────────────────────────────────────────────

type CountryCode = 'KR' | 'US' | 'JP' | 'CN' | 'ES' | 'MX' | 'CO' | 'AR';

interface DeductionItem { label: string; amount: number; }
interface CalcResult {
  grossAnnual: number;
  grossMonthly: number;
  deductions: DeductionItem[];
  totalDeduction: number;
  netMonthly: number;
  netAnnual: number;
  currency: string;
  note: string;
}

// Korea ─────────────────────────────────────────────────────────────────────
function calcKR(annual: number, dependents: number, children: number, nonTaxable: number): CalcResult {
  const monthly = annual / 12;
  const taxable = monthly - nonTaxable;
  const pensionBase = Math.min(taxable, 5230000);
  const pension = Math.min(Math.floor(pensionBase * 0.045), 235800);
  const health = Math.floor(taxable * 0.03545);
  const ltc = Math.floor(health * 0.1295);
  const employ = Math.floor(taxable * 0.009);
  let baseTax = 0;
  if (taxable > 1060000) {
    if (taxable <= 1500000) baseTax = (taxable - 1060000) * 0.06;
    else if (taxable <= 3000000) baseTax = 26400 + (taxable - 1500000) * 0.15;
    else if (taxable <= 4500000) baseTax = 251400 + (taxable - 3000000) * 0.24;
    else baseTax = 611400 + (taxable - 4500000) * 0.35;
  }
  const deductMonthly = (dependents * 150000 + children * 150000) / 12;
  const incomeTax = Math.max(0, Math.floor(baseTax - deductMonthly));
  const localTax = Math.floor(incomeTax * 0.1);
  const total = pension + health + ltc + employ + incomeTax + localTax;
  return {
    grossAnnual: annual, grossMonthly: monthly, currency: '원',
    deductions: [
      { label: '국민연금 (4.5%)', amount: pension },
      { label: '건강보험 (3.545%)', amount: health },
      { label: '장기요양 (건보×12.95%)', amount: ltc },
      { label: '고용보험 (0.9%)', amount: employ },
      { label: '소득세 (간이)', amount: incomeTax },
      { label: '지방소득세 (소득세×10%)', amount: localTax },
    ],
    totalDeduction: total, netMonthly: monthly - total, netAnnual: (monthly - total) * 12,
    note: '2024년 간이세액표 기준. 실제 세액과 차이가 있을 수 있습니다.',
  };
}

// United States ─────────────────────────────────────────────────────────────
function calcUS(annualUSD: number): CalcResult {
  const monthly = annualUSD / 12;
  // FICA
  const ssTaxable = Math.min(annualUSD, 168600);
  const ss = ssTaxable * 0.062 / 12;
  const medicare = monthly * 0.0145;
  // Federal income tax (2024 single filer, standard deduction $14,600)
  const taxableIncome = Math.max(0, annualUSD - 14600);
  let fedAnnual = 0;
  const brackets = [[11600, 0.10], [47150 - 11600, 0.12], [100525 - 47150, 0.22], [191950 - 100525, 0.24], [243725 - 191950, 0.32], [609350 - 243725, 0.35]];
  let remaining = taxableIncome;
  for (const [cap, rate] of brackets) {
    const chunk = Math.min(remaining, cap as number);
    fedAnnual += chunk * (rate as number);
    remaining -= chunk;
    if (remaining <= 0) break;
  }
  if (remaining > 0) fedAnnual += remaining * 0.37;
  const fedMonthly = fedAnnual / 12;
  const total = ss + medicare + fedMonthly;
  return {
    grossAnnual: annualUSD, grossMonthly: monthly, currency: '$',
    deductions: [
      { label: 'Social Security (6.2%)', amount: ss },
      { label: 'Medicare (1.45%)', amount: medicare },
      { label: 'Federal Income Tax', amount: fedMonthly },
    ],
    totalDeduction: total, netMonthly: monthly - total, netAnnual: (monthly - total) * 12,
    note: '2024 Single filer, standard deduction. State/local taxes not included.',
  };
}

// Japan ─────────────────────────────────────────────────────────────────────
function calcJP(annualJPY: number, dependents: number): CalcResult {
  const monthly = annualJPY / 12;
  const health = Math.floor(monthly * 0.05185);
  const pension = Math.floor(monthly * 0.0915);
  const employ = Math.floor(monthly * 0.006);
  // 所得税
  const taxableAnnual = Math.max(0, annualJPY - 480000 - dependents * 380000);
  const jBrackets: [number, number][] = [[1950000, 0.05], [3300000, 0.10], [6950000, 0.20], [9000000, 0.23], [18000000, 0.33], [40000000, 0.40]];
  let itAnnual = 0, rem = taxableAnnual, prev = 0;
  for (const [cap, rate] of jBrackets) {
    const chunk = Math.min(rem, cap - prev);
    if (chunk <= 0) break;
    itAnnual += chunk * rate;
    rem -= chunk; prev = cap;
    if (rem <= 0) break;
  }
  if (rem > 0) itAnnual += rem * 0.45;
  const incomeTax = Math.floor(itAnnual / 12);
  const residentTax = Math.floor(taxableAnnual * 0.10 / 12);
  const total = health + pension + employ + incomeTax + residentTax;
  return {
    grossAnnual: annualJPY, grossMonthly: monthly, currency: '円',
    deductions: [
      { label: '健康保険 (5.185%)', amount: health },
      { label: '厚生年金 (9.15%)', amount: pension },
      { label: '雇用保険 (0.6%)', amount: employ },
      { label: '所得税', amount: incomeTax },
      { label: '住民税 (10%)', amount: residentTax },
    ],
    totalDeduction: total, netMonthly: monthly - total, netAnnual: (monthly - total) * 12,
    note: '協会けんぽ（東京）基準の概算。実際と異なる場合があります。',
  };
}

// China ─────────────────────────────────────────────────────────────────────
function calcCN(annualCNY: number): CalcResult {
  const monthly = annualCNY / 12;
  const pension = Math.floor(monthly * 0.08);
  const medical = Math.floor(monthly * 0.02);
  const unemploy = Math.floor(monthly * 0.005);
  // 个人所得税: 起征点 5000/month
  const taxableMonthly = Math.max(0, monthly - 5000 - pension - medical - unemploy);
  const cBrackets: [number, number, number][] = [
    [3000, 0.03, 0], [12000, 0.10, 210], [25000, 0.20, 1410], [35000, 0.25, 2660],
    [55000, 0.30, 4410], [80000, 0.35, 7160], [Infinity, 0.45, 15160],
  ];
  let itm = 0;
  for (const [cap, rate, quickDeduct] of cBrackets) {
    if (taxableMonthly <= cap) { itm = taxableMonthly * rate - quickDeduct; break; }
  }
  const total = pension + medical + unemploy + Math.max(0, itm);
  return {
    grossAnnual: annualCNY, grossMonthly: monthly, currency: '元',
    deductions: [
      { label: '养老保险 (8%)', amount: pension },
      { label: '医疗保险 (2%)', amount: medical },
      { label: '失业保险 (0.5%)', amount: unemploy },
      { label: '个人所得税', amount: Math.max(0, itm) },
    ],
    totalDeduction: total, netMonthly: monthly - total, netAnnual: (monthly - total) * 12,
    note: '起征点5000元/月基准。住房公积金等未含。',
  };
}

// Spain ─────────────────────────────────────────────────────────────────────
function calcES(annualEUR: number): CalcResult {
  const monthly = annualEUR / 12;
  const ss = Math.floor(monthly * 0.0635); // cotización 4.7% + desempleo 1.55% + FP 0.1%
  // IRPF (simplified, single)
  const taxable = Math.max(0, annualEUR - 5550); // mínimo personal
  const eBrackets: [number, number][] = [[12450, 0.19], [20200, 0.24], [35200, 0.30], [60000, 0.37], [300000, 0.45]];
  let irpfAnnual = 0, eRem = taxable, ePrev = 0;
  for (const [cap, rate] of eBrackets) {
    const chunk = Math.min(eRem, cap - ePrev);
    if (chunk <= 0) break;
    irpfAnnual += chunk * rate;
    eRem -= chunk; ePrev = cap;
    if (eRem <= 0) break;
  }
  if (eRem > 0) irpfAnnual += eRem * 0.47;
  const irpf = Math.floor(irpfAnnual / 12);
  const total = ss + irpf;
  return {
    grossAnnual: annualEUR, grossMonthly: monthly, currency: '€',
    deductions: [
      { label: 'Seg. Social trabajador (6.35%)', amount: ss },
      { label: 'IRPF (retención est.)', amount: irpf },
    ],
    totalDeduction: total, netMonthly: monthly - total, netAnnual: (monthly - total) * 12,
    note: 'Base: soltero, mínimo personal €5.550. Estimación orientativa.',
  };
}

// Mexico ─────────────────────────────────────────────────────────────────────
function calcMX(annualMXN: number): CalcResult {
  const monthly = annualMXN / 12;
  const imss = Math.floor(monthly * 0.01125);
  // ISR 2024 (annual brackets, simplified)
  const taxableAnnual = Math.max(0, annualMXN - 89600); // deducción personal simplificada
  let isrAnnual = 0;
  const mxAnnualBrackets: [number, number][] = [[8952, 0.0192], [75984, 0.064], [133536, 0.1088], [155257, 0.16], [185832, 0.1792], [374838, 0.2136], [590796, 0.2352], [1127927, 0.30], [1503902, 0.32], [4511707, 0.34], [Infinity, 0.35]];
  let mRem = taxableAnnual, mPrev = 0;
  for (const [cap, rate] of mxAnnualBrackets) {
    const chunk = Math.min(mRem, cap - mPrev);
    if (chunk <= 0) break;
    isrAnnual += chunk * rate;
    mRem -= chunk; mPrev = cap;
    if (mRem <= 0) break;
  }
  if (mRem > 0) isrAnnual += mRem * 0.35;
  const isr = Math.floor(isrAnnual / 12);
  const total = imss + isr;
  return {
    grossAnnual: annualMXN, grossMonthly: monthly, currency: '$',
    deductions: [
      { label: 'IMSS cuota obrero (~1.125%)', amount: imss },
      { label: 'ISR (retención mensual)', amount: isr },
    ],
    totalDeduction: total, netMonthly: monthly - total, netAnnual: (monthly - total) * 12,
    note: 'Estimación simplificada. No incluye INFONAVIT ni prestaciones adicionales.',
  };
}

// Colombia ───────────────────────────────────────────────────────────────────
function calcCO(annualCOP: number): CalcResult {
  const monthly = annualCOP / 12;
  const health = Math.floor(monthly * 0.04);
  const pension = Math.floor(monthly * 0.04);
  // Renta simplificada
  const taxableAnnual = Math.max(0, annualCOP - 32660000); // UVT aprox
  const coBrackets: [number, number][] = [[39792000, 0.19], [99480000, 0.28], [198960000, 0.33], [Infinity, 0.39]];
  let rentaAnnual = 0, coRem = taxableAnnual, coPrev = 0;
  for (const [cap, rate] of coBrackets) {
    const chunk = Math.min(coRem, cap - coPrev);
    if (chunk <= 0) break;
    rentaAnnual += chunk * rate;
    coRem -= chunk; coPrev = cap;
    if (coRem <= 0) break;
  }
  if (coRem > 0) rentaAnnual += coRem * 0.39;
  const renta = Math.floor(rentaAnnual / 12);
  const total = health + pension + renta;
  return {
    grossAnnual: annualCOP, grossMonthly: monthly, currency: '$',
    deductions: [
      { label: 'Salud (4%)', amount: health },
      { label: 'Pensión (4%)', amount: pension },
      { label: 'Retención en la fuente', amount: renta },
    ],
    totalDeduction: total, netMonthly: monthly - total, netAnnual: (monthly - total) * 12,
    note: 'Estimación 2024 (sin solidaridad, sin cesantías). Solo referencia.',
  };
}

// Argentina ───────────────────────────────────────────────────────────────────
function calcAR(annualARS: number): CalcResult {
  const monthly = annualARS / 12;
  const jubilaciones = Math.floor(monthly * 0.11);
  const obraSocial = Math.floor(monthly * 0.03);
  // Impuesto a las ganancias (simplificado 2024)
  const taxableMonthly = Math.max(0, monthly - 506230); // MNI aprox
  const gBrackets: [number, number, number][] = [
    [419253, 0.05, 0], [838507, 0.09, 20963], [1257760, 0.12, 58729],
    [1677013, 0.15, 108985], [2515520, 0.19, 171941], [3354027, 0.23, 331379],
    [5031040, 0.27, 524117], [6708053, 0.31, 977112], [Infinity, 0.35, 1497154],
  ];
  const gPrevCaps = [0, 419253, 838507, 1257760, 1677013, 2515520, 3354027, 5031040, 6708053];
  let ganancias = 0;
  for (let gi = 0; gi < gBrackets.length; gi++) {
    const [cap, rate, fixed] = gBrackets[gi];
    if (taxableMonthly <= cap) { ganancias = fixed + (taxableMonthly - gPrevCaps[gi]) * rate; break; }
  }
  const total = jubilaciones + obraSocial + Math.max(0, ganancias);
  return {
    grossAnnual: annualARS, grossMonthly: monthly, currency: '$',
    deductions: [
      { label: 'Jubilaciones y pensiones (11%)', amount: jubilaciones },
      { label: 'Obra social (3%)', amount: obraSocial },
      { label: 'Impuesto a las ganancias', amount: Math.max(0, ganancias) },
    ],
    totalDeduction: total, netMonthly: monthly - total, netAnnual: (monthly - total) * 12,
    note: 'Referencia 2024. MNI y escalas ajustadas por inflación periódicamente.',
  };
}

// ─── Country metadata ─────────────────────────────────────────────────────

const COUNTRY_CONFIG: Record<CountryCode, {
  label: string; flag: string; salaryLabel: string;
  defaultSalary: number; extra?: { label: string; key: string; default: number; max?: number }[];
}> = {
  KR: { label: '한국', flag: '🇰🇷', salaryLabel: '연봉 (원)', defaultSalary: 40000000,
    extra: [
      { label: '부양가족 수 (본인 포함)', key: 'dependents', default: 1, max: 10 },
      { label: '20세 미만 자녀 수', key: 'children', default: 0, max: 10 },
      { label: '비과세 금액 (월, 원)', key: 'nonTaxable', default: 100000 },
    ]},
  US: { label: 'United States', flag: '🇺🇸', salaryLabel: 'Annual Salary (USD)', defaultSalary: 60000 },
  JP: { label: '日本', flag: '🇯🇵', salaryLabel: '年収 (円)', defaultSalary: 5000000,
    extra: [{ label: '扶養親族の数', key: 'dependents', default: 0, max: 10 }]},
  CN: { label: '中国', flag: '🇨🇳', salaryLabel: '年薪 (元)', defaultSalary: 200000 },
  ES: { label: 'España', flag: '🇪🇸', salaryLabel: 'Salario anual (EUR)', defaultSalary: 30000 },
  MX: { label: 'México', flag: '🇲🇽', salaryLabel: 'Salario anual (MXN)', defaultSalary: 300000 },
  CO: { label: 'Colombia', flag: '🇨🇴', salaryLabel: 'Salario anual (COP)', defaultSalary: 48000000 },
  AR: { label: 'Argentina', flag: '🇦🇷', salaryLabel: 'Salario anual (ARS)', defaultSalary: 12000000 },
};

const LANG_TO_COUNTRY: Record<string, CountryCode> = { ko: 'KR', en: 'US', ja: 'JP', zh: 'CN', es: 'ES' };
const ES_COUNTRIES: CountryCode[] = ['ES', 'MX', 'CO', 'AR'];

function runCalc(country: CountryCode, salary: number, extra: Record<string, number>): CalcResult {
  switch (country) {
    case 'KR': return calcKR(salary, extra.dependents ?? 1, extra.children ?? 0, extra.nonTaxable ?? 100000);
    case 'US': return calcUS(salary);
    case 'JP': return calcJP(salary, extra.dependents ?? 0);
    case 'CN': return calcCN(salary);
    case 'ES': return calcES(salary);
    case 'MX': return calcMX(salary);
    case 'CO': return calcCO(salary);
    case 'AR': return calcAR(salary);
  }
}

// ─── Component ─────────────────────────────────────────────────────────────

const DeductionCard: React.FC<{ label: string; amount: number; currency: string }> = ({ label, amount, currency }) => (
  <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '14px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}>
      -{currency}{Math.round(Math.abs(amount)).toLocaleString()}
    </span>
  </div>
);

export const SalaryCalculator: React.FC = () => {
  const { t, i18n } = useTranslation();
  usePageTitle(t('tools.salary.name'));

  const lang = i18n.language.split('-')[0];
  const defaultCountry = LANG_TO_COUNTRY[lang] ?? 'KR';
  const [country, setCountry] = useState<CountryCode>(defaultCountry);
  const cfg = COUNTRY_CONFIG[country];

  const [salary, setSalary] = useState(cfg.defaultSalary);
  const [extra, setExtra] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    cfg.extra?.forEach(e => { init[e.key] = e.default; });
    return init;
  });
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCountryChange = (c: CountryCode) => {
    const newCfg = COUNTRY_CONFIG[c];
    setCountry(c);
    setSalary(newCfg.defaultSalary);
    const init: Record<string, number> = {};
    newCfg.extra?.forEach(e => { init[e.key] = e.default; });
    setExtra(init);
    setResult(null);
  };

  const handleCalculate = useCallback(() => {
    setResult(runCalc(country, salary, extra));
  }, [country, salary, extra]);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '2px solid var(--border)',
    borderRadius: '14px', color: 'var(--text)', fontSize: '15px',
    fontFamily: 'Nunito Sans, sans-serif', boxSizing: 'border-box', outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px',
  };

  return (
    <ToolLayout toolId="salary" category="calculator"
      breadcrumbs={[{ label: t('categories.calculator'), path: '/category/calculator' }, { label: t('tools.salary.name') }]}>
      <ToolHeader toolId="salary" category="calculator" nameKey="tools.salary.name" descKey="tools.salary.desc" />

      <style>{`
        .sal2-input:focus { border-color: var(--accent) !important; }
        .sal2-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .sal2-btn:active { transform: translateY(0); }
        @media (max-width: 680px) { .sal2-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Country selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>국가 / Country</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(lang === 'es' ? ES_COUNTRIES : [defaultCountry]).concat(
            lang === 'es' ? [] : (Object.keys(COUNTRY_CONFIG) as CountryCode[]).filter(c => c !== defaultCountry)
          ).map(c => (
            <button key={c}
              onClick={() => handleCountryChange(c)}
              style={{
                padding: '7px 14px', borderRadius: '999px', border: '2px solid',
                borderColor: country === c ? 'var(--accent)' : 'var(--border)',
                background: country === c ? 'var(--accent-soft)' : 'var(--surface)',
                color: country === c ? 'var(--accent)' : 'var(--muted)',
                fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {COUNTRY_CONFIG[c].flag} {COUNTRY_CONFIG[c].label}
            </button>
          ))}
        </div>
      </div>

      <div className="sal2-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Inputs */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '16px', color: 'var(--text)', margin: 0 }}>
            {cfg.flag} 급여 정보 입력
          </h3>

          <div>
            <label style={labelStyle}>{cfg.salaryLabel}</label>
            <input className="sal2-input" type="number" style={inputStyle}
              value={salary} onChange={e => setSalary(Number(e.target.value))}
              min={0} step={cfg.defaultSalary / 40}
            />
          </div>

          {cfg.extra?.map(field => (
            <div key={field.key}>
              <label style={labelStyle}>{field.label}</label>
              {field.max && field.max <= 10 ? (
                <select className="sal2-input" style={{ ...inputStyle, cursor: 'pointer' }}
                  value={extra[field.key] ?? field.default}
                  onChange={e => setExtra(p => ({ ...p, [field.key]: Number(e.target.value) }))}>
                  {Array.from({ length: (field.max ?? 10) + 1 }, (_, i) => i).map(n => (
                    <option key={n} value={n}>{n}{field.key === 'dependents' ? '명' : '명'}</option>
                  ))}
                </select>
              ) : (
                <input className="sal2-input" type="number" style={inputStyle}
                  value={extra[field.key] ?? field.default}
                  onChange={e => setExtra(p => ({ ...p, [field.key]: Number(e.target.value) }))}
                  min={0} step={10000}
                />
              )}
            </div>
          ))}

          <button className="sal2-btn" onClick={handleCalculate}
            style={{
              width: '100%', padding: '13px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: '999px', fontFamily: 'Nunito, sans-serif',
              fontWeight: 800, fontSize: '16px', cursor: 'pointer', transition: 'opacity 0.15s, transform 0.15s', marginTop: '4px',
            }}
          >
            {t('common.calculate')}
          </button>
        </div>

        {/* Right: Results */}
        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--accent)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                월 실수령액
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '34px', color: '#fff', marginBottom: '10px', letterSpacing: '-0.02em' }}>
                {result.currency}{Math.round(result.netMonthly).toLocaleString()}
              </div>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.18)', borderRadius: '999px', padding: '5px 16px', fontSize: '14px', color: '#fff', fontWeight: 700 }}>
                연간: {result.currency}{Math.round(result.netAnnual).toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '16px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>세전</div>
                <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 700 }}>{result.currency}{Math.round(result.grossMonthly).toLocaleString()}</div>
              </div>
              <div style={{ color: 'var(--muted2)', fontSize: '18px' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>공제</div>
                <div style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 700 }}>-{result.currency}{Math.round(result.totalDeduction).toLocaleString()}</div>
              </div>
              <div style={{ color: 'var(--muted2)', fontSize: '18px' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>실수령</div>
                <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 700 }}>{result.currency}{Math.round(result.netMonthly).toLocaleString()}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                공제 내역
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {result.deductions.map(d => (
                  <DeductionCard key={d.label} label={d.label} amount={d.amount} currency={result.currency} />
                ))}
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--muted2)', lineHeight: 1.6, background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '12px', padding: '12px 14px' }}>
              ※ {result.note}
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💼</div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>정보를 입력하고<br />계산하기를 누르세요</div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
