import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ToolCategory, CATEGORY_META } from '../../data/tools';

interface CategoryTagProps {
  category: ToolCategory;
  linkable?: boolean;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ category, linkable = false }) => {
  const { t } = useTranslation();
  const meta = CATEGORY_META[category];

  const content = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: 'var(--accent-soft)',
        color: 'var(--accent)',
        border: '1.5px solid var(--accent-border)',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 700,
        padding: '3px 10px',
        fontFamily: 'Nunito, sans-serif',
        cursor: linkable ? 'pointer' : 'default',
      }}
    >
      <span>{meta.icon}</span>
      <span>{t(meta.labelKey)}</span>
    </span>
  );

  if (linkable) {
    return <Link to={`/category/${category}`} style={{ textDecoration: 'none' }}>{content}</Link>;
  }
  return content;
};
