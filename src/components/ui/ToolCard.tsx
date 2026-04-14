import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tool } from '../../data/tools';
import { StarButton } from './StarButton';
import { useFavorites } from '../../store/useFavorites';

interface ToolCardProps {
  tool: Tool;
}

const BADGE_STYLES: Record<string, React.CSSProperties> = {
  popular: { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1.5px solid var(--accent-border)' },
  niche:   { background: 'var(--green-soft)',  color: 'var(--green)',  border: '1.5px solid var(--green-border)' },
  new:     { background: 'var(--blue-soft)',   color: 'var(--blue)',   border: '1.5px solid var(--blue-border)' },
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { t } = useTranslation();
  const { favorites } = useFavorites();
  const starred = favorites.includes(tool.id);

  return (
    <Link
      to={tool.path}
      style={{ textDecoration: 'none' }}
      className="tool-card-wrapper"
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          position: 'relative',
          height: '100%',
        }}
        className="tool-card"
      >
        {/* Star button */}
        <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
          <StarButton toolId={tool.id} alwaysVisible />
        </div>

        {/* Icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: starred ? 'var(--star-soft)' : 'var(--surface2)',
            border: `2px solid ${starred ? 'var(--star-border)' : 'var(--border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            transition: 'all 0.2s ease',
          }}
        >
          {tool.icon}
        </div>

        {/* Name + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>
            {t(tool.nameKey)}
          </span>
          {tool.badge && (
            <span
              style={{
                ...BADGE_STYLES[tool.badge],
                borderRadius: '999px',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 7px',
                fontFamily: 'Nunito, sans-serif',
              }}
            >
              {t(`badges.${tool.badge}`)}
            </span>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
          {t(tool.descKey)}
        </p>
      </div>
    </Link>
  );
};
