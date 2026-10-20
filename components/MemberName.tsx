import L from "@/components/L";
import type { Member } from "@/lib/content";

/**
 * 한국어 이름이 없으면 영문 이름을 양쪽에 쓴다.
 * center는 두 언어 이름을 같은 칸 가운데에 겹쳐 놓는다. 영문이 더 길어도 한국어 이름이 가운데 온다.
 */
export default function MemberName({ member, center = false }: { member: Member; center?: boolean }) {
  return (
    <L en={member.name} ko={member.nameKo || member.name} fit={center ? "center" : "stack"} />
  );
}
