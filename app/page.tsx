import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Users,
  Code2,
  Lightbulb,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import type { CSSProperties } from "react";
import { SectionTitle } from "@/components/ui";
import ScrollReveal from "@/components/ScrollReveal";
import Logo from "@/components/logo";

// 카드가 순서대로 하나씩 올라오도록 지연 시간 지정
const delay = (i: number) =>
  ({ "--reveal-delay": `${i * 110}ms` }) as CSSProperties;
const values = [
  {
    icon: Users,
    title: "함께 성장",
    text: "서로 배우고 나누며\n함께 성장하는 문화를\n지향합니다.",
  },
  {
    icon: Code2,
    title: "실무 중심",
    text: "실제 서비스를 개발하며\n문제 해결 능력을\n키워 나갑니다.",
  },
  {
    icon: Lightbulb,
    title: "자유로운 아이디어",
    text: "다양한 아이디어를 존중하고\n새로운 시도를\n지원합니다.",
  },
  {
    icon: Trophy,
    title: "도전과 성취",
    text: "끊임없는 도전을 통해\n성취감을 느끼고\n더 나은 내일을 만듭니다.",
  },
];
const activities = [
  {
    title: "스터디",
    sub: "LEARN TOGETHER",
    image: "photo-1515879218367-8466d910aaa4",
    text: "디자인, 영상, 개발, 3D까지. 관심 있는 분야를 함께 깊이 탐구합니다.",
  },
  {
    title: "프로젝트",
    sub: "BUILD SOMETHING",
    image: "photo-1522071820081-009f0129c71c",
    text: "서로 다른 전공과 시선이 만나 아이디어를 실제 결과물로 구현합니다.",
  },
  {
    title: "세미나 & 특강",
    sub: "SHARE & INSPIRE",
    image: "photo-1540575467063-178a50c2df87",
    text: "새로운 기술과 실무 경험을 나누며 더 넓은 세상을 만납니다.",
  },
];
export default function Home() {
  return (
    <>
      <ScrollReveal />
      <section className="home-hero">
        <div className="hero-grid" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-kicker">
              <span /> DIGITAL CONTENTS & MULTIMEDIA
            </span>
            <h1>
              함께 만들고,
              <br />
              가능성을 <span>구현하다</span>
              <span className="title-period">.</span>
            </h1>
            <p>
              다양한 시선, 하나의 가능성.
              <br />
              아이디어를 현실로 만드는 동아리 <strong>DC&M</strong>입니다.
            </p>
            <div className="hero-actions">
              <Link href="#about" className="button">
                동아리 소개
              </Link>
              <Link href="/apply" className="button button-outline">
                지원하기
              </Link>
            </div>
            <div className="hero-footnote">
              <span>DESIGN</span>
              <i /> VIDEO <i /> DEVELOPMENT <i /> 3D
            </div>
          </div>
          <div className="hero-art" aria-label="DC&M 동아리 로고">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="logo-disc">
              <Logo
                width={260}
                height={290}
                label="DC&M 로고"
                gradientId="logo-hero"
              />
            </div>
            <div className="floating-tag tag-code">
              <Code2 size={23} />
              <span>IDEA TO REALITY</span>
            </div>
            <div className="floating-tag tag-create">
              <span className="teal-dot" /> LET’S CREATE TOGETHER
            </div>
            <span className="art-number">01 / INFINITE POSSIBILITIES</span>
          </div>
        </div>
        <a className="scroll-hint" href="#about">
          <ArrowDown size={17} /> SCROLL TO EXPLORE
        </a>
      </section>
      <section id="about" className="section">
        <div className="container">
          <div data-reveal>
            <SectionTitle
              tag="ABOUT US"
              title="서로 다른 우리가, 함께 만드는 내일"
              description="다양한 기술을 학습하고 실제 프로젝트를 통해 성장합니다. 누구나 자유롭게 아이디어를 제안하고, 함께 만들어 갑니다."
            />
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <article key={v.title} data-reveal style={delay(i)}>
                <v.icon size={36} strokeWidth={1.5} />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="activities" className="section soft-bg">
        <div className="container">
          <div data-reveal>
            <SectionTitle
              tag="OUR ACTIVITIES"
              title="배움을 넘어, 경험으로"
              description="작은 호기심이 새로운 도전이 되는 곳. 우리는 이렇게 함께합니다."
            />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {activities.map((a, i) => (
              <article
                className="activity-card"
                key={a.title}
                data-reveal
                style={delay(i)}
              >
                <div
                  className="activity-image"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/${a.image}?auto=format&fit=crop&w=900&q=85)`,
                  }}
                >
                  <span>0{i + 1}</span>
                </div>
                <div className="activity-content">
                  <small>{a.sub}</small>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section home-projects">
        <div className="container">
          <div className="section-heading-row" data-reveal>
            <div>
              <span className="eyebrow">MADE BY DC&M</span>
              <h2>우리가 만든 결과물</h2>
              <p>생각에 머무르지 않고, 세상에 선보입니다.</p>
            </div>
            <Link className="text-link" href="/projects">
              모든 프로젝트 보기 <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "DC&M 아카이브",
                label: "DIGITAL ARCHIVE",
                class: "archive-preview",
                desc: "우리의 기록이 모여 하나의 이야기가 되는 곳",
                tech: "React · Figma",
              },
              {
                name: "Lumen VR",
                label: "BEYOND THE SCREEN",
                class: "lumen-preview",
                desc: "화면 너머에서 만나는 새로운 전시 경험",
                tech: "Unity · Blender",
              },
              {
                name: "Pixel Runner",
                label: "PLAY YOUR CAMPUS",
                class: "pixel-preview",
                desc: "익숙한 캠퍼스에서 시작되는 색다른 모험",
                tech: "Unity · Aseprite",
              },
            ].map((p, i) => (
              <div key={p.name} data-reveal style={delay(i)}>
                <Link href="/projects" className="showcase-card">
                  <div className={`showcase-image ${p.class}`}>
                    <small>{p.label}</small>
                    <strong>
                      {p.name === "Lumen VR"
                        ? "LUMEN"
                        : p.name === "Pixel Runner"
                          ? "PIXEL\nRUNNER"
                          : "DC&M\nARCHIVE"}
                    </strong>
                    <ArrowUpRight size={25} />
                  </div>
                  <div className="showcase-content">
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <small>{p.tech}</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <p className="demo-caption">
            프로젝트는 디자인 확인을 위한 예시입니다.
          </p>
        </div>
      </section>
      <section className="home-end">
        <div className="container" data-reveal>
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h2>
            당신의 가능성도
            <br />
            이곳에서 시작됩니다.
          </h2>
          <Link href="/apply" className="button">
            DC&M과 함께하기
          </Link>
        </div>
      </section>
    </>
  );
}