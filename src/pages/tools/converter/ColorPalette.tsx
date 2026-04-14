import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const generatePalette = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const { h, s } = rgbToHsl(r, g, b);
  return [10, 30, 50, 70, 90].map(l => {
    const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
    const hsl2rgb = (h2: number, s2: number, l2: number) => {
      h2 /= 360; s2 /= 100; l2 /= 100;
      const q = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
      const p = 2 * l2 - q;
      const f = (t: number) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q-p)*6*t; if (t < 1/2) return q; if (t < 2/3) return p + (q-p)*(2/3-t)*6; return p; };
      return { r: f(h2 + 1/3), g: f(h2), b: f(h2 - 1/3) };
    };
    const c = hsl2rgb(h, s, l);
    return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
  });
};

export const ColorPalette: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.colorPalette.name'));
  const [hex, setHex] = useState('#FF6B2B');
  const [copied, setCopied] = useState('');
  const { r, g, b } = hexToRgb(hex.startsWith('#') && hex.length === 7 ? hex : '#FF6B2B');
  const { h, s, l } = rgbToHsl(r, g, b);
  const palette = generatePalette(hex.startsWith('#') && hex.length === 7 ? hex : '#FF6B2B');

  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(''), 2000); };

  return (
    <ToolLayout toolId="color-palette" category="converter"
      breadcrumbs={[{ label: t('categories.converter'), path: '/category/converter' }, { label: t('tools.colorPalette.name') }]}>
      <ToolHeader toolId="color-palette" category="converter" nameKey="tools.colorPalette.name" descKey="tools.colorPalette.desc" />

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'flex-start' }}>
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '260px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="color" value={hex} onChange={e => setHex(e.target.value)}
              style={{ width: '56px', height: '56px', borderRadius: '12px', border: '2px solid var(--border)', cursor: 'pointer', padding: '4px' }} />
            <input value={hex} onChange={e => setHex(e.target.value)} maxLength={7}
              style={{ flex: 1, background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '16px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text)', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          {[
            { label: 'HEX', value: hex },
            { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
            { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
          ].map(item => (
            <div key={item.label} onClick={() => copy(item.value)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', cursor: 'pointer', transition: 'all 0.2s' }}
              className="color-row">
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', fontFamily: 'Nunito, sans-serif' }}>{item.label}</span>
              <span style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--text)' }}>{item.value}</span>
              <span style={{ fontSize: '12px', color: copied === item.value ? 'var(--green)' : 'var(--muted2)' }}>{copied === item.value ? '✓' : t('common.copy')}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('converter.colorPalette.palette')}</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {palette.map((c, i) => (
              <div key={i} onClick={() => copy(c)}
                style={{ width: '80px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ height: '80px', borderRadius: '14px', background: c, border: '2px solid rgba(0,0,0,0.05)', marginBottom: '6px', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} className="palette-swatch" />
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: copied === c ? 'var(--green)' : 'var(--muted)', fontWeight: 600 }}>{copied === c ? t('common.copied') : c}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .color-row:hover { border-color: var(--accent) !important; }
        .palette-swatch:hover { transform: scale(1.08); }
      `}</style>
    </ToolLayout>
  );
};
