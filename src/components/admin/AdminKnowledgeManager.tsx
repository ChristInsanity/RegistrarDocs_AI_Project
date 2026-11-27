"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Loader2,
  Plus,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import type {
  AdminKnowledgeSourceRecord,
  KnowledgeSourceType,
} from "@/lib/db/admin-catalog";

interface AdminKnowledgeManagerProps {
  initialSources: AdminKnowledgeSourceRecord[];
  schemaReady: boolean;
}

const SOURCE_TYPE_LABELS: Record<KnowledgeSourceType, string> = {
  official_document: "Official Document",
  registrar_procedure: "Registrar Procedure",
  document_requirements: "Document Requirements",
  institutional_faq: "Institutional FAQ",
  official_webpage: "Official Webpage",
};

export function AdminKnowledgeManager({
  initialSources,
  schemaReady,
}: AdminKnowledgeManagerProps) {
  const router = useRouter();
  const [sources, setSources] =
    useState<AdminKnowledgeSourceRecord[]>(initialSources);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminKnowledgeSourceRecord | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Registrar Information");
  const [sourceType, setSourceType] =
    useState<KnowledgeSourceType>("official_document");
  const [sourceUrl, setSourceUrl] = useState("");
  const [contentSummary, setContentSummary] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sources;
    return sources.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.contentSummary.toLowerCase().includes(q)
    );
  }, [sources, search]);

  const openCreate = () => {
    setEditing(null);
    setTitle("");
    setCategory("Registrar Information");
    setSourceType("official_document");
    setSourceUrl("");
    setContentSummary("");
    setIsEnabled(true);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (item: AdminKnowledgeSourceRecord) => {
    setEditing(item);
    setTitle(item.title);
    setCategory(item.category);
    setSourceType(item.sourceType);
    setSourceUrl(item.sourceUrl ?? "");
    setContentSummary(item.contentSummary);
    setIsEnabled(item.isEnabled);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setError(null);
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/knowledge-sources", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editing ? { id: editing.id } : {}),
          title,
          category,
          sourceType,
          sourceUrl,
          contentSummary,
          isEnabled,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        source?: AdminKnowledgeSourceRecord;
      } | null;

      if (!res.ok || !data?.source) {
        setError(data?.error || "Unable to save knowledge source.");
        return;
      }

      if (editing) {
        setSources((prev) =>
          prev.map((s) => (s.id === data.source!.id ? data.source! : s))
        );
        setBanner(`Updated "${data.source.title}".`);
      } else {
        setSources((prev) => [data.source!, ...prev]);
        setBanner(`Added approved knowledge source "${data.source.title}".`);
      }
      setModalOpen(false);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (item: AdminKnowledgeSourceRecord) => {
    const res = await fetch("/api/admin/knowledge-sources", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isEnabled: !item.isEnabled }),
    });
    const data = (await res.json().catch(() => null)) as {
      source?: AdminKnowledgeSourceRecord;
    } | null;
    if (res.ok && data?.source) {
      setSources((prev) =>
        prev.map((s) => (s.id === data.source!.id ? data.source! : s))
      );
      router.refresh();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#174D32] uppercase">
            Informational Grounding Foundation
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#25352B]">
            Approved AI Knowledge Sources
          </h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Curate approved DNSC Registrar reference materials for informational
            assistance only.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#174D32] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#246B45]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Approved Source</span>
        </button>
      </div>

      {/* Explicit AI Safety & Scope Guardrail Notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-[#246B45]/25 bg-[#E6EFE8]/60 p-4 text-xs text-[#25352B]">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#174D32]" />
        <div>
          <p className="font-bold text-[#174D32]">
            Informational Assistance Only — AI Governance Policy
          </p>
          <p className="mt-0.5 leading-relaxed text-slate-700">
            Approved knowledge sources are strictly informational. The AI
            assistant cannot approve or reject student registrations, approve or
            reject document requests, change request statuses, or override Staff
            or Admin decisions. Live conversational AI retrieval integration is
            reserved for a dedicated future AI milestone.
          </p>
        </div>
      </div>

      {!schemaReady && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950">
          Run migration <code>0005_admin_management_and_audit.sql</code> in
          Supabase to persist approved AI knowledge sources.
        </div>
      )}

      {banner && (
        <div className="flex items-center gap-2 rounded-xl border border-[#246B45]/30 bg-[#E6EFE8] p-3.5 text-xs font-medium text-[#25352B]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#174D32]" />
          <span>{banner}</span>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search approved sources..."
              className="block w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-xs text-[#25352B] sm:text-sm"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-xs text-slate-500">
            No approved knowledge sources recorded yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((src) => (
              <li key={src.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#E6EFE8] px-2.5 py-0.5 text-[10px] font-bold text-[#174D32] uppercase">
                        {SOURCE_TYPE_LABELS[src.sourceType]}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                        {src.category}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          src.isEnabled
                            ? "bg-[#174D32] text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {src.isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-[#25352B]">
                      {src.title}
                    </h3>
                    <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                      {src.contentSummary}
                    </p>
                    {src.sourceUrl && (
                      <a
                        href={src.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#174D32] hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>{src.sourceUrl}</span>
                      </a>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(src)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold hover:bg-[#E6EFE8]"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleToggle(src)}
                      className="rounded-lg border border-[#174D32]/30 px-2.5 py-1.5 text-xs font-semibold text-[#174D32] hover:bg-[#E6EFE8]"
                    >
                      {src.isEnabled ? "Disable" : "Enable"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#25352B]/55 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-[#25352B]">
                {editing ? "Edit Approved Source" : "Add Approved Source"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 p-6 text-xs">
              <div>
                <label className="block font-semibold text-[#25352B]">
                  Source Title <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Official DNSC Registrar Document Claiming Guidelines"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-[#25352B]">
                    Source Type
                  </label>
                  <select
                    value={sourceType}
                    onChange={(e) =>
                      setSourceType(e.target.value as KnowledgeSourceType)
                    }
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  >
                    {Object.entries(SOURCE_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#25352B]">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#25352B]">
                  Official Reference URL (Optional)
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://dnsc.edu.ph/..."
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#25352B]">
                  Approved Informational Summary{" "}
                  <span className="text-red-700">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={contentSummary}
                  onChange={(e) => setContentSummary(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-[#25352B]">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="h-4 w-4 accent-[#174D32]"
                />
                <span>Enabled as an approved informational source</span>
              </label>
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-red-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#174D32] px-4 py-2 font-semibold text-white hover:bg-[#246B45]"
                >
                  {isSaving && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>Save Source</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
