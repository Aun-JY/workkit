import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COOKIE_KEY = 'workkit-cookie-consent';

export const CookieBanner: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--surface)',
        borderTop: '2px solid var(--border)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        flexWrap: 'wrap',
      }}
    >
      <p style={{ flex: 1, fontSize: '13px', color: 'var(--muted)', fontFamily: 'Nunito Sans, sans-serif', lineHeight: 1.5, margin: 0, minWidth: '200px' }}>
        🍪 {t('cookie.message')}{' '}
        <Link to="/privacy" style={{ color: 'var(--accent)', textDecoration: 'underline', fontSize: '13px' }}>
          {t('cookie.learnMore')}
        </Link>
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={reject}
          style={{
            background: 'var(--surface)',
            border: '2px solid var(--border)',
            borderRadius: '10px',
            padding: '7px 16px',
            fontSize: '13px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
        >
          {t('cookie.reject')}
        </button>
        <button
          onClick={accept}
          style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: '10px',
            padding: '7px 20px',
            fontSize: '13px',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {t('cookie.accept')}
        </button>
      </div>
    </div>
  );
};
