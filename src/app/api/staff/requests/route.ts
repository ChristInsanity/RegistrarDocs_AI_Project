import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import { listStaffDocumentRequests } from "@/lib/db/staff-requests";
import type { AuthErrorCode } from "@/types/auth";

export async function GET() {
  const auth = await requireApiAuth(["staff"]);
  if (!auth.ok) return auth.response;

  const result = await listStaffDocumentRequests();
  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error,
        code: "SERVER_ERROR" satisfies AuthErrorCode,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      requests: result.requests,
      counts: result.counts,
    },
    { status: 200 }
  );
}
