import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

interface DayEntry {
  id: number;
  label: string;
  start: string;
  end: string;
  breakMin: number;
}

const calcHours = (start: string, end: string, breakMin: number) => {
  if (!start || !end) return { total: 0, regular: 0, overtime: 0 };
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const totalMin = eh * 60 + em - (sh * 60 + sm) - breakMin;
  if (totalMin <= 0) return { total: 0, regular: 0, overtime: 0 };
  const total = totalMin / 60;
  const regular = Math.min(total, 8);
  const overtime = Math.max(0, total - 8);
  return { total, regular, overtime };
};

const fmtRaw = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return { hh, mm };
};

export const WorkHoursCalculator: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.workHours.name'));

  const dayNames = t('datetime.workHours.days', { returnObjects: true }) as string[];
  const fmt = (h: number) => {
    const { hh, mm } = fmtRaw(h);
    return mm > 0
      ? t('datetime.workHours.hoursMinutes', { hh, mm })
      : t('datetime.workHours.hoursOnly', { hh });
  };

  const [days, setDays] = useState<DayEntry[]>([
    { id: 1, label: dayNames[0] ?? t('datetime.workHours.day1'), start: '09:00', end: '18:00', breakMin: 60 },
  ]);

  const addDay = () => {
    setDays(prev => [
      ...prev,
      { id: Date.now(), label: dayNames[prev.length % 7] ?? `${prev.length + 1}`, start: '09:00', end: '18:00', breakMin: 60 },
    ]);
  };

  const removeDay = (id: number) => setDays(prev => prev.filter(d => d.id !== id));
  const updateDay = (id: number, key: keyof DayEntry, value: string | number) =>
    setDays(prev => prev.map(d => d.id === id ? { ...d, [key]: value } : d));

  const totals = days.reduce(
    (acc, d) => {
      const r = calcHours(d.start, d.end, d.breakMin);
      return { total: acc.total + r.total, regular: acc.regular + r.regular, overtime: acc.overtime + r.overtime };
    },
    { total: 0, regular: 0, overtime: 0 }
  );

  const statCards = [
    { label: t('datetime.workHours.totalHours'), value: fmt(totals.total), color: 'var(--accent)' },
    { label: t('datetime.workHours.regularHours'), value: fmt(totals.regular), color: 'var(--green)' },
    { label: t('datetime.workHours.overtime'), value: fmt(totals.overtime), color: totals.overtime > 0 ? '#EF4444' : 'var(--muted)' },
  ];

  return (
    <ToolLayout
      toolId="work-hours"
      category="datetime"
      breadcrumbs={[
        { label: t('categories.datetime'), path: '/category/datetime' },
        { label: t('tools.workHours.name') },
      ]}
    >
      <ToolHeader toolId="work-hours" category="datetime" nameKey="tools.workHours.name" descKey="tools.workHours.desc" />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {statCards.map(c => (
          <div key={c.label} style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: c.color, marginBottom: '4px' }}>{c.value || t('datetime.workHours.zeroHours')}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Day rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {days.map(day => {
          const r = calcHours(day.start, day.end, day.breakMin);
          return (
            <div key={day.id} style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                value={day.label}
                onChange={e => updateDay(day.id, 'label', e.target.value)}
                style={{ background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '10px', padding: '7px 12px', fontSize: '13px', fontWeight: 700, fontFamily: 'Nunito, sans-serif', color: 'var(--text)', width: '80px', outline: 'none' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{t('datetime.workHours.start')}</span>
                <input type="time" value={day.start} onChange={e => updateDay(day.id, 'start', e.target.value)}
                  style={{ background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '10px', padding: '7px 10px', fontSize: '13px', color: 'var(--text)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{t('datetime.workHours.end')}</span>
                <input type="time" value={day.end} onChange={e => updateDay(day.id, 'end', e.target.value)}
                  style={{ background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '10px', padding: '7px 10px', fontSize: '13px', color: 'var(--text)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{t('datetime.workHours.break')}</span>
                <select value={day.breakMin} onChange={e => updateDay(day.id, 'breakMin', Number(e.target.value))}
                  style={{ background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '10px', padding: '7px 10px', fontSize: '13px', color: 'var(--text)', outline: 'none' }}>
                  {[0, 30, 45, 60, 90, 120].map(m => <option key={m} value={m}>{t('datetime.workHours.breakMin', { m })}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>
                {r.total > 0 ? `${fmt(r.total)} (${t('datetime.workHours.overtimeLabel')} ${fmt(r.overtime)})` : '-'}
              </div>
              {days.length > 1 && (
                <button onClick={() => removeDay(day.id)}
                  style={{ background: 'none', border: '2px solid var(--border)', borderRadius: '999px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', color: 'var(--muted)' }}>
                  {t('datetime.workHours.deleteDay')}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={addDay}
        style={{ background: 'var(--surface)', border: '2px dashed var(--border)', borderRadius: '14px', padding: '12px', width: '100%', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--muted)', transition: 'all 0.2s ease' }}>
        + {t('datetime.workHours.addDay')}
      </button>
    </ToolLayout>
  );
};
