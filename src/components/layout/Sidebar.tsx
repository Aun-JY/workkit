import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ALL_TOOLS, CATEGORY_META, ToolCategory } from '../../data/tools';
import { useFavorites } from '../../store/useFavorites';
import { StarButton } from '../ui/StarButton';
import { AdSlot } from '../ui/AdSlot';

interface SidebarProps {
  currentToolId?: string;
}

const CATEGORY_ORDER: ToolCategory[] = ['calculator', 'text', 'datetime', 'games', 'converter', 'dev'];

const BADGE_STYLES: Record<string, React.CSSProperties> = {
  popular: { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1.5px solid var(--accent-border)' },
  niche:   { background: 'var(--green-soft)',  color: 'var(--green)',  border: '1.5px solid var(--green-border)' },
  new:     { background: 'var(--blue-soft)',   color: 'var(--blue)',   border: '1.5px solid var(--blue-border)' },
};

export const Sidebar: React.FC<SidebarProps> = ({ currentToolId }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { favorites } = useFavorites();
  const isFavorite = (id: string) => favorites.includes(id);

  const favTools = favorites
    .map(id => ALL_TOOLS.find(t => t.id === id))
    .filter(Boolean) as typeof ALL_TOOLS;

  const isActive = (path: string) => location.pathname === path;

  const asideRef = useRef<HTMLElement>(null);

  // 스크롤 위치 복원
  useEffect(() => {
    const saved = sessionStorage.getItem('sidebar-scroll');
    if (saved && asideRef.current) {
      asideRef.current.scrollTop = Number(saved);
    }
  }, []);

  // 스크롤 위치 저장
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    const onScroll = () => sessionStorage.setItem('sidebar-scroll', String(el.scrollTop));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <aside
      ref={asideRef}
      style={{
        width: '280px',
        minWidth: '280px',
        background: 'var(--surface)',
        borderRight: '2px solid var(--border)',
        height: 'calc(100vh - 60px)',
        position: 'sticky',
        top: '60px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="sidebar"
    >
      {/* Favorites */}
      <div style={{ padding: '10px 10px 6px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          background: '#F59E0B',
          borderRadius: '10px 10px 0 0',
        }}>
          <span style={{ fontSize: '13px', lineHeight: 1 }}>⭐</span>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '11px', color: '#fff', flex: 1, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('favorites.title')}
          </span>
          {favTools.length > 0 && (
            <span style={{ background: '#fff', color: '#92400E', borderRadius: '999px', fontSize: '10px', fontWeight: 800, padding: '1px 7px', fontFamily: 'Nunito, sans-serif' }}>
              {favTools.length}
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{
          background: '#FEF3C7',
          border: '2px solid #F59E0B',
          borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          minHeight: '40px',
        }}>
          {favTools.length === 0 ? (
            <div style={{ padding: '10px 12px', fontSize: '11px', color: '#78350F', lineHeight: 1.6, textAlign: 'center', whiteSpace: 'pre-line' }}>
              {t('favorites.empty')}
            </div>
          ) : (
            favTools.map(tool => (
              <Link
                key={tool.id}
                to={tool.path}
                preventScrollReset
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px' }}
                className="fav-item"
              >
                <span style={{ fontSize: '13px' }}>{tool.icon}</span>
                <span style={{ flex: 1, fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '12px', color: '#78350F' }}>
                  {t(tool.nameKey)}
                </span>
                <StarButton toolId={tool.id} size={13} alwaysVisible />
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '2px', background: 'var(--border)', margin: '2px 10px 4px' }} />

      {/* Category sections */}
      {CATEGORY_ORDER.map(cat => {
        const tools = ALL_TOOLS.filter(t => t.category === cat);
        const meta = CATEGORY_META[cat];
        return (
          <div key={cat} style={{ marginBottom: '4px' }}>
            {/* Category header */}
            <Link to={`/category/${cat}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ padding: '10px 14px 6px', display: 'flex', alignItems: 'center', gap: '8px' }} className="sidebar-cat-header">
                <span style={{ fontSize: '13px' }}>{meta.icon}</span>
                <span
                  style={{
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 900,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'var(--muted2)',
                    letterSpacing: '0.08em',
                    flex: 1,
                  }}
                >
                  {t(meta.labelKey)}
                </span>
              </div>
            </Link>

            {/* Tool items */}
            {tools.map(tool => {
              const active = isActive(tool.path);
              const starred = isFavorite(tool.id);
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  preventScrollReset
                  style={{ textDecoration: 'none', display: 'block' }}
                  className="sidebar-item-link"
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 14px',
                      background: active ? 'var(--accent-soft)' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                    className="sidebar-item"
                  >
                    {/* Icon box */}
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '10px',
                        background: starred ? 'var(--star-soft)' : active ? 'var(--accent-soft)' : 'var(--surface2)',
                        border: `2px solid ${starred ? 'var(--star-border)' : active ? 'var(--accent-border)' : 'var(--border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        flexShrink: 0,
                      }}
                    >
                      {tool.icon}
                    </div>

                    {/* Name */}
                    <span
                      style={{
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: 700,
                        fontSize: '12px',
                        color: active ? 'var(--accent)' : 'var(--text)',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t(tool.nameKey)}
                    </span>

                    {/* Badge */}
                    {tool.badge && (
                      <span
                        style={{
                          ...BADGE_STYLES[tool.badge],
                          borderRadius: '999px',
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          fontFamily: 'Nunito, sans-serif',
                          flexShrink: 0,
                        }}
                      >
                        {t(`badges.${tool.badge}`)}
                      </span>
                    )}

                    {/* Star */}
                    <StarButton toolId={tool.id} size={13} />
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })}

      {/* Ad slot */}
      <div style={{ padding: '16px 12px', marginTop: 'auto' }}>
        <AdSlot type="square" />
      </div>

      <style>{`
        .sidebar-item-link:hover .sidebar-item {
          background: var(--surface2);
        }
        .sidebar-item-link:hover .star-btn {
          opacity: 1 !important;
        }
        .sidebar-cat-header:hover span {
          color: var(--accent) !important;
        }
        .fav-item:hover {
          background: rgba(245,158,11,0.15) !important;
        }
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
        }
      `}</style>
    </aside>
  );
};
