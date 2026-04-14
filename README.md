# 🧰 WorkKit — 직장인 도구 모음

직장인을 위한 무료 온라인 도구 모음 사이트.  
업무 도구 + 팀 게임을 한 곳에 모아놓은 완전 정적 사이트입니다.

## 🚀 기능

- **텍스트 도구**: 글자 수 세기, 대소문자 변환, 공백 제거기, 이메일·이력서·회의록 정리
- **날짜·시간**: D-Day 계산기, 근무시간 계산기, 세계 시간 변환, 연차 계산기
- **변환 도구**: QR 코드 생성기, Base64 변환기, 색상 팔레트, 비밀번호 생성기
- **개발 도구**: JSON 포맷터, .env 생성기, README 빌더, Cursor Rules, Unix 타임스탬프, 정규식 시각화
- **계산기**: 연봉 실수령액, 초과근무 수당, 연봉 인상률, 더치페이, 프리랜서 단가
- **팀 게임**: 사다리 타기, 룰렛, 팀 나누기, 점심 메뉴 뽑기, 럭키드로우

## 🛠️ 기술 스택

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS v3 + CSS Variables
- **Routing**: React Router v6 (Hash Router)
- **i18n**: i18next (KO / EN / JA / ZH / ES)
- **State**: Zustand (즐겨찾기, 언어 설정)
- **Deploy**: GitHub Pages

## 📦 로컬 실행

### 사전 준비

[Node.js 20+](https://nodejs.org/) 설치 필요

### 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:5173/workkit/` 접속

### 빌드

```bash
npm run build
npm run preview
```

## 🚀 GitHub Pages 배포

### 방법 1: 자동 배포 (GitHub Actions)

`main` 브랜치에 push 하면 자동으로 배포됩니다.  
`.github/workflows/deploy.yml` 파일이 설정되어 있습니다.

### 방법 2: 수동 배포

```bash
npm run deploy
```

### 배포 전 설정

`vite.config.ts`의 `base` 옵션을 본인의 GitHub 레포 이름으로 수정:

```typescript
base: '/your-repo-name/',
```

## 📁 프로젝트 구조

```
workkit/
├── src/
│   ├── components/       # 공통 컴포넌트
│   │   ├── layout/       # Navbar, Sidebar, ToolLayout
│   │   └── ui/           # ToolCard, StarButton, AdSlot 등
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── CategoryPage.tsx
│   │   └── tools/        # 30+ 도구 페이지
│   ├── store/            # Zustand 스토어 (즐겨찾기, 언어)
│   ├── i18n/             # 다국어 설정 & 번역 파일
│   ├── data/             # 도구 메타데이터
│   └── styles/           # CSS 토큰 & 글로벌 스타일
├── public/
└── .github/workflows/    # GitHub Actions
```

## 🌐 다국어 지원

| 언어 | 코드 |
|------|------|
| 한국어 | `ko` |
| English | `en` |
| 日本語 | `ja` |
| 中文 | `zh` |
| Español | `es` |

## 📄 라이선스

MIT License
