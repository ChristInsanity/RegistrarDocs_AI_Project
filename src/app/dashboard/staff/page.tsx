import type { Metadata } from "next";
import { DashboardPlaceholderShell } from "@/components/dashboard/DashboardPlaceholderShell";
import { requirePageRole } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Staff Dashboard | RegistrarDocs AI",
  description: "Authenticated Registrar staff dashboard placeholder for RegistrarDocs AI.",
};

export default async function StaffDashboardPage() {
  const user = await requirePageRole("staff");

  return (
    <DashboardPlaceholderShell
      user={user}
      roleLabel="Registrar Staff"
      dashboardTitle="Registrar Staff Dashboard"
      description="You are signed in as active Registrar personnel. Document request review and release management tools will be built here in upcoming milestones."
    />
  );
}
