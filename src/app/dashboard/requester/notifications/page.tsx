import type { Metadata } from "next";
import { RequesterSubpagePlaceholder } from "@/components/requester/RequesterSubpagePlaceholder";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notifications | RegistrarDocs AI",
  description:
    "View portal and email notifications for your RegistrarDocs AI document requests.",
};

export default function RequesterNotificationsPlaceholderPage() {
  return (
    <RequesterSubpagePlaceholder
      badge="Upcoming Milestone"
      title="Notifications"
      description="Request status updates, missing requirement notices, processing updates, ready-for-release alerts, and collection instructions will appear here and be sent to your registered DNSC email account."
      workflowNote="You currently have no notifications on record. Email and portal notifications will be enabled in the Notifications milestone."
    />
  );
}
