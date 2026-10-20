import type { Metadata } from "next";

import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { membersByRole, site } from "@/lib/content";

import StudentsContent from "../StudentsContent";

export const metadata: Metadata = {
  title: "Students",
  description: `Students of the ${site.name} at the ${site.university.en}.`,
};

export default function StudentsPage() {
  return (
    <>
      <PageHeader title={{ en: "Students", ko: "학생" }} />

      <Container className="py-12 sm:py-16">
        <StudentsContent groups={membersByRole()} />
      </Container>
    </>
  );
}
