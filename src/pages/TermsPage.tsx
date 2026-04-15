import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { usePageTitle } from '../hooks/usePageTitle';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ marginBottom: '36px' }}>
    <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '18px', color: 'var(--text)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid var(--border)' }}>
      {title}
    </h2>
    <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8 }}>
      {children}
    </div>
  </section>
);

export const TermsPage: React.FC = () => {
  usePageTitle('이용약관 — WorkKit');

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 64px' }}>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '30px', color: 'var(--text)', marginBottom: '8px' }}>
          이용약관
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '40px' }}>최종 업데이트: 2025년 1월 1일</p>

        <Section title="1. 서비스 소개">
          <p>
            WorkKit(이하 "서비스")은 직장인을 위한 무료 온라인 도구 모음을 제공합니다.
            글자 수 세기, 연봉 계산기, 사다리 타기 등 다양한 업무 도구를 무료로 이용할 수 있습니다.
            본 약관은 서비스 이용에 관한 기본적인 사항을 규정합니다.
          </p>
        </Section>

        <Section title="2. 서비스 이용">
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>WorkKit의 모든 도구는 무료로 이용할 수 있습니다.</li>
            <li style={{ marginBottom: '8px' }}>서비스는 별도 회원가입 없이 이용 가능합니다.</li>
            <li style={{ marginBottom: '8px' }}>서비스 내 모든 계산 및 변환 기능은 브라우저에서만 동작하며, 사용자 데이터는 서버로 전송되지 않습니다.</li>
            <li style={{ marginBottom: '8px' }}>서비스는 사전 통보 없이 일부 기능이 변경되거나 종료될 수 있습니다.</li>
          </ul>
        </Section>

        <Section title="3. 금지 행위">
          <p style={{ marginBottom: '12px' }}>다음 행위는 금지됩니다.</p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>서비스를 악용하거나 비정상적인 방법으로 이용하는 행위</li>
            <li style={{ marginBottom: '8px' }}>서비스의 코드, 디자인 등 지식재산을 무단으로 복제·배포하는 행위</li>
            <li style={{ marginBottom: '8px' }}>서비스의 정상적인 운영을 방해하는 행위</li>
            <li style={{ marginBottom: '8px' }}>타인의 권리를 침해하거나 법령을 위반하는 방법으로 서비스를 이용하는 행위</li>
          </ul>
        </Section>

        <Section title="4. 면책사항">
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>WorkKit이 제공하는 계산 결과는 참고용이며, 법적·재정적 결정의 근거로 사용하지 않도록 권고합니다.</li>
            <li style={{ marginBottom: '8px' }}>서비스 이용 중 발생한 손해에 대해 WorkKit은 책임을 지지 않습니다.</li>
            <li style={{ marginBottom: '8px' }}>서비스 장애, 데이터 손실 등에 대해 WorkKit은 책임을 지지 않습니다.</li>
            <li style={{ marginBottom: '8px' }}>연봉·세금 계산기 등의 결과는 실제 결과와 다를 수 있으므로 전문가 상담을 권장합니다.</li>
          </ul>
        </Section>

        <Section title="5. 광고">
          <p>
            WorkKit은 무료 서비스 운영을 위해 Google AdSense를 통한 광고를 게재합니다.
            광고 내용에 대한 책임은 해당 광고주에게 있으며, WorkKit은 광고 내용에 대해 책임을 지지 않습니다.
          </p>
        </Section>

        <Section title="6. 지식재산권">
          <p>
            서비스의 디자인, 코드, 텍스트 등 모든 콘텐츠의 지식재산권은 WorkKit에 귀속됩니다.
            단, 오픈소스 라이선스가 적용된 구성요소는 해당 라이선스를 따릅니다.
          </p>
        </Section>

        <Section title="7. 약관 변경">
          <p>
            본 약관은 필요에 따라 변경될 수 있습니다. 변경된 약관은 본 페이지에 게시되며,
            서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.
          </p>
        </Section>

        <Section title="8. 준거법">
          <p>
            본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 대한민국 법원을 관할 법원으로 합니다.
          </p>
        </Section>

        <Section title="9. 문의">
          <p>
            이용약관 관련 문의사항은 아래로 연락해 주세요.<br />
            <strong>이메일:</strong>{' '}
            <a href="mailto:contact@workkit.tools" style={{ color: 'var(--accent)' }}>contact@workkit.tools</a>
          </p>
        </Section>
      </div>
      <Footer />
    </>
  );
};
