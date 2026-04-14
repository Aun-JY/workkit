import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../store/useLanguage';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface NavbarProps {
  breadcrumbs?: BreadcrumbItem[];
}

const LANGS = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const;

export const Navbar: React.FC<NavbarProps> = ({ breadcrumbs }) => {
  const { t } = useTranslation();
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = LANGS.find(l => l.code === lang) ?? LANGS[0];

  const isHome = location.pathname === '/';

  return (
    <nav
      style={{
        height: '60px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--surface)',
        borderBottom: '2px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '10px',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}
        >
          🧰
        </div>
        <span
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 900,
            fontSize: '20px',
            color: 'var(--text)',
          }}
        >
          WorkKit
        </span>
      </Link>

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <>
          <div style={{ width: '1.5px', height: '20px', background: 'var(--border2)', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--muted)', overflow: 'hidden' }}>
            <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 600 }}>
              {t('nav.home')}
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span style={{ color: 'var(--border2)' }}>›</span>
                {crumb.path && idx < breadcrumbs.length - 1 ? (
                  <Link to={crumb.path} style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: 'var(--text)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* Lang dropdown */}
      <div ref={langRef} style={{ position: 'relative' }} className="lang-dropdown">
        <button
          onClick={() => setLangOpen(v => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: langOpen ? 'var(--accent-soft)' : 'var(--surface)',
            border: `2px solid ${langOpen ? 'var(--accent-border)' : 'var(--border)'}`,
            borderRadius: '10px',
            padding: '5px 10px',
            cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--text)',
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>{currentLang.flag}</span>
          <span>{currentLang.label}</span>
          <span style={{ fontSize: '10px', color: 'var(--muted)', marginLeft: '2px' }}>{langOpen ? '▲' : '▼'}</span>
        </button>

        {langOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'var(--surface)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            overflow: 'hidden',
            zIndex: 200,
            minWidth: '140px',
          }}>
            {LANGS.map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => { setLang(code); setLangOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  background: lang === code ? 'var(--accent-soft)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: lang === code ? 800 : 600,
                  fontSize: '13px',
                  color: lang === code ? 'var(--accent)' : 'var(--text)',
                  textAlign: 'left',
                }}
                className="lang-option"
              >
                <span style={{ fontSize: '16px', lineHeight: 1 }}>{flag}</span>
                <span>{label}</span>
                {lang === code && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hamburger — mobile */}
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: '2px solid var(--border)',
          borderRadius: '10px',
          padding: '6px 10px',
          cursor: 'pointer',
          fontSize: '18px',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: 0,
            right: 0,
            background: 'var(--surface)',
            borderBottom: '2px solid var(--border)',
            padding: '16px 24px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            zIndex: 200,
          }}
        >
          {LANGS.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => { setLang(code); setMenuOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: lang === code ? 'var(--accent)' : 'transparent',
                color: lang === code ? '#fff' : 'var(--muted)',
                border: `2px solid ${lang === code ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'Nunito, sans-serif',
                padding: '6px 14px',
                cursor: 'pointer',
              }}
            >
              <span>{flag}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .lang-dropdown { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        .lang-option:hover {
          background: var(--surface2) !important;
        }
      `}</style>
    </nav>
  );
};
