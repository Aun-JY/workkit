import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

export const ReadmeBuilder: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.readmeBuilder.name'));
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [install, setInstall] = useState('npm install');
  const [usage, setUsage] = useState('npm start');
  const [features, setFeatures] = useState('');
  const [license, setLicense] = useState('MIT');
  const [copied, setCopied] = useState(false);

  const output = [
    `# ${name || 'Project Name'}`,
    '',
    desc ? `> ${desc}` : '',
    '',
    features ? `## ✨ Features\n${features.split('\n').map(f => `- ${f.trim()}`).filter(f => f !== '- ').join('\n')}` : '',
    '',
    `## 🚀 Getting Started`,
    '',
    `### Installation`,
    '```bash',
    install,
    '```',
    '',
    `### Usage`,
    '```bash',
    usage,
    '```',
    '',
    `## 📄 License`,
    '',
    `This project is licensed under the **${license}** License.`,
  ].filter(l => l !== undefined).join('\n');

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px',
    padding: '10px 14px', fontSize: '14px', color: 'var(--text)', outline: 'none', marginBottom: '12px',
    fontFamily: 'Nunito Sans, sans-serif',
  };

  return (
    <ToolLayout toolId="readme-builder" category="dev"
      breadcrumbs={[{ label: t('categories.dev'), path: '/category/dev' }, { label: t('tools.readmeBuilder.name') }]}>
      <ToolHeader toolId="readme-builder" category="dev" nameKey="tools.readmeBuilder.name" descKey="tools.readmeBuilder.desc" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="rm-layout">
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder={t('dev.readmeBuilder.placeholderName')} style={inputStyle} />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder={t('dev.readmeBuilder.placeholderDesc')} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
          <textarea value={features} onChange={e => setFeatures(e.target.value)} placeholder={t('dev.readmeBuilder.placeholderFeatures')} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
          <input value={install} onChange={e => setInstall(e.target.value)} placeholder={t('dev.readmeBuilder.placeholderInstall')} style={{ ...inputStyle, fontFamily: 'monospace' }} />
          <input value={usage} onChange={e => setUsage(e.target.value)} placeholder={t('dev.readmeBuilder.placeholderUsage')} style={{ ...inputStyle, fontFamily: 'monospace' }} />
          <select value={license} onChange={e => setLicense(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }}>
            {['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'Unlicensed'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)' }}>{t('dev.readmeBuilder.preview')}</span>
            <button onClick={copy} style={{ background: copied ? 'var(--green)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '6px 16px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'background 0.2s' }}>
              {copied ? `✓ ${t('common.copied')}` : `📋 ${t('common.copy')}`}
            </button>
          </div>
          <pre style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '14px', padding: '16px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--text)', minHeight: '400px', overflow: 'auto', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {output}
          </pre>
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .rm-layout { grid-template-columns: 1fr !important; } }`}</style>
    </ToolLayout>
  );
};
