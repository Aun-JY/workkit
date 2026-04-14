import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GUIDES } from '../../data/guides';

interface ToolGuideProps {
  toolId: string;
}

export const ToolGuide: React.FC<ToolGuideProps> = ({ toolId }) => {
  const { t, i18n } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const lang = i18n.language.split('-')[0];
  const guideAll = GUIDES[toolId];
  if (!guideAll) return null;

  // Fall back: lang → en → ko → first available
  const guide = guideAll[lang] || guideAll['en'] || guideAll['ko'] || Object.values(guideAll)[0];
  if (!guide) return null;

  return (
    <section
      style={{
        background: 'var(--surface)',
        border: '2px solid var(--border)',
        borderRadius: '20px',
        overflow: 'hidden',
        marginTop: '40px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--surface2)',
          borderBottom: '2px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span style={{ fontSize: '20px' }}>📖</span>
        <h2
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 900,
            fontSize: '16px',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {t('guide.title')}
        </h2>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* When to use */}
        <div>
          <h3
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: '14px',
              color: 'var(--accent)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🎯 {t('guide.when')}
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text)',
              lineHeight: 1.8,
              margin: 0,
              paddingLeft: '4px',
            }}
          >
            {guide.when}
          </p>
        </div>

        {/* Tips */}
        <div>
          <h3
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: '14px',
              color: 'var(--green)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            💡 {t('guide.tips')}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {guide.tips.map((tip, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  fontSize: '14px',
                  color: 'var(--text)',
                  lineHeight: 1.7,
                  padding: '10px 14px',
                  background: 'var(--surface2)',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border)',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    background: 'var(--green-soft)',
                    color: 'var(--green)',
                    border: '1.5px solid var(--green-border)',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 900,
                    fontFamily: 'Nunito, sans-serif',
                    padding: '1px 8px',
                    marginTop: '2px',
                  }}
                >
                  TIP {i + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        {guide.faq && guide.faq.length > 0 && (
          <div>
            <h3
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: '14px',
                color: 'var(--blue)',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ❓ {t('guide.faq')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {guide.faq.map((item, i) => (
                <div
                  key={i}
                  style={{
                    border: `2px solid ${openFaq === i ? 'var(--blue-border)' : 'var(--border)'}`,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      background: openFaq === i ? 'var(--blue-soft)' : 'var(--surface)',
                      border: 'none',
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: openFaq === i ? 'var(--blue)' : 'var(--text)',
                        textAlign: 'left',
                      }}
                    >
                      Q. {item.q}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: '18px',
                        color: 'var(--muted2)',
                        transform: openFaq === i ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        lineHeight: 1,
                      }}
                    >
                      +
                    </span>
                  </button>

                  {openFaq === i && (
                    <div
                      style={{
                        padding: '0 18px 16px',
                        background: 'var(--blue-soft)',
                        borderTop: '1.5px solid var(--blue-border)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text)',
                          lineHeight: 1.8,
                          margin: '12px 0 0',
                          paddingLeft: '4px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'Nunito, sans-serif',
                            fontWeight: 800,
                            color: 'var(--blue)',
                            marginRight: '6px',
                          }}
                        >
                          A.
                        </span>
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
