import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useGameData } from '../../../store/useGameData';

const TEAM_COLORS = ['#FF6B2B', '#2563EB', '#16A34A', '#F59E0B', '#8B5CF6', '#EC4899'];

const DEFAULT_INPUTS: Record<string, string> = {
  ko: '김철수\n이영희\n박민준\n최지은\n정현우\n강수진',
  en: 'Alice\nBob\nCharlie\nDave\nEve\nFrank',
  ja: '田中\n佐藤\n鈴木\n高橋\n伊藤\n渡辺',
  zh: '张伟\n李芳\n王磊\n赵雷\n陈晓\n刘洋',
  es: 'María\nCarlos\nAna\nLuis\nElena\nJuan',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const TeamSplitter: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];
  usePageTitle(t('tools.teamSplitter.name'));

  const { savedTeamInput, setSavedTeamInput } = useGameData();

  const [input, setInput] = useState<string>(() => savedTeamInput || DEFAULT_INPUTS[lang] || DEFAULT_INPUTS.en);
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const split = () => {
    const names = input.split('\n').map(n => n.trim()).filter(Boolean);
    if (names.length < teamCount) return;
    const shuffled = shuffle(names);
    const result: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((name, i) => result[i % teamCount].push(name));
    setTeams(result);
    setCopied(false);
  };

  const copyResult = () => {
    const text = teams.map((team, i) => `${t('games.teamSplitter.team')} ${i + 1}: ${team.join(', ')}`).join('\n');
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleSave = () => {
    setSavedTeamInput(input);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const names = input.split('\n').map(n => n.trim()).filter(Boolean);

  return (
    <ToolLayout toolId="team-splitter" category="games"
      breadcrumbs={[{ label: t('categories.games'), path: '/category/games' }, { label: t('tools.teamSplitter.name') }]}>
      <ToolHeader toolId="team-splitter" category="games" nameKey="tools.teamSplitter.name" descKey="tools.teamSplitter.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="splitter-layout">
        {/* Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '10px' }}>
              {t('games.teamSplitter.participants')} <span style={{ color: 'var(--accent)', fontWeight: 900 }}>{names.length} {t('games.teamSplitter.members')}</span>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('games.teamSplitter.namePlaceholder')}
              style={{ width: '100%', minHeight: '200px', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '12px', fontSize: '14px', color: 'var(--text)', outline: 'none', resize: 'vertical', fontFamily: 'Nunito Sans, sans-serif', lineHeight: 1.7 }}
            />
            <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>{t('games.teamSplitter.hint')}</p>
          </div>

          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '12px' }}>{t('games.teamSplitter.teamCount')}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[2, 3, 4, 5, 6].map(n => (
                <button key={n} onClick={() => setTeamCount(n)}
                  style={{ background: teamCount === n ? 'var(--accent)' : 'var(--surface2)', color: teamCount === n ? '#fff' : 'var(--text)', border: `2px solid ${teamCount === n ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '999px', padding: '7px 18px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                  {n}
                </button>
              ))}
            </div>
            {names.length > 0 && (
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px' }}>
                {Math.floor(names.length / teamCount)}~{Math.ceil(names.length / teamCount)} {t('games.teamSplitter.members')}
              </p>
            )}
            <button onClick={split} disabled={names.length < teamCount}
              style={{ background: names.length < teamCount ? 'var(--muted2)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '13px', width: '100%', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '16px', cursor: names.length < teamCount ? 'default' : 'pointer', transition: 'background 0.2s', marginBottom: '10px' }}>
              👥 {t('games.teamSplitter.split')}
            </button>
            <button onClick={handleSave}
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '2px solid var(--accent-border)', borderRadius: '999px', padding: '10px', width: '100%', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              {saveFeedback ? `✓ ${t('games.teamSplitter.saved')}` : `💾 ${t('games.teamSplitter.save')}`}
            </button>
          </div>
        </div>

        {/* Result */}
        <div>
          {teams.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {teams.map((team, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: `2px solid ${TEAM_COLORS[i % TEAM_COLORS.length]}30`, borderRadius: '20px', padding: '20px', borderLeft: `6px solid ${TEAM_COLORS[i % TEAM_COLORS.length]}` }}>
                  <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '15px', color: TEAM_COLORS[i % TEAM_COLORS.length], marginBottom: '12px' }}>
                    {t('games.teamSplitter.team')} {i + 1} <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>({team.length} {t('games.teamSplitter.members')})</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {team.map((name, j) => (
                      <span key={j} style={{ background: `${TEAM_COLORS[i % TEAM_COLORS.length]}18`, color: TEAM_COLORS[i % TEAM_COLORS.length], border: `1.5px solid ${TEAM_COLORS[i % TEAM_COLORS.length]}40`, borderRadius: '999px', padding: '5px 14px', fontSize: '13px', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={split} style={{ flex: 1, background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '999px', padding: '10px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--text)', cursor: 'pointer' }}>
                  🔀 {t('games.teamSplitter.reshuffle')}
                </button>
                <button onClick={copyResult} style={{ flex: 1, background: copied ? 'var(--green)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'background 0.2s' }}>
                  {copied ? `✓ ${t('games.teamSplitter.copied')}` : `📋 ${t('games.teamSplitter.copy')}`}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--surface2)', border: '2px dashed var(--border)', borderRadius: '20px', padding: '60px 40px', textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '16px' }}>{t('games.teamSplitter.prompt')}</div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .splitter-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
};
