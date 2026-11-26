import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";

export async function GET() {
  const auth = await requireApiAuth(["requester"]);
  if (!auth.ok) {
    return auth.response;
  }

  return NextResponse.json(
    {
      profile: {
        id: auth.user.id,
        fullName: auth.user.fullName,
        email: auth.user.email,
        studentId: auth.user.studentId,
        role: auth.user.role,
        status: auth.user.status,
      },
    },
    { status: 200 }
  );
}
