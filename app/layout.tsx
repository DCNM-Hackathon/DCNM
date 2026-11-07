import type { Metadata } from "next";
import Header from "@/components/header";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "DC&M — 함께 만드는 새로운 가능성", template: "%s | DC&M" },
  description:
    "Digital Contents & Multimedia. 디자인, 영상, 개발, 3D로 아이디어를 현실로 만드는 동아리 DC&M입니다.",
};
// 저장된 선택 → 없으면 기기(시스템) 설정 순으로 테마 결정
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 화면이 그려지기 전에 테마를 적용해 깜빡임 방지 */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          본문으로 바로가기
        </a>
        <Header />
        <main id="main">{children}</main>
        <footer>
          <div className="container footer-inner">
            <div>
              <a href="/" className="footer-brand">
                DC&M
              </a>
              <p>Digital Contents & Multimedia</p>
              <p>다양한 시선이 만나, 새로운 가능성이 됩니다.</p>
            </div>
            <small>
              © {new Date().getFullYear()} DC&M. All rights reserved.
            </small>
          </div>
        </footer>
      </body>
    </html>
  );
}