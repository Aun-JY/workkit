import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

export const MeetingFormatter: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.meetingFormatter.name'));
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendees, setAttendees] = useState('');
  const [agenda, setAgenda] = useState('');
  const [notes, setNotes] = useState('');
  const [actions, setActions] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const parts = [
      `# 📝 ${title || t('text.meetingFormatter.defaultTitle')}`,
      `**${t('text.meetingFormatter.dateLabel')}:** ${new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      attendees ? `**${t('text.meetingFormatter.attendeesLabel')}:** ${attendees}` : '',
      '',
      agenda ? `## ${t('text.meetingFormatter.agendaSection')}\n${agenda.split('\n').map((l, i) => `${i + 1}. ${l.trim()}`).join('\n')}` : '',
      '',
      notes ? `## ${t('text.meetingFormatter.notesSection')}\n${notes}` : '',
      '',
      actions ? `## ${t('text.meetingFormatter.actionsSection')}\n${actions.split('\n').map(l => `- [ ] ${l.trim()}`).join('\n')}` : '',
    ].filter(Boolean).join('\n');
    setOutput(parts);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px',
    padding: '10px 14px', fontSize: '14px', color: 'var(--text)', outline: 'none', marginBottom: '12px',
    fontFamily: 'Nunito Sans, sans-serif',
  };

  return (
    <ToolLayout toolId="meeting-formatter" category="text"
      breadcrumbs={[{ label: t('categories.text'), path: '/category/text' }, { label: t('tools.meetingFormatter.name') }]}>
      <ToolHeader toolId="meeting-formatter" category="text" nameKey="tools.meetingFormatter.name" descKey="tools.meetingFormatter.desc" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="mf-layout">
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('text.meetingFormatter.titlePlaceholder')} style={inputStyle} />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
          <input value={attendees} onChange={e => setAttendees(e.target.value)} placeholder={t('text.meetingFormatter.attendeesPlaceholder')} style={inputStyle} />
          <textarea value={agenda} onChange={e => setAgenda(e.target.value)} placeholder={t('text.meetingFormatter.agendaPlaceholder')} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t('text.meetingFormatter.notesPlaceholder')} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} />
          <textarea value={actions} onChange={e => setActions(e.target.value)} placeholder={t('text.meetingFormatter.actionsPlaceholder')} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', marginBottom: 0 }} />
          <button onClick={generate} style={{ marginTop: '14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '11px', width: '100%', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            📝 {t('text.meetingFormatter.generate')}
          </button>
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('text.meetingFormatter.outputLabel')}</label>
          <textarea value={output} readOnly style={{ ...inputStyle, minHeight: '400px', fontFamily: 'monospace', resize: 'vertical', background: 'var(--surface)', marginBottom: '10px' }} />
          {output && (
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ background: copied ? 'var(--green)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
              {copied ? `✓ ${t('common.copied')}` : `📋 ${t('common.copy')}`}
            </button>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .mf-layout { grid-template-columns: 1fr !important; } }`}</style>
    </ToolLayout>
  );
};
