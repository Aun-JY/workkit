import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

interface EnvVar { key: string; value: string; comment: string; }

export const EnvGenerator: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.envGenerator.name'));
  const [vars, setVars] = useState<EnvVar[]>([
    { key: 'NODE_ENV', value: 'development', comment: 'runtime environment' },
    { key: 'PORT', value: '3000', comment: 'server port' },
    { key: 'DATABASE_URL', value: '', comment: 'database connection string' },
    { key: 'API_KEY', value: '', comment: 'API key' },
  ]);
  const [copied, setCopied] = useState(false);

  const addVar = () => setVars(prev => [...prev, { key: '', value: '', comment: '' }]);
  const removeVar = (i: number) => setVars(prev => prev.filter((_, idx) => idx !== i));
  const updateVar = (i: number, field: keyof EnvVar, val: string) =>
    setVars(prev => prev.map((v, idx) => idx === i ? { ...v, [field]: val } : v));

  const output = vars.map(v => [v.comment ? `# ${v.comment}` : '', `${v.key}=${v.value}`].filter(Boolean).join('\n')).join('\n');

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const inputStyle: React.CSSProperties = {
    background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '8px',
    padding: '7px 10px', fontSize: '13px', color: 'var(--text)', outline: 'none', fontFamily: 'monospace',
  };

  return (
    <ToolLayout toolId="env-generator" category="dev"
      breadcrumbs={[{ label: t('categories.dev'), path: '/category/dev' }, { label: t('tools.envGenerator.name') }]}>
      <ToolHeader toolId="env-generator" category="dev" nameKey="tools.envGenerator.name" descKey="tools.envGenerator.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="env-layout">
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr auto', gap: '6px', padding: '0 0 6px', borderBottom: '2px solid var(--border)' }}>
              {[t('dev.envGenerator.colKey'), t('dev.envGenerator.colValue'), t('dev.envGenerator.colComment'), ''].map(h => (
                <span key={h} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted2)', fontFamily: 'Nunito, sans-serif', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>
            {vars.map((v, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 2fr auto', gap: '6px', alignItems: 'center' }}>
                <input value={v.key} onChange={e => updateVar(i, 'key', e.target.value)} placeholder="KEY_NAME" style={inputStyle} />
                <input value={v.value} onChange={e => updateVar(i, 'value', e.target.value)} placeholder="value" style={inputStyle} />
                <input value={v.comment} onChange={e => updateVar(i, 'comment', e.target.value)} placeholder={t('dev.envGenerator.placeholderComment')} style={{ ...inputStyle, fontFamily: 'Nunito Sans, sans-serif' }} />
                <button onClick={() => removeVar(i)} style={{ background: 'none', border: '2px solid var(--border)', borderRadius: '8px', padding: '6px', cursor: 'pointer', fontSize: '12px', color: 'var(--muted)' }}>✕</button>
              </div>
            ))}
          </div>
          <button onClick={addVar} style={{ background: 'none', border: '2px dashed var(--border)', borderRadius: '10px', padding: '9px', width: '100%', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', cursor: 'pointer' }}>
            + {t('dev.envGenerator.addVar')}
          </button>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)' }}>{t('dev.envGenerator.output')}</span>
            <button onClick={copy} style={{ background: copied ? 'var(--green)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '6px 16px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'background 0.2s' }}>
              {copied ? `✓ ${t('common.copied')}` : `📋 ${t('common.copy')}`}
            </button>
          </div>
          <pre style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '14px', padding: '16px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--text)', minHeight: '300px', overflow: 'auto', margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {output}
          </pre>
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .env-layout { grid-template-columns: 1fr !important; } }`}</style>
    </ToolLayout>
  );
};
