import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

export const PTOCalculator: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.pto.name'));
  const [joinDate, setJoinDate] = useState('2023-01-01');
  const [usedDays, setUsedDays] = useState(5);
  const [extraDays, setExtraDays] = useState(0);

  const calcPTO = () => {
    const join = new Date(joinDate);
    const now = new Date();
    const monthsWorked = (now.getFullYear() - join.getFullYear()) * 12 + now.getMonth() - join.getMonth();
    const yearsWorked = Math.floor(monthsWorked / 12);

    // Korean labor law: 15 days + 1 day per 2 years (max 25)
    let total = 15;
    if (yearsWorked >= 1) total = Math.min(25, 15 + Math.floor(yearsWorked / 2));
    total += extraDays;
    const remaining = total - usedDays;
    return { total, remaining, monthsWorked, yearsWorked };
  };

  const { total, remaining, monthsWorked, yearsWorked } = calcPTO();

  return (
    <ToolLayout toolId="pto" category="datetime"
      breadcrumbs={[{ label: t('categories.datetime'), path: '/category/datetime' }, { label: t('tools.pto.name') }]}>
      <ToolHeader toolId="pto" category="datetime" nameKey="tools.pto.name" descKey="tools.pto.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="pto-layout">
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('datetime.pto.joinDate')}</label>
            <input type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)}
              style={{ width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('datetime.pto.usedDays')}</label>
            <input type="number" value={usedDays} min={0} onChange={e => setUsedDays(Number(e.target.value))}
              style={{ width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('datetime.pto.extraDays')}</label>
            <input type="number" value={extraDays} min={0} onChange={e => setExtraDays(Number(e.target.value))}
              style={{ width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.6 }}>
            {t('datetime.pto.tenure', { years: yearsWorked, months: monthsWorked % 12 })}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: t('datetime.pto.totalPTO'), value: t('datetime.pto.days', { count: total }), color: 'var(--text)', big: false },
            { label: t('datetime.pto.usedPTO'), value: t('datetime.pto.days', { count: usedDays }), color: '#EF4444', big: false },
            { label: t('datetime.pto.remainingPTO'), value: t('datetime.pto.days', { count: remaining }), color: 'var(--accent)', big: true },
          ].map(c => (
            <div key={c.label} style={{ background: 'var(--surface)', border: `2px solid ${c.big ? 'var(--accent-border)' : 'var(--border)'}`, borderRadius: '16px', padding: c.big ? '24px' : '16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: c.big ? '48px' : '28px', color: c.color }}>{c.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600, marginTop: '4px' }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .pto-layout { grid-template-columns: 1fr !important; } }`}</style>
    </ToolLayout>
  );
};
