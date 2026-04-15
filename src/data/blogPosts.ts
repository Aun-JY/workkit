export interface BlogPost {
  slug: string;
  title: string;
  desc: string;
  date: string;
  tags: string[];
  readingTime: number;
  thumbnail: string;
  category: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'floating-button',
    title: '플로팅 버튼 완벽 가이드 + 4가지 스타일 샘플 코드',
    desc: 'AI 채팅, 고객지원, 사이버펑크, 귀여운 스타일까지 — 바로 복사해서 쓸 수 있는 플로팅 버튼 4종 모음',
    date: '2025-01-15',
    tags: ['UI', 'CSS', 'JavaScript', '플로팅 버튼', '프론트엔드'],
    readingTime: 10,
    thumbnail: '💬',
    category: 'UI 컴포넌트',
  },
];
