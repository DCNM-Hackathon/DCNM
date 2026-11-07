"use client";
import { useState } from "react";
import { members, tracks } from "@/lib/data";
export default function Members() {
  const [filter, setFilter] = useState("전체");
  const shown = members.filter((m) => filter === "전체" || m[2] === filter);
  return (
    <>
      <div className="list-heading">
        <div>
          <h2>멤버</h2>
          <p>
            <strong>{shown.length}명</strong>의 멤버를 만나 보세요.
          </p>
        </div>
        <div className="filters" role="group" aria-label="전공 트랙 필터">
          {["전체", ...tracks].map((t) => (
            <button
              key={t}
              aria-pressed={filter === t}
              onClick={() => setFilter(t)}
              className={filter === t ? "selected" : ""}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="member-grid" aria-live="polite">
        {shown.map((m) => (
          <article className="member-card" key={m[0]}>
            <div className="member-top">
              <span className="avatar">{m[0][0]}</span>
              <div>
                <h3>{m[0]}</h3>
                <small>
                  {m[1]}학번 · {m[2]}
                </small>
              </div>
            </div>
            <p>{m[3]}</p>
            <div className="tags">
              {m[4].split(",").map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
