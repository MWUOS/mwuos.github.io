import type { Metadata } from "next";

import Container from "@/components/Container";
import L from "@/components/L";
import PageHeader from "@/components/PageHeader";
import {
  patents,
  publicationTypesInUse,
  publicationsByYear,
  site,
  type Localized,
  type PublicationType,
} from "@/lib/content";

import PublicationSections, { type Section } from "./PublicationSections";

/** 위쪽 구분 탭의 이름. 논문 종류마다 하나씩, 실제로 있는 종류만 탭이 된다. */
const SECTION_LABEL: Record<PublicationType, Localized> = {
  journal: { en: "Journal Papers", ko: "저널 논문" },
  conference: { en: "Conference Papers", ko: "학술대회 논문" },
  preprint: { en: "Preprints", ko: "프리프린트" },
  patent: { en: "Patents", ko: "특허" },
  thesis: { en: "Theses", ko: "학위논문" },
};

/** 설명에는 TODO가 섞이면 안 되므로 확정된 소속 정보만 조합한다. */
export const metadata: Metadata = {
  title: "Publications",
  description: `Journal papers and registered patents from the ${site.name}, ${site.department.en}, ${site.university.en}.`,
};

export default function PublicationsPage() {
  const groups = publicationsByYear();

  const paperSections: Section[] = publicationTypesInUse().map((type) => {
    const typeGroups = groups
      .map((group) => ({ year: group.year, items: group.items.filter((p) => p.type === type) }))
      .filter((group) => group.items.length > 0);
    return {
      id: type,
      kind: "papers",
      label: SECTION_LABEL[type],
      count: typeGroups.reduce((sum, group) => sum + group.items.length, 0),
      groups: typeGroups,
    };
  });

  // 특허는 등록된 것만 싣는다. 출원 중인 특허는 patents.json에 기록으로만 둔다.
  const registered = patents().filter((patent) => patent.status === "registered");
  const sections: Section[] = [
    ...paperSections,
    ...(registered.length > 0
      ? [
          {
            id: "patents",
            kind: "patents",
            label: { en: "Patents", ko: "등록 특허" },
            count: registered.length,
            patents: registered,
          } satisfies Section,
        ]
      : []),
  ];

  return (
    <>
      <PageHeader title={{ en: "Publications", ko: "논문/특허" }} />

      <Container className="py-12 sm:py-16">
        {sections.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-surface px-5 py-12 text-center text-ink-muted">
            <L en="Publications will be listed here." ko="논문 목록이 이곳에 표시됩니다." />
          </p>
        ) : (
          <PublicationSections sections={sections} />
        )}
      </Container>
    </>
  );
}
