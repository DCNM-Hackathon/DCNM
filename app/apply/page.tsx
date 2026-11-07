import Link from "next/link";
import { ArrowDown, Check, ChevronDown } from "lucide-react";
import { PageHero, SectionTitle, TrackCards } from "@/components/ui";
import ApplicationForm from "@/components/application-form";
export const metadata = { title: "지원하기" };
export default function ApplyPage() {
  return (
    <>
      <PageHero
        breadcrumb="Recruit"
        tag="JOIN OUR NEXT CHAPTER"
        title={
          <>
            당신의 아이디어가
            <br />
            시작되는 곳, DC&M
          </>
        }
        description="디지털 콘텐츠와 멀티미디어에 관심 있는 누구나 지원할 수 있어요. 실력보다 만들고 싶은 마음이 더 중요합니다."
      >
        <div className="recruit-info">
          <div className="flex items-center justify-between">
            <h3>모집 안내</h3>
            <span className="pill">일정 안내 예정</span>
          </div>
          <dl>
            <div>
              <dt>모집 대상</dt>
              <dd>재학생 누구나 · 전공 무관</dd>
            </div>
            <div>
              <dt>모집 분야</dt>
              <dd>디자인 / 영상 / 개발 / 3D</dd>
            </div>
            <div>
              <dt>모집 일정</dt>
              <dd>확정 후 안내 예정</dd>
            </div>
            <div>
              <dt>정기 모임</dt>
              <dd>학기별 별도 공지</dd>
            </div>
          </dl>
          <a className="text-link" href="#application">
            지원서 작성하기 <ArrowDown size={15} />
          </a>
        </div>
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionTitle
            tag="FIND YOUR TRACK"
            title="어떤 가능성을 만들고 싶나요?"
            description="관심 있는 분야를 하나 선택해 지원해 주세요. 활동 중 다른 파트 스터디에도 참여할 수 있어요."
          />
          <TrackCards />
          <div className="process-section">
            <SectionTitle tag="OUR PROCESS" title="함께하기까지, 네 걸음" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["온라인 지원", "당신의 관심과 이야기를 들려주세요."],
                ["서류 검토", "지원서를 꼼꼼하게 읽어 봅니다."],
                ["인터뷰", "만들고 싶은 것들을 함께 이야기해요."],
                ["최종 합류", "새로운 동료들과 여정을 시작해요."],
              ].map((s, i) => (
                <div
                  className={`process-card ${i === 3 ? "last" : ""}`}
                  key={s[0]}
                >
                  <small>STEP 0{i + 1}</small>
                  <h3>{s[0]}</h3>
                  <p>{s[1]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section soft-bg" id="application">
        <div className="container application-layout">
          <aside>
            <span className="eyebrow">APPLICATION</span>
            <h2>지원서 작성</h2>
            <p>
              당신의 새로운 시작을 기다립니다.
              <br />
              모든 필수 항목을 작성해 주세요.
            </p>
            <div className="application-notice">
              <h3>지원 전 확인해 주세요</h3>
              {[
                "정기 모임에 꾸준히 참여할 수 있나요?",
                "포트폴리오는 선택이에요. 없어도 괜찮습니다.",
                "제출 전 연락처와 이메일을 확인해 주세요.",
              ].map((t) => (
                <p key={t}>
                  <Check size={17} />
                  {t}
                </p>
              ))}
            </div>
          </aside>
          <ApplicationForm />
        </div>
      </section>
      <section className="section">
        <div className="container faq-container">
          <SectionTitle tag="FAQ" title="자주 묻는 질문" />
          {[
            [
              "관련 전공이 아니어도 지원할 수 있나요?",
              "네, 전공과 관계없이 지원할 수 있어요. 파트별 기초 스터디가 있어 처음 시작하는 분도 함께 성장할 수 있습니다.",
            ],
            [
              "포트폴리오가 꼭 필요한가요?",
              "필수 항목이 아닙니다. 경험이 있다면 자유롭게 공유해 주세요. 경험보다 배우고 만들려는 마음을 중요하게 생각합니다.",
            ],
            [
              "회비가 있나요?",
              "회비와 사용 계획은 모집 안내가 확정되면 함께 공지합니다.",
            ],
            [
              "활동 중에 파트를 바꿀 수 있나요?",
              "다른 파트 스터디 참여와 협업이 가능합니다. 파트 변경은 운영진과 상의해 주세요.",
            ],
          ].map(([q, a], i) => (
            <details className="faq" key={q} open={i === 0}>
              <summary>
                <span>
                  <b>Q.</b> {q}
                </span>
                <ChevronDown size={17} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
          <p className="faq-bottom">
            우리가 어떤 활동을 하는지 궁금하다면{" "}
            <Link href="/#activities">활동 소개</Link>를 확인해 주세요.
          </p>
        </div>
      </section>
    </>
  );
}
