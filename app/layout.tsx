import type { Metadata } from "next";
import Header from "@/components/header";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "DC&M — 함께 만드는 새로운 가능성", template: "%s | DC&M" },
  description:
    "Digital Contents & Multimedia. 디자인, 영상, 개발, 3D로 아이디어를 현실로 만드는 동아리 DC&M입니다.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
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
