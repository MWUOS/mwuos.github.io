import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ContactDetails, { hasContactDetails } from "@/components/ContactDetails";
import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import L from "@/components/L";
import {
  activeAnnouncements,
  PUBLICATION_TYPE_LABEL,
  highlightedPublications,
  isTodo,
  recentNews,
  researchThemes,
  themeImages,
  site,
  siteSummary,
  type Announcement,
  type Localized,
  type NewsItem,
  type Publication,
  type ResearchTheme,
} from "@/lib/content";

/**
 * 검색 결과에 "TODO:"가 나가면 안 되므로 tagline이 미확정인 동안에는 소속으로 대체한다.
 * layout.tsx가 기본 description에 쓰는 처리와 같은 이유다 (CLAUDE.md §4-2, §7).
 */
const description =
  siteSummary() ??
  `Research areas and selected publications from ${site.name} (${site.shortName}) at the ${site.department.en}, ${site.university.en}.`;

export const metadata: Metadata = {
  // 홈만 "Home — IMEC" 대신 전체 명칭을 쓴다. 루트 페이지의 title이 곧 검색 결과 제목이다.
  title: { absolute: `${site.name} — ${site.university.en}` },
  description,
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * "YYYY-MM-DD"를 직접 잘라 쓴다.
 * toLocaleDateString은 서버와 브라우저의 로캘·시간대가 달라 하이드레이션 불일치를 만든다.
 */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const name = MONTH_NAMES[Number(month) - 1];
  return name ? `${name} ${Number(day)}, ${year}` : iso;
}

/** 비어 있거나 아직 미확정("TODO: ...")인 주소는 링크로 만들지 않는다. */
function externalHref(value: string): string | null {
  return value !== "" && !isTodo(value) ? value : null;
}

/** 섹션 제목과 전체 목록 링크. 세 섹션이 같은 형태를 쓰도록 한곳에 모아 둔다. */
function SectionHeading({
  id,
  title,
  href,
  linkLabel,
}: {
  id: string;
  title: Localized;
  href: string;
  linkLabel: Localized;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
      <h2 id={id} className="text-xl font-semibold tracking-tight sm:text-2xl">
        <L {...title} />
      </h2>
      <Link href={href} className="text-sm text-accent hover:underline">
        <L {...linkLabel} fit="inline" /> <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}

/**
 * 연구 분야(큰 주제) 카드 — 대표 그림, 번호, 이름, 한 줄 설명. 카드 전체가 연구 페이지의
 * 해당 주제로 가는 링크다. 그림이 하나면 과제의 도식·시뮬레이션이라 잘라내지 않고 통째로 담고,
 * 여러 장이면 주제 사진이라 첫 장을 크게, 나머지 두 장을 옆에 채워 모자이크로 보여 준다.
 * 그림이 없는 주제는 핵심어 타일로 자리를 채워 카드 높이를 맞춘다.
 */
function ResearchThemeCard({ theme, index }: { theme: ResearchTheme; index: number }) {
  const images = themeImages(theme).slice(0, 3);
  const [first] = images;

  return (
    <Link
      href={`/research#${theme.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-canvas transition-colors hover:border-accent"
    >
      <div className="relative aspect-[16/9] border-b border-line bg-canvas">
        {images.length > 1 ? (
          <div className="grid h-full grid-cols-3 grid-rows-2 gap-0.5">
            {images.map((image, i) => (
              <div
                key={image.src}
                className={`relative ${i === 0 ? "col-span-2 row-span-2" : images.length === 2 ? "row-span-2" : ""}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 640px) 360px, 66vw" : "(min-width: 640px) 180px, 33vw"}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : first ? (
          <Image
            src={first.src}
            alt={first.alt}
            fill
            sizes="(min-width: 640px) 480px, 100vw"
            className="object-contain p-3"
          />
        ) : (
          <ul
            aria-hidden="true"
            className="flex h-full flex-wrap content-center items-center justify-center gap-2 bg-accent-soft p-6"
          >
            {theme.keywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-full border border-accent/30 bg-canvas px-3 py-1 text-sm font-medium text-accent"
              >
                {keyword}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tabular-nums text-accent">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-1 break-keep text-lg font-semibold leading-snug tracking-tight group-hover:text-accent">
          <L {...theme.title} />
        </h3>
        <p className="mt-2 break-keep text-sm leading-relaxed text-ink-muted">
          <L {...theme.summary} />
        </p>
        <p className="mt-auto pt-4 text-sm font-medium text-accent">
          <L en="Learn more" ko="자세히 보기" fit="inline" /> <span aria-hidden="true">&rarr;</span>
        </p>
      </div>
    </Link>
  );
}

/**
 * 모집 공지 카드 — 상태 표시, 제목, 조건 표, 링크 순. 연구 분야 카드와 같은 테두리 카드를 쓰되
 * 색을 채운 상자·둥근 버튼은 쓰지 않는다. 상태(badge)는 점 하나와 작은 글씨로만 표시한다.
 */
function AnnouncementCard({ item, className = "" }: { item: Announcement; className?: string }) {
  const linkClass = "text-accent hover:underline";

  return (
    <article className={`flex flex-col rounded-lg border border-line bg-canvas p-6 sm:p-7 ${className}`}>
      {item.badge ? (
        <p className="flex items-center gap-2 text-xs font-semibold text-accent">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          <L {...item.badge} fit="inline" />
        </p>
      ) : null}
      <h3
        className={`break-keep text-xl font-semibold leading-snug tracking-tight ${item.badge ? "mt-2" : ""}`}
      >
        <L {...item.title} />
      </h3>
      {item.target ? (
        <p className="mt-1 break-keep text-sm text-ink-muted">
          <L {...item.target} />
        </p>
      ) : null}

      {item.details.length > 0 ? (
        // 카드가 좁아지는 구간(md~lg)에서는 항목명을 값 위로 올린다
        <dl className="mt-5 divide-y divide-line border-t border-line text-sm">
          {item.details.map((detail) => (
            <div
              key={detail.label.en}
              className="grid gap-x-4 gap-y-0.5 py-3 sm:grid-cols-[9rem_1fr] md:grid-cols-1 lg:grid-cols-[9rem_1fr]"
            >
              <dt className="text-ink-muted">
                <L {...detail.label} />
              </dt>
              <dd className="break-keep">
                <L {...detail.value} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {item.actions.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-5 text-sm font-medium">
          {item.actions.map((action) => {
            const content = (
              <>
                <L {...action.label} fit="inline" /> <span aria-hidden="true">&rarr;</span>
              </>
            );
            return (
              <li key={action.href}>
                {/* 사이트 안 경로는 Link로, mailto: 주소는 일반 링크로 */}
                {action.href.startsWith("/") ? (
                  <Link href={action.href} className={linkClass}>
                    {content}
                  </Link>
                ) : (
                  <a href={action.href} className={linkClass}>
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </article>
  );
}

/** 논문 제목·저자·게재지는 번역하지 않는다. 타입 라벨만 전환된다. */
function PublicationItem({ item }: { item: Publication }) {
  const href = externalHref(item.url);

  return (
    <article>
      <p className="text-xs uppercase tracking-wide text-ink-muted">
        <L {...PUBLICATION_TYPE_LABEL[item.type]} fit="inline" /> &middot; {item.year}
      </p>

      <h3 className="mt-1 font-medium leading-snug">
        {href ? (
          <a className="hover:text-accent" href={href} target="_blank" rel="noreferrer">
            <ContentText value={item.title} />
          </a>
        ) : (
          <ContentText value={item.title} />
        )}
      </h3>

      {/* 저자는 게재된 순서·표기 그대로, 모두 같은 굵기로 적는다 */}
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
        {item.authors.map((author, index) => (
          <span key={`${item.id}-author-${index}`}>
            {index > 0 ? ", " : null}
            <ContentText value={author} />
          </span>
        ))}
      </p>

      {item.venue ? (
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          <ContentText value={item.venue} />
        </p>
      ) : null}

      {item.award ? (
        <p className="mt-2">
          <span className="inline-block rounded bg-accent-soft px-2 py-0.5 text-xs text-accent">
            <ContentText value={item.award} />
          </span>
        </p>
      ) : null}
    </article>
  );
}

function NewsRow({ item }: { item: NewsItem }) {
  const href = externalHref(item.link);

  return (
    <article className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
      <time dateTime={item.date} className="shrink-0 text-sm text-ink-muted sm:w-40">
        {formatDate(item.date)}
      </time>
      <h3 className="font-medium leading-snug">
        {href ? (
          <a className="hover:text-accent" href={href} target="_blank" rel="noreferrer">
            <ContentText value={item.title} />
          </a>
        ) : (
          <ContentText value={item.title} />
        )}
      </h3>
    </article>
  );
}

export default function HomePage() {
  const announcements = activeAnnouncements();
  const selectedPublications = highlightedPublications(3);
  const latestNews = recentNews(3);

  return (
    <>
      {/* 히어로 — 홈은 PageHeader를 쓰지 않고 여기서 h1을 그린다. */}
      <section className="relative isolate overflow-hidden border-b border-line bg-ink">
        {site.heroImage ? (
          <Image
            src={site.heroImage.src}
            alt={site.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
        ) : null}
        {/* 사진의 가장 밝은 곳(하늘) 위에서도 흰 글자 대비가 4.5:1 이상 나오도록 고르게 덮는다 (§7) */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/65" />

        <Container className="py-20 sm:py-28">
          <p className="text-sm text-canvas">
            <L {...site.department} fit="inline" /> &middot; <L {...site.university} fit="inline" />
          </p>
          {/* 연구실 이름은 한국어 화면에서도 영문 그대로 둔다 */}
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-canvas sm:text-5xl">
            {site.name}
          </h1>
          {site.tagline ? (
            <p className="mt-5 max-w-2xl break-keep text-lg leading-relaxed text-canvas">
              <L {...site.tagline} />
            </p>
          ) : null}
        </Container>

        {site.heroImage?.credit ? (
          <p className="absolute bottom-2 right-3 text-[11px] text-canvas">
            <L {...site.heroImage.credit} fit="inline" />
          </p>
        ) : null}
      </section>

      {announcements.length > 0 ? (
        // 옅은 바탕 띠로 히어로·연구 분야 사이에서 한 덩어리로 보이게 한다
        <section aria-labelledby="home-openings" className="border-b border-line bg-surface">
          <Container className="py-14 sm:py-20">
            <h2
              id="home-openings"
              className="border-b border-line pb-3 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              <L en="Open Positions" ko="모집 안내" />
            </h2>
            {/*
              넓은 화면에서 두 칸. 두 번째 공지를 두 줄 높이로 세우면 첫 공지 아래 남는 칸에
              연락처 카드가 자동으로 들어가 좌우 높이가 맞는다. 좁은 화면에서는 공지 → 연락처 순.
            */}
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {announcements.map((item, index) => (
                <AnnouncementCard
                  key={item.id}
                  item={item}
                  className={index === 1 && hasContactDetails() ? "md:row-span-2" : ""}
                />
              ))}
              {/* 지원 문의는 공고마다 링크를 두지 않고 한 번만 적는다 */}
              {hasContactDetails() ? (
                <div className="rounded-lg border border-line bg-canvas p-6 sm:p-7">
                  <h3 className="text-sm font-semibold">
                    <L en="Contact" ko="연락처" />
                  </h3>
                  <ContactDetails className="mt-3 space-y-1.5 text-sm text-ink-muted" />
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      {/* 아래 세 섹션은 데이터가 없으면 통째로 빠진다. 제목만 남은 빈 섹션을 만들지 않는다. */}
      {researchThemes.length > 0 ? (
        <section aria-labelledby="home-research">
          <Container className="py-14 sm:py-20">
            <SectionHeading
              id="home-research"
              title={{ en: "Research", ko: "연구 분야" }}
              href="/research"
              linkLabel={{ en: "All research areas", ko: "연구 분야 전체 보기" }}
            />
            {/* 주제가 4개라 넓은 화면에서 2×2로 놓는다 */}
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {researchThemes.map((theme, index) => (
                <li key={theme.id}>
                  <ResearchThemeCard theme={theme} index={index} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {selectedPublications.length > 0 ? (
        <section aria-labelledby="home-publications">
          <Container className="py-14 sm:py-20">
            <SectionHeading
              id="home-publications"
              title={{ en: "Selected Publications", ko: "주요 논문" }}
              href="/publications"
              linkLabel={{ en: "All publications", ko: "논문 전체 보기" }}
            />
            <ul className="mt-6 divide-y divide-line">
              {selectedPublications.map((item) => (
                <li key={item.id} className="py-5">
                  <PublicationItem item={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* News 페이지는 소식이 생길 때까지 숨겨 두었다(app/_news). news.json이 비어 있어 이 섹션도 그려지지 않는다.
          소식을 넣을 때는 폴더명을 app/news로 되돌리고 lib/nav.ts에 메뉴를 다시 추가한다. */}
      {latestNews.length > 0 ? (
        <section aria-labelledby="home-news">
          <Container className="py-14 sm:py-20">
            <SectionHeading
              id="home-news"
              title={{ en: "Recent news", ko: "최근 소식" }}
              href="/news"
              linkLabel={{ en: "All news", ko: "소식 전체 보기" }}
            />
            <ul className="mt-6 divide-y divide-line">
              {latestNews.map((item) => (
                <li key={item.id} className="py-4">
                  <NewsRow item={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
