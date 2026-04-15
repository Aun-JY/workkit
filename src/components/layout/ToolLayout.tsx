import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { CategoryTag } from '../ui/CategoryTag';
import { AdSlot } from '../ui/AdSlot';
import { ToolCard } from '../ui/ToolCard';
import { ToolGuide } from '../ui/ToolGuide';
import { ALL_TOOLS, ToolCategory } from '../../data/tools';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface ToolLayoutProps {
  toolId: string;
  category: ToolCategory;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  toolId,
  category,
  breadcrumbs,
  children,
}) => {
  const { t } = useTranslation();

  const related = ALL_TOOLS
    .filter(t => t.category === category && t.id !== toolId)
    .slice(0, 3);

  return (
    <>
      <Navbar breadcrumbs={breadcrumbs} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          minHeight: 'calc(100vh - 60px)',
        }}
        className="tool-layout-grid"
      >
        <Sidebar currentToolId={toolId} />

        <main style={{ padding: '32px 32px 48px', minWidth: 0, maxWidth: '920px', width: '100%' }}>
          {children}

          {/* Guide section */}
          <ToolGuide toolId={toolId} />

          {/* Related tools */}
          {related.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <h3
                style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 900,
                  fontSize: '16px',
                  color: 'var(--text)',
                  marginBottom: '16px',
                }}
              >
                {t('common.related_tools')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {related.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
      <style>{`
        @media (max-width: 768px) {
          .tool-layout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

// Helper: Tool page header block
interface ToolHeaderProps {
  toolId: string;
  category: ToolCategory;
  nameKey: string;
  descKey: string;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ toolId, category, nameKey, descKey }) => {
  const { t } = useTranslation();
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '10px' }}>
        <CategoryTag category={category} linkable />
      </div>
      <h1
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 900,
          fontSize: '28px',
          color: 'var(--text)',
          marginBottom: '8px',
        }}
      >
        {t(nameKey)}
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6 }}>
        {t(descKey)}
      </p>
      <div style={{ marginTop: '20px' }}>
        <AdSlot type="horizontal" />
      </div>
    </div>
  );
};
