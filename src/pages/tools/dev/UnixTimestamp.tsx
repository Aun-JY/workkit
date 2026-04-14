import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

export const UnixTimestamp: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.unixTimestamp.name'));
  const [nowTs, setNowTs] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState('');
  const [dtInput, setDtInput] = useState(new Date().toISOString().slice(0, 16));
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const id = setInterval(() => setNowTs(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const tsToDate = (ts: string) => {
    const n = Number(ts);
    if (!n) return '—';
    const d = new Date(n * 1000);
    return d.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const dateToTs = (dt: string) => {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? '—' : String(Math.floor(d.getTime() / 1000));
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(''), 2000); };

  return (
    <ToolLayout toolId="unix-timestamp" category="dev"
      breadcrumbs={[{ label: t('categories.dev'), path: '/category/dev' }, { label: t('tools.unixTimestamp.name') }]}>
      <ToolHeader toolId="unix-timestamp" category="dev" nameKey="tools.unixTimestamp.name" descKey="tools.unixTimestamp.desc" />

      {/* Current timestamp */}
      <div style={{ background: 'var(--accent)', borderRadius: '20px', padding: '28px', textAlign: 'center', marginBottom: '24px', cursor: 'pointer' }} onClick={() => copy(String(nowTs))}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: '8px' }}>{t('dev.unixTimestamp.currentLabel')}</div>
        <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '40px', color: '#fff', letterSpacing: '0.05em' }}>
          {copied === String(nowTs) ? `✓ ${t('common.copied')}` : nowTs}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="ts-layout">
        {/* Timestamp → Date */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>{t('dev.unixTimestamp.tsToDate')}</div>
          <input value={tsInput} onChange={e => setTsInput(e.target.value)} placeholder="1700000000"
            style={{ width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', fontFamily: 'monospace', color: 'var(--text)', outline: 'none', marginBottom: '12px' }} />
          <div onClick={() => copy(tsToDate(tsInput))}
            style={{ background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>
            {tsInput ? tsToDate(tsInput) : '—'}
          </div>
          {tsInput && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>{t('dev.unixTimestamp.clickToCopy')}</div>}
        </div>

        {/* Date → Timestamp */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>{t('dev.unixTimestamp.dateToTs')}</div>
          <input type="datetime-local" value={dtInput} onChange={e => setDtInput(e.target.value)}
            style={{ width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', color: 'var(--text)', outline: 'none', marginBottom: '12px' }} />
          <div onClick={() => copy(dateToTs(dtInput))}
            style={{ background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '12px 14px', fontSize: '18px', fontFamily: 'monospace', color: copied === dateToTs(dtInput) ? 'var(--green)' : 'var(--accent)', cursor: 'pointer', fontWeight: 700 }}>
            {copied === dateToTs(dtInput) ? `✓ ${t('common.copied')}` : dateToTs(dtInput)}
          </div>
          {dtInput && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>{t('dev.unixTimestamp.clickToCopy')}</div>}
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .ts-layout { grid-template-columns: 1fr !important; } }`}</style>
    </ToolLayout>
  );
};
