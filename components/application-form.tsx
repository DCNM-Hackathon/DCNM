"use client";
import { useState } from "react";
import { CheckCircle2, LoaderCircle, ArrowRight } from "lucide-react";
import { applicationSchema } from "@/lib/application";
import { tracks } from "@/lib/data";
export default function ApplicationForm() {
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {},
  );
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [length, setLength] = useState(0);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setStatus("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      ...Object.fromEntries(data),
      consent: data.get("consent") === "on",
    };
    const parsed = applicationSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      const first = parsed.error.issues[0]?.path[0];
      (form.elements.namedItem(String(first)) as HTMLElement)?.focus?.();
      setStatus("입력 내용을 확인해 주세요.");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = await res.json();
      if (!res.ok) {
        setErrors(result.errors || {});
        setStatus(result.message || "접수에 실패했습니다. 다시 시도해 주세요.");
        return;
      }
      setSuccess(true);
      setStatus(result.message);
    } catch {
      setStatus("네트워크 연결을 확인한 후 다시 시도해 주세요.");
    } finally {
      setPending(false);
    }
  }
  const field = (
    name: string,
    label: string,
    placeholder: string,
    type = "text",
    extra = {},
  ) => (
    <div className="form-field">
      <label htmlFor={name}>
        {label} <span>*</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...extra}
      />
      {errors[name] && (
        <small className="field-error" id={`${name}-error`}>
          {errors[name]?.[0]}
        </small>
      )}
    </div>
  );
  if (success)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={48} />
        <h2>지원이 완료되었습니다!</h2>
        <p>{status}</p>
        <p>선발 안내는 작성하신 연락처로 전달됩니다.</p>
      </div>
    );
  return (
    <form className="application-form" noValidate onSubmit={submit}>
      <fieldset disabled={pending}>
        <legend className="sr-only">동아리 지원서</legend>
        <div className="grid gap-5 sm:grid-cols-3">
          {field("name", "이름", "홍길동", "text", {
            autoComplete: "name",
            maxLength: 30,
          })}
          {field("studentId", "학번", "예: 20260001", "text", {
            inputMode: "numeric",
            maxLength: 10,
          })}
          {field("department", "학과", "소속 학과", "text", { maxLength: 60 })}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {field("phone", "연락처", "010-0000-0000", "tel", {
            autoComplete: "tel",
          })}
          {field("email", "이메일", "name@example.com", "email", {
            autoComplete: "email",
          })}
        </div>
        <fieldset className="track-choices">
          <legend>
            지원 분야 <span>*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {tracks.map((t) => (
              <label key={t}>
                <input type="radio" name="track" value={t} required />
                {t}
              </label>
            ))}
          </div>
          {errors.track && (
            <small className="field-error">{errors.track[0]}</small>
          )}
        </fieldset>
        <div className="form-field">
          <div className="flex justify-between">
            <label htmlFor="motivation">
              지원 동기 <span>*</span>
            </label>
            <small>{length} / 500</small>
          </div>
          <textarea
            id="motivation"
            name="motivation"
            placeholder="DC&M에서 만들어 보고 싶은 콘텐츠와 지원하게 된 이유를 자유롭게 적어 주세요. (20자 이상, 500자 이하)"
            rows={6}
            maxLength={500}
            required
            onChange={(e) => setLength(e.target.value.length)}
            aria-invalid={!!errors.motivation}
            aria-describedby="motivation-error"
          />
          <small id="motivation-error" className="field-error">
            {errors.motivation?.[0]}
          </small>
        </div>
        <div className="form-field">
          <label htmlFor="portfolio">
            포트폴리오 링크 <small>(선택)</small>
          </label>
          <input
            id="portfolio"
            name="portfolio"
            type="url"
            placeholder="https://github.com/your-name"
            maxLength={500}
            aria-invalid={!!errors.portfolio}
          />
          {errors.portfolio && (
            <small className="field-error">{errors.portfolio[0]}</small>
          )}
        </div>
        <div className="honeypot" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="consent">
          <input type="checkbox" name="consent" required />{" "}
          <span>
            개인정보 수집 및 이용에 동의합니다.
            <small>
              이름, 학번, 학과, 연락처, 이메일, 지원 내용은 선발 목적으로만
              사용되며 모집 종료 후 파기됩니다.
            </small>
          </span>
        </label>
        {errors.consent && <p className="field-error">{errors.consent[0]}</p>}
        <button
          className="button submit-button"
          type="submit"
          disabled={pending}
        >
          {pending ? (
            <>
              <LoaderCircle className="animate-spin" size={18} />
              접수 중...
            </>
          ) : (
            <>
              지원서 제출하기 <ArrowRight size={17} />
            </>
          )}
        </button>
        {status && (
          <p className="form-message" role="alert">
            {status}
          </p>
        )}
      </fieldset>
    </form>
  );
}
