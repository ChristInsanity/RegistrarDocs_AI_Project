import type { Metadata } from "next";
import { RequesterSubpagePlaceholder } from "@/components/requester/RequesterSubpagePlaceholder";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Request a Document | RegistrarDocs AI",
  description:
    "Document request submission destination for approved RegistrarDocs AI requesters.",
};

export default function RequestDocumentPlaceholderPage() {
  return (
    <RequesterSubpagePlaceholder
      badge="Upcoming Milestone"
      title="Request a Document"
      description="Online academic document selection, requirement checklists, and request submission with automatic reference-number assignment will be available here."
      workflowNote="All submitted document requests will be routed to Registrar Staff for review, preparation, identity verification, and official release recording."
    />
  );
}
