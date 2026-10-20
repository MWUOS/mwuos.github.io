"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import type { Publication } from "@/lib/content";

import PublicationEntry from "./PublicationEntry";

type YearGroup = { year: number; items: Publication[] };

function tabClass(selected: boolean): string {
  return [
    "shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition-colors",
    selected
      ? "border-accent font-medium text-accent"
      : "border-transparent text-ink-muted hover:border-line hover:text-ink",
  ].join(" ");
}

/** 2024 → 2020 */
function decadeOf(year: number): number {
  return Math.floor(year / 10) * 10;
}

/**
 * 10년 단위 탭과 연도별 목록. 논문이 많아 한 페이지에 다 펼치면 너무 길어서
 * 한 번에 한 구간만 보여 준다. 탭은 논문 연도에서 만들므로 논문이 있는 연대만 생기고,
 * 새 연대의 논문이 추가되면 탭도 저절로 늘어난다.
 * 논문 종류(저널·학술대회)는 위의 PublicationSections가 나누고, 여기에는 한 종류만 들어온다.
 * 상호작용이 필요한 부분만 클라이언트로 내리고, 데이터 로딩·정렬은 page.tsx(서버)가 맡는다.
 */
export default function PublicationBrowser({ groups }: { groups: YearGroup[] }) {
  // 최근 연대가 앞에 온다. 처음에는 첫 탭이 열린다.
  const tabs = [...new Set(groups.map((group) => decadeOf(group.year)))]
    .sort((a, b) => b - a)
    .map((decade) => ({
      id: `${decade}s`,
      decade,
      count: groups
        .filter((group) => decadeOf(group.year) === decade)
        .reduce((sum, group) => sum + group.items.length, 0),
    }));

  const [periodId, setPeriodId] = useState(tabs[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const current = tabs.find((tab) => tab.id === periodId) ?? tabs[0];

  const visible = groups.filter(
    (group) => current === undefined || decadeOf(group.year) === current.decade,
  );

  /** WAI-ARIA 탭 패턴: 좌우 화살표·Home·End로 탭을 옮기고 바로 연다. */
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];
    if (next === undefined) return;

    event.preventDefault();
    setPeriodId(tabs[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      {tabs.length > 1 ? (
        // 좁은 화면에서는 탭 줄만 옆으로 넘긴다(스크롤 막대는 감춘다). 페이지 전체는 넘치지 않는다.
        // 바닥선은 안쪽 그림자로 그린다. 테두리를 밖으로 겹치면 1px 세로 스크롤이 생긴다.
        <div
          role="tablist"
          aria-label="Publications by period / 연도 구간"
          className="flex overflow-x-auto overflow-y-hidden shadow-[inset_0_-1px_0_var(--line)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab, index) => {
            const isSelected = tab.id === current?.id;
            return (
              <button
                key={tab.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`publications-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls="publications-panel"
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setPeriodId(tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={tabClass(isSelected)}
              >
                {/* "2020s (24)" — 연대와 그 연대에 실린 논문 수. 두 언어 모두 같은 표기 */}
                <span className="tabular-nums">
                  {tab.id} ({tab.count})
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        id="publications-panel"
        role={tabs.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={
          tabs.length > 1 && current ? `publications-tab-${current.id}` : undefined
        }
      >
        <div className="mt-8 space-y-12 sm:mt-10">
          {visible.map((group) => (
            <section key={group.year} aria-labelledby={`publications-${group.year}`}>
              <h2
                id={`publications-${group.year}`}
                className="border-b border-line pb-2 text-xl font-semibold tracking-tight"
              >
                {group.year}
              </h2>
              <ul className="mt-6 space-y-8">
                {group.items.map((publication) => (
                  <li key={publication.id}>
                    <PublicationEntry publication={publication} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
