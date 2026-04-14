import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

type Category = 'length' | 'weight' | 'temperature' | 'area' | 'speed' | 'volume';

interface Unit {
  label: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const UNITS: Record<Category, Unit[]> = {
  length: [
    { label: 'converter.unitConverter.units.mm', symbol: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: 'converter.unitConverter.units.cm', symbol: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
    { label: 'converter.unitConverter.units.m', symbol: 'm', toBase: v => v, fromBase: v => v },
    { label: 'converter.unitConverter.units.km', symbol: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'converter.unitConverter.units.in', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { label: 'converter.unitConverter.units.ft', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { label: 'converter.unitConverter.units.yd', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { label: 'converter.unitConverter.units.mi', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
  ],
  weight: [
    { label: 'converter.unitConverter.units.mg', symbol: 'mg', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    { label: 'converter.unitConverter.units.g', symbol: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: 'converter.unitConverter.units.kg', symbol: 'kg', toBase: v => v, fromBase: v => v },
    { label: 'converter.unitConverter.units.t', symbol: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'converter.unitConverter.units.oz', symbol: 'oz', toBase: v => v * 0.02835, fromBase: v => v / 0.02835 },
    { label: 'converter.unitConverter.units.lb', symbol: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { label: 'converter.unitConverter.units.geun', symbol: '근', toBase: v => v * 0.6, fromBase: v => v / 0.6 },
  ],
  temperature: [
    { label: 'converter.unitConverter.units.celsius', symbol: '°C', toBase: v => v, fromBase: v => v },
    { label: 'converter.unitConverter.units.fahrenheit', symbol: '°F', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { label: 'converter.unitConverter.units.kelvin', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  area: [
    { label: 'converter.unitConverter.units.mm2', symbol: 'mm²', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { label: 'converter.unitConverter.units.cm2', symbol: 'cm²', toBase: v => v / 10000, fromBase: v => v * 10000 },
    { label: 'converter.unitConverter.units.m2', symbol: 'm²', toBase: v => v, fromBase: v => v },
    { label: 'converter.unitConverter.units.km2', symbol: 'km²', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { label: 'converter.unitConverter.units.pyeong', symbol: '평', toBase: v => v * 3.30579, fromBase: v => v / 3.30579 },
    { label: 'converter.unitConverter.units.ft2', symbol: 'ft²', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    { label: 'converter.unitConverter.units.ac', symbol: 'ac', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    { label: 'converter.unitConverter.units.ha', symbol: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 },
  ],
  speed: [
    { label: 'converter.unitConverter.units.ms', symbol: 'm/s', toBase: v => v, fromBase: v => v },
    { label: 'converter.unitConverter.units.kmh', symbol: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    { label: 'converter.unitConverter.units.mph', symbol: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { label: 'converter.unitConverter.units.kn', symbol: 'kn', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
  ],
  volume: [
    { label: 'converter.unitConverter.units.mL', symbol: 'mL', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: 'converter.unitConverter.units.L', symbol: 'L', toBase: v => v, fromBase: v => v },
    { label: 'converter.unitConverter.units.m3', symbol: 'm³', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'converter.unitConverter.units.gal', symbol: 'gal', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
    { label: 'converter.unitConverter.units.pt', symbol: 'pt', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
    { label: 'converter.unitConverter.units.floz', symbol: 'fl oz', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    { label: 'converter.unitConverter.units.tbsp', symbol: 'tbsp', toBase: v => v * 0.0147868, fromBase: v => v / 0.0147868 },
    { label: 'converter.unitConverter.units.cup', symbol: 'cup', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
  ],
};

const CATEGORY_LABEL_KEYS: Record<Category, string> = {
  length: 'converter.unitConverter.length',
  weight: 'converter.unitConverter.weight',
  temperature: 'converter.unitConverter.temperature',
  area: 'converter.unitConverter.area',
  speed: 'converter.unitConverter.speed',
  volume: 'converter.unitConverter.volume',
};

const CATEGORY_ICONS: Record<Category, string> = {
  length: '📏', weight: '⚖️', temperature: '🌡️',
  area: '📐', speed: '🚀', volume: '🧪',
};

const fmtNum = (n: number): string => {
  if (!isFinite(n) || isNaN(n)) return '—';
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 0.0001 && n !== 0)) {
    return n.toExponential(4);
  }
  return parseFloat(n.toPrecision(8)).toLocaleString('en-US', { maximumSignificantDigits: 8 });
};

export const UnitConverter: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.unitConverter.name'));

  const [category, setCategory] = useState<Category>('length');
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(2);
  const [inputVal, setInputVal] = useState('1');

  const units = UNITS[category];

  const convertedVal = (() => {
    const num = parseFloat(inputVal);
    if (isNaN(num)) return '—';
    const base = units[fromIdx].toBase(num);
    const result = units[toIdx].fromBase(base);
    return fmtNum(result);
  })();

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromIdx(0);
    setToIdx(Math.min(2, UNITS[cat].length - 1));
    setInputVal('1');
  };

  const swap = () => {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
  };

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: 'var(--surface)', border: '2px solid var(--border)',
    borderRadius: '14px', color: 'var(--text)', fontSize: '14px',
    fontFamily: 'Nunito Sans, sans-serif', outline: 'none', cursor: 'pointer',
  };

  return (
    <ToolLayout toolId="unit-converter" category="converter"
      breadcrumbs={[{ label: t('categories.converter'), path: '/category/converter' }, { label: t('tools.unitConverter.name') }]}>
      <ToolHeader toolId="unit-converter" category="converter" nameKey="tools.unitConverter.name" descKey="tools.unitConverter.desc" />

      <style>{`
        .unit-cat:hover { opacity: 0.85; }
        .unit-input:focus { border-color: var(--accent) !important; }
      `}</style>

      {/* Category tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {(Object.keys(CATEGORY_LABEL_KEYS) as Category[]).map(cat => (
          <button key={cat} className="unit-cat"
            onClick={() => handleCategoryChange(cat)}
            style={{
              padding: '8px 16px', borderRadius: '999px', border: '2px solid',
              borderColor: category === cat ? 'var(--accent)' : 'var(--border)',
              background: category === cat ? 'var(--accent)' : 'var(--surface)',
              color: category === cat ? '#fff' : 'var(--text)',
              fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {CATEGORY_ICONS[cat]} {t(CATEGORY_LABEL_KEYS[cat])}
          </button>
        ))}
      </div>

      {/* Converter UI */}
      <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'end' }}>
          {/* From */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              {t('converter.unitConverter.from')}
            </label>
            <select style={selectStyle} value={fromIdx} onChange={e => setFromIdx(Number(e.target.value))}>
              {units.map((u, i) => (
                <option key={i} value={i}>{t(u.label)} ({u.symbol})</option>
              ))}
            </select>
            <input className="unit-input" type="number" value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              style={{
                marginTop: '10px', width: '100%', padding: '12px 16px',
                background: 'var(--surface2)', border: '2px solid var(--border)',
                borderRadius: '14px', color: 'var(--text)', fontSize: '18px',
                fontFamily: 'Nunito, sans-serif', fontWeight: 700, outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Swap button */}
          <div style={{ paddingBottom: '4px' }}>
            <button onClick={swap}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'var(--accent-soft)', border: '2px solid var(--accent-border)',
                color: 'var(--accent)', fontSize: '20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              title={t('converter.unitConverter.swap')}
            >
              ⇌
            </button>
          </div>

          {/* To */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              {t('converter.unitConverter.to')}
            </label>
            <select style={selectStyle} value={toIdx} onChange={e => setToIdx(Number(e.target.value))}>
              {units.map((u, i) => (
                <option key={i} value={i}>{t(u.label)} ({u.symbol})</option>
              ))}
            </select>
            <div style={{
              marginTop: '10px', padding: '12px 16px',
              background: 'var(--accent-soft)', border: '2px solid var(--accent-border)',
              borderRadius: '14px', fontSize: '18px',
              fontFamily: 'Nunito, sans-serif', fontWeight: 800,
              color: 'var(--accent)', minHeight: '52px',
            }}>
              {convertedVal}
            </div>
          </div>
        </div>

        {/* Result summary */}
        {inputVal && !isNaN(parseFloat(inputVal)) && convertedVal !== '—' && (
          <div style={{
            marginTop: '20px', padding: '14px 20px',
            background: 'var(--surface2)', borderRadius: '14px', border: '2px solid var(--border)',
            fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '15px', color: 'var(--text)',
            textAlign: 'center',
          }}>
            {inputVal} {units[fromIdx].symbol} = <span style={{ color: 'var(--accent)' }}>{convertedVal} {units[toIdx].symbol}</span>
          </div>
        )}

        {/* Quick reference table */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
            {t('converter.unitConverter.reference')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
            {units.map((u, i) => {
              const num = parseFloat(inputVal);
              if (isNaN(num)) return null;
              const base = units[fromIdx].toBase(num);
              const val = u.fromBase(base);
              return (
                <div key={i} style={{
                  padding: '10px 14px', background: i === toIdx ? 'var(--accent-soft)' : 'var(--surface)',
                  border: `2px solid ${i === toIdx ? 'var(--accent-border)' : 'var(--border)'}`,
                  borderRadius: '12px', cursor: 'pointer',
                }}
                  onClick={() => setToIdx(i)}
                >
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>{t(u.label)}</div>
                  <div style={{ fontSize: '14px', color: i === toIdx ? 'var(--accent)' : 'var(--text)', fontWeight: 700, fontFamily: 'Nunito, sans-serif', marginTop: '2px' }}>
                    {fmtNum(val)} {u.symbol}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
