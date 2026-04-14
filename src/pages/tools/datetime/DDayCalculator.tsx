import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';

interface DDayItem {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
}

const STORAGE_KEY = 'workkit-dday-items';

function getDDayLabel(dateStr: string): { label: string; diff: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  const diff = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diff === 0) return { label: 'D-Day!', diff: 0 };
  if (diff > 0) return { label: `D-${diff}`, diff };
  return { label: `D+${Math.abs(diff)}`, diff };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

function loadItems(): DDayItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveItems(items: DDayItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable
  }
}

export const DDayCalculator: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t('tools.dday.name'));

  const [items, setItems] = useState<DDayItem[]>(() => loadItems());
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const today = new Date().toISOString().split('T')[0];

  const handleAdd = () => {
    if (!name.trim()) {
      setError(t('datetime.dday.errorName'));
      return;
    }
    if (!date) {
      setError(t('datetime.dday.errorDate'));
      return;
    }
    const newItem: DDayItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      date,
    };
    setItems(prev => [...prev, newItem]);
    setName('');
    setDate('');
    setError('');
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  // Sort: D-Day today first, then by proximity
  const sorted = [...items].sort((a, b) => {
    const dA = getDDayLabel(a.date).diff;
    const dB = getDDayLabel(b.date).diff;
    return Math.abs(dA) - Math.abs(dB);
  });

  return (
    <ToolLayout
      toolId="dday"
      category="datetime"
      breadcrumbs={[
        { label: t('categories.datetime'), path: '/category/datetime' },
        { label: t('tools.dday.name') },
      ]}
    >
      <ToolHeader
        toolId="dday"
        category="datetime"
        nameKey="tools.dday.name"
        descKey="tools.dday.desc"
      />

      {/* Add form */}
      <div
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '16px',
          }}
        >
          {t('datetime.dday.addNew')}
        </div>
        <div className="dday-form-row">
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder={t('datetime.dday.namePlaceholder')}
            maxLength={40}
            style={{
              flex: 2,
              padding: '12px 16px',
              border: '2px solid var(--border)',
              borderRadius: '14px',
              background: 'var(--bg, var(--surface))',
              color: 'var(--text)',
              fontFamily: 'Nunito Sans, sans-serif',
              fontSize: '14px',
              outline: 'none',
              minWidth: 0,
            }}
            className="dday-input"
          />
          <input
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid var(--border)',
              borderRadius: '14px',
              background: 'var(--bg, var(--surface))',
              color: 'var(--text)',
              fontFamily: 'Nunito Sans, sans-serif',
              fontSize: '14px',
              outline: 'none',
              minWidth: 0,
              colorScheme: 'light dark',
            }}
            className="dday-input"
          />
          <button onClick={handleAdd} className="dday-add-btn">
            {t('datetime.dday.add')}
          </button>
        </div>
        {error && (
          <p
            style={{
              marginTop: '8px',
              color: '#EF4444',
              fontFamily: 'Nunito Sans, sans-serif',
              fontSize: '13px',
            }}
          >
            {error}
          </p>
        )}
      </div>

      {/* D-Day cards */}
      {sorted.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 0',
            color: 'var(--muted)',
            fontFamily: 'Nunito Sans, sans-serif',
            fontSize: '15px',
          }}
        >
          {t('datetime.dday.empty')}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {sorted.map(item => {
            const { label, diff } = getDDayLabel(item.date);
            const isToday = diff === 0;
            const isPast = diff < 0;

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--surface)',
                  border: `2px solid ${isToday ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '20px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                {/* D-Day number */}
                <div
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 900,
                    fontSize: isToday ? '32px' : '28px',
                    color: isToday
                      ? 'var(--accent)'
                      : isPast
                      ? 'var(--muted)'
                      : 'var(--accent)',
                    minWidth: '90px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  {label}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      color: 'var(--text)',
                      marginBottom: '3px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Nunito Sans, sans-serif',
                      fontSize: '13px',
                      color: 'var(--muted)',
                    }}
                  >
                    {formatDate(item.date)}
                    {isPast && (
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '11px',
                          color: 'var(--muted2, var(--muted))',
                        }}
                      >
                        ({t('datetime.dday.pastDate')})
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="dday-delete-btn"
                  aria-label={t('datetime.dday.delete')}
                  title={t('datetime.dday.delete')}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Today info */}
      <div
        style={{
          marginTop: '24px',
          textAlign: 'center',
          fontFamily: 'Nunito Sans, sans-serif',
          fontSize: '13px',
          color: 'var(--muted)',
        }}
      >
        {t('datetime.dday.today')}: {formatDate(today)}
      </div>

      <style>{`
        .dday-form-row {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        @media (max-width: 560px) {
          .dday-form-row { flex-direction: column; }
          .dday-form-row > * { width: 100%; box-sizing: border-box; }
        }
        .dday-input:focus {
          border-color: var(--accent) !important;
        }
        .dday-add-btn {
          padding: 12px 28px;
          border-radius: 999px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 15px;
          background: var(--accent);
          color: #fff;
          border: 2px solid var(--accent);
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .dday-add-btn:hover { opacity: 0.85; }
        .dday-delete-btn {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 2px solid var(--border);
          background: var(--surface2, var(--surface));
          color: var(--muted);
          font-size: 12px;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s, color 0.15s;
        }
        .dday-delete-btn:hover {
          border-color: #EF4444;
          color: #EF4444;
        }
      `}</style>
    </ToolLayout>
  );
};
