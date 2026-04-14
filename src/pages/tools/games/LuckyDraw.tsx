import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

export const LuckyDraw: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.luckyDraw.name'));

  const [input, setInput] = useState('Alice\nBob\nCharlie\nDave\nEve\nFrank\nGrace\nHank');
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const names = input.split('\n').map(n => n.trim()).filter(Boolean);

  const draw = () => {
    if (names.length < winnerCount || animating) return;
    setAnimating(true);
    setWinners([]);
    let count = 0;
    const total = 25;
    const interval = setInterval(() => {
      setDisplayName(names[Math.floor(Math.random() * names.length)]);
      count++;
      if (count >= total) {
        clearInterval(interval);
        const shuffled = [...names].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, winnerCount);
        setWinners(picked);
        setDisplayName(picked[0]);
        setAnimating(false);
      }
    }, 70 + count * 4);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(`🎉 ${t('games.luckyDraw.winnersLabel')}: ${winners.join(', ')}`);
  };

  return (
    <ToolLayout toolId="lucky-draw" category="games"
      breadcrumbs={[{ label: t('categories.games'), path: '/category/games' }, { label: t('tools.luckyDraw.name') }]}>
      <ToolHeader toolId="lucky-draw" category="games" nameKey="tools.luckyDraw.name" descKey="tools.luckyDraw.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="draw-layout">
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '10px' }}>
              {t('games.luckyDraw.participants')} <span style={{ color: 'var(--accent)', fontWeight: 900 }}>{names.length}{t('games.luckyDraw.personUnit')}</span>
            </div>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              style={{ width: '100%', minHeight: '200px', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '12px', padding: '12px', fontSize: '14px', color: 'var(--text)', outline: 'none', resize: 'vertical', fontFamily: 'Nunito Sans, sans-serif', lineHeight: 1.7 }} />
            <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>{t('games.luckyDraw.hint')}</p>
          </div>
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '12px' }}>{t('games.luckyDraw.winnerCount')}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setWinnerCount(n)}
                  style={{ background: winnerCount === n ? 'var(--accent)' : 'var(--surface2)', color: winnerCount === n ? '#fff' : 'var(--text)', border: `2px solid ${winnerCount === n ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '999px', padding: '7px 18px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                  {n}{t('games.luckyDraw.personUnit')}
                </button>
              ))}
            </div>
          </div>
          <button onClick={draw} disabled={names.length < winnerCount || animating}
            style={{ background: animating ? 'var(--muted2)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '16px', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '18px', cursor: animating ? 'default' : 'pointer', transition: 'background 0.2s', boxShadow: animating ? 'none' : '0 6px 20px rgba(255,107,43,0.3)' }}>
            {animating ? `🎲 ${t('games.luckyDraw.drawing')}` : `🎲 ${t('games.luckyDraw.draw')}`}
          </button>
        </div>

        {/* Right - result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: winners.length > 0 ? 'var(--accent)' : 'var(--surface)', border: `2px solid ${winners.length > 0 ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '24px', padding: '32px', textAlign: 'center', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.3s' }}>
            <div style={{ fontSize: '48px' }}>{animating ? '🎲' : winners.length > 0 ? '🎉' : '🎁'}</div>
            {animating && (
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '28px', color: 'var(--text)' }}>{displayName}</div>
            )}
            {!animating && winners.length > 0 && (
              <>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>🎊 {t('games.luckyDraw.announcement')} 🎊</div>
                {winners.map((w, i) => (
                  <div key={i} style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: winners.length === 1 ? '32px' : '22px', color: '#fff' }}>
                    {winners.length > 1 && <span style={{ fontSize: '16px', opacity: 0.8 }}>{i + 1}{t('games.luckyDraw.rankUnit')} · </span>}
                    {w}
                  </div>
                ))}
              </>
            )}
            {!animating && winners.length === 0 && (
              <div style={{ fontSize: '16px', color: 'var(--muted)', fontWeight: 600 }}>{t('games.luckyDraw.prompt')}</div>
            )}
          </div>

          {winners.length > 0 && !animating && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={draw} style={{ flex: 1, background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '999px', padding: '11px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text)', cursor: 'pointer' }}>
                🔄 {t('games.luckyDraw.redraw')}
              </button>
              <button onClick={copyResult} style={{ flex: 1, background: 'var(--green)', color: '#fff', border: 'none', borderRadius: '999px', padding: '11px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                📋 {t('games.luckyDraw.copyResult')}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .draw-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
};
