"use client";

import { useEffect, useRef } from "react";

/** 0~1 사이로 자르기 */
const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** 모션 줄이기 설정을 켠 사용자인지 */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 스크롤할 때마다 (requestAnimationFrame으로 묶어서) callback을 실행.
 * 스크롤 이벤트마다 레이아웃을 계산하지 않도록 프레임당 1번만 돌립니다.
 */
function useScrollFrame(callback: () => void) {
  const cb = useRef(callback);
  cb.current = callback;

  useEffect(() => {
    let frame = 0;
    const run = () => {
      frame = 0;
      cb.current();
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);
}

/* -------------------------------------------------------------------------- */
/* 히어로 스크롤 장면                                                             */
/*  히어로가 화면에 고정된 동안 스크롤 진행도(0→1)에 따라                           */
/*  ① 제목 단어가 하나씩 채워지고 ② 설명·버튼이 나타나고 ③ 로고가 회전합니다.         */
/*  마크업은 app/page.tsx 의 .hero-scene / .hero-word 를 사용합니다.               */
/* -------------------------------------------------------------------------- */
export function HeroScene() {
  useScrollFrame(() => {
    const scene = document.querySelector<HTMLElement>(".hero-scene");
    const sticky = scene?.querySelector<HTMLElement>(".hero-sticky");
    if (!scene || !sticky) return;
    const words = scene.querySelectorAll<HTMLElement>(".hero-word");

    // 장면이 고정되어 있는 동안 0 → 1
    const scrollable = scene.offsetHeight - sticky.offsetHeight;
    const progress =
      prefersReducedMotion() || window.matchMedia("(max-width: 767px)").matches
        ? 1
        : clamp(-scene.getBoundingClientRect().top / Math.max(scrollable, 1));

    // ① 첫 단어는 처음부터 채워져 있고, 0 ~ 55% 구간에서 나머지가 순서대로 채워짐
    const filled = 1 + clamp(progress / 0.55) * (words.length - 1);
    words.forEach((el, i) => {
      el.style.setProperty("--fill", clamp(filled - i).toFixed(3));
    });

    // ② 55% ~ 80% 구간에서 설명·버튼·태그가 올라옴
    const rest = clamp((progress - 0.55) / 0.25);
    scene.style.setProperty("--rest", rest.toFixed(3));
    scene.classList.toggle("rest-shown", rest > 0.6);

    // ③ 로고 회전, 진행 바, 스크롤 안내 문구
    scene.style.setProperty("--hero-progress", progress.toFixed(4));
  });
  return null;
}
