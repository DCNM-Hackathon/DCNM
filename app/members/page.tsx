import {
  PageHero,
  SectionTitle,
  TrackCards,
  JoinBanner,
} from "@/components/ui";
import Members from "@/components/members";
export const metadata = { title: "멤버 소개" };
export default function MembersPage() {
  return (
    <>
      <PageHero
        breadcrumb="Members"
        tag="OUR MEMBERS"
        title="함께 만드는 사람들"
        description="디자인, 영상, 개발, 3D — 서로 다른 관심사를 가진 사람들이 모여 하나의 디지털 콘텐츠를 완성합니다."
      >
        <div className="stats">
          <div>
            <small>우리를 연결하는</small>
            <strong>하나의 열정</strong>
          </div>
          <div>
            <small>활동 파트</small>
            <strong>4개 트랙</strong>
          </div>
        </div>
      </PageHero>
      <section className="section">
        <div className="container">
          <p className="sample-note">
            아래 멤버와 운영진 정보는 예시 데이터입니다.
          </p>
          <SectionTitle
            tag="EXECUTIVES"
            title="운영진"
            description="동아리의 방향을 함께 고민하고 활동을 이끄는 사람들입니다."
          />
          <div className="executives-grid">
            {[
              [
                "회장",
                "김OO",
                "22학번 · 기획",
                "동아리 운영과 연간 프로젝트 기획을 맡고 있어요.",
              ],
              [
                "부회장",
                "이OO",
                "22학번 · 디자인",
                "파트 간 협업과 전시 디자인을 총괄합니다.",
              ],
              [
                "총무",
                "박OO",
                "23학번 · 개발",
                "예산과 장비 관리, 회의 일정을 챙깁니다.",
              ],
              [
                "홍보",
                "최OO",
                "23학번 · 영상",
                "동아리 소식과 리크루팅 콘텐츠를 만듭니다.",
              ],
            ].map((m) => (
              <article className="executive" key={m[0]}>
                <div className="executive-cover">
                  <span className="role-tag">{m[0]}</span>
                  <span className="avatar">{m[1][0]}</span>
                </div>
                <div className="executive-content">
                  <h3>
                    {m[1]} <small>{m[2]}</small>
                  </h3>
                  <p>{m[3]}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="members-list">
            <Members />
          </div>
        </div>
      </section>
      <section className="section soft-bg">
        <div className="container">
          <SectionTitle
            tag="OUR TRACKS"
            title="파트 소개"
            description="파트별로 스터디를 진행하고, 프로젝트에서는 파트를 넘나들며 협업합니다."
          />
          <TrackCards />
        </div>
      </section>
      <JoinBanner />
    </>
  );
}
