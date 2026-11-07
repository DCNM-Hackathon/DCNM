"use client";
import { useRef, useState } from "react";
import { ArrowRight, Users, X } from "lucide-react";
import Link from "next/link";
import { projects, stages } from "@/lib/data";
export function Progress({ stage }: { stage: number }) {
  return (
    <div className="progress" aria-label={`진행 단계: ${stages[stage - 1]}`}>
      {stages.map((s, i) => (
        <span key={s} className={i < stage ? "filled" : ""} />
      ))}
    </div>
  );
}
export default function Projects() {
  const [filter, setFilter] = useState("전체");
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(
    null,
  );
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="list-heading">
        <div>
          <h2>진행 중 프로젝트</h2>
          <p>
            <strong>
              {
                projects.filter(
                  (p) => filter === "전체" || p.category === filter,
                ).length
              }
              개
            </strong>
            의 예시 프로젝트를 살펴보세요.
          </p>
        </div>
        <div className="filters" role="group" aria-label="프로젝트 분야 필터">
          {["전체", "미디어아트", "게임", "영상", "웹 · 앱"].map((t) => (
            <button
              key={t}
              aria-pressed={filter === t}
              className={filter === t ? "selected" : ""}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="projects-grid" aria-live="polite">
        {projects
          .filter((p) => filter === "전체" || p.category === filter)
          .map((p) => (
            <button
              className="project-card"
              key={p.id}
              onClick={() => {
                setSelected(p);
                dialog.current?.showModal();
              }}
              aria-label={`${p.title} 상세 보기`}
            >
              <div className={`project-cover ${p.color}`}>
                <small>{p.eyebrow}</small>
                <strong>{p.cover}</strong>
                <ArrowRight size={20} />
              </div>
              <div className="project-content">
                <div className="flex gap-2">
                  <span className="pill">{p.category}</span>
                  {p.recruit && (
                    <span className="pill orange">팀원 모집 중</span>
                  )}
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="stage-label">
                  <span>진행 단계</span>
                  <strong>{stages[p.stage - 1]}</strong>
                </div>
                <Progress stage={p.stage} />
                <div className="project-meta">
                  <span>{p.tools}</span>
                  <span>
                    <Users size={14} />
                    {p.team}명
                  </span>
                </div>
              </div>
            </button>
          ))}
      </div>
      <dialog
        ref={dialog}
        className="project-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <>
            <button
              className="dialog-close"
              aria-label="상세 닫기"
              onClick={() => dialog.current?.close()}
            >
              <X />
            </button>
            <span className="eyebrow">PROJECT OVERVIEW</span>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <dl>
              <div>
                <dt>분야</dt>
                <dd>{selected.category}</dd>
              </div>
              <div>
                <dt>사용 도구</dt>
                <dd>{selected.tools}</dd>
              </div>
              <div>
                <dt>참여 인원</dt>
                <dd>{selected.team}명</dd>
              </div>
              <div>
                <dt>진행 단계</dt>
                <dd>{stages[selected.stage - 1]}</dd>
              </div>
            </dl>
            <p className="sample-note">
              실제 프로젝트 등록 전 예시 상세 정보입니다.
            </p>
            {selected.recruit && (
              <Link href="/apply" className="button">
                동아리 지원하기 <ArrowRight size={16} />
              </Link>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
