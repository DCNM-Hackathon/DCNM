import { Box, Code2, PenTool, Video, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { trackInfo } from "@/lib/data";
export function SectionTitle({
  tag,
  title,
  description,
}: {
  tag: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-title">
      <span className="eyebrow">{tag}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function TrackCards() {
  const icons = [PenTool, Video, Code2, Box];
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {trackInfo.map((t, i) => {
        const Icon = icons[i];
        return (
          <article className="track-card" key={t.name}>
            <Icon size={29} />
            <h3>{t.name}</h3>
            <p>{t.description}</p>
            <small>{t.tools}</small>
          </article>
        );
      })}
    </div>
  );
}
export function JoinBanner({ project = false }: { project?: boolean }) {
  return (
    <section className={`join-banner ${project ? "project-join" : ""}`}>
      <div className="container flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2>
            {project
              ? "만들고 싶은 프로젝트가 있나요?"
              : "다음 기수의 멤버를 기다립니다"}
          </h2>
          <p>
            {project
              ? "아이디어를 나누고 함께할 팀원을 만나 보세요."
              : "전공과 경험에 상관없이, 만들고 싶은 것이 있다면 누구나 환영해요."}
          </p>
        </div>
        <Link className="button white" href="/apply">
          동아리 지원하기 <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
export function PageHero({
  breadcrumb,
  tag,
  title,
  description,
  children,
}: {
  breadcrumb: string;
  tag: string;
  title: React.ReactNode;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="breadcrumb">
          Home <span>›</span> {breadcrumb}
        </p>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="eyebrow">{tag}</span>
            <h1>{title}</h1>
            <p className="hero-description">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
