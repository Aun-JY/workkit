import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — WorkKit` : 'WorkKit — 직장인 도구 모음';
    return () => {
      document.title = prev;
    };
  }, [title]);
};
