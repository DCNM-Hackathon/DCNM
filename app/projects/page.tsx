import Link from "next/link";
import { PageHero, JoinBanner } from "@/components/ui";
import Projects, { StatusBadge } from "@/components/projects";
import { ArrowUpRight } from "lucide-react";
import type { ProjectStatus } from "@/lib/data";
export const metadata = { title: "프로젝트" };

// "진행 중" | "진행 완료"
const featuredStatus: ProjectStatus = "진행 중";

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        breadcrumb="Projects"
        tag="NOW IN PROGRESS"
        title="지금 만들고 있는 것들"
        description="서로 다른 아이디어가 하나의 결과물이 되기까지. 진행 상태와 참여 멤버를 살펴보고, 함께할 프로젝트를 찾아보세요."
      />
      <section className="section">
        <div className="container">
          <p className="sample-note">
            프로젝트 내용, 진행 상태와 참여 인원은 디자인 확인용 예시입니다.
          </p>
          <article className="featured-project">
            <div className="featured-art">
              <span className="featured-label">FEATURED PROJECT</span>
              <div className="garden-rings" />
              <div>
                <small>INTERACTIVE MEDIA ART</small>
                <h2>
                  GARDEN
                  <br />
                  OF LIGHT<span>.</span>
                </h2>
              </div>
            </div>
            <div className="featured-content">
              <div className="flex gap-2">
                <span className="pill">미디어아트</span>
                <StatusBadge status={featuredStatus} />
                <span className="pill orange">팀원 모집 중</span>
              </div>
              <h2>빛의 정원 — 인터랙티브 미디어아트 전시</h2>
              <p>
                관람객의 움직임에 반응해 빛과 소리가 피어나는 공간형 전시입니다.
                함께 새로운 감각을 만들어 갑니다.
              </p>
              <dl>
                <div>
                  <dt>사용 도구</dt>
                  <dd>TouchDesigner · Blender · Arduino</dd>
                </div>
                <div>
                  <dt>참여 인원</dt>
                  <dd>6명 · 디자인 / 개발 / 3D</dd>
                </div>
              </dl>
              <Link className="button" href="/apply">
                함께 만들기 <ArrowUpRight size={17} />
              </Link>
            </div>
          </article>
          <Projects />
        </div>
      </section>
      <JoinBanner project />
    </>
  );
}