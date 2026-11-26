import type { Metadata } from "next";
import { DocumentCatalogAndRequestFlow } from "@/components/requester/DocumentCatalogAndRequestFlow";
import { requirePageRole } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Request a Document | RegistrarDocs AI",
  description:
    "Browse available DNSC Registrar's Office document types, review requirements, and submit a document request.",
};

export default async function RequestDocumentPage() {
  const user = await requirePageRole("requester");
  return <DocumentCatalogAndRequestFlow user={user} />;
}
