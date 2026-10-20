import L from "@/components/L";
import type { Patent } from "@/lib/content";

type YearGroup = { year: number; items: Patent[] };

/** 등록 특허를 등록 연도별로 묶는다. 받은 순서(최근 연도 → 등록번호 큰 순)를 그대로 따른다. */
function byYear(patents: Patent[]): YearGroup[] {
  const groups: YearGroup[] = [];
  for (const patent of patents) {
    const last = groups.at(-1);
    if (last?.year === patent.year) last.items.push(patent);
    else groups.push({ year: patent.year, items: [patent] });
  }
  return groups;
}

/**
 * 등록 특허 목록. 명칭은 KIPRIS의 국문·영문 명칭이고,
 * 영문 명칭이 없으면 영어 화면에도 국문 명칭이 나간다 (CLAUDE.md §1).
 */
export default function PatentList({ patents }: { patents: Patent[] }) {
  if (patents.length === 0) {
    return (
      <p className="mt-10 rounded-lg border border-dashed border-line bg-surface px-5 py-12 text-center text-ink-muted">
        <L en="Patents will be listed here." ko="특허 목록이 이곳에 표시됩니다." />
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-12 sm:mt-10">
      {byYear(patents).map((group) => (
        <section key={group.year} aria-labelledby={`patents-${group.year}`}>
          <h2
            id={`patents-${group.year}`}
            className="border-b border-line pb-2 text-xl font-semibold tracking-tight"
          >
            {group.year}
          </h2>
          <ul className="mt-6 space-y-6">
            {group.items.map((patent) => (
              <li key={patent.registrationNo || patent.title}>
                <article>
                  <h3 className="break-words text-base font-medium leading-snug sm:text-lg">
                    <L en={patent.titleEn || patent.title} ko={patent.title} />
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    <L en="Korea" ko="대한민국" fit="inline" />
                    {patent.registrationNo ? (
                      <>
                        {", "}
                        <L en="Reg. No." ko="등록번호" fit="inline" />{" "}
                        <span className="tabular-nums">{patent.registrationNo}</span>
                      </>
                    ) : null}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
