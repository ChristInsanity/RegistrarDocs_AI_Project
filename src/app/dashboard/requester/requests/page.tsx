import type { Metadata } from "next";
import { RequesterSubpagePlaceholder } from "@/components/requester/RequesterSubpagePlaceholder";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Requests | RegistrarDocs AI",
  description:
    "Track your RegistrarDocs AI document requests and review status history.",
};

export default function MyRequestsPlaceholderPage() {
  return (
    <RequesterSubpagePlaceholder
      badge="Upcoming Milestone"
      title="My Requests"
      description="Your submitted academic document requests, reference numbers, status timelines, and Registrar Staff release updates will appear here once document request submission is implemented."
      workflowNote="You currently have 0 document requests on record. No mock or sample requests are displayed."
    />
  );
}
