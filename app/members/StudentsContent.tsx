import Image from "next/image";

import L from "@/components/L";
import type { Member, MemberRole } from "@/lib/content";

import MemberName from "@/components/MemberName";

type RoleGroup = { role: MemberRole; label: { en: string; ko: string }; members: Member[] };

/**
 * 학생 한 명 — 세로 3:4 사진과 이름. 사진은 증명사진처럼 얼굴이 위에 오도록 위쪽 기준으로 자른다.
 * 사진이 없으면 같은 크기의 빈 칸에 사람 모양을 옅게 그려 줄이 흐트러지지 않게 한다.
 */
function MemberCard({ member }: { member: Member }) {
  return (
    <>
      <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-line bg-surface">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`Portrait of ${member.name}`}
            fill
            sizes="(min-width: 1024px) 180px, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover object-top"
          />
        ) : (
          <svg
            viewBox="0 0 64 64"
            fill="currentColor"
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 mx-auto h-3/4 w-3/4 text-ink-muted/20"
          >
            <circle cx="32" cy="22" r="12" />
            <path d="M8 64c0-14 10.7-24 24-24s24 10 24 24z" />
          </svg>
        )}
      </div>
      <p className="mt-3 text-center font-semibold leading-snug">
        <MemberName member={member} center />
      </p>
    </>
  );
}

/**
 * Students 페이지 본문 — 과정별(박사·석사·학부) 사진 카드. 졸업생은 /alumni 페이지에 따로 있다.
 * 언어는 헤더의 전환 버튼을 따른다.
 */
export default function StudentsContent({ groups }: { groups: RoleGroup[] }) {
  return (
    <div>
      {groups.length === 0 ? (
        <p className="text-ink-muted">
          <L en="No students are listed yet." ko="등록된 학생이 아직 없습니다." />
        </p>
      ) : (
        <div className="space-y-14">
          {groups.map((group) => (
            <section key={group.role} aria-labelledby={`role-${group.role}`}>
              <h2
                id={`role-${group.role}`}
                className="border-b border-line pb-3 text-lg font-semibold tracking-tight sm:text-xl"
              >
                <L {...group.label} />
              </h2>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-5">
                {group.members.map((member) => (
                  <li key={member.id}>
                    <MemberCard member={member} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
