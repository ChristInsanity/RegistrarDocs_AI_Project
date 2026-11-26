import type { Metadata } from "next";
import { DashboardPlaceholderShell } from "@/components/dashboard/DashboardPlaceholderShell";
import { requirePageRole } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | RegistrarDocs AI",
  description: "Authenticated administrator dashboard placeholder for RegistrarDocs AI.",
};

export default async function AdminDashboardPage() {
  const user = await requirePageRole("admin");

  return (
    <DashboardPlaceholderShell
      user={user}
      roleLabel="Administrator"
      dashboardTitle="Administrator Dashboard"
      description="You are signed in with administrator privileges. Account approval and Staff user management modules will be built here in upcoming milestones."
    />
  );
}
