import type { RequesterDashboardData } from "@/types/requester";

/**
 * Loads requester-scoped dashboard overview data for the authenticated user.
 *
 * Document request submission/tracking and notifications belong to upcoming
 * milestones; until those Supabase tables and workflows are implemented, this
 * returns truthful zero counts and empty lists (no mock or fabricated records).
 */
export async function getRequesterDashboardData(
  requesterId: string
): Promise<RequesterDashboardData> {
  // Explicitly scoped to the authenticated requester ID for future queries
  void requesterId;

  return {
    counts: {
      total: 0,
      pending: 0,
      processing: 0,
      readyForRelease: 0,
    },
    recentRequests: [],
    notifications: [],
    requestsModuleEnabled: false,
    notificationsModuleEnabled: false,
  };
}
