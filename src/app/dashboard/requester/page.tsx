import type { Metadata } from "next";
import { HelpfulInformationSection } from "@/components/requester/HelpfulInformationSection";
import { RecentRequestsSection } from "@/components/requester/RecentRequestsSection";
import { RequesterNotificationsCard } from "@/components/requester/RequesterNotificationsCard";
import { RequesterWelcomeBanner } from "@/components/requester/RequesterWelcomeBanner";
import { RequestOverviewCards } from "@/components/requester/RequestOverviewCards";
import { requirePageRole } from "@/lib/auth/rbac";
import { getRequesterDashboardData } from "@/lib/requester/dashboard-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Requester Dashboard | RegistrarDocs AI",
  description:
    "Centralized DNSC RegistrarDocs AI dashboard for requesting academic documents, tracking request progress, and viewing release notifications.",
};

export default async function RequesterDashboardPage() {
  const user = await requirePageRole("requester");
  const dashboardData = await getRequesterDashboardData(user.id);

  return (
    <div className="space-y-6">
      <RequesterWelcomeBanner user={user} />

      <RequestOverviewCards
        counts={dashboardData.counts}
        requestsModuleEnabled={dashboardData.requestsModuleEnabled}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RecentRequestsSection
            requests={dashboardData.recentRequests}
            requestsModuleEnabled={dashboardData.requestsModuleEnabled}
          />
        </div>
        <div className="lg:col-span-5">
          <RequesterNotificationsCard
            notifications={dashboardData.notifications}
            notificationsModuleEnabled={dashboardData.notificationsModuleEnabled}
          />
        </div>
      </div>

      <HelpfulInformationSection />
    </div>
  );
}
