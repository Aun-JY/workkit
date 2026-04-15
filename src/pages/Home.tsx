import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ToolCard } from '../components/ui/ToolCard';
import { AdSlot } from '../components/ui/AdSlot';
import { StarButton } from '../components/ui/StarButton';
import { ALL_TOOLS, CATEGORY_META, ToolCategory } from '../data/tools';
import { useFavorites } from '../store/useFavorites';
import { useUserProfile } from '../store/useUserProfile';
import { usePageTitle } from '../hooks/usePageTitle';

const CATEGORY_ORDER: ToolCategory[] = ['text', 'datetime', 'converter', 'dev', 'calculator', 'games'];

const ZODIAC_KEYS = ['rat','ox','tiger','rabbit','dragon','snake','horse','goat','monkey','rooster','dog','pig'] as const;
const ZODIAC_EMOJIS = ['🐭','🐮','🐯','🐰','🐲','🐍','🐴','🐑','🐵','🐔','🐶','🐷'];
function getZodiacIndex(year: number) { return ((year - 4) % 12 + 12) % 12; }
function seededRandom(seed: number) { const x = Math.sin(seed+1)*10000; return x - Math.floor(x); }
function getFortuneText(lang: string, zodiac: number, category: number): string {
  const now = new Date();
  const datePart = now.getFullYear()*10000 + (now.getMonth()+1)*100 + now.getDate();
  const seed = zodiac * 999983 + category * 7777 + datePart;
  const idx = Math.floor(seededRandom(seed) * 5);
  const map: Record<string, string[][]> = {
    ko: [
      ['오늘은 새 아이디어가 빛을 발하는 날. 상사에게 의견을 적극 피력하세요.','동료와의 협업이 시너지를 만드는 날.','집중력이 높아지는 날. 복잡한 업무도 척척 해결됩니다.','소통이 잘 되는 날. 대화가 술술 풀립니다.','업무 성과가 인정받는 날. 자신감 있게 행동하세요.'],
      ['금전 흐름이 원활한 날. 작은 지출도 꼼꼼히 체크하세요.','절약 습관이 복이 되는 날. 충동 소비는 자제하세요.','예상치 못한 수입이 생길 수 있는 날.','투자보다 저축에 집중하는 게 유리한 날.','재정 계획을 점검하기 좋은 날입니다.'],
      ['대인관계에서 긍정 에너지가 넘치는 날.','팀원들과의 관계가 더욱 돈독해지는 날.','뜻밖의 만남이 좋은 인연이 될 수 있는 날.','갈등을 유연하게 해소할 수 있는 날.','주변 사람들의 의견에 귀 기울이세요.'],
    ],
    en: [
      ['A great day to share new ideas. Speak up in meetings!','Collaboration shines today. Lean on your teammates.','Your focus is razor-sharp today. Tackle complex tasks.','Communication flows smoothly today.','Your work gets noticed today. Act with confidence.'],
      ['Money flows smoothly today. Track small expenses.','Saving habits pay off today. Resist impulsive purchases.','An unexpected income boost may come your way.','Today favors saving over investing.','A good day to review your financial plans.'],
      ['Positive energy radiates in your relationships today.','Bonds with coworkers deepen today.','An unexpected meeting could become a valuable connection.','You can resolve conflicts flexibly today.','Take time to listen to those around you.'],
    ],
    ja: [
      ['新しいアイデアが輝く日。上司に積極的に意見を伝えましょう。','同僚との協力がシナジーを生む日。','集中力が高まる日。複雑な業務もスムーズに進みます。','円滑なコミュニケーションの日。','業績が認められる日。自信を持って行動しましょう。'],
      ['お金の流れが良い日。小さな出費も確認しましょう。','節約習慣が実を結ぶ日。','予想外の収入があるかも。','投資より貯蓄が有利な日です。','家計の見直しに良い日です。'],
      ['人間関係にポジティブなエネルギーがあふれる日。','チームメンバーとの絆が深まる日。','思いがけない出会いが良い縁になる可能性が。','トラブルを柔軟に解消できる日。','周りの意見に耳を傾けましょう。'],
    ],
    zh: [
      ['今天是展示新想法的好日子。','与同事协作今天会产生协同效应。','今天专注力提高，复杂工作也能顺利完成。','今天沟通顺畅。','今天的工作成绩会得到认可。'],
      ['今天资金流动顺畅，注意小额支出。','今天节约习惯会有回报。','今天可能有意外收入。','今天储蓄比投资更有利。','今天是审查财务计划的好时机。'],
      ['今天人际关系中正能量满满。','与团队成员的关系更加深厚。','意外的相遇可能成为宝贵缘分。','今天可以灵活化解矛盾。','多聆听周围人的意见。'],
    ],
    es: [
      ['Hoy es un gran día para compartir nuevas ideas.','La colaboración brilla hoy.','Tu concentración es máxima hoy.','La comunicación fluye bien hoy.','Tu trabajo se nota hoy. ¡Actúa con confianza!'],
      ['El dinero fluye bien hoy. Controla los pequeños gastos.','Los hábitos de ahorro dan frutos.','Puede llegarte un ingreso inesperado hoy.','Hoy favorece el ahorro sobre la inversión.','Buen día para revisar tus planes financieros.'],
      ['Energía positiva en tus relaciones hoy.','Los lazos con compañeros se fortalecen hoy.','Un encuentro inesperado puede ser valioso.','Puedes resolver conflictos con flexibilidad.','Escucha a quienes te rodean.'],
    ],
  };
  const texts = (map[lang] || map.en)[category];
  return texts[idx];
}
function getStars(zodiac: number, cat: number): number {
  const now = new Date();
  const seed = zodiac * 37 + cat * 13 + now.getDate();
  return Math.floor(seededRandom(seed * 13) * 3) + 3;
}

export const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  usePageTitle('WorkKit — 직장인 도구 모음');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_TOOLS.filter(tool =>
      t(tool.nameKey).toLowerCase().includes(q) ||
      t(tool.descKey).toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, t]);

  const popularTools = ALL_TOOLS.filter(t => t.badge === 'popular').slice(0, 8);
  const { favorites } = useFavorites();
  const favTools = favorites.map(id => ALL_TOOLS.find(tool => tool.id === id)).filter(Boolean) as typeof ALL_TOOLS;
  const { birthYear, setBirthYear } = useUserProfile();
  const [inputYear, setInputYear] = useState('');
  const lang = (() => { try { return i18n.language.split('-')[0]; } catch { return 'en'; } })();

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 64px' }}>

        {/* Hero */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center',
            marginBottom: '48px',
          }}
          className="hero-grid"
        >
          {/* Left */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <span
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  border: '2px solid var(--accent-border)',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '5px 14px',
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                🧰 {t('home.hero_badge')}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: '36px',
                lineHeight: 1.25,
                color: 'var(--text)',
                marginBottom: '16px',
                whiteSpace: 'pre-line',
              }}
            >
              {t('home.hero_title')}
            </h1>

            <p
              style={{
                color: 'var(--muted)',
                fontSize: '15px',
                lineHeight: 1.7,
                marginBottom: '24px',
                whiteSpace: 'pre-line',
              }}
            >
              {t('home.hero_desc')}
            </p>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '16px',
                    pointerEvents: 'none',
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t('home.search_placeholder')}
                  style={{
                    background: 'var(--surface)',
                    border: '2px solid var(--border)',
                    borderRadius: '14px',
                    padding: '12px 14px 12px 42px',
                    fontSize: '14px',
                    color: 'var(--text)',
                    width: '100%',
                    outline: 'none',
                    fontFamily: 'Nunito Sans, sans-serif',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              {/* Search dropdown */}
              {searchResults.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: 'var(--surface)',
                    border: '2px solid var(--border)',
                    borderRadius: '14px',
                    boxShadow: '0 12px 28px rgba(255,107,43,0.10)',
                    zIndex: 50,
                    overflow: 'hidden',
                  }}
                >
                  {searchResults.map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px' }}
                      onClick={() => setQuery('')}
                      className="search-result-item"
                    >
                      <span style={{ fontSize: '18px' }}>{tool.icon}</span>
                      <div>
                        <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--text)' }}>
                          {t(tool.nameKey)}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{t(tool.descKey)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Fortune Hero */}
          {!birthYear ? (
            <div style={{
              background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E8 100%)',
              border: '2px solid var(--accent-border)',
              borderRadius: '20px',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              textAlign: 'center',
              minHeight: '200px',
            }}>
              <div style={{ fontSize: '44px', lineHeight: 1 }}>🔮</div>
              <div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '17px', color: 'var(--text)', marginBottom: '4px' }}>
                  {t('fortune.title')}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{t('fortune.subtitle')}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '280px' }}>
                <input
                  type="number"
                  value={inputYear}
                  onChange={e => setInputYear(e.target.value)}
                  placeholder={t('fortune.inputPlaceholder')}
                  min={1924} max={2010}
                  onKeyDown={e => { if (e.key === 'Enter') { const y = parseInt(inputYear); if (y >= 1924 && y <= 2010) setBirthYear(y); }}}
                  style={{ flex: 1, padding: '9px 12px', background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '10px', fontSize: '14px', color: 'var(--text)', outline: 'none', fontFamily: 'Nunito Sans, sans-serif' }}
                />
                <button
                  onClick={() => { const y = parseInt(inputYear); if (y >= 1924 && y <= 2010) setBirthYear(y); }}
                  style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 16px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {t('fortune.save')}
                </button>
              </div>
            </div>
          ) : (() => {
            const zodiacIdx = getZodiacIndex(birthYear);
            const emoji = ZODIAC_EMOJIS[zodiacIdx];
            const animalName = t(`fortune.animals.${ZODIAC_KEYS[zodiacIdx]}`);
            const items = [
              { icon: '💼', label: t('fortune.work'),      text: getFortuneText(lang, zodiacIdx, 0),       stars: getStars(zodiacIdx, 0) },
              { icon: '💰', label: t('fortune.money'),     text: getFortuneText(lang, zodiacIdx, 1),       stars: getStars(zodiacIdx, 1) },
              { icon: '🤝', label: t('fortune.relations'), text: getFortuneText(lang, zodiacIdx, 2),       stars: getStars(zodiacIdx, 2) },
            ];
            return (
              <div style={{
                background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E8 100%)',
                border: '2px solid var(--accent-border)',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{ background: 'var(--accent)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '28px', lineHeight: 1 }}>{emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '14px', color: '#fff' }}>
                      {lang === 'ko' ? `${birthYear}년생 ${animalName}띠` : `${birthYear} · ${animalName}`}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>{t('fortune.today')}</div>
                  </div>
                  <button onClick={() => setBirthYear(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '999px', padding: '3px 10px', color: '#fff', fontSize: '11px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>✏️</button>
                </div>
                {/* Fortune items */}
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.75)', border: '1.5px solid var(--accent-border)', borderRadius: '12px', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px' }}>{item.icon}</span>
                        <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '11px', color: 'var(--accent)', flex: 1 }}>{item.label}</span>
                        <span>{Array.from({length:5},(_,i)=><span key={i} style={{color: i<item.stars?'#FFB300':'#E0E0E0',fontSize:'11px'}}>★</span>)}</span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text)', lineHeight: 1.55, margin: 0 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>

        {/* Ad */}
        <div style={{ marginBottom: '48px' }}>
          <AdSlot type="horizontal" />
        </div>

        {/* Category grid */}
        <section style={{ marginBottom: '48px' }}>
          <h2
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              fontSize: '22px',
              color: 'var(--text)',
              marginBottom: '20px',
            }}
          >
            {t('home.all_categories')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="cat-grid">
            {CATEGORY_ORDER.map(cat => {
              const meta = CATEGORY_META[cat];
              const count = ALL_TOOLS.filter(t => t.category === cat).length;
              return (
                <Link key={cat} to={`/category/${cat}`} style={{ textDecoration: 'none' }}>
                  <div
                    className="cat-card"
                    style={{
                      background: 'var(--surface)',
                      border: '2px solid var(--border)',
                      borderRadius: '20px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{meta.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '16px', color: 'var(--text)', marginBottom: '4px' }}>
                        {t(meta.labelKey)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        {count} {t('category.tools_count')}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Game banner */}
        <section
          style={{
            background: 'linear-gradient(135deg, #FF6B2B 0%, #FF8F5A 100%)',
            borderRadius: '24px',
            padding: '32px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            marginBottom: '48px',
          }}
          className="game-banner"
        >
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯 🪜 🎡 👥</div>
            <h2
              style={{
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 900,
                fontSize: '22px',
                color: '#fff',
                marginBottom: '8px',
              }}
            >
              {t('home.game_banner_title')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
              {t('home.game_banner_desc')}
            </p>
          </div>
          <Link to="/category/games" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <button
              style={{
                background: '#fff',
                color: 'var(--accent)',
                border: 'none',
                borderRadius: '999px',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800,
                fontSize: '14px',
                padding: '12px 28px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t('home.game_banner_cta')} →
            </button>
          </Link>
        </section>

        {/* Favorites */}
        {favTools.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: 'var(--text)', marginBottom: '20px' }}>
              ⭐ {t('favorites.title')}
            </h2>
            <div
              style={{
                background: 'var(--star-soft)',
                border: '2px solid var(--star-border)',
                borderRadius: '20px',
                padding: '16px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {favTools.map(tool => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="fav-chip"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--surface)',
                      border: '2px solid var(--star-border)',
                      borderRadius: '999px',
                      padding: '8px 16px 8px 12px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{tool.icon}</span>
                    <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--text)' }}>
                      {t(tool.nameKey)}
                    </span>
                    <StarButton toolId={tool.id} size={12} alwaysVisible />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular tools */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: 'var(--text)' }}>
              🔥 {t('home.popular_tools')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="popular-grid">
            {popularTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
      <style>{`
        .mini-card:hover, .cat-card:hover {
          box-shadow: 0 12px 28px rgba(255,107,43,0.10);
          transform: translateY(-4px);
          border-color: var(--accent-border) !important;
        }
        .search-result-item:hover {
          background: var(--surface2);
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .popular-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .game-banner { flex-direction: column; text-align: center; }
        }
        @media (max-width: 480px) {
          .cat-grid { grid-template-columns: 1fr !important; }
          .popular-grid { grid-template-columns: 1fr !important; }
        }
        .tool-card:hover {
          box-shadow: 0 12px 28px rgba(255,107,43,0.10);
          transform: translateY(-4px);
          border-color: var(--accent-border) !important;
        }
        .tool-card:hover .star-btn {
          opacity: 1 !important;
        }
        .fav-chip:hover {
          border-color: var(--accent-border) !important;
          background: var(--accent-soft) !important;
        }
      `}</style>
    </>
  );
};
