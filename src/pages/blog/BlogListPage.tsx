import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { BLOG_POSTS } from '../../data/blogPosts';
import { usePageTitle } from '../../hooks/usePageTitle';

export const BlogListPage: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle('블로그 — WorkKit');

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 64px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '2px solid var(--accent-border)', borderRadius: '999px', fontSize: '12px', fontWeight: 700, padding: '5px 14px', fontFamily: 'Nunito, sans-serif' }}>
              ✍️ {t('blog.tagline')}
            </span>
          </div>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '32px', color: 'var(--text)', marginBottom: '12px' }}>
            {t('blog.title')}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7 }}>
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Post list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {BLOG_POSTS.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div
                className="blog-card"
                style={{
                  background: 'var(--surface)',
                  border: '2px solid var(--border)',
                  borderRadius: '20px',
                  padding: '28px',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: '72px', height: '72px',
                  background: 'var(--accent-soft)',
                  border: '2px solid var(--accent-border)',
                  borderRadius: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '32px', flexShrink: 0,
                }}>
                  {post.thumbnail}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Category + date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'Nunito, sans-serif', background: 'var(--accent-soft)', padding: '3px 10px', borderRadius: '999px' }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{post.date}</span>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>·</span>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{t('blog.readingTime', { n: post.readingTime })}</span>
                  </div>

                  <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '18px', color: 'var(--text)', marginBottom: '8px', lineHeight: 1.4 }}>
                    {post.title}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' }}>
                    {post.desc}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {post.tags.slice(0, 4).map(tag => (
                      <span key={tag} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', background: 'var(--surface2, var(--surface))', border: '1.5px solid var(--border)', borderRadius: '999px', padding: '3px 10px', fontFamily: 'Nunito, sans-serif' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div style={{ color: 'var(--accent)', fontSize: '20px', flexShrink: 0, marginTop: '4px' }}>→</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state (if no posts) */}
        {BLOG_POSTS.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✍️</div>
            <p style={{ fontSize: '16px' }}>첫 번째 글을 준비 중입니다!</p>
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        .blog-card:hover {
          box-shadow: 0 12px 28px rgba(255,107,43,0.10);
          transform: translateY(-3px);
          border-color: var(--accent-border) !important;
        }
      `}</style>
    </>
  );
};
