import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

type CalcOp = '+' | '-' | '×' | '÷' | null;

interface CalcState {
  display: string;
  prevValue: number | null;
  op: CalcOp;
  waitingForOperand: boolean;
  history: string[];
}

const initialState: CalcState = {
  display: '0',
  prevValue: null,
  op: null,
  waitingForOperand: false,
  history: [],
};

const applyOp = (a: number, b: number, op: CalcOp): number => {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? NaN : a / b;
    default: return b;
  }
};

export const BasicCalculator: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.basicCalculator.name'));

  const [state, setState] = useState<CalcState>(initialState);

  const fmtDisplay = (val: string): string => {
    const num = parseFloat(val);
    if (isNaN(num)) return 'Error';
    if (!isFinite(num)) return t('calculator.basicCalc.divByZero');
    return val;
  };

  const pressDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.waitingForOperand) {
        return { ...prev, display: digit, waitingForOperand: false };
      }
      const newDisplay = prev.display === '0' ? digit : prev.display + digit;
      if (newDisplay.length > 12) return prev;
      return { ...prev, display: newDisplay };
    });
  }, []);

  const pressDot = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) return { ...prev, display: '0.', waitingForOperand: false };
      if (prev.display.includes('.')) return prev;
      return { ...prev, display: prev.display + '.' };
    });
  }, []);

  const pressOp = useCallback((op: CalcOp) => {
    setState(prev => {
      const current = parseFloat(prev.display);
      if (prev.prevValue !== null && !prev.waitingForOperand) {
        const result = applyOp(prev.prevValue, current, prev.op);
        const resultStr = isNaN(result) || !isFinite(result) ? '0' : String(parseFloat(result.toPrecision(12)));
        return { ...prev, display: resultStr, prevValue: parseFloat(resultStr), op, waitingForOperand: true };
      }
      return { ...prev, prevValue: current, op, waitingForOperand: true };
    });
  }, []);

  const pressEquals = useCallback(() => {
    setState(prev => {
      if (prev.prevValue === null || prev.op === null) return prev;
      const current = parseFloat(prev.display);
      const result = applyOp(prev.prevValue, current, prev.op);
      const resultStr = isNaN(result) ? 'Error' : !isFinite(result) ? 'Error' : String(parseFloat(result.toPrecision(12)));
      const histEntry = `${prev.prevValue} ${prev.op} ${current} = ${resultStr}`;
      return {
        display: resultStr === 'Error' ? '0' : resultStr,
        prevValue: null,
        op: null,
        waitingForOperand: true,
        history: [histEntry, ...prev.history].slice(0, 10),
      };
    });
  }, []);

  const pressClear = useCallback(() => setState(prev => ({ ...initialState, history: prev.history })), []);
  const pressClearAll = useCallback(() => setState(initialState), []);

  const pressBackspace = useCallback(() => {
    setState(prev => {
      if (prev.waitingForOperand) return prev;
      const newDisplay = prev.display.length > 1 ? prev.display.slice(0, -1) : '0';
      return { ...prev, display: newDisplay };
    });
  }, []);

  const pressPlusMinus = useCallback(() => {
    setState(prev => {
      const num = parseFloat(prev.display) * -1;
      return { ...prev, display: String(num) };
    });
  }, []);

  const pressPercent = useCallback(() => {
    setState(prev => {
      const num = parseFloat(prev.display) / 100;
      return { ...prev, display: String(num) };
    });
  }, []);

  const btn = (label: string, onClick: () => void, variant: 'digit' | 'op' | 'special' | 'equals' = 'digit') => {
    const colors: Record<string, { bg: string; color: string; border: string }> = {
      digit:   { bg: 'var(--surface2)', color: 'var(--text)',   border: 'var(--border)' },
      op:      { bg: 'var(--accent-soft)', color: 'var(--accent)', border: 'var(--accent-border)' },
      special: { bg: 'var(--surface)', color: 'var(--muted)',   border: 'var(--border)' },
      equals:  { bg: 'var(--accent)', color: '#fff',            border: 'var(--accent)' },
    };
    const c = colors[variant];
    return (
      <button key={label} onClick={onClick}
        style={{
          padding: '18px', borderRadius: '16px', border: `2px solid ${c.border}`,
          background: c.bg, color: c.color,
          fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '18px',
          cursor: 'pointer', transition: 'all 0.1s', userSelect: 'none',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {label}
      </button>
    );
  };

  const displayNum = (() => {
    const d = state.display;
    if (d === 'Error') return d;
    const num = parseFloat(d);
    if (isNaN(num)) return d;
    if (d.endsWith('.') || d.endsWith('.0')) return d;
    if (Math.abs(num) >= 1e12) return num.toExponential(4);
    const parts = d.split('.');
    const intPart = parseInt(parts[0]).toLocaleString('ko-KR');
    return parts.length > 1 ? intPart + '.' + parts[1] : intPart;
  })();

  return (
    <ToolLayout toolId="basic-calculator" category="calculator"
      breadcrumbs={[{ label: t('categories.calculator'), path: '/category/calculator' }, { label: t('tools.basicCalculator.name') }]}>
      <ToolHeader toolId="basic-calculator" category="calculator" nameKey="tools.basicCalculator.name" descKey="tools.basicCalculator.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }} className="calc-outer-grid">
        <style>{`
          @media (max-width: 680px) { .calc-outer-grid { grid-template-columns: 1fr !important; } }
          button:active { opacity: 0.8 !important; }
        `}</style>

        {/* Calculator */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Display */}
          <div style={{ background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '16px', padding: '16px 20px', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '12px', color: 'var(--muted2)', fontFamily: 'Nunito, sans-serif', minHeight: '18px' }}>
              {state.prevValue !== null && state.op ? `${state.prevValue} ${state.op}` : ''}
            </div>
            <div style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: displayNum.length > 10 ? '20px' : '32px',
              color: 'var(--text)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {displayNum}
            </div>
          </div>

          {/* Buttons grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {btn('AC', pressClearAll, 'special')}
            {btn('C', pressClear, 'special')}
            {btn('%', pressPercent, 'special')}
            {btn('÷', () => pressOp('÷'), 'op')}

            {btn('7', () => pressDigit('7'))}
            {btn('8', () => pressDigit('8'))}
            {btn('9', () => pressDigit('9'))}
            {btn('×', () => pressOp('×'), 'op')}

            {btn('4', () => pressDigit('4'))}
            {btn('5', () => pressDigit('5'))}
            {btn('6', () => pressDigit('6'))}
            {btn('-', () => pressOp('-'), 'op')}

            {btn('1', () => pressDigit('1'))}
            {btn('2', () => pressDigit('2'))}
            {btn('3', () => pressDigit('3'))}
            {btn('+', () => pressOp('+'), 'op')}

            {btn('+/-', pressPlusMinus, 'special')}
            {btn('0', () => pressDigit('0'))}
            {btn('.', pressDot)}

            {/* = spans 1 col */}
            {btn('=', pressEquals, 'equals')}
          </div>

          {/* Backspace */}
          <button onClick={pressBackspace}
            style={{
              padding: '12px', borderRadius: '14px', border: '2px solid var(--border)',
              background: 'var(--surface2)', color: 'var(--muted)',
              fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            ⌫ {t('calculator.basicCalc.backspace')}
          </button>
        </div>

        {/* History */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '24px', padding: '20px' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '14px', color: 'var(--muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('calculator.basicCalc.history')}
          </div>
          {state.history.length === 0 ? (
            <div style={{ color: 'var(--muted2)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
              {t('calculator.basicCalc.historyEmpty')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {state.history.map((entry, i) => (
                <div key={i} style={{
                  padding: '12px 16px', background: 'var(--surface2)',
                  border: '2px solid var(--border)', borderRadius: '12px',
                  fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: 'var(--text)',
                  opacity: i === 0 ? 1 : 0.6 - i * 0.05,
                }}>
                  {entry}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};
