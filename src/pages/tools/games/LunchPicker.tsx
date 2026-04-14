import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ToolLayout, ToolHeader } from '../../../components/layout/ToolLayout';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useGameData } from '../../../store/useGameData';

const DEFAULT_MENUS: Record<string, string[]> = {
  ko: ['김치찌개', '된장찌개', '순대국', '삼겹살', '중국집', '피자', '파스타', '초밥', '마라탕', '샐러드', '돈카츠', '비빔밥'],
  en: ['Sandwich', 'Salad', 'Burger', 'Sushi', 'Pizza', 'Pasta', 'Tacos', 'Stir Fry', 'Soup', 'Ramen', 'Burrito', 'Poke Bowl'],
  ja: ['カレー', 'ラーメン', '定食', '寿司', 'うどん', 'そば', '牛丼', '弁当', 'パスタ', 'ハンバーガー', '丼物', '焼肉'],
  zh: ['麻辣烫', '盖饭', '拌饭', '炒饭', '米线', '饺子', '包子', '炒菜', '面条', '火锅', '煎饼', '沙拉'],
  es: ['Bocadillo', 'Ensalada', 'Tortilla', 'Paella', 'Pizza', 'Pasta', 'Tacos', 'Burrito', 'Menú del día', 'Sopa', 'Empanadas', 'Sándwich'],
};

export const LunchPicker: React.FC = () => {
  const { t, i18n } = useTranslation();
  usePageTitle(t('tools.lunchPicker.name'));
  const { savedMenus, setSavedMenus } = useGameData();

  const lang = i18n.language.split('-')[0];
  const defaultMenus = DEFAULT_MENUS[lang] || DEFAULT_MENUS.en;

  const [menus, setMenus] = useState<string[]>(() => savedMenus || defaultMenus);
  const [newMenu, setNewMenu] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [displayMenu, setDisplayMenu] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // When language changes, if no saved menus, update defaults
  useEffect(() => {
    if (!savedMenus) {
      setMenus(DEFAULT_MENUS[lang] || DEFAULT_MENUS.en);
    }
  }, [lang, savedMenus]);

  const addMenu = () => {
    const v = newMenu.trim();
    if (!v) return;
    setMenus(prev => [...prev, v]);
    setNewMenu('');
  };

  const removeMenu = (i: number) => setMenus(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    setSavedMenus(menus);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const handleReset = () => {
    setMenus(defaultMenus);
    setPicked(null);
    setDisplayMenu(null);
  };

  const pick = () => {
    if (menus.length === 0 || animating) return;
    setAnimating(true);
    setPicked(null);
    let count = 0;
    const total = 20;
    const interval = setInterval(() => {
      setDisplayMenu(menus[Math.floor(Math.random() * menus.length)]);
      count++;
      if (count >= total) {
        clearInterval(interval);
        const result = menus[Math.floor(Math.random() * menus.length)];
        setPicked(result);
        setDisplayMenu(result);
        setAnimating(false);
      }
    }, 80 + count * 5);
  };

  return (
    <ToolLayout toolId="lunch-picker" category="games"
      breadcrumbs={[{ label: t('categories.games'), path: '/category/games' }, { label: t('tools.lunchPicker.name') }]}>
      <ToolHeader toolId="lunch-picker" category="games" nameKey="tools.lunchPicker.name" descKey="tools.lunchPicker.desc" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }} className="lunch-layout">
        {/* Menu list */}
        <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '14px', color: 'var(--text)' }}>
            {t('games.lunchPicker.menuList')} ({menus.length})
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input value={newMenu} onChange={e => setNewMenu(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMenu()}
              placeholder={t('games.lunchPicker.addPlaceholder')}
              style={{ flex: 1, background: 'var(--surface2)', border: '2px solid var(--border)', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: 'var(--text)', outline: 'none', fontFamily: 'Nunito Sans, sans-serif' }} />
            <button onClick={addMenu}
              style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
              +
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {menus.map((menu, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: picked === menu ? 'var(--accent-soft)' : 'var(--surface2)', border: `2px solid ${picked === menu ? 'var(--accent-border)' : 'var(--border)'}`, borderRadius: '999px', padding: '5px 12px 5px 14px', transition: 'all 0.2s' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: picked === menu ? 'var(--accent)' : 'var(--text)' }}>{menu}</span>
                <button onClick={() => removeMenu(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--muted)', padding: '0 2px' }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleReset}
              style={{ flex: 1, background: 'none', border: '2px solid var(--border)', borderRadius: '999px', padding: '6px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
              {t('games.lunchPicker.reset')}
            </button>
            <button onClick={handleSave}
              style={{ flex: 1, background: saveFeedback ? 'var(--green)' : 'var(--accent-soft)', border: `2px solid ${saveFeedback ? 'var(--green-border)' : 'var(--accent-border)'}`, borderRadius: '999px', padding: '6px 16px', fontSize: '12px', fontWeight: 700, color: saveFeedback ? '#fff' : 'var(--accent)', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', transition: 'all 0.2s' }}>
              {saveFeedback ? t('games.lunchPicker.saved') : `💾 ${t('games.lunchPicker.save')}`}
            </button>
          </div>
        </div>

        {/* Result */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: picked ? 'var(--accent)' : 'var(--surface)',
            border: `2px solid ${picked ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            textAlign: 'center',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ fontSize: '48px' }}>🍜</div>
            {displayMenu ? (
              <>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '28px', color: picked ? '#fff' : 'var(--text)', transition: 'all 0.1s' }}>
                  {displayMenu}
                </div>
                {picked && <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>{t('games.lunchPicker.todaysLunch')}</div>}
              </>
            ) : (
              <div style={{ fontSize: '16px', color: 'var(--muted)', fontWeight: 600 }}>{t('games.lunchPicker.pickPrompt')}</div>
            )}
          </div>

          <button onClick={pick} disabled={menus.length === 0 || animating}
            style={{ background: animating ? 'var(--muted2)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '999px', padding: '16px 48px', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '20px', cursor: animating ? 'default' : 'pointer', transition: 'background 0.2s', boxShadow: animating ? 'none' : '0 6px 20px rgba(255,107,43,0.3)' }}>
            🎲 {animating ? t('games.lunchPicker.picking') : t('games.lunchPicker.pick')}
          </button>
          {picked && (
            <button onClick={pick} style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '999px', padding: '10px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text)', cursor: 'pointer' }}>
              🔀 {t('games.lunchPicker.again')}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .lunch-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </ToolLayout>
  );
};
