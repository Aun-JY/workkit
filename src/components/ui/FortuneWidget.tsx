import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '../../store/useUserProfile';

const ZODIAC_KEYS = ['rat','ox','tiger','rabbit','dragon','snake','horse','goat','monkey','rooster','dog','pig'] as const;
const ZODIAC_EMOJIS = ['🐭','🐮','🐯','🐰','🐲','🐍','🐴','🐑','🐵','🐔','🐶','🐷'];

function getZodiacIndex(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getFortuneIndex(type: 'daily'|'weekly'|'monthly', zodiac: number, arrayLen: number): number {
  const now = new Date();
  let datePart: number;
  if (type === 'daily') {
    datePart = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  } else if (type === 'weekly') {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const week = Math.floor((now.getTime() - startOfYear.getTime()) / (7 * 24 * 3600 * 1000));
    datePart = now.getFullYear() * 1000 + week;
  } else {
    datePart = now.getFullYear() * 100 + now.getMonth();
  }
  const seed = zodiac * 999983 + datePart;
  return Math.floor(seededRandom(seed) * arrayLen);
}

// Fortune text for each language
const FORTUNE_TEXT: Record<string, Record<'daily'|'weekly'|'monthly', string[][]>> = {
  ko: {
    daily: [
      ['오늘은 새 아이디어가 빛을 발하는 날. 상사에게 의견을 적극 피력하세요.', '동료와의 협업이 시너지를 만드는 날. 팀워크를 발휘하세요.', '집중력이 높아지는 날. 복잡한 업무도 척척 해결됩니다.', '소통이 잘 되는 날. 오해 없이 대화가 술술 풀립니다.', '업무 성과가 인정받는 날. 자신감 있게 행동하세요.'],
      ['금전 흐름이 원활한 날. 작은 지출도 꼼꼼히 체크하세요.', '절약 습관이 복이 되는 날. 충동 소비는 자제하세요.', '예상치 못한 수입이 생길 수 있는 날.', '투자보다 저축에 집중하는 게 유리한 날.', '재정 계획을 점검하기 좋은 날입니다.'],
      ['대인관계에서 긍정 에너지가 넘치는 날.', '팀원들과의 관계가 더욱 돈독해지는 날.', '뜻밖의 만남이 좋은 인연이 될 수 있는 날.', '갈등을 유연하게 해소할 수 있는 날.', '주변 사람들의 의견에 귀 기울이세요.'],
    ],
    weekly: [
      ['이번 주는 업무 집중력이 최고조. 중요한 프로젝트를 마무리할 좋은 시기입니다.', '이번 주는 창의적 아이디어가 넘치는 주. 새로운 도전을 두려워 말 것.', '이번 주는 소통의 주간. 회의나 미팅에서 좋은 결과를 얻을 것입니다.', '이번 주는 스트레스 관리가 중요. 적절한 휴식으로 재충전하세요.', '이번 주는 성장의 기회가 찾아옵니다. 새로운 기술을 배워보세요.'],
      ['이번 주 재정 흐름은 안정적. 계획적인 지출이 빛을 발합니다.', '이번 주는 절약의 주간. 작은 습관이 큰 변화를 만듭니다.', '이번 주에 투자 결정을 내려야 한다면 신중하게 검토하세요.', '이번 주는 의외의 수입이 기대됩니다.', '이번 주 금전운은 보통. 꼼꼼한 가계부 작성을 추천합니다.'],
      ['이번 주는 대인관계가 활발해지는 주간. 새로운 인연을 만날 수 있습니다.', '이번 주는 팀워크가 빛나는 주. 협력을 통해 큰 성과를 이룰 것입니다.', '이번 주는 오해가 풀리는 시기. 솔직한 대화로 관계를 회복하세요.', '이번 주는 멘토를 만날 기회. 선배의 조언에 귀 기울이세요.', '이번 주는 인간관계에서 신중함이 필요합니다.'],
    ],
    monthly: [
      ['이달은 커리어 성장의 달. 새로운 프로젝트나 역할에 도전하기 좋습니다.', '이달은 꼼꼼함이 빛을 발하는 달. 디테일에 집중해 완성도를 높이세요.', '이달은 리더십을 발휘할 기회. 팀을 이끌어 나가세요.', '이달은 재충전의 달. 번아웃을 예방하고 여유를 가지세요.', '이달은 학습과 성장의 달. 새로운 스킬에 투자하세요.'],
      ['이달 금전운 상승세. 저축 목표를 세우고 실천해 나가세요.', '이달은 불필요한 지출을 줄이기 좋은 때. 가계 재정을 점검하세요.', '이달은 재테크 공부를 시작하기 좋은 시기입니다.', '이달 수입보다 지출이 많지 않도록 주의하세요.', '이달은 장기적 재정 계획을 세우기 적합한 달입니다.'],
      ['이달은 새로운 인맥이 확장되는 달. 적극적으로 네트워킹하세요.', '이달은 기존 관계를 다지는 달. 오랫동안 연락 못한 사람에게 연락해보세요.', '이달은 협력 파트너와의 관계가 깊어지는 달입니다.', '이달은 갈등 해소에 좋은 에너지. 묵혀온 문제를 풀어보세요.', '이달은 주변의 도움을 받을 수 있는 달입니다.'],
    ],
  },
  en: {
    daily: [
      ['A great day to share new ideas. Speak up in meetings!', 'Collaboration shines today. Lean on your teammates.', 'Your focus is razor-sharp today. Tackle complex tasks head-on.', 'Communication flows smoothly today. Misunderstandings clear up easily.', 'Your work gets noticed today. Act with confidence.'],
      ['Money flows smoothly today. Keep track of small expenses.', 'Saving habits pay off today. Resist impulsive purchases.', 'An unexpected income boost may come your way.', 'Today favors saving over investing.', "A good day to review your financial plans."],
      ['Positive energy radiates in your relationships today.', 'Bonds with coworkers deepen today.', 'An unexpected meeting could turn into a valuable connection.', 'You can resolve conflicts flexibly today.', "Take time to listen to those around you."],
    ],
    weekly: [
      ['This week your focus is at its peak. Great time to finish important projects.', 'Creative ideas flow this week. Embrace new challenges.', "It's a week for communication. Meetings will go well.", 'Manage your stress levels this week. Take time to recharge.', 'Growth opportunities arrive this week. Learn something new.'],
      ['Finances are stable this week. Planned spending pays off.', 'A week to save. Small habits create big change.', 'Review investment decisions carefully this week.', 'Unexpected income is possible this week.', 'Financial luck is average. Track your spending carefully.'],
      ['Social connections expand this week. You may meet new people.', 'Teamwork shines this week. Collaboration leads to great results.', 'Misunderstandings clear up this week. Honest talk restores bonds.', 'A mentor figure may appear. Listen to their advice.', 'Be thoughtful in your relationships this week.'],
    ],
    monthly: [
      ['This month favors career growth. Take on new projects or roles.', 'Attention to detail pays off this month. Focus on quality.', 'Leadership opportunities arise this month. Guide your team.', 'A month to recharge. Prevent burnout with rest.', 'A month for learning. Invest in new skills.'],
      ['Financial luck rises this month. Set savings goals and stick to them.', 'Cut unnecessary spending this month. Review your budget.', "A great time to start learning about investments.", 'Watch that expenses don\'t exceed income this month.', 'A good month to plan for long-term financial goals.'],
      ['Your network expands this month. Network actively.', 'Strengthen existing relationships this month. Reconnect with old friends.', 'Your partnership bonds deepen this month.', 'Good energy for resolving conflicts. Address lingering issues.', 'You can count on the help of those around you this month.'],
    ],
  },
  ja: {
    daily: [
      ['新しいアイデアが輝く日。上司に積極的に意見を伝えましょう。', '同僚との協力がシナジーを生む日。チームワークを発揮して。', '集中力が高まる日。複雑な業務もスムーズに進みます。', '円滑なコミュニケーションの日。誤解なく話が進みます。', '業績が認められる日。自信を持って行動しましょう。'],
      ['お金の流れが良い日。小さな出費も確認しましょう。', '節約習慣が実を結ぶ日。衝動買いは控えて。', '予想外の収入があるかも。', '投資より貯蓄が有利な日です。', '家計の見直しに良い日です。'],
      ['人間関係にポジティブなエネルギーがあふれる日。', 'チームメンバーとの絆が深まる日。', '思いがけない出会いが良い縁になる可能性が。', 'トラブルを柔軟に解消できる日。', '周りの意見に耳を傾けましょう。'],
    ],
    weekly: [
      ['今週は集中力が最高潮。大事なプロジェクトを仕上げるチャンスです。', '今週はクリエイティブなアイデアが豊富。新たな挑戦を恐れずに。', '今週はコミュニケーションの週。会議やミーティングで成果が出ます。', '今週はストレス管理が重要。適度な休息でリフレッシュしましょう。', '今週は成長のチャンスが訪れます。新しいスキルを学んで。'],
      ['今週の財務状況は安定。計画的な支出が効果を発揮します。', '今週は節約週間。小さな習慣が大きな変化を生みます。', '投資判断は慎重に検討しましょう。', '今週は思わぬ収入が期待できます。', '今週の金運は普通。家計簿をつけることを勧めます。'],
      ['今週は対人関係が活発になる週。新しい出会いがあります。', '今週はチームワークが輝く週。協力で大きな成果を。', '今週は誤解が解ける時期。率直な会話で関係を修復しましょう。', '今週はメンターに出会うチャンス。先輩のアドバイスに耳を。', '今週は人間関係で慎重さが必要です。'],
    ],
    monthly: [
      ['今月はキャリア成長の月。新しいプロジェクトや役割に挑戦しましょう。', '今月は丁寧さが光る月。細部に注目して完成度を上げて。', '今月はリーダーシップを発揮するチャンス。チームを牽引しましょう。', '今月は充電の月。燃え尽き症候群を防いでゆとりを持って。', '今月は学びと成長の月。新しいスキルに投資しましょう。'],
      ['今月は金運上昇傾向。貯蓄目標を立てて実践しましょう。', '今月は不要な出費を減らす良い時期。家計を見直しましょう。', '今月は資産運用の勉強を始めるのに適した時期です。', '収入より支出が多くならないよう注意しましょう。', '今月は長期的な財務計画を立てるのに適した月です。'],
      ['今月は新しい人脈が広がる月。積極的にネットワーキングしましょう。', '今月は既存の関係を深める月。久しぶりの人に連絡してみて。', '今月は協力パートナーとの関係が深まります。', '今月は対立解消に良いエネルギー。溜まった問題を解決しましょう。', '今月は周りの助けを得られる月です。'],
    ],
  },
  zh: {
    daily: [
      ['今天是展示新想法的好日子，积极向上司表达意见。', '与同事协作今天会产生协同效应，发挥团队精神。', '今天专注力提高，复杂工作也能顺利完成。', '今天沟通顺畅，误解迎刃而解。', '今天的工作成绩会得到认可，自信行动吧。'],
      ['今天资金流动顺畅，注意小额支出。', '今天节约习惯会有回报，克制冲动消费。', '今天可能有意外收入。', '今天储蓄比投资更有利。', '今天是审查财务计划的好时机。'],
      ['今天人际关系中正能量满满。', '与团队成员的关系更加深厚。', '意外的相遇可能成为宝贵缘分。', '今天可以灵活化解矛盾。', '多聆听周围人的意见。'],
    ],
    weekly: [
      ['本周专注力达到顶峰，是完成重要项目的好时机。', '本周创意想法涌现，勇于接受新挑战。', '本周是沟通之周，会议和交流会有好结果。', '本周压力管理很重要，适当休息充电。', '本周迎来成长机会，学习新技能。'],
      ['本周财务流动稳定，有计划的支出会发挥作用。', '本周是节约之周，小习惯创造大改变。', '投资决策需谨慎考虑。', '本周可能有意外收入。', '本周财运一般，建议仔细记账。'],
      ['本周人际交往活跃，可能结识新朋友。', '本周团队协作闪耀，合作带来大成果。', '本周误解得以化解，坦诚对话修复关系。', '本周有机会遇到导师，听取前辈建议。', '本周人际关系需要谨慎。'],
    ],
    monthly: [
      ['本月是职业发展之月，适合挑战新项目或角色。', '本月细心认真大放异彩，注重细节提升质量。', '本月有机会展现领导力，引领团队前行。', '本月是充电之月，预防倦怠，保持从容。', '本月是学习成长之月，投资新技能。'],
      ['本月财运上升，设定储蓄目标并付诸实践。', '本月适合减少不必要支出，审视家庭财务。', '本月是开始学习投资理财的好时机。', '注意支出不要超过收入。', '本月适合制定长期财务计划。'],
      ['本月人脉扩展，积极建立网络关系。', '本月深化现有关系，联系久未联络的朋友。', '本月与合作伙伴关系更加深厚。', '本月有化解矛盾的好能量，解决积累已久的问题。', '本月可以获得周围人的帮助。'],
    ],
  },
  es: {
    daily: [
      ['Hoy es un gran día para compartir nuevas ideas. ¡Habla en las reuniones!', 'La colaboración brilla hoy. Apóyate en tus compañeros.', 'Tu concentración es máxima hoy. Enfrenta las tareas complejas.', 'La comunicación fluye bien hoy. Los malentendidos se aclaran.', 'Tu trabajo se nota hoy. ¡Actúa con confianza!'],
      ['El dinero fluye bien hoy. Controla los pequeños gastos.', 'Los hábitos de ahorro dan frutos. Evita compras impulsivas.', 'Puede llegarte un ingreso inesperado hoy.', 'Hoy favorece el ahorro sobre la inversión.', 'Buen día para revisar tus planes financieros.'],
      ['Energía positiva en tus relaciones hoy.', 'Los lazos con compañeros se fortalecen hoy.', 'Un encuentro inesperado puede convertirse en una conexión valiosa.', 'Puedes resolver conflictos con flexibilidad hoy.', 'Escucha a quienes te rodean.'],
    ],
    weekly: [
      ['Tu concentración está al máximo esta semana. Ideal para cerrar proyectos.', 'Las ideas creativas fluyen esta semana. Abraza nuevos retos.', 'Semana de comunicación. Las reuniones irán bien.', 'Gestiona el estrés esta semana. Tómate tiempo para recargar.', 'Llegan oportunidades de crecimiento. Aprende algo nuevo.'],
      ['Las finanzas son estables esta semana. El gasto planificado da resultados.', 'Semana de ahorro. Los pequeños hábitos crean grandes cambios.', 'Revisa decisiones de inversión cuidadosamente esta semana.', 'Es posible un ingreso inesperado esta semana.', 'La suerte financiera es media. Controla tus gastos.'],
      ['Tu red social se amplía esta semana. Puedes conocer gente nueva.', 'El trabajo en equipo brilla esta semana. La colaboración trae éxitos.', 'Los malentendidos se aclaran. La honestidad restaura vínculos.', 'Puede aparecer una figura mentora. Escucha su consejo.', 'Sé reflexivo en tus relaciones esta semana.'],
    ],
    monthly: [
      ['Este mes favorece el crecimiento profesional. Asume nuevos proyectos.', 'La atención al detalle da resultados este mes. Enfócate en la calidad.', 'Surgen oportunidades de liderazgo este mes. Guía a tu equipo.', 'Mes para recargar energías. Previene el agotamiento.', 'Mes de aprendizaje. Invierte en nuevas habilidades.'],
      ['La suerte financiera sube este mes. Establece metas de ahorro.', 'Reduce gastos innecesarios este mes. Revisa tu presupuesto.', 'Buen momento para aprender sobre inversiones.', 'Cuida que los gastos no superen los ingresos.', 'Buen mes para planificar metas financieras a largo plazo.'],
      ['Tu red de contactos se expande este mes. Haz networking activamente.', 'Fortalece relaciones existentes este mes. Reconecta con amigos.', 'Los lazos con socios se profundizan este mes.', 'Buena energía para resolver conflictos pendientes.', 'Puedes contar con la ayuda de quienes te rodean este mes.'],
    ],
  },
};

function getStarRating(zodiac: number, type: 'daily'|'weekly'|'monthly'): number {
  const now = new Date();
  const seed = zodiac * 37 + (type === 'daily' ? now.getDate() : type === 'weekly' ? Math.floor(now.getDate()/7) : now.getMonth());
  return Math.floor(seededRandom(seed * 13) * 3) + 3; // 3, 4, or 5 stars
}

function StarDisplay({ count }: { count: number }) {
  return (
    <span>
      {Array.from({length: 5}, (_, i) => (
        <span key={i} style={{ color: i < count ? '#FFB300' : '#E0E0E0', fontSize: '14px' }}>★</span>
      ))}
    </span>
  );
}

export const FortuneWidget: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { birthYear, setBirthYear } = useUserProfile();
  const [inputYear, setInputYear] = useState('');
  const [tab, setTab] = useState<'daily'|'weekly'|'monthly'>('daily');

  const lang = (i18n.language.split('-')[0] as keyof typeof FORTUNE_TEXT) in FORTUNE_TEXT
    ? i18n.language.split('-')[0] as keyof typeof FORTUNE_TEXT
    : 'en';

  const handleSave = () => {
    const y = parseInt(inputYear);
    if (y >= 1924 && y <= 2010) {
      setBirthYear(y);
    }
  };

  if (!birthYear) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E8 100%)',
        border: '2px solid var(--accent-border)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '48px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔮</div>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '22px', color: 'var(--text)', marginBottom: '8px' }}>
          {t('fortune.title')}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
          {t('fortune.subtitle')}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <input
            type="number"
            value={inputYear}
            onChange={e => setInputYear(e.target.value)}
            placeholder={t('fortune.inputPlaceholder')}
            min={1924} max={2010}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            style={{ padding: '10px 16px', background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: '12px', fontSize: '15px', color: 'var(--text)', outline: 'none', fontFamily: 'Nunito Sans, sans-serif', width: '140px' }}
          />
          <button onClick={handleSave}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 24px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>
            {t('fortune.save')} →
          </button>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '12px' }}>{t('fortune.inputLabel')}</p>
      </div>
    );
  }

  const zodiacIdx = getZodiacIndex(birthYear);
  const animalKey = ZODIAC_KEYS[zodiacIdx];
  const animalEmoji = ZODIAC_EMOJIS[zodiacIdx];
  const animalName = t(`fortune.animals.${animalKey}`);
  const fortuneTexts = FORTUNE_TEXT[lang] || FORTUNE_TEXT.en;

  const workIdx = getFortuneIndex(tab, zodiacIdx, fortuneTexts[tab][0].length);
  const moneyIdx = getFortuneIndex(tab, zodiacIdx + 100, fortuneTexts[tab][1].length);
  const relIdx = getFortuneIndex(tab, zodiacIdx + 200, fortuneTexts[tab][2].length);

  const workText = fortuneTexts[tab][0][workIdx];
  const moneyText = fortuneTexts[tab][1][moneyIdx];
  const relText = fortuneTexts[tab][2][relIdx];

  const workStars = getStarRating(zodiacIdx, tab);
  const moneyStars = getStarRating(zodiacIdx + 100, tab);
  const relStars = getStarRating(zodiacIdx + 200, tab);

  const tabs: Array<{key: 'daily'|'weekly'|'monthly', label: string}> = [
    { key: 'daily', label: t('fortune.today') },
    { key: 'weekly', label: t('fortune.weekly') },
    { key: 'monthly', label: t('fortune.monthly') },
  ];

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E8 100%)',
        border: '2px solid var(--accent-border)',
        borderRadius: '24px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: 'var(--accent)', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '48px', lineHeight: 1 }}>{animalEmoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '20px', color: '#fff' }}>
              {lang === 'ko' ? `${birthYear}년생 ${animalName}띠` : `${birthYear} · ${animalName}`}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>
              {t('fortune.title')}
            </div>
          </div>
          <button
            onClick={() => setBirthYear(null)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '999px', padding: '6px 14px', color: '#fff', fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}
          >
            ✏️
          </button>
        </div>

        {/* Tab selector */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--accent-border)', background: 'rgba(255,255,255,0.5)' }}>
          {tabs.map(tabItem => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              style={{
                flex: 1, border: 'none', borderBottom: tab === tabItem.key ? '3px solid var(--accent)' : '3px solid transparent',
                background: 'none', padding: '12px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '13px',
                color: tab === tabItem.key ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {/* Fortune content */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { icon: '💼', label: t('fortune.work'), text: workText, stars: workStars },
            { icon: '💰', label: t('fortune.money'), text: moneyText, stars: moneyStars },
            { icon: '🤝', label: t('fortune.relations'), text: relText, stars: relStars },
          ].map(item => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid var(--accent-border)', borderRadius: '16px', padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '13px', color: 'var(--accent)', flex: 1 }}>{item.label}</span>
                <StarDisplay count={item.stars} />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
