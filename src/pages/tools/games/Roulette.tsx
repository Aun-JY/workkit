import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useGameData } from '../../../store/useGameData';

const COLORS = ['#FF6B2B', '#FF8F5A', '#FFB088', '#16A34A', '#2563EB', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#06B6D4'];

const DEFAULT_NAMES: Record<string, string[]> = {
  ko: ['김철수', '이영희', '박민준', '최지은', '정현우'],
  en: ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'],
  ja: ['田中', '佐藤', '鈴木', '高橋', '伊藤'],
  zh: ['张伟', '李芳', '王磊', '赵雷', '陈晓'],
  es: ['María', 'Carlos', 'Ana', 'Luis', 'Elena'],
};

function drawRoulette(canvas: HTMLCanvasElement, items: string[], angle: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx || items.length === 0) return;
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  const arc = (2 * Math.PI) / items.length;

  ctx.clearRect(0, 0, size, size);

  items.forEach((item, i) => {
    const start = angle + arc * i - Math.PI / 2;
    const end = start + arc;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.min(16, Math.max(10, 120 / items.length))}px Nunito, sans-serif`;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    const maxLen = 8;
    const label = item.length > maxLen ? item.slice(0, maxLen) + '…' : item;
    ctx.fillText(label, r - 12, 5);
    ctx.restore();
  });

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Pointer (top)
  ctx.beginPath();
  ctx.moveTo(cx - 14, 4);
  ctx.lineTo(cx + 14, 4);
  ctx.lineTo(cx, 32);
  ctx.closePath();
  ctx.fillStyle = '#FF6B2B';
  ctx.fill();
}

export const Roulette: React.FC = () => {
  const { t, i18n } = useTranslation();
  usePageTitle(t('tools.roulette.name'));
  const { savedRouletteItems, setSavedRouletteItems } = useGameData();

  const lang = i18n.language.split('-')[0];
  const defaultNames = DEFAULT_NAMES[lang] || DEFAULT_NAMES.en;

  const [items, setItems] = useState<string[]>(() => savedRouletteItems || DEFAULT_NAMES[i18n.language.split('-')[0]] || DEFAULT_NAMES.en);
  const [newItem, setNewItem] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);

  const redraw = useCallback(() => {
    if (canvasRef.current) drawRoulette(canvasRef.current, items, angleRef.current);
  }, [items]);

  useEffect(() => { redraw(); }, [redraw]);

  const spin = () => {
    if (spinning || items.length < 2) return;
    setSpinning(true);
    setWinner(null);
    const totalRotation = (Math.random() * 4 + 5) * Math.PI * 2;
    const duration = 3500 + Math.random() * 1500;
    const startAngle = angleRef.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      angleRef.current = startAngle + totalRotation * ease;
      redraw();

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        const arc = (2 * Math.PI) / items.length;
        const normalised = (((-angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
        const idx = Math.floor(normalised / arc) % items.length;
        setWinner(items[idx]);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const addItem = () => {
    const val = newItem.trim();
    if (!val || items.length >= 12) return;
    setItems(prev => [...prev, val]);
    setNewItem('');
    setWinner(null);
  };

  const removeItem = (i: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== i));
    setWinner(null);
  };

  const handleSave = () => {
    setSavedRouletteItems(items);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const handleReset = () => {
    setItems(defaultNames);
    setWinner(null);
  };

  return (
    <ToolLayout toolId="roulette" category="games"
      breadcrumbs={[{ label: t('categories.games'), path: '/category/games' }, { label: t('tools.roulette.name') }]}>
      <ToolHeader toolId="roulette" category="games" nameKey="tools.roulette.name" descKey="tools.roulette.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }} className="roulette-layout">
        {/* Left panel */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '14px', color: 'var(--text)' }}>
            {t('games.roulette.participants')} ({items.length}/12)
          </div>

          {/* Add item */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder={t('games.roulette.namePlaceholder')}
              maxLength={12}
              style={{ flex: 1, background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: 'var(--text)', outline: 'none', fontFamily: 'Nunito Sans, sans-serif' }}
            />
            <button onClick={addItem} disabled={items.length >= 12}
              style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', opacity: items.length >= 12 ? 0.5 : 1 }}>
              +
            </button>
          </div>

          {/* Item list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: 'var(--surface2)', borderRadius: '10px', border: '2px solid var(--border)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{item}</span>
                <button onClick={() => removeItem(i)} disabled={items.length <= 2}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--muted)', padding: '0 4px', opacity: items.length <= 2 ? 0.3 : 1 }}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleReset}
              style={{ flex: 1, background: 'none', border: '2px solid var(--border)', borderRadius: '999px', padding: '8px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>
              {t('games.roulette.reset')}
            </button>
            <button onClick={handleSave}
              style={{ flex: 1, background: saveFeedback ? 'var(--green)' : 'var(--accent-soft)', border: `2px solid ${saveFeedback ? 'var(--green-border)' : 'var(--accent-border)'}`, borderRadius: '999px', padding: '8px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '12px', color: saveFeedback ? '#fff' : 'var(--accent)', cursor: 'pointer', transition: 'all 0.2s' }}>
              {saveFeedback ? t('games.roulette.saved') : `💾 ${t('games.roulette.save')}`}
            </button>
          </div>
        </div>

        {/* Right — roulette */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              style={{ maxWidth: '100%', cursor: spinning ? 'default' : 'pointer', borderRadius: '50%', boxShadow: '0 8px 32px rgba(255,107,43,0.15)' }}
              onClick={spin}
            />
          </div>

          <button onClick={spin} disabled={spinning || items.length < 2}
            style={{ background: spinning ? 'var(--muted2)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '14px 40px', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '18px', cursor: spinning ? 'default' : 'pointer', transition: 'background 0.2s', boxShadow: spinning ? 'none' : '0 6px 20px rgba(255,107,43,0.3)' }}>
            {spinning ? `🌀 ${t('games.roulette.spinning')}` : `🎡 ${t('games.roulette.spin')}`}
          </button>

          {winner && (
            <div style={{ background: 'var(--accent)', color: '#fff', borderRadius: '20px', padding: '20px 40px', textAlign: 'center', boxShadow: '0 8px 24px rgba(255,107,43,0.3)', animation: 'popIn 0.4s cubic-bezier(0.17,0.67,0.12,0.99)' }}>
              <div style={{ fontSize: '32px', marginBottom: '4px' }}>🎉</div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '28px' }}>{winner}</div>
              <div style={{ fontSize: '14px', opacity: 0.85, marginTop: '4px' }}>{t('games.roulette.winner')}</div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 640px) { .roulette-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
};
