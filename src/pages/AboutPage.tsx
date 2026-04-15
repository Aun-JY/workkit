import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ALL_TOOLS, CATEGORY_META, ToolCategory } from '../data/tools';
import { usePageTitle } from '../hooks/usePageTitle';

const CATEGORY_ORDER: ToolCategory[] = ['text', 'datetime', 'converter', 'dev', 'calculator', 'games'];

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle('소개 및 문의 — WorkKit');

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 64px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🧰</div>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '32px', color: 'var(--text)', marginBottom: '16px' }}>
            WorkKit 소개
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.8, maxWidth: '540px', margin: '0 auto' }}>
            WorkKit은 직장인의 업무 효율을 높이기 위한 무료 온라인 도구 모음입니다.
            광고 없이도 모든 기능을 무료로 사용할 수 있도록 설계되었습니다.
          </p>
        </div>

        {/* Features */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: 'var(--text)', marginBottom: '24px' }}>
            WorkKit의 특징
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="about-grid">
            {[
              { icon: '🔒', title: '100% 프라이버시', desc: '모든 계산은 브라우저에서만 이루어집니다. 입력한 데이터는 서버로 전송되지 않아 안전합니다.' },
              { icon: '⚡', title: '빠르고 가벼움', desc: '불필요한 기능 없이 핵심 기능만 담았습니다. 로딩 없이 바로 사용할 수 있습니다.' },
              { icon: '🌍', title: '다국어 지원', desc: '한국어, 영어, 일본어, 중국어, 스페인어를 지원합니다. 상단에서 언어를 선택하세요.' },
              { icon: '📱', title: '모바일 최적화', desc: '스마트폰, 태블릿, PC 모두에서 편리하게 사용할 수 있습니다.' },
            ].map(f => (
              <div key={f.title} style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '15px', color: 'var(--text)', marginBottom: '6px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tool list */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: 'var(--text)', marginBottom: '24px' }}>
            제공 도구 ({ALL_TOOLS.length}개)
          </h2>
          {CATEGORY_ORDER.map(cat => {
            const meta = CATEGORY_META[cat];
            const tools = ALL_TOOLS.filter(tool => tool.category === cat);
            return (
              <div key={cat} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '16px' }}>{meta.icon}</span>
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '14px', color: 'var(--accent)' }}>{t(meta.labelKey)}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tools.map(tool => (
                    <Link key={tool.id} to={tool.path} style={{ textDecoration: 'none' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '999px', padding: '5px 12px', fontSize: '12px', fontFamily: 'Nunito, sans-serif', fontWeight: 600, color: 'var(--text)' }} className="about-tool-chip">
                        {tool.icon} {t(tool.nameKey)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Contact */}
        <section style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✉️</div>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '20px', color: 'var(--text)', marginBottom: '12px' }}>
            문의하기
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '20px' }}>
            도구 추가 제안, 버그 신고, 기타 문의사항이 있으시면 이메일로 연락해 주세요.<br />
            최대한 빠르게 답변 드리겠습니다.
          </p>
          <a
            href="mailto:contact@workkit.tools"
            style={{
              display: 'inline-block',
              background: 'var(--accent)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '12px',
              padding: '12px 28px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: '14px',
            }}
          >
            contact@workkit.tools
          </a>
        </section>
      </div>
      <Footer />
      <style>{`
        .about-tool-chip:hover { border-color: var(--accent-border) !important; color: var(--accent) !important; }
        @media (max-width: 600px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};
