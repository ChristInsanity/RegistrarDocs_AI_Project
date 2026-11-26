import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { DocumentTypeCode } from "@/lib/requester/document-catalog";
import type { DocumentRequestStatus } from "@/types/requester";

export interface StaffRequestRecord {
  id: string;
  referenceNumber: string;
  documentTypeCode: DocumentTypeCode;
  documentType: string;
  purpose: string;
  copies: number;
  additionalNotes: string | null;
  status: DocumentRequestStatus;
  submittedAt: string;
  updatedAt: string;
  requesterName: string;
  requesterStudentId: string | null;
  requesterEmail: string;
}

export interface StaffRequestCounts {
  total: number;
  pending: number;
  processing: number;
  needsCorrection: number;
  readyForRelease: number;
  released: number;
}

export interface StaffTimelineEvent {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface RawStaffRequestRow {
  id: string;
  reference_number: string;
  document_type_code: DocumentTypeCode;
  document_type_name: string;
  purpose: string;
  copies: number;
  additional_notes: string | null;
  status: DocumentRequestStatus;
  submitted_at: string;
  updated_at: string;
  profiles:
    | {
        full_name: string;
        student_id: string | null;
        email: string;
      }
    | {
        full_name: string;
        student_id: string | null;
        email: string;
      }[]
    | null;
}

function mapStaffRow(row: RawStaffRequestRow): StaffRequestRecord {
  const profile = Array.isArray(row.profiles)
    ? (row.profiles[0] ?? null)
    : row.profiles;

  return {
    id: row.id,
    referenceNumber: row.reference_number,
    documentTypeCode: row.document_type_code,
    documentType: row.document_type_name,
    purpose: row.purpose,
    copies: row.copies,
    additionalNotes: row.additional_notes,
    status: row.status,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
    requesterName: profile?.full_name ?? "Unknown Requester",
    requesterStudentId: profile?.student_id ?? null,
    requesterEmail: profile?.email ?? "",
  };
}

export function computeStaffCounts(
  rows: readonly { status: DocumentRequestStatus }[]
): StaffRequestCounts {
  const counts: StaffRequestCounts = {
    total: rows.length,
    pending: 0,
    processing: 0,
    needsCorrection: 0,
    readyForRelease: 0,
    released: 0,
  };

  for (const row of rows) {
    switch (row.status) {
      case "pending":
        counts.pending += 1;
        break;
      case "processing":
        counts.processing += 1;
        break;
      case "needs_correction":
        counts.needsCorrection += 1;
        break;
      case "ready_for_release":
        counts.readyForRelease += 1;
        break;
      case "released":
        counts.released += 1;
        break;
      default:
        break;
    }
  }

  return counts;
}

export async function listStaffDocumentRequests(): Promise<{
  ok: true;
  requests: StaffRequestRecord[];
  counts: StaffRequestCounts;
} | {
  ok: false;
  error: string;
}> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("document_requests")
      .select(
        `
        id,
        reference_number,
        document_type_code,
        document_type_name,
        purpose,
        copies,
        additional_notes,
        status,
        submitted_at,
        updated_at,
        profiles:requester_id (
          full_name,
          student_id,
          email
        )
      `
      )
      .order("submitted_at", { ascending: false });

    if (error) {
      return {
        ok: false,
        error: "Unable to retrieve document request records from the database.",
      };
    }

    const rows = (data ?? []) as unknown as RawStaffRequestRow[];
    const mapped = rows.map(mapStaffRow);
    return {
      ok: true,
      requests: mapped,
      counts: computeStaffCounts(mapped),
    };
  } catch {
    return {
      ok: false,
      error: "Unable to connect to the database to retrieve request statistics.",
    };
  }
}

export async function getStaffDocumentRequestById(
  requestId: string
): Promise<{
  request: StaffRequestRecord;
  timeline: StaffTimelineEvent[];
} | null> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("document_requests")
    .select(
      `
      id,
      reference_number,
      document_type_code,
      document_type_name,
      purpose,
      copies,
      additional_notes,
      status,
      submitted_at,
      updated_at,
      profiles:requester_id (
        full_name,
        student_id,
        email
      )
    `
    )
    .eq("id", requestId)
    .maybeSingle();

  if (error || !data) return null;

  const request = mapStaffRow(data as unknown as RawStaffRequestRow);

  const { data: notifData } = await admin
    .from("notifications")
    .select("id, title, message, created_at")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  const timeline: StaffTimelineEvent[] = (
    (notifData ?? []) as {
      id: string;
      title: string;
      message: string;
      created_at: string;
    }[]
  ).map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    createdAt: n.created_at,
  }));

  return { request, timeline };
}
