import { Fragment, type ReactNode } from "react";

import ContentText from "@/components/ContentText";
import L from "@/components/L";
import { isTodo, type Localized, type Publication } from "@/lib/content";

type EntryLink = { key: string; label: Localized; href: string };
type CitationPart = { key: string; node: ReactNode };

/** 빈 문자열인 필드는 링크로 그리지 않는다. */
function entryLinks(publication: Publication): EntryLink[] {
  const links: EntryLink[] = [];

  // doi에는 식별자만 담기고(예: "10.1109/TAP.2026.1234"), 주소는 여기서 만든다.
  if (publication.doi) {
    links.push({
      key: "doi",
      label: { en: "DOI", ko: "DOI" },
      href: `https://doi.org/${publication.doi}`,
    });
  }
  // 출판사 페이지(url)는 목록에 따로 걸지 않는다. DOI 링크가 같은 곳으로 간다.
  if (publication.pdf) links.push({ key: "pdf", label: { en: "PDF", ko: "PDF" }, href: publication.pdf });
  if (publication.code) {
    links.push({ key: "code", label: { en: "Code", ko: "코드" }, href: publication.code });
  }

  return links;
}

/**
 * 게재 정보 한 줄. 채워진 필드만 쉼표로 잇는다.
 * volume·pages에는 번호만 들어온다고 보고 "vol." "pp." 표기를 여기서 붙인다.
 */
function citationParts(publication: Publication): CitationPart[] {
  const parts: CitationPart[] = [];

  if (publication.venue) {
    parts.push({
      key: "venue",
      node: (
        <span className="italic">
          <ContentText value={publication.venue} />
        </span>
      ),
    });
  }
  if (publication.volume) {
    parts.push({ key: "volume", node: <>vol. {publication.volume}</> });
  }
  if (publication.pages) {
    parts.push({ key: "pages", node: <>pp. {publication.pages}</> });
  }
  parts.push({ key: "year", node: <>{publication.year}</> });

  return parts;
}

/** 논문 한 건. 목록 항목 안에서 쓰이므로 제목은 h3다 (연도가 h2). */
export default function PublicationEntry({ publication }: { publication: Publication }) {
  const parts = citationParts(publication);
  const links = entryLinks(publication);

  // 제목이 아직 TODO면 그 문자열을 링크 이름으로 읽히게 두지 않는다.
  const linkContext = isTodo(publication.title) ? "this publication" : publication.title;

  // 논문 종류는 위의 구분 탭(Journal Papers 등)이 이미 말해 주므로 배지로 다시 적지 않는다
  const hasBadges = publication.sci || Boolean(publication.award);

  return (
    <article>
      {hasBadges ? (
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {publication.sci ? (
            <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
              SCI(E)
            </span>
          ) : null}
          {publication.award ? (
            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
              <ContentText value={publication.award} />
            </span>
          ) : null}
        </div>
      ) : null}

      <h3 className="break-words text-base font-medium leading-snug sm:text-lg">
        <ContentText value={publication.title} />
      </h3>

      {/* 저자는 게재된 순서·표기 그대로, 모두 같은 굵기로 적는다 */}
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
        {publication.authors.map((author, index) => (
          <Fragment key={`${author}-${index}`}>
            {index > 0 ? ", " : null}
            <ContentText value={author} />
          </Fragment>
        ))}
      </p>

      <p className="mt-1 text-sm text-ink-muted">
        {parts.map((part, index) => (
          <Fragment key={part.key}>
            {index > 0 ? ", " : null}
            {part.node}
          </Fragment>
        ))}
      </p>

      {links.length > 0 ? (
        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
          {links.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${link.label.en} for ${linkContext}`}
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                <L {...link.label} fit="center" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
