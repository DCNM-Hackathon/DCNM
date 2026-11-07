"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

/**
 * 라이트/다크 모드 전환 버튼.
 * - 처음 방문: 기기(시스템) 설정을 따름 (layout.tsx의 인라인 스크립트가 먼저 적용)
 * - 버튼을 누르면 선택을 localStorage에 저장해 다음 방문에도 유지
 * - 아이콘은 CSS로 전환해서 서버/클라이언트 렌더링 불일치가 없음
 */
export default function ThemeToggle() {
  useEffect(() => {
    // 사용자가 직접 고른 적이 없으면 시스템 설정 변경을 실시간으로 따라감
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(STORAGE_KEY);
      } catch {}
      if (!saved) applyTheme(e.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="라이트/다크 모드 전환"
      title="라이트/다크 모드 전환"
    >
      <Moon className="icon-moon" size={17} />
      <Sun className="icon-sun" size={17} />
    </button>
  );
}
