import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

const TEMPLATES = [
  {
    label: 'React + TypeScript',
    rules: `You are an expert in React 18, TypeScript, and Tailwind CSS.

Code Style:
- Use functional components with React.FC type
- Prefer const arrow functions
- Use TypeScript strict mode
- Use descriptive variable names
- Write concise, self-documenting code

React Best Practices:
- Use hooks for state management
- Minimize useEffect usage
- Use React.memo for performance-critical components
- Prefer composition over inheritance`,
  },
  {
    label: 'Next.js',
    rules: `You are an expert in Next.js 14+, React, and TypeScript.

Architecture:
- Use App Router (app/ directory)
- Prefer Server Components by default
- Add 'use client' only when necessary
- Use server actions for form handling

Performance:
- Optimize images with next/image
- Use dynamic imports for code splitting
- Implement proper caching strategies`,
  },
  {
    label: 'Python',
    rules: `You are an expert Python developer.

Code Style:
- Follow PEP 8 guidelines
- Use type hints for all functions
- Write docstrings for public functions
- Prefer dataclasses over plain dicts

Best Practices:
- Use virtual environments
- Write comprehensive tests with pytest
- Handle exceptions explicitly
- Use context managers for resources`,
  },
];

export const CursorRules: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.cursorRules.name'));
  const [selected, setSelected] = useState(0);
  const [custom, setCustom] = useState('');
  const [copied, setCopied] = useState(false);

  const output = custom || TEMPLATES[selected].rules;
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <ToolLayout toolId="cursor-rules" category="dev"
      breadcrumbs={[{ label: t('categories.dev'), path: '/category/dev' }, { label: t('tools.cursorRules.name') }]}>
      <ToolHeader toolId="cursor-rules" category="dev" nameKey="tools.cursorRules.name" descKey="tools.cursorRules.desc" />

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '10px' }}>{t('dev.cursorRules.selectTemplate')}</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {TEMPLATES.map((tmpl, i) => (
            <button key={i} onClick={() => { setSelected(i); setCustom(''); }}
              style={{ background: selected === i && !custom ? 'var(--accent)' : 'var(--surface)', color: selected === i && !custom ? '#fff' : 'var(--text)', border: `2px solid ${selected === i && !custom ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '999px', padding: '7px 18px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="cr-layout">
        <div>
          <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('dev.cursorRules.customLabel')}</label>
          <textarea value={custom} onChange={e => setCustom(e.target.value)} placeholder={t('dev.cursorRules.customPlaceholder')}
            style={{ width: '100%', minHeight: '380px', background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '14px', padding: '14px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--text)', outline: 'none', resize: 'vertical', lineHeight: 1.7 }} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)' }}>{t('dev.cursorRules.output')}</label>
            <button onClick={copy} style={{ background: copied ? 'var(--green)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '6px 16px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'background 0.2s' }}>
              {copied ? `✓ ${t('common.copied')}` : `📋 ${t('common.copy')}`}
            </button>
          </div>
          <pre style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '14px', padding: '14px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--text)', minHeight: '380px', overflow: 'auto', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {output}
          </pre>
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .cr-layout { grid-template-columns: 1fr !important; } }`}</style>
    </ToolLayout>
  );
};
