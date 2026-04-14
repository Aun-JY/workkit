import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

const SNS_LIMITS = [
  { label: 'Twitter / X', limit: 280 },
  { label: 'Instagram', limit: 2200 },
  { label: 'LinkedIn', limit: 3000 },
];

function getGaugeColor(ratio: number): string {
  if (ratio >= 0.9) return '#EF4444';
  if (ratio >= 0.7) return '#F59E0B';
  return 'var(--green, #22C55E)';
}

export const WordCounter: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.wordCounter.name'));

  const [text, setText] = useState('');

  const chars = text.length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const lines = text === '' ? 0 : text.split('\n').length;

  const handleClear = () => setText('');

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
    } catch {
      // clipboard access denied — silently ignore
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard write denied — silently ignore
    }
  };

  const statBoxStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '2px solid var(--border)',
    borderRadius: '14px',
    padding: '16px 12px',
    textAlign: 'center',
    flex: '1 1 0',
    minWidth: 0,
  };

  return (
    <ToolLayout
      toolId="word-counter"
      category="text"
      breadcrumbs={[
        { label: t('categories.text'), path: '/category/text' },
        { label: t('tools.wordCounter.name') },
      ]}
    >
      <ToolHeader
        toolId="word-counter"
        category="text"
        nameKey="tools.wordCounter.name"
        descKey="tools.wordCounter.desc"
      />

      {/* Stats boxes */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label: t('text.wordCounter.chars'), value: chars },
          { label: t('text.wordCounter.words'), value: words },
          { label: t('text.wordCounter.sentences'), value: sentences },
          { label: t('text.wordCounter.lines'), value: lines },
        ].map(stat => (
          <div key={stat.label} style={statBoxStyle}>
            <div
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: '28px',
                color: 'var(--accent)',
                lineHeight: 1.1,
              }}
            >
              {stat.value.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--muted)',
                marginTop: '4px',
                fontFamily: 'Nunito Sans, sans-serif',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={t('text.wordCounter.placeholder')}
        style={{
          width: '100%',
          minHeight: '240px',
          padding: '16px',
          border: '2px solid var(--border)',
          borderRadius: '14px',
          background: 'var(--surface)',
          color: 'var(--text)',
          fontFamily: 'Nunito Sans, sans-serif',
          fontSize: '15px',
          lineHeight: 1.7,
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        className="wc-textarea"
      />

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
        <button onClick={handleClear} className="wc-btn wc-btn-ghost">
          {t('common.clear')}
        </button>
        <button onClick={handlePaste} className="wc-btn wc-btn-ghost">
          {t('common.paste')}
        </button>
        <button onClick={handleCopy} className="wc-btn wc-btn-accent">
          {t('common.copy')}
        </button>
      </div>

      {/* SNS Gauges */}
      <div
        style={{
          marginTop: '28px',
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: '20px',
          padding: '20px 24px',
        }}
      >
        <div
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            color: 'var(--muted)',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('text.wordCounter.snsGuide')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {SNS_LIMITS.map(({ label, limit }) => {
            const ratio = Math.min(chars / limit, 1);
            const over = chars > limit;
            return (
              <div key={label}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Nunito Sans, sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text)',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: over ? '#EF4444' : 'var(--muted)',
                    }}
                  >
                    {chars.toLocaleString()} / {limit.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    background: 'var(--border)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${ratio * 100}%`,
                      background: getGaugeColor(chars / limit),
                      borderRadius: '999px',
                      transition: 'width 0.2s, background 0.2s',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .wc-textarea:focus {
          border-color: var(--accent) !important;
        }
        .wc-btn {
          padding: 9px 22px;
          border-radius: 999px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: opacity 0.15s, background 0.15s;
        }
        .wc-btn:hover { opacity: 0.85; }
        .wc-btn-ghost {
          background: var(--surface2, var(--surface));
          color: var(--text);
          border-color: var(--border);
        }
        .wc-btn-accent {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        @media (max-width: 480px) {
          .wc-stat-row { flex-direction: column !important; }
        }
      `}</style>
    </ToolLayout>
  );
};
