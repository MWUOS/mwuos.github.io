import L from "@/components/L";
import MemberName from "@/components/MemberName";
import type { Member } from "@/lib/content";

/** 졸업생 목록 — 이름과 진로 정보(title)만. 최근에 졸업한 순서로 받는다. */
export default function AlumniList({ alumni }: { alumni: Member[] }) {
  if (alumni.length === 0) {
    return (
      <p className="text-ink-muted">
        <L en="No alumni are listed yet." ko="등록된 졸업생이 아직 없습니다." />
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {alumni.map((member) => (
        <li
          key={member.id}
          className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
        >
          <span className="font-medium">
            <MemberName member={member} />
          </span>
          {member.title ? (
            <span className="text-sm text-ink-muted sm:text-right">{member.title}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
