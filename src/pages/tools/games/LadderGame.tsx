import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useGameData } from '../../../store/useGameData';

interface LadderState {
  participants: string[];
  results: string[];
  horizontals: boolean[][][]; // [col][row] = has bridge right
  paths: number[][];           // path per participant: list of y positions
  assigned: number[];          // assigned[i] = result index for participant i
}

const DEFAULT_PARTICIPANTS: Record<string, string[]> = {
  ko: ['김철수', '이영희', '박민준', '최지은'],
  en: ['Alice', 'Bob', 'Charlie', 'Dave'],
  ja: ['田中', '佐藤', '鈴木', '高橋'],
  zh: ['张伟', '李芳', '王磊', '赵雷'],
  es: ['María', 'Carlos', 'Ana', 'Luis'],
};

const DEFAULT_RESULTS: Record<string, string[]> = {
  ko: ['당첨!', '꽝', '발표자', '꽝'],
  en: ['Winner!', 'Loser', 'Presenter', 'Loser'],
  ja: ['当選！', 'はずれ', '発表者', 'はずれ'],
  zh: ['中奖！', '未中', '主持人', '未中'],
  es: ['¡Ganador!', 'Perdedor', 'Presentador', 'Perdedor'],
};

function buildLadder(n: number, rows: number): boolean[][][] {
  // horizontals[col][row] = bridge going right from col to col+1
  const h: boolean[][][] = Array.from({ length: n - 1 }, () => Array.from({ length: rows }, () => [false]));
  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < n - 1) {
      if (Math.random() > 0.5) {
        h[c][r][0] = true;
        c += 2; // skip next column to avoid adjacent bridges
      } else {
        c++;
      }
    }
  }
  return h;
}

function tracePath(startCol: number, horizontals: boolean[][][], rows: number): number[] {
  const path = [startCol];
  let col = startCol;
  for (let r = 0; r < rows; r++) {
    if (col > 0 && horizontals[col - 1]?.[r]?.[0]) {
      col--;
    } else if (col < horizontals.length && horizontals[col]?.[r]?.[0]) {
      col++;
    }
    path.push(col);
  }
  return path;
}

const ROWS = 8;

export const LadderGame: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];
  usePageTitle(t('tools.ladderGame.name'));

  const { savedLadderParticipants, savedLadderResults, setSavedLadderParticipants, setSavedLadderResults } = useGameData();

  const [participants, setParticipants] = useState<string[]>(() => savedLadderParticipants || DEFAULT_PARTICIPANTS[lang] || DEFAULT_PARTICIPANTS.en);
  const [results, setResults] = useState<string[]>(() => savedLadderResults || DEFAULT_RESULTS[lang] || DEFAULT_RESULTS.en);
  const [editP, setEditP] = useState<string[]>(() => savedLadderParticipants || DEFAULT_PARTICIPANTS[lang] || DEFAULT_PARTICIPANTS.en);
  const [editR, setEditR] = useState<string[]>(() => savedLadderResults || DEFAULT_RESULTS[lang] || DEFAULT_RESULTS.en);
  const [count, setCount] = useState(4);
  const [ladder, setLadder] = useState<boolean[][][] | null>(null);
  const [paths, setPaths] = useState<number[][]>([]);
  const [assigned, setAssigned] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [activeCol, setActiveCol] = useState<number | null>(null);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const n = count;
  const CELL_W = Math.min(80, Math.floor(520 / n));
  const CELL_H = 48;
  const PAD_X = 32;
  const PAD_Y = 60;
  const W = PAD_X * 2 + CELL_W * n;
  const H = PAD_Y * 2 + CELL_H * ROWS;

  const drawLadder = useCallback((ldr: boolean[][][], activePaths?: number[][], highlightCol?: number | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // Vertical lines
    for (let c = 0; c < n; c++) {
      const x = PAD_X + c * CELL_W + CELL_W / 2;
      ctx.beginPath();
      ctx.moveTo(x, PAD_Y);
      ctx.lineTo(x, PAD_Y + CELL_H * ROWS);
      ctx.strokeStyle = '#E8D8C0';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Horizontal bridges
    ldr.forEach((col, c) => {
      col.forEach((row, r) => {
        if (row[0]) {
          const x1 = PAD_X + c * CELL_W + CELL_W / 2;
          const x2 = PAD_X + (c + 1) * CELL_W + CELL_W / 2;
          const y = PAD_Y + r * CELL_H + CELL_H / 2;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = '#C4A882';
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });
    });

    // Active paths
    if (activePaths) {
      activePaths.forEach((path, pi) => {
        if (highlightCol !== null && pi !== highlightCol) return;
        ctx.beginPath();
        const startX = PAD_X + path[0] * CELL_W + CELL_W / 2;
        ctx.moveTo(startX, PAD_Y);
        for (let step = 1; step < path.length; step++) {
          const prevCol = path[step - 1];
          const currCol = path[step];
          const y = PAD_Y + (step - 1) * CELL_H + CELL_H / 2;
          if (prevCol !== currCol) {
            const x1 = PAD_X + prevCol * CELL_W + CELL_W / 2;
            const x2 = PAD_X + currCol * CELL_W + CELL_W / 2;
            ctx.lineTo(x1, y);
            ctx.lineTo(x2, y);
          }
          ctx.lineTo(PAD_X + currCol * CELL_W + CELL_W / 2, PAD_Y + step * CELL_H);
        }
        ctx.strokeStyle = highlightCol !== null ? '#FF6B2B' : `hsl(${pi * 50}, 70%, 50%)`;
        ctx.lineWidth = highlightCol !== null ? 5 : 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });
    }

    // Participant labels (top)
    for (let c = 0; c < n; c++) {
      const x = PAD_X + c * CELL_W + CELL_W / 2;
      ctx.fillStyle = '#2D1F0E';
      ctx.font = `bold ${Math.min(13, CELL_W / 5)}px Nunito, sans-serif`;
      ctx.textAlign = 'center';
      const label = participants[c] || `P${c + 1}`;
      ctx.fillText(label.length > 6 ? label.slice(0, 6) : label, x, PAD_Y - 12);
    }

    // Result labels (bottom)
    if (revealed) {
      for (let c = 0; c < n; c++) {
        const x = PAD_X + c * CELL_W + CELL_W / 2;
        ctx.fillStyle = '#FF6B2B';
        ctx.font = `bold ${Math.min(12, CELL_W / 5)}px Nunito, sans-serif`;
        ctx.textAlign = 'center';
        const label = results[c] || `R${c + 1}`;
        ctx.fillText(label.length > 6 ? label.slice(0, 6) : label, x, PAD_Y + CELL_H * ROWS + 20);
      }
    } else {
      for (let c = 0; c < n; c++) {
        const x = PAD_X + c * CELL_W + CELL_W / 2;
        ctx.fillStyle = '#C4A882';
        ctx.font = `bold 13px Nunito, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('?', x, PAD_Y + CELL_H * ROWS + 20);
      }
    }
  }, [n, CELL_W, CELL_H, PAD_X, PAD_Y, W, H, participants, results, revealed]);

  const generateLadder = () => {
    const ldr = buildLadder(n, ROWS);
    const allPaths = Array.from({ length: n }, (_, i) => tracePath(i, ldr, ROWS));
    const asgn = allPaths.map(path => path[path.length - 1]);
    setLadder(ldr);
    setPaths(allPaths);
    setAssigned(asgn);
    setRevealed(false);
    setActiveCol(null);
    drawLadder(ldr);
  };

  useEffect(() => { generateLadder(); }, [count]);

  useEffect(() => {
    if (ladder) drawLadder(ladder, revealed ? paths : undefined, activeCol);
  }, [ladder, revealed, paths, activeCol, drawLadder]);

  const runAll = () => {
    if (!ladder) return;
    setRevealed(true);
    drawLadder(ladder, paths, null);
  };

  const applyEdits = () => {
    const newP = editP.slice(0, count).map((v, i) => v || `P${i + 1}`);
    const newR = editR.slice(0, count).map((v, i) => v || `R${i + 1}`);
    setParticipants(newP);
    setResults(newR);
    generateLadder();
  };

  const handleSave = () => {
    setSavedLadderParticipants(editP.slice(0, count));
    setSavedLadderResults(editR.slice(0, count));
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  return (
    <ToolLayout toolId="ladder-game" category="games"
      breadcrumbs={[{ label: t('categories.games'), path: '/category/games' }, { label: t('tools.ladderGame.name') }]}>
      <ToolHeader toolId="ladder-game" category="games" nameKey="tools.ladderGame.name" descKey="tools.ladderGame.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }} className="ladder-layout">
        {/* Left panel */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('games.ladderGame.count')}</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[2, 3, 4, 5, 6].map(n => (
                <button key={n} onClick={() => { setCount(n); setEditP(prev => Array.from({ length: n }, (_, i) => prev[i] || `P${i + 1}`)); setEditR(prev => Array.from({ length: n }, (_, i) => prev[i] || `R${i + 1}`)); }}
                  style={{ background: count === n ? 'var(--accent)' : 'var(--surface2)', color: count === n ? '#fff' : 'var(--text)', border: `2px solid ${count === n ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '999px', padding: '5px 14px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('games.ladderGame.participants')}</div>
            {Array.from({ length: count }, (_, i) => (
              <input key={i} value={editP[i] || ''} onChange={e => { const next = [...editP]; next[i] = e.target.value; setEditP(next); }}
                placeholder={`${t('games.ladderGame.participantPlaceholder')} ${i + 1}`}
                style={{ display: 'block', width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '10px', padding: '7px 12px', fontSize: '13px', color: 'var(--text)', outline: 'none', marginBottom: '6px', fontFamily: 'Nunito Sans, sans-serif' }} />
            ))}
          </div>

          <div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{t('games.ladderGame.results')}</div>
            {Array.from({ length: count }, (_, i) => (
              <input key={i} value={editR[i] || ''} onChange={e => { const next = [...editR]; next[i] = e.target.value; setEditR(next); }}
                placeholder={`${t('games.ladderGame.resultPlaceholder')} ${i + 1}`}
                style={{ display: 'block', width: '100%', background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '10px', padding: '7px 12px', fontSize: '13px', color: 'var(--text)', outline: 'none', marginBottom: '6px', fontFamily: 'Nunito Sans, sans-serif' }} />
            ))}
          </div>

          <button onClick={applyEdits} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '11px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
            🪜 {t('games.ladderGame.generate')}
          </button>
          <button onClick={runAll} style={{ background: 'var(--surface)', color: 'var(--text)', border: '2px solid var(--border)', borderRadius: '999px', padding: '10px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            🎯 {t('games.ladderGame.revealAll')}
          </button>
          <button onClick={handleSave} style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '2px solid var(--accent-border)', borderRadius: '999px', padding: '10px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            {saveFeedback ? '✓' : `💾 ${t('games.ladderGame.save')}`}
          </button>
        </div>

        {/* Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px', width: '100%', overflowX: 'auto' }}>
            <canvas ref={canvasRef} width={W} height={H} style={{ display: 'block', maxWidth: '100%' }} />
          </div>

          {/* Result table */}
          {revealed && assigned.length > 0 && (
            <div style={{ background: 'var(--surface)', border: '2px solid var(--accent-border)', borderRadius: '20px', padding: '20px', width: '100%' }}>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '15px', color: 'var(--text)', marginBottom: '14px' }}>🎯 {t('games.ladderGame.result')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {participants.slice(0, count).map((p, i) => (
                  <div key={i} style={{ background: 'var(--accent-soft)', border: '2px solid var(--accent-border)', borderRadius: '12px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={() => { setActiveCol(i); if (ladder) drawLadder(ladder, paths, i); }}
                    onMouseLeave={() => { setActiveCol(null); if (ladder) drawLadder(ladder, paths, null); }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>{p}</span>
                    <span style={{ fontWeight: 900, fontSize: '14px', color: 'var(--accent)' }}>{results[assigned[i]] || '?'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .ladder-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
};
