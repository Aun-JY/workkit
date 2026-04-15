import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer
      style={{
        borderTop: '2px solid var(--border)',
        background: 'var(--surface)',
        padding: '28px 24px',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
            <span style={{ fontSize: '18px' }}>🧰</span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '16px', color: 'var(--text)' }}>WorkKit</span>
          </Link>
          <span style={{ color: 'var(--border2)', fontSize: '13px' }}>|</span>
          <Link to="/blog" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }} className="footer-link">
            {t('blog.title')}
          </Link>
          <span style={{ color: 'var(--border2)', fontSize: '13px' }}>·</span>
          <Link to="/privacy" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }} className="footer-link">
            {t('footer.privacy')}
          </Link>
          <span style={{ color: 'var(--border2)', fontSize: '13px' }}>·</span>
          <Link to="/terms" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }} className="footer-link">
            {t('footer.terms')}
          </Link>
          <span style={{ color: 'var(--border2)', fontSize: '13px' }}>·</span>
          <Link to="/about" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '13px', fontFamily: 'Nunito, sans-serif', fontWeight: 600 }} className="footer-link">
            {t('footer.about')}
          </Link>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'Nunito Sans, sans-serif', textAlign: 'center', lineHeight: 1.6 }}>
          {t('footer.tagline')} · {t('footer.copyright')}
        </p>
      </div>
      <style>{`
        .footer-link:hover { color: var(--accent) !important; }
      `}</style>
    </footer>
  );
};
