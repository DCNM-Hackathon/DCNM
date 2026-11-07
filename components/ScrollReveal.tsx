"use client";

import { useEffect } from "react";

/**
 * data-reveal 속성이 붙은 요소가 화면에 들어오면 .is-visible 클래스를 붙여
 * 아래에서 위로 떠오르는 등장 애니메이션을 실행합니다.
 * 화면 밖으로 완전히 나가면 클래스를 떼서, 다시 스크롤할 때마다 애니메이션이 반복됩니다.
 * JS가 실행되기 전에는 요소가 숨겨지지 않도록 <html>에 .reveal-ready 를 붙인 뒤에만 동작합니다.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.15) {
            // 15% 이상 보이면 등장
            entry.target.classList.add("is-visible");
          } else if (!entry.isIntersecting) {
            // 화면 밖으로 완전히 나가면 초기화 → 다시 들어올 때 애니메이션 재생
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: [0, 0.15] },
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}