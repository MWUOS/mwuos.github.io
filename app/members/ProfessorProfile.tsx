import Image from "next/image";

import L from "@/components/L";
import type { Localized, Professor } from "@/lib/content";

type TimelineRow = { key: string; when: string; text: Localized };

/** 기간 | 내용 두 열. 좁은 화면에서는 기간이 위로 올라간다. */
function Timeline({ id, title, rows }: { id: string; title: Localized; rows: TimelineRow[] }) {
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby={id}>
      <h3 id={id} className="border-b border-line pb-2 text-sm font-semibold text-ink">
        <L {...title} />
      </h3>
      <ul className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <li
            key={row.key}
            className="grid gap-x-6 gap-y-0.5 text-sm leading-relaxed sm:grid-cols-[9.5rem_1fr]"
          >
            <span className="tabular-nums text-ink-muted">{row.when}</span>
            {/* 영문이 훨씬 길어 큰 쪽 높이를 잡으면 한국어 화면에 빈 줄이 생긴다. 보이는 언어 높이만 쓴다 */}
            <span className="break-keep text-ink">
              <L {...row.text} fit="inline" />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Professor 페이지 본문 — 사진, 이름·직함, 경력·학력·수상. 언어는 헤더의 전환 버튼을 따른다. */
export default function ProfessorProfile({ professor }: { professor: Professor }) {
  return (
    <div>
      <div className="grid gap-8 md:grid-cols-[14rem_1fr] md:gap-12">
        {professor.photo ? (
          <Image
            src={professor.photo.src}
            alt={`Portrait of ${professor.name.en}`}
            width={professor.photo.width}
            height={professor.photo.height}
            priority
            className="h-auto w-full max-w-56 rounded-lg border border-line"
          />
        ) : null}

        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">
            <L {...professor.name} />
          </h2>
          <p className="mt-1 break-keep text-ink-muted">
            <L {...professor.title} fit="inline" /> &middot; <L {...professor.affiliation} fit="inline" />
          </p>
          {professor.email ? (
            <p className="mt-2 text-sm">
              <a className="text-accent hover:underline" href={`mailto:${professor.email}`}>
                {professor.email}
              </a>
            </p>
          ) : null}

          <div className="mt-10 space-y-10">
            <Timeline
              id="professor-experience"
              title={{ en: "Experience", ko: "경력" }}
              rows={professor.experience.map((row) => ({
                key: row.period,
                when: row.period,
                text: { en: row.en, ko: row.ko },
              }))}
            />
            <Timeline
              id="professor-education"
              title={{ en: "Education", ko: "학력" }}
              rows={professor.education.map((row) => ({
                key: row.period,
                when: row.period,
                text: { en: row.en, ko: row.ko },
              }))}
            />
            <Timeline
              id="professor-awards"
              title={{ en: "Awards", ko: "수상 경력" }}
              rows={professor.awards.map((row, index) => ({
                key: `${row.date}-${index}`,
                when: row.date,
                text: { en: row.en, ko: row.ko },
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
