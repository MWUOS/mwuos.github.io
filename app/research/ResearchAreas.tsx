import Image from "next/image";

import ContentText from "@/components/ContentText";
import L, { LBlock } from "@/components/L";
import type { PastProject, ResearchImage, ResearchProject, ResearchTheme } from "@/lib/content";
import { isTodo } from "@/lib/todo";

function Points({ points }: { points: string[] }) {
  if (points.length === 0) return null;
  return (
    <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 leading-relaxed break-keep text-ink-muted marker:text-accent">
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  );
}

/** 사진 아래 한 줄 설명. 좁은 칸(모바일 3열)에서도 읽히게 작은 글씨로 줄바꿈을 허용한다. */
function ImageCaption({ image }: { image: ResearchImage }) {
  if (!image.caption) return null;
  return (
    <figcaption className="mt-2 break-keep text-center text-xs leading-snug text-ink-muted sm:text-sm">
      <L {...image.caption} />
    </figcaption>
  );
}

/** 주제 아래 진행 중인 과제 하나 — 과제명, 내용, 그림. */
function ProjectArticle({ project }: { project: ResearchProject }) {
  return (
    <article
      id={project.id}
      // 헤더가 sticky라 앵커로 이동했을 때 제목이 가려지지 않게 여백을 준다
      className="scroll-mt-24 py-8 first:pt-0 last:pb-0"
    >
      <div className="grid gap-6 md:grid-cols-5 md:gap-10">
        <div className={project.image ? "md:col-span-3" : "md:col-span-5"}>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            <L en="Current project" ko="진행 과제" fit="inline" />
          </p>
          <h3 className="mt-1 break-keep text-lg font-semibold leading-snug tracking-tight">
            <L {...project.title} />
          </h3>
          <LBlock
            en={<Points points={project.points.en} />}
            ko={<Points points={project.points.ko} />}
          />
        </div>

        {project.image ? (
          <figure className="md:col-span-2">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              className="h-auto w-full rounded-md border border-line"
            />
            <ImageCaption image={project.image} />
          </figure>
        ) : null}
      </div>
    </article>
  );
}

/**
 * 연구 분야(큰 주제)와 그 아래 진행 중인 과제, 맨 아래 과거 프로젝트.
 * 언어는 헤더의 전환 버튼을 따른다(CSS로 전환).
 */
export default function ResearchAreas({
  themes,
  pastProjects,
}: {
  themes: ResearchTheme[];
  pastProjects: PastProject[];
}) {
  return (
    <div>
      <div className="space-y-16 sm:space-y-20">
        {themes.map((theme) => (
          <section
            key={theme.id}
            id={theme.id}
            aria-labelledby={`${theme.id}-title`}
            className="scroll-mt-24"
          >
            <h2
              id={`${theme.id}-title`}
              className="border-b border-line pb-3 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              <L {...theme.title} />
            </h2>
            <p className="mt-4 max-w-3xl break-keep leading-relaxed text-ink-muted">
              <L {...theme.summary} />
            </p>

            {theme.images.length > 0 ? (
              // 사진마다 비율이 달라 같은 세로형 틀에 맞춰 잘라 한 줄로 고르게 놓는다
              <ul className="mt-8 grid max-w-3xl grid-cols-3 gap-2 sm:gap-4">
                {theme.images.map((image) => (
                  <li key={image.src}>
                    <figure>
                      <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-line">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 768px) 250px, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <ImageCaption image={image} />
                    </figure>
                  </li>
                ))}
              </ul>
            ) : null}

            {theme.projects.length > 0 ? (
              <div className="mt-8 divide-y divide-line">
                {theme.projects.map((project) => (
                  <ProjectArticle key={project.id} project={project} />
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>

      {pastProjects.length > 0 ? (
        // 기본은 접힌 상태. <details>라 키보드·스크린리더 지원이 따로 필요 없다.
        <details className="group mt-16 border-b border-ink-muted sm:mt-20">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
            <h2 className="text-xl font-semibold tracking-tight text-accent sm:text-2xl">
              <L en="Past Projects" ko="과거 프로젝트" />
            </h2>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 text-ink-muted transition-transform group-open:rotate-180"
            >
              <path d="M5 8l5 5 5-5" />
            </svg>
          </summary>

          <ul className="divide-y divide-line border-t border-line pb-2">
            {pastProjects.map((project) => (
              <li
                key={`${project.start}-${project.title.en}`}
                className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                {/* 영문 과제명이 훨씬 길어 큰 쪽 높이를 잡으면 한국어 화면에 빈 줄이 생긴다. 보이는 언어 높이만 쓴다 */}
                <span className="break-keep leading-relaxed text-ink">
                  <L {...project.title} fit="inline" />
                </span>
                <span className="shrink-0 text-sm tabular-nums text-ink-muted">
                  {/* 기간을 모르면 TODO 하나만 눈에 띄게 보여 준다 */}
                  {isTodo(project.start) || isTodo(project.end) ? (
                    <ContentText value={isTodo(project.start) ? project.start : project.end} />
                  ) : (
                    <>
                      {project.start} – {project.end}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
