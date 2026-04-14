import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { ToolCard } from '../components/ui/ToolCard';
import { ALL_TOOLS, CATEGORY_META, ToolCategory } from '../data/tools';
import { usePageTitle } from '../hooks/usePageTitle';

type FilterType = 'all' | 'popular' | 'niche' | 'new';

const VALID_CATS: ToolCategory[] = ['text', 'datetime', 'converter', 'dev', 'calculator', 'games'];

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>('all');

  if (!categoryId || !VALID_CATS.includes(categoryId as ToolCategory)) {
    return <Navigate to="/" replace />;
  }

  const cat = categoryId as ToolCategory;
  const meta = CATEGORY_META[cat];
  const tools = ALL_TOOLS.filter(tool => tool.category === cat);

  const filtered = filter === 'all'
    ? tools
    : tools.filter(tool => tool.badge === filter);

  usePageTitle(`${t(meta.labelKey)} — WorkKit`);

  const catBreadcrumb = [{ label: t(meta.labelKey) }];

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all',     label: t('category.filter_all') },
    { key: 'popular', label: t('category.filter_popular') },
    { key: 'niche',   label: t('category.filter_niche') },
    { key: 'new',     label: t('category.filter_new') },
  ];

  return (
    <>
      <Navbar breadcrumbs={catBreadcrumb} />
      <div
        style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 'calc(100vh - 60px)' }}
        className="cat-layout"
      >
        <Sidebar />
        <main style={{ padding: '40px 32px 64px', minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'var(--accent-soft)',
                border: '2px solid var(--accent-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                flexShrink: 0,
              }}
            >
              {meta.icon}
            </div>
            <div>
              <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '28px', color: 'var(--text)', marginBottom: '4px' }}>
                {t(meta.labelKey)}
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                {tools.length} {t('category.tools_count')}
              </p>
            </div>
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  background: filter === f.key ? 'var(--accent)' : 'var(--surface)',
                  color: filter === f.key ? '#fff' : 'var(--text)',
                  border: `2px solid ${filter === f.key ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '999px',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '7px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tool grid */}
          {filtered.length > 0 ? (
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
              className="tools-grid"
            >
              {filtered.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
              {t('category.no_results')}
            </div>
          )}
        </main>

      </div>

      <style>{`
        .tool-card:hover {
          box-shadow: 0 12px 28px rgba(255,107,43,0.10);
          transform: translateY(-4px);
          border-color: var(--accent-border) !important;
        }
        .tool-card:hover .star-btn {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .cat-layout { grid-template-columns: 1fr !important; }
          .tools-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .tools-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};
