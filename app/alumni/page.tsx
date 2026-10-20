import type { Metadata } from "next";

import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { alumni, site } from "@/lib/content";

import AlumniList from "./AlumniList";

export const metadata: Metadata = {
  title: "Alumni",
  description: `Alumni of the ${site.name} at the ${site.university.en}.`,
};

export default function AlumniPage() {
  return (
    <>
      <PageHeader title={{ en: "Alumni", ko: "졸업생" }} />

      <Container className="py-12 sm:py-16">
        <AlumniList alumni={alumni()} />
      </Container>
    </>
  );
}
