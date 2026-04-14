import React, { useState, useCallback, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useCurrency } from '../../../hooks/useCurrency';

interface Person {
  id: string;
  name: string;
  extra: number;
}

interface SplitResult {
  id: string;
  name: string;
  share: number;
}

export const DutchPay: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.dutchPay.name'));
  const { format, defaultTotal, personLabel, symbol, suffix } = useCurrency();
  const uid = useId();

  const [totalAmount, setTotalAmount] = useState<number>(defaultTotal);
  const [basePeople, setBasePeople] = useState<number>(4);
  const [people, setPeople] = useState<Person[]>([]);
  const [copied, setCopied] = useState(false);

  const addPerson = useCallback(() => {
    setPeople(prev => [...prev, { id: `${uid}-${Date.now()}`, name: `+${prev.length + 1}`, extra: 0 }]);
  }, [uid]);

  const removePerson = useCallback((id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
  }, []);

  const updatePerson = useCallback((id: string, field: keyof Omit<Person, 'id'>, value: string | number) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  }, []);

  const results: SplitResult[] = React.useMemo(() => {
    const totalExtra = people.reduce((sum, p) => sum + (p.extra || 0), 0);
    const remaining = totalAmount - totalExtra;
    const baseShare = basePeople > 0 ? remaining / basePeople : 0;
    const res: SplitResult[] = [];
    for (let i = 0; i < basePeople; i++) {
      res.push({ id: `base-${i}`, name: `#${i + 1}`, share: baseShare });
    }
    people.forEach(p => {
      res.push({ id: p.id, name: p.name || `#${basePeople + people.indexOf(p) + 1}`, share: baseShare + (p.extra || 0) });
    });
    return res;
  }, [totalAmount, basePeople, people]);

  const totalPeople = basePeople + people.length;

  const copyResult = useCallback(() => {
    const lines = [
      `Total: ${format(totalAmount)}`,
      `Participants: ${totalPeople}`,
      '',
      ...results.map(r => `${r.name}: ${format(r.share)}`),
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [totalAmount, totalPeople, results, format]);

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px', background: 'var(--surface)', border: '2px solid var(--border)',
    borderRadius: '14px', color: 'var(--text)', fontSize: '15px',
    fontFamily: 'Nunito Sans, sans-serif', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '12px', fontWeight: 700, color: 'var(--muted)',
    textTransform: 'uppercase' as const, letterSpacing: '0.04em',
    display: 'block', marginBottom: '6px',
  };
  const totalLabel = symbol
    ? t('calculator.dutchPay.totalAmountSymbol', { symbol })
    : t('calculator.dutchPay.totalAmountSuffix', { suffix });
  const peopleLabel = t('calculator.dutchPay.baseParticipants');
  const extraLabel = t('calculator.dutchPay.extra');

  return (
    <ToolLayout toolId="dutch-pay" category="calculator"
      breadcrumbs={[{ label: t('categories.calculator'), path: '/category/calculator' }, { label: t('tools.dutchPay.name') }]}>
      <ToolHeader toolId="dutch-pay" category="calculator" nameKey="tools.dutchPay.name" descKey="tools.dutchPay.desc" />

      <style>{`
        .dutch-input:focus { border-color: var(--accent) !important; }
        .dutch-btn-add:hover { background: var(--accent-soft) !important; border-color: var(--accent-border) !important; }
        .dutch-btn-copy:hover { opacity: 0.85; }
        .dutch-btn-remove:hover { color: var(--accent) !important; }
        @media (max-width: 680px) { .dutch-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="dutch-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '16px', color: 'var(--text)', margin: 0 }}>
              {t('calculator.dutchPay.basicSettings')}
            </h3>

            <div>
              <label style={labelStyle} htmlFor={`${uid}-total`}>{totalLabel}</label>
              <input id={`${uid}-total`} className="dutch-input" type="number"
                style={{ ...inputStyle, width: '100%' }}
                value={totalAmount} onChange={e => setTotalAmount(Number(e.target.value))}
                min={0} step={totalAmount >= 10000 ? 1000 : totalAmount >= 100 ? 10 : 1}
              />
            </div>

            <div>
              <label style={labelStyle}>{peopleLabel}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setBasePeople(p => Math.max(1, p - 1))}
                  style={{ width: '38px', height: '38px', border: '2px solid var(--border)', borderRadius: '999px', background: 'var(--surface)', color: 'var(--text)', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>
                  −
                </button>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: 'var(--text)', minWidth: '40px', textAlign: 'center' }}>
                  {basePeople}
                </span>
                <button onClick={() => setBasePeople(p => p + 1)}
                  style={{ width: '38px', height: '38px', border: '2px solid var(--border)', borderRadius: '999px', background: 'var(--surface)', color: 'var(--text)', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>
                  +
                </button>
                <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{personLabel}</span>
              </div>
            </div>
          </div>

          {/* Custom people */}
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '16px', color: 'var(--text)', margin: 0 }}>
                {t('calculator.dutchPay.individualAdjustments')}
              </h3>
              <button className="dutch-btn-add" onClick={addPerson}
                style={{ padding: '6px 14px', border: '2px solid var(--border)', borderRadius: '999px', background: 'var(--surface2)', color: 'var(--text)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito Sans, sans-serif', transition: 'background 0.15s, border-color 0.15s' }}>
                + {t('calculator.dutchPay.add')}
              </button>
            </div>

            {people.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--muted2)', textAlign: 'center', padding: '8px 0' }}>
                {t('calculator.dutchPay.addHint')}
              </p>
            )}

            {people.map(person => (
              <div key={person.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input className="dutch-input" type="text"
                  placeholder={t('calculator.dutchPay.namePlaceholder')}
                  style={{ ...inputStyle, flex: '1', minWidth: 0 }}
                  value={person.name}
                  onChange={e => updatePerson(person.id, 'name', e.target.value)}
                />
                <input className="dutch-input" type="number"
                  placeholder={extraLabel}
                  style={{ ...inputStyle, width: '110px', flexShrink: 0 }}
                  value={person.extra}
                  onChange={e => updatePerson(person.id, 'extra', Number(e.target.value))}
                  step={totalAmount >= 10000 ? 1000 : 1}
                />
                <button className="dutch-btn-remove" onClick={() => removePerson(person.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '18px', padding: '4px', flexShrink: 0, transition: 'color 0.15s' }}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--accent)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              {t('calculator.dutchPay.totalAmount')}
            </div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '30px', color: '#fff', marginBottom: '6px' }}>
              {format(totalAmount)}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              {totalPeople} {personLabel}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '15px', color: 'var(--text)', marginBottom: '14px' }}>
              {t('calculator.dutchPay.splitDetails')}
            </div>

            {results.map((r, i) => (
              <div key={r.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', background: 'var(--accent-soft)', border: '2px solid var(--accent-border)', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>{r.name}</span>
                </div>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '17px', color: 'var(--text)' }}>
                  {format(r.share)}
                </span>
              </div>
            ))}
          </div>

          <button className="dutch-btn-copy" onClick={copyResult}
            style={{ padding: '12px', background: copied ? 'var(--green)' : 'var(--surface)', border: `2px solid ${copied ? 'var(--green-border)' : 'var(--border)'}`, borderRadius: '999px', color: copied ? '#fff' : 'var(--text)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
            {copied ? `✓ ${t('common.copied')}` : `📋 ${t('calculator.dutchPay.copyResult')}`}
          </button>
        </div>
      </div>
    </ToolLayout>
  );
};
