import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghjkmnpqrstuvwxyz';
const NUMS  = '23456789';
const SYMS  = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const UPPER_ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER_ALL = 'abcdefghijklmnopqrstuvwxyz';
const NUMS_ALL  = '0123456789';

const getStrength = (pw: string): { label: string; color: string; pct: number } => {
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: 'weak', color: '#EF4444', pct: 25 };
  if (score <= 3) return { label: 'fair', color: '#F59E0B', pct: 50 };
  if (score <= 4) return { label: 'strong', color: 'var(--green)', pct: 75 };
  return { label: 'veryStrong', color: 'var(--green)', pct: 100 };
};

const generatePw = (len: number, useUpper: boolean, useLower: boolean, useNums: boolean, useSyms: boolean, noAmbig: boolean): string => {
  let chars = '';
  if (useUpper) chars += noAmbig ? UPPER : UPPER_ALL;
  if (useLower) chars += noAmbig ? LOWER : LOWER_ALL;
  if (useNums)  chars += noAmbig ? NUMS : NUMS_ALL;
  if (useSyms)  chars += SYMS;
  if (!chars) chars = LOWER_ALL;

  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => chars[v % chars.length]).join('');
};

export const PasswordGenerator: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.passwordGen.name'));

  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNums,  setUseNums]  = useState(true);
  const [useSyms,  setUseSyms]  = useState(false);
  const [noAmbig,  setNoAmbig]  = useState(true);
  const [password, setPassword] = useState(() => generatePw(16, true, true, true, false, true));
  const [history,  setHistory]  = useState<string[]>([]);
  const [copied,   setCopied]   = useState(false);
  const [bulk,     setBulk]     = useState<string[]>([]);

  const generate = useCallback(() => {
    const pw = generatePw(length, useUpper, useLower, useNums, useSyms, noAmbig);
    setPassword(pw);
    setHistory(h => [pw, ...h].slice(0, 10));
    setCopied(false);
  }, [length, useUpper, useLower, useNums, useSyms, noAmbig]);

  const generateBulk = () => {
    const list = Array.from({ length: 5 }, () => generatePw(length, useUpper, useLower, useNums, useSyms, noAmbig));
    setBulk(list);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const strength = getStrength(password);

  const CheckBox: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }} />
      {label}
    </label>
  );

  return (
    <ToolLayout toolId="password-gen" category="converter"
      breadcrumbs={[{ label: t('categories.converter'), path: '/category/converter' }, { label: t('tools.passwordGen.name') }]}>
      <ToolHeader toolId="password-gen" category="converter" nameKey="tools.passwordGen.name" descKey="tools.passwordGen.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }} className="pw-layout">
        {/* Settings */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px' }}>{t('converter.passwordGen.length')}</span>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '18px', color: 'var(--accent)' }}>{length}</span>
            </div>
            <input type="range" min={8} max={64} value={length} onChange={e => setLength(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)' }}>
              <span>8</span><span>64</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <CheckBox label={t('converter.passwordGen.uppercase')} checked={useUpper} onChange={setUseUpper} />
            <CheckBox label={t('converter.passwordGen.lowercase')} checked={useLower} onChange={setUseLower} />
            <CheckBox label={t('converter.passwordGen.numbers')}   checked={useNums}  onChange={setUseNums} />
            <CheckBox label={t('converter.passwordGen.symbols')} checked={useSyms} onChange={setUseSyms} />
            <CheckBox label={t('converter.passwordGen.noAmbig')} checked={noAmbig} onChange={setNoAmbig} />
          </div>

          <button onClick={generate}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '12px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '15px', cursor: 'pointer', transition: 'opacity 0.2s' }}>
            🔑 {t('converter.passwordGen.generate')}
          </button>
          <button onClick={generateBulk}
            style={{ background: 'var(--surface2)', color: 'var(--text)', border: '2px solid var(--border)', borderRadius: '999px', padding: '10px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            {t('converter.passwordGen.generateBulk')}
          </button>
        </div>

        {/* Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Password display */}
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 700, color: 'var(--text)', wordBreak: 'break-all', letterSpacing: '0.05em', marginBottom: '16px', padding: '16px', background: 'var(--surface2)', borderRadius: '12px', border: '2px solid var(--border)' }}>
              {password}
            </div>
            {/* Strength */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{t('converter.passwordGen.strength')}</span>
                <span style={{ fontWeight: 700, color: strength.color }}>{t(`converter.passwordGen.strengthLabel.${strength.label}`)}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--surface2)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, borderRadius: '999px', transition: 'all 0.3s ease' }} />
              </div>
            </div>
            <button onClick={() => copyText(password)}
              style={{ background: copied ? 'var(--green)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}>
              {copied ? `✓ ${t('common.copied')}` : `📋 ${t('common.copy')}`}
            </button>
          </div>

          {/* Bulk */}
          {bulk.length > 0 && (
            <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>{t('converter.passwordGen.bulkResult')}</div>
              {bulk.map((pw, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < bulk.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '14px', flex: 1, color: 'var(--text)' }}>{pw}</span>
                  <button onClick={() => navigator.clipboard.writeText(pw)}
                    style={{ background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>
                    {t('common.copy')}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* History */}
          {history.length > 1 && (
            <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('converter.passwordGen.history')}</div>
              {history.slice(1).map((pw, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: i < history.length - 2 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '13px', flex: 1, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pw}</span>
                  <button onClick={() => navigator.clipboard.writeText(pw)}
                    style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '3px 8px', cursor: 'pointer', fontSize: '10px', color: 'var(--muted)' }}>
                    {t('common.copy')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .pw-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
};
