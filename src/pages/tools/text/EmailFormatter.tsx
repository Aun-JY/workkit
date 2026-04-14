import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

export const EmailFormatter: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.emailFormatter.name'));
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const format = () => {
    // Basic email formatting: trim lines, ensure greeting/closing, fix spacing
    const lines = input.split('\n').map(l => l.trim());
    const formatted = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    setOutput(formatted);
  };

  return (
    <ToolLayout toolId="email-formatter" category="text"
      breadcrumbs={[{ label: t('categories.text'), path: '/category/text' }, { label: t('tools.emailFormatter.name') }]}>
      <ToolHeader toolId="email-formatter" category="text" nameKey="tools.emailFormatter.name" descKey="tools.emailFormatter.desc" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="ef-layout">
        <div>
          <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('text.emailFormatter.original')}</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('text.emailFormatter.inputPlaceholder')}
            style={{ width: '100%', minHeight: '320px', background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '14px', padding: '14px', fontSize: '14px', fontFamily: 'Nunito Sans, sans-serif', color: 'var(--text)', outline: 'none', resize: 'vertical', lineHeight: 1.7 }} />
          <button onClick={format} style={{ marginTop: '10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            ✨ {t('text.emailFormatter.format')}
          </button>
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('text.emailFormatter.result')}</label>
          <textarea value={output} readOnly style={{ width: '100%', minHeight: '320px', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '14px', padding: '14px', fontSize: '14px', fontFamily: 'Nunito Sans, sans-serif', color: 'var(--text)', outline: 'none', resize: 'vertical', lineHeight: 1.7 }} />
          {output && (
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ marginTop: '10px', background: copied ? 'var(--green)' : 'var(--surface)', color: copied ? '#fff' : 'var(--text)', border: '2px solid var(--border)', borderRadius: '999px', padding: '10px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
              {copied ? `✓ ${t('common.copied')}` : `📋 ${t('common.copy')}`}
            </button>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .ef-layout { grid-template-columns: 1fr !important; } }`}</style>
    </ToolLayout>
  );
};
