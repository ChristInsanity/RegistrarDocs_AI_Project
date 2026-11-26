"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Clock,
  Copy,
  FileText,
  Info,
  Loader2,
  User,
  X,
} from "lucide-react";
import {
  REQUEST_STATUS_META,
  RequestStatusBadge,
} from "@/components/requester/RequestStatusBadge";
import type {
  StaffRequestRecord,
  StaffTimelineEvent,
} from "@/lib/db/staff-requests";

interface StaffRequestDetailsModalProps {
  requestId: string;
  onClose: () => void;
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function StaffRequestDetailsModal({
  requestId,
  onClose,
}: StaffRequestDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<StaffRequestRecord | null>(null);
  const [category, setCategory] = useState("Registrar Document");
  const [timeline, setTimeline] = useState<StaffTimelineEvent[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      try {
        const res = await fetch(
          `/api/staff/requests/${encodeURIComponent(requestId)}`,
          { cache: "no-store" }
        );
        if (cancelled) return;

        const data = (await res.json().catch(() => null)) as {
          error?: string;
          request?: StaffRequestRecord;
          category?: string;
          timeline?: StaffTimelineEvent[];
        } | null;

        if (!res.ok || !data?.request) {
          setError(data?.error || "Unable to load request details.");
          setLoading(false);
          return;
        }

        setRequest(data.request);
        setCategory(data.category ?? "Registrar Document");
        setTimeline(data.timeline ?? []);
        setError(null);
      } catch {
        if (!cancelled) {
          setError("A network error occurred while loading request details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDetails();
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCopyRef = async () => {
    if (!request) return;
    try {
      await navigator.clipboard.writeText(request.referenceNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="staff-request-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#25352B]/55 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-wider text-[#174D32] uppercase">
              {request ? `${category} · Read-Only View` : "Request Details"}
            </p>
            <h2
              id="staff-request-details-title"
              className="mt-0.5 truncate text-lg font-bold text-[#25352B] sm:text-xl"
            >
              {request ? request.documentType : "Loading Request..."}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close request details"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-[#E6EFE8] hover:text-[#174D32]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-14 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-[#174D32]" />
              <span>Loading request record...</span>
            </div>
          ) : error || !request ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
              <span>{error || "Document request not found."}</span>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Reference & Status */}
              <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#246B45]/20 bg-[#F5F5EF] p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Request Reference Number
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-[#174D32] sm:text-lg">
                      {request.referenceNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleCopyRef()}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-[#25352B] transition-colors hover:border-[#174D32] hover:bg-[#E6EFE8] hover:text-[#174D32]"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#174D32]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="sm:text-right">
                  <RequestStatusBadge status={request.status} />
                  <p className="mt-1 text-[11px] text-slate-600">
                    {REQUEST_STATUS_META[request.status].description}
                  </p>
                </div>
              </div>

              {/* Requester Details */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#25352B] uppercase">
                  <User className="h-4 w-4 text-[#174D32]" />
                  <span>Requester Information</span>
                </h3>
                <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-3">
                  <div>
                    <dt className="font-semibold text-slate-500">Full Name</dt>
                    <dd className="mt-0.5 font-semibold text-[#25352B]">
                      {request.requesterName}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Student ID</dt>
                    <dd className="mt-0.5 font-semibold text-[#25352B]">
                      {request.requesterStudentId ?? "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">DNSC Email</dt>
                    <dd className="mt-0.5 truncate font-medium text-[#25352B]">
                      {request.requesterEmail || "Not available"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Request Details */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#25352B] uppercase">
                  <FileText className="h-4 w-4 text-[#174D32]" />
                  <span>Submitted Request Details</span>
                </h3>
                <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-slate-500">
                      Date Submitted
                    </dt>
                    <dd className="mt-0.5 font-medium text-[#25352B]">
                      {formatDateTime(request.submittedAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">
                      Last Updated
                    </dt>
                    <dd className="mt-0.5 font-medium text-[#25352B]">
                      {formatDateTime(request.updatedAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">
                      Number of Copies
                    </dt>
                    <dd className="mt-0.5 font-semibold text-[#25352B]">
                      {request.copies}{" "}
                      {request.copies === 1 ? "copy" : "copies"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Purpose</dt>
                    <dd className="mt-0.5 font-medium text-[#25352B]">
                      {request.purpose}
                    </dd>
                  </div>
                  {request.additionalNotes && (
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-slate-500">
                        Additional Details
                      </dt>
                      <dd className="mt-0.5 leading-relaxed text-[#25352B]">
                        {request.additionalNotes}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Recorded Activity */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#25352B] uppercase">
                  <Clock className="h-4 w-4 text-[#174D32]" />
                  <span>Recorded History</span>
                </h3>
                <ol className="mt-3.5 space-y-3 border-l-2 border-[#E6EFE8] pl-4">
                  <li className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#174D32] ring-4 ring-white"
                    />
                    <p className="text-xs font-bold text-[#25352B]">
                      Request Submitted
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {formatDateTime(request.submittedAt)}
                    </p>
                  </li>
                  {timeline
                    .filter((t) => t.title !== "Document Request Submitted")
                    .map((event) => (
                      <li key={event.id} className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#246B45] ring-4 ring-white"
                        />
                        <p className="text-xs font-bold text-[#25352B]">
                          {event.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {formatDateTime(event.createdAt)}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">
                          {event.message}
                        </p>
                      </li>
                    ))}
                </ol>
              </div>

              {/* Read-Only Notice */}
              <div className="flex items-start gap-2 rounded-xl border border-[#246B45]/20 bg-[#E6EFE8]/50 p-3.5 text-xs text-slate-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#174D32]" />
                <span>
                  <strong className="font-semibold text-[#25352B]">
                    Read-Only Overview (Milestone 8):
                  </strong>{" "}
                  Request processing, approval/correction actions, and release
                  recording will be enabled in the next Staff processing
                  milestone.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-slate-100 bg-[#F5F5EF]/60 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#25352B] transition-colors hover:bg-[#E6EFE8] hover:text-[#174D32]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
