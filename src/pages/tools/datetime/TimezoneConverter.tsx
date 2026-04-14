import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

const TIMEZONES = [
  { key: 'seoul',        tz: 'Asia/Seoul' },
  { key: 'tokyo',        tz: 'Asia/Tokyo' },
  { key: 'beijing',      tz: 'Asia/Shanghai' },
  { key: 'newYork',      tz: 'America/New_York' },
  { key: 'london',       tz: 'Europe/London' },
  { key: 'paris',        tz: 'Europe/Paris' },
  { key: 'losAngeles',   tz: 'America/Los_Angeles' },
  { key: 'sydney',       tz: 'Australia/Sydney' },
  { key: 'singapore',    tz: 'Asia/Singapore' },
  { key: 'dubai',        tz: 'Asia/Dubai' },
];

const formatTime = (tz: string, date: Date) => {
  try {
    return date.toLocaleString('ko-KR', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
};

const formatCustomTime = (tz: string, baseDate: string) => {
  try {
    const dt = new Date(baseDate);
    return dt.toLocaleString('ko-KR', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
};

export const TimezoneConverter: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.timezone.name'));

  const [mode, setMode] = useState<'live' | 'custom'>('live');
  const [now, setNow] = useState(new Date());
  const [baseDate, setBaseDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [selected, setSelected] = useState<string[]>(['Asia/Seoul', 'America/New_York', 'Europe/London', 'Asia/Tokyo']);

  useEffect(() => {
    if (mode !== 'live') return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [mode]);

  const toggle = (tz: string) => {
    setSelected(prev => prev.includes(tz) ? prev.filter(t => t !== tz) : [...prev, tz]);
  };

  return (
    <ToolLayout toolId="timezone" category="datetime"
      breadcrumbs={[{ label: t('categories.datetime'), path: '/category/datetime' }, { label: t('tools.timezone.name') }]}>
      <ToolHeader toolId="timezone" category="datetime" nameKey="tools.timezone.name" descKey="tools.timezone.desc" />

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['live', 'custom'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              border: '2px solid',
              borderColor: mode === m ? 'var(--accent)' : 'var(--border)',
              background: mode === m ? 'var(--accent)' : 'var(--surface)',
              color: mode === m ? '#fff' : 'var(--text)',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {m === 'live' ? `🔴 ${t('datetime.timezone.live')}` : `🕐 ${t('datetime.timezone.custom')}`}
          </button>
        ))}
      </div>

      {mode === 'custom' && (
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
          <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>{t('datetime.timezone.baseTime')}</label>
          <input type="datetime-local" value={baseDate} onChange={e => setBaseDate(e.target.value)}
            style={{ background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', color: 'var(--text)', outline: 'none', fontFamily: 'Nunito Sans, sans-serif' }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {TIMEZONES.map(tz => {
          const timeStr = mode === 'live' ? formatTime(tz.tz, now) : formatCustomTime(tz.tz, baseDate);
          const isSelected = selected.includes(tz.tz);
          return (
            <div key={tz.tz} onClick={() => toggle(tz.tz)}
              style={{
                background: isSelected ? 'var(--accent-soft)' : 'var(--surface)',
                border: `2px solid ${isSelected ? 'var(--accent-border)' : 'var(--border)'}`,
                borderRadius: '16px',
                padding: '16px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>
                {t(`datetime.timezone.cities.${tz.key}`)}
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: isSelected ? 'var(--accent)' : 'var(--text)' }}>
                {timeStr}
              </div>
              {mode === 'live' && (
                <div style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '4px' }}>
                  {new Date().toLocaleDateString('ko-KR', { timeZone: tz.tz, weekday: 'short' })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: '12px', color: 'var(--muted2)', marginTop: '16px' }}>
        {t('datetime.timezone.hint')}
      </p>
    </ToolLayout>
  );
};
