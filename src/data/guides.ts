export interface GuideContent {
  when: string;
  tips: string[];
  faq: { q: string; a: string }[];
}

// GUIDES[toolId][lang] — supported langs: 'ko' | 'en' (ja/zh/es fall back to en)
export const GUIDES: Record<string, Record<string, GuideContent>> = {

  /* ── TEXT ───────────────────────────────────────────────────── */

  'word-counter': {
    ko: {
      when: 'SNS 게시물, 기획서, 보도자료 작성 시 글자 수를 실시간으로 확인할 때 유용합니다. 플랫폼별 글자 제한을 초과하지 않도록 미리 체크하세요.',
      tips: [
        '트위터/X는 280자 제한이며, URL은 길이와 무관하게 23자로 고정 계산됩니다.',
        '인스타그램 캡션은 2,200자까지 입력 가능하지만 피드에서 노출되는 건 첫 125자입니다.',
        '링크드인 포스트는 3,000자 이내가 알고리즘 노출에 유리합니다.',
        '한글 1자와 영문 1자는 동일하게 1글자로 계산됩니다.',
        '기획서·보고서 분량 기준이 있을 때 페이지 대신 글자 수로 관리하면 정확합니다.',
      ],
      faq: [
        { q: '공백도 글자 수에 포함되나요?', a: '네, 공백도 1글자로 계산됩니다. SNS 플랫폼도 동일하게 공백을 포함해 계산합니다.' },
        { q: '이모지는 몇 글자인가요?', a: '이모지는 유니코드 특성상 1~2자로 계산됩니다. 트위터에서는 이모지를 2자로 처리합니다.' },
        { q: '줄바꿈도 글자에 포함되나요?', a: '네, 엔터(개행 문자)도 1글자로 포함됩니다.' },
      ],
    },
    en: {
      when: 'Useful when writing social media posts, reports, or press releases and you need to track character counts in real time. Check platform limits before posting.',
      tips: [
        'Twitter/X has a 280-character limit. URLs always count as 23 characters regardless of length.',
        'Instagram captions allow up to 2,200 characters, but only the first 125 are shown in the feed.',
        'LinkedIn posts under 3,000 characters tend to get better algorithmic reach.',
        'Both Korean and English characters count as 1 character each.',
        'Managing document length by character count is more precise than page count.',
      ],
      faq: [
        { q: 'Are spaces counted?', a: 'Yes, each space counts as 1 character, same as social media platforms.' },
        { q: 'How many characters is an emoji?', a: 'Emojis count as 1–2 characters due to Unicode encoding. Twitter counts them as 2 characters.' },
        { q: 'Do line breaks count?', a: 'Yes, each line break counts as 1 character. Be careful when writing multi-line tweets.' },
      ],
    },
  },

  'case-converter': {
    ko: {
      when: '영문 코드 변수명 통일, 제목 케이스 변환, 복사해온 텍스트 정리에 유용합니다. 팀 코딩 컨벤션을 맞출 때 특히 편리합니다.',
      tips: [
        'API 응답 필드명을 snake_case → camelCase로 변환할 때 활용하세요.',
        'Title Case는 영어 제목·헤드라인 작성 시 표준 포맷입니다.',
        'Sentence case는 첫 문장만 대문자로, 일반 문장이나 메일 본문에 적합합니다.',
        'PascalCase는 클래스명, kebab-case는 CSS 클래스명·URL에 주로 사용됩니다.',
      ],
      faq: [
        { q: 'camelCase와 PascalCase의 차이는?', a: 'camelCase는 첫 단어 소문자(myVariable), PascalCase는 첫 단어도 대문자(MyClass)입니다.' },
        { q: '한글이 포함된 텍스트도 변환되나요?', a: '한글은 대소문자 구분이 없어 영문 부분만 변환됩니다.' },
      ],
    },
    en: {
      when: 'Useful for unifying variable names in code, converting text case for titles, or cleaning up copied text to match your team\'s coding conventions.',
      tips: [
        'Use it to convert API field names from snake_case → camelCase.',
        'Title Case is the standard format for English headings and headlines.',
        'Sentence case capitalizes only the first word — great for emails and general text.',
        'PascalCase is used for class names; kebab-case for CSS classes and URLs.',
      ],
      faq: [
        { q: 'What\'s the difference between camelCase and PascalCase?', a: 'camelCase starts lowercase (myVariable), PascalCase starts uppercase (MyClass).' },
        { q: 'Does it work with non-English text?', a: 'Only the English portions are converted. Non-Latin characters are preserved as-is.' },
      ],
    },
  },

  'whitespace': {
    ko: {
      when: '다른 문서나 웹에서 복사한 텍스트에 불필요한 공백·탭·빈 줄이 섞여 있을 때 한 번에 정리해줍니다.',
      tips: [
        '웹페이지에서 복사한 텍스트는 보이지 않는 특수 공백이 포함돼 있는 경우가 많습니다.',
        '줄 사이 여러 개의 빈 줄은 가독성을 떨어뜨립니다. "빈 줄 제거" 옵션으로 깔끔하게 정리하세요.',
        'PDF에서 복사한 텍스트는 단어 사이에 불필요한 공백이 많이 삽입됩니다.',
        '탭→스페이스 변환은 코드 편집기에 붙여넣기 전 통일성을 위해 유용합니다.',
      ],
      faq: [
        { q: '앞뒤 공백 제거란?', a: '각 줄의 시작과 끝에 있는 공백을 제거합니다. 줄 사이 내부 공백은 유지됩니다.' },
        { q: '중복 공백 제거는 어떻게 동작하나요?', a: '두 개 이상 연속된 공백을 하나의 공백으로 줄입니다.' },
      ],
    },
    en: {
      when: 'Use it to clean up text copied from websites, PDFs, or other documents that contain extra spaces, tabs, or blank lines.',
      tips: [
        'Text copied from web pages often contains invisible special whitespace characters.',
        'Multiple blank lines reduce readability. Use "Remove blank lines" to clean them up.',
        'PDF-copied text often has extra spaces inserted between words.',
        'Tab-to-space conversion is helpful before pasting into code editors.',
      ],
      faq: [
        { q: 'What does "trim leading/trailing spaces" do?', a: 'It removes spaces at the start and end of each line. Internal spaces within the line are preserved.' },
        { q: 'How does "remove duplicate spaces" work?', a: 'It collapses two or more consecutive spaces into a single space.' },
      ],
    },
  },

  'email-formatter': {
    ko: {
      when: '비즈니스 이메일을 빠르게 정리하거나, 거칠게 작성된 초안의 줄바꿈·공백을 깔끔하게 다듬을 때 사용하세요.',
      tips: [
        '수신자 이름, 인사말, 본문, 마무리 인사, 서명 순서를 지키면 전문적인 이메일이 됩니다.',
        '단락 사이에는 빈 줄 한 개만 사용하는 것이 가독성에 좋습니다.',
        '중요 내용은 굵게 표시하거나 별도 줄로 분리하세요.',
        '영어 이메일은 문장이 너무 길지 않게, 한 문단에 3~4문장을 권장합니다.',
      ],
      faq: [
        { q: '업무 이메일 첫 인사말은 어떻게 쓰나요?', a: '국내는 "안녕하세요, [이름]입니다." / 영문은 "Dear [Name]," 또는 "Hi [Name]," 이 일반적입니다.' },
        { q: '이메일 서명에는 뭘 넣어야 하나요?', a: '이름, 직책, 회사명, 연락처(전화·이메일)가 기본입니다.' },
      ],
    },
    en: {
      when: 'Use it to quickly clean up a business email draft — fix line breaks, spacing, and structure to look polished and professional.',
      tips: [
        'A professional email follows: recipient name → greeting → body → closing → signature.',
        'Use only one blank line between paragraphs for better readability.',
        'Highlight important content by putting it on its own line.',
        'Keep English emails concise — 3–4 sentences per paragraph is ideal.',
      ],
      faq: [
        { q: 'How should I open a business email?', a: 'Use "Dear [Name]," for formal emails, or "Hi [Name]," for semi-formal ones.' },
        { q: 'What should I include in my email signature?', a: 'Your name, title, company, phone number, and email are the basics. LinkedIn links are optional.' },
      ],
    },
  },

  'resume-formatter': {
    ko: {
      when: '이력서 텍스트를 복사해서 포맷이 흐트러진 경우, 또는 다양한 양식을 하나의 일관된 스타일로 통일할 때 사용하세요.',
      tips: [
        '섹션 제목(경력, 학력, 스킬)은 일관된 형식으로 통일해야 ATS(채용 시스템)가 잘 인식합니다.',
        '날짜 표기는 "2020.03 ~ 2023.06"으로 통일하세요.',
        '성과는 숫자로 표현하세요. "매출 향상" → "6개월간 매출 23% 향상".',
        '글머리 기호(•)를 사용해 항목을 나열하면 채용 담당자가 빠르게 훑어볼 수 있습니다.',
      ],
      faq: [
        { q: '이력서 길이는 몇 페이지가 좋나요?', a: '경력 5년 미만은 1페이지, 5년 이상은 2페이지를 권장합니다.' },
        { q: 'ATS란 무엇인가요?', a: 'Applicant Tracking System. 대기업·스타트업이 이력서를 자동으로 필터링하는 소프트웨어입니다.' },
      ],
    },
    en: {
      when: 'Use it when resume text copied from another document has broken formatting, or when you want to standardize multiple resume sections into a consistent style.',
      tips: [
        'Section headings (Experience, Education, Skills) must be consistent for ATS systems to parse correctly.',
        'Standardize date formats — e.g., "Mar 2020 – Jun 2023" consistently throughout.',
        'Quantify achievements: "Improved sales" → "Increased sales by 23% over 6 months".',
        'Use bullet points (•) so recruiters can skim your resume quickly.',
      ],
      faq: [
        { q: 'How long should a resume be?', a: 'Under 5 years of experience: 1 page. Over 5 years: up to 2 pages. Focus on relevance over length.' },
        { q: 'What is ATS?', a: 'Applicant Tracking System — software used by companies to filter resumes automatically. Keywords and consistent formatting matter a lot.' },
      ],
    },
  },

  'meeting-formatter': {
    ko: {
      when: '회의 후 흩어진 메모를 체계적인 회의록으로 정리할 때 사용합니다. 마크다운 형식으로 출력되어 Notion·Confluence에 바로 붙여넣기 가능합니다.',
      tips: [
        '회의 직후 30분 이내에 정리하면 기억이 생생해 내용이 정확합니다.',
        '액션 아이템은 반드시 담당자와 마감일을 함께 기록하세요. 누가, 무엇을, 언제까지.',
        '결정된 사항과 논의 중인 사항을 명확히 구분해 기록하세요.',
        '회의록은 공유 후 24시간 이내에 참석자 확인을 받으면 오해를 줄일 수 있습니다.',
      ],
      faq: [
        { q: '회의록을 꼭 써야 하나요?', a: '네. 결정 사항을 문서화하지 않으면 서로 다르게 기억하는 경우가 많습니다.' },
        { q: 'Notion에 바로 붙여넣을 수 있나요?', a: '마크다운 형식으로 출력되므로 Notion, Confluence 등에 바로 붙여넣기 하면 서식이 유지됩니다.' },
      ],
    },
    en: {
      when: 'Use it to turn scattered meeting notes into a structured, shareable meeting record. Output is markdown-formatted for easy pasting into Notion or Confluence.',
      tips: [
        'Write up minutes within 30 minutes of the meeting while details are fresh.',
        'Every action item must include: who, what, and by when.',
        'Clearly separate "decisions made" from "items still under discussion".',
        'Get participant confirmation within 24 hours to avoid misunderstandings.',
      ],
      faq: [
        { q: 'Is keeping meeting minutes really necessary?', a: 'Yes. Without written records, people often remember decisions differently — minutes prevent that.' },
        { q: 'Can I paste output directly into Notion?', a: 'Yes. The output is markdown formatted, so it renders correctly in Notion, Confluence, and GitHub Issues.' },
      ],
    },
  },

  /* ── DATETIME ────────────────────────────────────────────────── */

  'dday': {
    ko: {
      when: '프로젝트 마감일, 시험일, 발표일, 기념일까지 남은 날을 한눈에 관리할 때 유용합니다.',
      tips: [
        '업무 마감 D-Day를 등록해두면 매일 아침 긴장감을 유지할 수 있습니다.',
        'D+숫자는 해당 날짜가 지났다는 의미입니다. 프로젝트 경과일 추적에 활용하세요.',
        '입사일, 계약 시작일을 등록해두면 재계약·갱신 시기를 미리 파악할 수 있습니다.',
        '등록한 D-Day는 브라우저에 자동 저장되어 다음에 방문해도 유지됩니다.',
      ],
      faq: [
        { q: 'D-Day 정보는 어디에 저장되나요?', a: '브라우저 로컬스토리지에만 저장됩니다. 다른 기기나 브라우저에서는 보이지 않습니다.' },
        { q: 'D-0과 D-Day는 같은 건가요?', a: '네, 당일은 D-Day로 표시됩니다. 내일은 D-1, 어제는 D+1입니다.' },
      ],
    },
    en: {
      when: 'Useful for tracking project deadlines, exam dates, presentation days, and anniversaries — all in one place.',
      tips: [
        'Add work deadlines to maintain a sense of urgency each morning.',
        'D+ means the date has already passed — useful for tracking project durations.',
        'Log your start date or contract date to know when renewals are coming.',
        'Saved D-Days persist in your browser — they\'ll be there next time you visit.',
      ],
      faq: [
        { q: 'Where is my data stored?', a: 'Only in your browser\'s localStorage. It won\'t appear on other devices or browsers.' },
        { q: 'Is D-0 the same as D-Day?', a: 'Yes. The day itself shows as D-Day, tomorrow is D-1, and yesterday is D+1.' },
      ],
    },
  },

  'work-hours': {
    ko: {
      when: '재택근무·유연근무 시 실제 근무시간을 계산하거나, 한 주간 총 근무시간과 초과근무 여부를 파악할 때 사용합니다.',
      tips: [
        '근로기준법상 1일 최대 근무시간은 휴게 포함 12시간(연장근무 4시간 포함)입니다.',
        '점심 60분을 포함한 9~18시 근무는 실제 근무시간 8시간, 초과근무 0시간입니다.',
        '주 52시간제: 기본 40시간 + 연장근무 최대 12시간.',
        '야간근무(22시~06시)는 추가로 50% 가산수당이 발생합니다.',
      ],
      faq: [
        { q: '휴게시간은 왜 빼나요?', a: '근로기준법상 휴게시간은 근무시간에서 제외됩니다. 8시간 근무 시 1시간 휴게가 의무입니다.' },
        { q: '5인 미만 사업장도 52시간제 적용되나요?', a: '5인 미만 사업장은 연장근무 제한이 적용되지 않지만, 가산수당은 지급해야 합니다.' },
      ],
    },
    en: {
      when: 'Use it to calculate actual working hours during remote or flexible work, or to check total weekly hours and any overtime.',
      tips: [
        'The legal maximum work day is 12 hours including overtime (varies by country).',
        'Working 9–18 with a 60-minute lunch break equals exactly 8 hours of work.',
        'Track your weekly hours to stay within your country\'s overtime limits.',
        'Night shifts (10 PM–6 AM) typically attract additional pay premiums.',
      ],
      faq: [
        { q: 'Why is break time subtracted?', a: 'Break time is not counted as working time by law. An 8-hour workday requires at least 1 hour of breaks.' },
        { q: 'Does this tool handle overtime calculations?', a: 'It calculates total hours and flags overtime. For overtime pay, use the Overtime Calculator tool.' },
      ],
    },
  },

  'timezone': {
    ko: {
      when: '글로벌 팀과 미팅 시간을 조율하거나, 해외 파트너사·고객과 일정을 맞출 때 각 나라 시간을 한눈에 비교할 수 있습니다.',
      tips: [
        '서울(KST)은 UTC+9로, 뉴욕(ET)과는 여름 13시간, 겨울 14시간 차이납니다.',
        '미국은 서머타임(DST)으로 인해 3월~11월 시차가 1시간 달라집니다.',
        '글로벌 팀 미팅 시 모두에게 합리적인 시간은 보통 UTC 기준 8~11시입니다.',
      ],
      faq: [
        { q: '서머타임이란 무엇인가요?', a: '미국·유럽 등이 여름철 일조시간을 활용하기 위해 시계를 1시간 앞당기는 제도입니다. 한국은 서머타임을 시행하지 않습니다.' },
        { q: 'UTC와 GMT 차이는?', a: '실질적으로 동일합니다. UTC는 과학적 표준시, GMT는 영국 그리니치 평균시입니다.' },
      ],
    },
    en: {
      when: 'Use it to coordinate meeting times with global teams or clients across different time zones at a glance.',
      tips: [
        'Seoul (KST) is UTC+9. The difference with New York (ET) is 13 hours in summer, 14 in winter.',
        'The US observes Daylight Saving Time (DST) — time differences shift by 1 hour from March to November.',
        'For global team meetings, UTC 8–11 AM is generally the most reasonable overlap.',
      ],
      faq: [
        { q: 'What is Daylight Saving Time?', a: 'A practice in the US and Europe of moving clocks forward 1 hour in summer. Korea does not observe DST.' },
        { q: 'What\'s the difference between UTC and GMT?', a: 'They are effectively the same. UTC is the scientific standard; GMT is the British geographical one. Used interchangeably in practice.' },
      ],
    },
  },

  'pto': {
    ko: {
      when: '남은 연차 일수가 헷갈릴 때, 또는 연말 전에 사용해야 할 연차를 계획할 때 활용하세요.',
      tips: [
        '근로기준법상 1년 미만 근무자는 매월 1일씩 최대 11일의 연차가 발생합니다.',
        '1년 이상 근무 시 15일, 3년 이상부터 2년마다 1일씩 추가(최대 25일)됩니다.',
        '연차는 원칙적으로 해당 연도에 사용해야 하며, 미사용 시 소멸됩니다.',
        '반차(0.5일)·시간 단위 연차를 허용하는 회사라면 더 유연하게 활용할 수 있습니다.',
      ],
      faq: [
        { q: '연차 수당은 언제 받나요?', a: '회사가 연차 사용 촉진을 했음에도 미사용한 경우에는 수당이 없습니다. 촉진하지 않으면 수당 청구가 가능합니다.' },
        { q: '수습 기간 중에도 연차가 생기나요?', a: '수습 기간도 근무 기간에 포함되므로 월 1일씩 연차가 발생합니다.' },
      ],
    },
    en: {
      when: 'Use it when you\'re unsure how many vacation days you have left, or when planning to use remaining PTO before year-end.',
      tips: [
        'Under Korean law, employees with less than 1 year earn 1 day per month (up to 11 days).',
        'After 1 year: 15 days; after 3 years: +1 day every 2 years, up to 25 days max.',
        'Unused PTO generally expires at year-end. Plan ahead to use it.',
        'If your company allows half-days or hourly PTO, you have more flexibility.',
      ],
      faq: [
        { q: 'Can I get paid out for unused PTO?', a: 'Only if the employer failed to encourage you to use it. If they followed the legal PTO encouragement process, unused days may not be paid out.' },
        { q: 'Does probation time count toward PTO accrual?', a: 'Yes. Probation period is counted as employment, so PTO accrues at 1 day per month during that time.' },
      ],
    },
  },

  /* ── CONVERTER ───────────────────────────────────────────────── */

  'qr-generator': {
    ko: {
      when: '명함·포스터에 URL을 넣거나, 발표 자료에서 참고 링크를 QR로 제공하거나, 회사 WiFi 비밀번호를 QR로 공유할 때 사용합니다.',
      tips: [
        'URL이 길면 QR 코드가 복잡해져 인식률이 낮아집니다. bit.ly 등으로 단축 후 생성하세요.',
        '인쇄용 QR은 최소 2cm×2cm 이상, 해상도 512px 이상으로 다운로드하세요.',
        'WiFi QR 코드를 사무실 입구에 붙여두면 방문객이 비밀번호를 물어볼 필요가 없습니다.',
        'QR 코드 전경색을 짙게, 배경색을 밝게 유지해야 스캔이 잘 됩니다.',
      ],
      faq: [
        { q: 'QR 코드 만료 기간이 있나요?', a: '이 도구로 생성된 QR 코드는 만료되지 않습니다. URL 자체가 유효한 한 영구적으로 사용 가능합니다.' },
        { q: '로고를 QR 중앙에 넣을 수 있나요?', a: '현재 버전에서는 기본 QR만 지원합니다. 로고 삽입은 Canva 등 디자인 툴에서 추가로 편집하세요.' },
      ],
    },
    en: {
      when: 'Use it to add URLs to business cards or posters, share reference links in presentations, or share WiFi passwords without typing them out.',
      tips: [
        'Long URLs make QR codes dense and harder to scan. Shorten them with bit.ly first.',
        'For print, download at 512px or higher and make the QR at least 2cm × 2cm.',
        'Post a WiFi QR at your office entrance so visitors never need to ask for the password.',
        'Keep the foreground dark and background light — inverted colors reduce scan reliability.',
      ],
      faq: [
        { q: 'Do QR codes expire?', a: 'No. QR codes generated here never expire — they work as long as the URL they point to is valid.' },
        { q: 'Can I add a logo in the center?', a: 'The current version generates standard QR codes. For a logo overlay, edit it afterward in Canva or Figma.' },
      ],
    },
  },

  'base64': {
    ko: {
      when: '이메일 첨부 인코딩, API 인증 토큰 디코딩, 이미지를 텍스트로 임베딩할 때 사용합니다.',
      tips: [
        'HTTP Authorization 헤더의 Basic 인증은 "username:password"를 Base64로 인코딩한 값입니다.',
        'JWT 토큰의 헤더와 페이로드는 Base64 URL 인코딩으로 디코딩해서 내용을 확인할 수 있습니다.',
        '이미지를 Base64로 변환하면 HTML·CSS에 파일 없이 직접 삽입 가능합니다.',
        'Base64는 암호화가 아닙니다. 누구든 쉽게 디코딩할 수 있으니 민감 정보는 별도 암호화하세요.',
      ],
      faq: [
        { q: 'Base64는 암호화인가요?', a: '아니요. Base64는 인코딩(데이터 형식 변환)이지 암호화가 아닙니다.' },
        { q: 'Base64 인코딩 시 데이터 크기가 늘어나나요?', a: '네, 원본보다 약 33% 커집니다.' },
      ],
    },
    en: {
      when: 'Use it for encoding email attachments, decoding API authentication tokens, or embedding images directly in HTML/CSS as text.',
      tips: [
        'HTTP Basic Auth sends "username:password" Base64-encoded in the Authorization header.',
        'JWT token headers and payloads are Base64 URL-encoded — decode them to inspect the contents.',
        'Convert small images to Base64 to embed them directly in HTML or CSS without a separate file.',
        'Base64 is NOT encryption. Anyone can decode it — never use it to hide sensitive data.',
      ],
      faq: [
        { q: 'Is Base64 the same as encryption?', a: 'No. Base64 is encoding (format conversion), not encryption. It provides zero security — it\'s trivially reversible.' },
        { q: 'Does Base64 increase file size?', a: 'Yes, by about 33%. Every 3 bytes become 4 characters.' },
      ],
    },
  },

  'color-palette': {
    ko: {
      when: '디자인 작업 중 HEX 코드를 RGB나 HSL로 변환하거나, 브랜드 컬러를 기반으로 밝기 단계별 팔레트를 생성할 때 활용합니다.',
      tips: [
        'Tailwind CSS의 색상 팔레트처럼 밝기 10~90단계 색상을 생성해 디자인 시스템에 사용할 수 있습니다.',
        'HSL에서 H(색조)는 유지하고 L(밝기)만 조정하면 일관된 톤의 팔레트를 만들 수 있습니다.',
        '색상 클릭 시 HEX 코드가 클립보드에 복사됩니다.',
        '배경/전경 색상 대비 비율이 4.5:1 이상이어야 웹 접근성(WCAG AA) 기준을 충족합니다.',
      ],
      faq: [
        { q: 'HEX, RGB, HSL 중 어떤 걸 써야 하나요?', a: 'CSS에는 HEX나 RGB, 색조 계열을 맞출 때는 HSL이 가장 편리합니다.' },
        { q: '팔레트를 CSS 변수로 출력할 수 있나요?', a: '현재는 HEX 코드 복사만 지원합니다.' },
      ],
    },
    en: {
      when: 'Use it during design work to convert HEX to RGB or HSL, or to generate a full lightness-scale palette from a single brand color.',
      tips: [
        'Generate a palette with shades from 10 to 90, just like Tailwind CSS color scales, for use in design systems.',
        'In HSL, keep Hue (H) constant and vary Lightness (L) to create a consistent tonal palette.',
        'Click any color swatch to copy its HEX code to clipboard.',
        'For web accessibility (WCAG AA), ensure contrast ratio is at least 4.5:1 between text and background.',
      ],
      faq: [
        { q: 'Which format should I use — HEX, RGB, or HSL?', a: 'HEX or RGB for CSS properties; HSL is most intuitive when adjusting tones and creating palettes.' },
        { q: 'Can I export the palette as CSS variables?', a: 'Currently only HEX code copying is supported. Paste the values into your CSS manually.' },
      ],
    },
  },

  'password-gen': {
    ko: {
      when: '새 계정 가입, 시스템 초기 비밀번호 설정, 공유 계정 비밀번호 변경 시 즉시 강력한 비밀번호를 만들 수 있습니다.',
      tips: [
        '16자 이상 + 대소문자 + 숫자 + 특수문자 조합이 현재 가장 권장되는 강도입니다.',
        '비밀번호 관리자(1Password, Bitwarden 등)와 함께 사용하면 복잡한 비밀번호도 기억할 필요가 없습니다.',
        '동일한 비밀번호를 여러 사이트에서 재사용하지 마세요.',
        '"혼동되는 문자 제외" 옵션으로 0/O, 1/l/I 등 헷갈리는 문자를 제거할 수 있습니다.',
      ],
      faq: [
        { q: '생성된 비밀번호가 서버에 저장되나요?', a: '아니요. 이 도구는 완전히 브라우저에서만 실행됩니다. 서버로 전송되지 않습니다.' },
        { q: '얼마나 자주 비밀번호를 바꿔야 하나요?', a: '최신 보안 가이드(NIST)는 주기적 변경보다 강력한 비밀번호 유지를 권장합니다.' },
      ],
    },
    en: {
      when: 'Use it when creating a new account, setting an initial system password, or updating a shared account password — generate a strong one instantly.',
      tips: [
        '16+ characters with uppercase, lowercase, numbers, and symbols is the current recommended minimum strength.',
        'Pair it with a password manager (1Password, Bitwarden) so you never need to memorize complex passwords.',
        'Never reuse the same password across multiple sites — one breach puts all your accounts at risk.',
        'The "exclude ambiguous characters" option removes confusing characters like 0/O and 1/l/I.',
      ],
      faq: [
        { q: 'Is the generated password sent to a server?', a: 'No. This tool runs entirely in your browser. Nothing is transmitted or stored anywhere.' },
        { q: 'How often should I change my password?', a: 'Current NIST guidelines favor strong, unique passwords over frequent rotation. Change immediately if a breach is suspected.' },
      ],
    },
  },

  /* ── DEV ─────────────────────────────────────────────────────── */

  'json-formatter': {
    ko: {
      when: 'API 응답을 읽기 좋게 정렬하거나, 압축된 JSON을 검토하거나, JSON 문법 오류를 찾을 때 사용합니다.',
      tips: [
        'API 응답을 그대로 붙여넣고 Format 버튼으로 즉시 구조를 파악하세요.',
        '서버에 전송하기 전 Minify로 압축하면 데이터 크기를 줄일 수 있습니다.',
        'Validate로 JSON 문법 오류 위치를 정확히 파악할 수 있습니다.',
        'JSON 키는 반드시 큰따옴표("")로 감싸야 합니다. 작은따옴표는 유효하지 않습니다.',
      ],
      faq: [
        { q: 'JSON에 주석을 달 수 있나요?', a: '표준 JSON은 주석을 지원하지 않습니다. "_comment" 키를 추가하는 관행이 있습니다.' },
        { q: '큰 JSON 파일도 처리되나요?', a: '브라우저 메모리 한계까지는 처리 가능합니다. 매우 큰 파일은 jq 등의 CLI 도구를 권장합니다.' },
      ],
    },
    en: {
      when: 'Use it daily to prettify API responses, review minified JSON, or find syntax errors. Essential for dev and QA work.',
      tips: [
        'Paste an API response directly and hit Format to instantly understand its structure.',
        'Use Minify before sending JSON payloads to a server to reduce data size.',
        'Validate pinpoints exact JSON syntax errors with line numbers.',
        'JSON keys must be double-quoted ("key"). Single quotes are not valid JSON.',
      ],
      faq: [
        { q: 'Can I add comments to JSON?', a: 'Standard JSON doesn\'t support comments. Common workarounds: use JSONC format, or add a "_comment" key.' },
        { q: 'Can it handle very large JSON files?', a: 'Up to your browser\'s memory limit. For very large files (100MB+), use a CLI tool like jq.' },
      ],
    },
  },

  'env-generator': {
    ko: {
      when: '새 프로젝트의 .env 파일 템플릿을 만들거나, 팀원에게 필요한 환경변수 목록을 .env.example로 공유할 때 사용합니다.',
      tips: [
        '.env 파일은 반드시 .gitignore에 추가해 버전 관리에서 제외하세요.',
        '.env.example은 실제 값 없이 키 목록만 담아 레포에 커밋하세요.',
        'DATABASE_URL, API_KEY 등 민감한 값은 절대 주석에도 실제 값을 쓰지 마세요.',
        '배포 환경별(dev/staging/prod)로 별도 .env 파일을 관리하는 것이 좋습니다.',
      ],
      faq: [
        { q: '.env 파일이 git에 올라갔으면 어떻게 하나요?', a: '즉시 해당 키/시크릿을 무효화(revoke)하고 새로 발급하세요.' },
        { q: 'NODE_ENV는 어떤 값을 써야 하나요?', a: '개발: development, 테스트: test, 운영: production 이 관례입니다.' },
      ],
    },
    en: {
      when: 'Use it to create a .env file template for a new project, or to generate a .env.example to share with teammates.',
      tips: [
        'Always add .env to your .gitignore. Never commit real secrets to version control.',
        'Commit .env.example with key names but no values — it documents what teammates need to set up.',
        'Never write real values in comments next to sensitive keys like DATABASE_URL or API_KEY.',
        'Maintain separate .env files per environment: development, staging, production.',
      ],
      faq: [
        { q: 'What if I accidentally committed my .env to git?', a: 'Immediately revoke and regenerate all exposed secrets. Deleting from git history alone is NOT sufficient.' },
        { q: 'What values should NODE_ENV have?', a: 'Convention: development (local), test (CI), production (live). Many libraries change their behavior based on this value.' },
      ],
    },
  },

  'readme-builder': {
    ko: {
      when: '새 프로젝트의 GitHub README를 빠르게 작성하거나, 오픈소스 프로젝트의 문서 초안을 만들 때 사용합니다.',
      tips: [
        '좋은 README는 "무엇을 하는 프로젝트인지"를 첫 3줄 안에 설명해야 합니다.',
        'Installation과 Usage 섹션은 처음 보는 사람이 5분 안에 실행할 수 있도록 구체적으로 작성하세요.',
        '뱃지(shield.io)를 추가하면 빌드 상태, 버전, 라이선스를 시각적으로 표시할 수 있습니다.',
        'GIF나 스크린샷을 넣으면 사용자가 프로젝트를 훨씬 빠르게 이해합니다.',
      ],
      faq: [
        { q: 'MIT와 Apache 라이선스 차이는?', a: 'MIT는 가장 자유로운 라이선스입니다. Apache 2.0은 특허권 조항이 추가되어 기업에서 더 선호합니다.' },
        { q: 'README.md 말고 다른 파일도 필요한가요?', a: 'CONTRIBUTING.md, CHANGELOG.md, LICENSE를 추가하면 오픈소스로서 완성도가 높아집니다.' },
      ],
    },
    en: {
      when: 'Use it to quickly draft a GitHub README for a new project or create initial documentation for an open-source library.',
      tips: [
        'A good README explains "what this project does" in the first 3 lines.',
        'Write Installation and Usage sections so that a newcomer can run the project in under 5 minutes.',
        'Add badges from shields.io to display build status, version, and license visually.',
        'Include a GIF or screenshot — it helps users understand your project much faster.',
      ],
      faq: [
        { q: 'What\'s the difference between MIT and Apache licenses?', a: 'MIT is the most permissive. Apache 2.0 adds patent protection clauses, which enterprises tend to prefer.' },
        { q: 'Do I need other files besides README.md?', a: 'CONTRIBUTING.md, CHANGELOG.md, and a LICENSE file round out a polished open-source project.' },
      ],
    },
  },

  'cursor-rules': {
    ko: {
      when: 'Cursor, GitHub Copilot 등 AI 코딩 어시스턴트가 프로젝트 컨벤션에 맞는 코드를 생성하도록 규칙을 설정할 때 사용합니다.',
      tips: [
        '.cursorrules 파일을 프로젝트 루트에 두면 Cursor가 자동으로 읽어 컨텍스트로 활용합니다.',
        '팀 전체가 동일한 규칙을 공유하면 AI 코드의 일관성이 높아집니다. 규칙 파일을 git에 커밋하세요.',
        '코드 스타일뿐 아니라 "절대 console.log를 남기지 말 것" 같은 프로젝트 규칙도 명시하면 효과적입니다.',
        '너무 긴 규칙은 오히려 AI 성능을 떨어뜨릴 수 있습니다. 핵심 규칙 10~20개로 간결하게 유지하세요.',
      ],
      faq: [
        { q: '.cursorrules가 없으면 어떻게 되나요?', a: 'Cursor가 기본 동작으로 코드를 생성합니다. 팀 컨벤션과 맞지 않는 코드가 나올 수 있습니다.' },
        { q: '어떤 내용을 규칙에 넣어야 하나요?', a: '사용 기술 스택, 코딩 스타일, 금지 패턴, 테스트 방식, 파일 구조 등을 포함하면 좋습니다.' },
      ],
    },
    en: {
      when: 'Use it to define rules so that AI coding assistants like Cursor or GitHub Copilot generate code that matches your project\'s conventions.',
      tips: [
        'Place .cursorrules in your project root — Cursor reads it automatically as context.',
        'Committing the rules file to git ensures everyone on the team gets the same AI behavior.',
        'Include project-specific rules like "never leave console.log" alongside code style preferences.',
        'Keep rules concise (10–20 key rules). Too many rules can actually degrade AI output quality.',
      ],
      faq: [
        { q: 'What happens without a .cursorrules file?', a: 'Cursor uses its default behavior, which may produce code inconsistent with your team\'s conventions.' },
        { q: 'What should I include in the rules?', a: 'Tech stack, coding style, forbidden patterns, testing approach, and file structure conventions are all great to include.' },
      ],
    },
  },

  'unix-timestamp': {
    ko: {
      when: '서버 로그의 타임스탬프를 읽거나, 데이터베이스에 저장된 Unix 시간을 실제 날짜로 변환하거나, API 요청에 만료 시간을 계산할 때 사용합니다.',
      tips: [
        'Unix 타임스탬프는 1970년 1월 1일 00:00:00 UTC부터 경과한 초(seconds)입니다.',
        'JavaScript에서는 Date.now()가 밀리초(ms) 단위이므로 1000으로 나눠야 Unix 타임스탬프가 됩니다.',
        '2038년 1월 19일에 32비트 시스템의 Year 2038 문제가 발생합니다.',
        'JWT 토큰의 exp(만료) 필드는 Unix 타임스탬프입니다.',
      ],
      faq: [
        { q: '밀리초 타임스탬프를 변환하려면?', a: '13자리 숫자이면 밀리초입니다. 1000으로 나눠 초 단위로 변환 후 입력하세요.' },
        { q: '시간대(타임존)는 어떻게 처리되나요?', a: 'Unix 타임스탬프는 항상 UTC 기준입니다. 변환 결과는 브라우저의 로컬 시간대로 표시됩니다.' },
      ],
    },
    en: {
      when: 'Use it to read server log timestamps, convert Unix time stored in databases back to human-readable dates, or calculate expiration times for API tokens.',
      tips: [
        'Unix timestamp = seconds elapsed since January 1, 1970 00:00:00 UTC.',
        'JavaScript\'s Date.now() returns milliseconds — divide by 1000 to get a Unix timestamp.',
        'The Year 2038 problem occurs when 32-bit systems overflow on January 19, 2038.',
        'JWT token\'s "exp" field is a Unix timestamp — decode it here to check expiry.',
      ],
      faq: [
        { q: 'How do I convert a millisecond timestamp?', a: 'If it\'s 13 digits, it\'s milliseconds. Divide by 1000 to convert to seconds before entering.' },
        { q: 'How does timezone handling work?', a: 'Unix timestamps are always UTC. The converted result displays in your browser\'s local timezone.' },
      ],
    },
  },

  'regex-visualizer': {
    ko: {
      when: '정규식 패턴을 작성하거나 이해할 때, 로그 파일에서 패턴을 추출하거나, 입력값 유효성 검사 로직을 개발할 때 사용합니다.',
      tips: [
        '\\d는 숫자, \\w는 영숫자+언더스코어, \\s는 공백 문자입니다.',
        '^는 문자열 시작, $는 끝을 의미합니다.',
        'g 플래그는 전체 검색, i 플래그는 대소문자 무시입니다.',
        '한글 매칭은 [가-힣]+ 패턴을 사용하세요.',
      ],
      faq: [
        { q: '정규식이 너무 어려워요. 어디서 배울 수 있나요?', a: 'regex101.com은 패턴별 설명이 표시되어 학습에 최적입니다.' },
        { q: '이메일 정규식이 완벽한가요?', a: '실용적인 이메일 패턴은 [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,} 입니다.' },
      ],
    },
    en: {
      when: 'Use it when writing or debugging regex patterns, extracting structured data from log files, or building input validation logic.',
      tips: [
        '\\d matches digits, \\w matches word characters (letters, digits, underscore), \\s matches whitespace.',
        '^ anchors to the start of a string, $ to the end — essential for exact matching.',
        'The g flag finds all matches; i makes matching case-insensitive.',
        'To match Korean characters, use the range [가-힣]+.',
      ],
      faq: [
        { q: 'Where can I learn regex?', a: 'regex101.com shows explanations for each part of your pattern — great for learning. regexlearn.com has interactive exercises.' },
        { q: 'Is the email regex pattern perfect?', a: 'The practical pattern [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,} covers 99.9% of real emails. Full RFC 5322 compliance is far more complex.' },
      ],
    },
  },

  /* ── CALCULATOR ──────────────────────────────────────────────── */

  'salary': {
    ko: {
      when: '연봉 협상 전 실수령액을 미리 계산하거나, 현재 공제 내역을 이해하거나, 부양가족 수에 따른 절세 효과를 확인할 때 사용합니다.',
      tips: [
        '비과세 항목(식대 월 20만원, 차량유지비 등)을 최대한 활용하면 실수령액이 늘어납니다.',
        '부양가족이 많을수록 간이세액이 낮아집니다.',
        '국민연금 상한선은 월 590만원(2024년 기준)이라 그 이상 소득자는 연금 납부액이 동일합니다.',
        '연봉 협상 시 "연봉 5천만원"보다 "월 실수령액 약 360만원"으로 체감 금액을 확인하세요.',
      ],
      faq: [
        { q: '계산 결과가 실제 급여와 다를 수 있나요?', a: '네. 이 계산기는 간이세액표 기반 근사치입니다. 비과세 항목, 정확한 부양가족 공제에 따라 달라집니다.' },
        { q: '4대보험이란 무엇인가요?', a: '국민연금, 건강보험, 장기요양보험, 고용보험입니다. 직장인은 회사와 반씩 부담합니다.' },
      ],
    },
    en: {
      when: 'Use it before salary negotiations to estimate take-home pay, to understand your current deductions, or to compare offers across different countries.',
      tips: [
        'Select your country first — tax rates and deduction structures differ significantly.',
        'The result is your net (take-home) pay after all standard deductions.',
        'US users: the calculator uses the standard federal deduction (no itemized deductions).',
        'Korean users: all 6 mandatory deductions (pension, health, care, employment, income tax, local income tax) are auto-calculated.',
      ],
      faq: [
        { q: 'Why might my result differ from my actual paycheck?', a: 'This uses standard rates. Actual pay varies based on dependents, non-taxable benefits, and employer-specific deductions.' },
        { q: 'Does this include bonuses?', a: 'No — only base salary. Bonuses are typically taxed differently and should be calculated separately.' },
      ],
    },
  },

  'overtime': {
    ko: {
      when: '연장·야간·휴일 근무 후 정확한 수당을 계산하거나, 급여 명세서의 수당 항목을 직접 검증하고 싶을 때 사용합니다.',
      tips: [
        '연장근무(1일 8시간 초과)는 통상임금의 150%입니다.',
        '야간근무(22:00~06:00)는 추가로 50% 가산, 연장+야간 동시에는 200%가 됩니다.',
        '휴일근무는 8시간 이하 150%, 8시간 초과분은 200%입니다.',
        '포괄임금제 계약자는 수당이 이미 임금에 포함돼 별도 청구가 어려울 수 있습니다.',
      ],
      faq: [
        { q: '시급은 어떻게 계산하나요?', a: '주 40시간 기준으로는 월 209시간으로 나눕니다.' },
        { q: '포괄임금제가 합법인가요?', a: '제한적으로 허용됩니다. 근로시간 산정이 어려운 업종에만 적용 가능하며, 최저임금 이상이어야 합니다.' },
      ],
    },
    en: {
      when: 'Use it to calculate exact overtime pay after working extended, night, or holiday hours — or to verify the overtime items on your payslip.',
      tips: [
        'Select your country — overtime rules vary significantly (Korea 150%, Japan 125%, US 150%, etc.).',
        'Night shift premiums typically stack on top of overtime rates.',
        'Holiday overtime often has a higher multiplier than regular overtime.',
        'If you\'re on an all-inclusive pay structure, additional overtime claims may be restricted.',
      ],
      faq: [
        { q: 'How is the hourly rate calculated from monthly salary?', a: 'Divide monthly salary by the standard monthly hours (typically 209 hours for a 40-hour week in Korea).' },
        { q: 'What if my employer refuses to pay overtime?', a: 'Document your hours carefully. In most countries, unpaid overtime can be claimed through a labor authority.' },
      ],
    },
  },

  'raise-calc': {
    ko: {
      when: '연봉 인상 제안을 받았을 때 실제 실수령액이 얼마나 오르는지 확인하거나, 인상 협상 전 목표 실수령액을 역산할 때 사용합니다.',
      tips: [
        '연봉 5% 인상도 세금·보험료 증가 때문에 실수령액은 4% 미만으로 늘어나는 경우가 많습니다.',
        '협상 시 퍼센트보다 "월 실수령액 XX만원 인상"으로 구체적으로 요구하면 명확합니다.',
        '성과급은 별도 세율이 적용될 수 있습니다.',
        '호봉제 회사는 매년 자동 인상이 있으니 기본 인상분과 성과 인상분을 분리해서 협상하세요.',
      ],
      faq: [
        { q: '연봉 협상 시기는 언제가 좋나요?', a: '성과가 명확히 드러난 직후, 또는 경쟁사 오퍼를 받은 경우 가장 협상력이 높습니다.' },
        { q: '연봉이 올라도 왜 실수령은 조금만 오르나요?', a: '소득세는 누진세로 연봉이 높을수록 세율이 올라가고, 건강보험료도 같이 오르기 때문입니다.' },
      ],
    },
    en: {
      when: 'Use it when you receive a salary raise offer to see the real impact on your take-home pay, or to back-calculate what gross salary you need to hit a target net.',
      tips: [
        'A 5% gross raise often translates to less than 4% net increase due to higher tax and insurance brackets.',
        'In negotiations, asking for a specific monthly net increase is more concrete than a percentage.',
        'Bonuses may be taxed at a different rate from regular salary.',
        'Automatic annual increments should be separated from merit raises in negotiations.',
      ],
      faq: [
        { q: 'When is the best time to negotiate a raise?', a: 'Right after a strong performance result, or when you have a competing job offer — that\'s when your leverage is highest.' },
        { q: 'Why does a raise feel smaller than expected?', a: 'Income tax is progressive — higher salary = higher marginal rate. Social insurance premiums also increase proportionally.' },
      ],
    },
  },

  'dutch-pay': {
    ko: {
      when: '팀 회식, 경조사 부조금, 공동 구매 비용을 인원별로 나눌 때 사용합니다.',
      tips: [
        '총액 입력 후 인원을 조정하면 1인당 금액이 실시간으로 업데이트됩니다.',
        '카카오페이·토스 등의 정산 요청 기능과 함께 사용하면 정산이 빠릅니다.',
        '법인카드를 사용한 경우에도 개인 부담 금액 계산에 활용할 수 있습니다.',
      ],
      faq: [
        { q: '1원 단위 나머지는 어떻게 처리되나요?', a: '1/N이 딱 나누어떨어지지 않을 때는 한 명이 차액을 부담하는 것이 일반적입니다.' },
        { q: '차등 분담(직급별)도 계산할 수 있나요?', a: '개인별 금액 입력 기능을 통해 특정 인원에게 다른 금액을 지정할 수 있습니다.' },
      ],
    },
    en: {
      when: 'Use it to split team dinner bills, shared purchases, or event costs fairly among a group of people.',
      tips: [
        'Adjust the number of people and the per-person amount updates in real time.',
        'Combine with payment apps (Venmo, PayPal, etc.) to settle up instantly after.',
        'Works great for splitting costs even when a company card was used for the total.',
      ],
      faq: [
        { q: 'What happens with remainders (cents that don\'t divide evenly)?', a: 'Standard practice is for one person to cover the difference — typically the one who organized the event.' },
        { q: 'Can I assign different amounts to different people?', a: 'Yes — use the custom amount input to set a different contribution for specific individuals.' },
      ],
    },
  },

  'freelance-rate': {
    ko: {
      when: '프리랜서로 전향하거나 부업 단가를 설정할 때, 또는 클라이언트에게 견적을 제시할 때 희망 연봉 기반으로 단가를 역산할 수 있습니다.',
      tips: [
        '프리랜서 단가는 회사원 연봉 대비 30~50% 높게 설정해야 합니다. 4대보험, 휴가, 병가 등 복리후생이 없기 때문입니다.',
        '원천징수 3.3%는 소득세 3% + 지방소득세 0.3%이며, 연말정산 시 환급 또는 추가 납부가 발생할 수 있습니다.',
        '실제 청구 가능한 일수는 연 220일(공휴일·휴가 제외)을 기준으로 계산하세요.',
      ],
      faq: [
        { q: '사업자 등록을 해야 하나요?', a: '연 수입 2,400만원 이상이면 부가가치세 신고 의무가 생깁니다.' },
        { q: '프리랜서 단가 협상 팁이 있나요?', a: '처음 제시 단가를 약간 높게 부르고 협상 여지를 남기는 것이 일반적입니다.' },
      ],
    },
    en: {
      when: 'Use it when going freelance or setting side-project rates — back-calculate your hourly/daily rate from a target annual income.',
      tips: [
        'Set your freelance rate 30–50% higher than an equivalent salaried role to account for no employer benefits, vacation, or sick pay.',
        'Count on roughly 220 billable days per year after holidays and unpaid time off.',
        'Always clarify whether your rate is inclusive or exclusive of local sales tax (VAT/GST).',
      ],
      faq: [
        { q: 'Should I set up a business entity?', a: 'Thresholds vary by country. In Korea, VAT registration is required above ₩24M/year. Consult a local accountant.' },
        { q: 'Any tips for negotiating rates?', a: 'Quote slightly higher than your target to leave room for negotiation. After your first successful project, it becomes much easier to raise rates.' },
      ],
    },
  },

  /* ── GAMES ───────────────────────────────────────────────────── */

  'ladder-game': {
    ko: {
      when: '팀 발표 순서, 당번 배정, 업무 분담 등 공정한 랜덤 배정이 필요할 때 사다리 타기로 결정하세요.',
      tips: [
        '결과 공개 전 모두가 화면을 볼 수 있게 한 뒤 "전체 공개" 버튼을 누르면 긴장감이 높아집니다.',
        '참가자 이름을 실명 대신 "팀A", "팀B"로 입력하고 결과 항목에 실제 업무를 넣으면 공정성 논란이 없습니다.',
        '결과 카드에 마우스를 올리면 해당 경로가 강조 표시됩니다.',
      ],
      faq: [
        { q: '사다리 결과가 진짜 랜덤인가요?', a: '네, 매번 새로 생성 버튼을 클릭할 때마다 완전히 새로운 사다리가 무작위로 생성됩니다.' },
        { q: '인원을 몇 명까지 추가할 수 있나요?', a: '최대 6명까지 지원합니다.' },
      ],
    },
    en: {
      when: 'Use it for fair random assignment of presentation order, duties, or tasks in a team — the visual ladder makes the process transparent.',
      tips: [
        'Click "Reveal All" with everyone watching for maximum suspense.',
        'Use anonymous labels ("Team A", "Team B") for participants to avoid bias debates.',
        'Hover over result cards to highlight that participant\'s ladder path.',
      ],
      faq: [
        { q: 'Are the results truly random?', a: 'Yes. A completely new ladder is randomly generated every time you click "Generate".' },
        { q: 'How many people can participate?', a: 'Up to 6 participants are supported. For larger groups, use the Team Splitter tool.' },
      ],
    },
  },

  'roulette': {
    ko: {
      when: '점심 메뉴 결정, 발표자 선정, 이벤트 당첨자 추첨 등 재미있는 방식의 랜덤 선택이 필요할 때 사용합니다.',
      tips: [
        '참가자를 2~12명까지 추가할 수 있습니다.',
        '룰렛을 클릭하거나 "돌리기" 버튼으로 회전시킬 수 있습니다.',
        '회전 후 결과 당첨자를 제거하고 다시 돌리면 1등, 2등 순서로 추첨할 수 있습니다.',
      ],
      faq: [
        { q: '룰렛 결과가 조작될 수 있나요?', a: '아니요. 회전량과 멈추는 지점은 완전히 랜덤입니다.' },
        { q: '특정 항목에 확률 가중치를 줄 수 있나요?', a: '현재 버전에서는 모든 항목이 동일한 확률입니다. 가중치가 필요하면 같은 항목을 여러 번 추가하세요.' },
      ],
    },
    en: {
      when: 'Use it for fun random selection — picking today\'s lunch, choosing a presenter, or running a prize raffle.',
      tips: [
        'Add 2–12 participants. The more, the merrier (and smaller each slice).',
        'Click the wheel or the Spin button to start — both work.',
        'Remove the winner after each spin to draw 1st, 2nd, 3rd place in sequence.',
      ],
      faq: [
        { q: 'Can the results be manipulated?', a: 'No. The spin speed and stopping point are fully random — results cannot be predicted or fixed in advance.' },
        { q: 'Can I weight certain options to appear more often?', a: 'Not directly, but you can add the same item multiple times to increase its probability.' },
      ],
    },
  },

  'team-splitter': {
    ko: {
      when: '팀 프로젝트 조 편성, 스터디 그룹 나누기, 체육대회 팀 배정 등 여러 명을 균등하게 나눌 때 사용합니다.',
      tips: [
        '이름을 한 줄에 한 명씩 입력하세요. 복사해서 붙여넣기도 가능합니다.',
        '"다시 섞기"로 결과가 마음에 들 때까지 여러 번 시도할 수 있습니다.',
        '결과 복사 버튼으로 슬랙·카카오톡에 바로 공유할 수 있습니다.',
      ],
      faq: [
        { q: '팀 이름을 직접 지정할 수 있나요?', a: '현재는 팀 1, 팀 2 등으로 자동 지정됩니다. 결과를 복사한 후 직접 수정하세요.' },
        { q: '특정 사람이 같은 팀이 되도록 고정할 수 있나요?', a: '현재 버전에서는 완전 랜덤 배정만 지원합니다.' },
      ],
    },
    en: {
      when: 'Use it to randomly divide a group into balanced teams for projects, study groups, or sports events.',
      tips: [
        'Enter one name per line. You can paste a list directly from a spreadsheet or chat.',
        'Hit "Reshuffle" to regenerate teams until you get a split everyone is happy with.',
        'Use "Copy Result" to share the team assignments instantly in Slack or messaging apps.',
      ],
      faq: [
        { q: 'Can I rename the teams?', a: 'Teams are auto-labeled (Team 1, Team 2, etc.). Copy the result and rename manually if needed.' },
        { q: 'Can I force certain people onto the same team?', a: 'Not in the current version — assignments are fully random.' },
      ],
    },
  },

  'lunch-picker': {
    ko: {
      when: '"오늘 점심 뭐 먹지?" 고민을 해결합니다. 팀원들이 메뉴를 추가하고 공정하게 랜덤으로 선택하세요.',
      tips: [
        '자주 먹는 메뉴 목록을 만들어두고 원하지 않는 메뉴는 제거한 뒤 뽑으면 더 만족스럽습니다.',
        '"오늘은 이거 말고" 싶은 메뉴를 임시로 제거 후 뽑고, 다음 날 다시 추가할 수 있습니다.',
        '"메뉴 저장" 버튼으로 현재 메뉴 목록을 브라우저에 저장해 다음에도 사용할 수 있습니다.',
      ],
      faq: [
        { q: '메뉴가 저장되나요?', a: '"메뉴 저장" 버튼을 누르면 브라우저 로컬스토리지에 저장됩니다.' },
        { q: '팀 전체가 동시에 볼 수 있나요?', a: '링크를 공유하면 같은 화면이 표시되지만, 각자 독립적으로 뽑는 방식입니다.' },
      ],
    },
    en: {
      when: 'Solve the "what should we eat today?" dilemma. Add options and let the randomizer decide.',
      tips: [
        'Build your regular menu list. Remove anything you\'re not in the mood for before picking.',
        'Temporarily remove a recently visited spot, then add it back tomorrow.',
        'Hit "Save menu" to persist your list in the browser for next time.',
      ],
      faq: [
        { q: 'Is the menu saved between sessions?', a: 'Yes — click "Save menu" to store your current list in browser localStorage.' },
        { q: 'Can my whole team use the same list?', a: 'Sharing the URL shows the same page, but each person\'s saved list is stored locally in their own browser.' },
      ],
    },
  },

  'lucky-draw': {
    ko: {
      when: '경품 추첨, 이벤트 당첨자 선정, 회의 발표자 랜덤 선택 등 공정하고 투명한 추첨이 필요할 때 사용합니다.',
      tips: [
        '참가자 목록을 한 줄에 한 명씩 입력하거나 붙여넣기하세요.',
        '1등부터 순서대로 추첨하려면 당첨자를 목록에서 제거 후 다시 추첨하세요.',
        '추첨 화면을 프로젝터에 띄워 모두가 보는 앞에서 진행하면 공정성에 대한 신뢰도가 높아집니다.',
      ],
      faq: [
        { q: '이전 추첨 기록이 저장되나요?', a: '아니요. 페이지를 새로 고치면 초기화됩니다.' },
        { q: '동일 인원이 중복 당첨될 수 있나요?', a: '한 번에 여러 명을 추첨할 때는 중복 없이 당첨됩니다.' },
      ],
    },
    en: {
      when: 'Use it for prize raffles, event winner selection, or randomly picking a meeting presenter — fair and transparent.',
      tips: [
        'Enter one participant per line, or paste a list directly.',
        'For sequential prize draws (1st, 2nd, 3rd), remove each winner before drawing the next.',
        'Display on a projector so everyone can watch — it builds trust in the fairness of the draw.',
      ],
      faq: [
        { q: 'Are previous draw results saved?', a: 'No. Refreshing the page resets everything. Screenshot or copy results you want to keep.' },
        { q: 'Can the same person win twice?', a: 'Not in a single draw. But if you re-draw without removing the previous winner, they can win again.' },
      ],
    },
  },

  /* ── NEW TOOLS ──────────────────────────────────────────────── */

  'savings-calc': {
    ko: {
      when: '은행 예금·적금 상품에 가입하기 전 만기 수령액과 실제 이자를 미리 계산하고 싶을 때, 또는 단리와 복리 중 어느 쪽이 유리한지 비교하고 싶을 때 유용합니다.',
      tips: [
        '적금은 매월 일정 금액을 납입하고, 예금은 목돈을 한 번에 예치합니다. 금리가 같다면 예금이 더 많은 이자를 받습니다.',
        '복리는 이자에 이자가 붙으므로 장기일수록 단리보다 유리합니다.',
        '이자소득세(15.4%)가 자동으로 공제됩니다. 비과세 상품(ISA 등)은 세전 금액을 참고하세요.',
      ],
      faq: [
        { q: '적금 복리와 예금 복리는 왜 결과가 다른가요?', a: '예금은 원금 전체에 복리가 붙지만, 적금은 매달 납입금마다 남은 기간에 따라 복리가 달리 적용되어 실제 수익률이 낮습니다.' },
        { q: '비과세 상품이면 세금이 0인가요?', a: '비과세 적격 상품(ISA 등)은 이자에 세금을 내지 않습니다.' },
      ],
    },
    en: {
      when: 'Use it before signing up for a savings account or fixed deposit to calculate maturity amount and interest, or to compare simple vs compound interest.',
      tips: [
        'A lump-sum deposit earns more interest than installment savings at the same rate — because the full principal earns interest from day one.',
        'Compound interest snowballs over time. For short terms (under 1 year), the difference from simple interest is small.',
        'Interest income tax (15.4% in Korea) is automatically deducted. Tax-exempt accounts (ISA, etc.) — use the pre-tax figure.',
      ],
      faq: [
        { q: 'Why do installment savings and deposit savings give different results at the same rate?', a: 'Deposits earn compound interest on the full principal throughout. Installment payments each earn interest only for their remaining term, so effective yield is lower.' },
        { q: 'Are tax-exempt accounts truly 0% tax?', a: 'Yes — qualifying tax-exempt products like ISA pay no tax on interest. Reference the pre-tax maturity amount shown.' },
      ],
    },
  },

  'loan-calc': {
    ko: {
      when: '주택담보대출, 전세자금대출, 신용대출 등 대출 상품을 비교하거나, 월 납입액과 총 이자 부담을 미리 파악하고 싶을 때 사용하세요.',
      tips: [
        '원리금균등상환은 매달 납입액이 동일해 생활비 계획이 쉽습니다. 원금균등상환은 초기 납입액이 크지만 총 이자가 더 적습니다.',
        '"상환 일정 보기"를 눌러 회차별 원금·이자 내역을 확인할 수 있습니다.',
        '금리 0.5% 차이도 10년 이상 장기 대출에서 수백만 원 이상의 이자 차이를 만들 수 있습니다.',
      ],
      faq: [
        { q: '중도상환은 어떻게 계산하나요?', a: '이 계산기는 표준 상환 스케줄을 보여줍니다. 중도상환수수료(통상 0.5~1.5%)가 별도 발생할 수 있습니다.' },
        { q: '변동금리 대출도 계산할 수 있나요?', a: '현재는 고정금리 기준으로 계산됩니다. 변동금리는 초기 금리로 시뮬레이션 후 여유 자금을 확보하세요.' },
      ],
    },
    en: {
      when: 'Use it to compare mortgage, personal, or auto loan options — see the monthly payment, total interest, and full amortization schedule before committing.',
      tips: [
        'Equal installment (annuity): same payment every month — easy to budget. Equal principal: higher early payments but less total interest paid.',
        'Click "View repayment schedule" to see a month-by-month breakdown of principal vs interest.',
        'A 0.5% rate difference can mean hundreds (or thousands) of dollars more in interest over a 10+ year loan.',
      ],
      faq: [
        { q: 'How is early repayment handled?', a: 'This calculator shows the standard schedule. Early repayment typically incurs a prepayment penalty (usually 0.5–1.5% of the remaining balance).' },
        { q: 'Can I calculate variable-rate loans?', a: 'The calculator uses a fixed rate. For variable-rate loans, simulate with the initial rate and plan for payment changes when rates adjust.' },
      ],
    },
  },

  'unit-converter': {
    ko: {
      when: '해외 레시피의 재료 단위를 변환하거나, 해외 쇼핑몰의 사이즈·무게 단위가 헷갈릴 때, 또는 부동산 평수와 제곱미터를 변환할 때 활용하세요.',
      tips: [
        '상단 탭에서 카테고리(길이, 무게, 온도 등)를 먼저 선택하세요.',
        '⇌ 버튼으로 변환 방향을 바꿀 수 있습니다.',
        '부동산에서 자주 쓰이는 평(坪)은 넓이 카테고리에 있습니다. 1평 ≈ 3.3058 m²입니다.',
      ],
      faq: [
        { q: '온도 변환 공식은 어떻게 되나요?', a: '°C to °F: (°C × 9/5) + 32. °F to °C: (°F - 32) × 5/9. 켈빈(K) = °C + 273.15' },
        { q: '소수점이 너무 많이 나올 때는 어떻게 하나요?', a: '계산기는 유효숫자 8자리까지 표시합니다.' },
      ],
    },
    en: {
      when: 'Use it to convert units in foreign recipes, decode clothing/product sizes from overseas stores, or convert property area between square feet and square meters.',
      tips: [
        'Select a category (length, weight, temperature, etc.) from the tabs at the top first.',
        'Use the ⇌ swap button to instantly flip the conversion direction.',
        'The Korean "pyeong" unit (평) is in the Area category — 1 pyeong ≈ 3.306 m².',
      ],
      faq: [
        { q: 'What\'s the temperature conversion formula?', a: '°C to °F: multiply by 9/5 then add 32. °F to °C: subtract 32 then multiply by 5/9. Kelvin = °C + 273.15.' },
        { q: 'The result has too many decimal places — what do I do?', a: 'The calculator shows up to 8 significant figures. Round to however many decimal places are practical for your use case.' },
      ],
    },
  },

  'basic-calculator': {
    ko: {
      when: '스마트폰 계산기를 대신해 PC 브라우저에서 간단한 사칙연산이 필요할 때, 또는 계산 기록을 남겨두고 싶을 때 사용하세요.',
      tips: [
        '오른쪽 "계산 기록" 패널에 최근 10개의 계산식이 자동으로 저장됩니다.',
        'AC는 모든 상태를 초기화하고, C는 현재 입력값만 초기화합니다.',
        '% 버튼은 현재 숫자를 100으로 나누어 할인율 계산 등에 편리합니다.',
      ],
      faq: [
        { q: '0으로 나누면 어떻게 되나요?', a: '"Error"로 표시되고 계산 결과는 0으로 초기화됩니다.' },
        { q: '키보드로 입력할 수 있나요?', a: '현재 버전은 마우스/터치 입력만 지원합니다.' },
      ],
    },
    en: {
      when: 'Use it as a quick browser-based calculator when your phone isn\'t handy — with the bonus of a calculation history panel.',
      tips: [
        'The right panel automatically saves your last 10 calculations for easy reference.',
        'AC clears everything; C clears only the current entry.',
        'The % button divides the current number by 100 — handy for discount and tip calculations.',
      ],
      faq: [
        { q: 'What happens if I divide by zero?', a: 'It displays "Error" and resets the result to 0.' },
        { q: 'Can I use keyboard input?', a: 'The current version supports mouse and touch input only. Keyboard support is planned for a future update.' },
      ],
    },
  },
};
