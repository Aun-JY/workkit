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

export const PrivacyPage: React.FC = () => {
  usePageTitle('개인정보처리방침 — WorkKit');

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 64px' }}>
        <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '30px', color: 'var(--text)', marginBottom: '8px' }}>
          개인정보처리방침
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '40px' }}>최종 업데이트: 2025년 1월 1일</p>

        <Section title="1. 개요">
          <p>
            WorkKit(이하 "서비스")은 직장인을 위한 무료 온라인 도구 모음 서비스입니다.
            본 개인정보처리방침은 서비스 이용 시 수집되는 정보와 그 이용 방식에 대해 안내합니다.
            서비스를 이용함으로써 본 방침에 동의하는 것으로 간주됩니다.
          </p>
        </Section>

        <Section title="2. 수집하는 정보">
          <p style={{ marginBottom: '12px' }}>WorkKit은 다음과 같은 정보를 수집하거나 저장합니다.</p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}><strong>쿠키(Cookie):</strong> Google AdSense 등 제3자 광고 서비스가 광고 맞춤화 및 측정을 위해 쿠키를 사용할 수 있습니다.</li>
            <li style={{ marginBottom: '8px' }}><strong>로컬스토리지(LocalStorage):</strong> 사용자 설정(언어, 즐겨찾기, 생년 등)을 기기에 저장합니다. 이 데이터는 서버로 전송되지 않습니다.</li>
            <li style={{ marginBottom: '8px' }}><strong>세션스토리지(SessionStorage):</strong> 사이드바 스크롤 위치 등 일시적인 UI 상태를 저장합니다. 탭을 닫으면 삭제됩니다.</li>
            <li style={{ marginBottom: '8px' }}><strong>사용 데이터:</strong> 서비스 품질 개선을 위해 Google Analytics를 통해 익명화된 방문 통계가 수집될 수 있습니다.</li>
          </ul>
        </Section>

        <Section title="3. 정보 이용 목적">
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>서비스 제공 및 기능 유지·개선</li>
            <li style={{ marginBottom: '8px' }}>사용자 맞춤 광고 표시 (Google AdSense)</li>
            <li style={{ marginBottom: '8px' }}>서비스 이용 현황 분석 (Google Analytics)</li>
            <li style={{ marginBottom: '8px' }}>사용자 설정(언어, 즐겨찾기) 저장 및 복원</li>
          </ul>
        </Section>

        <Section title="4. 제3자 서비스">
          <p style={{ marginBottom: '12px' }}>WorkKit은 다음 제3자 서비스를 이용합니다.</p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Google AdSense:</strong> 광고 게재 서비스. Google은 사용자의 기기에 쿠키를 저장하여 관심 기반 광고를 제공할 수 있습니다.
              자세한 내용은 <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google 개인정보처리방침</a>을 참조하세요.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Google Analytics:</strong> 웹사이트 트래픽 분석 서비스. 수집되는 데이터는 익명화되며 개인 식별이 불가합니다.
            </li>
          </ul>
        </Section>

        <Section title="5. 쿠키 관리">
          <p style={{ marginBottom: '12px' }}>
            쿠키는 브라우저 설정을 통해 비활성화할 수 있습니다. 단, 쿠키를 비활성화하면 일부 서비스 기능이 제한될 수 있습니다.
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>Google 맞춤 광고 거부: <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google 광고 설정</a></li>
            <li style={{ marginBottom: '8px' }}>브라우저별 쿠키 설정: Chrome, Firefox, Safari 등 각 브라우저의 설정 메뉴에서 관리 가능합니다.</li>
          </ul>
        </Section>

        <Section title="6. 데이터 보안">
          <p>
            WorkKit의 모든 도구는 클라이언트 측(브라우저)에서만 동작합니다. 사용자가 입력한 텍스트, 수치 등의 데이터는
            서버로 전송되지 않으며, 외부에 공개되거나 저장되지 않습니다. 로컬스토리지에 저장된 데이터는 사용자 본인만 접근 가능합니다.
          </p>
        </Section>

        <Section title="7. 미성년자 개인정보">
          <p>
            WorkKit은 만 14세 미만의 아동을 대상으로 하지 않으며, 아동의 개인정보를 의도적으로 수집하지 않습니다.
          </p>
        </Section>

        <Section title="8. 개인정보처리방침 변경">
          <p>
            본 방침은 관련 법령 변경이나 서비스 변경에 따라 수정될 수 있습니다.
            변경 시 본 페이지에 최신 내용을 게시하며, 중요한 변경 사항은 별도로 안내합니다.
          </p>
        </Section>

        <Section title="9. 문의">
          <p>
            개인정보 관련 문의사항은 아래 이메일로 연락해 주세요.<br />
            <strong>이메일:</strong>{' '}
            <a href="mailto:contact@workkit.tools" style={{ color: 'var(--accent)' }}>contact@workkit.tools</a>
          </p>
        </Section>
      </div>
      <Footer />
    </>
  );
};
