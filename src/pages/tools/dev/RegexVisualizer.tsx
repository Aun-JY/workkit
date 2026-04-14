import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

const PRESETS = [
  { labelKey: 'dev.regexVisualizer.presetEmail',    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { labelKey: 'dev.regexVisualizer.presetPhone',    pattern: '0\\d{1,2}-\\d{3,4}-\\d{4}', flags: 'g' },
  { labelKey: 'dev.regexVisualizer.presetUrl',      pattern: 'https?:\\/\\/[^\\s]+', flags: 'g' },
  { labelKey: 'dev.regexVisualizer.presetNumber',   pattern: '\\d+', flags: 'g' },
  { labelKey: 'dev.regexVisualizer.presetKorean',   pattern: '[가-힣]+', flags: 'g' },
];

export const RegexVisualizer: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.regexVisualizer.name'));
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags]     = useState('g');
  const [testStr, setTestStr] = useState('전화번호: 010-1234-5678, 나이: 25세, 금액: 100,000원');
  const [error, setError]     = useState('');

  const { highlighted, matches } = useMemo(() => {
    if (!pattern) return { highlighted: testStr, matches: [] };
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      setError('');
      const found: string[] = [];
      let result = '';
      let last = 0;
      let m;
      const r2 = new RegExp(pattern, 'g' + flags.replace('g', ''));
      while ((m = r2.exec(testStr)) !== null) {
        found.push(m[0]);
        result += escHtml(testStr.slice(last, m.index));
        result += `<mark style="background:#FFF0E8;color:#FF6B2B;border-radius:4px;padding:1px 3px;font-weight:700;">${escHtml(m[0])}</mark>`;
        last = m.index + m[0].length;
        if (!flags.includes('g')) break;
      }
      result += escHtml(testStr.slice(last));
      return { highlighted: result, matches: found };
    } catch (e) {
      setError((e as Error).message);
      return { highlighted: escHtml(testStr), matches: [] };
    }
  }, [pattern, flags, testStr]);

  function escHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return (
    <ToolLayout toolId="regex-visualizer" category="dev"
      breadcrumbs={[{ label: t('categories.dev'), path: '/category/dev' }, { label: t('tools.regexVisualizer.name') }]}>
      <ToolHeader toolId="regex-visualizer" category="dev" nameKey="tools.regexVisualizer.name" descKey="tools.regexVisualizer.desc" />

      <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('dev.regexVisualizer.presets')}</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {PRESETS.map(p => (
            <button key={p.labelKey} onClick={() => { setPattern(p.pattern); setFlags(p.flags); }}
              style={{ background: pattern === p.pattern ? 'var(--accent-soft)' : 'var(--surface2)', color: pattern === p.pattern ? 'var(--accent)' : 'var(--text)', border: `2px solid ${pattern === p.pattern ? 'var(--accent-border)' : 'var(--border)'}`, borderRadius: '999px', padding: '5px 14px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
              {t(p.labelKey)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', color: 'var(--muted)', fontFamily: 'monospace' }}>/</span>
          <input value={pattern} onChange={e => setPattern(e.target.value)}
            style={{ flex: 1, background: error ? '#FEF2F2' : 'var(--surface2)', border: `2px solid ${error ? '#FECACA' : 'var(--border)'}`, borderRadius: '10px', padding: '9px 12px', fontSize: '15px', fontFamily: 'monospace', color: 'var(--text)', outline: 'none' }} />
          <span style={{ fontSize: '20px', color: 'var(--muted)', fontFamily: 'monospace' }}>/</span>
          <input value={flags} onChange={e => setFlags(e.target.value)} maxLength={4}
            style={{ width: '56px', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '10px', padding: '9px 10px', fontSize: '15px', fontFamily: 'monospace', color: 'var(--text)', outline: 'none', textAlign: 'center' }} />
        </div>
        {error && <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '8px', fontFamily: 'monospace' }}>⚠️ {error}</div>}
      </div>

      <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('dev.regexVisualizer.testString')}</div>
        <textarea value={testStr} onChange={e => setTestStr(e.target.value)}
          style={{ width: '100%', minHeight: '80px', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '12px', fontSize: '14px', color: 'var(--text)', outline: 'none', resize: 'vertical', fontFamily: 'Nunito Sans, sans-serif', lineHeight: 1.7 }} />
      </div>

      <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)' }}>{t('dev.regexVisualizer.matchResult')}</span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '13px', color: matches.length > 0 ? 'var(--accent)' : 'var(--muted)' }}>
            {t('dev.regexVisualizer.matchCount', { count: matches.length })}
          </span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: highlighted }}
          style={{ fontSize: '14px', lineHeight: 2, background: 'var(--surface2)', borderRadius: '12px', padding: '12px', fontFamily: 'Nunito Sans, sans-serif', color: 'var(--text)' }} />
      </div>

      {matches.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>{t('dev.regexVisualizer.matchList')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {matches.map((m, i) => (
              <span key={i} style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1.5px solid var(--accent-border)', borderRadius: '8px', padding: '4px 12px', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700 }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
};
