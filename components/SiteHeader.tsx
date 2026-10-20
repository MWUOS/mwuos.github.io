"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Container from "@/components/Container";
import L from "@/components/L";
import LanguageToggle from "@/components/LanguageToggle";
import { NAV_ITEMS, type NavItem } from "@/lib/nav";

/**
 * 사이트 이름·로고는 layout.tsx가 lib/content에서 읽어 넘긴다.
 * 클라이언트 컴포넌트가 콘텐츠 로더를 직접 import하면 JSON 전체가 브라우저로 간다.
 */
export default function SiteHeader({
  name,
  shortName,
  logo,
  logoAlt,
}: {
  name: string;
  shortName: string;
  logo: string | null;
  logoAlt: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // 모바일 메뉴에서 하위 메뉴가 펼쳐진 항목의 href. 처음에는 모두 접혀 있다.
  const [expanded, setExpanded] = useState<string | null>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  // 하위 페이지(예: 구성원 → 학생)에 있을 때도 상위 메뉴를 현재 위치로 표시한다
  const isItemActive = (item: NavItem) =>
    isActive(item.href) || (item.children ?? []).some((child) => isActive(child.href));
  // 모바일 하위 메뉴 id. href의 "/"는 id에 어울리지 않아 "-"로 바꾼다.
  const subMenuId = (item: NavItem) => `mobile-sub${item.href.replace(/\W+/g, "-")}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 leading-tight hover:text-accent"
          aria-label={`${name} home`}
        >
          {logo ? (
            // 원본은 346×160으로 리사이즈해 두었다. 헤더에서는 높이 40px로 그린다.
            <Image
              src={logo}
              alt={logoAlt}
              width={346}
              height={160}
              priority
              className="h-10 w-auto shrink-0"
            />
          ) : null}
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-tight">
              {shortName}
            </span>
            <span className="hidden truncate text-xs text-ink-muted sm:block">{name}</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav aria-label="Main" className="hidden md:block">
            {/* 탭은 모두 같은 폭의 칸(가장 긴 라벨 기준)에 가운데 정렬한다.
                언어를 바꿔도 칸 폭이 그대로라 버튼 위치가 움직이지 않고, 탭 사이 간격도 고르다 */}
            <ul className="grid auto-cols-[1fr] grid-flow-col items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    aria-current={isItemActive(item) ? "page" : undefined}
                    className={`block rounded px-2 py-2 text-center text-sm lg:px-3 transition-colors hover:bg-surface ${
                      isItemActive(item) ? "font-medium text-accent" : "text-ink-muted"
                    }`}
                  >
                    {/* 현재 탭은 굵게 그린다. 굵은 글자 폭을 늘 잡아 두어 탭을 옮겨도 칸 폭이 변하지 않게 한다 */}
                    <span className="inline-grid justify-items-center">
                      <span className="[grid-area:1/1]">
                        <L {...item.label} fit="center" />
                      </span>
                      <span aria-hidden="true" className="invisible [grid-area:1/1] font-medium">
                        <L {...item.label} fit="center" />
                      </span>
                    </span>
                  </Link>
                  {item.children ? (
                    // 마우스를 올리거나 키보드로 초점이 들어오면 펼친다. pt-2는 링크와 메뉴 사이 틈을 메워
                    // 마우스가 내려가는 도중에 메뉴가 닫히지 않게 한다.
                    <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <ul className="min-w-40 rounded-md border border-line bg-canvas py-1 shadow-md">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={isActive(child.href) ? "page" : undefined}
                              className={`block px-4 py-2 text-sm hover:bg-surface hover:text-accent ${
                                isActive(child.href) ? "font-medium text-accent" : "text-ink-muted"
                              }`}
                            >
                              <L {...child.label} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          {/* 언어 전환은 화면 폭과 상관없이 항상 헤더에 보인다 */}
          <LanguageToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 rounded p-2 text-ink-muted hover:bg-surface md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M5 5l12 12" />
                  <path d="M17 5L5 17" />
                </>
              ) : (
                <>
                  <path d="M3 6h16" />
                  <path d="M3 11h16" />
                  <path d="M3 16h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Container>

      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-line md:hidden"
      >
        <Container>
          <ul className="py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isItemActive(item) ? "page" : undefined}
                    className={`block flex-1 rounded px-2 py-3 text-sm hover:bg-surface ${
                      isItemActive(item) ? "font-medium text-accent" : "text-ink-muted"
                    }`}
                  >
                    <L {...item.label} />
                  </Link>
                  {item.children ? (
                    // 링크(페이지 이동)와 펼치기를 분리한다. 화살표만 하위 메뉴를 연다.
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((current) => (current === item.href ? null : item.href))
                      }
                      aria-expanded={expanded === item.href}
                      aria-controls={subMenuId(item)}
                      className="rounded p-3 text-ink-muted hover:bg-surface"
                    >
                      <span className="sr-only">
                        {expanded === item.href
                          ? `Hide ${item.label.en} menu`
                          : `Show ${item.label.en} menu`}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={`transition-transform ${expanded === item.href ? "rotate-180" : ""}`}
                      >
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </button>
                  ) : null}
                </div>
                {item.children ? (
                  <ul
                    id={subMenuId(item)}
                    hidden={expanded !== item.href}
                    className="mb-1 pl-4"
                  >
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive(child.href) ? "page" : undefined}
                          className={`block rounded px-2 py-2.5 text-sm hover:bg-surface ${
                            isActive(child.href) ? "font-medium text-accent" : "text-ink-muted"
                          }`}
                        >
                          <L {...child.label} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
