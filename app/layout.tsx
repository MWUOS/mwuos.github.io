import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import L from "@/components/L";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { site, siteSummary } from "@/lib/content";
import { LANG_INIT_SCRIPT } from "@/lib/lang";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * tagline이 아직 미확정이면 소속 정보로 대체한다.
 * 화면에는 TODO를 그대로 보여주되(§4-2), 검색 결과에 노출되는 설명에는 넣지 않는다.
 */
const description =
  siteSummary() ??
  `${site.name} (${site.shortName}) at the ${site.department.en}, ${site.university.en}.`;

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.university.en}`,
    template: `%s — ${site.shortName}`,
  },
  description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-lang·lang은 아래 스크립트와 헤더의 전환 버튼이 바꾼다. React가 그 차이를 경고하지 않게 한다.
    <html
      lang="en"
      data-lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* 저장된 언어를 첫 페인트 전에 적용한다 (lib/lang.ts) */}
        <script dangerouslySetInnerHTML={{ __html: LANG_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-canvas"
        >
          <L en="Skip to content" ko="본문 바로가기" />
        </a>
        <SiteHeader
          name={site.name}
          shortName={site.shortName}
          logo={site.universityLogo}
          logoAlt={site.university.en}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
