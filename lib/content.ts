import { z } from "zod";

import { isTodo } from "@/lib/todo";

import albumJson from "@/content/album.json";
import announcementJson from "@/content/announcement.json";
import membersJson from "@/content/members.json";
import newsJson from "@/content/news.json";
import pastProjectsJson from "@/content/past-projects.json";
import patentsJson from "@/content/patents.json";
import professorJson from "@/content/professor.json";
import publicationsJson from "@/content/publications.json";
import researchJson from "@/content/research.json";
import siteJson from "@/content/site.json";

/* ---------------------------------------------------------------------------
 * 이 파일이 콘텐츠 형식의 정본이다 (CLAUDE.md §4-3).
 * 컴포넌트는 content 아래 JSON을 직접 import하지 않고 여기서 내보낸 값만 쓴다.
 * ------------------------------------------------------------------------- */

/**
 * CLAUDE.md §4-2 — 모르는 값은 지어내지 말고 "TODO: ..."로 남긴다.
 * 스키마가 그 관례를 허용하므로 미확정 상태에서도 빌드가 통과하고,
 * 실제 값이 들어오면 TODO 문자열이 자연스럽게 사라진다.
 */
const todo = z.string().regex(/^TODO:/);

const emailField = z.union([z.email(), todo, z.literal("")]).default("");
const urlField = z.union([z.url(), todo, z.literal("")]).default("");
const pathOrUrl = z
  .union([z.string().startsWith("/"), z.url(), z.literal("")])
  .default("");
const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, "YYYY-MM 형식이어야 한다");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 한다");

/* ---------- 구성원 ---------- */

export const MEMBER_ROLES = [
  "pi",
  "postdoc",
  "phd",
  "ms",
  "undergrad",
  "staff",
  "alumni",
] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number];

/** 화면에 그릴 때 쓰는 섹션 제목이자 표시 순서 (CLAUDE.md §6). Members는 한/영 전환이 있다. */
export const MEMBER_ROLE_LABEL: Record<MemberRole, { en: string; ko: string }> = {
  pi: { en: "Principal Investigator", ko: "책임교수" },
  postdoc: { en: "Postdoctoral Researchers", ko: "박사후연구원" },
  phd: { en: "Ph.D. Course", ko: "박사과정" },
  ms: { en: "M.S. Course", ko: "석사과정" },
  undergrad: { en: "B.S. Course", ko: "학부과정" },
  staff: { en: "Staff", ko: "연구원" },
  alumni: { en: "Alumni", ko: "졸업생" },
};

const memberSchema = z.object({
  id: z.string().min(1),
  /** 영문 이름. 사이트 기본 표기이자 논문 저자 강조에 쓰인다. */
  name: z.string().min(1),
  /** 한국어 화면에서 쓰는 이름. 비어 있으면 영문 이름을 쓴다. */
  nameKo: z.string().default(""),
  role: z.enum(MEMBER_ROLES),
  title: z.string().default(""),
  photo: z.string().startsWith("/").nullable().default(null),
  email: emailField,
  interests: z.array(z.string()).default([]),
  links: z
    .object({
      scholar: urlField,
      github: urlField,
      linkedin: urlField,
      homepage: urlField,
    })
    .partial()
    .default({}),
  joined: yearMonth.nullable().default(null),
  left: yearMonth.nullable().default(null),
});

export type Member = z.infer<typeof memberSchema>;

/* ---------- 논문 ---------- */

export const PUBLICATION_TYPES = [
  "journal",
  "conference",
  "preprint",
  "patent",
  "thesis",
] as const;

export type PublicationType = (typeof PUBLICATION_TYPES)[number];

export const PUBLICATION_TYPE_LABEL: Record<PublicationType, { en: string; ko: string }> = {
  journal: { en: "Journal", ko: "저널" },
  conference: { en: "Conference", ko: "학술대회" },
  preprint: { en: "Preprint", ko: "프리프린트" },
  patent: { en: "Patent", ko: "특허" },
  thesis: { en: "Thesis", ko: "학위논문" },
};

const publicationSchema = z.object({
  id: z.string().min(1),
  type: z.enum(PUBLICATION_TYPES),
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  venue: z.string().default(""),
  year: z.number().int().min(1900).max(2200),
  volume: z.string().default(""),
  pages: z.string().default(""),
  doi: z.string().default(""),
  url: urlField,
  pdf: pathOrUrl,
  code: urlField,
  award: z.string().nullable().default(null),
  /** 게재 당시 SCI(E) 등재 저널이면 true. 저널 배지 옆에 SCI(E) 배지가 붙는다. */
  sci: z.boolean().default(false),
  highlight: z.boolean().default(false),
});

export type Publication = z.infer<typeof publicationSchema>;

/* ---------- 연구 분야 · 소식 · 사이트 ---------- */

/**
 * 사이트는 영어 기본이고 헤더에서 한국어로 전환할 수 있다 (CLAUDE.md §1).
 * 연구실 이름과 논문 본문(제목·저자·게재지)을 뺀 화면 텍스트는 en/ko를 함께 담는다.
 */
export const LANGS = ["en", "ko"] as const;
export type Lang = (typeof LANGS)[number];

const localizedText = z.object({ en: z.string().min(1), ko: z.string().min(1) });
const localizedList = z.object({
  en: z.array(z.string().min(1)).default([]),
  ko: z.array(z.string().min(1)).default([]),
});

export type Localized = z.infer<typeof localizedText>;
export type LocalizedList = z.infer<typeof localizedList>;

// width·height는 실제 파일 크기. 레이아웃이 이미지 로딩 전에 자리를 잡게 한다.
const researchImageSchema = z.object({
  src: z.string().startsWith("/"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(1),
  /** 연구 페이지에서 사진 아래 붙는 짧은 설명(무슨 사진인지). 없으면 사진만 나온다. */
  caption: localizedText.nullable().default(null),
});

/** 진행 중인 과제 하나. 끝나면 research.json에서 빼고 past-projects.json으로 옮긴다. */
const researchProjectSchema = z.object({
  id: z.string().min(1),
  title: localizedText,
  points: localizedList.default({ en: [], ko: [] }),
  image: researchImageSchema.nullable().default(null),
});

export type ResearchProject = z.infer<typeof researchProjectSchema>;

/**
 * 연구 분야(큰 주제). 홈에는 주제만, 연구 페이지에는 주제 아래 진행 중인 과제가 나온다.
 * 과제는 바뀌어도 주제는 오래 가도록 잡는다. 진행 중인 과제가 없는 주제도 둘 수 있다.
 */
const researchThemeSchema = z.object({
  id: z.string().min(1),
  title: localizedText,
  /** 홈 카드와 연구 페이지에 나가는 한두 문장 설명. */
  summary: localizedText,
  /**
   * 주제 자체의 사진. 진행 과제가 없어 과제 그림을 빌려 올 수 없는 주제에 쓴다.
   * 연구 페이지에서는 설명 아래에 모두 나오고, 홈 카드에는 앞의 세 장을 모아 보여 준다.
   */
  images: z.array(researchImageSchema).default([]),
  /** 그림이 하나도 없을 때 카드에 대신 보여 줄 핵심어. */
  keywords: z.array(z.string().min(1)).default([]),
  projects: z.array(researchProjectSchema).default([]),
});

export type ResearchTheme = z.infer<typeof researchThemeSchema>;
export type ResearchImage = z.infer<typeof researchImageSchema>;

/** 홈 카드에 쓸 주제 그림 — 주제에 따로 정한 사진들, 없으면 그림이 있는 첫 과제의 그림 하나. */
export function themeImages(theme: ResearchTheme): ResearchImage[] {
  if (theme.images.length > 0) return theme.images;
  const image = theme.projects.find((project) => project.image)?.image;
  return image ? [image] : [];
}

/*
 * 특허. 연구 분야와 따로 둔다 — 분야를 정리해도 특허 목록은 흔들리지 않아야 하고,
 * 특허가 꼭 한 분야(과제)에서만 나오는 것도 아니다.
 *
 * 정본은 KIPRIS(특허청) 기록이다. title·titleEn은 KIPRIS의 발명의 명칭(국문·영문)이고,
 * titleEn은 대소문자만 읽기 쉽게 정리하며 철자는 고치지 않는다 — 공식 명칭이기 때문이다.
 * 아직 공개 전이라 영문 명칭이 없으면 titleEn을 비워 두고, 영어 화면에도 국문 명칭이 나간다.
 * year는 등록된 특허면 등록 연도, 출원 중이면 출원 연도.
 */
const patentSchema = z.object({
  title: z.string().min(1),
  titleEn: z.string().default(""),
  status: z.enum(["filed", "registered"]),
  year: z.number().int().min(1900).max(2200),
  /** KIPRIS 출원번호(10-YYYY-NNNNNNN). 공개 전 출원은 비워 둔다. */
  applicationNo: z
    .string()
    .regex(/^10-\d{4}-\d{7}$/, "출원번호는 10-YYYY-NNNNNNN 형식이어야 한다")
    .or(z.literal(""))
    .default(""),
  /** KIPRIS 등록번호(10-NNNNNNN). 등록된 특허만. */
  registrationNo: z
    .string()
    .regex(/^10-\d{7}$/, "등록번호는 10-NNNNNNN 형식이어야 한다")
    .or(z.literal(""))
    .default(""),
});

export type Patent = z.infer<typeof patentSchema>;

/** Research 맨 아래 "Past Projects" 목록. 날짜는 원문 표기(YYYY.MM.DD) 그대로, 최근 과제부터 그린다. */
// 기간을 아직 모르는 과제는 지어내지 않고 "TODO: ..."로 둔다 (§4-2). 화면에 표시가 남는다.
const pastProjectDate = z.union([
  z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/, "YYYY.MM.DD 형식이어야 한다"),
  todo,
]);
const pastProjectSchema = z.object({
  start: pastProjectDate,
  end: pastProjectDate,
  title: localizedText,
});

export type PastProject = z.infer<typeof pastProjectSchema>;

/* ---------- 교수 소개 ---------- */

/** 경력·학력·수상 한 줄. period/date는 원문 표기 그대로 둔다(예: "2002.03 – Present"). */
const localizedEntry = z.object({
  en: z.string().min(1),
  ko: z.string().min(1),
});

const professorSchema = z.object({
  name: localizedText,
  title: localizedText,
  affiliation: localizedText,
  email: emailField,
  photo: z
    .object({
      src: z.string().startsWith("/"),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .nullable()
    .default(null),
  interests: localizedList.default({ en: [], ko: [] }),
  experience: z.array(localizedEntry.extend({ period: z.string().min(1) })).default([]),
  education: z.array(localizedEntry.extend({ period: z.string().min(1) })).default([]),
  awards: z.array(localizedEntry.extend({ date: z.string().min(1) })).default([]),
});

export type Professor = z.infer<typeof professorSchema>;

/* ---------- 홈 공지(홍보) ---------- */

/**
 * 홈 히어로 바로 아래에 붙는 공지 카드.
 * JSON 배열 순서대로 위에서부터 쌓인다. 모집이 끝나면 enabled를 false로 바꾸면 카드가 사라진다.
 */
const announcementSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean().default(false),
  badge: localizedText.nullable().default(null),
  title: localizedText,
  target: localizedText.nullable().default(null),
  details: z.array(z.object({ label: localizedText, value: localizedText })).default([]),
  // 카드 아래 버튼들. href는 사이트 안 경로("/research/") 또는 메일 주소("mailto:...")
  actions: z
    .array(
      z.object({
        label: localizedText,
        href: z
          .string()
          .refine(
            (href) => href.startsWith("/") || href.startsWith("mailto:"),
            "href는 /로 시작하는 사이트 안 경로이거나 mailto: 주소여야 한다",
          ),
      }),
    )
    .default([]),
});

export type Announcement = z.infer<typeof announcementSchema>;

/* ---------- 앨범 ---------- */

/** 날짜는 Past Projects와 같은 점 표기. 일까지 모르면 월까지만 적는다. */
const albumDate = z
  .string()
  .regex(/^\d{4}\.\d{2}(\.\d{2})?$/, "YYYY.MM 또는 YYYY.MM.DD 형식이어야 한다");

/**
 * 학회·행사 하나에 사진 여러 장. 사진은 public/images/album/ 아래에 둔다.
 * alt는 다른 이미지와 마찬가지로 영문만 쓴다 (CLAUDE.md §1). 설명(caption)은 한/영 한 쌍.
 */
const albumEventSchema = z.object({
  id: z.string().min(1),
  title: localizedText,
  date: albumDate,
  photos: z
    .array(
      z.object({
        src: z.string().startsWith("/images/album/", "사진은 public/images/album/ 아래에 둔다"),
        alt: z.string().min(1),
        caption: localizedText.nullable().default(null),
      }),
    )
    .min(1),
});

export type AlbumEvent = z.infer<typeof albumEventSchema>;

const newsItemSchema = z.object({
  id: z.string().min(1),
  date: isoDate,
  title: z.string().min(1),
  body: z.string().default(""),
  link: urlField,
});

export type NewsItem = z.infer<typeof newsItemSchema>;

const siteSchema = z.object({
  /** 연구실 이름은 헤더·홈 제목에서 한국어 화면에도 영문으로 쓰고, nameKo는 푸터의 한국어 화면에만 쓴다 (CLAUDE.md §0). */
  name: z.string().min(1),
  shortName: z.string().min(1),
  nameKo: z.string().default(""),
  department: localizedText,
  university: localizedText,
  /** 헤더 로고 영역 왼쪽에 붙는 학교 로고. 비워 두면 그리지 않는다. */
  universityLogo: z.string().startsWith("/").nullable().default(null),
  /** 홈 히어로의 소개 문장. 연구 분야가 바뀌면 함께 고친다. */
  tagline: localizedText.nullable().default(null),
  /**
   * 홈 히어로 배경 사진. 글자는 어두운 덮개 위에 흰색으로 올라간다.
   * credit은 사진 출처(학교 홍보 사진 등)를 밝힐 때만 적는다.
   */
  heroImage: z
    .object({
      src: z.string().startsWith("/"),
      alt: z.string().min(1),
      credit: localizedText.nullable().default(null),
    })
    .nullable()
    .default(null),
  email: emailField,
  phone: z.string().default(""),
  /** 주소 줄. 언어마다 줄 순서·개수가 달라서 목록으로 담는다. */
  address: localizedList.default({ en: [], ko: [] }),
  links: z
    .object({
      github: urlField,
      scholar: urlField,
      university: urlField,
    })
    .partial()
    .default({}),
});

export type Site = z.infer<typeof siteSchema>;

/* ---------------------------------------------------------------------------
 * 로딩 — 형식이 어긋나면 빌드를 실패시킨다.
 * 깨진 데이터가 그대로 배포되는 것보다 빌드가 멈추는 편이 낫다.
 * ------------------------------------------------------------------------- */

function parse<S extends z.ZodType>(schema: S, data: unknown, file: string): z.infer<S> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  const detail = result.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  throw new Error(`content/${file} 형식이 스키마와 맞지 않습니다:\n${detail}`);
}

export const site: Site = parse(siteSchema, siteJson, "site.json");

/**
 * 검색 결과용 소개(영문) — tagline 그대로. 메타데이터는 언어 전환이 없어 영문만 쓴다.
 * tagline이 아직 미확정이면 null — 쓰는 쪽이 소속 정보로 대체한다 (§4-2).
 */
export function siteSummary(): string | null {
  if (site.tagline === null || isTodo(site.tagline.en)) return null;
  return site.tagline.en;
}

const allMembers: Member[] = parse(z.array(memberSchema), membersJson, "members.json");
const allPublications: Publication[] = parse(
  z.array(publicationSchema),
  publicationsJson,
  "publications.json",
);
/** 연구 분야. JSON에 적은 순서대로 보여 준다 — 연구실이 내세우고 싶은 순서가 있다. */
export const researchThemes: ResearchTheme[] = parse(
  z.array(researchThemeSchema),
  researchJson,
  "research.json",
);
/**
 * 시작일 내림차순, 같으면 종료일 내림차순. JSON 배열 순서에 의존하지 않는다 (CLAUDE.md §6).
 * YYYY.MM.DD는 문자열로 비교해도 날짜 순서와 같다.
 */
export const pastProjects: PastProject[] = parse(
  z.array(pastProjectSchema),
  pastProjectsJson,
  "past-projects.json",
).sort((a, b) => b.start.localeCompare(a.start) || b.end.localeCompare(a.end));
const allPatents: Patent[] = parse(z.array(patentSchema), patentsJson, "patents.json");

/**
 * 최근 연도 순. 같은 해에서는 등록 → 출원, 등록끼리는 등록번호가 큰(나중에 등록된) 순.
 * JSON 배열 순서에 의존하지 않는다 (CLAUDE.md §6).
 */
export function patents(): Patent[] {
  const statusOrder = { registered: 0, filed: 1 } as const;
  return [...allPatents].sort(
    (a, b) =>
      b.year - a.year ||
      statusOrder[a.status] - statusOrder[b.status] ||
      b.registrationNo.localeCompare(a.registrationNo),
  );
}
const allNews: NewsItem[] = parse(z.array(newsItemSchema), newsJson, "news.json");
export const professor: Professor = parse(professorSchema, professorJson, "professor.json");
const allAnnouncements: Announcement[] = parse(
  z.array(announcementSchema),
  announcementJson,
  "announcement.json",
);

/** 켜져 있는 공지만, JSON 순서 그대로 돌려준다. */
export function activeAnnouncements(): Announcement[] {
  return allAnnouncements.filter((item) => item.enabled);
}

const allAlbumEvents: AlbumEvent[] = parse(z.array(albumEventSchema), albumJson, "album.json");

/** 최근 행사 순. 날짜가 같으면 JSON 순서를 유지한다. */
export function albumEvents(): AlbumEvent[] {
  return [...allAlbumEvents].sort((a, b) => b.date.localeCompare(a.date));
}

/* ---------------------------------------------------------------------------
 * 정렬·그룹핑 — JSON 배열 순서에 의존하지 않는다 (CLAUDE.md §6).
 * ------------------------------------------------------------------------- */

/**
 * joined 오름차순. joined가 비어 있는 항목은 뒤로 보낸다.
 * joined가 같으면(둘 다 비어 있는 경우 포함) JSON에 적힌 순서를 유지한다 — sort는 안정 정렬이다.
 */
function byJoined(a: Member, b: Member): number {
  if (a.joined === b.joined) return 0;
  if (a.joined === null) return 1;
  if (b.joined === null) return -1;
  return a.joined.localeCompare(b.joined);
}

/** 재직 중인 구성원을 역할 순서대로 묶는다. 비어 있는 역할은 빠진다. */
export function membersByRole(): Array<{
  role: MemberRole;
  label: { en: string; ko: string };
  members: Member[];
}> {
  return MEMBER_ROLES.filter((role) => role !== "alumni")
    .map((role) => ({
      role,
      label: MEMBER_ROLE_LABEL[role],
      members: allMembers.filter((m) => m.role === role).sort(byJoined),
    }))
    .filter((group) => group.members.length > 0);
}

/** 졸업생. 최근에 떠난 순서. */
export function alumni(): Member[] {
  return allMembers
    .filter((m) => m.role === "alumni")
    .sort(
      (a, b) =>
        (b.left ?? "").localeCompare(a.left ?? "") || a.name.localeCompare(b.name),
    );
}

function byYearThenType(a: Publication, b: Publication): number {
  if (a.year !== b.year) return b.year - a.year;
  const order = PUBLICATION_TYPES.indexOf(a.type) - PUBLICATION_TYPES.indexOf(b.type);
  return order !== 0 ? order : a.title.localeCompare(b.title);
}

export function publications(): Publication[] {
  return [...allPublications].sort(byYearThenType);
}

/** 연도 내림차순으로 묶는다. */
export function publicationsByYear(): Array<{ year: number; items: Publication[] }> {
  const years = [...new Set(allPublications.map((p) => p.year))].sort((a, b) => b - a);
  return years.map((year) => ({
    year,
    items: allPublications.filter((p) => p.year === year).sort(byYearThenType),
  }));
}

/** 목록에 실제로 등장하는 타입만 돌려준다. 필터 UI가 빈 항목을 보이지 않게 하기 위함. */
export function publicationTypesInUse(): PublicationType[] {
  const used = new Set(allPublications.map((p) => p.type));
  return PUBLICATION_TYPES.filter((t) => used.has(t));
}

/** 홈 화면 노출용. highlight가 하나도 없으면 최신 논문으로 대체한다. */
export function highlightedPublications(limit = 3): Publication[] {
  const flagged = publications().filter((p) => p.highlight);
  return (flagged.length > 0 ? flagged : publications()).slice(0, limit);
}

export function news(): NewsItem[] {
  return [...allNews].sort((a, b) => b.date.localeCompare(a.date));
}

export function recentNews(limit = 3): NewsItem[] {
  return news().slice(0, limit);
}

export { isTodo };
