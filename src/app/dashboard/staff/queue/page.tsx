import type { Metadata } from "next";
import { StaffRequestQueueView } from "@/components/staff/StaffRequestQueueView";
import { requirePageRole } from "@/lib/auth/rbac";
import { listStaffDocumentRequests } from "@/lib/db/staff-requests";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Request Queue | Registrar Staff — RegistrarDocs AI",
  description:
    "Read-only overview of submitted DNSC academic document requests for Registrar Staff.",
};

export default async function StaffRequestQueuePage() {
  await requirePageRole("staff");
  const result = await listStaffDocumentRequests();

  return (
    <StaffRequestQueueView
      initialRequests={result.ok ? result.requests : []}
      error={result.ok ? null : result.error}
    />
  );
}
