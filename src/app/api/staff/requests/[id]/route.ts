import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/rbac";
import { getStaffDocumentRequestById } from "@/lib/db/staff-requests";
import { getDocumentCatalogItem } from "@/lib/requester/document-catalog";
import type { AuthErrorCode } from "@/types/auth";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(["staff"]);
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json(
      {
        error: "Document request not found.",
        code: "VALIDATION_ERROR" satisfies AuthErrorCode,
      },
      { status: 404 }
    );
  }

  try {
    const result = await getStaffDocumentRequestById(id);
    if (!result) {
      return NextResponse.json(
        {
          error: "Document request not found.",
          code: "VALIDATION_ERROR" satisfies AuthErrorCode,
        },
        { status: 404 }
      );
    }

    const catalogItem = getDocumentCatalogItem(result.request.documentTypeCode);

    return NextResponse.json(
      {
        request: result.request,
        category: catalogItem?.category ?? "Registrar Document",
        timeline: result.timeline,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load document request details right now.",
        code: "SERVER_ERROR" satisfies AuthErrorCode,
      },
      { status: 500 }
    );
  }
}
