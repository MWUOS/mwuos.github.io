"use client";

import { useRef, useState, type KeyboardEvent } from "react";

import L from "@/components/L";
import type { Localized, Patent, Publication } from "@/lib/content";

import PatentList from "./PatentList";
import PublicationBrowser from "./PublicationBrowser";

type YearGroup = { year: number; items: Publication[] };

export type Section =
  | { id: string; kind: "papers"; label: Localized; count: number; groups: YearGroup[] }
  | { id: string; kind: "patents"; label: Localized; count: number; patents: Patent[] };

function sectionClass(selected: boolean): string {
  return [
    "rounded-md px-4 py-2 text-sm transition-colors",
    selected
      ? "bg-canvas font-medium text-accent shadow-sm"
      : "text-ink-muted hover:text-ink",
  ].join(" ");
}

/**
 * 맨 위 구분 — Journal Papers · (Conference Papers) · Patents. 한 번에 한 구분만 그린다.
 * 논문 구분 안에서는 PublicationBrowser가 연대 탭과 연도별 목록을 맡는다.
 */
export default function PublicationSections({ sections }: { sections: Section[] }) {
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = sections.find((section) => section.id === sectionId) ?? sections[0];

  /** WAI-ARIA 탭 패턴: 좌우 화살표·Home·End로 옮기고 바로 연다. */
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = sections.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];
    if (next === undefined) return;

    event.preventDefault();
    setSectionId(sections[next].id);
    buttonRefs.current[next]?.focus();
  }

  if (current === undefined) return null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Publications and patents / 논문·특허"
        className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-line bg-surface p-1"
      >
        {sections.map((section, index) => {
          const isSelected = section.id === current.id;
          return (
            <button
              key={section.id}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              id={`section-tab-${section.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls="section-panel"
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSectionId(section.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={sectionClass(isSelected)}
            >
              <L {...section.label} fit="inline" />{" "}
              <span className="tabular-nums">({section.count})</span>
            </button>
          );
        })}
      </div>

      <div
        id="section-panel"
        role="tabpanel"
        aria-labelledby={`section-tab-${current.id}`}
        className="mt-8"
      >
        {current.kind === "papers" ? (
          // key로 구분이 바뀔 때 연대 탭 선택을 처음 상태로 돌린다
          <PublicationBrowser key={current.id} groups={current.groups} />
        ) : (
          <PatentList patents={current.patents} />
        )}
      </div>
    </div>
  );
}
