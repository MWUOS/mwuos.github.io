import type { Localized } from "@/lib/content";

export type NavItem = {
  href: string;
  label: Localized;
  /** 하위 메뉴. 데스크톱은 드롭다운, 모바일은 화살표로 펼치는 목록으로 그린다. */
  children?: ReadonlyArray<{ href: string; label: Localized }>;
};

/** 헤더·푸터·모바일 메뉴가 공유하는 단일 정의. 페이지를 추가하면 여기에만 넣는다. */
export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { href: "/research", label: { en: "Research", ko: "연구" } },
  { href: "/publications", label: { en: "Publications", ko: "논문/특허" } },
  {
    // 구성원은 교수·학생 두 페이지로 나뉜다. 상위 메뉴를 누르면 첫 하위 페이지로 간다.
    href: "/members/professor",
    label: { en: "Members", ko: "구성원" },
    children: [
      { href: "/members/professor", label: { en: "Professor", ko: "교수" } },
      { href: "/members/students", label: { en: "Students", ko: "학생" } },
    ],
  },
  { href: "/alumni", label: { en: "Alumni", ko: "졸업생" } },
  { href: "/album", label: { en: "Album", ko: "앨범" } },
];
